from app.api.v1 import auth_router, workouts_router
from app.db import Base, engine
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Hello World"}


app.include_router(auth_router)
app.include_router(workouts_router)
