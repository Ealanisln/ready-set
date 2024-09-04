import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

// Types
interface MetricCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    change: string;
  }
  
// Metric Card Component
export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, change }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="text-muted-foreground h-4 w-4" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* <p className="text-muted-foreground text-xs">{change}</p> */}
      </CardContent>
    </Card>
  );