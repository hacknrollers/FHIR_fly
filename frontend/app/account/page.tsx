'use client';

import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AccountPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Account</h1>
          <p className="text-slate-900 mt-2 text-sm sm:text-base font-medium">Your profile details</p>
        </div>

        <Card className="border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                <span className="text-white font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <CardTitle className="text-slate-800">{user.name || 'User'}</CardTitle>
                <div className="text-xs text-slate-500">{user.role === 'clinician' ? 'Clinician ID' : 'ABHA ID'}: {user.abhaId}</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-200">
              <div className="flex items-center justify-between py-4">
                <div className="text-slate-700 font-medium">Name</div>
                <div className="text-slate-600">{user.name || '—'}</div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="text-slate-700 font-medium">Age</div>
                <div className="text-slate-600">{user.age ?? '—'}</div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="text-slate-700 font-medium">Mobile number</div>
                <div className="text-slate-600">{user.mobile || 'Add number'}</div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="text-slate-700 font-medium">Address</div>
                <div className="text-slate-600">{user.address || '—'}</div>
              </div>
              <div className="flex items-center justify-between py-4">
                <div className="text-slate-700 font-medium">{user.role === 'clinician' ? 'Clinician ID' : 'ABHA ID'}</div>
                <div className="text-slate-600">{user.abhaId}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}


