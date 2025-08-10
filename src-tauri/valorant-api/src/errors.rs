use thiserror::Error;

#[derive(Debug, Error)]
pub enum ValApiError {
    // #[error("HTTP request failed: {0}")]
    // Http(#[from] reqwest::Error),
    #[error("Unauthorized")]
    Unauthorized,
    #[error("Not found")]
    NotFound,
    #[error("{0}")]
    Other(String),
}

pub type Result<T> = std::result::Result<T, ValApiError>;