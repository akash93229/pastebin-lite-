# Development Process & Problem-Solving Approach

## 🤖 AI Assistant Used

**Tool**: Kiro IDE (AI-powered development environment)  
**Note**: Unlike ChatGPT, Kiro provides integrated AI assistance within the IDE, and conversation history is not publicly shareable.

## 📋 Development Approach

### Phase 1: Project Setup & Architecture Design
**Problem**: Setting up a production-ready Next.js application with proper structure

**Approach**:
- Chose Next.js 16 with App Router for modern React patterns
- Selected Prisma ORM for type-safe database access
- Designed clean architecture with service layer separation
- Set up TypeScript for type safety throughout

**Key Decisions**:
- Used PostgreSQL (Neon) for reliable, serverless database
- Implemented service layer pattern for business logic separation
- Created comprehensive type definitions for API contracts

### Phase 2: Core Functionality Implementation
**Problem**: Implementing paste creation and retrieval with expiration logic

**Approach**:
1. **Database Schema Design**
   - Created `pastes` table with all required fields
   - Added indexes for performance
   - Designed for both time-based and view-based expiration

2. **API Endpoints**
   - `POST /api/pastes` - Create paste with validation
   - `GET /api/pastes/:id` - Retrieve with atomic view counting
   - `GET /api/healthz` - Database health monitoring

3. **Expiration Logic**
   - Implemented dual expiration (TTL + max_views)
   - Paste expires when EITHER condition is met
   - Used database transactions for atomic operations

**Challenges Solved**:
- **Concurrent View Counting**: Used Prisma transactions to ensure atomic increments
- **Time Handling**: Implemented test mode for deterministic testing
- **Type Safety**: Created comprehensive TypeScript interfaces

### Phase 3: Web Interface Development
**Problem**: Creating user-friendly interface for paste creation and viewing

**Approach**:
- Built responsive form with Tailwind CSS
- Implemented client-side validation for better UX
- Added copy-to-clipboard functionality
- Created proper error pages (404)

**Key Features**:
- Real-time character count
- Optional expiration settings
- Success feedback with shareable URL
- Metadata display on paste view page

### Phase 4: Security & Validation
**Problem**: Ensuring application security and data integrity

**Approach**:
1. **Input Validation**
   - Server-side validation for all inputs
   - Length limits (1MB max content)
   - Range validation for TTL and max_views

2. **XSS Prevention**
   - Content sanitization
   - React JSX automatic escaping
   - Proper HTML encoding

3. **SQL Injection Protection**
   - Prisma ORM with parameterized queries
   - No raw SQL queries

### Phase 5: Testing Support
**Problem**: Supporting automated testing with deterministic behavior

**Approach**:
- Implemented TEST_MODE environment variable
- Created time service for deterministic time control
- Added `x-test-now-ms` header support
- Ensured consistent API responses

**Implementation**:
```typescript
// Time service for test mode
export function getCurrentTimeForRequest(headers?: Headers): Date {
  if (process.env.TEST_MODE === '1') {
    const testTime = headers?.get('x-test-now-ms')
    return new Date(parseInt(testTime))
  }
  return new Date()
}
```

### Phase 6: Deployment & Configuration
**Problem**: Deploying to Vercel with proper database setup

**Challenges & Solutions**:

1. **Next.js 16 Async Params**
   - Issue: TypeScript errors with route parameters
   - Solution: Updated to use `await params` syntax
   ```typescript
   const { id } = await params  // Next.js 16 requirement
   ```

2. **Prisma Client Generation**
   - Issue: Vercel caching causing outdated client
   - Solution: Added `prisma generate` to build script
   ```json
   "build": "prisma generate && next build"
   ```

3. **Database URL Format**
   - Issue: Incorrect format from Vercel CLI
   - Solution: Cleaned up connection string format
   ```
   postgresql://user:pass@host/db?sslmode=require
   ```

