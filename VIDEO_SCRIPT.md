# 🎥 Pastebin Lite - Video Demonstration Script

**Duration**: 5-7 minutes  
**Platform**: Loom  
**Requirements**: Audio + Video (screen recording with voiceover)

---

## 📋 Pre-Recording Checklist

- [ ] Open browser with these tabs:
  1. Live application: https://pastebin-lite-rose.vercel.app
  2. GitHub repository: https://github.com/akash93229/pastebin-lite-
  3. Vercel dashboard (optional)
  4. VS Code with project open
- [ ] Test microphone audio
- [ ] Close unnecessary tabs/applications
- [ ] Have Postman or curl ready for API testing

---

## 🎬 Video Script

### **INTRO (30 seconds)**

**[Screen: Live Application Homepage]**

> "Hello! I'm Akash, and today I'll be walking you through my Pastebin Lite application - a full-stack project built with Next.js 16, PostgreSQL, and Prisma ORM."

> "This is a production-ready pastebin application where users can create, share, and view text snippets with optional expiration controls. Let me show you how it works."

---

### **PART 1: Live Application Demo (2 minutes)**

#### **1.1 Creating a Paste (45 seconds)**

**[Screen: Homepage with form]**

> "First, let's create a paste. I'm on the homepage where we have a clean, user-friendly interface."

**[Action: Type in the content field]**
```
Hello! This is a demo paste for my take-home assignment.
This paste will expire in 60 seconds or after 5 views.
```

> "I'm entering some sample text here. Notice the character counter at the bottom - this helps users track their content length."

**[Action: Fill in expiration fields]**
- TTL: `60` (seconds)
- Max Views: `5`

> "Now I'm setting expiration controls. I'll set the TTL to 60 seconds, meaning this paste will expire after one minute. I'm also setting max views to 5, so it will expire after being viewed 5 times via the API."

**[Action: Click "Create Paste"]**

> "When I click Create Paste, the application generates a unique ID and gives me a shareable URL."

**[Screen: Success message with URL]**

> "Perfect! The paste was created successfully. I can see the paste ID and the shareable URL. Let me copy this URL and view the paste."

#### **1.2 Viewing a Paste (45 seconds)**

**[Action: Click the shareable URL or navigate to it]**

**[Screen: Paste view page]**

> "Here's the paste view page. Notice several things:"

**[Point to each element]**
- "The paste ID at the top"
- "Creation timestamp"
- "Expiration time - showing when it will expire"
- "Current view count"
- "Max views limit"
- "Remaining views"

> "The content is displayed with proper formatting, and I have buttons to copy the content or copy the URL for sharing."

**[Action: Click "Copy Content" button]**

> "I can easily copy the content to my clipboard with one click."

#### **1.3 API Testing (30 seconds)**

**[Screen: Switch to Postman or Terminal]**

> "Now let me demonstrate the API endpoints. I'll use curl to test the API."

**[Action: Run curl command]**
```bash
curl https://pastebin-lite-rose.vercel.app/api/healthz
```

> "First, the health check endpoint confirms our database is connected and healthy."

**[Action: Create paste via API]**
```bash
curl -X POST https://pastebin-lite-rose.vercel.app/api/pastes \
  -H "Content-Type: application/json" \
  -d '{"content": "API test paste", "ttl": 3600}'
```

> "I can create pastes programmatically via the API. This returns the paste ID and URL in JSON format, perfect for automated testing."

---

### **PART 2: Code Walkthrough (3 minutes)**

#### **2.1 Project Structure (30 seconds)**

**[Screen: VS Code - Project root]**

> "Let me show you the code structure. This is a well-organized Next.js application."

**[Action: Expand folders in VS Code]**

> "We have:"
- "The `src/app` directory with our Next.js App Router pages and API routes"
- "The `src/components` folder for reusable React components"
- "The `src/services` layer for business logic"
- "The `src/lib` folder for utilities and database setup"
- "And `prisma` folder for our database schema"

#### **2.2 Database Schema (30 seconds)**

**[Screen: Open `prisma/schema.prisma`]**

> "Here's our database schema. We have a single `Paste` model with all the fields we need:"

**[Highlight each field]**
- "ID as the primary key"
- "Content for the text"
- "Created timestamp"
- "Optional expires_at for time-based expiration"
- "Optional max_views for view-based expiration"
- "View count that increments with each API access"

> "This schema supports both types of expiration - time-based and view-based - and they can work together."

#### **2.3 API Routes (45 seconds)**

**[Screen: Open `src/app/api/pastes/route.ts`]**

> "Let's look at the paste creation endpoint. This is a POST route that:"

**[Scroll through the code]**
- "Validates the incoming JSON request"
- "Checks content, TTL, and max_views parameters"
- "Uses our paste service to create the paste in the database"
- "Returns the paste ID and shareable URL"

**[Screen: Open `src/app/api/pastes/[id]/route.ts`]**

> "The retrieval endpoint is interesting because it uses database transactions to ensure atomic view counting."

**[Highlight the transaction code]**

> "This prevents race conditions when multiple users access the same paste simultaneously. The view count is incremented atomically, ensuring accuracy."

