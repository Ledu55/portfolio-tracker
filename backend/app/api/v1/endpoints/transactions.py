from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from ....core.database import get_db
from ....models import User, Portfolio, Transaction
from ....schemas import (
    Transaction as TransactionSchema,
    TransactionCreate,
    TransactionUpdate
)
from ....services.portfolio_calculator import portfolio_calculator
from ....services.market_data import market_service
from ...deps import get_current_user

router = APIRouter()


@router.get("/", response_model=List[TransactionSchema])
def get_transactions(
    portfolio_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """Retrieve transactions for a portfolio"""
    # Verify portfolio ownership
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    transactions = db.query(Transaction).filter(
        Transaction.portfolio_id == portfolio_id
    ).order_by(Transaction.transaction_date.desc()).offset(skip).limit(limit).all()
    
    return transactions


@router.post("/", response_model=TransactionSchema)
def create_transaction(
    *,
    db: Session = Depends(get_db),
    transaction_in: TransactionCreate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Create new transaction"""
    # Verify portfolio ownership
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == transaction_in.portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    # Validate symbol if company name not provided
    if not transaction_in.company_name:
        is_valid, company_name, _ = market_service.validate_symbol(transaction_in.symbol)
        if not is_valid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid symbol: {transaction_in.symbol}"
            )
        transaction_in.company_name = company_name
    
    # Calculate total amount
    total_amount = transaction_in.quantity * transaction_in.price
    
    transaction = Transaction(
        **transaction_in.dict(),
        total_amount=total_amount
    )
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    
    # Update portfolio positions
    portfolio_calculator.update_portfolio_positions(db, transaction_in.portfolio_id)
    
    return transaction


@router.get("/{transaction_id}", response_model=TransactionSchema)
def get_transaction(
    *,
    db: Session = Depends(get_db),
    transaction_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get transaction by ID"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Verify ownership through portfolio
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == transaction.portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return transaction


@router.put("/{transaction_id}", response_model=TransactionSchema)
def update_transaction(
    *,
    db: Session = Depends(get_db),
    transaction_id: int,
    transaction_in: TransactionUpdate,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Update transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Verify ownership through portfolio
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == transaction.portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Update transaction
    update_data = transaction_in.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(transaction, field, value)
    
    # Recalculate total amount if quantity or price changed
    if 'quantity' in update_data or 'price' in update_data:
        transaction.total_amount = transaction.quantity * transaction.price
    
    db.commit()
    db.refresh(transaction)
    
    # Update portfolio positions
    portfolio_calculator.update_portfolio_positions(db, transaction.portfolio_id)
    
    return transaction


@router.delete("/{transaction_id}")
def delete_transaction(
    *,
    db: Session = Depends(get_db),
    transaction_id: int,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Delete transaction"""
    transaction = db.query(Transaction).filter(
        Transaction.id == transaction_id
    ).first()
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Verify ownership through portfolio
    portfolio = db.query(Portfolio).filter(
        Portfolio.id == transaction.portfolio_id,
        Portfolio.owner_id == current_user.id
    ).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    portfolio_id = transaction.portfolio_id
    db.delete(transaction)
    db.commit()
    
    # Update portfolio positions
    portfolio_calculator.update_portfolio_positions(db, portfolio_id)
    
    return {"message": "Transaction deleted successfully"}