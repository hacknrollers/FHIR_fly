'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

export function Header() {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-slate-800">FHIR-fly</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-600">
            Welcome, {user?.name || 'User'}
          </div>
          <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center">
            <span className="text-sm font-medium text-white">
              {user?.abhaId?.slice(-2) || 'U'}
            </span>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2 border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
