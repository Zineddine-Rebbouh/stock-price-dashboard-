import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, TrendingUp, Calendar, Clock } from "lucide-react";

const newsItems = [
  {
    id: 1,
    title: "Federal Reserve Signals Potential Rate Cuts Amid Economic Indicators",
    source: "Financial Times",
    time: "2 hours ago",
    category: "Economic Policy",
    trending: true,
    summary: "Latest FOMC meeting minutes suggest policymakers are considering adjustments to interest rates."
  },
  {
    id: 2,
    title: "Technology Sector Shows Strong Earnings Despite Market Volatility",
    source: "Bloomberg",
    time: "4 hours ago", 
    category: "Earnings",
    trending: false,
    summary: "Major tech companies report better-than-expected quarterly results driving sector optimism."
  },
  {
    id: 3,
    title: "Oil Prices Surge on Middle East Supply Concerns",
    source: "Reuters",
    time: "6 hours ago",
    category: "Commodities",
    trending: true,
    summary: "Crude oil futures jump 3% amid geopolitical tensions affecting global supply chains."
  },
  {
    id: 4,
    title: "Cryptocurrency Market Rebounds Following Regulatory Clarity",
    source: "CoinDesk",
    time: "8 hours ago",
    category: "Crypto",
    trending: false,
    summary: "Bitcoin and Ethereum prices rise after favorable regulatory announcements from major economies."
  }
];

export default function MarketNews() {
  return (
    <Card data-testid="market-news">
      <CardHeader className="flex flex-row items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-text">Market News</h3>
        <Badge variant="outline" className="px-3 py-1 text-xs font-medium">
          <Clock className="w-3 h-3 mr-1" />
          Live
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {newsItems.map((news) => (
            <div 
              key={news.id} 
              className="border-l-4 border-finance-blue pl-4 hover:bg-gray-50 transition-colors duration-200 rounded-r-lg p-3 cursor-pointer group"
              data-testid={`news-item-${news.id}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={news.trending ? "default" : "outline"} 
                    className={`text-xs px-2 py-1 ${
                      news.trending 
                        ? 'bg-gain-green bg-opacity-10 text-gain-green' 
                        : 'text-neutral-grey'
                    }`}
                  >
                    {news.trending && <TrendingUp className="w-3 h-3 mr-1" />}
                    {news.category}
                  </Badge>
                </div>
                <ExternalLink className="w-3 h-3 text-neutral-grey group-hover:text-finance-blue transition-colors duration-200" />
              </div>
              
              <h4 className="text-sm font-medium text-slate-text mb-1 group-hover:text-finance-blue transition-colors duration-200">
                {news.title}
              </h4>
              
              <p className="text-xs text-neutral-grey mb-2">
                {news.summary}
              </p>
              
              <div className="flex items-center text-xs text-neutral-grey">
                <span className="font-medium">{news.source}</span>
                <span className="mx-2">•</span>
                <span>{news.time}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <button className="text-sm text-finance-blue hover:text-blue-800 font-medium transition-colors duration-200">
            View All Market News →
          </button>
        </div>
      </CardContent>
    </Card>
  );
}