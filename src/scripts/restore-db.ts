import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const execAsync = promisify(exec);

async function checkPostgresConnection(): Promise<boolean> {
  try {
    await execAsync('docker compose exec db pg_isready -U postgres');
    return true;
  } catch {
    return false;
  }
}

async function processBackupFile(backupPath: string): Promise<string> {
  console.log('📝 Processing backup file...');
  const content = readFileSync(backupPath, 'utf-8');
  
  // Create a temporary file with processed content
  const tempFile = join(process.cwd(), 'temp-backup.sql');
  
  const processedContent = content
    .replace(/^SET neon\..+$/gm, '') // Remove Neon-specific settings
    .replace(/OWNER TO neon_superuser;/g, 'OWNER TO postgres;') // Change owner references
    .replace(/OWNER TO "neon_superuser"/g, 'OWNER TO postgres') // Change owner references (alternate form)
    .replace(/^COMMENT ON EXTENSION.+$/gm, '') // Remove extension comments
    .replace(/^REVOKE ALL ON SCHEMA/gm, '--REVOKE ALL ON SCHEMA') // Comment out REVOKE statements
    .replace(/^REVOKE USAGE ON SCHEMA/gm, '--REVOKE USAGE ON SCHEMA') // Comment out REVOKE statements
    .replace(/^GRANT ALL ON SCHEMA/gm, '--GRANT ALL ON SCHEMA') // Comment out GRANT statements
    .replace(/^ALTER DEFAULT PRIVILEGES FOR ROLE/gm, '--ALTER DEFAULT PRIVILEGES FOR ROLE'); // Comment out ALTER DEFAULT PRIVILEGES

  writeFileSync(tempFile, processedContent);
  return tempFile;
}

async function restoreDatabase() {
  if (!process.argv[2]) {
    console.error('❌ Please provide a backup file name');
    console.error('Usage: pnpm tsx restore-db.ts <backup-file>');
    console.error('Example: pnpm tsx restore-db.ts backups/backup-2025-01-27T19-08-58-928Z.sql');
    process.exit(1);
  }

  const backupPath = process.argv[2];

  if (!existsSync(backupPath)) {
    console.error(`❌ Backup file not found: ${backupPath}`);
    process.exit(1);
  }

  try {
    // Check if PostgreSQL is running
    console.log('🔍 Checking database connection...');
    if (!await checkPostgresConnection()) {
      console.error('❌ PostgreSQL is not running. Please start your Docker containers:');
      console.error('$ docker compose up -d');
      process.exit(1);
    }

    // Process the backup file to handle Neon-specific SQL
    const processedBackupPath = await processBackupFile(backupPath);

    console.log('🗑️  Dropping existing database...');
    
    try {
      // Drop existing connections first
      await execAsync(
        'docker compose exec -T db psql -U postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = \'mydatabase\' AND pid <> pg_backend_pid();"'
      );
    } catch (error) {
      console.log('Note: No existing connections to terminate');
    }

    try {
      // Drop the existing database
      await execAsync('docker compose exec -T db dropdb -U postgres --force mydatabase');
    } catch (error) {
      console.log('Note: Database might not exist, continuing...');
    }

    // Create a new database
    await execAsync('docker compose exec -T db createdb -U postgres mydatabase');
    console.log('✅ Database recreated');

    console.log('📥 Restoring database from backup...');
    
    // Restore using the processed backup file
    const restoreCommand = `cat "${processedBackupPath}" | docker compose exec -T db psql -U postgres -d mydatabase`;
    const { stdout, stderr } = await execAsync(restoreCommand);
    
    // Clean up temporary file
    try {
      await execAsync(`rm "${processedBackupPath}"`);
    } catch (error) {
      console.warn('Note: Could not remove temporary file:', processedBackupPath);
    }

    if (stderr && !stderr.includes('SET') && !stderr.includes('role "postgres" does not exist')) {
      console.warn('⚠️ Warnings during restore:', stderr);
    }

    // Verify the restoration
    console.log('\n🔍 Verifying restoration...');

    // Check table count
    const { stdout: tableCount } = await execAsync(
      'docker compose exec -T db psql -U postgres -d mydatabase -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = \'public\';"'
    );
    console.log(`📊 Tables found: ${tableCount.trim()}`);

    // List all tables
    const { stdout: tables } = await execAsync(
      'docker compose exec -T db psql -U postgres -d mydatabase -c "\\dt public.*"'
    );
    console.log('\n📋 Table list:');
    console.log(tables);

    // Get database size
    const { stdout: dbSize } = await execAsync(
      'docker compose exec -T db psql -U postgres -d mydatabase -t -c "SELECT pg_size_pretty(pg_database_size(\'mydatabase\'));"'
    );
    console.log(`\n💾 Database size: ${dbSize.trim()}`);

    console.log('\n✅ Database restore completed successfully!');

  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('No such container')) {
        console.error('\nMake sure your Docker Compose services are running:');
        console.error('$ docker compose up -d');
      } else if (error.message.includes('connection refused')) {
        console.error('\nDatabase connection failed. Check if the database container is healthy:');
        console.error('$ docker compose ps');
      }
    }
    
    process.exit(1);
  }
}

restoreDatabase();