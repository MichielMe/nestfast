from .auth import router as auth_router
from .routines import router as routines_router
from .workouts import router as workouts_router

__all__ = ["auth_router", "workouts_router", "routines_router"]
