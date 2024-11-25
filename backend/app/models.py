from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Text,
    DateTime,
    Boolean,
    ForeignKey,
    create_engine,
)
from sqlalchemy.orm import relationship, declarative_base
from sqlalchemy.sql import func

Base = declarative_base()

# Token Model
class Token(Base):
    __tablename__ = "tokens"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
    symbol = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    owner_address = Column(String, nullable=False)
    contract_address = Column(String, unique=True, nullable=True)
    logo_url = Column(String, nullable=True)
    telegram_url = Column(String, nullable=True)
    twitter_url = Column(String, nullable=True)
    website = Column(String, nullable=True)
    decimals = Column(Integer, default=18)
    status = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    total_supply = Column(Float, nullable=True)
    market_cap = Column(Float, nullable=True)
    price_in_trx = Column(Float, nullable=True)
    volume_24hr = Column(Float, nullable=True)
    pump_percentage = Column(Float, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    # Relationships
    holders = relationship("TokenHolder", back_populates="token")
    transactions = relationship("TokenTransaction", back_populates="token")
    comments = relationship("TokenComment", back_populates="token")


# TokenHolder Model
class TokenHolder(Base):
    __tablename__ = "token_holders"
    id = Column(Integer, primary_key=True)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    address = Column(String, nullable=False)
    balance = Column(Float, nullable=False)
    percentage = Column(Float, nullable=False)
    holder_type = Column(String, nullable=False)

    # Relationships
    token = relationship("Token", back_populates="holders")


# TokenTransaction Model
class TokenTransaction(Base):
    __tablename__ = "token_transactions"
    id = Column(Integer, primary_key=True)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    user_address = Column(String, nullable=False)
    txn_order_type = Column(String, nullable=False)  # BUY or SELL
    from_token_address = Column(String, nullable=False)
    to_token_address = Column(String, nullable=False)
    from_token_amount = Column(Float, nullable=False)
    to_token_amount = Column(Float, nullable=False)
    fee = Column(Float, nullable=False)
    tx_hash = Column(String, nullable=False, unique=True)
    block_num = Column(Integer, nullable=False)
    tx_date_time = Column(DateTime, nullable=False)

    # Relationships
    token = relationship("Token", back_populates="transactions")


# TokenComment Model
class TokenComment(Base):
    __tablename__ = "token_comments"
    id = Column(Integer, primary_key=True)
    token_id = Column(Integer, ForeignKey("tokens.id"), nullable=False)
    user_address = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    date_time = Column(DateTime, default=func.now())

    # Relationships
    token = relationship("Token", back_populates="comments")
