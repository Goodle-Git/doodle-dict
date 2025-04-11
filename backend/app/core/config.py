from pydantic import BaseModel
from functools import lru_cache
from typing import Optional
import os
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "Doodle Learn Joy"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "doodleisawesome")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
