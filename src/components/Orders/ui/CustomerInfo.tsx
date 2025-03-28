// src/components/Orders/ui/CustomerInfo.tsx
import React from 'react';
import { User, Mail, Phone, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface CustomerInfoProps {
  name?: string | null;
  email?: string | null;
  phone?: string | null; // Added phone prop to be more complete
}

const CustomerInfo: React.FC<CustomerInfoProps> = ({ 
  name, 
  email,
  phone
}) => {
  // Get initials for avatar
  const getInitials = (name?: string | null): string => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 border bg-slate-100">
          <AvatarFallback className="bg-gradient-to-br from-amber-100 to-orange-100 text-amber-700">
            {getInitials(name)}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <h3 className="font-semibold text-lg text-slate-800">
            {name || "Customer Name Not Available"}
          </h3>
          {email && (
            <p className="text-slate-600 flex items-center mt-1">
              <Mail className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              {email}
            </p>
          )}
          {phone && (
            <p className="text-slate-600 flex items-center mt-1">
              <Phone className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
              {phone}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row md:justify-end gap-2 mt-4 md:mt-0">
        {email && (
          <Button
            variant="outline"
            className="gap-2 text-sm h-9 text-slate-600 hover:text-amber-700 hover:border-amber-200"
            asChild
          >
            <a href={`mailto:${email}`}>
              <Mail className="h-4 w-4" />
              Email Customer
            </a>
          </Button>
        )}
        
        {name && (
          <Button
            variant="outline"
            className="gap-2 text-sm h-9 text-slate-600 hover:text-amber-700 hover:border-amber-200"
            asChild
          >
            <a href={`/admin/customers?search=${encodeURIComponent(name)}`}>
              <ExternalLink className="h-4 w-4" />
              View Customer Profile
            </a>
          </Button>
        )}
      </div>
    </div>
  );
};

export default CustomerInfo;