export interface TimeServiceInterface {
  getCurrentTime(): Date
  isTestMode(): boolean
  getTestTime(headers: Headers): Date | null
}

export class TimeService implements TimeServiceInterface {
  private static instance: TimeService | null = null

  // Singleton pattern to ensure consistent time across the application
  public static getInstance(): TimeService {
    if (!TimeService.instance) {
      TimeService.instance = new TimeService()
    }
    return TimeService.instance
  }

  public isTestMode(): boolean {
    return process.env.TEST_MODE === '1'
  }

  public getCurrentTime(): Date {
    if (this.isTestMode()) {
      // In test mode, we should get time from request headers
      // This method should not be called directly in test mode
      // Use getTestTime() with headers instead
      throw new Error('In test mode, use getTestTime() with request headers')
    }
    return new Date()
  }

  public getTestTime(headers: Headers): Date | null {
    if (!this.isTestMode()) {
      return null
    }

    const testTimeHeader = headers.get('x-test-now-ms')
    if (!testTimeHeader) {
      throw new Error('Test mode enabled but x-test-now-ms header not provided')
    }

    try {
      const timestamp = parseInt(testTimeHeader, 10)
      if (isNaN(timestamp)) {
        throw new Error('Invalid x-test-now-ms header: must be a valid timestamp')
      }
      return new Date(timestamp)
    } catch (error) {
      throw new Error(`Failed to parse x-test-now-ms header: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  // Helper method to get current time with optional test headers
  public getTimeForRequest(headers?: Headers): Date {
    if (this.isTestMode()) {
      if (!headers) {
        throw new Error('Headers required in test mode')
      }
      const testTime = this.getTestTime(headers)
      if (testTime === null) {
        throw new Error('Failed to get test time from headers')
      }
      return testTime
    }
    return this.getCurrentTime()
  }
}

// Export singleton instance
export const timeService = TimeService.getInstance()

// Utility functions for common time operations
export function getCurrentTimeForRequest(headers?: Headers): Date {
  return timeService.getTimeForRequest(headers)
}

export function isInTestMode(): boolean {
  return timeService.isTestMode()
}

export function addSecondsToTime(baseTime: Date, seconds: number): Date {
  const newTime = new Date(baseTime)
  newTime.setSeconds(newTime.getSeconds() + seconds)
  return newTime
}

export function isTimeExpired(expiresAt: Date | null, currentTime: Date): boolean {
  if (!expiresAt) {
    return false
  }
  return currentTime > expiresAt
}