# Pastebin Lite

A production-ready, lightweight pastebin application built with Next.js, PostgreSQL, and Prisma ORM. Share text snippets quickly and securely with optional expiration controls.

## Features

- **Create Pastes**: Share text content with unique, shareable URLs
- **Expiration Controls**: Set time-to-live (TTL) or maximum view limits
- **API & Web Interface**: Both programmatic API access and user-friendly web pages
- **Test Mode**: Deterministic time control for automated testing
- **Production Ready**: Deployed on Vercel with Neon PostgreSQL

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: PostgreSQL (Neon)
- **ORM**: Prisma 7
- **Styling**: Tailwind CSS
- **Testing**: Jest + fast-check (Property-Based Testing)
- **Deployment**: Vercel

## API Endpoints

### Health Check
```
GET /api/healthz
```
Returns database connectivity status.

**Response:**
```json
{ "ok": true }
```

### Create Paste
```
POST /api/pastes
```

**Request Body:**
```json
{
  "content": "Your text content here",
  "ttl": 3600,           // Optional: seconds until expiration
  "max_views": 10        // Optional: maximum API views allowed
}
```

**Response:**
```json
{
  "id": "abc123def456",
  "url": "https://your-domain.com/p/abc123def456"
}
```

### Get Paste
```
GET /api/pastes/:id
```

**Response:**
```json
{
  "id": "abc123def456",
  "content": "Your text content here",
  "created_at": "2024-01-04T12:00:00.000Z",
  "expires_at": "2024-01-04T13:00:00.000Z",
  "max_views": 10,
  "view_count": 3,
  "remaining_views": 7
}
```

**Error Response (404):**
```json
{
  "error": "Paste not found or has expired"
}
```

## Web Interface

### Homepage
- **URL**: `/`
- **Features**: Create new pastes with optional expiration settings
- **Form Fields**: Content (required), TTL (optional), Max Views (optional)

### Paste Viewing
- **URL**: `/p/:id`
- **Features**: View paste content, copy to clipboard, share URL
- **Note**: Does NOT increment view count (only API access does)

### 404 Page
- **URL**: `/p/:id` (when paste not found)
- **Features**: User-friendly error message with possible reasons

## Local Development Setup

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pastebin-lite
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your database connection:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/pastebin_lite"
   TEST_MODE="0"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Push schema to database (for development)
   npm run db:push
   
   # OR run migrations (for production)
   npm run db:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Open in browser**
   ```
   http://localhost:3000
   ```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio

## Database Schema

The application uses a single `pastes` table:

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

### Field Descriptions

- `id`: Unique paste identifier (URL-safe random string)
- `content`: The text content of the paste
- `created_at`: When the paste was created
- `expires_at`: Optional expiration timestamp (TTL-based)
- `max_views`: Optional maximum number of API views
- `view_count`: Current number of API views (incremented by `/api/pastes/:id`)

## Persistence Architecture

### Database Connection
- **Production**: Neon PostgreSQL (serverless)
- **Development**: Local PostgreSQL or Neon
- **Connection Pooling**: Handled by Prisma Client
- **Error Handling**: Comprehensive retry logic and graceful degradation

### Data Persistence
- **No In-Memory Storage**: All data persisted to PostgreSQL
- **Atomic Operations**: View counting uses database transactions
- **Concurrent Safety**: Proper locking prevents race conditions

### Expiration Logic
A paste becomes unavailable when:
1. Current time > `expires_at` (if set), OR
2. `view_count` >= `max_views` (if set)

**Important**: If both TTL and max_views are set, the paste expires when **either** condition is met first.

## Testing

### Test Mode
Set `TEST_MODE=1` to enable deterministic time control:

```bash
# API requests must include this header in test mode
curl -H "x-test-now-ms: 1704369600000" http://localhost:3000/api/pastes
```

### Running Tests
```bash
# Unit tests
npm test

# Property-based tests (100+ iterations each)
npm run test:coverage

# Watch mode
npm run test:watch
```

### Test Types
- **Unit Tests**: Specific examples and edge cases
- **Property-Based Tests**: Universal properties across all inputs
- **Integration Tests**: End-to-end API workflows

## Deployment

### Vercel Deployment

1. **Connect Repository**
   - Import project to Vercel
   - Connect GitHub/GitLab repository

2. **Environment Variables**
   ```env
   DATABASE_URL=your_neon_postgres_url
   TEST_MODE=0
   ```

3. **Database Setup**
   ```bash
   # Run migrations on production database
   npx prisma migrate deploy
   ```

4. **Deploy**
   - Automatic deployment on git push
   - Preview deployments for pull requests

### Neon PostgreSQL Setup

1. **Create Database**
   - Sign up at [neon.tech](https://neon.tech)
   - Create new project
   - Copy connection string

2. **Configure Connection**
   - Add `DATABASE_URL` to Vercel environment variables
   - Update local `.env` for development

## Configuration

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | - | Yes |
| `TEST_MODE` | Enable deterministic time control | `"0"` | No |
| `NEXTAUTH_URL` | Base URL for the application | `http://localhost:3000` | No |

### Validation Limits

| Setting | Value | Description |
|---------|-------|-------------|
| Max Content Length | 1MB | Maximum paste content size |
| Min TTL | 60 seconds | Minimum expiration time |
| Max TTL | 1 year | Maximum expiration time |
| Max Views | 1,000,000 | Maximum view limit |

## Security

### XSS Prevention
- All user content is HTML-escaped
- React JSX provides automatic escaping
- Content sanitization in validation layer

### Input Validation
- Comprehensive server-side validation
- Type checking and range validation
- Malicious input handling

### Rate Limiting
- Basic abuse prevention
- Content length limits
- Graceful error handling

## API Usage Examples

### Create a Simple Paste
```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "Hello, World!"}'
```

### Create Paste with Expiration
```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "This expires in 1 hour",
    "ttl": 3600
  }'
```

### Create Paste with View Limit
```bash
curl -X POST http://localhost:3000/api/pastes \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Limited to 5 views",
    "max_views": 5
  }'
```

### Retrieve Paste
```bash
curl http://localhost:3000/api/pastes/abc123def456
```

### Health Check
```bash
curl http://localhost:3000/api/healthz
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include steps to reproduce for bugs