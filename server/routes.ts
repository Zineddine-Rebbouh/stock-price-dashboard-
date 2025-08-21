import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertStockSchema, insertWatchlistSchema } from "@shared/schema";
import { z } from "zod";

// Alpha Vantage API configuration
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || process.env.VITE_ALPHA_VANTAGE_API_KEY || "demo";
const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

// Helper function to fetch from Alpha Vantage API
async function fetchAlphaVantageData(symbol: string) {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    console.log(`API Response for ${symbol}:`, JSON.stringify(data, null, 2));
    
    if (data["Error Message"] || data["Note"]) {
      throw new Error(data["Error Message"] || data["Note"]);
    }

    const quote = data["Global Quote"];
    if (!quote || Object.keys(quote).length === 0) {
      throw new Error("No data available");
    }

    return {
      symbol: quote["01. symbol"],
      price: quote["05. price"],
      change: quote["09. change"],
      changePercent: quote["10. change percent"].replace("%", ""),
      volume: quote["06. volume"],
      open: quote["02. open"],
      high: quote["03. high"],
      low: quote["04. low"],
    };
  } catch (error) {
    console.error(`Error fetching data for ${symbol}:`, error);
    throw error;
  }
}

// Helper function to fetch company overview
async function fetchCompanyOverview(symbol: string) {
  try {
    const response = await fetch(
      `${ALPHA_VANTAGE_BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
    );
    const data = await response.json();
    
    return {
      name: data.Name || symbol,
      marketCap: data.MarketCapitalization || "N/A",
    };
  } catch (error) {
    console.error(`Error fetching overview for ${symbol}:`, error);
    return {
      name: symbol,
      marketCap: "N/A",
    };
  }
}

// Sample data for demonstration when API fails
const sampleStocks = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "227.52",
    change: "+2.15",
    changePercent: "+0.95",
    volume: "45,123,456",
    open: "225.37",
    high: "228.90",
    low: "224.85",
    marketCap: "3.45T"
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: "178.35",
    change: "-1.25",
    changePercent: "-0.70",
    volume: "28,567,890",
    open: "179.60",
    high: "180.20",
    low: "177.50",
    marketCap: "2.18T"
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corporation",
    price: "425.47",
    change: "+3.82",
    changePercent: "+0.91",
    volume: "32,789,123",
    open: "421.65",
    high: "426.30",
    low: "420.80",
    marketCap: "3.16T"
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    price: "356.78",
    change: "-8.45",
    changePercent: "-2.31",
    volume: "89,456,234",
    open: "365.23",
    high: "367.89",
    low: "354.12",
    marketCap: "1.14T"
  }
];

const sampleIndices = [
  {
    name: "S&P 500",
    symbol: "^GSPC",
    price: "5891.23",
    change: "+15.67",
    changePercent: "+0.27"
  },
  {
    name: "NASDAQ",
    symbol: "^IXIC", 
    price: "19456.78",
    change: "+42.35",
    changePercent: "+0.22"
  },
  {
    name: "DOW JONES",
    symbol: "^DJI",
    price: "43987.65",
    change: "-23.45",
    changePercent: "-0.05"
  }
];

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Initialize with sample data for demonstration
  app.get("/api/init-sample-data", async (req, res) => {
    try {
      // Add sample stocks to watchlist and storage
      for (const stock of sampleStocks) {
        await storage.addToWatchlist({ symbol: stock.symbol });
        await storage.createStock(stock);
      }
      
      // Add sample market indices
      for (const index of sampleIndices) {
        await storage.createMarketIndex(index);
      }
      
      res.json({ message: "Sample data initialized" });
    } catch (error) {
      res.status(500).json({ message: "Failed to initialize sample data" });
    }
  });
  
  // Get all stocks in watchlist with live data
  app.get("/api/stocks", async (req, res) => {
    try {
      const watchlist = await storage.getWatchlist();
      const stocks = [];

      for (const item of watchlist) {
        try {
          // First check if we have cached data
          const cachedStock = await storage.getStock(item.symbol);
          
          // Try to fetch live data
          const liveData = await fetchAlphaVantageData(item.symbol);
          const overview = await fetchCompanyOverview(item.symbol);
          
          const stockData = {
            ...liveData,
            name: overview.name,
            marketCap: overview.marketCap,
          };

          // Update or create stock in storage with live data
          const updatedStock = await storage.updateStock(item.symbol, stockData) || 
                              await storage.createStock(stockData);

          stocks.push(updatedStock);
        } catch (error) {
          console.log(`Live data failed for ${item.symbol}, trying cached data`);
          // If live data fails, try to get cached data
          const cachedStock = await storage.getStock(item.symbol);
          if (cachedStock) {
            stocks.push(cachedStock);
          }
        }
      }

      res.json(stocks);
    } catch (error) {
      console.error("Error in /api/stocks:", error);
      res.status(500).json({ message: "Failed to fetch stocks" });
    }
  });

  // Search stocks
  app.get("/api/stocks/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }

      // First try to search in local storage
      const localResults = await storage.searchStocks(q);
      
      // If no local results and query looks like a symbol, try to fetch from API
      if (localResults.length === 0 && q.length <= 5) {
        try {
          const liveData = await fetchAlphaVantageData(q.toUpperCase());
          const overview = await fetchCompanyOverview(q.toUpperCase());
          
          const stockData = {
            ...liveData,
            name: overview.name,
            marketCap: overview.marketCap,
          };

          // Create or update in storage
          await storage.updateStock(q.toUpperCase(), stockData) || 
          await storage.createStock(stockData);

          return res.json([stockData]);
        } catch (error) {
          // If API fails, return empty results
          return res.json([]);
        }
      }

      res.json(localResults);
    } catch (error) {
      res.status(500).json({ message: "Search failed" });
    }
  });

  // Get specific stock data
  app.get("/api/stocks/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      
      try {
        const liveData = await fetchAlphaVantageData(symbol);
        const overview = await fetchCompanyOverview(symbol);
        
        const stockData = {
          ...liveData,
          name: overview.name,
          marketCap: overview.marketCap,
        };

        // Update or create stock in storage
        const updatedStock = await storage.updateStock(symbol, stockData) || 
                           await storage.createStock(stockData);

        res.json(updatedStock);
      } catch (error) {
        // If live data fails, try cached data
        const cachedStock = await storage.getStock(symbol);
        if (cachedStock) {
          res.json(cachedStock);
        } else {
          res.status(404).json({ message: "Stock not found" });
        }
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch stock data" });
    }
  });

  // Get market indices
  app.get("/api/market-indices", async (req, res) => {
    try {
      // Try to get cached indices first
      const cachedIndices = await storage.getMarketIndices();
      if (cachedIndices.length > 0) {
        return res.json(cachedIndices);
      }

      // If no cached data, use sample data for now
      // Alpha Vantage may have limitations with index symbols
      const marketData = [];
      for (const index of sampleIndices) {
        await storage.createMarketIndex(index);
        marketData.push(index);
      }

      res.json(marketData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch market indices" });
    }
  });

  // Watchlist operations
  app.get("/api/watchlist", async (req, res) => {
    try {
      const watchlist = await storage.getWatchlist();
      res.json(watchlist);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch watchlist" });
    }
  });

  app.post("/api/watchlist", async (req, res) => {
    try {
      const validatedData = insertWatchlistSchema.parse(req.body);
      
      // Check if already in watchlist
      const exists = await storage.isInWatchlist(validatedData.symbol);
      if (exists) {
        return res.status(400).json({ message: "Symbol already in watchlist" });
      }

      const item = await storage.addToWatchlist(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to add to watchlist" });
    }
  });

  app.delete("/api/watchlist/:symbol", async (req, res) => {
    try {
      const { symbol } = req.params;
      const success = await storage.removeFromWatchlist(symbol);
      
      if (!success) {
        return res.status(404).json({ message: "Symbol not found in watchlist" });
      }

      res.json({ message: "Removed from watchlist" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove from watchlist" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
