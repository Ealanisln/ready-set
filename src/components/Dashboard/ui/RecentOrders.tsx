import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order Number</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Total</TableHead>
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
            <TableCell className="text-right">
              $
              {typeof order.order_total === "string"
                ? parseFloat(order.order_total).toFixed(2)
                : order.order_total.toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
  