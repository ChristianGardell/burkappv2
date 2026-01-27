from pydantic import BaseModel


class UserCreate(BaseModel):  # for POST / create
    name: str
    phone_number: str
    admin: bool = False


class UserResponse(BaseModel):  # for GET / response
    id: str
    beers: int
    name: str
    phone_number: str
    admin: bool


class UserUpdateAdmin(BaseModel):  # for PUT / update
    id: str
    beers: int


class UserDecrementBeer(BaseModel):  # for PUT / decrement beer
    id: str


class GetUserById(BaseModel):  # for GET / by id
    id: str
