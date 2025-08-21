import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Volume2 } from "lucide-react";

const topGainers = [
  { symbol: "NVDA", name: "NVIDIA Corp", change: "+8.45%", price: "$485.67" },
  { symbol: "AMD", name: "Advanced Micro Devices", change: "+5.23%", price: "$142.34" },
  { symbol: "AMZN", name: "Amazon.com Inc", change: "+3.67%", price: "$178.90" }
];

const topLosers = [
  { symbol: "META", name: "Meta Platforms", change: "-4.21%", price: "$324.56" },
  { symbol: "NFLX", name: "Netflix Inc", change: "-3.89%", price: "$451.23" },
  { symbol: "UBER", name: "Uber Technologies", change: "-2.45%", price: "$67.89" }
];

const volumeLeaders = [
  { symbol: "TSLA", name: "Tesla Inc", volume: "89.2M", price: "$323.90" },
  { symbol: "AAPL", name: "Apple Inc", volume: "45.8M", price: "$226.01" },
  { symbol: "SPY", name: "SPDR S&P 500", volume: "78.9M", price: "$588.45" }
];

const sectorPerformance = [
  { name: "Technology", performance: "+1.23%", isPositive: true },
  { name: "Healthcare", performance: "+0.87%", isPositive: true },
  { name: "Financials", performance: "+0.45%", isPositive: true },
  { name: "Energy", performance: "-0.23%", isPositive: false },
  { name: "Real Estate", performance: "-0.78%", isPositive: false }
];

export default function PerformanceAnalytics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Top Gainers & Losers */}
      <Card data-testid="gainers-losers">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-text">Top Movers</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gain-green mb-3 flex items-center">
                <TrendingUp className="w-4 h-4 mr-2" />
                Top Gainers
              </h4>
              <div className="space-y-2">
                {topGainers.map((stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 transition-colors duration-200">
                    <div>
                      <div className="font-mono font-semibold text-finance-blue text-sm" data-testid={`gainer-${stock.symbol}`}>
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-neutral-grey">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-slate-text">{stock.price}</div>
                      <div className="text-xs text-gain-green font-medium">{stock.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-loss-red mb-3 flex items-center">
                <TrendingDown className="w-4 h-4 mr-2" />
                Top Losers
              </h4>
              <div className="space-y-2">
                {topLosers.map((stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 transition-colors duration-200">
                    <div>
                      <div className="font-mono font-semibold text-finance-blue text-sm" data-testid={`loser-${stock.symbol}`}>
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-neutral-grey">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-slate-text">{stock.price}</div>
                      <div className="text-xs text-loss-red font-medium">{stock.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Volume Leaders & Sector Performance */}
      <Card data-testid="volume-sectors">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-text">Market Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-finance-blue mb-3 flex items-center">
                <Volume2 className="w-4 h-4 mr-2" />
                Volume Leaders
              </h4>
              <div className="space-y-2">
                {volumeLeaders.map((stock) => (
                  <div key={stock.symbol} className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 transition-colors duration-200">
                    <div>
                      <div className="font-mono font-semibold text-finance-blue text-sm" data-testid={`volume-${stock.symbol}`}>
                        {stock.symbol}
                      </div>
                      <div className="text-xs text-neutral-grey">{stock.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-sm text-slate-text">{stock.price}</div>
                      <div className="text-xs text-neutral-grey font-medium">{stock.volume}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium text-finance-blue mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                Sector Performance
              </h4>
              <div className="space-y-2">
                {sectorPerformance.map((sector) => (
                  <div key={sector.name} className="flex justify-between items-center py-2 hover:bg-gray-50 rounded px-2 transition-colors duration-200">
                    <div className="text-sm text-slate-text">{sector.name}</div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs font-mono ${
                        sector.isPositive 
                          ? 'text-gain-green border-gain-green' 
                          : 'text-loss-red border-loss-red'
                      }`}
                      data-testid={`sector-${sector.name.toLowerCase().replace(' ', '-')}`}
                    >
                      {sector.performance}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}