from app.core.security import get_password_hash

USERS = [
    {
        "username": "emma_draws",
        "password": get_password_hash("emma123"),
        "email": "emma@kidsdoodle.com",
        "name": "Emma Johnson",
    },
    {
        "username": "noah_art",
        "password": get_password_hash("noah123"),
        "email": "noah@kidsdoodle.com",
        "name": "Noah Williams",
    },
    {
        "username": "lily_sketch",
        "password": get_password_hash("lily123"),
        "email": "lily@kidsdoodle.com",
        "name": "Lily Brown",
    },
    {
        "username": "max_doodle",
        "password": get_password_hash("max123"),
        "email": "max@kidsdoodle.com",
        "name": "Max Turner",
    },
    {
        "username": "sophie_creates",
        "password": get_password_hash("sophie123"),
        "email": "sophie@kidsdoodle.com",
        "name": "Sophie Chen",
    },
    {
        "username": "oliver_paint",
        "password": get_password_hash("oliver123"),
        "email": "oliver@kidsdoodle.com",
        "name": "Oliver Martinez",
    },
    {
        "username": "ava_artist",
        "password": get_password_hash("ava123"),
        "email": "ava@kidsdoodle.com",
        "name": "Ava Patel",
    },
    {
        "username": "lucas_lines",
        "password": get_password_hash("lucas123"),
        "email": "lucas@kidsdoodle.com",
        "name": "Lucas Kim",
    },
    {
        "username": "mia_maker",
        "password": get_password_hash("mia123"),
        "email": "mia@kidsdoodle.com",
        "name": "Mia Garcia",
    },
    {
        "username": "ethan_draw",
        "password": get_password_hash("ethan123"),
        "email": "ethan@kidsdoodle.com",
        "name": "Ethan Singh",
    }
]
