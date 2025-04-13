from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, game, users, dashboard
from app.core.config import settings
from app.db.connection import init_connection_pool, close_all_connections

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_connection_pool()
    yield
    # Shutdown
    close_all_connections()

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(game.router, prefix="/api/game", tags=["Game"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
