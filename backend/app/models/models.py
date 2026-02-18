from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey
from sqlalchemy.orm import relationship
import uuid

from ..db.database import Base


class BeerLog(Base):
    __tablename__ = "beer_logs"
    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
    )
    user_id = Column(String, ForeignKey("users.id"), index=True, nullable=False)
    timestamp = Column(String)
    user = relationship("Users", foreign_keys=[user_id], back_populates="beer_logs")



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
    total_beers = Column(Integer, default=0)

    beer_logs = relationship("BeerLog", back_populates="user")
