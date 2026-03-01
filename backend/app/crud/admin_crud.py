import datetime
import secrets
from sqlalchemy.orm import Session
from datetime import datetime
from ..schemas.schemas import *
from ..models.models import BeerLog, Users, Groups
from ..core.security import get_pin_hash


def update_user_beers(db: Session, userUpdate: UserUpdateAdminRequest) -> bool:
    """Update a user's beer count."""
    user = db.query(Users).filter_by(id=userUpdate.id).first()
    if not user:
        return False
    user.beers = userUpdate.beers
    db.commit()
    db.refresh(user)
    return True


def get_all_users(db: Session, group_id: str) -> list[Users]:
    """Get all users from db."""
    return db.query(Users).filter_by(group_id=group_id).all()