#### **2.4 Service Layer (30 seconds)**

**[Screen: Open `src/services/paste-service.ts`]**

> "I implemented a service layer pattern to separate business logic from API routes. This makes the code more maintainable and testable."

**[Scroll through key methods]**
- "createPaste - handles paste creation with validation"
- "getPasteWithViewIncrement - retrieves and increments view count atomically"
- "isPasteAvailable - checks expiration logic"

> "Notice how the expiration logic checks both time-based and view-based conditions. A paste expires when EITHER condition is met."

#### **2.5 Key Features (45 seconds)**

**[Screen: Open `src/services/time-service.ts`]**

> "One important feature is test mode support. I implemented a time service that allows deterministic time control for automated testing."

**[Highlight the code]**

> "When TEST_MODE is enabled, the application uses the time from the x-test-now-ms header instead of the current time. This makes testing expiration logic predictable and reliable."

**[Screen: Open `src/lib/paste-validation.ts`]**

> "Security is important, so I implemented comprehensive input validation:"
- "Content length limits - maximum 1MB"
- "TTL range validation - between 60 seconds and 1 year"
- "Max views validation - between 1 and 1 million"
- "Content sanitization to prevent XSS attacks"

---

### **PART 3: Deployment & Architecture (1 minute)**

#### **3.1 Deployment Setup (30 seconds)**

**[Screen: Switch to browser - Vercel dashboard or show deployment]**

> "The application is deployed on Vercel with a Neon PostgreSQL database."

**[Show environment variables if possible, or just mention them]**

> "I configured the environment variables for the database connection and test mode. The deployment is fully automated - every push to the main branch triggers a new deployment."

**[Screen: Show GitHub repository]**

> "The code is version controlled on GitHub with a clean commit history showing the development process."

#### **3.2 Architecture Highlights (30 seconds)**

**[Screen: Can show a diagram or just explain]**

> "Let me quickly explain the architecture:"

> "We have a three-layer architecture:"
1. "API Routes handle HTTP requests and responses"
2. "Service Layer contains business logic and validation"
3. "Database Layer uses Prisma ORM for type-safe database access"

> "This separation makes the code maintainable, testable, and scalable."

> "For security, we have:"
- "Input validation on all endpoints"
- "XSS prevention through content sanitization"
- "SQL injection protection via Prisma's parameterized queries"
- "Proper error handling with appropriate HTTP status codes"

---

### **CLOSING (30 seconds)**

**[Screen: Back to live application or GitHub README]**

> "To summarize, this Pastebin Lite application demonstrates:"
- "Full-stack development with Next.js and PostgreSQL"
- "Clean architecture with proper separation of concerns"
- "Security best practices"
- "Production-ready deployment"
- "Support for automated testing"

> "The application is live at pastebin-lite-rose.vercel.app, and the complete source code is available on GitHub."

> "Thank you for watching! I'm happy to answer any questions about the implementation or design decisions."

**[End recording]**

---

## 🎯 Key Points to Emphasize

1. **Production Ready**: Deployed and fully functional
2. **Clean Code**: Well-organized, typed, and documented
3. **Security**: Input validation, XSS prevention, SQL injection protection
4. **Testing Support**: Test mode for automated testing
5. **Scalability**: Service layer pattern, database transactions
6. **User Experience**: Clean UI, proper error handling

---

## 📝 Recording Tips

### **Do's:**
- ✅ Speak clearly and at a moderate pace
- ✅ Show enthusiasm about your work
- ✅ Highlight unique features (test mode, atomic transactions)
- ✅ Demonstrate both UI and API
- ✅ Explain your design decisions
- ✅ Keep it under 7 minutes

### **Don'ts:**
- ❌ Don't rush through the code
- ❌ Don't read code line by line
- ❌ Don't apologize for anything
- ❌ Don't go over 7-8 minutes
- ❌ Don't forget to test audio before recording

---

## 🎬 Loom Recording Steps

1. **Install Loom**: Download from loom.com
2. **Start Recording**: 
   - Choose "Screen + Camera" or "Screen Only"
   - Select "Full Screen" or "Current Tab"
3. **Follow the script above**
4. **End Recording**: Click the Loom icon
5. **Get Link**: 
   - Loom will automatically upload
   - Copy the shareable link
   - Make sure it's set to "Anyone with the link can view"

---

## 📋 Post-Recording Checklist

- [ ] Video is under 8 minutes
- [ ] Audio is clear
- [ ] All features demonstrated
- [ ] Code walkthrough included
- [ ] Link is publicly accessible
- [ ] Link added to submission form

---

## 🔗 What to Submit

**Video Link Format:**
```
https://www.loom.com/share/[your-video-id]
```

**Make sure to:**
1. Set video privacy to "Anyone with the link"
2. Test the link in an incognito window
3. Add the link to your submission form

---

## 💡 Alternative: If Loom Doesn't Work

You can also use:
- **YouTube** (unlisted video)
- **Google Drive** (with public link)
- **Vimeo** (with public link)

Just make sure the link is accessible without login!

---

**Good luck with your recording! You've got this! 🚀**