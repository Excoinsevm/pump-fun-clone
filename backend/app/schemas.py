from pydantic import BaseModel
from datetime import datetime
from typing import Optional, List


# create


class TokenCreate(BaseModel):
    name: str
    symbol: str
    description: str
    owner_address: str
    contract_address: str
    logo_url: str
    telegram_url: Optional[str]
    twitter_url: Optional[str]
    website: Optional[str]


class HolderCreate(BaseModel):
    token_id: int
    address: str
    balance: float
    holder_type: str


class TokenHolder(BaseModel):
    address: str
    balance: float
    percentage: float = 0
    holder_type: str  # "BONDING_CURVE", "CREATOR", "NORMAL_USER"

    class Config:
        from_attributes = True


class TokenComment(BaseModel):
    id: int
    token_id: int
    user_address: str
    message: str
    img_url: Optional[str] = None
    date_time: datetime

    class Config:
        orm_mode = True


class TokenDetail(BaseModel):
    id: int
    name: str
    symbol: str
    description: str
    owner_address: str
    contract_address: str
    logo_url: str
    twitter_url: Optional[str] = None
    telegram_url: Optional[str] = None
    website: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class TokenDetailWithHolders(BaseModel):
    id: int
    name: str
    symbol: str
    description: str
    owner_address: str
    contract_address: str
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
    comments: List[TokenComment]

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


class HolderResponse(BaseModel):
    id: int


class TransactionCreate(BaseModel):

    id: int


class CommentCreate(BaseModel):

    token_id: int
    user_address: str
    message: str
    img_url: Optional[str] = None
