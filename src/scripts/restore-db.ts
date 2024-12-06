import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync } from 'fs';

const execAsync = promisify(exec);

async function restoreDatabase() {
  if (!process.argv[2]) {
    console.error('❌ Please provide a backup file name');
    console.error('Usage: bun run restore-db.ts <backup-file>');
    process.exit(1);
  }

  const backupPath = process.argv[2];

  if (!existsSync(backupPath)) {
    console.error(`❌ Backup file not found: ${backupPath}`);
    process.exit(1);
  }

  try {
    console.log('🗑️  Dropping existing database...');
    
    // Drop and recreate the database
    await execAsync('docker compose exec -T db dropdb -U postgres --force mydatabase');
    await execAsync('docker compose exec -T db createdb -U postgres mydatabase');
    
    console.log('✅ Database recreated');

    console.log('📥 Restoring database from backup...');
    const restoreCommand = `docker compose exec -T db psql -U postgres -d mydatabase < "${backupPath}"`;
    
    const { stdout, stderr } = await execAsync(restoreCommand);
    
    if (stderr && !stderr.includes('SET') && !stderr.includes('role "neon_superuser" does not exist')) {
      console.warn('⚠️ Warnings during restore:', stderr);
    }

    if (stdout) {
      console.log('Output:', stdout);
    }
    
    console.log('✅ Database restored successfully!');
  } catch (error: unknown) {
    console.error('❌ Error restoring backup:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('No such container')) {
        console.error('Make sure your Docker Compose services are running:');
        console.error('$ docker compose up -d');
      } else if (error.message.includes('connection refused')) {
        console.error('Database connection failed. Check if the database container is healthy:');
        console.error('$ docker compose ps');
      }
    }
    
    process.exit(1);
  }
}

restoreDatabase();