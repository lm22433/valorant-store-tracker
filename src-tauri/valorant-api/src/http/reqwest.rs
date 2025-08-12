use crate::http::{HttpClient, HttpError, HttpMethod, HttpRequest, HttpResponse};
use async_trait::async_trait;

pub struct ReqwestHttpClient {
	client: reqwest::Client,
}

impl ReqwestHttpClient {
	pub fn new() -> Result<Self, HttpError> {
		let client = reqwest::Client::builder()
			.build()
			.map_err(|e| HttpError::Network(e.to_string()))?;
		Ok(Self { client })
	}

    pub fn with_builder(builder: reqwest::ClientBuilder) -> Result<Self, HttpError> {
        let client = builder.build().map_err(|e| HttpError::Network(e.to_string()))?;
        Ok(Self { client })
    }

    pub fn with_client(client: reqwest::Client) -> Self {
        Self { client }
    }
}

fn to_reqwest_method(method: &HttpMethod) -> reqwest::Method {
	match method {
		HttpMethod::Get => reqwest::Method::GET,
		HttpMethod::Post => reqwest::Method::POST,
		HttpMethod::Put => reqwest::Method::PUT,
		HttpMethod::Delete => reqwest::Method::DELETE,
		HttpMethod::Patch => reqwest::Method::PATCH,
		HttpMethod::Options => reqwest::Method::OPTIONS,
		HttpMethod::Head => reqwest::Method::HEAD,
	}
}

#[async_trait]
impl HttpClient for ReqwestHttpClient {
	async fn execute_request(&self, request: HttpRequest) -> Result<HttpResponse, HttpError> {
		let method = to_reqwest_method(&request.method);
		let mut req = self.client.request(method, &request.url);

		for (name, value) in &request.headers {
			let hname = reqwest::header::HeaderName::from_bytes(name.as_bytes())
				.map_err(|e| HttpError::Network(format!("invalid header name: {e}")))?;
			let hvalue = reqwest::header::HeaderValue::from_str(value)
				.map_err(|e| HttpError::Network(format!("invalid header value for {name}: {e}")))?;
			req = req.header(hname, hvalue);
		}

		if let Some(body) = request.body {
			req = req.body(body);
		}

		let resp = req
			.send()
			.await
			.map_err(|e| HttpError::Network(e.to_string()))?;

		let status = resp.status().as_u16();
		let headers: Vec<(String, String)> = resp
			.headers()
			.iter()
			.map(|(k, v)| {
				let val = v.to_str().unwrap_or("").to_string();
				(k.as_str().to_string(), val)
			})
			.collect();
		let bytes = resp
			.bytes()
			.await
			.map_err(|e| HttpError::Network(e.to_string()))?
			.to_vec();

		if !(200..300).contains(&status) {
			let body_text = String::from_utf8_lossy(&bytes).to_string();
			return Err(HttpError::Status(status, body_text));
		}

		Ok(HttpResponse {
			status,
			headers,
			body: bytes,
		})
	}
}

