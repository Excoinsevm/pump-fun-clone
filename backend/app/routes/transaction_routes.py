from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import TokenTransaction
from app.schemas import TransactionCreate, TransactionResponse
from app.crud.transaction_crud import create_transaction, get_transactions_by_token

router = APIRouter()

@router.post("/", response_model=TransactionResponse)
def create_new_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    return create_transaction(db, transaction)

@router.get("/token/{token_id}", response_model=list[TransactionResponse])
def read_transactions_by_token(token_id: int, db: Session = Depends(get_db)):
    return get_transactions_by_token(db, token_id)
