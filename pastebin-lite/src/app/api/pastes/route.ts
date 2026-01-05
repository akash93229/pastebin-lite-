import { NextRequest, NextResponse } from 'next/server'
import { CreatePasteRequest } from '@/types/paste'
import { pasteService } from '@/services/paste-service'
import { getCurrentTimeForRequest } from '@/services/time-service'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    let body: CreatePasteRequest
    try {
      body = await request.json()
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Validate required fields
    if (!body.content || typeof body.content !== 'string') {
      return NextResponse.json(
        { error: 'Content is required and must be a string' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get current time (handles test mode)
    const currentTime = getCurrentTimeForRequest(request.headers)
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`

    // Create paste using service
    const result = await pasteService.createPaste(body, currentTime, baseUrl)

    return NextResponse.json(result, {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating paste:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.message.includes('Validation failed')) {
      return NextResponse.json(
        { error: error.message },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}