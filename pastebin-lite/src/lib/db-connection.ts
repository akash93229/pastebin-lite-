import { prisma } from './prisma'
import { handleDatabaseError } from './db-errors'

export interface RetryOptions {
  maxRetries: number
  delayMs: number
  backoffMultiplier: number
}

const DEFAULT_RETRY_OPTIONS: RetryOptions = {
  maxRetries: 3,
  delayMs: 100,
  backoffMultiplier: 2,
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  const { maxRetries, delayMs, backoffMultiplier } = {
    ...DEFAULT_RETRY_OPTIONS,
    ...options,
  }

  let lastError: unknown
  let currentDelay = delayMs

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error
      
      if (attempt === maxRetries) {
        break
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, currentDelay))
      currentDelay *= backoffMultiplier
    }
  }

  throw handleDatabaseError(lastError)
}

export async function executeWithConnection<T>(
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await withRetry(operation)
  } catch (error) {
    throw handleDatabaseError(error)
  }
}

// Transaction wrapper
export async function executeInTransaction<T>(
  operation: (tx: Omit<typeof prisma, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>) => Promise<T>
): Promise<T> {
  return executeWithConnection(() => 
    prisma.$transaction(operation)
  )
}