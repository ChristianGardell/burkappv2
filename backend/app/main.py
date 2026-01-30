from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.models import models
from app.db.database import engine
from app.api.routers import users

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
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

@app.get("/")
def read_root():
    return {"message": "BeerTrack API is running"}
