from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_DAYS

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


def get_pin_hash(plain_pin: str) -> str:
    """Hash a plain pin for secure storage."""
    return pwd_context.hash(plain_pin)


def verify_pin(plain_pin: str, hashed_pin: str) -> bool:
    """Verify a plain pin against a hashed pin."""
    return pwd_context.verify(plain_pin, hashed_pin)


def create_access_token(data: dict, expires_delta: int | None = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + timedelta(days=expires_delta)
    else:
        expire = datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def validate_token(token: str) -> dict:
    """Validate a JWT token and return the decoded data."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.JWTError:
        return {}