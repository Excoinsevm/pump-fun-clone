from pydantic import BaseModel, HttpUrl
from datetime import datetime
from typing import Optional


class TokenResponse(BaseModel):
    id: int
    symbol: str
    name: str
    owner_address: str
    contract_address: Optional[str]
    description: Optional[str]
    logo_url: Optional[str]
    decimals: int
    status: Optional[str]
    active: bool
    total_supply: Optional[float]
    market_cap: Optional[float]
    price_in_trx: Optional[float]
    volume_24hr: Optional[float]
    pump_percentage: Optional[float]
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        orm_mode = True


class TokenHolderResponse(BaseModel):
    id: int
    token_id: int
    address: str
    balance: float
    percentage: float
    holder_type: str

    class Config:
        orm_mode = True


class TransactionResponse(BaseModel):
    id: int
    token_id: int
    user_address: str
    txn_order_type: str
    from_token_address: str
    to_token_address: str
    from_token_amount: float
    to_token_amount: float
    fee: float
    tx_hash: str
    block_num: int
    tx_date_time: datetime

    class Config:
        orm_mode = True


class CommentResponse(BaseModel):
    id: int
    token_id: int
    user_address: str
    message: str
    date_time: datetime

    class Config:
        orm_mode = True


class TokenCreate(BaseModel):
    name: str
    symbol: str
    description: str
    owner_address: str
    contract_address: str
    logo_url: str
    website: Optional[str]
    telegram_url: Optional[str]
    twitter_url: Optional[str]


class HolderCreate(BaseModel):

    id: int


class HolderResponse(BaseModel):
    id: int


class TransactionCreate(BaseModel):

    id: int


class CommentCreate(BaseModel):

    id: int
