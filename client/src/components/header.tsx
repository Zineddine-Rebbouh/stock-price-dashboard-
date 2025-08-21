import { useState } from "react";
import { Search, Settings, Bell, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { stockApi } from "@/lib/api";

interface HeaderProps {
  onSearch: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <TrendingUp className="text-finance-blue text-2xl mr-3" data-testid="brand-icon" />
              <h1 className="text-xl font-bold text-slate-text" data-testid="brand-name">
                StockDash
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="text-neutral-grey h-4 w-4" />
              </div>
              <Input
                type="text"
                placeholder="Search stocks (e.g., AAPL, GOOGL, TSLA)"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-neutral-grey focus:outline-none focus:ring-2 focus:ring-finance-blue focus:border-transparent"
                data-testid="input-search"
              />
            </form>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neutral-grey hover:text-slate-text transition-colors duration-200"
              data-testid="button-settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon"
              className="text-neutral-grey hover:text-slate-text transition-colors duration-200"
              data-testid="button-notifications"
            >
              <Bell className="h-5 w-5" />
            </Button>
            <Avatar className="h-8 w-8 bg-finance-blue" data-testid="avatar-user">
              <AvatarFallback className="text-white text-sm font-medium">
                JD
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
