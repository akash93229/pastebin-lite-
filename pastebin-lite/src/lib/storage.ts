// Simple in-memory storage for development
// In production, this would be replaced with database operations

export interface StoredPaste {
  id: string
  content: string
  createdAt: Date
  expiresAt?: Date
  maxViews?: number
  viewCount: number
}

// Global storage map
const globalStorage = new Map<string, StoredPaste>()

export class PasteStorage {
  static set(id: string, paste: StoredPaste): void {
    globalStorage.set(id, paste)
  }

  static get(id: string): StoredPaste | undefined {
    return globalStorage.get(id)
  }

  static has(id: string): boolean {
    return globalStorage.has(id)
  }

  static delete(id: string): boolean {
    return globalStorage.delete(id)
  }

  static incrementViewCount(id: string): boolean {
    const paste = globalStorage.get(id)
    if (paste) {
      paste.viewCount += 1
      return true
    }
    return false
  }

  static isExpired(paste: StoredPaste): boolean {
    const now = new Date()
    
    // Check time-based expiration
    if (paste.expiresAt && now > paste.expiresAt) {
      return true
    }
    
    // Check view-based expiration
    if (paste.maxViews && paste.viewCount >= paste.maxViews) {
      return true
    }
    
    return false
  }

  static getAllPastes(): StoredPaste[] {
    return Array.from(globalStorage.values())
  }
}