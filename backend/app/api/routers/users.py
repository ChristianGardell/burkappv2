
# backend/app/routers/competitors.py
from fastapi import APIRouter, Depends, HTTPException
from app.crud import crud
from sqlalchemy.orm import Session
from app.db.database import get_db
from typing import Union
from app.schemas.schemas import *


router = APIRouter(prefix="/users", tags=["users"])

@router.get("/", response_model=list[UserResponse])
def read_users(db: Session = Depends(get_db)):
    """Get all users in db"""
    return crud.get_users(db)


@router.get("/{id}", response_model=UserResponse)
def read_user_from_id(data: GetUserById, db: Session = Depends(get_db)):
    """Get a user by their ID."""
    user = crud.get_user_by_id(db, data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("/create", response_model=UserResponse)
def create_user(data: UserCreate, db: Session = Depends(get_db)):
    """Create a new user in the database."""
    return crud.create_user(db, data)

@router.put("/decrement-beer", response_model=UserResponse)
def decrement_user_beer(data: UserDecrementBeer, db: Session = Depends(get_db)):
    """Decrement a user's beer count by one."""
    user = crud.decrement_user_beer_one(db, data)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user