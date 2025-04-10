from pydantic import BaseModel

class UserLogin(BaseModel):
    username: str
    password: str

class UserSignup(BaseModel):
    username: str
    password: str
    email: str
    name: str

class PasswordReset(BaseModel):
    email: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict
