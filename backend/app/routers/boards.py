from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from .. import crud, schemas, database
import json
import os
import uuid
import aiofiles

router = APIRouter(prefix="/api/boards", tags=["boards"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.BoardInDB])
def read_boards(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    boards = crud.get_boards(db, skip=skip, limit=limit)
    # Convert data from string to dict for response
    for b in boards:
        try:
            b.data = json.loads(b.data)
        except:
            b.data = {}
    return boards

@router.post("/", response_model=schemas.BoardInDB)
def create_board(board: schemas.BoardCreate, db: Session = Depends(get_db)):
    db_board = crud.create_board(db, board)
    db_board.data = {}
    return db_board

@router.get("/{board_id}", response_model=schemas.BoardInDB)
def read_board(board_id: int, db: Session = Depends(get_db)):
    db_board = crud.get_board(db, board_id)
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    try:
        db_board.data = json.loads(db_board.data)
    except:
        db_board.data = {}
    return db_board

@router.put("/{board_id}", response_model=schemas.BoardInDB)
def update_board(board_id: int, board_update: schemas.BoardUpdate, db: Session = Depends(get_db)):
    db_board = crud.update_board(db, board_id, board_update)
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    try:
        db_board.data = json.loads(db_board.data)
    except:
        db_board.data = {}
    return db_board

@router.delete("/{board_id}", response_model=dict)
def delete_board(board_id: int, db: Session = Depends(get_db)):
    db_board = crud.delete_board(db, board_id)
    if db_board is None:
        raise HTTPException(status_code=404, detail="Board not found")
    return {"ok": True}

# Upload image endpoint
@router.post("/upload-image")
async def upload_image(file: UploadFile = File(...)):
    # Save to backend/data/images/
    images_dir = os.path.join(os.path.dirname(database.DATA_DIR), "images")
    os.makedirs(images_dir, exist_ok=True)
    ext = os.path.splitext(file.filename)[1]
    filename = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(images_dir, filename)
    async with aiofiles.open(file_path, 'wb') as out_file:
        content = await file.read()
        await out_file.write(content)
    return {"url": f"/static/images/{filename}"}