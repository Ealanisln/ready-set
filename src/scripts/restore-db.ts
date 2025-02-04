// src/scripts/restore-db.ts
import { exec } from 'child_process';
import { promisify } from 'util';
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const execAsync = promisify(exec);
const prisma = new PrismaClient();

async function examineBackupFile(filePath: string) {
  console.log('📑 Examining backup file...');
  const content = readFileSync(filePath, 'utf8');
  
  // Check for key components
  const hasData = content.includes('COPY') || content.includes('INSERT INTO');
  const hasTables = content.includes('CREATE TABLE');
  const hasSchema = content.includes('CREATE SCHEMA');
  
  console.log(`Backup contains:`);
  console.log(`- Schema creation: ${hasSchema}`);
  console.log(`- Table creation: ${hasTables}`);
  console.log(`- Data: ${hasData}`);
  
  return { hasData, hasTables, hasSchema };
}

async function executeSQL(databaseUrl: string, command: string): Promise<string> {
  try {
    const { stdout, stderr } = await execAsync(`psql "${databaseUrl}" -c "${command}"`);
    if (stderr && !stderr.includes('NOTICE')) {
      console.warn('SQL Warning:', stderr);
    }
    return stdout;
  } catch (error) {
    console.error('SQL Error:', error);
    throw error;
  }
}

async function restoreDatabase() {
  if (!process.argv[2]) {
    console.error('❌ Please provide a backup file name');
    console.error('Usage: tsx run restore-db.ts <backup-file>');
    process.exit(1);
  }

  const backupPath = path.resolve(process.argv[2]);

  if (!existsSync(backupPath)) {
    console.error(`❌ Backup file not found: ${backupPath}`);
    process.exit(1);
  }

  try {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      console.error('❌ DATABASE_URL environment variable is not set');
      process.exit(1);
    }

    // Examine backup file first
    const backupFileContent = await examineBackupFile(backupPath);
    if (!backupFileContent.hasData) {
      console.error('⚠️  Warning: Backup file appears to contain no data!');
      process.exit(1);
    }

    console.log('🗑️  Cleaning up database...');
    
    // Reset the schema
    try {
      await executeSQL(databaseUrl, 'DROP SCHEMA public CASCADE;');
      await executeSQL(databaseUrl, 'CREATE SCHEMA public;');
      await executeSQL(databaseUrl, 'GRANT ALL ON SCHEMA public TO public;');
    } catch (error) {
      console.warn('Warning during schema reset:', error);
    }

    console.log('✅ Database cleaned');

    // First apply the schema using prisma migrate
    console.log('🔄 Applying current schema...');
    await execAsync('npx prisma migrate deploy');

    console.log('📥 Restoring data from backup...');
    // Extract and execute only the COPY statements from the backup
    const backupContent = readFileSync(backupPath, 'utf8');
    const copyStatements = backupContent
      .split('\n')
      .filter(line => line.startsWith('COPY'))
      .join('\n');

    if (copyStatements) {
      const tempFile = path.join(process.cwd(), 'temp_copy_statements.sql');
      require('fs').writeFileSync(tempFile, copyStatements);
      
      try {
        await execAsync(`psql "${databaseUrl}" < "${tempFile}"`);
      } finally {
        require('fs').unlinkSync(tempFile);
      }
    }

    // Verify data
    console.log('🔍 Verifying restoration...');
    const userCount = await prisma.user.count();
    console.log(`Found ${userCount} users in the database`);

    if (userCount === 0) {
      console.error('⚠️  Warning: No users found after restore. Something might have gone wrong.');
      console.log('Examining database tables...');
      const tables = await executeSQL(databaseUrl, '\\dt');
      console.log('Available tables:', tables);
    } else {
      console.log('✅ Database restored successfully!');
    }

    await prisma.$disconnect();
    
  } catch (error: unknown) {
    console.error('❌ Error restoring backup:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('connection refused')) {
        console.error('Database connection failed. Check your DATABASE_URL and ensure you have network connectivity.');
      }
    }
    
    await prisma.$disconnect();
    process.exit(1);
  }
}

restoreDatabase();