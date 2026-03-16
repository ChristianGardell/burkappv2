def test_create_group(client):
    # Test creating a new group and user
    payload = {
        "name": "Admin User",
        "group_name": "Test Group",
        "phone_number": "1234567890",
        "pin": "123456",
    }

    response = client.post("/users/create-group", json=payload)

    assert response.status_code == 200, response.text
    data = response.json()

    # Assert response contains expected keys from LoginResponse
    assert "access_token" in data
    assert "user" in data
    assert data["user"]["name"] == "Admin User"
    assert data["user"]["phone_number"] == "1234567890"
    assert data["user"]["admin"] == True  # creator should be admin
    assert data["user"]["owner"] == True  # creator should be owner of a new group

    # Record invite code for next tests
    assert "group" in data["user"]
    assert "invite_code" in data["user"]["group"]


def test_create_user(client):
    # 1. Create a group first to get an invite code
    group_payload = {
        "name": "Owner User",
        "group_name": "Second Group",
        "phone_number": "0987654321",
        "pin": "123456",
    }
    group_res = client.post("/users/create-group", json=group_payload)
    assert group_res.status_code == 200
    invite_code = group_res.json()["user"]["group"]["invite_code"]

    # 2. Use the invite code to create a standard user
    user_payload = {
        "name": "Normal User",
        "phone_number": "5555555555",
        "pin": "654321",
        "invite_code": invite_code,
    }

    user_res = client.post("/users/create-user", json=user_payload)
    assert user_res.status_code == 200, user_res.text
    user_data = user_res.json()

    assert user_data["user"]["name"] == "Normal User"
    assert user_data["user"]["phone_number"] == "5555555555"
    assert user_data["user"]["admin"] == False
    assert user_data["user"]["owner"] == False


def test_login(client):
    # 1. Create a group first
    client.post(
        "/users/create-group",
        json={
            "name": "Login User",
            "group_name": "Login Group",
            "phone_number": "1112223334",
            "pin": "123123",
        },
    )

    # 2. Login with correct credentials
    login_payload = {"phone_number": "1112223334", "pin": "123123"}

    login_res = client.post("/users/login", json=login_payload)
    assert login_res.status_code == 200, login_res.text

    data = login_res.json()
    assert "access_token" in data
    assert data["user"]["phone_number"] == "1112223334"


def test_login_invalid_credentials(client):
    # Login without creating user
    login_payload = {"phone_number": "9999999999", "pin": "000000"}
    login_res = client.post("/users/login", json=login_payload)
    assert login_res.status_code in [
        401,
        404,
    ]  # Depending on your implementation, usually 404 if phone not found
