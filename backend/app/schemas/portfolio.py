from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from decimal import Decimal


class PortfolioBase(BaseModel):
    name: str
    description: Optional[str] = None
    is_default: bool = False


class PortfolioCreate(PortfolioBase):
    pass


class PortfolioUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    is_default: Optional[bool] = None


class PositionBase(BaseModel):
    symbol: str
    company_name: Optional[str] = None
    market: str
    quantity: Decimal
    average_price: Decimal
    total_invested: Decimal


class Position(PositionBase):
    id: int
    portfolio_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PortfolioInDBBase(PortfolioBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Portfolio(PortfolioInDBBase):
    positions: List[Position] = []


class PortfolioWithStats(Portfolio):
    total_value: Decimal
    total_invested: Decimal
    total_pnl: Decimal
    total_pnl_percentage: Decimal
    positions_count: int