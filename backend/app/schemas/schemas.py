from datetime import datetime
from pydantic import BaseModel, Field


class UserCheck(BaseModel):
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )


class UserLogin(BaseModel):
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


class UserCreate(BaseModel):  # for POST / create
    name: str = Field(
        ..., min_length=3, description="Name must be at least 3 characters"
    )
    invite_code: str
    
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )

    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


class GroupCreate(BaseModel):  # for POST / create
    name: str = Field(
        ..., min_length=3, description="Name must be at least 3 characters"
    )
    group_name: str = Field(
        ..., min_length=3, max_length=20, description="Group name must be at least 3 characters and no more than 20 characters"
    )
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


class UserUpdateAdmin(BaseModel):
    id: str
    beers: int = Field(..., ge=0, description="Number of beers must be non-negative")


class groupResponse(BaseModel):
    id: str
    name: str

    class Config:
        from_attributes = True  # för att fungera med SQLAlchemy modeller

class UserResponse(BaseModel):  # for GET / response
    id: str
    group: groupResponse
    beers: int
    name: str = Field(..., min_length=3)
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    admin: bool
    owner: bool

    class Config:
        from_attributes = True  # för att fungera med SQLAlchemy modeller


class UserBeerResponse(BaseModel):  # for GET / response
    id: str
    beers: int

    class Config:
        from_attributes = True  # för att fungera med SQLAlchemy modeller


class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"

    class Config:
        from_attributes = True


class BeerLogResponse(BaseModel):
    id: str
    timestamp: str
    user_id: str

    class Config:
        from_attributes = True


class AdminStatsResponse(BaseModel):  # for GET / response
    name: str = Field(..., min_length=3)
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    admin: bool
    total_beers: int
    beer_log: list[BeerLogResponse] = []

    class Config:
        from_attributes = True
