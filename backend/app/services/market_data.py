import yfinance as yf
from typing import Dict, List, Optional, Tuple
from decimal import Decimal
from datetime import datetime, timedelta


class MarketDataService:
    """Service to fetch market data from various sources"""
    
    def __init__(self):
        self.popular_symbols = {
            "BR": {
                "PETR4.SA": "Petróleo Brasileiro S.A. - Petrobras",
                "VALE3.SA": "Vale S.A.",
                "ITUB4.SA": "Itaú Unibanco Holding S.A.",
                "BBDC4.SA": "Banco Bradesco S.A.",
                "ABEV3.SA": "Ambev S.A.",
                "WEGE3.SA": "WEG S.A.",
                "RENT3.SA": "Localiza Rent a Car S.A.",
                "LREN3.SA": "Lojas Renner S.A.",
                "MGLU3.SA": "Magazine Luiza S.A.",
                "JBSS3.SA": "JBS S.A.",
                "BBAS3.SA": "Banco do Brasil S.A.",
                "SUZB3.SA": "Suzano S.A.",
                "RAIL3.SA": "Rumo S.A.",
                "VIVT3.SA": "Telefônica Brasil S.A.",
                "GGBR4.SA": "Gerdau S.A.",
                "USIM5.SA": "Usinas Siderúrgicas de Minas Gerais S.A.",
                "CCRO3.SA": "CCR S.A.",
                "CIEL3.SA": "Cielo S.A.",
                "HAPV3.SA": "Hapvida Participações e Investimentos S.A.",
                "RADL3.SA": "Raia Drogasil S.A.",
                "PCAR3.SA": "P.A.C. Participações S.A.",
                "KLBN11.SA": "Klabin S.A.",
                "EMBR3.SA": "Embraer S.A.",
                "CSAN3.SA": "Cosan S.A.",
                "NTCO3.SA": "Natura &Co Holding S.A."
            },
            "US": {
                "AAPL": "Apple Inc.",
                "MSFT": "Microsoft Corporation",
                "GOOGL": "Alphabet Inc.",
                "AMZN": "Amazon.com Inc.",
                "TSLA": "Tesla Inc.",
                "META": "Meta Platforms Inc.",
                "NVDA": "NVIDIA Corporation",
                "NFLX": "Netflix Inc.",
                "AMD": "Advanced Micro Devices Inc.",
                "INTC": "Intel Corporation",
                "CRM": "Salesforce Inc.",
                "ORCL": "Oracle Corporation",
                "ADBE": "Adobe Inc.",
                "PYPL": "PayPal Holdings Inc.",
                "DIS": "The Walt Disney Company",
                "UBER": "Uber Technologies Inc.",
                "SPOT": "Spotify Technology S.A.",
                "ZOOM": "Zoom Video Communications Inc.",
                "SQ": "Block Inc.",
                "TWTR": "Twitter Inc.",
                "SNAP": "Snap Inc.",
                "ROKU": "Roku Inc.",
                "SHOP": "Shopify Inc.",
                "COIN": "Coinbase Global Inc.",
                "RBLX": "Roblox Corporation"
            }
        }

    def get_symbol_suggestions(self, market: str, query: str = "") -> List[str]:
        """Get symbol suggestions based on market and query"""
        if market not in self.popular_symbols:
            return []
        
        symbols = self.popular_symbols[market]
        if not query:
            return list(symbols.keys())
        
        query = query.upper()
        matches = []
        
        for symbol, name in symbols.items():
            if query in symbol.upper() or query in name.upper():
                matches.append(symbol)
        
        return matches

    def validate_symbol(self, symbol: str) -> Tuple[bool, str, Optional[Decimal]]:
        """Validate symbol and get current price"""
        try:
            ticker = yf.Ticker(symbol)
            
            # Get historical data first (faster)
            hist = ticker.history(period="1d")
            if hist.empty:
                return False, "Símbolo não encontrado ou sem dados de cotação", None
            
            current_price = Decimal(str(hist['Close'].iloc[-1]))
            
            # Try to get company info (may be slower)
            try:
                info = ticker.info
                company_name = info.get('longName', info.get('shortName', symbol))
            except:
                # If getting info fails, use symbol
                company_name = symbol
            
            return True, company_name, current_price
        except Exception as e:
            return False, f"Erro ao validar símbolo: {str(e)}", None

    def get_current_prices(self, symbols: List[str]) -> Dict[str, Optional[Decimal]]:
        """Get current prices for multiple symbols"""
        prices = {}
        for symbol in symbols:
            try:
                ticker = yf.Ticker(symbol)
                data = ticker.history(period="1d")
                if not data.empty:
                    prices[symbol] = Decimal(str(data['Close'].iloc[-1]))
                else:
                    prices[symbol] = None
            except:
                prices[symbol] = None
        return prices

    def get_historical_data(self, symbol: str, period: str = "6mo") -> Optional[Dict]:
        """Get historical price data for a symbol"""
        try:
            ticker = yf.Ticker(symbol)
            hist = ticker.history(period=period)
            
            if hist.empty:
                return None
            
            return {
                "dates": hist.index.strftime('%Y-%m-%d').tolist(),
                "prices": hist['Close'].tolist(),
                "volumes": hist['Volume'].tolist()
            }
        except Exception:
            return None

    def get_market_summary(self) -> Dict[str, Dict]:
        """Get market summary for major indices"""
        indices = {
            "BR": "^BVSP",  # Bovespa
            "US": "^GSPC"   # S&P 500
        }
        
        summary = {}
        for market, index_symbol in indices.items():
            try:
                ticker = yf.Ticker(index_symbol)
                hist = ticker.history(period="2d")
                
                if len(hist) >= 2:
                    current = hist['Close'].iloc[-1]
                    previous = hist['Close'].iloc[-2]
                    change = current - previous
                    change_pct = (change / previous) * 100
                    
                    summary[market] = {
                        "current": float(current),
                        "change": float(change),
                        "change_percentage": float(change_pct)
                    }
            except:
                summary[market] = {
                    "current": 0,
                    "change": 0,
                    "change_percentage": 0
                }
        
        return summary

    async def get_real_time_price(self, symbol: str) -> Optional[Decimal]:
        """Get real-time price for a symbol (async)"""
        # This would be implemented with a real-time data provider
        # For now, using yfinance as fallback
        try:
            ticker = yf.Ticker(symbol)
            data = ticker.history(period="1d", interval="1m")
            if not data.empty:
                return Decimal(str(data['Close'].iloc[-1]))
        except:
            pass
        return None


# Global instance
market_service = MarketDataService()