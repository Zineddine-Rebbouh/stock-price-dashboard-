# StockDash - Frontend Deployment Guide

This guide covers deploying StockDash as a frontend-only application to Vercel, Netlify, or other static hosting platforms.

## Overview

The application has been converted from a full-stack Express.js + React app to a frontend-only React application that:

- Uses Alpha Vantage API directly from the browser
- Stores data in localStorage (no backend database needed)
- Works with static hosting platforms like Vercel
- Maintains all the same functionality with real-time stock data

## Environment Setup

### Required Environment Variables

Create a `.env.local` file in the `client` directory with:

```bash
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
```

**Get your Alpha Vantage API key:**
1. Visit [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Sign up for a free account
3. Copy your API key

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Convert to frontend-only for Vercel deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Set the following build settings:
     - **Framework Preset**: Vite
     - **Root Directory**: `client`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`

3. **Add Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add: `VITE_ALPHA_VANTAGE_API_KEY` with your API key

### Option 2: Netlify

1. **Build Settings:**
   - **Build command**: `cd client && npm run build`
   - **Publish directory**: `client/dist`

2. **Environment Variables:**
   - Add `VITE_ALPHA_VANTAGE_API_KEY` in Site Settings → Environment Variables

### Option 3: GitHub Pages

1. **Build locally:**
   ```bash
   cd client
   npm run build
   ```

2. **Deploy the `client/dist` folder** to your GitHub Pages repository

## Local Development

### Frontend-Only Development

```bash
# Install dependencies
cd client
npm install

# Set up environment
cp ../.env.example .env.local
# Edit .env.local with your Alpha Vantage API key

# Start development server
npm run dev
```

The app will run on `http://localhost:5173` (Vite's default port)

## Key Changes Made

### Architecture Changes
- **Removed Express.js backend** - All API calls now go directly to Alpha Vantage
- **localStorage persistence** - Watchlist and cached data stored in browser
- **Direct API integration** - No proxy server needed
- **Static asset serving** - Can be deployed to any static hosting platform

### File Structure Changes
```
client/
├── src/
│   ├── lib/
│   │   ├── alpha-vantage.ts     # Direct API integration
│   │   ├── local-storage.ts     # Browser storage management
│   │   └── api.ts              # Updated to use localStorage + Alpha Vantage
│   └── hooks/
│       └── use-init-data.ts     # Initialize sample data on load
├── .env.local                   # Environment variables
└── package.json                # Frontend dependencies only
```

### Features Maintained
- ✅ Real-time stock data from Alpha Vantage
- ✅ Market indices tracking
- ✅ Interactive watchlist with add/remove
- ✅ Stock search functionality
- ✅ Professional dashboard interface
- ✅ Market performance analytics
- ✅ News feed and crypto tracking
- ✅ Responsive design

## API Rate Limits

Alpha Vantage free tier provides:
- **25 requests per day**
- **5 requests per minute**

The app handles this by:
- Caching data in localStorage
- Graceful fallback to cached data when limits are reached
- Smart refresh intervals to conserve API calls

## Troubleshooting

### Common Issues

1. **API Key Not Working:**
   - Verify the key is correct in `.env.local`
   - Ensure the file is in the `client` directory
   - Restart the development server after adding the key

2. **CORS Errors:**
   - Alpha Vantage API supports CORS for browser requests
   - If you see CORS errors, check that your API key is valid

3. **Build Failures:**
   - Ensure you're in the `client` directory when running build commands
   - Check that all dependencies are installed: `npm install`

4. **Data Not Persisting:**
   - Data is stored in localStorage and will persist across browser sessions
   - Clear localStorage to reset: `localStorage.clear()` in browser console

## Production Considerations

### Performance Optimizations
- **API call batching** to minimize requests
- **Intelligent caching** with localStorage
- **Error boundaries** for graceful failure handling
- **Loading states** for better user experience

### Security Notes
- API key is exposed in browser (normal for client-side apps)
- Alpha Vantage free tier has built-in rate limiting
- No sensitive user data is stored (only stock symbols)

### Monitoring
- Monitor API usage in Alpha Vantage dashboard
- Consider upgrading to paid Alpha Vantage plan for higher limits
- Track user interactions with browser analytics

## Support

For deployment issues:
1. Check the browser console for errors
2. Verify environment variables are set correctly
3. Ensure API key has sufficient quota remaining
4. Test with sample data if API is unavailable

The application is designed to work offline with cached data, so even if API limits are reached, users can still interact with previously loaded stock information.