from sqlalchemy.orm import Session
from app.models import Token
from app.schemas import TokenCreate

def create_token(db: Session, token: TokenCreate):
    data = token.model_dump()
    print(data)
    db_token = Token(**data)
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def get_tokens(db: Session):
    return db.query(Token).all()


def get_token_by_id(db: Session, token_id: int):

    return None