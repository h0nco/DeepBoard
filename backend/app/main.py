from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from .database import engine, Base
from .routers import boards
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Deepboard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(boards.router)

images_dir = os.path.join(os.path.dirname(__file__), "..", "data", "images")
os.makedirs(images_dir, exist_ok=True)
app.mount("/static/images", StaticFiles(directory=images_dir), name="images")

@app.get("/")
def root():
    return {"message": "Deepboard API"}