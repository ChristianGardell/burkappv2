from sqlalchemy import Column, Integer, String, Float, Boolean
from app.db.database import Base
import uuid


class Users(Base):
    __tablename__ = "users"  # Table name in SQLite
    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
    )
    beers = Column(Integer, default=0)
    name = Column(String)
    phone_number = Column(String, unique=True, index=True)
    admin = Column(Boolean, default=False)
    hashed_pin = Column(String, nullable=False) 