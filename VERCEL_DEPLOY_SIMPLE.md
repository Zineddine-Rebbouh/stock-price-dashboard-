# Quick Vercel Deployment Guide

## Fastest Way to Deploy StockDash to Vercel

### Option 1: Direct Client Folder Deploy (Recommended)

1. **Prepare the client folder:**
   ```bash
   cd client
   npm install
   npm run build
   ```

2. **Deploy directly to Vercel:**
   - Install Vercel CLI: `npm i -g vercel`
   - From the `client` directory: `vercel --prod`
   - Or drag and drop the `client/dist` folder to [vercel.com/new](https://vercel.com/new)

3. **Add Environment Variable:**
   - In Vercel dashboard: Settings → Environment Variables
   - Add: `VITE_ALPHA_VANTAGE_API_KEY` = your Alpha Vantage API key

### Option 2: GitHub Integration

1. **Create new repo with just the client folder:**
   ```bash
   # Create a new repository with only the client code
   mkdir stockdash-frontend
   cp -r client/* stockdash-frontend/
   cd stockdash-frontend
   git init
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your new repository
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build` (default)
   - Output Directory: `dist` (default)

3. **Add Environment Variable:**
   - Add: `VITE_ALPHA_VANTAGE_API_KEY` = your Alpha Vantage API key

### Troubleshooting

If you get "No Output Directory" error:
- Make sure you're deploying from the `client` folder
- Or copy `client/dist` contents to root after building
- Ensure `dist` folder exists after build

The app will be live at: `https://your-project-name.vercel.app`