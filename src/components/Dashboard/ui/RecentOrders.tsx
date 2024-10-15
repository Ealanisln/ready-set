import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface CateringOrder {
  id: string;
  order_number: string;
  order_type: string;
  status: string;
  order_total: string | number;
}

interface RecentOrdersTableProps {
  orders: CateringOrder[];
}

export const RecentOrdersTable: React.FC<RecentOrdersTableProps> = ({ orders }) => (
  <div className="flex flex-col min-h-[320px] justify-between">
    <div>
      {orders.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <Link href={`/admin/catering-orders/${order.order_number}`}>
                    {order.order_number}
                  </Link>
                </TableCell>
                <TableCell>{order.order_type}</TableCell>
                <TableCell>
                  <Badge variant="outline">{order.status}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <div className="text-center py-4 text-gray-500">No active orders at this moment</div>
      )}
    </div>
  </div>
);