'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const adminNavItems = [
  {
    title: 'Dashboard',
    href: '/(backend)/admin',
  },
  {
    title: 'Users',
    href: '/(backend)/admin/users',
  },
  {
    title: 'Settings',
    href: '/(backend)/admin/settings',
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r bg-white p-4">
      <nav className="space-y-1">
        {adminNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium',
              pathname === item.href
                ? 'bg-amber-50 text-amber-700'
                : 'text-slate-700 hover:bg-slate-100'
            )}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 