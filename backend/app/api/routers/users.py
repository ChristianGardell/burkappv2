# backend/app/routers/competitors.py
from fastapi import APIRouter, Depends, HTTPException, Request
from slowapi.errors import RateLimitExceeded
from sqlalchemy.orm import Session

from ...core.security import (
    create_access_token,
    verify_pin,
)
from ...crud import group_crud, user_crud
from ...db.database import get_db
from ...models import models
from ...schemas.schemas import *
from ...services import user_service
from ...utils.limiter import ip_limiter, phone_limiter
from ..deps import get_current_user

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserResponse)
def read_current_user(
    current_user: models.Users = Depends(get_current_user),
):
    """Get the current logged-in user."""
    return current_user


@router.post("/login", response_model=LoginResponse)
@phone_limiter.limit("7/minute")
@ip_limiter.limit("50/minute")
async def login_user(
    request: Request, data: UserLoginRequest, db: Session = Depends(get_db)
):
    """Login a user by their phone number and pin."""
    user = user_crud.get_user_by_phone_number(db, phone_number=data.phone_number)
    if not user:
        raise HTTPException(status_code=404, detail="User does not exist")
    if not verify_pin(data.pin, user.hashed_pin):
        raise HTTPException(status_code=401, detail="Incorrect PIN")
    token = create_access_token({"sub": user.id, "group_id": user.group_id})
    return LoginResponse(user=UserResponse.model_validate(user), access_token=token)


@router.post("/create-user", response_model=LoginResponse)
@phone_limiter.limit("10/minute")
@ip_limiter.limit("50/minute")
def create_user(
    request: Request, data: UserCreateRequest, db: Session = Depends(get_db)
):
    """Create a new user in the database."""

    if user_crud.get_user_by_phone_number(db, phone_number=data.phone_number):
        raise HTTPException(status_code=409, detail="User already exists")
    group = group_crud.get_group_by_invite_code(db, invite_code=data.invite_code)
    if group is None:
        raise HTTPException(
            status_code=404, detail="Group with invite code does not exist"
        )

    user = user_crud.create_user(db, data, group_id=group.id)
    token = create_access_token({"sub": user.id, "group_id": user.group_id})
    return LoginResponse(user=UserResponse.model_validate(user), access_token=token)


@router.post("/create-group", response_model=LoginResponse)
@phone_limiter.limit("10/minute")
@ip_limiter.limit("50/minute")
def create_group(
    request: Request, data: GroupCreateRequest, db: Session = Depends(get_db)
):
    """Create a new group in the database, add User and make user admin and owner."""
    if user_crud.get_user_by_phone_number(db, phone_number=data.phone_number):
        raise HTTPException(status_code=409, detail="User already exists")
    invite_code = user_service.generate_and_check_invite_code_is_unique(db)
    user = group_crud.create_user_and_new_group(db, data, invite_code=invite_code)
    token = create_access_token({"sub": user.id, "group_id": user.group_id})
    return LoginResponse(user=UserResponse.model_validate(user), access_token=token)


@router.post("/validate-group", response_model=GroupResponse)
@ip_limiter.limit("50/minute")
def validate_group(
    request: Request, data: ValidateGroupRequest, db: Session = Depends(get_db)
):
    """Create a new group in the database, add User and make user admin and owner."""
    group = group_crud.get_group_by_invite_code(db, invite_code=data.invite_code)
    if not group:
        raise HTTPException(
            status_code=404, detail="Group with invite code does not exist"
        )

    return GroupResponse.model_validate(group)


@router.put("/decrement", response_model=UserBeerResponse)
def decrement_user_beer(
    current_user: models.Users = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Decrement a user's beer count by one."""
    if current_user.beers <= 0:
        raise HTTPException(status_code=400, detail="No beers left to decrement")
    current_user = user_crud.decrement_user_beer_one(db, user_id=current_user.id)
    return current_user
