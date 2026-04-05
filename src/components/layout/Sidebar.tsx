'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, CreditCard, Settings, Dumbbell, DollarSign } from 'lucide-react';

const menuItems = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: Users, label: 'Clientes', href: '/clientes' },
  { icon: CreditCard, label: 'Planes', href: '/planes' },
  { icon: Dumbbell, label: 'Suscripciones', href: '/suscripciones' },
  { icon: DollarSign, label: 'Pagos / Caja', href: '/pagos' },
  { icon: Settings, label: 'Configuración', href: '/configuracion' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="bg-gray-900 text-white w-64 h-screen sticky top-0 flex flex-col hidden md:flex">
      <div className="p-6 flex items-center gap-3 border-b border-gray-800">
        <div className="bg-blue-600 p-2 rounded-lg">
          <Dumbbell size={24} className="text-white" />
        </div>
        <span className="text-xl font-bold tracking-wider">GymSaaS</span>
      </div>
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
