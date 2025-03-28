from .auth import router as auth_router
from .workouts import router as workouts_router

__all__ = ["auth_router", "workouts_router"]
