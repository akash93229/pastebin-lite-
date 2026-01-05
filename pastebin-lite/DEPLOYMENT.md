# 🚀 Quick Deployment Guide

## Deploy to Vercel (5 minutes)

### Step 1: Set up Neon Database
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy the connection string (looks like: `postgresql://username:password@host/database`)

### Step 2: Deploy to Vercel
1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Add environment variables:
   ```
   DATABASE_URL=your_neon_connection_string
   TEST_MODE=0
   ```
4. Deploy!

### Step 3: Run Database Migration
After deployment, run this command in Vercel's terminal or locally:
```bash
npx prisma migrate deploy
```

## Test the Deployment

### API Endpoints:
- `GET /api/healthz` - Health check
- `POST /api/pastes` - Create paste
- `GET /api/pastes/:id` - Get paste

### Example API Usage:
```bash
# Create a paste
curl -X POST https://your-app.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello World!"}'

# Get paste
curl https://your-app.vercel.app/api/pastes/PASTE_ID
```

## Local Development (Alternative)

If you want to run locally:

1. **Set up database:**
   ```bash
   # Use a local PostgreSQL or get a free Neon database
   DATABASE_URL="postgresql://user:pass@localhost:5432/pastebin"
   ```

2. **Install and run:**
   ```bash
   npm install
   npm run db:generate
   npm run db:push
   npm run dev
   ```

## Features Included

✅ **Core Functionality:**
- Create pastes with optional TTL and max_views
- View pastes via web interface and API
- Automatic expiration handling

✅ **Production Ready:**
- PostgreSQL persistence (no in-memory storage)
- Proper error handling and validation
- Security measures (XSS prevention)
- Health check endpoint

✅ **Test Compatible:**
- Deterministic time control via `TEST_MODE=1`
- `x-test-now-ms` header support for automated testing

The application is ready for automated testing and production use!