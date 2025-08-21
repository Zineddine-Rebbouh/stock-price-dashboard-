# StockDash - Professional Stock Market Dashboard

A comprehensive, real-time stock market dashboard built with React, TypeScript, and Express.js that provides live financial data with a modern, professional interface inspired by Bloomberg Terminal and Yahoo Finance.

![StockDash Preview](https://img.shields.io/badge/Status-Live-brightgreen) ![React](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Alpha%20Vantage](https://img.shields.io/badge/API-Alpha%20Vantage-orange)

## 🚀 Live Demo

Experience the live dashboard with real-time stock data powered by Alpha Vantage API.

## ✨ Features

### Core Functionality
- **Real-Time Stock Data**: Live stock prices, changes, and percentages from Alpha Vantage API
- **Market Indices**: Live S&P 500, NASDAQ, and DOW JONES tracking
- **Interactive Watchlist**: Add/remove stocks with instant search functionality
- **Detailed Stock Views**: Individual stock analysis with comprehensive metrics
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### Advanced Dashboard Components
- **Market Performance Analytics**: Top gainers, losers, and volume leaders
- **Market Sentiment Gauge**: Real-time sentiment scoring with visual indicators
- **Economic Calendar**: Upcoming events and their market impact ratings
- **Portfolio Insights**: Diversification scores, risk levels, and recommendations
- **Market News Feed**: Categorized financial news with trending indicators
- **Crypto Corner**: Bitcoin, Ethereum, and Solana price tracking
- **Sector Performance**: Real-time sector-by-sector market analysis

### Technical Features
- **Professional UI/UX**: Bloomberg Terminal-inspired design with custom color scheme
- **Type Safety**: Full TypeScript implementation across frontend and backend
- **Real-Time Updates**: Automatic data refresh with configurable intervals
- **Error Handling**: Comprehensive error states and fallback mechanisms
- **Performance Optimized**: React Query for efficient data caching and synchronization
- **Accessibility**: ARIA labels and keyboard navigation support

## 🛠 Tech Stack

### Frontend
- **React 18** with functional components and hooks
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for responsive, utility-first styling
- **Radix UI + shadcn/ui** for accessible component primitives
- **TanStack Query** for server state management and caching
- **Wouter** for lightweight client-side routing
- **Lucide React** for consistent iconography

### Backend
- **Node.js** with Express.js framework
- **TypeScript** for full-stack type safety
- **PostgreSQL** with Drizzle ORM for data persistence
- **Session-based authentication** with connect-pg-simple
- **RESTful API** design with proper error handling

### External Integrations
- **Alpha Vantage API** for real-time stock market data
- **PostgreSQL Database** for data persistence and caching
- **Vite** for fast development and optimized builds

## 🎨 Design Philosophy

The dashboard follows a professional financial interface design with:

- **Primary Blue** (#1E40AF): Navigation and primary actions
- **Success Green** (#059669): Positive changes and gains
- **Alert Red** (#DC2626): Negative changes and losses
- **Clean Background** (#F8FAFC): Modern, professional appearance
- **Typography**: Monospace fonts for financial data, clean sans-serif for UI

## 📊 API Integration

### Real-Time Data Sources
- **Stock Quotes**: Alpha Vantage GLOBAL_QUOTE endpoint
- **Company Information**: Alpha Vantage OVERVIEW endpoint
- **Market Indices**: Live tracking of major market indicators
- **Error Handling**: Graceful fallbacks and cached data when APIs are unavailable

### Data Refresh Strategy
- **Stock Prices**: 30-second intervals for active stocks
- **Market Indices**: 5-minute intervals for broader market data
- **Company Data**: Cached with daily refresh cycles
- **Smart Caching**: Reduces API calls while maintaining data freshness

## 🏗 Architecture

### Full-Stack TypeScript
- **Shared Schemas**: Type-safe data models using Drizzle and Zod
- **API Layer**: RESTful endpoints with proper validation
- **Storage Interface**: Abstracted storage layer supporting both PostgreSQL and in-memory options
- **Component Architecture**: Modular, reusable components with clear separation of concerns

### Performance Optimizations
- **React Query**: Intelligent caching and background updates
- **Code Splitting**: Lazy-loaded components for faster initial load
- **Optimistic Updates**: Immediate UI feedback with server synchronization
- **Error Boundaries**: Graceful error handling without full page crashes

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (optional, falls back to in-memory storage)
- Alpha Vantage API key (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stockdash.git
   cd stockdash
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Add your Alpha Vantage API key
   ALPHA_VANTAGE_API_KEY=your_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5000` to view the dashboard

## 📱 Usage

### Adding Stocks to Watchlist
1. Use the search bar to find stocks by symbol (e.g., "AAPL", "GOOGL")
2. Click on search results to add stocks to your watchlist
3. View real-time updates in the stock table

### Dashboard Navigation
- **Market Overview**: Top section shows major market indices
- **Watchlist**: Central table with your tracked stocks
- **Stock Details**: Right panel shows detailed information for selected stocks
- **Market Performance**: Analysis section with gainers, losers, and volume leaders
- **Market Insights**: Sentiment gauge, economic calendar, and portfolio analysis
- **Market Updates**: News feed and cryptocurrency tracking

## 🔒 Security & Privacy

- **API Key Security**: Environment variables for sensitive data
- **Session Management**: Secure session handling with PostgreSQL storage
- **Input Validation**: Zod schemas for runtime type checking
- **Error Handling**: No sensitive information exposed in error messages

## 🌟 What Makes This Special

### Beyond Basic Requirements
This project goes significantly beyond a simple stock price display:

1. **Comprehensive Market Analysis**: Multiple data sources and analytics
2. **Professional UI/UX**: Bloomberg Terminal-inspired design with attention to detail
3. **Real-Time Performance**: Optimized for speed and reliability
4. **Full-Stack Architecture**: Complete application with backend API and database
5. **Production Ready**: Error handling, caching, and performance optimizations
6. **Extensible Design**: Modular architecture for easy feature additions

### Innovation Highlights
- **Multi-Source Data Integration**: Stocks, indices, crypto, and news in one interface
- **Intelligent Caching Strategy**: Balances real-time data with API rate limits
- **Responsive Financial Design**: Professional interface that works on all devices
- **Type-Safe Full Stack**: End-to-end TypeScript implementation

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Alpha Vantage** for providing reliable financial data API
- **Radix UI & shadcn/ui** for accessible component primitives
- **TanStack Query** for excellent server state management
- **Tailwind CSS** for rapid UI development

---

**Built with ❤️ for the financial technology community**