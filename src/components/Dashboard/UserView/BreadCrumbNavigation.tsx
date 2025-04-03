import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadCrumbNavigationProps {
  items?: Array<{
    label: string;
    href?: string;
  }>;
}

export const BreadcrumbNavigation: React.FC<BreadCrumbNavigationProps> = ({ 
  items = [
    { label: 'Home', href: '/admin' },
    { label: 'Settings', href: '/admin/settings' }
  ] 
}) => {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
            {item.href ? (
              <Link
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}; 