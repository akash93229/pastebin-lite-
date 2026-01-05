# 🎥 Simple Video Recording Guide - What to Say & Do

**Total Time**: 5-7 minutes  
**Platform**: Loom (loom.com)

---

## 🎬 EXACTLY What to Say and Do

### **PART 1: INTRODUCTION (30 seconds)**

**[Open browser to: https://pastebin-lite-rose.vercel.app]**

**SAY:**
> "Hi, I'm Akash. Today I'll demonstrate my Pastebin Lite application - a full-stack project I built for this take-home assignment. This is a production-ready application where users can create and share text snippets with optional expiration controls. It's built with Next.js 16, PostgreSQL, and deployed on Vercel. Let me show you how it works."

---

### **PART 2: LIVE APPLICATION DEMO (2 minutes)**

#### **Step 1: Create a Paste (1 minute)**

**[You're on the homepage]**

**SAY:**
> "First, let me create a paste. Here's the homepage with a simple form."

**DO:** Start typing in the content box:
```
This is a demo paste for my assignment.
It will expire in 60 seconds or after 5 views - whichever comes first.
```

**SAY while typing:**
> "I'm entering some sample text. Notice the character counter at the bottom showing how many characters I've typed."

**DO:** Fill in the expiration fields:
- Type `60` in "Expiration (seconds)"
- Type `5` in "Max Views"

**SAY:**
> "Now I'm setting expiration controls. I'll set TTL to 60 seconds - meaning this paste expires after one minute. I'm also setting max views to 5 - so it expires after 5 API views. The paste will expire when EITHER condition is met first."

**DO:** Click "Create Paste" button

**SAY:**
> "When I click Create Paste... Perfect! The paste was created successfully. I can see the unique paste ID and the shareable URL. Let me click this URL to view the paste."

#### **Step 2: View the Paste (45 seconds)**

**DO:** Click the shareable URL

**[You're now on the paste view page]**

**SAY while pointing to different parts:**
> "Here's the paste view page. Let me show you what information is displayed:"
> - "At the top, we have the paste ID"
> - "Here's when it was created"
> - "This shows when it will expire"
> - "Current view count is shown here"
> - "Maximum views allowed"
> - "And remaining views before expiration"
> - "The content is displayed with proper formatting"

**DO:** Click "Copy Content" button

**SAY:**
> "I can easily copy the content with one click. There's also a button to copy the URL for sharing."

#### **Step 3: Test API (30 seconds)**

**DO:** Open a new tab or terminal (show it on screen)

**SAY:**
> "Now let me test the API endpoints. I'll use curl to demonstrate."

**DO:** Type and run this command:
```bash
curl https://pastebin-lite-rose.vercel.app/api/healthz
```

**SAY:**
> "First, the health check endpoint. This confirms our database is connected and healthy. You can see it returns 'ok: true'."

**DO:** Run this command:
```bash
curl -X POST https://pastebin-lite-rose.vercel.app/api/pastes -H "Content-Type: application/json" -d "{\"content\":\"API test\",\"ttl\":3600}"
```

**SAY:**
> "I can also create pastes via the API. This returns JSON with the paste ID and URL - perfect for automated testing."

---

### **PART 3: CODE WALKTHROUGH (3 minutes)**

#### **Step 1: Project Structure (30 seconds)**

**DO:** Open VS Code with your project

**SAY:**
> "Now let me walk you through the code. This is a well-organized Next.js application."

**DO:** Show the folder structure in VS Code sidebar

**SAY while pointing:**
> "The structure is clean and organized:"
> - "src/app contains our Next.js pages and API routes"
> - "src/components has reusable React components"
> - "src/services contains the business logic layer"
> - "src/lib has utility functions and database setup"
> - "And prisma folder has our database schema"

#### **Step 2: Database Schema (30 seconds)**

**DO:** Open `prisma/schema.prisma` file

**SAY:**
> "Let me show you the database schema. We have a Paste model with these fields:"

**DO:** Scroll through the schema slowly

**SAY while pointing:**
> - "ID as the primary key - a unique identifier"
> - "Content stores the text"
> - "createdAt timestamp"
> - "expiresAt - optional, for time-based expiration"
> - "maxViews - optional, for view-based expiration"
> - "viewCount - increments with each API access"

**SAY:**
> "This schema supports both expiration types, and they work together."

#### **Step 3: API Routes (1 minute)**

**DO:** Open `src/app/api/pastes/route.ts`

**SAY:**
> "Here's the paste creation endpoint. Let me explain what it does:"

**DO:** Scroll through the code

**SAY:**
> "It validates the incoming request, checks the content and expiration parameters, uses our service layer to create the paste in the database, and returns the paste ID and URL."

**DO:** Open `src/app/api/pastes/[id]/route.ts`

**SAY:**
> "The retrieval endpoint is interesting. Look at this transaction code here."

**DO:** Highlight or point to the transaction block

**SAY:**
> "I use database transactions to ensure atomic view counting. This prevents race conditions when multiple users access the same paste simultaneously. The view count is incremented atomically inside a transaction, ensuring accuracy even under high load."

#### **Step 4: Service Layer (45 seconds)**

**DO:** Open `src/services/paste-service.ts`

**SAY:**
> "I implemented a service layer pattern to separate business logic from API routes. This makes the code maintainable and testable."

**DO:** Scroll to show the methods

**SAY:**
> "Key methods include:"
> - "createPaste - handles creation with validation"
> - "getPasteWithViewIncrement - retrieves and increments atomically"
> - "isPasteAvailable - checks if paste has expired"

**DO:** Scroll to the expiration check logic

**SAY:**
> "The expiration logic checks both time and view conditions. A paste expires when EITHER condition is met - not both."

#### **Step 5: Security Features (30 seconds)**

**DO:** Open `src/lib/paste-validation.ts`

**SAY:**
> "Security is important. I implemented comprehensive validation:"

**DO:** Scroll through the validation code

**SAY:**
> - "Content length limits - maximum 1 megabyte"
> - "TTL range validation - between 60 seconds and 1 year"
> - "Max views validation - between 1 and 1 million"
> - "Content sanitization to prevent XSS attacks"

**DO:** Open `src/services/time-service.ts` (optional)

**SAY:**
> "One unique feature is test mode support. When enabled, the application uses time from a request header instead of current time. This makes automated testing predictable and reliable."

---

### **PART 4: DEPLOYMENT (45 seconds)**

**DO:** Switch to browser, show Vercel dashboard or GitHub

**SAY:**
> "The application is deployed on Vercel with a Neon PostgreSQL database. The deployment is fully automated - every push to main branch triggers a new deployment."

**DO:** Show GitHub repository (optional)

**SAY:**
> "The code is on GitHub with a clean commit history showing the development process."

**SAY:**
> "The architecture has three layers: API routes handle requests, service layer contains business logic, and database layer uses Prisma for type-safe access. This separation makes it maintainable and scalable."

---

### **PART 5: CLOSING (30 seconds)**

**DO:** Go back to the live application or show README

**SAY:**
> "To summarize, this Pastebin Lite application demonstrates:"
> - "Full-stack development with Next.js and PostgreSQL"
> - "Clean architecture with separation of concerns"
> - "Security best practices including input validation and XSS prevention"
> - "Production-ready deployment on Vercel"
> - "Support for automated testing with test mode"

**SAY:**
> "The application is live at pastebin-lite-rose.vercel.app, and the complete source code is on GitHub. Thank you for watching! I'm happy to answer any questions about the implementation."

**[Stop recording]**

---

## 📝 QUICK CHECKLIST BEFORE RECORDING

### **Open These Tabs:**
1. ✅ https://pastebin-lite-rose.vercel.app
2. ✅ VS Code with your project
3. ✅ Terminal (for curl commands)
4. ✅ GitHub repo (optional)

### **Prepare:**
- ✅ Test your microphone
- ✅ Close unnecessary tabs
- ✅ Have the curl commands ready to copy-paste
- ✅ Practice once (optional but recommended)

---

## 🎬 HOW TO RECORD WITH LOOM

### **Step 1: Install Loom**
1. Go to loom.com
2. Sign up (free account)
3. Install Loom desktop app or Chrome extension

### **Step 2: Start Recording**
1. Click Loom icon
2. Choose "Screen + Camera" (shows your face) OR "Screen Only"
3. Select "Full Screen" or "Current Tab"
4. Click "Start Recording"
5. You'll see a 3-2-1 countdown

### **Step 3: Record**
- Follow the script above
- Speak clearly and naturally
- Don't worry about small mistakes - keep going!
- Stay under 7-8 minutes

### **Step 4: Finish**
1. Click the Loom icon to stop
2. Video uploads automatically
3. Copy the shareable link
4. **IMPORTANT**: Click "Share Settings" and set to "Anyone with the link can view"

### **Step 5: Test**
- Open the link in an incognito/private window
- Make sure it plays without login
- Check audio and video quality

---

## ✅ WHAT MAKES A GOOD VIDEO

**DO:**
- ✅ Speak with confidence and enthusiasm
- ✅ Show the working application first
- ✅ Explain your design decisions
- ✅ Highlight unique features (transactions, test mode)
- ✅ Keep it under 7 minutes

**DON'T:**
- ❌ Read code line by line
- ❌ Apologize for anything
- ❌ Rush through important parts
- ❌ Go over 8 minutes
- ❌ Forget to test the link!

---

## 🔗 AFTER RECORDING

**Your Loom link will look like:**
```
https://www.loom.com/share/abc123def456
```

**Submit this link in your assignment!**

---

## 💡 TIPS FOR SUCCESS

1. **Practice once** - Run through the script without recording
2. **Smile** - It shows in your voice!
3. **Pause briefly** - Between sections, take a breath
4. **Show, don't just tell** - Demonstrate features
5. **Be yourself** - Natural is better than perfect

---

**You've got this! Your project is excellent, now just show it off! 🚀**

**Good luck with your recording!**