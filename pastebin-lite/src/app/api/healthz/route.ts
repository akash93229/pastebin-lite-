import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // For now, just return OK since we're using in-memory storage
    // In production, this would check database connectivity
    return NextResponse.json(
      { ok: true },
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json(
      { ok: false, error: 'Health check failed' },
      { 
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}