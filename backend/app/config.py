from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    mongodb_url: str = "mongodb://localhost:27017"
    database_name: str = "blu_reserve"
    jwt_secret: str = "Lollzzzz@123"
    jwt_algorithm: str = "HS256"
    jwt_expires_minutes: int = 30

settings = Settings()