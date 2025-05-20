# Environment Variables Cleanup Recommendations

## Currently Used Environment Variables

### Supabase Related
- NEXT_PUBLIC_SUPABASE_URL - Supabase instance URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Public anon/client key
- SUPABASE_SERVICE_ROLE_KEY - Server-side admin key
- NEXT_PUBLIC_SUPABASE_BUCKET_NAME - Storage bucket name

### Sanity Related
- NEXT_PUBLIC_SANITY_API_VERSION - API version for Sanity CMS
- NEXT_PUBLIC_SANITY_DATASET - Dataset name in Sanity
- NEXT_PUBLIC_SANITY_PROJECT_ID - Sanity project ID

### Email Related
- RESEND_API_KEY - For Resend email service
- FROM_EMAIL/EMAIL_FROM - Sender email address (duplicate variables)
- ADMIN_EMAIL - Admin recipient email
- NOTIFICATION_RECIPIENT - General notification recipient
- SENDGRID_API_KEY - For Sendgrid email service
- SENDGRID_LIST_ID - Sendgrid mailing list ID
- BREVO_API_KEY - For Brevo email service

### URL Related
- NEXT_PUBLIC_SITE_URL - Site URL (appears to be main URL)
- NEXT_PUBLIC_APP_URL - App URL (potential duplicate)
- NEXT_PUBLIC_BASE_URL - Base URL (potential duplicate)
- VERCEL_URL - Vercel deployment URL

### Payment Related
- NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY - Stripe publishable key

### CaterValley Related
- NEXT_PUBLIC_CATER_VALLEY_API_URL - CaterValley API URL
- NEXT_PUBLIC_CATER_VALLEY_PARTNER_HEADER - CaterValley partner header

### Database Related
- POSTGRES_URL - PostgreSQL connection string

### Admin/Auth Related
- SUPER_ADMIN_SECRET - Secret for super admin access
- MAINTENANCE_API_KEY - API key for maintenance operations
- BYPASS_PROFILE_EMAILS - List of emails to bypass profile checks
- BYPASS_PROFILE_DOMAINS - List of domains to bypass profile checks

### Social Media Related
- NEXT_PUBLIC_FB_APP_ID - Facebook App ID

### Data Related
- LEGACY_DATA_PATH - Path to legacy data JSON file

## Recommendations for Cleanup

### 1. Duplicate Email Sender Variables
- **Recommendation**: Standardize on one variable (EMAIL_FROM) and remove FROM_EMAIL
- **Affected files**: 
  - src/app/api/register/admin/route.ts
  - src/utils/email.ts
  - src/utils/emailSender.ts

### 2. Duplicate URL Variables
- **Recommendation**: Standardize on NEXT_PUBLIC_SITE_URL and remove NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_BASE_URL
- **Affected files**:
  - src/app/(backend)/admin/catering-orders/_actions/catering-orders.ts 
  - src/app/api/job-applications/route.ts
  - src/app/api/register/admin/route.ts
  - src/components/Blog/BookNow.tsx
  - src/components/Blog/CustomSeo.tsx
  - src/lib/utils.ts

### 3. Potential Removal of LEGACY_DATA_PATH
- **Recommendation**: If the migration from legacy data is complete, this variable could be removed
- **Affected files**: src/utils/parseJson.ts

## Implementation Plan

1. First, standardize on EMAIL_FROM:
   - Update any references to FROM_EMAIL to use EMAIL_FROM
   - Remove FROM_EMAIL from environment files

2. Standardize on NEXT_PUBLIC_SITE_URL:
   - Update any references to NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_BASE_URL to use NEXT_PUBLIC_SITE_URL
   - Remove NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_BASE_URL from environment files

3. Evaluate the need for LEGACY_DATA_PATH:
   - If legacy data migration is complete, remove this variable and update the code to use a fixed path

4. Update documentation to reflect these changes 