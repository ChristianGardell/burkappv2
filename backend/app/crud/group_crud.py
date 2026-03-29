from sqlalchemy.orm import Session

from ..core.security import get_pin_hash
from ..models.models import Groups, Users
from ..schemas.schemas import GroupCreateRequest


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


def get_group_by_invite_code(db: Session, invite_code: str) -> Groups | None:
    return db.query(Groups).filter_by(invite_code=invite_code).first()
