
from sqlalchemy.orm import Session
from ..schemas.schemas import *
from ..models.models import Users, Groups


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
