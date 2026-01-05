import { NextResponse } from 'next/server'
import { checkDatabaseHealth } from '@/lib/db-health'

export async function GET() {
  try {
    // Check database connectivity
    const isHealthy = await checkDatabaseHealth()
    
    if (isHealthy) {
      return NextResponse.json(
        { ok: true },
        { 
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    } else {
      return NextResponse.json(
        { ok: false, error: 'Database connection failed' },
        { 
          status: 503,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }
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