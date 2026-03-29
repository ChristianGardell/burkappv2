import uuid

from sqlalchemy import Boolean, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..db.database import Base


class Groups(Base):
    __tablename__ = "groups"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
        nullable=False,
    )
    swish_number: Mapped[str | None] = mapped_column(String, nullable=True)
    price_per_beer: Mapped[int] = mapped_column(Integer, default=10, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    invite_code: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    members: Mapped[list["Users"]] = relationship(
        "Users", back_populates="group", cascade="all, delete-orphan"
    )


class Users(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
        nullable=False,
    )
    beers: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    name: Mapped[str] = mapped_column(String, nullable=False)
    phone_number: Mapped[str] = mapped_column(
        String, unique=True, index=True, nullable=False
    )
    admin: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    owner: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    group_id: Mapped[str] = mapped_column(
        String, ForeignKey("groups.id", ondelete="CASCADE"), index=True, nullable=False
    )
    hashed_pin: Mapped[str] = mapped_column(String, nullable=False)
    total_beers: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    group: Mapped["Groups"] = relationship(
        "Groups", foreign_keys=[group_id], back_populates="members"
    )
    beer_log: Mapped[list["BeerLog"]] = relationship(
        "BeerLog", back_populates="user", cascade="all, delete-orphan"
    )


class BeerLog(Base):
    __tablename__ = "beer_log"

    id: Mapped[str] = mapped_column(
        String,
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        unique=True,
        index=True,
    )
    user_id: Mapped[str] = mapped_column(
        String, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    timestamp: Mapped[str] = mapped_column(String, nullable=False)
    user: Mapped["Users"] = relationship(
        "Users", foreign_keys=[user_id], back_populates="beer_log"
    )
