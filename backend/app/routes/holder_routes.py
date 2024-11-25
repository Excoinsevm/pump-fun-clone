from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import TokenHolder
from app.schemas import HolderCreate, HolderResponse
from app.crud.holder_crud import create_holder, get_holders_by_token, get_holder_by_id

router = APIRouter()

@router.post("/", response_model=HolderResponse)
def create_new_holder(holder: HolderCreate, db: Session = Depends(get_db)):
    return create_holder(db, holder)

@router.get("/token/{token_id}", response_model=list[HolderResponse])
def read_holders_by_token(token_id: int, db: Session = Depends(get_db)):
    return get_holders_by_token(db, token_id)

@router.get("/{holder_id}", response_model=HolderResponse)
def read_holder(holder_id: int, db: Session = Depends(get_db)):
    holder = get_holder_by_id(db, holder_id)
    if not holder:
        raise HTTPException(status_code=404, detail="Holder not found")
    return holder
