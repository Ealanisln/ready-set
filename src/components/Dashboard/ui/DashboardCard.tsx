import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';


interface DashboardCardProps {
    title: string;
    children: React.ReactNode;
    linkText: string;
    linkHref: string;
  }

// Dashboard Card Component
export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  linkText,
  linkHref,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      {children}
      <Button asChild size="sm" className="mt-4 w-full">
        <Link href={linkHref}>{linkText}</Link>
      </Button>
    </CardContent>
  </Card>
);