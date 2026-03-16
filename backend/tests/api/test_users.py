def test_get_me(client, regular_user_token):
    headers = {"Authorization": f"Bearer {regular_user_token['token']}"}

    res = client.get("/users/me", headers=headers)
    assert res.status_code == 200, res.text

    data = res.json()
    assert data["id"] == regular_user_token["user_id"]
    assert data["phone_number"] == "5556667778"
    assert data["admin"] == False


def test_decrement_beers(client, owner_token, regular_user_token):
    # First, let's give the regular user some beers via admin endpoint
    admin_headers = {"Authorization": f"Bearer {owner_token['token']}"}
    payload = {"id": regular_user_token["user_id"], "beers": 10}
    client.put("/admin/setbeers", headers=admin_headers, json=payload)

    # Now, decrement as the regular user
    user_headers = {"Authorization": f"Bearer {regular_user_token['token']}"}
    res = client.put("/users/decrement", headers=user_headers)
    assert res.status_code == 200, res.text

    data = res.json()
    assert data["id"] == regular_user_token["user_id"]
    assert data["beers"] == 9
