'use client';

import { Menu, Bell, User } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button className="md:hidden text-gray-500 hover:text-gray-700">
          <Menu size={24} />
        </button>
        <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">Panel de Control</h2>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:text-blue-600 transition-colors">
          <Bell size={20} />
        </button>
        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="bg-gray-100 p-2 rounded-full">
            <User size={20} className="text-gray-600" />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">Admin</span>
        </div>
      </div>
    </header>
  );
}
