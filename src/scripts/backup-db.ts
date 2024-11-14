import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

async function backupDatabase() {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    
    console.log('📦 Creating database backup...');
    await execAsync(`pg_dump "${process.env.POSTGRES_URL}" > ./backups/${filename}`);
    
    console.log(`✅ Backup created: ${filename}`);
  } catch (error) {
    console.error('❌ Error creating backup:', error);
    process.exit(1);
  }
}
