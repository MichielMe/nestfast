from app.api.v1 import auth_router, routines_router, workouts_router
from app.db import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://localhost:8000",
    "http://0.0.0.0:3000",
    "http://0.0.0.0:8000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=600,  # Cache preflight requests for 10 minutes
)


@app.get("/")
def read_root():
    return {"message": "Hello World"}


app.include_router(auth_router)
app.include_router(workouts_router)
app.include_router(routines_router)
