import { prisma } from './prisma'

export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    // Simple query to check database connectivity
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database health check failed:', error)
    return false
  }
}

export async function gracefulDatabaseShutdown(): Promise<void> {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error during database shutdown:', error)
  }
}