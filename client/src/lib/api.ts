import { apiRequest } from "./queryClient";

export const stockApi = {
  getStocks: () => fetch("/api/stocks").then(res => res.json()),
  getStock: (symbol: string) => fetch(`/api/stocks/${symbol}`).then(res => res.json()),
  searchStocks: (query: string) => fetch(`/api/stocks/search?q=${encodeURIComponent(query)}`).then(res => res.json()),
  getMarketIndices: () => fetch("/api/market-indices").then(res => res.json()),
  getWatchlist: () => fetch("/api/watchlist").then(res => res.json()),
  addToWatchlist: (symbol: string) => apiRequest("POST", "/api/watchlist", { symbol }),
  removeFromWatchlist: (symbol: string) => apiRequest("DELETE", `/api/watchlist/${symbol}`),
};
