from typing import List, Dict
from decimal import Decimal
from sqlalchemy.orm import Session
from ..models import Portfolio, Position, Transaction, TransactionType
from ..schemas import PortfolioWithStats
from .market_data import market_service


class PortfolioCalculatorService:
    """Service for calculating portfolio metrics and statistics"""

    def calculate_position_from_transactions(self, transactions: List[Transaction]) -> Dict:
        """Calculate current position from list of transactions"""
        if not transactions:
            return {
                "quantity": Decimal('0'),
                "average_price": Decimal('0'),
                "total_invested": Decimal('0')
            }

        total_quantity = Decimal('0')
        total_invested = Decimal('0')

        for transaction in transactions:
            if transaction.transaction_type == TransactionType.BUY:
                total_quantity += transaction.quantity
                total_invested += transaction.total_amount
            elif transaction.transaction_type == TransactionType.SELL:
                # Calculate average price before selling
                if total_quantity > 0:
                    avg_price = total_invested / total_quantity
                    sell_cost = transaction.quantity * avg_price
                    total_invested -= sell_cost
                total_quantity -= transaction.quantity

        # Prevent negative quantities due to data inconsistencies
        if total_quantity < 0:
            total_quantity = Decimal('0')
            total_invested = Decimal('0')

        average_price = total_invested / total_quantity if total_quantity > 0 else Decimal('0')

        return {
            "quantity": total_quantity,
            "average_price": average_price,
            "total_invested": total_invested
        }

    def update_portfolio_positions(self, db: Session, portfolio_id: int):
        """Update all positions for a portfolio based on transactions"""
        # Get all transactions for this portfolio
        transactions = db.query(Transaction).filter(
            Transaction.portfolio_id == portfolio_id
        ).order_by(Transaction.transaction_date).all()

        # Group transactions by symbol
        transactions_by_symbol = {}
        for transaction in transactions:
            if transaction.symbol not in transactions_by_symbol:
                transactions_by_symbol[transaction.symbol] = []
            transactions_by_symbol[transaction.symbol].append(transaction)

        # Update or create positions
        for symbol, symbol_transactions in transactions_by_symbol.items():
            position_data = self.calculate_position_from_transactions(symbol_transactions)
            
            # Get existing position
            position = db.query(Position).filter(
                Position.portfolio_id == portfolio_id,
                Position.symbol == symbol
            ).first()

            if position_data["quantity"] > 0:
                # Update or create position
                if position:
                    position.quantity = position_data["quantity"]
                    position.average_price = position_data["average_price"]
                    position.total_invested = position_data["total_invested"]
                else:
                    # Get company name from latest transaction
                    latest_transaction = symbol_transactions[-1]
                    position = Position(
                        symbol=symbol,
                        company_name=latest_transaction.company_name,
                        market=latest_transaction.market,
                        quantity=position_data["quantity"],
                        average_price=position_data["average_price"],
                        total_invested=position_data["total_invested"],
                        portfolio_id=portfolio_id
                    )
                    db.add(position)
            else:
                # Remove position if quantity is 0
                if position:
                    db.delete(position)

        db.commit()

    def calculate_portfolio_stats(self, portfolio: Portfolio) -> PortfolioWithStats:
        """Calculate portfolio statistics with current market values"""
        if not portfolio.positions:
            return PortfolioWithStats(
                id=portfolio.id,
                name=portfolio.name,
                description=portfolio.description,
                is_default=portfolio.is_default,
                owner_id=portfolio.owner_id,
                created_at=portfolio.created_at,
                updated_at=portfolio.updated_at,
                total_value=Decimal('0'),
                total_invested=Decimal('0'),
                total_pnl=Decimal('0'),
                total_pnl_percentage=Decimal('0'),
                positions_count=0,
                positions=[]
            )

        # Get current prices for all symbols
        symbols = [pos.symbol for pos in portfolio.positions]
        current_prices = market_service.get_current_prices(symbols)

        total_value = Decimal('0')
        total_invested = Decimal('0')

        for position in portfolio.positions:
            current_price = current_prices.get(position.symbol, Decimal('0'))
            position_value = position.quantity * (current_price or Decimal('0'))
            
            total_value += position_value
            total_invested += position.total_invested

        total_pnl = total_value - total_invested
        total_pnl_percentage = (total_pnl / total_invested * 100) if total_invested > 0 else Decimal('0')

        return PortfolioWithStats(
            id=portfolio.id,
            name=portfolio.name,
            description=portfolio.description,
            is_default=portfolio.is_default,
            owner_id=portfolio.owner_id,
            created_at=portfolio.created_at,
            updated_at=portfolio.updated_at,
            total_value=total_value,
            total_invested=total_invested,
            total_pnl=total_pnl,
            total_pnl_percentage=total_pnl_percentage,
            positions_count=len(portfolio.positions),
            positions=portfolio.positions
        )

    def calculate_position_pnl(self, position: Position, current_price: Decimal) -> Dict:
        """Calculate P&L for a specific position"""
        current_value = position.quantity * current_price
        pnl = current_value - position.total_invested
        pnl_percentage = (pnl / position.total_invested * 100) if position.total_invested > 0 else Decimal('0')

        return {
            "current_price": current_price,
            "current_value": current_value,
            "pnl": pnl,
            "pnl_percentage": pnl_percentage
        }

    def get_portfolio_performance_history(self, portfolio_id: int, period: str = "1y") -> Dict:
        """Get portfolio performance history over time"""
        # This would require storing daily portfolio values
        # For now, return placeholder structure
        return {
            "dates": [],
            "values": [],
            "returns": []
        }


# Global instance
portfolio_calculator = PortfolioCalculatorService()