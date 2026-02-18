# Kommentar: CRUD står för Create, Read, Update, Delete och innehåller
# funktioner för att interagera med databasen, som anropas från routrar.

import datetime
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas.schemas import *
from ..models.models import BeerLog, Users
from ..core.security import get_pin_hash


def get_all_users(db: Session) -> list[Users]:
    """Get all users from db."""
    return db.query(Users).all()


def update_user_beers(db: Session, userUpdate: UserUpdateAdmin) -> bool:
    """Update a user's beer count."""
    user = db.query(Users).filter_by(id=userUpdate.id).first()
    if not user:
        return False
    user.beers = userUpdate.beers
    db.commit()
    db.refresh(user)
    return True


def check_if_user_exists(db: Session, user: UserLogin) -> bool:
    user = db.query(Users).filter_by(phone_number=user.phone_number).first()
    return user is not None


def get_user_by_id(db: Session, user_id: str) -> Users | None:
    """Get a user by their ID."""
    return db.query(Users).filter_by(id=user_id).first()


def get_user_by_phone(db: Session, phone_number: str) -> Users | None:
    """Get a user by their phone number."""
    return db.query(Users).filter_by(phone_number=phone_number).first()


def create_user(db: Session, userCreate: UserCreate) -> Users:
    """Create a new user in the database."""
    entry = Users(
        name=userCreate.name,
        phone_number=userCreate.phone_number,
        hashed_pin=get_pin_hash(userCreate.pin),
        admin=False,
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


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
