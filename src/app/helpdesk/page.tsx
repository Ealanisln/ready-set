import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function HelpdeskRedirectPage() {
  // Using permanent redirect to ensure proper caching behavior
  redirect('/admin');
  
  // This won't be rendered, but just in case
  return null;
} 