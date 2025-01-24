import { exec } from 'child_process';
import { join } from 'path';
import { mkdir, readdir, stat, unlink, readFile } from 'fs/promises';
import { config } from 'dotenv';

config();

const BACKUP_DIR = './backups';
const MAX_BACKUPS = 5;

// Improved error handling for command execution
const execAsync = (command: string): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // Enhanced error message with command details
        const enhancedError = new Error(`Command failed: ${error.message}\nCommand: ${command}\nStderr: ${stderr}`);
        reject(enhancedError);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

async function checkPgTools() {
  try {
    // Check if tools are installed
    const { stdout: psqlVersion } = await execAsync('psql --version');
    const { stdout: pgDumpVersion } = await execAsync('pg_dump --version');
    
    // Get server version
    const databaseUrl = process.env.DATABASE_DIRECT_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      throw new Error('Database URL not found in environment variables');
    }
    
    const cleanUrl = cleanDatabaseUrl(databaseUrl);
    process.env.PGPASSWORD = new URL(databaseUrl).password;
    
    try {
      const { stdout: serverVersion } = await execAsync(
        `psql "${cleanUrl}" -t -c "SHOW server_version;"`
      );
      
      // Parse versions
      const pgDumpMatch = pgDumpVersion.match(/(\d+\.\d+)/);
      const serverMatch = serverVersion.match(/(\d+\.\d+)/);
      
      if (!pgDumpMatch || !serverMatch) {
        throw new Error('Could not parse version numbers');
      }
      
      const pgDumpVer = parseFloat(pgDumpMatch[1]);
      const serverVer = parseFloat(serverMatch[1]);
      
      if (pgDumpVer < serverVer) {
        console.error(`❌ Version mismatch: pg_dump (${pgDumpVer}) is older than server (${serverVer})`);
        console.error('\nPlease upgrade PostgreSQL tools:');
        console.log('On macOS:');
        console.log('  brew uninstall postgresql@14');
        console.log('  brew install postgresql@16');
        console.log('  echo \'export PATH="/opt/homebrew/opt/postgresql@16/bin:$PATH"\' >> ~/.zshrc');
        console.log('  source ~/.zshrc');
        return false;
      }
      
      return true;
    } finally {
      delete process.env.PGPASSWORD;
    }
  } catch (error) {
    console.error('❌ PostgreSQL tools not found or error checking versions:', error);
    console.log('\nPlease install PostgreSQL command-line tools:');
    console.log('On macOS: brew install postgresql@16');
    console.log('On Ubuntu/Debian: sudo apt-get install postgresql-client-16');
    console.log('On Windows: Install from postgresql.org and ensure Command Line Tools are selected');
    return false;
  }
}

function cleanDatabaseUrl(databaseUrl: string): string {
  const url = new URL(databaseUrl);
  
  // Remove Neon-specific parameters
  const searchParams = new URLSearchParams(url.search);
  searchParams.delete('pgbouncer');
  
  // Keep only essential parameters
  const essentialParams = ['sslmode', 'connect_timeout'];
  const cleanParams = new URLSearchParams();
  essentialParams.forEach(param => {
    if (searchParams.has(param)) {
      cleanParams.set(param, searchParams.get(param)!);
    }
  });
  
  // Reconstruct clean URL
  url.search = cleanParams.toString();
  return url.toString();
}

async function getDatabaseStats() {
  const databaseUrl = process.env.DATABASE_DIRECT_URL || process.env.POSTGRES_URL;
  if (!databaseUrl) {
    throw new Error('Database URL not found in environment variables');
  }

  const cleanUrl = cleanDatabaseUrl(databaseUrl);
  const url = new URL(databaseUrl);
  
  // Safely set and unset PGPASSWORD using try-finally
  try {
    process.env.PGPASSWORD = url.password;

    // Get table count
    const { stdout: tableCount } = await execAsync(
      `psql "${cleanUrl}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"`
    );

    // Get total database size
    const { stdout: dbSize } = await execAsync(
      `psql "${cleanUrl}" -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));"`
    );

    // Get table sizes with a more robust query
    const { stdout: tableSizes } = await execAsync(`
      psql "${cleanUrl}" -t -c "
        WITH table_sizes AS (
          SELECT
            table_name,
            CASE 
              WHEN EXISTS (
                SELECT 1 
                FROM information_schema.tables 
                WHERE table_schema = 'public' 
                AND table_name = information_schema.tables.table_name
              )
              THEN pg_size_pretty(pg_relation_size('public.' || quote_ident(table_name)))
              ELSE 'N/A'
            END as size
          FROM information_schema.tables
          WHERE table_schema = 'public'
        )
        SELECT table_name, size
        FROM table_sizes
        ORDER BY 
          CASE WHEN size = 'N/A' THEN 0
          ELSE pg_relation_size('public.' || quote_ident(table_name))
          END DESC;
      "
    `);

    return {
      tableCount: parseInt(tableCount.trim()),
      databaseSize: dbSize.trim(),
      tables: tableSizes
        .split('\n')
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
    // Check for PostgreSQL tools first
    const toolsAvailable = await checkPgTools();
    if (!toolsAvailable) {
      process.exit(1);
    }

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
    
    const databaseUrl = process.env.DATABASE_DIRECT_URL || process.env.POSTGRES_URL;
    if (!databaseUrl) {
      throw new Error('Neither DATABASE_DIRECT_URL nor POSTGRES_URL environment variable is set');
    }

    const cleanUrl = cleanDatabaseUrl(databaseUrl);
    const url = new URL(databaseUrl);
    
    // Improved command construction with proper escaping
    const command = [
      'pg_dump',
      `-h "${url.hostname}"`,
      url.port ? `-p ${url.port}` : '',
      `-U "${url.username}"`,
      `-d "${url.pathname.slice(1)}"`,
      `-f "${filepath}"`,
      '--format=p',
      '--no-owner',
      '--verbose'
    ].filter(Boolean).join(' ');

    try {
      process.env.PGPASSWORD = url.password;
      const { stderr } = await execAsync(command);
      if (stderr) console.log('Backup process output:', stderr);
    } finally {
      delete process.env.PGPASSWORD;
    }
    
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

    if (stats.size < 1000) {
      console.warn('⚠️  Warning: Backup file seems unusually small. Please verify its contents.');
    }

  } catch (error) {
    console.error('❌ Error creating backup:', error);
    throw error; // Re-throw to ensure proper exit code
  }
}

async function rotateBackups() {
  try {
    const files = await readdir(BACKUP_DIR);
    const backupFiles = files
      .filter(file => file.endsWith('.sql'))
      .map(async file => ({
        name: file,
        path: join(BACKUP_DIR, file),
        created: (await stat(join(BACKUP_DIR, file))).birthtimeMs
      }));

    const backups = await Promise.all(backupFiles);
    backups.sort((a, b) => b.created - a.created);

    for (const backup of backups.slice(MAX_BACKUPS)) {
      console.log(`🗑️ Removing old backup: ${backup.name}`);
      await unlink(backup.path);
    }
  } catch (error) {
    console.error('⚠️ Error rotating backups:', error);
    throw error; // Re-throw to ensure proper exit code
  }
}

export { backupDatabase };

// Run backup if file is being run directly
if (process.argv[1] === import.meta.url.substring(7)) {
  backupDatabase().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}