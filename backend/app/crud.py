from sqlalchemy.orm import Session
from . import models, schemas
import json

def get_boards(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Board).offset(skip).limit(limit).all()

def get_board(db: Session, board_id: int):
    return db.query(models.Board).filter(models.Board.id == board_id).first()

def create_board(db: Session, board: schemas.BoardCreate):
    db_board = models.Board(name=board.name, data="{}")
    db.add(db_board)
    db.commit()
    db.refresh(db_board)
    return db_board

def update_board(db: Session, board_id: int, board_update: schemas.BoardUpdate):
    db_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if db_board:
        if board_update.name is not None:
            db_board.name = board_update.name
        if board_update.data is not None:
            db_board.data = json.dumps(board_update.data)  # store as string
        db.commit()
        db.refresh(db_board)
    return db_board

def delete_board(db: Session, board_id: int):
    db_board = db.query(models.Board).filter(models.Board.id == board_id).first()
    if db_board:
        db.delete(db_board)
        db.commit()
    return db_board