def test_get_all_users(client, owner_token, regular_user_token):
    # Owner should be an admin as well. Let's use the owner's token.
    headers = {"Authorization": f"Bearer {owner_token['token']}"}

    res = client.get("/admin/getall", headers=headers)
    assert res.status_code == 200, res.text

    data = res.json()
    assert len(data) == 2  # Owner and Regular User


def test_get_all_users_unauthorized(client, regular_user_token):
    headers = {"Authorization": f"Bearer {regular_user_token['token']}"}

    res = client.get("/admin/getall", headers=headers)
    assert res.status_code in [401, 403], res.text


def test_set_beers_and_stats(client, owner_token, regular_user_token):
    headers = {"Authorization": f"Bearer {owner_token['token']}"}

    # 1. Update the regular user's beers
    payload = {"id": regular_user_token["user_id"], "beers": 5}
    res_set = client.put("/admin/setbeers", headers=headers, json=payload)
    assert res_set.status_code == 200, res_set.text
    assert res_set.json() == True

    # 2. Check the stats (or getall)
    res_getall = client.get("/admin/getall", headers=headers)
    assert res_getall.status_code == 200, res_getall.text

    users_data = res_getall.json()
    # Find the regular user in the list
    regular_user = next(
        u for u in users_data if u["id"] == regular_user_token["user_id"]
    )
    assert regular_user["beers"] == 5
