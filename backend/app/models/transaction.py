from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Numeric, Enum as SQLEnum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from enum import Enum
from ..core.database import Base


class TransactionType(str, Enum):
    BUY = "buy"
    SELL = "sell"
    DIVIDEND = "dividend"
    SPLIT = "split"


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, nullable=False, index=True)
    company_name = Column(String, nullable=True)
    market = Column(String, nullable=False)  # BR, US, etc
    transaction_type = Column(SQLEnum(TransactionType), nullable=False)
    quantity = Column(Numeric(precision=10, scale=4), nullable=False)
    price = Column(Numeric(precision=10, scale=2), nullable=False)
    total_amount = Column(Numeric(precision=15, scale=2), nullable=False)
    fees = Column(Numeric(precision=10, scale=2), nullable=True, default=0)
    notes = Column(String, nullable=True)
    transaction_date = Column(DateTime(timezone=True), nullable=False)
    portfolio_id = Column(Integer, ForeignKey("portfolios.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    portfolio = relationship("Portfolio", back_populates="transactions")