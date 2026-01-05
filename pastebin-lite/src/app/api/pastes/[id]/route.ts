import { NextRequest, NextResponse } from 'next/server'
import { validatePasteId } from '@/lib/paste-validation'
import { PasteStorage } from '@/lib/storage'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Validate paste ID
    const { id } = params
    if (!validatePasteId(id)) {
      return NextResponse.json(
        { error: 'Invalid paste ID' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get paste from storage
    const paste = PasteStorage.get(id)
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found or has expired' },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Check if paste has expired
    if (PasteStorage.isExpired(paste)) {
      return NextResponse.json(
        { error: 'Paste not found or has expired' },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Increment view count
    PasteStorage.incrementViewCount(id)

    // Calculate remaining views
    let remainingViews: number | undefined
    if (paste.maxViews) {
      remainingViews = Math.max(0, paste.maxViews - paste.viewCount)
    }

    // Return paste data
    const response = {
      id: paste.id,
      content: paste.content,
      created_at: paste.createdAt.toISOString(),
      expires_at: paste.expiresAt?.toISOString(),
      max_views: paste.maxViews,
      view_count: paste.viewCount,
      remaining_views: remainingViews,
    }

    return NextResponse.json(response, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('Error retrieving paste:', error)
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}