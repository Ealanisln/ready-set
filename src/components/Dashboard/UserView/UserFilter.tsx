import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface UserFilterProps {
  onSearch?: (value: string) => void;
}

export const UserFilter: React.FC<UserFilterProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search users..."
          value={searchValue}
          onChange={handleSearch}
          className="pl-8"
        />
      </div>
      <Button variant="outline">Filter</Button>
    </div>
  );
}; 