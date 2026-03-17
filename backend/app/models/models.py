import uuid

from sqlalchemy import (
    Boolean,
    Column,
    Float,
    ForeignKey,
    Integer,
    String,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship

from ..db.database import Base


class Groups(Base):
    __tablename__ = "groups"
    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
        nullable=False,
    )
    swish_number = Column(String, nullable=True)
    price_per_beer = Column(Integer, default=10, nullable=False)
    name = Column(String, nullable=False)
    invite_code = Column(String, unique=True, nullable=False)
    members = relationship(
        "Users", back_populates="group", cascade="all, delete-orphan"
    )


class Users(Base):
    __tablename__ = "users"
    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
        nullable=False,
    )
    beers = Column(Integer, default=0, nullable=False)
    name = Column(String, nullable=False)
    phone_number = Column(String, unique=True, index=True, nullable=False)
    admin = Column(Boolean, default=False, nullable=False)
    owner = Column(Boolean, default=False, nullable=False)
    group_id = Column(
        String, ForeignKey("groups.id", ondelete="CASCADE"), index=True, nullable=False
    )
    hashed_pin = Column(String, nullable=False)
    total_beers = Column(Integer, default=0, nullable=False)

    group = relationship("Groups", foreign_keys=[group_id], back_populates="members")
    beer_log = relationship(
        "BeerLog", back_populates="user", cascade="all, delete-orphan"
    )


class BeerLog(Base):
    __tablename__ = "beer_log"
    id = Column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
    )
    user_id = Column(
        String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    timestamp = Column(String, nullable=False)
    user = relationship("Users", foreign_keys=[user_id], back_populates="beer_log")
