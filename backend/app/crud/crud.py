# Kommentar: CRUD står för Create, Read, Update, Delete och innehåller
# funktioner för att interagera med databasen, som anropas från routrar.

import datetime
import secrets
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas.schemas import *
from ..models.models import BeerLog, Users, Groups
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


def get_group_by_name(db: Session, group_name: str) -> Groups | None:
    return db.query(Groups).filter_by(name=group_name).first()


def get_group_by_invite_code(db: Session, invite_code: str) -> Groups | None:
    return db.query(Groups).filter_by(invite_code=invite_code).first()


def get_user_by_id(db: Session, user_id: str) -> Users | None:
    """Get a user by their ID."""
    return db.query(Users).filter_by(id=user_id).first()


def get_user_by_phone_number(db: Session, phone_number: str) -> Users | None:
    """Get a user by their phone number."""
    return db.query(Users).filter_by(phone_number=phone_number).first()


def create_user(db: Session, userCreate: UserCreate, group_id: str) -> Users:
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


def create_group(db: Session, group_name: str, invite_code: str) -> Groups:
    """Create a new group in the database."""
    entry = Groups(name=group_name, invite_code=invite_code)
    db.add(entry)
    db.flush()
    db.refresh(entry)

    return entry


def create_user_and_new_group(
    db: Session, groupCreate: GroupCreate, invite_code: str
) -> Users:
    """Create a new user and group in the database."""
    group = create_group(db, groupCreate.group_name, invite_code)
    user_entry = Users(
        name=groupCreate.name,
        phone_number=groupCreate.phone_number,
        hashed_pin=get_pin_hash(groupCreate.pin),
        admin=True,
        owner=True,
        group_id=group.id,
    )
    db.add(user_entry)
    db.commit()  # Save both at once
    db.refresh(user_entry)

    return user_entry



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
