'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden hover-scale"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-800 sm:hidden">
            FHIR-fly
          </h1>
        </div>
        
        <div className="flex items-center space-x-2 sm:space-x-4">
          <div className="hidden sm:block text-sm text-slate-600">
            Welcome, {user?.name || 'User'}
          </div>
          <Link href="/account" className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md hover-scale" title="Account">
            <span className="text-sm font-medium text-white">
              {user?.abhaId?.slice(-2) || 'U'}
            </span>
          </Link>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="hidden sm:flex items-center space-x-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover-scale"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
          <Button
            onClick={logout}
            variant="outline"
            size="icon"
            className="sm:hidden border-slate-300 text-slate-700 hover:bg-slate-50 hover-scale"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
