'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, User } from 'lucide-react';

export default function LoginPage() {
  const [abhaId, setAbhaId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log('Login page - user:', user, 'authLoading:', authLoading);
    if (user && !authLoading) {
      console.log('Login page - redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log('Attempting login with ABHA ID:', abhaId);
      await login(abhaId);
      console.log('Login successful, redirecting to dashboard');
      
      // Force a page reload to ensure state is properly updated
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            FHIR-fly
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in with your ABHA ID
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ABHA Login</CardTitle>
            <CardDescription>
              Enter your ABHA ID to access the FHIR terminology system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label htmlFor="abhaId" className="block text-sm font-medium text-gray-700">
                  ABHA ID
                </label>
                <Input
                  id="abhaId"
                  type="text"
                  required
                  value={abhaId}
                  onChange={(e) => setAbhaId(e.target.value)}
                  placeholder="Enter your ABHA ID"
                  className="mt-1"
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter a valid ABHA ID (minimum 10 characters)
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading || abhaId.length < 10}
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                Demo: Use any ABHA ID with 10+ characters
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
