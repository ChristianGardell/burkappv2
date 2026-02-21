
def seed_database():
    try:
        if db.query(models.Users).count() == 0:
            print("Seeding development database with test cases...")

            # This is a dummy hash (pin 111111) for testing purposes. In production, use a secure hash.
            test_pin_hash = get_pin_hash("111111")
            group = models.Groups(name="Automated seed", invite_code="TEST123")
            db.add(group)
            db.flush()

            # Add 2 Admins
            admins = [
                models.Users(
                    name="Christian",
                    group_id=group.id,
                    phone_number="0767116725",
                    hashed_pin=test_pin_hash,
                    admin=True,
                    owner=True,
                    beers=15,
                    total_beers=15,
                ),
                models.Users(
                    name="admin_partner",
                    group_id=group.id,
                    phone_number="0707654321",
                    hashed_pin=test_pin_hash,
                    admin=True,
                    owner=False,
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
                    group_id=group.id,
                )
                db.add(new_user)

            db.commit()
            print("Database seeded successfully.")
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()