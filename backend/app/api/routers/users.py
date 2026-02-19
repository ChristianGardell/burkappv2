# backend/app/routers/competitors.py
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Union
from sqlalchemy.orm import Session

from ...models import models
from ..deps import get_current_user


from ...crud import crud
from ...db.database import get_db
from ...schemas.schemas import *
from ...core.security import (
    verify_pin,
    create_access_token,
)
from ...services import user_service

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: models.Users = Depends(get_current_user),
):
    """Get the current logged-in user."""
    return current_user


@router.post("/login", response_model=LoginResponse)
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    """Login a user by their phone number and pin."""
    user = crud.get_user_by_phone_number(db, phone_number=data.phone_number)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    if not verify_pin(data.pin, user.hashed_pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")
    token = create_access_token({"sub": user.id, "group_id": user.group_id})
    return LoginResponse(user=UserResponse.model_validate(user), access_token=token)


@router.post("/create-user", response_model=LoginResponse)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user in the database."""

    if crud.get_user_by_phone_number(db, phone_number=data.phone_number):
        raise HTTPException(status_code=409, detail="User already exists")
    group = crud.get_group_by_invite_code(db, invite_code=data.invite_code)
    if group is None:
        raise HTTPException(
            status_code=404, detail="Group with invite code does not exist"
        )

    user = crud.create_user(db, data, group_id=group.id)
    token = create_access_token({"sub": user.id, "group_id": user.group_id})
    return LoginResponse(user=UserResponse.model_validate(user), access_token=token)


@router.post("/create-group", response_model=LoginResponse)
def create_group(data: GroupCreate, db: Session = Depends(get_db)):
    """Create a new group in the database, add User and make user admin and owner."""
    invite_code = user_service.generate_and_check_invite_code_is_unique(db)
    user = crud.create_user_and_new_group(db, data, invite_code = invite_code)
    token = create_access_token({"sub": user.id, "group_id": user.group_id})
    return LoginResponse(user=UserResponse.model_validate(user), access_token=token)


@router.put("/decrement", response_model=UserBeerResponse)
def decrement_user_beer(
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Decrement a user's beer count by one."""
    if current_user.beers <= 0:
        raise HTTPException(status_code=400, detail="No beers left to decrement")
    current_user = crud.decrement_user_beer_one(db, user_id=current_user.id)
    return current_user
