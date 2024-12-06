// scripts/db-tasks.ts
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : '.env';

const command = process.argv[2]; // get the command argument

switch (command) {
  case 'generate':
    Bun.spawn(['bunx', 'prisma', 'generate'], {
      env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
    });
    break;
  case 'migrate':
    Bun.spawn(['bunx', 'prisma', 'migrate', env === 'production' ? 'deploy' : 'dev'], {
      env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
    });
    break;
  case 'studio':
    Bun.spawn(['bunx', 'prisma', 'studio'], {
      env: { ...process.env, PRISMA_SCHEMA_FILE: envFile }
    });
    break;
}