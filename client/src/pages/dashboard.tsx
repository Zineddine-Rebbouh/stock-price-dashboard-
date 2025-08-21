import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import MarketOverview from "@/components/market-overview";
import StockTable from "@/components/stock-table";
import StockDetails from "@/components/stock-details";
import MarketNews from "@/components/market-news";
import PerformanceAnalytics from "@/components/performance-analytics";
import QuickInsights from "@/components/quick-insights";
import CryptoTracker from "@/components/crypto-tracker";
import { stockApi } from "@/lib/api";
import type { Stock } from "@/types/stock";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [searchResults, setSearchResults] = useState<Stock[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const results = await stockApi.searchStocks(query);
      setSearchResults(results);
      
      if (results.length === 0) {
        toast({
          title: "No Results",
          description: `No stocks found for "${query}"`,
        });
      }
    } catch (error) {
      toast({
        title: "Search Error",
        description: "Failed to search stocks. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    }
  };

  const handleStockSelect = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleClearSearch = () => {
    setIsSearching(false);
    setSearchResults([]);
  };

  return (
    <div className="min-h-screen bg-light-bg" data-testid="dashboard">
      <Header onSearch={handleSearch} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MarketOverview />
        
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">
          <StockTable 
            selectedStock={selectedStock}
            onStockSelect={handleStockSelect}
            searchResults={searchResults}
            isSearching={isSearching}
          />
          
          <StockDetails stock={selectedStock} />
        </div>

        {/* Additional Dashboard Sections */}
        <div className="space-y-12">
          {/* Performance Analytics */}
          <section>
            <h2 className="text-2xl font-bold text-slate-text mb-6">Market Performance</h2>
            <PerformanceAnalytics />
          </section>

          {/* Quick Insights */}
          <section>
            <h2 className="text-2xl font-bold text-slate-text mb-6">Market Insights</h2>
            <QuickInsights />
          </section>

          {/* News and Crypto */}
          <section>
            <h2 className="text-2xl font-bold text-slate-text mb-6">Market Updates</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <MarketNews />
              <CryptoTracker />
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-neutral-grey mb-4 md:mb-0">
              © 2024 StockDash. Market data provided by Alpha Vantage API.
            </div>
            <div className="flex items-center space-x-6 text-sm text-neutral-grey">
              <span>Last updated: <span className="font-mono">{new Date().toLocaleTimeString('en-US')}</span></span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-gain-green rounded-full mr-2 animate-pulse"></div>
                <span>Live Data</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
