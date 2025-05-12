import { redirect } from 'next/navigation';

export default function HelpdeskRedirectPage() {
  // Redirect to admin dashboard
  redirect('/admin');
  
  // This won't be rendered, but just in case
  return null;
} 