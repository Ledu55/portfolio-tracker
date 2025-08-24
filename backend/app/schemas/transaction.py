from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime
from decimal import Decimal
from ..models.transaction import TransactionType


class TransactionBase(BaseModel):
    symbol: str
    company_name: Optional[str] = None
    market: str
    transaction_type: TransactionType
    quantity: Decimal
    price: Decimal
    fees: Optional[Decimal] = Decimal('0')
    notes: Optional[str] = None
    transaction_date: datetime


class TransactionCreate(TransactionBase):
    portfolio_id: int


class TransactionUpdate(BaseModel):
    symbol: Optional[str] = None
    company_name: Optional[str] = None
    market: Optional[str] = None
    transaction_type: Optional[TransactionType] = None
    quantity: Optional[Decimal] = None
    price: Optional[Decimal] = None
    fees: Optional[Decimal] = None
    notes: Optional[str] = None
    transaction_date: Optional[datetime] = None


class TransactionInDBBase(TransactionBase):
    id: int
    total_amount: Decimal
    portfolio_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Transaction(TransactionInDBBase):
    pass