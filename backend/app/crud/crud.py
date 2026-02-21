# Kommentar: CRUD står för Create, Read, Update, Delete och innehåller
# funktioner för att interagera med databasen, som anropas från routrar.

import datetime
import secrets
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas.schemas import *
from ..models.models import BeerLog, Users, Groups
from ..core.security import get_pin_hash


def get_all_users(db: Session, group_id: str) -> list[Users]:
    """Get all users from db."""
    return db.query(Users).filter_by(group_id=group_id).all()


def update_user_beers(db: Session, userUpdate: UserUpdateAdminRequest) -> bool:
    """Update a user's beer count."""
    user = db.query(Users).filter_by(id=userUpdate.id).first()
    if not user:
        return False
    user.beers = userUpdate.beers
    db.commit()
    db.refresh(user)
    return True


def get_group_by_invite_code(db: Session, invite_code: str) -> Groups | None:
    return db.query(Groups).filter_by(invite_code=invite_code).first()


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


def create_group(db: Session, group_name: str, invite_code: str) -> Groups:
    """Create a new group in the database."""
    entry = Groups(name=group_name, invite_code=invite_code)
    db.add(entry)
    db.flush()
    db.refresh(entry)

    return entry


def create_user_and_new_group(
    db: Session, groupCreate: GroupCreateRequest, invite_code: str
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

def set_group_name(db: Session, group_id: str, name: str) -> Groups | None:
    """Set a group's name."""
    group = db.query(Groups).filter_by(id=group_id).first()
    if not group:
        return None
    group.name = name
    db.commit()
    db.refresh(group)
    return group

def set_group_swish_number(
    db: Session, group_id: str, swish_number: str
) -> SwishSetResponse | None:
    """Set a group's swish number."""
    group = db.query(Groups).filter_by(id=group_id).first()
    if not group:
        return None
    group.swish_number = swish_number
    db.commit()
    db.refresh(group)
    return SwishSetResponse(swish_number=group.swish_number)


def make_user_admin(db: Session, user_id: str, group_id: str) -> Users | None:
    """Set a user's admin status."""
    user = db.query(Users).filter_by(id=user_id, group_id=group_id).first()
    if not user:
        return None
    user.admin = True
    db.commit()
    db.refresh(user)
    return user


def remove_user_admin(db: Session, user_id: str, group_id: str) -> Users | None:
    """Remove a user's admin status."""
    user = db.query(Users).filter_by(id=user_id, group_id=group_id).first()
    if not user:
        return None
    user.admin = False
    db.commit()
    db.refresh(user)
    return user
