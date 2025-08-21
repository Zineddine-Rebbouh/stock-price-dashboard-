// Direct Alpha Vantage API integration for frontend-only deployment
const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const BASE_URL = 'https://www.alphavantage.co/query';

interface AlphaVantageQuote {
  "01. symbol": string;
  "02. open": string;
  "03. high": string;
  "04. low": string;
  "05. price": string;
  "06. volume": string;
  "07. latest trading day": string;
  "08. previous close": string;
  "09. change": string;
  "10. change percent": string;
}

interface AlphaVantageResponse {
  "Global Quote": AlphaVantageQuote;
}

interface CompanyOverview {
  Symbol: string;
  Name: string;
  MarketCapitalization: string;
  Industry: string;
  Sector: string;
}

export async function fetchStockQuote(symbol: string) {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `${BASE_URL}?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: AlphaVantageResponse = await response.json();
    
    if (!data["Global Quote"] || !data["Global Quote"]["01. symbol"]) {
      throw new Error('Invalid response from Alpha Vantage API');
    }

    const quote = data["Global Quote"];
    
    return {
      symbol: quote["01. symbol"],
      price: quote["05. price"],
      change: quote["09. change"],
      changePercent: quote["10. change percent"].replace('%', ''),
      volume: quote["06. volume"],
      open: quote["02. open"],
      high: quote["03. high"],
      low: quote["04. low"],
      previousClose: quote["08. previous close"],
      latestTradingDay: quote["07. latest trading day"]
    };
  } catch (error) {
    console.error(`Error fetching quote for ${symbol}:`, error);
    throw error;
  }
}

export async function fetchCompanyOverview(symbol: string) {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `${BASE_URL}?function=OVERVIEW&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CompanyOverview = await response.json();
    
    if (!data.Symbol) {
      throw new Error('Invalid company overview response');
    }

    return {
      name: data.Name || symbol,
      marketCap: data.MarketCapitalization || '0',
      industry: data.Industry || 'Unknown',
      sector: data.Sector || 'Unknown'
    };
  } catch (error) {
    console.error(`Error fetching company overview for ${symbol}:`, error);
    // Return basic data if overview fails
    return {
      name: symbol,
      marketCap: '0',
      industry: 'Unknown',
      sector: 'Unknown'
    };
  }
}

export async function searchStocks(query: string) {
  if (!ALPHA_VANTAGE_API_KEY) {
    throw new Error('Alpha Vantage API key not configured');
  }

  const url = `${BASE_URL}?function=SYMBOL_SEARCH&keywords=${query}&apikey=${ALPHA_VANTAGE_API_KEY}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.bestMatches) {
      return data.bestMatches.slice(0, 5).map((match: any) => ({
        symbol: match["1. symbol"],
        name: match["2. name"],
        type: match["3. type"],
        region: match["4. region"],
        currency: match["8. currency"]
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching stocks:', error);
    return [];
  }
}