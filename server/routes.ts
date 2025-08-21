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
    
    if (data["Error Message"] || data["Note"]) {
      throw new Error(data["Error Message"] || data["Note"]);
    }

    const quote = data["Global Quote"];
    if (!quote) {
      throw new Error("No data available");
    }

    return {
      symbol: quote["01. symbol"],
      price: parseFloat(quote["05. price"]),
      change: parseFloat(quote["09. change"]),
      changePercent: parseFloat(quote["10. change percent"].replace("%", "")),
      volume: quote["06. volume"],
      open: parseFloat(quote["02. open"]),
      high: parseFloat(quote["03. high"]),
      low: parseFloat(quote["04. low"]),
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

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get all stocks in watchlist with live data
  app.get("/api/stocks", async (req, res) => {
    try {
      const watchlist = await storage.getWatchlist();
      const stocks = [];

      for (const item of watchlist) {
        try {
          const liveData = await fetchAlphaVantageData(item.symbol);
          const overview = await fetchCompanyOverview(item.symbol);
          
          const stockData = {
            ...liveData,
            name: overview.name,
            marketCap: overview.marketCap,
          };

          // Update or create stock in storage
          await storage.updateStock(item.symbol, stockData) || 
          await storage.createStock(stockData);

          stocks.push(stockData);
        } catch (error) {
          // If live data fails, try to get cached data
          const cachedStock = await storage.getStock(item.symbol);
          if (cachedStock) {
            stocks.push(cachedStock);
          }
        }
      }

      res.json(stocks);
    } catch (error) {
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
      const indices = ["^GSPC", "^IXIC", "^DJI"]; // S&P 500, NASDAQ, DOW
      const indexNames = {
        "^GSPC": "S&P 500",
        "^IXIC": "NASDAQ",
        "^DJI": "DOW JONES"
      };

      const marketData = [];

      for (const index of indices) {
        try {
          const liveData = await fetchAlphaVantageData(index);
          const indexData = {
            name: indexNames[index] || index,
            symbol: index,
            price: liveData.price,
            change: liveData.change,
            changePercent: liveData.changePercent,
          };

          await storage.updateMarketIndex(index, indexData) || 
          await storage.createMarketIndex(indexData);

          marketData.push(indexData);
        } catch (error) {
          // Try cached data
          const cachedIndex = await storage.getMarketIndices();
          const cached = cachedIndex.find(idx => idx.symbol === index);
          if (cached) {
            marketData.push(cached);
          }
        }
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
