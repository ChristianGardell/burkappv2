

# Kommentar: CRUD står för Create, Read, Update, Delete och innehåller
# funktioner för att interagera med databasen, som anropas från routrar.

from sqlalchemy.orm import Session
from app.schemas.schemas import *
from app.models.models import Users    


def get_users(db: Session) -> list[Users]:
    """Get all users from db."""
    return db.query(Users).all()


def get_user_by_id(db: Session,getUserById: GetUserById) -> Users | None:
    """Get a user by their ID."""
    return (
        db.query(Users)
        .filter_by(id=getUserById.id)
        .first()
    )

def create_user(db: Session, userCreate: UserCreate) -> Users:
    """Create a new user in the database."""
    entry = Users(
        name=userCreate.name,
        phone_number=userCreate.phone_number,
        admin=userCreate.admin
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)

    return entry


def decrement_user_beer_one(db: Session, userDecrementBeer: UserDecrementBeer) -> Users | None:
    """Decrement a user's beer count by one."""
    user = db.query(Users).filter_by(id=userDecrementBeer.id).first()
    if not user:
        return None  
    if user.beers > 0:
        user.beers -= 1

    db.commit()
    db.refresh(user)
    return user