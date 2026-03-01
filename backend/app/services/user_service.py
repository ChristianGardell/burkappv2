import random

from fastapi import Depends
from sqlalchemy.orm import Session
from wordfreq import top_n_list

from ..crud import group_crud
from ..db.database import get_db
from ..models.models import Groups

words = top_n_list("en", 10000)


def generate_invite_code() -> str:
    """Generate a unique invite code."""
    word1 = random.choice(words)
    word2 = random.choice(words)
    while len(word1) > 9 or len(word2) > 9:
        word1 = random.choice(words)
        word2 = random.choice(words)
    number = random.randint(100, 999)
    return f"{word1}-{word2}-{number}"


def generate_and_check_invite_code_is_unique(db: Session = Depends(get_db)) -> str:
    """Check if a group exists with the given invite code."""
    invite_code = generate_invite_code()
    entry = group_crud.get_group_by_invite_code(db, invite_code=invite_code)
    while entry is not None:
        invite_code = generate_invite_code()
        entry = group_crud.get_group_by_invite_code(db, invite_code=invite_code)
    return invite_code
