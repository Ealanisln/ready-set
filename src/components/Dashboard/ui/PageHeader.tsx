// src/components/Dashboard/ui/PageHeader.tsx

import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
  active?: boolean;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  breadcrumbs,
  actions,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="flex items-center gap-1 text-sm text-slate-500">
            <li>
              <Link
                href="/admin"
                className="flex items-center hover:text-amber-600 transition-colors"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="sr-only">Home</span>
              </Link>
            </li>
            {breadcrumbs.map((item, index) => (
              <li key={index} className="flex items-center">
                <ChevronRight className="h-3.5 w-3.5 mx-1 text-slate-300" />
                {item.active ? (
                  <span className="font-medium text-slate-700">{item.label}</span>
                ) : (
                  <Link
                    href={item.href}
                    className="hover:text-amber-600 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {title}
          </h1>
          {description && (
            <p className="mt-1 text-slate-500 max-w-lg">
              {description}
            </p>
          )}
        </div>
        
        {actions && (
          <div className="flex gap-3 mt-2 sm:mt-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};