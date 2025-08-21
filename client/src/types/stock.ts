export interface Stock {
  id: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  volume: string;
  open?: string;
  high?: string;
  low?: string;
  marketCap?: string;
  lastUpdated: Date;
}

export interface MarketIndex {
  id: string;
  name: string;
  symbol: string;
  price: string;
  change: string;
  changePercent: string;
  lastUpdated: Date;
}

export interface WatchlistItem {
  id: string;
  symbol: string;
  addedAt: Date;
}

export interface SearchResult {
  symbol: string;
  name: string;
  price: string;
  changePercent: string;
}
