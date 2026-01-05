import { PasteData, PasteAvailability } from '@/types/paste'

export function checkPasteAvailability(
  paste: PasteData,
  currentTime?: Date
): PasteAvailability {
  const timeToUse = currentTime || new Date()
  
  // Check if paste has expired by time
  if (paste.expiresAt && timeToUse > paste.expiresAt) {
    return {
      isAvailable: false,
      reason: 'expired'
    }
  }

  // Check if paste has exceeded max views
  if (paste.maxViews !== null && paste.viewCount >= paste.maxViews) {
    return {
      isAvailable: false,
      reason: 'max_views_exceeded'
    }
  }

  return {
    isAvailable: true
  }
}

export function calculateRemainingViews(paste: PasteData): number | undefined {
  if (paste.maxViews === null) {
    return undefined
  }

  const remaining = paste.maxViews - paste.viewCount
  return Math.max(0, remaining)
}

export function calculateExpiresAt(createdAt: Date, ttlSeconds: number): Date {
  const expiresAt = new Date(createdAt)
  expiresAt.setSeconds(expiresAt.getSeconds() + ttlSeconds)
  return expiresAt
}