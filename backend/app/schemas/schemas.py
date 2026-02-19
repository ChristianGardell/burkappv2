from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional

# --- Authentication & User Input ---


class UserLoginRequest(BaseModel):
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


class UserCreateRequest(BaseModel):
    name: str = Field(
        ..., min_length=3, description="Name must be at least 3 characters"
    )
    invite_code: str
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


# --- Group & Admin Input ---


class GroupCreateRequest(BaseModel):
    name: str = Field(
        ..., min_length=3, description="Name must be at least 3 characters"
    )
    group_name: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Group name must be at least 3 characters and no more than 20 characters",
    )
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


class SwishSetRequest(BaseModel):
    swish_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )


class AdminChangeRequest(BaseModel):
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )


class UserUpdateAdminRequest(BaseModel):
    id: str
    beers: int = Field(..., ge=0, description="Number of beers must be non-negative")


# --- Responses ---


class GroupResponse(BaseModel):
    id: str
    name: str
    swish_number: str | None
    invite_code: str

    class Config:
        from_attributes = True


class SwishSetResponse(BaseModel):
    swish_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )


class UserResponse(BaseModel):
    id: str
    group: GroupResponse
    beers: int
    name: str = Field(..., min_length=3)
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    admin: bool
    owner: bool

    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"

    class Config:
        from_attributes = True


class UserBeerResponse(BaseModel):
    id: str
    beers: int

    class Config:
        from_attributes = True


class BeerLogResponse(BaseModel):
    id: str
    timestamp: str
    user_id: str

    class Config:
        from_attributes = True


class AdminStatsResponse(BaseModel):
    name: str = Field(..., min_length=3)
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    admin: bool
    total_beers: int
    beer_log: list[BeerLogResponse] = []

    class Config:
        from_attributes = True
