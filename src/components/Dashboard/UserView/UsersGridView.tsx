// src/components/Users/UsersGridView.tsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import UserCard from "./UserCard";
import { useRouter } from "next/navigation";

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

interface UsersGridViewProps {
  users: User[];
}

const UsersGridView: React.FC<UsersGridViewProps> = ({ users }) => {
  const router = useRouter();

  const handleCardClick = (userId: string) => {
    router.push(`/admin/users/${userId}`);
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence>
          {users.map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <UserCard user={user} onClick={handleCardClick} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UsersGridView;