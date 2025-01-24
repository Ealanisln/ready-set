import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testConnection() {
  try {
    // Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    })
    console.log('✅ Successfully connected to database')
    console.log('Created test user:', testUser)

    // Clean up by deleting the test user
    await prisma.user.delete({
      where: {
        email: 'test@example.com',
      },
    })
    console.log('✅ Successfully cleaned up test data')
  } catch (error) {
    console.error('❌ Error connecting to database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()