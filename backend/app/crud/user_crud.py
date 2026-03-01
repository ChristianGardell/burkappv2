import datetime
from datetime import datetime

from sqlalchemy.orm import Session

from ..core.security import get_pin_hash
from ..models.models import BeerLog, Groups, Users
from ..schemas.schemas import *


def decrement_user_beer_one(db: Session, user_id: str) -> Users | None:
    """Decrement a user's beer count by one."""
    user = db.query(Users).filter_by(id=user_id).first()
    if not user:
        return None
    if user.beers > 0:
        user.beers -= 1
        user.total_beers += 1
        user.beer_log.append(BeerLog(timestamp=str(datetime.now())))

    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: str) -> Users | None:
    """Get a user by their ID."""
    return db.query(Users).filter_by(id=user_id).first()


def get_user_by_phone_number(db: Session, phone_number: str) -> Users | None:
    """Get a user by their phone number."""
    return db.query(Users).filter_by(phone_number=phone_number).first()


def get_user_by_phone_number_and_group_id(
    db: Session, phone_number: str, group_id: str
) -> Users | None:
    """Get a user by their phone number."""
    return (
        db.query(Users).filter_by(phone_number=phone_number, group_id=group_id).first()
    )


def create_user(db: Session, userCreate: UserCreateRequest, group_id: str) -> Users:
    """Create a new user in the database."""
    entry = Users(
        name=userCreate.name,
        phone_number=userCreate.phone_number,
        hashed_pin=get_pin_hash(userCreate.pin),
        admin=False,
        owner=False,
        group_id=group_id,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry
