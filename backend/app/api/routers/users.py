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
    get_pin_hash,
    verify_pin,
    create_access_token,
    extract_userid_from_token,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: models.Users = Depends(get_current_user),
):
    """Get the current logged-in user."""
    return current_user


@router.post("/check", response_model=bool)
def read_user_check_phone_number(data: UserCheck, db: Session = Depends(get_db)):
    """Check if a user exists by their phone number."""
    return crud.check_if_user_exists(db, data)


@router.post("/login", response_model=LoginResponse)
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    """Login a user by their phone number and pin."""
    user = crud.get_user_by_phone(db, phone_number=data.phone_number)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    if not verify_pin(data.pin, user.hashed_pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")
    token = create_access_token({"sub": user.id})
    return LoginResponse(user=UserResponse.model_validate(user), access_token=token)


@router.post("/create", response_model=LoginResponse)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user in the database."""
    userCheck = UserLogin(phone_number=data.phone_number, pin=data.pin)
    if crud.check_if_user_exists(db, userCheck):
        raise HTTPException(status_code=400, detail="User already exists")
    user = crud.create_user(db, data)
    token = create_access_token({"sub": user.id})
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