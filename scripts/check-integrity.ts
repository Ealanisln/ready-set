import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function runQuery(query: string, description: string) {
  console.log(`\n📊 ${description}...`);
  const { stdout, stderr } = await execAsync(
    `docker compose exec -T db psql -U postgres -d mydatabase -c "${query}"`
  );
  
  if (stderr && !stderr.includes('SET')) {
    console.warn('⚠️ Warnings:', stderr);
  }
  
  console.log(stdout);
  return stdout;
}

async function checkDatabaseIntegrity() {
  try {
    console.log('🔍 Starting database integrity check...\n');

    // Get table counts
    const tableCounts = `
      SELECT 
        'user' as table_name, COUNT(*) as count FROM "user"
      UNION ALL
      SELECT 'account', COUNT(*) FROM "account"
      UNION ALL
      SELECT 'session', COUNT(*) FROM "session"
      UNION ALL
      SELECT 'address', COUNT(*) FROM "address"
      UNION ALL
      SELECT 'catering_request', COUNT(*) FROM "catering_request"
      UNION ALL
      SELECT 'on_demand', COUNT(*) FROM "on_demand"
      UNION ALL
      SELECT 'dispatch', COUNT(*) FROM "dispatch"
      UNION ALL
      SELECT 'file_upload', COUNT(*) FROM "file_upload"
      ORDER BY table_name;
    `;
    
    await runQuery(tableCounts, "Table record counts");

    // Check orphaned accounts (fixed case sensitivity)
    const orphanedAccounts = `
      SELECT COUNT(*) as orphaned_accounts
      FROM "account" a
      LEFT JOIN "user" u ON a."userId" = u."id"
      WHERE u."id" IS NULL;
    `;
    
    await runQuery(orphanedAccounts, "Checking for orphaned accounts");

    // Check orphaned sessions (fixed case sensitivity)
    const orphanedSessions = `
      SELECT COUNT(*) as orphaned_sessions
      FROM "session" s
      LEFT JOIN "user" u ON s."userId" = u."id"
      WHERE u."id" IS NULL;
    `;
    
    await runQuery(orphanedSessions, "Checking for orphaned sessions");

    // Check addresses without users (fixed case sensitivity)
    const orphanedAddresses = `
      SELECT COUNT(*) as addresses_without_users
      FROM "address" a
      LEFT JOIN "user" u ON a."createdBy" = u."id"
      WHERE u."id" IS NULL;
    `;
    
    await runQuery(orphanedAddresses, "Checking for addresses without users");

    // Check catering requests with invalid addresses
    const invalidCateringRequests = `
      SELECT COUNT(*) as invalid_catering_requests
      FROM "catering_request" cr
      LEFT JOIN "address" a ON cr."address_id" = a."id"
      WHERE a."id" IS NULL AND cr."address_id" IS NOT NULL;
    `;
    
    await runQuery(invalidCateringRequests, "Checking for catering requests with invalid addresses");

    // Check invalid dispatch references
    const invalidDispatches = `
      SELECT COUNT(*) as invalid_dispatches
      FROM "dispatch" d
      LEFT JOIN "catering_request" cr ON d."cateringRequestId" = cr."id"
      LEFT JOIN "on_demand" od ON d."on_demandId" = od."id"
      WHERE (cr."id" IS NULL AND d."cateringRequestId" IS NOT NULL)
         OR (od."id" IS NULL AND d."on_demandId" IS NOT NULL);
    `;
    
    await runQuery(invalidDispatches, "Checking for invalid dispatch references");

    // Check enum types
    const enumTypes = `
      SELECT 
        t.typname as enum_type,
        array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
      FROM pg_type t 
      JOIN pg_enum e ON t.oid = e.enumtypid  
      GROUP BY t.typname
      ORDER BY t.typname;
    `;
    
    await runQuery(enumTypes, "Checking enum types and values");

    console.log('\n✅ Database integrity check completed');
  } catch (error: unknown) {
    console.error('❌ Error checking database integrity:', error);
    
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

checkDatabaseIntegrity();