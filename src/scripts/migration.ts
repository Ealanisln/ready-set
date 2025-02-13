import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client/index.js';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config();

// Initialize clients
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const prisma = new PrismaClient();

// Migration parameters
const BATCH_SIZE = 50; // Adjust based on your rate limits
const ERROR_LOG_FILE = 'migration-errors.log';

async function migrateUsers() {
  try {
    const totalUsers = await prisma.user.count();
    console.log(`Starting migration of ${totalUsers} users...`);

    let migratedCount = 0;
    let errorCount = 0;

    // Batch processing for large datasets
    for (let skip = 0; skip < totalUsers; skip += BATCH_SIZE) {
      const oldUsers = await prisma.user.findMany({
        skip,
        take: BATCH_SIZE,
      });

      for (const oldUser of oldUsers) {
        try {
          if (!oldUser.email || !oldUser.password) {
            throw new Error('Missing email or password');
          }

          // Create auth user
          const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: oldUser.email,
            email_confirm: true,
            password: oldUser.password,
            user_metadata: {
              legacy_id: oldUser.id,
            }
          });

          if (authError) throw authError;

          // Create profile
          const { error: profileError } = await supabaseAdmin
            .from('profiles')
            .insert({
              auth_user_id: authUser.user.id,
              // Map all fields from original user model
              guid: oldUser.guid,
              name: oldUser.name,
              image: oldUser.image,
              type: oldUser.type,
              company_name: oldUser.company_name,
              contact_name: oldUser.contact_name,
              contact_number: oldUser.contact_number,
              website: oldUser.website,
              street1: oldUser.street1,
              street2: oldUser.street2,
              city: oldUser.city,
              state: oldUser.state,
              zip: oldUser.zip,
              location_number: oldUser.location_number,
              parking_loading: oldUser.parking_loading,
              counties: oldUser.counties,
              time_needed: oldUser.time_needed,
              catering_brokerage: oldUser.catering_brokerage,
              frequency: oldUser.frequency,
              provide: oldUser.provide,
              head_count: oldUser.head_count,
              status: oldUser.status,
              side_notes: oldUser.side_notes,
              confirmation_code: oldUser.confirmation_code,
              created_at: oldUser.created_at,
              updated_at: oldUser.updated_at,
              is_temporary_password: oldUser.isTemporaryPassword,
            });

          if (profileError) throw profileError;

          migratedCount++;
          process.stdout.write(`\rMigrated: ${migratedCount} | Errors: ${errorCount}`);
        } catch (error: any) {
          errorCount++;
          const errorMessage = `Error migrating user ${oldUser.id} (${oldUser.email}): ${error.message}\n`;
          writeFileSync(ERROR_LOG_FILE, errorMessage, { flag: 'a' });
        }
      }
    }

    console.log(`\n\nMigration complete!`);
    console.log(`Successfully migrated: ${migratedCount} users`);
    console.log(`Errors encountered: ${errorCount} (see ${ERROR_LOG_FILE})`);
  } finally {
    await prisma.$disconnect();
  }
}

migrateUsers().catch(console.error);