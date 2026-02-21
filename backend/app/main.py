from datetime import datetime
import time
from fastapi import FastAPI, Request
import logging
from fastapi.middleware.cors import CORSMiddleware
import os
import json
from slowapi import Limiter, _rate_limit_exceeded_handler
from .utils.limiter import ip_limiter
from slowapi.errors import RateLimitExceeded
from .core.config import FRONTEND_SERVER_IP
from .core.security import get_pin_hash
from .models import models
from .db.database import SessionLocal, engine
from .api.routers import users
from .api.routers import admin
from .api.routers import owner
from .crud import crud
from .utils.seed import seed_database

# Setup logging to tap into Gunicorn's output
access_logger = logging.getLogger("uvicorn.access")

# Ensure it prints so you actually see the double logs
access_logger.setLevel(logging.INFO)
access_logger.propagate = True

# Create database tables
models.Base.metadata.create_all(bind=engine)


# Create FastAPI app and configure rate limiting

app = FastAPI()
app.state.limiter = ip_limiter


app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# Configure CORS
origins = [
    FRONTEND_SERVER_IP,
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def cache_request_body(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)
    await request.body()
    try:
        request.state.body = json.loads(request._body)
    except Exception:
        request.state.body = {}
    return await call_next(request)


@app.middleware("http")
async def log_with_user_agent(request: Request, call_next):
    # 1. Start the timer and get current time
    start_time = time.perf_counter()
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    # 2. Process the request
    response = await call_next(request)

    # 3. Calculate duration (latency)
    process_time = (time.perf_counter() - start_time) * 1000  # Convert to ms
    user_agent = request.headers.get("user-agent", "Unknown-UA")

    # 4. Log with all the bells and whistles
    access_logger.info(
        f'[{timestamp}] {request.client.host} - "{request.method} {request.url.path}" '
        f'{response.status_code} ({process_time:.2f}ms) UA: "{user_agent}"'
    )

    return response


# Include Routers
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(owner.router)


if os.getenv("ENV") == "dev":
    db = SessionLocal()
    seed_database()
