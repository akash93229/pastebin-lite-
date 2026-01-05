# Implementation Plan

- [x] 1. Set up project structure and dependencies



  - Initialize Next.js project with App Router
  - Install and configure Prisma ORM with PostgreSQL
  - Set up TypeScript configuration
  - Install testing dependencies (Jest, fast-check, React Testing Library)
  - Configure environment variables for database and test mode
  - _Requirements: 1.1, 5.2_




- [ ] 2. Create database schema and connection
  - [ ] 2.1 Define Prisma schema for pastes table
    - Create Prisma schema with id, content, created_at, expires_at, max_views, view_count fields
    - Configure PostgreSQL database connection
    - _Requirements: 1.5, 4.1, 4.2_


  
  - [ ]* 2.2 Write property test for database schema
    - **Property 1: Paste creation completeness**
    - **Validates: Requirements 1.1, 1.2, 1.3, 1.5**
  



  - [ ] 2.3 Implement database connection utilities
    - Create Prisma client initialization
    - Add connection health check functionality
    - Handle database connection errors gracefully
    - _Requirements: 5.2, 5.5_

- [ ] 3. Implement core paste service layer
  - [ ] 3.1 Create paste data models and interfaces
    - Define TypeScript interfaces for CreatePasteRequest, CreatePasteResponse, GetPasteResponse
    - Implement paste availability checking logic
    - _Requirements: 2.4, 4.3, 4.4, 4.5_
  
  - [ ]* 3.2 Write property test for expiration logic
    - **Property 4: Expiration enforcement**


    - **Validates: Requirements 2.4, 3.4**
  
  - [ ]* 3.3 Write property test for time-based expiration
    - **Property 9: Time-based expiration**
    - **Validates: Requirements 4.4**
  
  - [ ]* 3.4 Write property test for view-based expiration
    - **Property 10: View-based expiration**
    - **Validates: Requirements 4.5**
  
  - [ ] 3.5 Implement time service for test mode support
    - Create TimeService with getCurrentTime method
    - Handle TEST_MODE environment variable



    - Parse x-test-now-ms header in test mode
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 3.6 Write property test for test mode time consistency
    - **Property 11: Test mode time consistency**
    - **Validates: Requirements 6.1, 6.2, 6.5**
  
  - [x]* 3.7 Write property test for normal mode time usage


    - **Property 12: Normal mode time usage**
    - **Validates: Requirements 6.3**

- [ ] 4. Implement paste service operations
  - [ ] 4.1 Implement paste creation service
    - Create unique ID generation for pastes
    - Handle TTL and max_views parameter processing
    - Store paste in database with proper timestamps
    - Generate shareable URL format
    - _Requirements: 1.1, 1.2, 4.1, 4.2_
  
  - [x]* 4.2 Write property test for expiration parameter handling


    - **Property 8: Expiration parameter handling**
    - **Validates: Requirements 4.1, 4.2, 4.3**
  
  - [ ] 4.3 Implement paste retrieval service
    - Fetch paste by ID from database
    - Check paste availability (expiration/view limits)
    - Calculate remaining_views with non-negative constraint
    - _Requirements: 2.1, 2.5, 4.3_
  
  - [ ]* 4.4 Write property test for API retrieval with view counting
    - **Property 2: API retrieval with view counting**
    - **Validates: Requirements 2.1, 2.2, 2.3**


  
  - [ ]* 4.5 Write property test for remaining views non-negative
    - **Property 5: Remaining views non-negative**
    - **Validates: Requirements 2.5**
  
  - [ ] 4.6 Implement view count increment service
    - Atomic increment of view_count in database
    - Handle concurrent access with proper locking
    - _Requirements: 2.2, 8.1, 8.2_
  
  - [ ]* 4.7 Write property test for concurrent view counting accuracy
    - **Property 15: Concurrent view counting accuracy**
    - **Validates: Requirements 8.1, 8.2**

  
  - [ ]* 4.8 Write property test for concurrent view limit enforcement
    - **Property 16: Concurrent view limit enforcement**
    - **Validates: Requirements 8.4**

