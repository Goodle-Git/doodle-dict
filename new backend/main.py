from fastapi import FastAPI
from app.api import auth, game, users, dashboard

app = FastAPI()

# Include routers
app.include_router(auth.router)
app.include_router(game.router)
app.include_router(users.router)
app.include_router(dashboard.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
