from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import json
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from .core.config import FRONTEND_SERVER_IP
from .utils.limiter import ip_limiter
from .models import models
from .db.database import engine
from .api.routers import users
from .api.routers import admin
from .api.routers import owner


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


# Include Routers
app.include_router(users.router)
app.include_router(admin.router)
app.include_router(owner.router)
