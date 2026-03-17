# backend/app/routers/competitors.py
from datetime import timedelta, datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.crud import admin_crud
from app.db.database import get_db
from app.schemas.schemas import *

from ...models import models
from ..deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/getall", response_model=list[UserResponse])
def get_all_users(
    current_admin: models.Users = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Get all users in the admin's group. Visible to all validated users (admins and owners)."""
    return admin_crud.get_all_users(db, current_admin.group_id)


@router.get("/stats", response_model=list[AdminStatsResponse])
def get_all_users_stats(
    current_admin: models.Users = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """
    Get all users for the stats page.
    Visible to all validated users (admins and owners).
    """
    entries = admin_crud.get_all_users(db, current_admin.group_id)
    for entry in entries:
        entry.beer_log = [
            log
            for log in entry.beer_log
            if log.timestamp > str(datetime.now() - timedelta(days=1))
        ]
        entry.beer_log.sort(key=lambda log: log.timestamp, reverse=True)
    return entries


@router.put("/setbeers", response_model=bool)
def update_user_beers(
    data: UserUpdateAdminRequest,
    current_admin: models.Users = Depends(get_current_admin),
    db: Session = Depends(get_db),
):
    """Update a user's beer count. Visible to all validated users (admins and owners)."""
    user = admin_crud.update_user_beers(db, data)
    if not user:
        raise HTTPException(status_code=400, detail="Failed to update user beers")
    return True
