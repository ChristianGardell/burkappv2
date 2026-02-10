# backend/app/routers/competitors.py
from fastapi import APIRouter, Depends, HTTPException
from app.crud import crud
from sqlalchemy.orm import Session
from app.db.database import get_db
from typing import List, Union
from app.schemas.schemas import *
from app.core.security import (
    get_pin_hash,
    verify_pin,
    create_access_token,
    extract_user_from_token,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/getall", response_model=List[UserResponse])
def get_all_users(
    user_id: str = Depends(extract_user_from_token),
    db: Session = Depends(get_db),
):
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    current_user = crud.get_user_by_id(db, user_id=user_id)
    if not current_user or not current_user.admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this resource"
        )
    return crud.get_all_users(db)


@router.get("/stats", response_model=List[AdminStats])
def get_all_users_stats(
    db: Session = Depends(get_db),
    user_id: str = Depends(extract_user_from_token),
):
    """
    Get all users for the stats page.
    Visible to all validated users (admins and regular users).
    """
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    current_user = crud.get_user_by_id(db, user_id=user_id)
    if not current_user or not current_user.admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this resource"
        )
    return crud.get_all_users(db)


@router.put("/setbeers", response_model=bool)
def update_user_beers(
    data: UserUpdateAdmin,
    user_id: str = Depends(extract_user_from_token),
    db: Session = Depends(get_db),
):
    current_user = crud.get_user_by_id(db, user_id=user_id)
    if not current_user or not current_user.admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this resource"
        )
    success = crud.update_user_beers(db, data)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update user beers")
    return success
