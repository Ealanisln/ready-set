import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function fullSync() {
  try {
    // Step 1: Verify production connection
    console.log('🔍 Verifying production database connection...');
    if (!process.env.POSTGRES_URL) {
      throw new Error('Production database URL not found in environment variables');
    }

    // Step 2: Create a backup of production
    console.log('📦 Creating production database backup...');
    await execAsync(`pg_dump "${process.env.POSTGRES_URL}" > ./backup.sql`);

    // Step 3: Reset local database
    console.log('🗑️ Resetting local database...');
    await execAsync('bunx prisma migrate reset --force');

    // Step 4: Restore backup to local
    console.log('📥 Restoring data to local database...');
    await execAsync('psql "${process.env.POSTGRES_URL}" < ./backup.sql');

    // Step 5: Clean up
    console.log('🧹 Cleaning up temporary files...');
    await execAsync('rm ./backup.sql');

    console.log('✅ Database fully synced with production!');
  } catch (error) {
    console.error('❌ Error during full sync:', error);
    process.exit(1);
  }
}