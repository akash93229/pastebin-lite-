// API Request/Response interfaces
export interface CreatePasteRequest {
  content: string
  ttl?: number
  max_views?: number
}

export interface CreatePasteResponse {
  id: string
  url: string
}

export interface GetPasteResponse {
  id: string
  content: string
  created_at: string
  expires_at?: string
  max_views?: number | null
  view_count: number
  remaining_views?: number
}

// Internal paste data model (matches Prisma schema)
export interface PasteData {
  id: string
  content: string
  createdAt: Date
  expiresAt: Date | null
  maxViews: number | null
  viewCount: number
}

// Paste availability status
export interface PasteAvailability {
  isAvailable: boolean
  reason?: 'expired' | 'max_views_exceeded' | 'not_found'
}

// Validation interfaces
export interface PasteValidationResult {
  isValid: boolean
  errors: string[]
}

export interface CreatePasteValidation extends PasteValidationResult {
  sanitizedContent?: string
  calculatedExpiresAt?: Date
}

// Service layer interfaces
export interface PasteServiceInterface {
  createPaste(data: CreatePasteRequest): Promise<CreatePasteResponse>
  getPaste(id: string): Promise<GetPasteResponse | null>
  incrementViewCount(id: string): Promise<void>
  isPasteAvailable(paste: PasteData): PasteAvailability
  validateCreateRequest(request: CreatePasteRequest): CreatePasteValidation
}