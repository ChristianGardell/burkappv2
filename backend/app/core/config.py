import os
from dotenv import load_dotenv

load_dotenv() # Loads variables from .env file

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS", 30))

if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Flask application")