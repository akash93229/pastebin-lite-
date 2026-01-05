import { NextRequest } from 'next/server'
import { getCurrentTimeForRequest } from '@/services/time-service'

export function extractHeaders(request: NextRequest): Headers {
  return request.headers
}

export function getCurrentTimeFromRequest(request: NextRequest): Date {
  const headers = extractHeaders(request)
  return getCurrentTimeForRequest(headers)
}

// Helper to get test time header value
export function getTestTimeHeader(request: NextRequest): string | null {
  return request.headers.get('x-test-now-ms')
}

// Validate test mode headers
export function validateTestModeHeaders(request: NextRequest): { isValid: boolean; error?: string } {
  if (process.env.TEST_MODE !== '1') {
    return { isValid: true }
  }

  const testTimeHeader = getTestTimeHeader(request)
  if (!testTimeHeader) {
    return { 
      isValid: false, 
      error: 'Test mode enabled but x-test-now-ms header not provided' 
    }
  }

  const timestamp = parseInt(testTimeHeader, 10)
  if (isNaN(timestamp)) {
    return { 
      isValid: false, 
      error: 'Invalid x-test-now-ms header: must be a valid timestamp' 
    }
  }

  return { isValid: true }
}