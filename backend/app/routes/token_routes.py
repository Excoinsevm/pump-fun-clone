from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Token
from app.schemas import TokenCreate, TokenResponse
from app.crud.token_crud import create_token, get_tokens, get_token_by_id

router = APIRouter()


@router.post("/", response_model=TokenResponse)
def create_new_token(token: TokenCreate, db: Session = Depends(get_db)):
    return create_token(db, token)


@router.get("/", response_model=list[TokenResponse])
def read_tokens(db: Session = Depends(get_db)):
    return get_tokens(db)


@router.get("/{token_id}", response_model=TokenResponse)
def read_token(token_id: int, db: Session = Depends(get_db)):
    token = get_token_by_id(db, token_id)
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    return token
