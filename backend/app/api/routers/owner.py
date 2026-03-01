# backend/app/routers/competitors.py

from fastapi import APIRouter, Depends, HTTPException
from app.crud import owner_crud, user_crud
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
    number = owner_crud.set_group_swish_number(
        db, current_owner.group_id, data.swish_number
    )
    if not number:
        raise HTTPException(status_code=400, detail="Failed to set swish number")
    return number


@router.put("/set-group-price-per-beer", response_model=PricePerBeerSetResponse)
def set_price_per_beer(
    data: PricePerBeerSetRequest,
    current_owner: models.Users = Depends(get_current_owner),
    db: Session = Depends(get_db),
):
    """Set a group's price per beer."""
    group = owner_crud.set_group_price_per_beer(
        db, current_owner.group_id, data.price_per_beer
    )
    if not group:
        raise HTTPException(status_code=400, detail="Failed to set price per beer")
    return PricePerBeerSetResponse(price_per_beer=group.price_per_beer)


@router.put("/change-group-name", response_model=GroupResponse)
def set_group_name(
    data: GroupNameChangeRequest,
    current_owner: models.Users = Depends(get_current_owner),
    db: Session = Depends(get_db),
):
    group = owner_crud.set_group_name(db, current_owner.group_id, data.name)
    if not group:
        raise HTTPException(status_code=400, detail="Failed to set group name")
    return group


@router.put("/make-user-admin", response_model=UserResponse)
def make_admin(
    data: AdminChangeRequest,
    current_owner: models.Users = Depends(get_current_owner),
    db: Session = Depends(get_db),
):
    """Make a user an admin"""
    user = user_crud.get_user_by_phone_number_and_group_id(
        db, phone_number=data.phone_number, group_id=current_owner.group_id
    )
    if not user or user.group_id != current_owner.group_id:
        raise HTTPException(status_code=404, detail="User does not exist in your group")
    updated_user = owner_crud.make_user_admin(
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
    user = user_crud.get_user_by_phone_number_and_group_id(
        db, phone_number=data.phone_number, group_id=current_owner.group_id
    )
    if not user or user.group_id != current_owner.group_id:
        raise HTTPException(status_code=404, detail="User does not exist in your group")

    if user.id == current_owner.id:
        raise HTTPException(
            status_code=400, detail="You cannot remove your own admin status"
        )

    updated_user = owner_crud.remove_user_admin(
        db, user_id=user.id, group_id=current_owner.group_id
    )
    return updated_user
