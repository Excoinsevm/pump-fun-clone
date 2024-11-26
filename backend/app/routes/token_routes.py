from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.models import Token, TokenHolder
from app.schemas import TokenCreate, TokenDetail, TokenHolder as TokenHolderSchema, TokenDetail
from app.crud.token_crud import create_token, get_tokens, get_token_by_id

router = APIRouter()


@router.post("/", response_model=TokenDetail)
def create_new_token(token: TokenCreate, db: Session = Depends(get_db)):
    return create_token(db, token)


@router.get("/", response_model=list[TokenDetail])
def read_tokens(db: Session = Depends(get_db)):
    return get_tokens(db)


@router.get("/{contract_address}", response_model=TokenDetail)
async def get_token_detail(contract_address: str, db: Session = Depends(get_db)):
    token = db.query(Token).filter(Token.contract_address == contract_address).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    
    # Get holder distribution
    holders = db.query(TokenHolder).filter(
        TokenHolder.token_id == token.id
    ).order_by(TokenHolder.balance.desc()).all()
    
    # Calculate additional metrics
    token_detail = TokenDetail(
        **token.__dict__,
        holders=[TokenHolderSchema(
            address=h.address,
            balance=h.balance,
            percentage=(h.balance / token.total_supply) * 100,
            holder_type=h.holder_type
        ) for h in holders]
    )
    
    return token_detail

@router.get("/{contract_address}/holders", response_model=List[TokenHolderSchema])
async def get_token_holders(contract_address: str, db: Session = Depends(get_db)):
    token = db.query(Token).filter(Token.contract_address == contract_address).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    
    holders = db.query(TokenHolder).filter(
        TokenHolder.token_id == token.id
    ).order_by(TokenHolder.balance.desc()).all()
    
    return [TokenHolderSchema(
        address=h.address,
        balance=h.balance,
        percentage=(h.balance / token.total_supply) * 100,
        holder_type=h.holder_type
    ) for h in holders]
