# backend/app/routers/competitors.py

from fastapi import APIRouter, Depends, HTTPException
from app.crud import crud
from sqlalchemy.orm import Session
from app.db.database import get_db
from ..deps import get_current_owner
from ...models import models
from app.schemas.schemas import *

router = APIRouter(prefix="/owner", tags=["owner"])


@router.put("/set-group-swish-number", response_model=SwishSetResponse)
def set_swish_number(
    data: SwishSetRequest,
    current_owner: models.Users = Depends(get_current_owner),
    db: Session = Depends(get_db),
):
    """Set a group's swish number."""
    number = crud.set_group_swish_number(db, current_owner.group_id, data.swish_number)
    if not number:
        raise HTTPException(status_code=400, detail="Failed to set swish number")
    return number


@router.put("/make-user-admin", response_model=UserResponse)
def make_admin(
    data: AdminChangeRequest,
    current_owner: models.Users = Depends(get_current_owner),
    db: Session = Depends(get_db),
):
    """Make a user an admin"""
    user = crud.get_user_by_phone_number_and_group_id(
        db, phone_number=data.phone_number, group_id=current_owner.group_id
    )
    print(user)
    if not user or user.group_id != current_owner.group_id:
        raise HTTPException(status_code=404, detail="User does not exist in your group")
    updated_user = crud.make_user_admin(
        db, user_id=user.id, group_id=current_owner.group_id
    )
    return updated_user

@router.put("/remove-user-admin", response_model=UserResponse)
def remove_admin(
    data: AdminChangeRequest,
    current_owner: models.Users = Depends(get_current_owner),
    db: Session = Depends(get_db),
):
    """Remove a user's admin status"""
    user = crud.get_user_by_phone_number_and_group_id(
        db, phone_number=data.phone_number, group_id=current_owner.group_id
    )
    if not user or user.group_id != current_owner.group_id:
        raise HTTPException(status_code=404, detail="User does not exist in your group")
    
    if user.id == current_owner.id:
        raise HTTPException(status_code=400, detail="You cannot remove your own admin status")

    updated_user = crud.remove_user_admin(
        db, user_id=user.id, group_id=current_owner.group_id
    )
    return updated_user

