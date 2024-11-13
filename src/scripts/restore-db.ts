// scripts/restore-db.ts
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function restoreDatabase() {
  if (!process.argv[2]) {
    console.error('❌ Please provide a backup file name');
    process.exit(1);
  }

  try {
    const backupFile = process.argv[2];
    console.log('📥 Restoring database from backup...');
    await execAsync(`psql "${process.env.POSTGRES_URL}" < ./backups/${backupFile}`);
    
    console.log('✅ Database restored successfully!');
  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    process.exit(1);
  }
}