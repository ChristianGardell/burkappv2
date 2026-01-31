from pydantic import BaseModel, Field


class UserCreate(BaseModel):  # for POST / create
    name: str = Field(
        ..., min_length=3, description="Name must be at least 3 characters"
    )
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")


class UserResponse(BaseModel):  # for GET / response
    id: str
    beers: int
    name: str = Field(..., min_length=3)
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    admin: bool

    class Config:
        from_attributes = True  #för att fungera med SQLAlchemy modeller


class LoginResponse(BaseModel):
    user: UserResponse
    access_token: str
    token_type: str = "bearer"


class UserUpdateAdmin(BaseModel):  # for PUT / update
    id: str
    beers: int


class UserDecrementBeer(BaseModel):  # for PUT / decrement beer
    id: str


class GetUserById(BaseModel):  # for GET / by id
    id: str


class UserLogin(BaseModel):
    phone_number: str = Field(
        ..., pattern=r"^\d{10}$", description="Must be exactly 10 digits"
    )
    pin: str = Field(..., pattern=r"^\d{6}$", description="Must be exactly 6 digits")
