import httpx
from typing import List
from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Token, TokenHolder
from app.schemas import TokenCreate, TokenDetail, TokenDetailWithHolders, TokenHolder as TokenHolderSchema, TokenDetail
from app.crud.token_crud import create_token, get_tokens, get_token_by_contract_address
from app.crud.holder_crud import get_holders_by_token
from app.crud.comment_crud import create_comment, get_comments_by_token
from app.schemas import CommentCreate, TokenComment
from app.config import settings


router = APIRouter()


@router.post("/", response_model=TokenDetail)
def create_new_token(token: TokenCreate, db: Session = Depends(get_db)):
    return create_token(db, token)


@router.get("/", response_model=list[TokenDetail])
def read_tokens(db: Session = Depends(get_db)):
    tokens = get_tokens(db)
    return tokens


@router.get("/{contract_address}", response_model=TokenDetailWithHolders)
async def get_token_detail(contract_address: str, db: Session = Depends(get_db)):
    token = get_token_by_contract_address(db, contract_address)
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")
    # Get holder distribution

    holders = get_holders_by_token(db, token_id=token.id, limit=10)
    comments = get_comments_by_token(db, token_id=token.id, limit=10)

    # Calculate additional metrics
    token_detail = TokenDetailWithHolders(
        **token.__dict__,
        holders=[
            TokenHolderSchema(
                address=h.address,
                balance=h.balance,
                percentage=(h.balance / token.total_supply) * 100,
                holder_type=h.holder_type,
            )
            for h in holders
        ],
        comments=[
            TokenComment(
                id=c.id,
                token_id=c.token_id,
                user_address=c.user_address,
                message=c.message,
                img_url=c.img_url,
                date_time=c.date_time
            )
            for c in comments
        ]
    )

    return token_detail


@router.get("/{contract_address}/holders", response_model=List[TokenHolderSchema])
async def get_token_holders(contract_address: str, db: Session = Depends(get_db)):
    token = db.query(Token).filter(Token.contract_address == contract_address).first()
    if not token:
        raise HTTPException(status_code=404, detail="Token not found")

    holders = db.query(TokenHolder).filter(TokenHolder.token_id == token.id).order_by(TokenHolder.balance.desc()).all()

    return [
        TokenHolderSchema(
            address=h.address,
            balance=h.balance,
            percentage=(h.balance / token.total_supply) * 100,
            holder_type=h.holder_type,
        )
        for h in holders
    ]


@router.post("/{contract_address}/comments", response_model=TokenComment)
async def create_new_comment(comment: CommentCreate, db: Session = Depends(get_db)):
    try:

        new_comment = create_comment(db, comment)

        # return {"url": ipfs_url, "hash": ipfs_hash}
        return new_comment

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
