import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, RefreshCw, TrendingUp, TrendingDown, BarChart3, ArrowUpDown } from "lucide-react";
import { stockApi } from "@/lib/api";
import type { Stock } from "@/types/stock";
import { useToast } from "@/hooks/use-toast";

interface StockTableProps {
  selectedStock: Stock | null;
  onStockSelect: (stock: Stock) => void;
  searchResults: Stock[];
  isSearching: boolean;
}

type SortField = 'symbol' | 'price' | 'change' | 'changePercent';
type SortDirection = 'asc' | 'desc';

export default function StockTable({ selectedStock, onStockSelect, searchResults, isSearching }: StockTableProps) {
  const [sortField, setSortField] = useState<SortField>('symbol');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: stocks, isLoading, error, refetch } = useQuery({
    queryKey: ["/api/stocks"],
    queryFn: stockApi.getStocks,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const addToWatchlistMutation = useMutation({
    mutationFn: (symbol: string) => stockApi.addToWatchlist(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stocks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Success",
        description: "Stock added to watchlist",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add stock to watchlist",
        variant: "destructive",
      });
    },
  });

  const removeFromWatchlistMutation = useMutation({
    mutationFn: (symbol: string) => stockApi.removeFromWatchlist(symbol),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stocks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/watchlist"] });
      toast({
        title: "Success",
        description: "Stock removed from watchlist",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove stock from watchlist",
        variant: "destructive",
      });
    },
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleRefresh = () => {
    refetch();
    toast({
      title: "Refreshing",
      description: "Updating stock data...",
    });
  };

  const handleAddFromSearch = (stock: Stock) => {
    addToWatchlistMutation.mutate(stock.symbol);
  };

  const displayStocks = isSearching ? searchResults : stocks || [];

  const sortedStocks = [...displayStocks].sort((a, b) => {
    let aValue: number | string;
    let bValue: number | string;

    switch (sortField) {
      case 'symbol':
        aValue = a.symbol;
        bValue = b.symbol;
        break;
      case 'price':
        aValue = parseFloat(a.price);
        bValue = parseFloat(b.price);
        break;
      case 'change':
        aValue = parseFloat(a.change);
        bValue = parseFloat(b.change);
        break;
      case 'changePercent':
        aValue = parseFloat(a.changePercent);
        bValue = parseFloat(b.changePercent);
        break;
      default:
        aValue = a.symbol;
        bValue = b.symbol;
    }

    if (typeof aValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue as string)
        : (bValue as string).localeCompare(aValue);
    } else {
      return sortDirection === 'asc' ? aValue - (bValue as number) : (bValue as number) - aValue;
    }
  });

  const SortableHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <TableHead 
      className="cursor-pointer hover:bg-gray-100 transition-colors duration-200" 
      onClick={() => handleSort(field)}
      data-testid={`header-${field}`}
    >
      <div className="flex items-center">
        {children}
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </div>
    </TableHead>
  );

  if (isLoading) {
    return (
      <Card className="xl:col-span-2" data-testid="stock-table-loading">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-text">My Watchlist</h2>
          <div className="flex items-center space-x-3">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <Skeleton className="h-4 w-12" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="xl:col-span-2" data-testid="stock-table-error">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-text">My Watchlist</h2>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-loss-red mb-4">Failed to load stock data</p>
            <Button onClick={handleRefresh} variant="outline" data-testid="button-retry">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="xl:col-span-2" data-testid="stock-table">
      <CardHeader className="flex flex-row items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-text">
          {isSearching ? "Search Results" : "My Watchlist"}
        </h2>
        <div className="flex items-center space-x-3">
          {!isSearching && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-neutral-grey hover:text-slate-text transition-colors duration-200"
              onClick={handleRefresh}
              disabled={isLoading}
              data-testid="button-refresh"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {displayStocks.length === 0 ? (
          <div className="text-center py-8" data-testid="stock-table-empty">
            <p className="text-neutral-grey">
              {isSearching ? "No stocks found" : "No stocks in watchlist. Search for stocks to add them."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <SortableHeader field="symbol">Symbol</SortableHeader>
                  <TableHead>Company</TableHead>
                  <SortableHeader field="price">Price</SortableHeader>
                  <SortableHeader field="change">Change</SortableHeader>
                  <SortableHeader field="changePercent">Change %</SortableHeader>
                  <TableHead>Volume</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedStocks.map((stock) => {
                  const isPositive = parseFloat(stock.changePercent) >= 0;
                  const isSelected = selectedStock?.symbol === stock.symbol;
                  const formattedPrice = parseFloat(stock.price).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  });
                  const formattedChange = parseFloat(stock.change).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  });

                  return (
                    <TableRow
                      key={stock.symbol}
                      className={`hover:bg-gray-50 transition-colors duration-200 cursor-pointer ${
                        isSelected ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => onStockSelect(stock)}
                      data-testid={`stock-row-${stock.symbol}`}
                    >
                      <TableCell>
                        <div className="font-mono font-semibold text-finance-blue" data-testid={`text-${stock.symbol}-symbol`}>
                          {stock.symbol}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium text-slate-text" data-testid={`text-${stock.symbol}-name`}>
                          {stock.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-mono font-semibold text-slate-text" data-testid={`text-${stock.symbol}-price`}>
                          {formattedPrice}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`font-mono ${isPositive ? 'text-gain-green' : 'text-loss-red'}`} data-testid={`text-${stock.symbol}-change`}>
                          {isPositive ? '+' : ''}{formattedChange}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span 
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-mono ${
                            isPositive 
                              ? 'bg-gain-green bg-opacity-10 text-gain-green' 
                              : 'bg-loss-red bg-opacity-10 text-loss-red'
                          }`}
                          data-testid={`text-${stock.symbol}-change-percent`}
                        >
                          {isPositive ? (
                            <TrendingUp className="w-3 h-3 mr-1" />
                          ) : (
                            <TrendingDown className="w-3 h-3 mr-1" />
                          )}
                          {isPositive ? '+' : ''}{parseFloat(stock.changePercent).toFixed(2)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-neutral-grey font-mono" data-testid={`text-${stock.symbol}-volume`}>
                          {stock.volume}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-finance-blue hover:text-blue-800 transition-colors duration-200"
                            onClick={(e) => {
                              e.stopPropagation();
                              onStockSelect(stock);
                            }}
                            data-testid={`button-chart-${stock.symbol}`}
                          >
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                          {isSearching && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-gain-green hover:text-green-800 transition-colors duration-200"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAddFromSearch(stock);
                              }}
                              disabled={addToWatchlistMutation.isPending}
                              data-testid={`button-add-${stock.symbol}`}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
