from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # API Config
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "Portfolio Tracker API"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "API para gerenciamento de carteira de investimentos"
    
    # Database
    DATABASE_URL: str = "sqlite:///./portfolio.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    BACKEND_CORS_ORIGINS: list = ["http://localhost:3000", "http://127.0.0.1:3000", "http://localhost:5173", "http://localhost:5174", "http://localhost:5175"]
    
    # External APIs
    ALPHA_VANTAGE_API_KEY: Optional[str] = None
    FINNHUB_API_KEY: Optional[str] = None
    
    # Redis (for future caching)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()