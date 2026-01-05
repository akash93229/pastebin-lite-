import { randomBytes } from 'crypto'

export function generatePasteId(): string {
  // Generate a URL-safe random ID
  // Using 12 bytes = 96 bits of entropy, base64url encoded = 16 characters
  return randomBytes(12)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

export function generateShareableUrl(id: string, baseUrl?: string): string {
  const base = baseUrl || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000')
  return `${base}/p/${id}`
}

// Alternative ID generation methods for different use cases
export function generateShortId(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

export function generateNumericId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}