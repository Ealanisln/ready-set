// scripts/db-sync.ts
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function syncDatabase() {
  try {
    // Step 1: Get the schema from production
    console.log('📥 Pulling production schema...');
    await execAsync('bunx prisma db pull');
    
    // Step 2: Generate Prisma client
    console.log('🔄 Generating Prisma client...');
    await execAsync('bunx prisma generate');
    
    // Step 3: Create a migration from the schema
    console.log('📝 Creating initial migration...');
    await execAsync('bunx prisma migrate dev --name init');
    
    console.log('✅ Local database synced successfully!');
  } catch (error) {
    console.error('❌ Error syncing database:', error);
    process.exit(1);
  }
}