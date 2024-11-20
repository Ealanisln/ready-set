// DashboardCard.tsx
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

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  children,
  linkText,
  linkHref,
}) => (
  <Card className="flex flex-col h-full">
    <CardHeader className="pb-3">
      <CardTitle className="text-xl font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col flex-1">
      <div className="flex-1">
        {children}
      </div>
      <div className="mt-auto pt-6 -mx-6 px-6 border-t">
        <Button 
          asChild 
          size="lg" 
          variant="outline" 
          className="w-full bg-white hover:bg-gray-50"
        >
          <Link href={linkHref}>{linkText}</Link>
        </Button>
      </div>
    </CardContent>
  </Card>
);