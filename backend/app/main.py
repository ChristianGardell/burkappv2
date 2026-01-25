from typing import Union
from fastapi import FastAPI, Depends
from pydantic import BaseModel
from models import Item  
from database import get_db
from sqlalchemy.orm import Session
from schemas import *


app = FastAPI()



@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}

@app.post("/users/", response_model=UserOut)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = Item(
        name=user.name,
        beers=0,
        phone_number=user.phone_number,
        admin=user.admin
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)  # get updated fields like auto-generated id
    return db_user
