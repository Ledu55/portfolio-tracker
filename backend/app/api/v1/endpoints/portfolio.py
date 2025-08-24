from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....core.database import get_db
from ....models import User, Portfolio
from ....schemas import (
    Portfolio as PortfolioSchema,
    PortfolioCreate,
    PortfolioUpdate,
    PortfolioWithStats
)
from ....services.portfolio_calculator import portfolio_calculator
from ...deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[PortfolioWithStats])
def get_portfolios(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve portfolios for current user"""
    portfolios = db.query(Portfolio).filter(
        Portfolio.owner_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    # Calculate stats for each portfolio
    portfolios_with_stats = []
    for portfolio in portfolios:
        portfolio_stats = portfolio_calculator.calculate_portfolio_stats(portfolio)
        portfolios_with_stats.append(portfolio_stats)
    
    return portfolios_with_stats


@router.post("/", response_model=PortfolioSchema)
def create_portfolio(
    *,
    db: Session = Depends(get_db),
    portfolio_in: PortfolioCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create new portfolio"""
    # If this is the first portfolio, make it default
    existing_portfolios = db.query(Portfolio).filter(
        Portfolio.owner_id == current_user.id
    ).count()
    
    is_default = portfolio_in.is_default or existing_portfolios == 0
    
    # If setting as default, unset other defaults
    if is_default:
        db.query(Portfolio).filter(
            Portfolio.owner_id == current_user.id,
            Portfolio.is_default == True
        ).update({"is_default": False})
    
    portfolio = Portfolio(
        name=portfolio_in.name,
        description=portfolio_in.description,
        owner_id=current_user.id,
        is_default=is_default
    )
    
    db.add(portfolio)
    db.commit()
    db.refresh(portfolio)
    
    return portfolio


@router.get("/{portfolio_id}", response_model=PortfolioWithStats)
def get_portfolio(
    *,
    db: Session = Depends(get_db),
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get portfolio by ID"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    return portfolio_calculator.calculate_portfolio_stats(portfolio)


@router.put("/{portfolio_id}", response_model=PortfolioSchema)
def update_portfolio(
    *,
    db: Session = Depends(get_db),
    portfolio_id: int,
    portfolio_in: PortfolioUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update portfolio"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    # If setting as default, unset other defaults
    if portfolio_in.is_default:
        db.query(Portfolio).filter(
            Portfolio.owner_id == current_user.id,
            Portfolio.id != portfolio_id,
            Portfolio.is_default == True
        ).update({"is_default": False})
    
    # Update portfolio
    update_data = portfolio_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(portfolio, field, value)
    
    db.commit()
    db.refresh(portfolio)
    
    return portfolio


@router.delete("/{portfolio_id}")
def delete_portfolio(
    *,
    db: Session = Depends(get_db),
    portfolio_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Delete portfolio"""
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    # Don't allow deleting if it's the only portfolio
    portfolio_count = db.query(Portfolio).filter(
        Portfolio.owner_id == current_user.id
    ).count()
    
    if portfolio_count <= 1:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete the last portfolio"
        )
    
    db.delete(portfolio)
    db.commit()
    
    return {"message": "Portfolio deleted successfully"}