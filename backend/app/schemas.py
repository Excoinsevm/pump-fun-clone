from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


class TokenHolder(BaseModel):
    address: str
    balance: float
    percentage: float
    holder_type: str  # "BONDING_CURVE", "CREATOR", "NORMAL_USER"

    class Config:
        from_attributes = True


class TokenDetail(BaseModel):
    name: str
    symbol: str
    description: str
    contract_address: str
    owner_address: str
    logo_url: str
    twitter_url: Optional[str] = None
    telegram_url: Optional[str] = None
    website: Optional[str] = None
    created_at: datetime
    # market_cap: float
    # bonding_curve_progress: float
    # king_of_hill_progress: float
    # virtual_sol_reserves: float
    # virtual_token_reserves: float
    # real_sol_reserves: float
    # real_token_reserves: float
    # total_supply: float
    holders: List[TokenHolder]

    class Config:
        from_attributes = True


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
