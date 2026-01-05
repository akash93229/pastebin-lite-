# 🚀 Pastebin Lite - Production Ready

A modern, full-featured pastebin application built with Next.js 16, PostgreSQL, and Prisma ORM. Share text snippets quickly and securely with optional expiration controls.

## 🌐 Live Demo

**🔗 Live Application**: [https://pastebin-lite-rose.vercel.app](https://pastebin-lite-rose.vercel.app)

## 📸 Screenshots

### Application Interface
![Pastebin Interface](screenshot/Screenshot%20(318).png)

### Database Configuration
![Database Setup](screenshot/Screenshot%20(322).png)

## 🗄️ Database Connection

**Database Provider**: Neon PostgreSQL (Serverless)  
**Connection String**: 
```
postgresql://neondb_owner:npg_aVbu3J7xWPAT@ep-wandering-glitter-a1nftqzz-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

**Database Schema**:
```sql
CREATE TABLE pastes (
  id          TEXT PRIMARY KEY,
  content     TEXT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMP NULL,
  max_views   INTEGER NULL,
  view_count  INTEGER NOT NULL DEFAULT 0
);
```

## ✨ Features

### Core Functionality
- ✅ **Create Pastes** - Store text content with unique shareable URLs
- ✅ **View Pastes** - Access content via shareable links
- ✅ **Time-based Expiration** - Set TTL (time-to-live) in seconds
- ✅ **View-based Expiration** - Set maximum view count limits
- ✅ **Dual Expiration** - Both TTL and max_views can be set simultaneously

### API Endpoints
- `GET /api/healthz` - Database health check
- `POST /api/pastes` - Create new paste
- `GET /api/pastes/:id` - Retrieve paste (increments view count)

### Advanced Features
- 🧪 **Test Mode** - Deterministic time control for automated testing
- 🔒 **Security** - XSS prevention, input validation, SQL injection protection
- ⚡ **Performance** - Database connection pooling, atomic operations
- 🎯 **Type Safety** - Full TypeScript coverage
- 🔄 **Concurrent Safety** - Atomic view counting with database transactions

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 5
- **Styling**: Tailwind CSS 4
- **Hosting**: Vercel
- **Testing**: Jest + Property-Based Testing

## 📋 API Documentation

### Create Paste
```bash
POST /api/pastes
Content-Type: application/json

{
  "content": "Your text here",
  "ttl": 3600,           # Optional: seconds until expiration
  "max_views": 10        # Optional: maximum views allowed
}

# Response: 201 Created
{
  "id": "abc123def456",
  "url": "https://pastebin-lite-rose.vercel.app/p/abc123def456"
}
```

### Get Paste
```bash
GET /api/pastes/:id

# Response: 200 OK
{
  "id": "abc123def456",
  "content": "Your text here",
  "created_at": "2024-01-05T12:00:00.000Z",
  "expires_at": "2024-01-05T13:00:00.000Z",
  "max_views": 10,
  "view_count": 3,
  "remaining_views": 7
}
```

### Health Check
```bash
GET /api/healthz

# Response: 200 OK
{
  "ok": true
}
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database (or use Neon)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/akash93229/pastebin-lite-.git
   cd pastebin-lite-
   ```

2. **Install dependencies**
   ```bash
   cd pastebin-lite
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
   TEST_MODE="0"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database
   npm run db:push
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📦 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm test             # Run tests
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:studio    # Open Prisma Studio
```

## 🧪 Testing

### Test Mode
Set `TEST_MODE=1` to enable deterministic time control:

```bash
# API requests must include this header in test mode
curl -H "x-test-now-ms: 1704369600000" \
     -H "Content-Type: application/json" \
     -X POST http://localhost:3000/api/pastes \
     -d '{"content": "Test paste", "ttl": 60}'
```

### Running Tests
```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
```

## 🏗️ Project Structure

```
pastebin-lite/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── api/          # API routes
│   │   ├── p/[id]/       # Paste viewing pages
│   │   └── page.tsx      # Homepage
│   ├── components/       # React components
│   ├── services/         # Business logic
│   ├── lib/              # Utilities
│   └── types/            # TypeScript types
├── prisma/
│   └── schema.prisma     # Database schema
└── public/               # Static assets
```

## 🔒 Security Features

- **Input Validation** - Comprehensive server-side validation
- **XSS Prevention** - Content sanitization and React JSX escaping
- **SQL Injection Protection** - Prisma ORM with parameterized queries
- **Environment Variables** - Sensitive data properly secured

## 📊 Database Schema

```prisma
model Paste {
  id         String    @id
  content    String
  createdAt  DateTime  @default(now()) @map("created_at")
  expiresAt  DateTime? @map("expires_at")
  maxViews   Int?      @map("max_views")
  viewCount  Int       @default(0) @map("view_count")

  @@map("pastes")
}
```

## 🌐 Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Import project from GitHub
   - Set environment variables:
     - `DATABASE_URL`: Your Neon PostgreSQL connection string
     - `TEST_MODE`: `0`

3. **Run database migration**
   ```bash
   npx prisma db push
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | Yes |
| `TEST_MODE` | Enable deterministic time control (`0` or `1`) | No |

## 💡 Key Features Explained

### Expiration Logic
A paste becomes unavailable when:
1. Current time > `expires_at` (if TTL was set), OR
2. `view_count` >= `max_views` (if max_views was set)

**Important**: If both are set, the paste expires when **either** condition is met first.

### View Counting
- **API Access** (`GET /api/pastes/:id`): Increments view count
- **Web Page Access** (`/p/:id`): Does NOT increment view count
- **Atomic Operations**: Uses database transactions to prevent race conditions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Akash**
- GitHub: [@akash93229](https://github.com/akash93229)
- Live Demo: [pastebin-lite-rose.vercel.app](https://pastebin-lite-rose.vercel.app)

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Database by [Neon](https://neon.tech/)
- Hosted on [Vercel](https://vercel.com/)
- ORM by [Prisma](https://www.prisma.io/)

---

