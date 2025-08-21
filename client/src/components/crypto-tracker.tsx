import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Zap } from "lucide-react";
import { SiBitcoin, SiEthereum } from "react-icons/si";

const cryptoData = [
  {
    symbol: "BTC",
    name: "Bitcoin",
    price: "$67,234.52",
    change: "+2.45%",
    isPositive: true,
    marketCap: "$1.32T",
    volume: "$28.5B",
    icon: SiBitcoin,
    color: "text-orange-500"
  },
  {
    symbol: "ETH", 
    name: "Ethereum",
    price: "$3,856.78",
    change: "+1.87%",
    isPositive: true,
    marketCap: "$463.2B", 
    volume: "$15.8B",
    icon: SiEthereum,
    color: "text-blue-600"
  },
  {
    symbol: "SOL",
    name: "Solana",
    price: "$98.45",
    change: "-0.23%",
    isPositive: false,
    marketCap: "$45.6B",
    volume: "$2.1B",
    icon: null,
    color: "text-purple-600"
  }
];

const cryptoInsights = [
  {
    title: "Market Dominance",
    value: "BTC: 54.2%",
    trend: "stable"
  },
  {
    title: "Fear & Greed Index",
    value: "72 (Greed)",
    trend: "bullish"
  },
  {
    title: "24h Volume",
    value: "$89.2B",
    trend: "up"
  }
];

export default function CryptoTracker() {
  return (
    <Card data-testid="crypto-tracker">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-text flex items-center">
          <Zap className="w-5 h-5 mr-2 text-finance-blue" />
          Crypto Corner
        </h3>
        <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
          Live Prices
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Crypto Prices */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {cryptoData.map((crypto) => {
              const IconComponent = crypto.icon;
              return (
                <div 
                  key={crypto.symbol}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  data-testid={`crypto-${crypto.symbol.toLowerCase()}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {IconComponent ? (
                        <IconComponent className={`w-6 h-6 mr-2 ${crypto.color}`} />
                      ) : (
                        <div className={`w-6 h-6 mr-2 rounded-full ${crypto.color} bg-current opacity-20`}></div>
                      )}
                      <div>
                        <div className="font-mono font-semibold text-slate-text text-sm">
                          {crypto.symbol}
                        </div>
                        <div className="text-xs text-neutral-grey">{crypto.name}</div>
                      </div>
                    </div>
                    {crypto.isPositive ? (
                      <TrendingUp className="w-4 h-4 text-gain-green" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-loss-red" />
                    )}
                  </div>
                  
                  <div className="text-lg font-bold font-mono text-slate-text mb-1">
                    {crypto.price}
                  </div>
                  
                  <div className={`text-sm font-medium font-mono ${
                    crypto.isPositive ? 'text-gain-green' : 'text-loss-red'
                  }`}>
                    {crypto.change}
                  </div>
                  
                  <div className="text-xs text-neutral-grey mt-2">
                    <div>Cap: {crypto.marketCap}</div>
                    <div>Vol: {crypto.volume}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Market Insights */}
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium text-slate-text mb-3">Market Insights</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {cryptoInsights.map((insight, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className="text-xs text-neutral-grey mb-1">{insight.title}</div>
                  <div className="text-sm font-mono font-semibold text-slate-text">
                    {insight.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center pt-4 border-t">
            <button className="text-sm text-finance-blue hover:text-blue-800 font-medium transition-colors duration-200">
              View Full Crypto Dashboard →
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}