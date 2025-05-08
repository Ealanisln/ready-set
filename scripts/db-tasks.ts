const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env';
import { spawn } from 'child_process';

console.log(`Running in ${env} mode using ${envFile}`);

const command = process.argv[2];

async function verifyDatabaseConnection() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log('✅ Database connection successful');
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    await prisma.$disconnect();
    return false;
  }
}

async function checkMigrationStatus() {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const migrations = await prisma.$queryRaw`
      SELECT migration_name, finished_at, applied_steps_count 
      FROM "_prisma_migrations" 
      ORDER BY finished_at DESC 
      LIMIT 5
    `;
    console.log('📋 Recent migrations:', migrations);
    
    const failedMigrations = await prisma.$queryRaw`
      SELECT migration_name, started_at 
      FROM "_prisma_migrations" 
      WHERE finished_at IS NULL
    `;
    
    if (failedMigrations.length > 0) {
      console.error('❌ Failed migrations found:', failedMigrations);
      return false;
    }
    
    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
    return false;
  }
}

async function runTests() {
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Connection test passed');

    // Test basic queries
    await prisma.user.findFirst();
    console.log('✅ User model query test passed');

    // Test transactions
    await prisma.$transaction(async (tx: Omit<typeof PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use'>) => {
      await tx.user.findFirst();
      console.log('✅ Transaction test passed');
    });

    // Test relationships
    const testQueries = await Promise.all([
      prisma.user.findFirst({
        include: {
          accounts: true,
          savedAddresses: true
        }
      }),
      prisma.address.findFirst({
        include: {
          creator: true
        }
      }),
      prisma.catering_request.findFirst({
        include: {
          user: true,
          address: true
        }
      })
    ]);

    console.log('✅ Relationship queries test passed');

    await prisma.$disconnect();
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    await prisma.$disconnect();
    return false;
  }
}

function spawnProcess(command: string[], options: any): Promise<number> {
  return new Promise((resolve, reject) => {
    const childProcess = spawn('pnpm', command, {
      ...options,
      stdio: 'inherit',
      shell: true
    });

    childProcess.on('close', (code) => {
      resolve(code ?? 0);
    });

    childProcess.on('error', (error) => {
      reject(error);
    });
  });
}

switch (command) {
  case 'generate':
    console.log('🔄 Generating Prisma Client...');
    spawnProcess(['prisma', 'generate'], {
      env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
    }).catch(error => {
      console.error('❌ Generation failed:', error);
      process.exit(1);
    });
    break;

  case 'migrate':
    if (env === 'production') {
      console.log('🚀 Running production migration deploy...');
      spawnProcess(['prisma', 'migrate', 'deploy'], {
        env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
      }).then(async (exitCode) => {
        if (exitCode === 0) {
          console.log('✅ Migration completed');
          const statusOk = await checkMigrationStatus();
          const testsOk = await runTests();
          
          if (!statusOk || !testsOk) {
            process.exit(1);
          }
        } else {
          console.error('❌ Migration failed with exit code:', exitCode);
          process.exit(1);
        }
      }).catch(error => {
        console.error('❌ Migration error:', error);
        process.exit(1);
      });
    } else {
      console.log('🔄 Running development migration...');
      spawnProcess(['prisma', 'migrate', 'dev'], {
        env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
      }).catch(error => {
        console.error('❌ Migration failed:', error);
        process.exit(1);
      });
    }
    break;

  case 'studio':
    console.log('🔄 Starting Prisma Studio...');
    spawnProcess(['prisma', 'studio'], {
      env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
    }).catch(error => {
      console.error('❌ Studio failed to start:', error);
      process.exit(1);
    });
    break;

  case 'verify':
    console.log('🔄 Running verification...');
    verifyDatabaseConnection().then(async (connectionOk) => {
      if (connectionOk) {
        const statusOk = await checkMigrationStatus();
        const testsOk = await runTests();
        
        if (!statusOk || !testsOk) {
          process.exit(1);
        }
      } else {
        process.exit(1);
      }
    });
    break;

  case 'status':
    console.log('🔄 Checking migration status...');
    spawnProcess(['prisma', 'migrate', 'status'], {
      env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
    }).catch(error => {
      console.error('❌ Status check failed:', error);
      process.exit(1);
    });
    break;

  default:
    console.error('❌ Unknown command:', command);
    console.log('Available commands: generate, migrate, studio, verify, status');
    process.exit(1);
}