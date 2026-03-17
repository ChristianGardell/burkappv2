import datetime
import secrets
from datetime import datetime

from sqlalchemy.orm import Session

from ..core.security import get_pin_hash
from ..models.models import BeerLog, Groups, Users
from ..schemas.schemas import *


def update_user_beers(db: Session, userUpdate: UserUpdateAdminRequest) -> Users | None:
    """Update a user's beer count."""
    user = db.query(Users).filter_by(id=userUpdate.id).first()
    if not user:
        return None
    user.beers = userUpdate.beers
    db.commit()
    db.refresh(user)
    return user


def get_all_users(db: Session, group_id: str) -> list[Users]:
    """Get all users from db."""
    return db.query(Users).filter_by(group_id=group_id).all()
