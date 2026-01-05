import { NextRequest, NextResponse } from 'next/server'
import { CreatePasteRequest } from '@/types/paste'
import { generatePasteId, generateShareableUrl } from '@/lib/id-generator'
import { validateCreatePasteRequest } from '@/lib/paste-validation'
import { PasteStorage } from '@/lib/storage'

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

    // Validate the request
    const validation = validateCreatePasteRequest(body)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: `Validation failed: ${validation.errors.join(', ')}` },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const id = generatePasteId()
    const baseUrl = `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const url = generateShareableUrl(id, baseUrl)
    const currentTime = new Date()

    // Calculate expiration
    let expiresAt: Date | undefined
    if (body.ttl) {
      expiresAt = new Date(currentTime.getTime() + body.ttl * 1000)
    }

    // Store paste using shared storage
    PasteStorage.set(id, {
      id,
      content: validation.sanitizedContent || body.content,
      createdAt: currentTime,
      expiresAt,
      maxViews: body.max_views,
      viewCount: 0
    })

    return NextResponse.json({ id, url }, {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error creating paste:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}