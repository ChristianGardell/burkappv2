import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.pool import StaticPool
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.database import Base, get_db

from app.utils.limiter import ip_limiter, phone_limiter

ip_limiter.enabled = False
phone_limiter.enabled = False

# 1. Setup an in-memory test database
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


# 2. Database Override Dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


# Apply the override to the FastAPI app
app.dependency_overrides[get_db] = override_get_db

# Disable rate limiting for tests
if hasattr(app.state, "limiter"):
    app.state.limiter.enabled = False


@pytest.fixture(autouse=True)
def setup_db():
    # Setup test DB tables before each test and drop them after
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client():
    # Provide the test client to your tests
    with TestClient(app) as c:
        yield c


@pytest.fixture
def db_session():
    # Direct access to the testing session for setup/teardown if needed
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


@pytest.fixture
def owner_token(client):
    """Creates a group and returns the owner's auth token and the invite_code"""
    group_req = {
        "name": "Owner",
        "group_name": "Test Group",
        "phone_number": "1112223334",
        "pin": "123456",
    }
    res = client.post("/users/create-group", json=group_req)
    assert res.status_code == 200, res.text
    data = res.json()
    return {
        "token": data["access_token"],
        "invite_code": data["user"]["group"]["invite_code"],
        "user_id": data["user"]["id"],
        "group_id": data["user"]["group"]["id"],
    }


@pytest.fixture
def regular_user_token(client, owner_token):
    """Creates a regular user using the owner's invite code and returns token"""
    user_req = {
        "name": "Regular",
        "phone_number": "5556667778",
        "pin": "654321",
        "invite_code": owner_token["invite_code"],
    }
    res = client.post("/users/create-user", json=user_req)
    assert res.status_code == 200, res.text
    data = res.json()
    return {"token": data["access_token"], "user_id": data["user"]["id"]}