- [ ] 5. Create API routes
  - [ ] 5.1 Implement POST /api/pastes endpoint
    - Validate JSON input structure and types
    - Call paste creation service
    - Return proper JSON response with ID and URL


    - Handle validation errors with 4xx status codes
    - _Requirements: 1.3, 1.4, 9.2, 9.4_
  
  - [ ]* 5.2 Write property test for invalid input rejection
    - **Property 3: Invalid input rejection**
    - **Validates: Requirements 1.4**
  
  - [ ]* 5.3 Write property test for JSON input validation
    - **Property 18: JSON input validation**


    - **Validates: Requirements 9.2, 9.5**
  
  - [ ] 5.4 Implement GET /api/pastes/:id endpoint
    - Extract paste ID from URL parameters
    - Call paste retrieval service with view count increment
    - Return JSON response with all required fields
    - Handle not found cases with 404 JSON response
    - _Requirements: 2.1, 2.2, 2.4, 9.1_
  

  - [ ]* 5.5 Write property test for JSON handling completeness
    - **Property 17: JSON handling completeness**
    - **Validates: Requirements 9.1, 9.3, 9.4**
  
  - [ ] 5.6 Implement GET /api/healthz endpoint
    - Check database connectivity
    - Return HTTP 200 with JSON {"ok": true}
    - Set proper JSON content-type headers
    - Handle database connection failures
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [ ] 6. Checkpoint - Ensure all API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 7. Create web pages and UI components
  - [ ] 7.1 Implement homepage with paste creation form
    - Create form for text input with optional TTL and max_views
    - Handle form submission with proper validation
    - Display success feedback with shareable URL

    - Show user-friendly error messages for failures
    - _Requirements: 7.1, 7.2, 7.4_
  
  - [ ]* 7.2 Write property test for UI feedback consistency
    - **Property 13: UI feedback consistency**


    - **Validates: Requirements 7.2, 7.4**
  
  - [ ] 7.3 Implement GET /p/:id page for paste viewing
    - Extract paste ID from URL parameters

    - Fetch paste without incrementing view count
    - Display content with proper HTML escaping
    - Preserve text formatting and whitespace
    - Handle unavailable pastes with 404 page
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 7.4 Write property test for web page rendering without view increment
    - **Property 6: Web page rendering without view increment**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  
  - [ ]* 7.5 Write property test for content preservation in HTML
    - **Property 7: Content preservation in HTML**
    - **Validates: Requirements 3.5**
  
  - [ ]* 7.6 Write property test for paste page display
    - **Property 14: Paste page display**
    - **Validates: Requirements 7.3**
  
  - [ ] 7.7 Create 404 error pages
    - Design user-friendly 404 page for unavailable pastes
    - Handle both expired and not found scenarios
    - _Requirements: 3.4, 7.5_

- [ ] 8. Add input validation and security
  - [ ] 8.1 Implement comprehensive input validation
    - Validate paste content length and format
    - Validate TTL and max_views parameter ranges
    - Sanitize all user inputs
    - _Requirements: 1.4, 9.2_
  
  - [x] 8.2 Implement XSS prevention



    - Escape all user content in HTML output
    - Use proper React JSX escaping
    - Validate against XSS attack vectors
    - _Requirements: 3.2_
  
  - [ ] 8.3 Add rate limiting and abuse prevention
    - Implement basic rate limiting for paste creation
    - Add content length limits
    - Handle malicious input gracefully
    - _Requirements: 8.3_

- [ ] 9. Final testing and integration
  - [ ]* 9.1 Write integration tests for complete workflows
    - Test end-to-end paste creation and retrieval
    - Test expiration scenarios with time manipulation
    - Test concurrent access patterns
    - _Requirements: 8.1, 8.2, 8.4_
  
  - [ ]* 9.2 Write unit tests for edge cases
    - Test empty content handling
    - Test invalid ID formats
    - Test database connection failures
    - _Requirements: 1.4, 5.5, 8.3_

- [ ] 10. Setup deployment configuration
  - [ ] 10.1 Configure Vercel deployment
    - Set up vercel.json configuration
    - Configure environment variables for production
    - Set up database connection for Neon PostgreSQL
    - _Requirements: 5.2_
  
  - [ ] 10.2 Create README.md documentation
    - Document project description and features
    - Provide local setup instructions
    - Explain persistence architecture
    - Include API documentation
    - _Requirements: All requirements for documentation_

- [ ] 11. Final Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.