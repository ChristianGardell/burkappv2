# backend/app/routers/competitors.py
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException
from app.crud import crud
from sqlalchemy.orm import Session
from app.db.database import get_db
from ..deps import get_current_admin
from ...models import models
from typing import List, Union
from app.schemas.schemas import *
from app.core.security import (
    extract_userid_from_token,
)

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/getall", response_model=List[UserResponse])
def get_all_users(
    current_admin: models.Users = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    return crud.get_all_users(db)


@router.get("/stats", response_model=List[AdminStatsResponse])
def get_all_users_stats(
    current_admin: models.Users = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Get all users for the stats page.
    Visible to all validated users (admins and regular users).
    """
    entries =  crud.get_all_users(db)
    for entry in entries:
        entry.beer_log = [log for log in entry.beer_log if log.timestamp > str(datetime.now() - timedelta(days=1))]
    return entries



@router.put("/setbeers", response_model=bool)
def update_user_beers(
    data: UserUpdateAdmin,
    current_admin: models.Users = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    success = crud.update_user_beers(db, data)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update user beers")
    return success
