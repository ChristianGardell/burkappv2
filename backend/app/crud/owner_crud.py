from sqlalchemy.orm import Session

from ..models.models import Groups, Users

# from ..schemas.schemas import *


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
) -> Groups | None:
    """Set a group's swish number."""
    group = db.query(Groups).filter_by(id=group_id).first()
    if not group:
        return None
    group.swish_number = swish_number
    db.commit()
    db.refresh(group)
    return group


def set_group_price_per_beer(
    db: Session, group_id: str, price_per_beer: int
) -> Groups | None:
    """Set a group's price per beer."""
    group = db.query(Groups).filter_by(id=group_id).first()
    if not group:
        return None
    group.price_per_beer = price_per_beer
    db.commit()
    db.refresh(group)
    return group


def delete_group(db: Session, group_id: str) -> bool:
    """Delete a group and all associated users and beers."""
    group = db.query(Groups).filter_by(id=group_id).first()
    if not group:
        return False
    db.delete(group)
    db.commit()
    return True
