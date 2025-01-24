// test-env.js
require('dotenv').config({ path: '.env.local' });

console.log('Environment variables:');
console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET ? 'exists' : 'missing');
console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL ? 'exists' : 'missing');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'exists' : 'missing');