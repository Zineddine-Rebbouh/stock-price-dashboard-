# Simple Vercel Deployment Fix

The easiest way to deploy StockDash to Vercel:

## Method 1: Use the Built Files (Fastest)

1. **Use the already built files:**
   ```bash
   # The files are already built in dist/public/
   ls dist/public/
   ```

2. **Deploy the public folder directly:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Drag and drop the `dist/public` folder
   - Add environment variable: `VITE_ALPHA_VANTAGE_API_KEY` = your API key

## Method 2: Vercel Settings Fix

If using GitHub integration, use these Vercel settings:

- **Framework Preset**: Other
- **Root Directory**: Leave empty (use root)
- **Build Command**: `npm run build`  
- **Output Directory**: `dist/public`

## Method 3: Copy Frontend Files

```bash
# Create a clean frontend-only folder
mkdir stockdash-frontend
cp -r client/* stockdash-frontend/
cd stockdash-frontend

# Update package.json build script to output to dist (not ../dist/public)
# Then deploy normally with Vite preset
```

The app will work with real Alpha Vantage data once you add your API key!