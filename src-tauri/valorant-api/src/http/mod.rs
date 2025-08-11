#[cfg(feature = "reqwest")]
pub mod reqwest;

#[cfg(feature = "tokio")]
pub mod tokio;

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
    
}

pub struct HttpResponse {

}

pub enum HttpError {
    
}

pub trait HttpClient {
    async fn execute_request(&self, request: HttpRequest) -> Result<HttpResponse, HttpError>;
}
