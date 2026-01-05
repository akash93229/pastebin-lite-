import { Prisma } from '@prisma/client'

export class DatabaseError extends Error {
  constructor(message: string, public originalError?: unknown) {
    super(message)
    this.name = 'DatabaseError'
  }
}

export class PasteNotFoundError extends Error {
  constructor(id: string) {
    super(`Paste with id ${id} not found`)
    this.name = 'PasteNotFoundError'
  }
}

export class PasteExpiredError extends Error {
  constructor(id: string) {
    super(`Paste with id ${id} has expired`)
    this.name = 'PasteExpiredError'
  }
}

export function handleDatabaseError(error: any): DatabaseError {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return new DatabaseError('Unique constraint violation', error)
      case 'P2025':
        return new DatabaseError('Record not found', error)
      case 'P1001':
        return new DatabaseError('Database connection failed', error)
      case 'P1008':
        return new DatabaseError('Database timeout', error)
      default:
        return new DatabaseError(`Database error: ${error.message}`, error)
    }
  }

  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    return new DatabaseError('Unknown database error', error)
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new DatabaseError('Database engine panic', error)
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new DatabaseError('Database initialization failed', error)
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new DatabaseError('Database validation error', error)
  }

  if (error instanceof Error) {
    return new DatabaseError(error.message, error)
  }

  return new DatabaseError('Unexpected database error', error)
}