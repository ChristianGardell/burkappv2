

from pydantic import BaseModel, Field

# --- Authentication & User Input ---


class UserLoginRequest(BaseModel):
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


class UserCreateRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Name must be at least 3 characters and no more than 20 characters",
    )
    invite_code: str = Field(
        ...,
        min_length=6,
        max_length=30,
        description="Invite code must be between 6 and 30 characters",
    )
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


# --- Admin Input ---


class GroupCreateRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Name must be at least 3 characters and no more than 20 characters",
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


class UserUpdateAdminRequest(BaseModel):
    id: str = Field(
        ...,
        min_length=36,
        max_length=36,
        description="User ID must be a valid UUID4 string",
    )
    beers: int = Field(..., ge=0, le=10000, description="Number of beers must be non-negative")


# --- Owner Input ---
class GroupNameChangeRequest(BaseModel):
    name: str = Field(
        ...,
        min_length=3,
        max_length=20,
        description="Group name must be at least 3 characters and no more than 20 characters",
    )


class SwishSetRequest(BaseModel):
    swish_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )


class PricePerBeerSetRequest(BaseModel):
    price_per_beer: int = Field(
        ..., ge=1, le=1000, description="Price per beer must be at least 1 SEK"
    )


class AdminChangeRequest(BaseModel):
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )


# --- Responses ---


class GroupResponse(BaseModel):
    id: str
    name: str
    swish_number: str | None
    price_per_beer: int
    invite_code: str

    class Config:
        from_attributes = True


class SwishSetResponse(BaseModel):
    swish_number: str

    class Config:
        from_attributes = True


class PricePerBeerSetResponse(BaseModel):
    price_per_beer: int

    class Config:
        from_attributes = True


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
    id: str
    name: str = Field(..., min_length=3)
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    admin: bool
    total_beers: int
    beer_log: list[BeerLogResponse] = []

    class Config:
        from_attributes = True
