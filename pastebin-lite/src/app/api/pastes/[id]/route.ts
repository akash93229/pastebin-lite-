import { NextRequest, NextResponse } from 'next/server'
import { validatePasteId } from '@/lib/paste-validation'
import { pasteService } from '@/services/paste-service'
import { getCurrentTimeForRequest } from '@/services/time-service'

interface RouteParams {
  params: Promise<{
    id: string
  }>
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Await the params in Next.js 16
    const { id } = await params
    
    // Validate paste ID
    if (!validatePasteId(id)) {
      return NextResponse.json(
        { error: 'Invalid paste ID' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Get current time (handles test mode)
    const currentTime = getCurrentTimeForRequest(request.headers)

    // Get paste with view increment (for API access)
    const paste = await pasteService.getPasteWithViewIncrement(id, currentTime)
    
    if (!paste) {
      return NextResponse.json(
        { error: 'Paste not found or has expired' },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return NextResponse.json(paste, {
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