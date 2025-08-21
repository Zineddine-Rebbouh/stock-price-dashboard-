import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";
import { stockApi } from "@/lib/api";
import type { MarketIndex } from "@/types/stock";

export default function MarketOverview() {
  const { data: indices, isLoading, error } = useQuery({
    queryKey: ["/api/market-indices"],
    queryFn: stockApi.getMarketIndices,
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-testid="market-overview-loading">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
                <Skeleton className="h-6 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-testid="market-overview-error">
        <Card className="md:col-span-3 p-6">
          <CardContent className="p-0 text-center">
            <p className="text-loss-red">Failed to load market data</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!indices || indices.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-testid="market-overview-empty">
        <Card className="md:col-span-3 p-6">
          <CardContent className="p-0 text-center">
            <p className="text-neutral-grey">No market data available</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8" data-testid="market-overview">
      {indices.map((index: MarketIndex) => {
        const isPositive = parseFloat(index.changePercent) >= 0;
        const formattedPrice = parseFloat(index.price).toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        return (
          <Card key={index.symbol} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6" data-testid={`market-index-${index.symbol}`}>
            <CardContent className="p-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-grey" data-testid={`text-${index.symbol}-name`}>
                    {index.name}
                  </p>
                  <p className="text-2xl font-bold text-slate-text font-mono" data-testid={`text-${index.symbol}-price`}>
                    {formattedPrice}
                  </p>
                </div>
                <div className="text-right">
                  <span 
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      isPositive 
                        ? 'bg-gain-green bg-opacity-10 text-gain-green' 
                        : 'bg-loss-red bg-opacity-10 text-loss-red'
                    }`}
                    data-testid={`text-${index.symbol}-change`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    <span>
                      {isPositive ? '+' : ''}{parseFloat(index.changePercent).toFixed(2)}%
                    </span>
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
