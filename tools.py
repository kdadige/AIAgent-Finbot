import os
import yfinance as yf
from langchain.tools import tool
from langchain_community.utilities import SerpAPIWrapper
from langchain_community.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper
from langchain_community.tools.yahoo_finance_news import YahooFinanceNewsTool

@tool
def get_stock_fundamentals(ticker: str) -> str:
    """Get current stock price, P/E ratio, market cap, and revenue growth for a ticker."""
    stock = yf.Ticker(ticker)
    info = stock.info
    return {
        "price": info.get("currentPrice"),
        "pe_ratio": info.get("trailingPE"),
        "market_cap": info.get("marketCap"),
        "revenue_growth": info.get("revenueGrowth"),
        "52w_high": info.get("fiftyTwoWeekHigh"),
        "52w_low": info.get("fiftyTwoWeekLow"),
    }

def get_serp_tool():
    serp = SerpAPIWrapper(
        serpapi_api_key=os.getenv("SERPAPI_API_KEY"),
        params={
            "tbm": "nws",     # Search in Google News
            "tbs": "qdr:d",   # Past day (24 hours)
        },
    )

    @tool
    def search_news(query: str) -> str:
        """
        Search last-24h Google News via SerpAPI.
        Returns news results with URLs.
        """
        return serp.run(query)
    
    return search_news

def get_all_tools():
    return [
        get_stock_fundamentals,
        YahooFinanceNewsTool(),
        WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper()),
        get_serp_tool()
    ]
