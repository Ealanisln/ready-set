import { exec } from 'child_process';
import { existsSync } from 'fs';
import { config } from 'dotenv';
import { join } from 'path';
import { readFile } from 'fs/promises';

config();

const execAsync = (command: string): Promise<{ stdout: string; stderr: string }> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        const enhancedError = new Error(`Command failed: ${error.message}\nCommand: ${command}\nStderr: ${stderr}`);
        reject(enhancedError);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
};

interface DatabaseConfig {
  isDocker: boolean;
  databaseUrl?: string;
  dockerDatabase?: {
    container: string;
    dbName: string;
    user: string;
  };
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
  
  url.search = cleanParams.toString();
  return url.toString();
}

async function detectEnvironment(): Promise<DatabaseConfig> {
  // Check if we're in a Docker environment
  try {
    const { stdout } = await execAsync('docker compose ps --format json');
    const containers = JSON.parse(`[${stdout.trim().split('\n').join(',')}]`);
    const dbContainer = containers.find((c: any) => 
      c.Service === 'db' || c.Service?.includes('postgres')
    );

    if (dbContainer) {
      return {
        isDocker: true,
        dockerDatabase: {
          container: dbContainer.Name,
          dbName: process.env.POSTGRES_DB || 'postgres',
          user: process.env.POSTGRES_USER || 'postgres'
        }
      };
    }
  } catch (error) {
    // Docker not available or not running
  }

  // Check for Neon database URL
  const databaseUrl = process.env.DATABASE_DIRECT_URL || process.env.POSTGRES_URL;
  if (databaseUrl) {
    return {
      isDocker: false,
      databaseUrl
    };
  }

  throw new Error('No database configuration found. Please either:' +
    '\n1. Start your Docker containers with docker compose up' +
    '\n2. Or set DATABASE_DIRECT_URL/POSTGRES_URL environment variable for Neon');
}

async function checkPgTools(isDocker: boolean) {
  if (isDocker) {
    try {
      await execAsync('docker compose ps');
      return true;
    } catch (error) {
      console.error('❌ Docker Compose not available. Make sure Docker is running.');
      return false;
    }
  } else {
    try {
      const { stdout: psqlVersion } = await execAsync('psql --version');
      console.log('Using PostgreSQL client:', psqlVersion.trim());
      return true;
    } catch (error) {
      console.error('❌ PostgreSQL tools not found. Please install PostgreSQL command-line tools:');
      console.log('\nOn macOS: brew install postgresql@16');
      console.log('On Ubuntu/Debian: sudo apt-get install postgresql-client-16');
      console.log('On Windows: Install from postgresql.org and ensure Command Line Tools are selected');
      return false;
    }
  }
}

async function verifyBackupFile(backupPath: string) {
  try {
    const content = await readFile(backupPath, 'utf-8');
    
    const hasCreateTable = content.includes('CREATE TABLE');
    const hasInsertData = content.includes('INSERT INTO') || content.includes('COPY');
    
    if (!hasCreateTable) {
      throw new Error('Backup file does not contain any CREATE TABLE statements');
    }
    
    if (!hasInsertData) {
      console.warn('⚠️  Warning: Backup file might not contain any data (no INSERT or COPY statements found)');
    }
    
    const tableCount = (content.match(/CREATE TABLE/g) || []).length;
    console.log(`📊 Found ${tableCount} tables in backup file`);
    
    return true;
  } catch (error) {
    console.error('❌ Error verifying backup file:', error);
    return false;
  }
}

async function restoreDatabase() {
  if (!process.argv[2]) {
    console.error('❌ Please provide a backup file name');
    console.error('Usage: pnpm run restore-db <backup-file>');
    process.exit(1);
  }

  const backupPath = process.argv[2];
  const fullBackupPath = join(process.cwd(), backupPath);

  if (!existsSync(fullBackupPath)) {
    console.error(`❌ Backup file not found: ${fullBackupPath}`);
    process.exit(1);
  }

  try {
    // Detect environment and get configuration
    console.log('🔍 Detecting environment...');
    const config = await detectEnvironment();
    console.log(`📌 Using ${config.isDocker ? 'Docker' : 'Neon'} environment`);

    // Check required tools
    const toolsAvailable = await checkPgTools(config.isDocker);
    if (!toolsAvailable) {
      process.exit(1);
    }

    // Verify backup file
    console.log('🔍 Verifying backup file...');
    const isValid = await verifyBackupFile(fullBackupPath);
    if (!isValid) {
      process.exit(1);
    }

    console.log('⚠️  Warning: This will overwrite the current database content.');
    console.log('Press Ctrl+C within 5 seconds to cancel...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    if (config.isDocker && config.dockerDatabase) {
      const { container, dbName, user } = config.dockerDatabase;

      console.log('🗑️  Dropping existing database...');
      try {
        await execAsync(`docker compose exec -T db dropdb -U ${user} --force ${dbName}`);
      } catch (error) {
        // Ignore error if database doesn't exist
      }

      console.log('🗄️  Creating new database...');
      await execAsync(`docker compose exec -T db createdb -U ${user} ${dbName}`);

      console.log('📥 Restoring database from backup...');
      await execAsync(`docker compose exec -T db psql -U ${user} -d ${dbName} < "${fullBackupPath}"`);

      // Verify restoration
      const { stdout: tableCount } = await execAsync(
        `docker compose exec -T db psql -U ${user} -d ${dbName} -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"`
      );
      console.log(`📊 Verified ${parseInt(tableCount.trim())} tables restored`);

    } else if (!config.isDocker && config.databaseUrl) {
      const cleanUrl = cleanDatabaseUrl(config.databaseUrl);
      const url = new URL(config.databaseUrl);

      // Set password for psql commands
      process.env.PGPASSWORD = url.password;

      try {
        console.log('🗑️  Dropping existing objects...');
        await execAsync(`
          psql "${cleanUrl}" -c "
            DO $$ DECLARE
              r RECORD;
            BEGIN
              FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
                EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
              END LOOP;
            END $$;
          "
        `);

        console.log('📥 Restoring database from backup...');
        await execAsync(`psql "${cleanUrl}" < "${fullBackupPath}"`);

        // Verify restoration
        const { stdout: tableCount } = await execAsync(
          `psql "${cleanUrl}" -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';"`
        );
        console.log(`📊 Verified ${parseInt(tableCount.trim())} tables restored`);

      } finally {
        delete process.env.PGPASSWORD;
      }
    }

    console.log('\n✅ Database restored successfully!');

  } catch (error) {
    console.error('❌ Error restoring backup:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('connection refused')) {
        console.error('Database connection failed. Check your database URL and network connection.');
      }
    }
    
    process.exit(1);
  }
}

// Run restore if file is being run directly
if (process.argv[1] === import.meta.url.substring(7)) {
  restoreDatabase().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { restoreDatabase };