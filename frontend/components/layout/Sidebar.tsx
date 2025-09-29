'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Search, 
  List, 
  BarChart3,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Terminology Search', href: '/terminology', icon: Search },
  { name: 'Prior Medical History', href: '/problems', icon: List },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-slate-50/95 backdrop-blur-sm border-r border-slate-200">
      <div className="flex h-16 items-center justify-between px-6 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Image src="/favicon.ico" alt="FHIR-fly" width={24} height={24} />
          <h1 className="text-xl font-bold text-slate-800">FHIR-fly</h1>
        </div>
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
        {navigation
          .filter(item => {
            if (item.name === 'Analytics' && user?.role === 'abha') return false;
            if (item.name === 'Prior Medical History' && user?.role === 'clinician') return false;
            return true;
          })
          .map((item, index) => {
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
