'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Search, 
  List, 
  BarChart3,
  Database,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Terminology Search', href: '/terminology', icon: Search },
  { name: 'Problem List', href: '/problems', icon: List },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Backend Data', href: '/backend-data', icon: Database },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-50/95 backdrop-blur-sm border-r border-slate-200">
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-800">FHIR-fly</h1>
        {/* Close button for mobile */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden hover-scale"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navigation.map((item, index) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose} // Close sidebar when navigating on mobile
              className={cn(
                'group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover-scale',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-all duration-200',
                  isActive 
                    ? 'text-blue-600' 
                    : 'text-slate-500 group-hover:text-slate-700'
                )}
                aria-hidden="true"
              />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
