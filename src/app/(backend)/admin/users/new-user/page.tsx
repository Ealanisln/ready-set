import React from 'react';
import { Metadata } from 'next';
import { PageHeader } from '@/components/Dashboard/ui/PageHeader';
import DriverHelpdeskRegistrationForm from './ui/registration-form';

export const metadata: Metadata = {
  title: 'New User | Admin Dashboard',
  description: 'Create a new driver or helpdesk user account.',
};

const NewUserPage = () => {
  return (
    <div className="flex w-full flex-col">
      <div className="p-6 pb-0">
        <PageHeader
          title="Create New User"
          description="Register a new driver or helpdesk staff member"
          breadcrumbs={[
            { label: 'Dashboard', href: '/admin' },
            { label: 'Users', href: '/admin/users' },
            { label: 'New User', href: '/admin/users/new-user', active: true },
          ]}
        />
      </div>
      <div className="p-6">
        <DriverHelpdeskRegistrationForm />
      </div>
    </div>
  );
};

export default NewUserPage;