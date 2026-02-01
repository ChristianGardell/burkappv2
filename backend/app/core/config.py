import os
from dotenv import load_dotenv

load_dotenv(".env") # Loads variables from .env file

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS", 30))
FRONTEND_SERVER_IP = os.getenv("FRONTEND_SERVER_IP", "http://localhost:5173")

if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Flask application")



# .env file (on disk)
#     ↓
# load_dotenv(".env")  ← reads the file
#     ↓
# os.environ  ← gets populated with KEY=VALUE pairs
#     ↓
# os.getenv("SECRET_KEY")  ← retrieves from os.environ