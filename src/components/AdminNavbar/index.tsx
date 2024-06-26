import { LayoutDashboardIcon, SettingsIcon, UsersIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const AdminNav = () => {
  return (
    <nav className="bg-gray-800 p-4">
    <div className="container mx-auto flex justify-between items-center">
      <div className="text-white font-bold text-xl">Ready Set Admin</div>
      <div className="flex space-x-4">
        <Link href="#" prefetch={false} className="text-white">
          <LayoutDashboardIcon className="h-4 w-4" />
          <span className="sr-only">Dashboard</span>
        </Link>
        <Link href="#" prefetch={false} className="text-white">
          <UsersIcon className="h-4 w-4" />
          <span className="sr-only">Users</span>
        </Link>
        <Link href="#" prefetch={false} className="text-white">
          <SettingsIcon className="h-4 w-4" />
          <span className="sr-only">Settings</span>
        </Link>
      </div>
    </div>
  </nav>
  )
}

export default AdminNav