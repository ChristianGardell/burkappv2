from sqlalchemy.orm import Session
from fastapi import Depends
from ..models.models import Groups
from ..crud import crud
from ..db.database import get_db

import random
from nltk.corpus import words


word_list = words.words()


def generate_invite_code() -> str:
    """Generate a unique invite code."""
    word1 = random.choice(word_list)
    word2 = random.choice(word_list)
    while len(word1) > 9 or len(word2) > 9:
        word1 = random.choice(word_list)
        word2 = random.choice(word_list)
    number = random.randint(100, 999)
    return f"{word1}-{word2}-{number}"


def generate_and_check_invite_code_is_unique(db: Session = Depends(get_db)) -> str:
    """Check if a group exists with the given invite code."""
    invite_code = generate_invite_code()
    entry = crud.get_group_by_invite_code(db, invite_code=invite_code)
    while entry is not None:
        invite_code = generate_invite_code()
        entry = crud.get_group_by_invite_code(db, invite_code=invite_code)
    return invite_code
