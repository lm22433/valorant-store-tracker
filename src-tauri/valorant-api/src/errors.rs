use thiserror::Error;

use crate::http::HttpError;

#[derive(Debug, Error)]
pub enum ValorantApiError {
    #[error("HTTP error: {0}")]
    Http(#[from] HttpError),

    #[error("Serialization error: {0}")]
    Serde(#[from] serde_json::Error),

    #[error("Invalid configuration: {0}")]
    Config(String),

    #[error("Unauthorized or missing credentials")] 
    Unauthorized,

    #[error("Forbidden")] 
    Forbidden,

    #[error("Not Found")] 
    NotFound,

    #[error("Rate limited")] 
    RateLimited,

    #[error("Unexpected status {status}: {body}")]
    UnexpectedStatus { status: u16, body: String },

    #[error("Other: {0}")]
    Other(String),
}
