from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .core.config import FRONTEND_SERVER_IP
from .core.security import get_pin_hash
from .models import models
from .db.database import SessionLocal, engine
from .api.routers import users
from .api.routers import admin
from .crud import crud


# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://192.168.0.208:5173",
    FRONTEND_SERVER_IP,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(users.router)

app.include_router(admin.router)

if os.getenv("ENV") == "dev":
    db = SessionLocal()
    try:
        # Check if users already exist to prevent duplicates
        if db.query(models.Users).count() == 0:
            print("Seeding development database with test cases...")

            # This is a dummy hash (pin 123456)
            test_pin_hash = get_pin_hash("111111")

            # Add 2 Admins
            admins = [
                models.Users(
                    name="Christian",
                    phone_number="0767116725",
                    hashed_pin=test_pin_hash,
                    admin=True,
                    beers=15,
                    total_beers=15,
                ),
                models.Users(
                    name="admin_partner",
                    phone_number="0707654321",
                    hashed_pin=test_pin_hash,
                    admin=True,
                    beers=10,
                    total_beers=10,
                ),
            ]
            db.add_all(admins)

            # Add 10 Users with differing beer counts
            for i in range(1, 11):
                new_user = models.Users(
                    name=f"User {i}",
                    phone_number=f"070000000{i-1}",
                    hashed_pin=test_pin_hash,
                    admin=False,
                    beers=i * 2,
                    total_beers=i * 2,
                )
                db.add(new_user)

            db.commit()
            print("Database seeded successfully.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()
