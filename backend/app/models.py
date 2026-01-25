from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base


class Item(Base):
    __tablename__ = "users"   # Table name in SQLite
    id = Column(Integer, primary_key=True, unique=True, index=True)
    name = Column(String)
    beers = Column(Integer, default=0 )
    phone_number = Column(String, unique=True, index=True)
    admin = Column(Boolean, default=False)

