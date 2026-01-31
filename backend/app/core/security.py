from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_DAYS
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import Users
from app.crud import crud
from app.schemas.schemas import UserUpdate

pwd_context = CryptContext(schemes=["bcrypt_sha256"], deprecated="auto")


security = HTTPBearer()


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


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    """Decode token and load the specific User from the DB."""
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload"
            )
    except (JWTError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )
    user = crud.get_user_by_id(db, UserUpdate(id=user_id, phone_number="", pin=""))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user
