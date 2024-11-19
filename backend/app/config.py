from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "blu_reserve"
    secret_key: str = "your-secret-key-change-this"  # Change this in production
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440  # 24 hours

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()