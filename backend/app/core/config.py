import os

# Required variables
SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError(f"No SECRET_KEY set for {env} environment")

# Optional variables with defaults
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_DAYS = int(os.getenv("ACCESS_TOKEN_EXPIRE_DAYS", 30))
FRONTEND_SERVER_IP = os.getenv("FRONTEND_SERVER_IP", "http://localhost:5173")  # fallback for dev