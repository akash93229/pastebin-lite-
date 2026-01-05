import { CreatePasteRequest, CreatePasteValidation } from '@/types/paste'
import { calculateExpiresAt } from './paste-availability'

// Configuration constants
export const PASTE_CONSTRAINTS = {
  MAX_CONTENT_LENGTH: 1000000, // 1MB
  MIN_CONTENT_LENGTH: 1,
  MAX_TTL_SECONDS: 31536000, // 1 year
  MIN_TTL_SECONDS: 60, // 1 minute
  MAX_VIEWS: 1000000,
  MIN_VIEWS: 1,
} as const

export function validateCreatePasteRequest(
  request: CreatePasteRequest,
  currentTime?: Date
): CreatePasteValidation {
  const timeToUse = currentTime || new Date()
  const errors: string[] = []

  // Validate content
  if (!request.content || typeof request.content !== 'string') {
    errors.push('Content is required and must be a string')
  } else {
    if (request.content.length < PASTE_CONSTRAINTS.MIN_CONTENT_LENGTH) {
      errors.push('Content cannot be empty')
    }
    if (request.content.length > PASTE_CONSTRAINTS.MAX_CONTENT_LENGTH) {
      errors.push(`Content cannot exceed ${PASTE_CONSTRAINTS.MAX_CONTENT_LENGTH} characters`)
    }
  }

  // Validate TTL
  let calculatedExpiresAt: Date | undefined
  if (request.ttl !== undefined) {
    if (typeof request.ttl !== 'number' || !Number.isInteger(request.ttl)) {
      errors.push('TTL must be an integer')
    } else if (request.ttl < PASTE_CONSTRAINTS.MIN_TTL_SECONDS) {
      errors.push(`TTL must be at least ${PASTE_CONSTRAINTS.MIN_TTL_SECONDS} seconds`)
    } else if (request.ttl > PASTE_CONSTRAINTS.MAX_TTL_SECONDS) {
      errors.push(`TTL cannot exceed ${PASTE_CONSTRAINTS.MAX_TTL_SECONDS} seconds`)
    } else {
      calculatedExpiresAt = calculateExpiresAt(timeToUse, request.ttl)
    }
  }

  // Validate max_views
  if (request.max_views !== undefined) {
    if (typeof request.max_views !== 'number' || !Number.isInteger(request.max_views)) {
      errors.push('max_views must be an integer')
    } else if (request.max_views < PASTE_CONSTRAINTS.MIN_VIEWS) {
      errors.push(`max_views must be at least ${PASTE_CONSTRAINTS.MIN_VIEWS}`)
    } else if (request.max_views > PASTE_CONSTRAINTS.MAX_VIEWS) {
      errors.push(`max_views cannot exceed ${PASTE_CONSTRAINTS.MAX_VIEWS}`)
    }
  }

  // Sanitize content (basic HTML escaping for safety)
  const sanitizedContent = request.content ? sanitizeContent(request.content) : undefined

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedContent,
    calculatedExpiresAt,
  }
}

export function sanitizeContent(content: string): string {
  // Basic HTML escaping to prevent XSS
  return content
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

export function validatePasteId(id: string): boolean {
  // Paste IDs should be non-empty strings with reasonable length
  return typeof id === 'string' && id.length > 0 && id.length <= 100
}