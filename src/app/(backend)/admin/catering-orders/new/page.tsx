// src/app/(backend)/admin/catering-orders/new/page.tsx
// Create order from admin side

import React from 'react';
import { Metadata } from 'next';
import { PageHeader } from '@/components/Dashboard/ui/PageHeader';
import { CreateCateringOrderForm } from '@/components/Orders/CateringOrders/CreateCateringOrderForm';
import { getClients } from '../_actions/catering-orders';
import { ClientListItem } from '../_actions/schemas';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Catering Order | Admin Dashboard',
  description: 'Create a new catering order.',
};

const NewCateringOrderPage = async () => {
  const clientResult = await getClients();

  if ('error' in clientResult) {
    return (
      <div className="flex w-full flex-col">
         <div className="p-6 pb-0">
            <PageHeader
                title="Create New Catering Order"
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Catering Orders', href: '/admin/catering-orders' },
                    { label: 'New Order', href: '/admin/catering-orders/new', active: true },
                ]}
            />
        </div>
        <div className="p-6">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error Loading Clients</AlertTitle>
            <AlertDescription>
              Could not load client list. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const clients = clientResult as ClientListItem[];

  return (
    <div className="flex w-full flex-col">
      <div className="p-6 pb-0">
        <PageHeader
          title="Create New Catering Order"
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Catering Orders', href: '/admin/catering-orders' },
            { label: 'New Order', href: '/admin/catering-orders/new', active: true },
          ]}
        />
      </div>
      <div className="p-6">
        <CreateCateringOrderForm clients={clients} />
      </div>
    </div>
  );
};

export default NewCateringOrderPage; 