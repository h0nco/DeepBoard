from pydantic import BaseModel
from datetime import datetime
from typing import Optional, Any

class BoardBase(BaseModel):
    name: Optional[str] = "Untitled"

class BoardCreate(BoardBase):
    pass

class BoardUpdate(BoardBase):
    data: Optional[Any] = None  # JSON object

class BoardInDB(BoardBase):
    id: int
    data: Any
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True