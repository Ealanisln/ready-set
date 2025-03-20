import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteModelData(prisma: PrismaClient, modelName: string) {
  try {
    const deleteResult = await (prisma as any)[modelName].deleteMany()
    console.log(`Deleted ${deleteResult.count} ${modelName} records`)
    return deleteResult.count
  } catch (error) {
    console.error(`Error deleting ${modelName}:`, error)
    return 0
  }
}

async function deleteFakeData() {
  try {
    // Delete data in order of dependencies
    await deleteModelData(prisma, 'dispatch')
    await deleteModelData(prisma, 'on_demand')
    await deleteModelData(prisma, 'catering_request')
    await deleteModelData(prisma, 'file_upload')
    await deleteModelData(prisma, 'session')
    await deleteModelData(prisma, 'account')
    await deleteModelData(prisma, 'address')
    await deleteModelData(prisma, 'verification_token')
    
    // Finally, delete users
    const deletedUsers = await deleteModelData(prisma, 'user')
    
    console.log('Fake data deleted successfully')
  } catch (error) {
    console.error('Error deleting fake data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run the deleteFakeData function
void deleteFakeData()