# backend/app/routers/competitors.py
from fastapi import APIRouter, Depends, HTTPException
from app.crud import crud
from sqlalchemy.orm import Session
from app.db.database import get_db
from typing import Union
from app.schemas.schemas import *
from app.core.security import (
    get_pin_hash,
    verify_pin,
    create_access_token,
    get_current_user,
)

router = APIRouter(prefix="/users", tags=["users"])


# @router.get("/", response_model=list[UserResponse])
# def read_users(db: Session = Depends(get_db)):
#     """Get all users in db"""
#     return crud.get_users(db)


# @router.get("/{id}", response_model=UserResponse)
# def read_user_from_id(data: GetUserById, db: Session = Depends(get_db)):
#     """Get a user by their ID."""
#     user = crud.get_user_by_id(db, data)
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user


@router.get("/me", response_model=UserResponse)
def read_current_user(
    user_id: str = Depends(get_current_user), db: Session = Depends(get_db)
):
    """Get the current logged-in user."""
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return crud.get_user_by_id(db, GetUserById(id=user_id))


@router.post("/check", response_model=bool)
def read_user_check_phone_number(data: UserLogin, db: Session = Depends(get_db)):
    """Check if a user exists by their phone number."""
    return crud.check_if_user_exists(db, data)


@router.post("/login", response_model=LoginResponse)
def login_user(data: UserLogin, db: Session = Depends(get_db)):
    """Login a user by their phone number and pin."""
    user = crud.get_user_by_phone(db, data)
    if not user or not verify_pin(data.pin, user.hashed_pin):
        raise HTTPException(status_code=404, detail="Invalid phone number or pin")
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


@router.put("/decrement-beer", response_model=UserResponse)
def decrement_user_beer(data: UserDecrementBeer, db: Session = Depends(get_db)):
    """Decrement a user's beer count by one."""
    user = crud.decrement_user_beer_one(db, data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
