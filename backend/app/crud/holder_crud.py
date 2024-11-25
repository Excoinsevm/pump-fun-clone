from sqlalchemy.orm import Session
from app.models import TokenHolder
from app.schemas import HolderCreate

def create_holder(db: Session, holder: HolderCreate):
    db_holder = TokenHolder(**holder.dict())
    db.add(db_holder)
    db.commit()
    db.refresh(db_holder)
    return db_holder

def get_holders_by_token(db: Session, token_id: int):
    return db.query(TokenHolder).filter(TokenHolder.token_id == token_id).all()

def get_holder_by_id(db: Session, holder_id: int):
    return db.query(TokenHolder).filter(TokenHolder.id == holder_id).first()
