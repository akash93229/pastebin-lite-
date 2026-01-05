import { prisma } from '@/lib/prisma'
import { executeWithConnection } from '@/lib/db-connection'
import { handleDatabaseError } from '@/lib/db-errors'
import { generatePasteId, generateShareableUrl } from '@/lib/id-generator'
import { validateCreatePasteRequest } from '@/lib/paste-validation'
import { checkPasteAvailability, calculateRemainingViews } from '@/lib/paste-availability'
import { getCurrentTimeForRequest } from '@/services/time-service'
import {
  CreatePasteRequest,
  CreatePasteResponse,
  GetPasteResponse,
  PasteData,
  PasteServiceInterface,
  PasteAvailability,
  CreatePasteValidation
} from '@/types/paste'

export class PasteService implements PasteServiceInterface {
  async createPaste(
    data: CreatePasteRequest,
    currentTime?: Date,
    baseUrl?: string
  ): Promise<CreatePasteResponse> {
    const timeToUse = currentTime || new Date()
    
    // Validate the request
    const validation = this.validateCreateRequest(data, timeToUse)
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
    }

    const id = generatePasteId()
    const url = generateShareableUrl(id, baseUrl)

    try {
      await executeWithConnection(async () => {
        await prisma.paste.create({
          data: {
            id,
            content: validation.sanitizedContent || data.content,
            createdAt: timeToUse,
            expiresAt: validation.calculatedExpiresAt || null,
            maxViews: data.max_views || null,
            viewCount: 0,
          },
        })
      })

      return { id, url }
    } catch (error) {
      throw handleDatabaseError(error)
    }
  }

  async getPaste(id: string, currentTime?: Date): Promise<GetPasteResponse | null> {
    const timeToUse = currentTime || new Date()

    try {
      const paste = await executeWithConnection(async () => {
        return await prisma.paste.findUnique({
          where: { id },
        })
      })

      if (!paste) {
        return null
      }

      // Convert Prisma result to our PasteData interface
      const pasteData: PasteData = {
        id: paste.id,
        content: paste.content,
        createdAt: paste.createdAt,
        expiresAt: paste.expiresAt,
        maxViews: paste.maxViews,
        viewCount: paste.viewCount,
      }

      // Check if paste is available
      const availability = this.isPasteAvailable(pasteData, timeToUse)
      if (!availability.isAvailable) {
        return null
      }

      // Calculate remaining views
      const remainingViews = calculateRemainingViews(pasteData)

      return {
        id: paste.id,
        content: paste.content,
        created_at: paste.createdAt.toISOString(),
        expires_at: paste.expiresAt?.toISOString(),
        max_views: paste.maxViews,
        view_count: paste.viewCount,
        remaining_views: remainingViews,
      }
    } catch (error) {
      throw handleDatabaseError(error)
    }
  }

  async incrementViewCount(id: string): Promise<void> {
    try {
      await executeWithConnection(async () => {
        await prisma.paste.update({
          where: { id },
          data: {
            viewCount: {
              increment: 1,
            },
          },
        })
      })
    } catch (error) {
      throw handleDatabaseError(error)
    }
  }

  isPasteAvailable(paste: PasteData, currentTime?: Date): PasteAvailability {
    return checkPasteAvailability(paste, currentTime)
  }

  validateCreateRequest(request: CreatePasteRequest, currentTime?: Date): CreatePasteValidation {
    return validateCreatePasteRequest(request, currentTime)
  }

  // Method to get paste with view increment (for API access)
  async getPasteWithViewIncrement(id: string, currentTime?: Date): Promise<GetPasteResponse | null> {
    const timeToUse = currentTime || new Date()

    try {
      return await executeWithConnection(async () => {
        // Use a transaction to ensure atomicity
        return await prisma.$transaction(async (tx) => {
          const paste = await tx.paste.findUnique({
            where: { id },
          })

          if (!paste) {
            return null
          }

          // Convert to our interface
          const pasteData: PasteData = {
            id: paste.id,
            content: paste.content,
            createdAt: paste.createdAt,
            expiresAt: paste.expiresAt,
            maxViews: paste.maxViews,
            viewCount: paste.viewCount,
          }

          // Check availability before incrementing
          const availability = this.isPasteAvailable(pasteData, timeToUse)
          if (!availability.isAvailable) {
            return null
          }

          // Increment view count
          const updatedPaste = await tx.paste.update({
            where: { id },
            data: {
              viewCount: {
                increment: 1,
              },
            },
          })

          // Check availability again after increment (in case we hit max_views)
          const updatedPasteData: PasteData = {
            ...pasteData,
            viewCount: updatedPaste.viewCount,
          }

          const postIncrementAvailability = this.isPasteAvailable(updatedPasteData, timeToUse)
          
          // Calculate remaining views based on the updated count
          const remainingViews = calculateRemainingViews(updatedPasteData)

          return {
            id: paste.id,
            content: paste.content,
            created_at: paste.createdAt.toISOString(),
            expires_at: paste.expiresAt?.toISOString(),
            max_views: paste.maxViews,
            view_count: updatedPaste.viewCount,
            remaining_views: remainingViews,
          }
        })
      })
    } catch (error) {
      throw handleDatabaseError(error)
    }
  }

  // Method to get paste without view increment (for web page access)
  async getPasteWithoutViewIncrement(id: string, currentTime?: Date): Promise<GetPasteResponse | null> {
    return this.getPaste(id, currentTime)
  }
}

// Export singleton instance
export const pasteService = new PasteService()