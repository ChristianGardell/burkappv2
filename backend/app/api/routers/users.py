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
    get_current_user,
)

router = APIRouter(prefix="/users", tags=["users"])


@router.get(
    "/admin/getall", response_model=List[UserResponse]
)  # TODO: Restrict to admin users only
def get_all_users(
    current_user: UserUpdate = Depends(get_current_user), db: Session = Depends(get_db)
):
    user = crud.get_user_by_id(
        db, UserUpdate(id=current_user.id, phone_number="", pin="")
    )
    if not user or not user.admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this resource"
        )
    return crud.get_all_users(db)


@router.get("/admin/stats", response_model=List[AdminStats])
def get_all_users_stats(
    db: Session = Depends(get_db), current_user: UserUpdate = Depends(get_current_user)
):
    """
    Get all users for the stats page.
    Visible to all validated users (admins and regular users).
    """
    # Verify the user exists (authentication check from get_current_user is sufficient)
    # If you want to restrict to only admins, check current_user.admin here.
    return crud.get_all_users(db)


@router.put("/admin/setbeers", response_model=bool)
def update_user_beers(
    data: UserUpdateAdmin,
    current_user: UserUpdate = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = crud.get_user_by_id(
        db, UserUpdate(id=current_user.id, phone_number="", pin="")
    )
    if not user or not user.admin:
        raise HTTPException(
            status_code=403, detail="Not authorized to access this resource"
        )
    success = crud.update_user_beers(db, data)
    if not success:
        raise HTTPException(status_code=400, detail="Failed to update user beers")
    return success


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the current logged-in user."""
    if current_user.id is None:
        raise HTTPException(status_code=401, detail="Invalid token payload")
    return crud.get_user_by_id(
        db, UserUpdate(id=current_user.id, phone_number="", pin="")
    )


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


@router.put("/decrement", response_model=UserResponse)
def decrement_user_beer(
    current_user: UserResponse = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Decrement a user's beer count by one."""
    if current_user.beers <= 0:
        raise HTTPException(status_code=400, detail="No beers left to decrement")
    current_user = crud.decrement_user_beer_one(
        db, UserUpdate(id=current_user.id, phone_number="", pin="")
    )
    if not current_user:
        raise HTTPException(status_code=404, detail="Something failed in decrement")
    return current_user
