from app.core.security import get_password_hash

USERS = [
    {
        "username": "emma_draws",
        "password": get_password_hash("emma123"),
        "email": "emma@doodledict.com",
        "name": "Emma Johnson",
    },
    {
        "username": "noah_art",
        "password": get_password_hash("noah123"),
        "email": "noah@doodledict.com",
        "name": "Noah Williams",
    },
    {
        "username": "lily_sketch",
        "password": get_password_hash("lily123"),
        "email": "lily@doodledict.com",
        "name": "Lily Brown",
    },
    {
        "username": "max_doodle",
        "password": get_password_hash("max123"),
        "email": "max@doodledict.com",
        "name": "Max Turner",
    },
    {
        "username": "sophie_creates",
        "password": get_password_hash("sophie123"),
        "email": "sophie@doodledict.com",
        "name": "Sophie Chen",
    },
    {
        "username": "oliver_paint",
        "password": get_password_hash("oliver123"),
        "email": "oliver@doodledict.com",
        "name": "Oliver Martinez",
    },
    {
        "username": "ava_artist",
        "password": get_password_hash("ava123"),
        "email": "ava@doodledict.com",
        "name": "Ava Patel",
    },
    {
        "username": "lucas_lines",
        "password": get_password_hash("lucas123"),
        "email": "lucas@doodledict.com",
        "name": "Lucas Kim",
    },
    {
        "username": "mia_maker",
        "password": get_password_hash("mia123"),
        "email": "mia@doodledict.com",
        "name": "Mia Garcia",
    },
    {
        "username": "ethan_draw",
        "password": get_password_hash("ethan123"),
        "email": "ethan@doodledict.com",
        "name": "Ethan Singh",
    }
]
