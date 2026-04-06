def test_set_group_swish_number(client, owner_token):
    headers = {"Authorization": f"Bearer {owner_token['token']}"}
    payload = {"swish_number": "0001112223"}

    res = client.put("/owner/set-group-swish-number", headers=headers, json=payload)
    assert res.status_code == 200, res.text
    assert res.json()["swish_number"] == "0001112223"


def test_set_group_swish_number_unauthorized(client, regular_user_token):
    # A regular user cannot set the swish number
    headers = {"Authorization": f"Bearer {regular_user_token['token']}"}
    payload = {"swish_number": "0001112223"}

    res = client.put("/owner/set-group-swish-number", headers=headers, json=payload)
    # Expected to be forbidden or similar
    assert res.status_code in [401, 403], res.text


def test_set_group_price_per_beer(client, owner_token):
    headers = {"Authorization": f"Bearer {owner_token['token']}"}
    payload = {"price_per_beer": 15}

    res = client.put("/owner/set-group-price-per-beer", headers=headers, json=payload)
    assert res.status_code == 200, res.text
    assert res.json()["price_per_beer"] == 15


def test_change_group_name(client, owner_token):
    headers = {"Authorization": f"Bearer {owner_token['token']}"}
    payload = {"name": "New Group Name"}

    res = client.put("/owner/change-group-name", headers=headers, json=payload)
    assert res.status_code == 200, res.text
    assert res.json()["name"] == "New Group Name"


def test_make_and_remove_user_admin(client, owner_token, regular_user_token):
    headers = {"Authorization": f"Bearer {owner_token['token']}"}

    # Needs to get the phone number of the regular user, which is "5556667778" from conftest
    payload = {"phone_number": "5556667778"}

    # Make admin
    res = client.put("/owner/make-user-admin", headers=headers, json=payload)
    assert res.status_code == 200, res.text
    assert res.json()["admin"]

    # Remove admin
    res = client.put("/owner/remove-user-admin", headers=headers, json=payload)
    assert res.status_code == 200, res.text
    assert not res.json()["admin"]
