import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import type { Stock } from "@/types/stock";

interface StockDetailsProps {
  stock: Stock | null;
}

export default function StockDetails({ stock }: StockDetailsProps) {
  if (!stock) {
    return (
      <div className="xl:col-span-1 space-y-6">
        <Card data-testid="stock-details-empty">
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-text">Stock Details</h3>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <BarChart3 className="h-12 w-12 text-neutral-grey mx-auto mb-4" />
              <p className="text-neutral-grey">Select a stock to view details</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPositive = parseFloat(stock.changePercent) >= 0;
  const formattedPrice = parseFloat(stock.price).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
  const formattedChange = parseFloat(stock.change).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="xl:col-span-1 space-y-6">
      {/* Selected Stock Details */}
      <Card data-testid="stock-details">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-text">Stock Details</h3>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-finance-blue font-mono mb-2" data-testid={`text-${stock.symbol}-symbol`}>
              {stock.symbol}
            </div>
            <div className="text-sm text-neutral-grey mb-1" data-testid={`text-${stock.symbol}-name`}>
              {stock.name}
            </div>
            <div className="text-2xl font-bold text-slate-text font-mono mb-1" data-testid={`text-${stock.symbol}-price`}>
              {formattedPrice}
            </div>
            <div className="flex items-center justify-center">
              <Badge 
                variant={isPositive ? "default" : "destructive"} 
                className={`px-3 py-1 text-sm font-medium font-mono ${
                  isPositive 
                    ? 'bg-gain-green bg-opacity-10 text-gain-green hover:bg-gain-green hover:bg-opacity-20' 
                    : 'bg-loss-red bg-opacity-10 text-loss-red hover:bg-loss-red hover:bg-opacity-20'
                }`}
                data-testid={`text-${stock.symbol}-change-badge`}
              >
                {isPositive ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {isPositive ? '+' : ''}{formattedChange} ({isPositive ? '+' : ''}{parseFloat(stock.changePercent).toFixed(2)}%)
              </Badge>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Key Metrics */}
          <div className="space-y-3">
            {stock.open && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-neutral-grey">Open</span>
                <span className="text-sm font-mono text-slate-text" data-testid={`text-${stock.symbol}-open`}>
                  {parseFloat(stock.open).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </div>
            )}
            {stock.high && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-neutral-grey">High</span>
                <span className="text-sm font-mono text-slate-text" data-testid={`text-${stock.symbol}-high`}>
                  {parseFloat(stock.high).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </div>
            )}
            {stock.low && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-neutral-grey">Low</span>
                <span className="text-sm font-mono text-slate-text" data-testid={`text-${stock.symbol}-low`}>
                  {parseFloat(stock.low).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-neutral-grey">Volume</span>
              <span className="text-sm font-mono text-slate-text" data-testid={`text-${stock.symbol}-volume`}>
                {stock.volume}
              </span>
            </div>
            {stock.marketCap && (
              <div className="flex justify-between items-center py-2">
                <span className="text-sm text-neutral-grey">Market Cap</span>
                <span className="text-sm font-mono text-slate-text" data-testid={`text-${stock.symbol}-market-cap`}>
                  {stock.marketCap}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Chart Visualization */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-text">Price Chart</h3>
          <div className="flex space-x-2">
            <Badge variant="default" className="px-3 py-1 text-xs font-medium bg-finance-blue text-white">
              1D
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium text-neutral-grey hover:bg-gray-100 transition-colors duration-200">
              5D
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium text-neutral-grey hover:bg-gray-100 transition-colors duration-200">
              1M
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs font-medium text-neutral-grey hover:bg-gray-100 transition-colors duration-200">
              1Y
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300" data-testid="chart-placeholder">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-neutral-grey mx-auto mb-3" />
              <p className="text-neutral-grey text-sm">Interactive Price Chart</p>
              <p className="text-xs text-gray-400 mt-1">Chart visualization coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* News Section */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-text">Latest News</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" data-testid="news-section">
            <div className="border-l-4 border-finance-blue pl-4">
              <h4 className="text-sm font-medium text-slate-text mb-1">
                {stock.name} Reports Strong Quarterly Results
              </h4>
              <p className="text-xs text-neutral-grey">2 hours ago • Financial News</p>
            </div>
            <div className="border-l-4 border-finance-blue pl-4">
              <h4 className="text-sm font-medium text-slate-text mb-1">
                Analyst Upgrades {stock.symbol} to Buy Rating
              </h4>
              <p className="text-xs text-neutral-grey">4 hours ago • Market Analysis</p>
            </div>
            <div className="border-l-4 border-finance-blue pl-4">
              <h4 className="text-sm font-medium text-slate-text mb-1">
                {stock.name} Announces New Product Launch
              </h4>
              <p className="text-xs text-neutral-grey">1 day ago • Company News</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
