from pydantic import BaseModel

class UserCreate(BaseModel):   # for POST / create
    name: str
    phone_number: str
    admin: bool = False

class UserUpdate(BaseModel):   # for PUT / update
    id: int
    name: str | None = None
    beers: int | None = None
    phone_number: str | None = None
    admin: bool | None = None

class UserResponse(BaseModel):  # for GET / response
    id: int
    name: str
    beers: int
    phone_number: str
    admin: bool

    class Config:
        orm_mode = True