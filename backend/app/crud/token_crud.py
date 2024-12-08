from sqlalchemy.orm import Session
from app.models import Token
from app.schemas import TokenCreate
from app.crud.holder_crud import create_holder
from app.schemas import HolderCreate


def create_token(db: Session, token: TokenCreate):
    data = token.model_dump()
    db_token = Token(**data)
    
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    create_holder(
        db,
        HolderCreate(**{
            "token_id": db_token.id,
            "address": data["contract_address"],
            "balance": 800000000,
            "holder_type": "BONDING_CURVE",
        }),
    )

    return db_token


def get_tokens(db: Session):
    return db.query(Token).all()


def get_token_by_contract_address(db: Session, contract_address: str):

    return db.query(Token).filter(Token.contract_address == contract_address).first()
