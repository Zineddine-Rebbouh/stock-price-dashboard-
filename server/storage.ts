import { type Stock, type InsertStock, type MarketIndex, type InsertMarketIndex, type WatchlistItem, type InsertWatchlistItem } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Stock operations
  getStock(symbol: string): Promise<Stock | undefined>;
  getAllStocks(): Promise<Stock[]>;
  createStock(stock: InsertStock): Promise<Stock>;
  updateStock(symbol: string, stock: Partial<InsertStock>): Promise<Stock | undefined>;
  searchStocks(query: string): Promise<Stock[]>;
  
  // Market index operations
  getMarketIndices(): Promise<MarketIndex[]>;
  createMarketIndex(index: InsertMarketIndex): Promise<MarketIndex>;
  updateMarketIndex(symbol: string, index: Partial<InsertMarketIndex>): Promise<MarketIndex | undefined>;
  
  // Watchlist operations
  getWatchlist(): Promise<WatchlistItem[]>;
  addToWatchlist(item: InsertWatchlistItem): Promise<WatchlistItem>;
  removeFromWatchlist(symbol: string): Promise<boolean>;
  isInWatchlist(symbol: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private stocks: Map<string, Stock>;
  private marketIndices: Map<string, MarketIndex>;
  private watchlistItems: Map<string, WatchlistItem>;

  constructor() {
    this.stocks = new Map();
    this.marketIndices = new Map();
    this.watchlistItems = new Map();
  }

  async getStock(symbol: string): Promise<Stock | undefined> {
    return this.stocks.get(symbol.toUpperCase());
  }

  async getAllStocks(): Promise<Stock[]> {
    return Array.from(this.stocks.values());
  }

  async createStock(insertStock: InsertStock): Promise<Stock> {
    const id = randomUUID();
    const stock: Stock = {
      ...insertStock,
      id,
      symbol: insertStock.symbol.toUpperCase(),
      lastUpdated: new Date(),
      open: insertStock.open || null,
      high: insertStock.high || null,
      low: insertStock.low || null,
      marketCap: insertStock.marketCap || null,
    };
    this.stocks.set(stock.symbol, stock);
    return stock;
  }

  async updateStock(symbol: string, updateData: Partial<InsertStock>): Promise<Stock | undefined> {
    const existing = this.stocks.get(symbol.toUpperCase());
    if (!existing) return undefined;

    const updated: Stock = {
      ...existing,
      ...updateData,
      symbol: symbol.toUpperCase(),
      lastUpdated: new Date(),
    };
    this.stocks.set(updated.symbol, updated);
    return updated;
  }

  async searchStocks(query: string): Promise<Stock[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.stocks.values()).filter(
      (stock) =>
        stock.symbol.toLowerCase().includes(searchTerm) ||
        stock.name.toLowerCase().includes(searchTerm)
    );
  }

  async getMarketIndices(): Promise<MarketIndex[]> {
    return Array.from(this.marketIndices.values());
  }

  async createMarketIndex(insertIndex: InsertMarketIndex): Promise<MarketIndex> {
    const id = randomUUID();
    const index: MarketIndex = {
      ...insertIndex,
      id,
      lastUpdated: new Date(),
    };
    this.marketIndices.set(index.symbol, index);
    return index;
  }

  async updateMarketIndex(symbol: string, updateData: Partial<InsertMarketIndex>): Promise<MarketIndex | undefined> {
    const existing = this.marketIndices.get(symbol);
    if (!existing) return undefined;

    const updated: MarketIndex = {
      ...existing,
      ...updateData,
      lastUpdated: new Date(),
    };
    this.marketIndices.set(updated.symbol, updated);
    return updated;
  }

  async getWatchlist(): Promise<WatchlistItem[]> {
    return Array.from(this.watchlistItems.values());
  }

  async addToWatchlist(insertItem: InsertWatchlistItem): Promise<WatchlistItem> {
    const id = randomUUID();
    const item: WatchlistItem = {
      ...insertItem,
      id,
      symbol: insertItem.symbol.toUpperCase(),
      addedAt: new Date(),
    };
    this.watchlistItems.set(item.symbol, item);
    return item;
  }

  async removeFromWatchlist(symbol: string): Promise<boolean> {
    return this.watchlistItems.delete(symbol.toUpperCase());
  }

  async isInWatchlist(symbol: string): Promise<boolean> {
    return this.watchlistItems.has(symbol.toUpperCase());
  }
}

export const storage = new MemStorage();
