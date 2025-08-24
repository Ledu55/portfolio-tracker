from typing import Any, List, Dict
from fastapi import APIRouter, Depends, HTTPException, Query
from decimal import Decimal

from ....services.market_data import market_service
from ....models import User
from ...deps import get_current_user

router = APIRouter()


@router.get("/symbols/search")
def search_symbols(
    market: str = Query(..., description="Market (BR or US)"),
    query: str = Query("", description="Search query"),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Search for symbol suggestions"""
    suggestions = market_service.get_symbol_suggestions(market, query)
    return {"symbols": suggestions}


@router.get("/symbols/validate/{symbol}")
def validate_symbol(
    symbol: str,
    current_user: User = Depends(get_current_user),
) -> Any:
    """Validate a symbol and get current info"""
    is_valid, company_name, current_price = market_service.validate_symbol(symbol)
    
    if not is_valid:
        raise HTTPException(status_code=400, detail=company_name)
    
    return {
        "symbol": symbol,
        "company_name": company_name,
        "current_price": current_price,
        "is_valid": True
    }


@router.post("/prices/current")
def get_current_prices(
    symbols: List[str],
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get current prices for multiple symbols"""
    prices = market_service.get_current_prices(symbols)
    return {"prices": prices}


@router.get("/prices/historical/{symbol}")
def get_historical_prices(
    symbol: str,
    period: str = Query("6mo", description="Period (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)"),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get historical price data for a symbol"""
    data = market_service.get_historical_data(symbol, period)
    
    if not data:
        raise HTTPException(
            status_code=404,
            detail=f"No historical data found for symbol: {symbol}"
        )
    
    return data


@router.get("/market/summary")
def get_market_summary(
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get market summary for major indices"""
    summary = market_service.get_market_summary()
    return {"market_summary": summary}


@router.get("/symbols/popular")
def get_popular_symbols(
    market: str = Query(..., description="Market (BR or US)"),
    current_user: User = Depends(get_current_user),
) -> Any:
    """Get popular symbols for a market"""
    if market not in market_service.popular_symbols:
        raise HTTPException(status_code=400, detail="Invalid market")
    
    symbols = market_service.popular_symbols[market]
    return {"symbols": symbols}