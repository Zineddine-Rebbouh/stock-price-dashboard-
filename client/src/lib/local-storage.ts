// Local storage utilities for frontend-only deployment
import type { Stock, MarketIndex, WatchlistItem } from "@/types/stock";

const WATCHLIST_KEY = 'stockdash_watchlist';
const STOCKS_KEY = 'stockdash_stocks';
const MARKET_INDICES_KEY = 'stockdash_market_indices';

// Watchlist management
export function getWatchlist(): WatchlistItem[] {
  try {
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading watchlist from localStorage:', error);
    return [];
  }
}

export function addToWatchlist(symbol: string): WatchlistItem {
  const watchlist = getWatchlist();
  const existingItem = watchlist.find(item => item.symbol === symbol);
  
  if (existingItem) {
    return existingItem;
  }
  
  const newItem: WatchlistItem = {
    id: crypto.randomUUID(),
    symbol: symbol.toUpperCase(),
    addedAt: new Date().toISOString()
  };
  
  const updatedWatchlist = [...watchlist, newItem];
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(updatedWatchlist));
  
  return newItem;
}

export function removeFromWatchlist(symbol: string): void {
  const watchlist = getWatchlist();
  const filteredWatchlist = watchlist.filter(item => item.symbol !== symbol);
  localStorage.setItem(WATCHLIST_KEY, JSON.stringify(filteredWatchlist));
}

// Stock data management
export function getStoredStocks(): Stock[] {
  try {
    const stored = localStorage.getItem(STOCKS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading stocks from localStorage:', error);
    return [];
  }
}

export function getStoredStock(symbol: string): Stock | null {
  const stocks = getStoredStocks();
  return stocks.find(stock => stock.symbol === symbol) || null;
}

export function updateStoredStock(stock: Stock): void {
  const stocks = getStoredStocks();
  const existingIndex = stocks.findIndex(s => s.symbol === stock.symbol);
  
  if (existingIndex >= 0) {
    stocks[existingIndex] = { ...stock, lastUpdated: new Date().toISOString() };
  } else {
    stocks.push({ ...stock, lastUpdated: new Date().toISOString() });
  }
  
  localStorage.setItem(STOCKS_KEY, JSON.stringify(stocks));
}

// Market indices management
export function getStoredMarketIndices(): MarketIndex[] {
  try {
    const stored = localStorage.getItem(MARKET_INDICES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading market indices from localStorage:', error);
    return [];
  }
}

export function updateStoredMarketIndices(indices: MarketIndex[]): void {
  const updatedIndices = indices.map(index => ({
    ...index,
    lastUpdated: new Date().toISOString()
  }));
  
  localStorage.setItem(MARKET_INDICES_KEY, JSON.stringify(updatedIndices));
}

// Initialize with sample data if empty
export function initializeSampleData(): void {
  const watchlist = getWatchlist();
  
  if (watchlist.length === 0) {
    const sampleStocks = ['AAPL', 'GOOGL', 'MSFT', 'TSLA'];
    sampleStocks.forEach(symbol => addToWatchlist(symbol));
  }
  
  const indices = getStoredMarketIndices();
  if (indices.length === 0) {
    const sampleIndices: MarketIndex[] = [
      {
        name: "S&P 500",
        symbol: "^GSPC",
        price: "5891.23",
        change: "+15.67",
        changePercent: "+0.27",
        lastUpdated: new Date().toISOString()
      },
      {
        name: "NASDAQ",
        symbol: "^IXIC",
        price: "19456.78",
        change: "+42.35",
        changePercent: "+0.22",
        lastUpdated: new Date().toISOString()
      },
      {
        name: "DOW JONES",
        symbol: "^DJI",
        price: "43987.65",
        change: "-23.45",
        changePercent: "-0.05",
        lastUpdated: new Date().toISOString()
      }
    ];
    
    updateStoredMarketIndices(sampleIndices);
  }
}