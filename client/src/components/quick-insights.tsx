import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Gauge, Calendar, AlertTriangle, TrendingUp, Target, Clock } from "lucide-react";

const marketSentiment = {
  score: 67,
  label: "Bullish",
  description: "Market sentiment remains positive with strong institutional buying"
};

const economicEvents = [
  {
    date: "Today",
    time: "2:00 PM EST",
    event: "FOMC Meeting Minutes",
    impact: "High",
    description: "Federal Reserve policy insights"
  },
  {
    date: "Tomorrow",
    time: "8:30 AM EST", 
    event: "Unemployment Claims",
    impact: "Medium",
    description: "Weekly jobless claims report"
  },
  {
    date: "Friday",
    time: "8:30 AM EST",
    event: "Non-Farm Payrolls",
    impact: "High",
    description: "Monthly employment report"
  }
];

const portfolioInsights = [
  {
    title: "Diversification Score",
    value: "8.5/10",
    status: "Good",
    icon: Target,
    color: "text-gain-green"
  },
  {
    title: "Risk Level",
    value: "Moderate",
    status: "Balanced",
    icon: Gauge,
    color: "text-finance-blue"
  },
  {
    title: "Next Earnings",
    value: "AAPL (Jan 30)",
    status: "Upcoming",
    icon: Calendar,
    color: "text-neutral-grey"
  }
];

export default function QuickInsights() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Market Sentiment */}
      <Card data-testid="market-sentiment">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-text flex items-center">
            <Gauge className="w-5 h-5 mr-2 text-finance-blue" />
            Market Sentiment
          </h3>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="w-24 h-24 rounded-full border-8 border-gray-200">
                <div 
                  className="w-24 h-24 rounded-full border-8 border-gain-green border-t-transparent transform -rotate-90"
                  style={{ 
                    background: `conic-gradient(var(--gain-green) ${marketSentiment.score * 3.6}deg, transparent 0deg)`,
                    borderRadius: '50%'
                  }}
                ></div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-slate-text">{marketSentiment.score}</span>
              </div>
            </div>
            <Badge variant="default" className="bg-gain-green bg-opacity-10 text-gain-green mb-2">
              {marketSentiment.label}
            </Badge>
            <p className="text-xs text-neutral-grey">{marketSentiment.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Economic Calendar */}
      <Card data-testid="economic-calendar">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-text flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-finance-blue" />
            Economic Calendar
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {economicEvents.map((event, index) => (
              <div key={index} className="border-l-4 border-finance-blue pl-3 py-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-slate-text">{event.event}</span>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      event.impact === 'High' 
                        ? 'text-loss-red border-loss-red' 
                        : 'text-neutral-grey'
                    }`}
                  >
                    {event.impact}
                  </Badge>
                </div>
                <div className="text-xs text-neutral-grey flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {event.date} at {event.time}
                </div>
                <p className="text-xs text-neutral-grey mt-1">{event.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Insights */}
      <Card data-testid="portfolio-insights">
        <CardHeader>
          <h3 className="text-lg font-semibold text-slate-text flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-finance-blue" />
            Portfolio Insights
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioInsights.map((insight, index) => {
              const IconComponent = insight.icon;
              return (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <div className="flex items-center">
                    <IconComponent className={`w-4 h-4 mr-3 ${insight.color}`} />
                    <div>
                      <div className="text-sm font-medium text-slate-text">{insight.title}</div>
                      <div className="text-xs text-neutral-grey">{insight.status}</div>
                    </div>
                  </div>
                  <div className="text-sm font-mono text-slate-text">
                    {insight.value}
                  </div>
                </div>
              );
            })}
            
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center p-3 bg-amber-50 rounded-lg border border-amber-200">
                <AlertTriangle className="w-4 h-4 mr-3 text-amber-600" />
                <div>
                  <div className="text-sm font-medium text-amber-800">Recommendation</div>
                  <div className="text-xs text-amber-700">Consider rebalancing tech allocation</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}