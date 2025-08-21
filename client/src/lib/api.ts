import { fetchStockQuote, fetchCompanyOverview, searchStocks as alphaVantageSearch } from "./alpha-vantage";
import { 
  getWatchlist, 
  addToWatchlist as addToWatchlistStorage, 
  removeFromWatchlist as removeFromWatchlistStorage,
  getStoredStocks,
  getStoredStock,
  updateStoredStock,
  getStoredMarketIndices,
  updateStoredMarketIndices,
  initializeSampleData
} from "./local-storage";
import type { Stock, MarketIndex, WatchlistItem } from "@/types/stock";

// Stock-related API functions using local storage and Alpha Vantage
export const stockApi = {
  // Get all stocks in watchlist with live data
  getStocks: async (): Promise<Stock[]> => {
    const watchlist = getWatchlist();
    const stocks: Stock[] = [];

    for (const item of watchlist) {
      try {
        // Try to get live data
        const [quote, overview] = await Promise.all([
          fetchStockQuote(item.symbol),
          fetchCompanyOverview(item.symbol)
        ]);
        
        const stock: Stock = {
          symbol: quote.symbol,
          price: quote.price,
          change: quote.change,
          changePercent: quote.changePercent,
          volume: quote.volume,
          open: quote.open,
          high: quote.high,
          low: quote.low,
          name: overview.name,
          marketCap: overview.marketCap,
          industry: overview.industry,
          sector: overview.sector,
          lastUpdated: new Date().toISOString()
        };
        
        // Update local storage
        updateStoredStock(stock);
        stocks.push(stock);
        
      } catch (error) {
        console.log(`Live data failed for ${item.symbol}, using cached data`);
        // Fall back to cached data
        const cachedStock = getStoredStock(item.symbol);
        if (cachedStock) {
          stocks.push(cachedStock);
        }
      }
    }

    return stocks;
  },
  
  // Get individual stock data
  getStock: async (symbol: string): Promise<Stock | null> => {
    try {
      const [quote, overview] = await Promise.all([
        fetchStockQuote(symbol),
        fetchCompanyOverview(symbol)
      ]);
      
      const stock: Stock = {
        symbol: quote.symbol,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        volume: quote.volume,
        open: quote.open,
        high: quote.high,
        low: quote.low,
        name: overview.name,
        marketCap: overview.marketCap,
        industry: overview.industry,
        sector: overview.sector,
        lastUpdated: new Date().toISOString()
      };
      
      updateStoredStock(stock);
      return stock;
      
    } catch (error) {
      console.error(`Error fetching stock data for ${symbol}:`, error);
      return getStoredStock(symbol);
    }
  },
  
  // Add stock to watchlist
  addToWatchlist: async (symbol: string): Promise<WatchlistItem> => {
    return addToWatchlistStorage(symbol);
  },
  
  // Remove stock from watchlist
  removeFromWatchlist: async (symbol: string): Promise<void> => {
    removeFromWatchlistStorage(symbol);
  },
  
  // Get watchlist
  getWatchlist: async (): Promise<WatchlistItem[]> => {
    return getWatchlist();
  },
  
  // Search stocks
  searchStocks: async (query: string): Promise<any[]> => {
    try {
      return await alphaVantageSearch(query);
    } catch (error) {
      console.error('Error searching stocks:', error);
      return [];
    }
  },
  
  // Get market indices
  getMarketIndices: async (): Promise<MarketIndex[]> => {
    const stored = getStoredMarketIndices();
    
    // For now, return stored indices since Alpha Vantage has limitations with index symbols
    // In a production app, you'd want to fetch live index data from a different source
    return stored;
  },
  
  // Initialize sample data
  initSampleData: async (): Promise<{ message: string }> => {
    initializeSampleData();
    return { message: "Sample data initialized" };
  },
};
