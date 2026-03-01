
from fastapi import Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.database import get_db
from app.core.security import extract_userid_from_token  # Ensure this exists/is exported
from app.crud import user_crud
from app.models import models

def get_current_user(
        user_id: str = Depends(extract_userid_from_token),
        db: Session = Depends(get_db)
) -> models.Users:
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload"
        )
    current_user = user_crud.get_user_by_id(db, user_id=user_id)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return current_user

def get_current_admin(
        current_user: models.Users = Depends(get_current_user)
) -> models.Users:
    if not current_user.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return current_user

def get_current_owner(
        current_user: models.Users = Depends(get_current_user)
) -> models.Users:
    if not current_user.owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this resource"
        )
    return current_user