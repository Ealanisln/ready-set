import React from 'react';
import { Metadata } from 'next';
import { PageHeader } from '@/components/Dashboard/ui/PageHeader';
import { CreateCateringOrderForm } from '@/components/Orders/CateringOrders/CreateCateringOrderForm'; // Import the form
import { getClients } from '../_actions/catering-orders'; // Only import the action
import { ClientListItem } from '../_actions/schemas'; // Import type from schemas
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For showing errors
import { AlertCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'New Catering Order | Admin Dashboard',
  description: 'Create a new catering order.',
};

// This page is a Server Component, so we can directly call async functions
const NewCateringOrderPage = async () => {

  // Fetch clients server-side
  const clientResult = await getClients();

  // Check for errors fetching clients
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
              {clientResult.error} Could not load client list. Please try again later.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const clients = clientResult as ClientListItem[]; // Type cast after error check

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
        {/* Render the form component, passing the fetched clients */}
        <CreateCateringOrderForm clients={clients} />
      </div>
    </div>
  );
};

export default NewCateringOrderPage; 