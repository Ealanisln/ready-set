// src/scripts/backup-db.ts

import { exec } from 'child_process';
import { join } from 'path';
import { mkdir, readdir, stat, unlink, readFile } from 'fs/promises';

// Load environment variables from .env file
import { config } from 'dotenv';
config();

const BACKUP_DIR = './backups';
const MAX_BACKUPS = 5;

// Promisify exec for Bun
const execAsync = (command: string): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) reject(error);
      else resolve({ stdout, stderr });
    });
  });
};

async function getDatabaseStats() {
  const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    throw new Error('Database URL not found in environment variables');
  }

  const url = new URL(databaseUrl);
  process.env.PGPASSWORD = url.password;

  try {
    // Get table count
    const { stdout: tableCount } = await execAsync(`
      psql "${databaseUrl}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"
    `);

    // Get total database size
    const { stdout: dbSize } = await execAsync(`
      psql "${databaseUrl}" -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));"
    `);

    // Get table sizes
    const { stdout: tableSizes } = await execAsync(`
      psql "${databaseUrl}" -t -c "
        SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name)))
        FROM information_schema.tables
        WHERE table_schema = 'public'
        ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC;
      "
    `);

    return {
      tableCount: parseInt(tableCount.trim()),
      databaseSize: dbSize.trim(),
      tables: tableSizes.split('\n')
        .filter(line => line.trim())
        .map(line => {
          const [name, size] = line.trim().split('|');
          return { name: name.trim(), size: size.trim() };
        })
    };
  } finally {
    delete process.env.PGPASSWORD;
  }
}

async function backupDatabase() {
  try {
    // Get database stats before backup
    console.log('📊 Analyzing database...');
    const dbStats = await getDatabaseStats();
    console.log(`Database size: ${dbStats.databaseSize}`);
    console.log(`Number of tables: ${dbStats.tableCount}`);
    console.log('\nTable sizes:');
    dbStats.tables.forEach(table => {
      console.log(`- ${table.name}: ${table.size}`);
    });

    // Ensure backup directory exists
    await mkdir(BACKUP_DIR, { recursive: true });
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${timestamp}.sql`;
    const filepath = join(BACKUP_DIR, filename);
    
    console.log('\n📦 Creating database backup...');
    
    const databaseUrl = process.env.POSTGRES_PRISMA_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      throw new Error('Neither POSTGRES_PRISMA_URL nor POSTGRES_URL environment variable is set');
    }

    const url = new URL(databaseUrl);
    const command = [
      'pg_dump',
      `-h ${url.hostname}`,
      url.port ? `-p ${url.port}` : '',
      `-U ${url.username}`,
      `-d ${url.pathname.slice(1)}`,
      `-f "${filepath}"`,
      '--format=p',
      '--no-owner',
      '--verbose'  // Added verbose flag
    ].filter(Boolean).join(' ');

    process.env.PGPASSWORD = url.password;
    
    const { stderr } = await execAsync(command);
    if (stderr) console.log('Backup process output:', stderr);
    
    delete process.env.PGPASSWORD;
    
    await rotateBackups();
    
    // Verify backup file
    const stats = await stat(filepath);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n✅ Backup created: ${filename}`);
    console.log(`📊 Backup size: ${sizeMB} MB`);

    // Quick backup verification
    const backupContent = await readFile(filepath, 'utf-8');
    const tableCount = (backupContent.match(/CREATE TABLE/g) || []).length;
    console.log(`📋 Tables in backup: ${tableCount}`);

    if (tableCount !== dbStats.tableCount) {
      console.warn(`⚠️  Warning: Number of tables in backup (${tableCount}) differs from database (${dbStats.tableCount})`);
    }

    if (stats.size < 1000) { // Less than 1KB
      console.warn('⚠️  Warning: Backup file seems unusually small. Please verify its contents.');
    }

  } catch (error) {
    console.error('❌ Error creating backup:', error);
    process.exit(1);
  }
}

async function rotateBackups() {
  try {
    // Get all backup files
    const files = await readdir(BACKUP_DIR);
    const backupFiles = files
      .filter(file => file.endsWith('.sql'))
      .map(async file => ({
        name: file,
        path: join(BACKUP_DIR, file),
        created: (await stat(join(BACKUP_DIR, file))).birthtimeMs
      }));

    // Sort backups by creation time (newest first)
    const backups = await Promise.all(backupFiles);
    backups.sort((a, b) => b.created - a.created);

    // Remove old backups
    for (const backup of backups.slice(MAX_BACKUPS)) {
      console.log(`🗑️ Removing old backup: ${backup.name}`);
      await unlink(backup.path);
    }
  } catch (error) {
    console.error('⚠️ Error rotating backups:', error);
  }
}

// Export the function for use as a module
export { backupDatabase };

// Run backup if file is being run directly
if (process.argv[1] === import.meta.url.substring(7)) {
  backupDatabase();
}