4. **Database Migration**
   - Issue: Tables not created in production
   - Solution: Ran `npx prisma db push` with production credentials

5. **Deployment Protection**
   - Issue: App required authentication
   - Solution: Disabled Vercel deployment protection for public access

## 🏗️ Architecture Decisions

### Service Layer Pattern
**Why**: Separates business logic from API routes
```
API Routes → Services → Database
```

**Benefits**:
- Easier testing
- Code reusability
- Clear separation of concerns

### Database Transactions
**Why**: Ensure atomic view counting
```typescript
await prisma.$transaction(async (tx) => {
  const paste = await tx.paste.findUnique(...)
  await tx.paste.update({ viewCount: { increment: 1 } })
})
```

**Benefits**:
- Prevents race conditions
- Ensures data consistency
- Handles concurrent requests safely

### Type Safety
**Why**: Catch errors at compile time
```typescript
interface CreatePasteRequest {
  content: string
  ttl?: number
  max_views?: number
}
```

**Benefits**:
- Better IDE support
- Fewer runtime errors
- Self-documenting code

## 🧪 Testing Strategy

### Property-Based Testing
- Used fast-check for comprehensive test coverage
- Tested edge cases automatically
- Ensured consistent behavior across inputs

### Test Mode Implementation
- Deterministic time control
- Reproducible test results
- Easy automated testing

## 📊 Performance Optimizations

1. **Connection Pooling**: Prisma handles efficiently
2. **Atomic Operations**: Database transactions
3. **Static Generation**: Homepage pre-rendered
4. **Optimized Queries**: Efficient database operations

## 🔍 Problem-Solving Examples

### Problem 1: View Count Race Condition
**Issue**: Multiple simultaneous requests could cause incorrect view counts

**Solution**: Database transactions
```typescript
return await prisma.$transaction(async (tx) => {
  const paste = await tx.paste.findUnique({ where: { id } })
  const updated = await tx.paste.update({
    where: { id },
    data: { viewCount: { increment: 1 } }
  })
  return formatResponse(updated)
})
```

### Problem 2: Test Mode Time Consistency
**Issue**: Tests need deterministic time for expiration testing

**Solution**: Time service with header support
```typescript
export function getCurrentTimeForRequest(headers?: Headers): Date {
  if (isTestMode()) {
    return new Date(parseInt(headers.get('x-test-now-ms')))
  }
  return new Date()
}
```

### Problem 3: Dual Expiration Logic
**Issue**: Handle both TTL and max_views expiration

**Solution**: Check both conditions
```typescript
function isPasteAvailable(paste: PasteData, currentTime: Date): boolean {
  // Expired by time
  if (paste.expiresAt && currentTime > paste.expiresAt) {
    return false
  }
  // Expired by views
  if (paste.maxViews && paste.viewCount >= paste.maxViews) {
    return false
  }
  return true
}
```

## 📝 Code Quality Practices

1. **Consistent Naming**: camelCase for variables, PascalCase for types
2. **Error Handling**: Comprehensive try-catch blocks
3. **Validation**: Server-side validation for all inputs
4. **Documentation**: Clear comments and README
5. **Type Safety**: Full TypeScript coverage

## 🎯 Final Implementation

**Result**: Production-ready pastebin application with:
- ✅ All required features
- ✅ Clean, maintainable code
- ✅ Comprehensive error handling
- ✅ Security best practices
- ✅ Ready for automated testing
- ✅ Deployed and publicly accessible

**Live URL**: https://pastebin-lite-rose.vercel.app  
**GitHub**: https://github.com/akash93229/pastebin-lite-

---

## 💡 Key Learnings

1. **Next.js 16 Changes**: Async params requirement
2. **Vercel Deployment**: Build script configuration
3. **Database Transactions**: Ensuring data consistency
4. **Test Mode Design**: Deterministic testing approach
5. **Production Deployment**: End-to-end deployment process

This document demonstrates my systematic approach to problem-solving, architectural decisions, and implementation strategy throughout the development process.