from sqlalchemy.orm import Session
from app.models import TokenTransaction
from app.schemas import TransactionCreate

def create_transaction(db: Session, transaction: TransactionCreate):
    db_transaction = TokenTransaction(**transaction.dict())
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

def get_transactions_by_token(db: Session, token_id: int):
    return db.query(TokenTransaction).filter(TokenTransaction.token_id == token_id).all()
