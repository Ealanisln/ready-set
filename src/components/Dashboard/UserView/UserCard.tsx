// src/components/Users/UserCard.tsx

import React from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, Building, Edit, ArrowUpRight } from "lucide-react";

// User type definition matching the one from the UsersPage component
interface User {
  id: string;
  name?: string | null;
  contact_name?: string | null;
  email: string | null;
  contact_number: string | null;
  type: "driver" | "vendor" | "client" | "helpdesk" | "admin" | "super_admin";
  company_name?: string | null;
  city?: string | null;
  state?: string | null;
  status?: "active" | "pending" | "deleted";
}

interface UserCardProps {
  user: User;
  onClick?: (userId: string) => void;
}

// Helper function to get the appropriate badge color based on user type
const getUserTypeBadgeClass = (type: string): string => {
  const config: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    super_admin: "bg-indigo-100 text-indigo-700",
    vendor: "bg-blue-100 text-blue-700",
    client: "bg-green-100 text-green-700",
    driver: "bg-yellow-100 text-yellow-700",
    helpdesk: "bg-orange-100 text-orange-700"
  };
  
  return config[type] || "bg-gray-100 text-gray-700";
};

// Helper function to get the appropriate badge color based on user status
const getStatusBadgeClass = (status: string): string => {
  const config: Record<string, string> = {
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    deleted: "bg-red-100 text-red-800"
  };
  
  return config[status] || "bg-gray-100 text-gray-700";
};

// Helper function to get user's display name
const getUserDisplayName = (user: User): string => {
  if (user.name) return user.name;
  if (user.contact_name) return user.contact_name;
  return user.email || 'Unnamed User';
};

// Helper function to get user's initials for the avatar
const getUserInitials = (user: User): string => {
  const displayName = getUserDisplayName(user);
  return displayName
    .split(' ')
    .map(name => name[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const UserCard: React.FC<UserCardProps> = ({ user, onClick }) => {
  const handleClick = () => {
    if (onClick) {
      onClick(user.id);
    }
  };

  // Define user-type specific background gradient
  const getBgGradient = (type: string): string => {
    const gradients: Record<string, string> = {
      admin: "from-purple-500 to-indigo-500",
      super_admin: "from-indigo-500 to-blue-500",
      vendor: "from-blue-500 to-cyan-500",
      client: "from-green-500 to-emerald-500",
      driver: "from-yellow-500 to-amber-500",
      helpdesk: "from-orange-500 to-amber-500"
    };
    
    return gradients[type] || "from-slate-500 to-slate-400";
  };

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md h-full flex flex-col">
      {/* Top color stripe based on user type */}
      <div className={`h-2 bg-gradient-to-r ${getBgGradient(user.type)}`}></div>
      
      <CardContent className="p-6 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <Avatar className="h-12 w-12 mr-3 border-2 border-white shadow-sm">
              <AvatarImage src={`/api/placeholder/100/100?text=${getUserInitials(user)}`} alt={getUserDisplayName(user)} />
              <AvatarFallback className={`bg-gradient-to-r ${getBgGradient(user.type)} text-white`}>
                {getUserInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium text-slate-800 line-clamp-1">{getUserDisplayName(user)}</h3>
              <div className="flex flex-wrap gap-2 mt-1">
                <Badge className={`${getUserTypeBadgeClass(user.type)} font-medium text-xs`}>{user.type}</Badge>
                {user.status && (
                  <Badge className={`${getStatusBadgeClass(user.status)} font-medium text-xs`}>{user.status}</Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col flex-grow space-y-3 text-sm">
          {user.email && (
            <div className="flex items-start">
              <Mail className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-slate-600 line-clamp-1">{user.email}</span>
            </div>
          )}
          
          {user.contact_number && (
            <div className="flex items-start">
              <Phone className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-slate-600">{user.contact_number}</span>
            </div>
          )}
          
          {user.company_name && (
            <div className="flex items-start">
              <Building className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-slate-600 line-clamp-1">{user.company_name}</span>
            </div>
          )}
          
          {user.city && user.state && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-slate-400 mt-0.5 mr-2 flex-shrink-0" />
              <span className="text-slate-600">{`${user.city}, ${user.state}`}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
          <Link href={`/admin/users/${user.id}`} className="inline-flex">
            <Button variant="outline" size="sm" className="flex gap-1 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700">
              <Edit className="h-3.5 w-3.5" />
              <span>Edit</span>
            </Button>
          </Link>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-500 hover:text-slate-700" 
            onClick={handleClick}
          >
            <span>View</span>
            <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;