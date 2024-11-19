from datetime import datetime, timedelta
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from typing import Optional

class JWTHandler:
    secret_key = "your-secret-key-keep-it-secret"  # Change this in production
    algorithm = "HS256"
    security = HTTPBearer()

    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(days=1)
        
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, JWTHandler.secret_key, algorithm=JWTHandler.algorithm)
        return encoded_jwt

    @staticmethod
    def decode_token(token: str):
        try:
            decoded_token = jwt.decode(token, JWTHandler.secret_key, algorithms=[JWTHandler.algorithm])
            return decoded_token if decoded_token["exp"] >= datetime.utcnow().timestamp() else None
        except:
            return None

    @staticmethod
    async def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
        try:
            token = credentials.credentials
            payload = JWTHandler.decode_token(token)
            if payload is None:
                raise HTTPException(status_code=401, detail="Invalid token")
            return payload
        except:
            raise HTTPException(status_code=401, detail="Invalid token")