use async_trait::async_trait;
use serde::de::DeserializeOwned;
use thiserror::Error;

#[cfg(feature = "reqwest")]
pub mod reqwest;

pub enum HttpMethod {
    Get, Post, Put, Delete, Patch, Options, Head
}

impl HttpMethod {
    pub fn as_str(&self) -> &'static str {
        match self {
            HttpMethod::Get => "GET",
            HttpMethod::Post => "POST",
            HttpMethod::Put => "PUT",
            HttpMethod::Delete => "DELETE",
            HttpMethod::Patch => "PATCH",
            HttpMethod::Options => "OPTIONS",
            HttpMethod::Head => "HEAD",
        }
    }
}

pub struct HttpRequest {
    pub method: HttpMethod,
    pub url: String,
    pub headers: Vec<(String, String)>,
    pub body: Option<Vec<u8>>,
}

pub struct HttpResponse {
    pub status: u16,
    pub headers: Vec<(String, String)>,
    pub body: Vec<u8>,
}

#[derive(Debug, Error)]
pub enum HttpError {
    #[error("network error: {0}")]
    Network(String),
    #[error("http status {0}: {1}")]
    Status(u16, String),
    #[error("json serialize error: {0}")]
    JsonSerialize(String),
    #[error("json deserialize error: {0}")]
    JsonDeserialize(String),
}

pub struct RequestBuilder<'a, C: HttpClient> {
    client: &'a C,
    method: HttpMethod,
    url: String,
    headers: Vec<(String, String)>,
    body: Option<Vec<u8>>,
}

impl<'a, C: HttpClient> RequestBuilder<'a, C> {
    pub fn new(client: &'a C, method: HttpMethod, url: impl Into<String>) -> Self {
        Self {
            client,
            method,
            url: url.into(),
            headers: Vec::new(),
            body: None,
        }
    }

    pub fn header(mut self, name: impl Into<String>, value: impl Into<String>) -> Self {
        self.headers.push((name.into(), value.into()));
        self
    }

    pub fn bearer_auth(mut self, token: impl AsRef<str>) -> Self {
        let value = format!("Bearer {}", token.as_ref());
        let auth_key = "Authorization";
        if let Some(pos) = self.headers.iter().position(|(k, _)| k.eq_ignore_ascii_case(auth_key)) {
            self.headers[pos] = (auth_key.to_string(), value);
        } else {
            self.headers.push((auth_key.to_string(), value));
        }
        self
    }

    pub fn content_type(mut self, mime: impl Into<String>) -> Self {
        let key = "Content-Type".to_string();
        let value = mime.into();
        if let Some(pos) = self.headers.iter().position(|(k, _)| k.eq_ignore_ascii_case(&key)) {
            self.headers[pos] = (key, value);
        } else {
            self.headers.push((key, value));
        }
        self
    }

    pub fn json<T: serde::Serialize>(self, value: &T) -> Self {
        self.try_json(value)
            .expect("failed to serialize request body as JSON")
    }

    pub fn try_json<T: serde::Serialize>(mut self, value: &T) -> Result<Self, HttpError> {
        let body = serde_json::to_vec(value)
            .map_err(|e| HttpError::JsonSerialize(e.to_string()))?;
        self.body = Some(body);

        let key = "Content-Type";
        let ct_val = "application/json".to_string();
        if let Some(pos) = self.headers.iter().position(|(k, _)| k.eq_ignore_ascii_case(key)) {
            self.headers[pos] = (key.to_string(), ct_val);
        } else {
            self.headers.push((key.to_string(), ct_val));
        }

        Ok(self)
    }

    pub async fn send(self) -> Result<HttpResponse, HttpError> {
        let req = HttpRequest {
            method: self.method,
            url: self.url,
            headers: self.headers,
            body: self.body,
        };
        self.client.execute_request(req).await
    }
}

impl HttpResponse {
    pub fn status(&self) -> u16 { self.status }
    pub fn is_success(&self) -> bool { (200..300).contains(&self.status) }
    pub fn text(&self) -> String { String::from_utf8_lossy(&self.body).to_string() }
    pub fn json<T: DeserializeOwned>(&self) -> Result<T, HttpError> {
        serde_json::from_slice::<T>(&self.body)
            .map_err(|e| HttpError::JsonDeserialize(e.to_string()))
    }
}

#[async_trait]
pub trait HttpClient: Send + Sync {
    async fn execute_request(&self, request: HttpRequest) -> Result<HttpResponse, HttpError>;

    fn request(&self, method: HttpMethod, url: impl Into<String>) -> RequestBuilder<'_, Self>
    where
        Self: Sized,
    {
        RequestBuilder::new(self, method, url)
    }

    fn get(&self, url: impl Into<String>) -> RequestBuilder<'_, Self>
    where
        Self: Sized,
    { self.request(HttpMethod::Get, url) }

    fn post(&self, url: impl Into<String>) -> RequestBuilder<'_, Self>
    where
        Self: Sized,
    { self.request(HttpMethod::Post, url) }

    fn put(&self, url: impl Into<String>) -> RequestBuilder<'_, Self>
    where
        Self: Sized,
    { self.request(HttpMethod::Put, url) }

    fn delete(&self, url: impl Into<String>) -> RequestBuilder<'_, Self>
    where
        Self: Sized,
    { self.request(HttpMethod::Delete, url) }

    fn patch(&self, url: impl Into<String>) -> RequestBuilder<'_, Self>
    where
        Self: Sized,
    { self.request(HttpMethod::Patch, url) }
}
