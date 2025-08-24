from fastapi import APIRouter

from .endpoints import auth, portfolio, transactions, market_data

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(portfolio.router, prefix="/portfolios", tags=["portfolios"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(market_data.router, prefix="/market", tags=["market-data"])