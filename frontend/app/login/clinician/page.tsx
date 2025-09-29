'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertCircle, Stethoscope } from 'lucide-react';

export default function ClinicianLoginPage() {
  const [email, setEmail] = useState('clinician@example.com');
  const [password, setPassword] = useState('Password123!');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { loginAsClinician, user, isLoading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await loginAsClinician(email, password);
      window.location.href = '/dashboard';
    } catch (err) {
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-slate-50 to-blue-50 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 sm:space-y-8 animate-fade-in">
        <div className="text-center animate-fade-in">
          <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-lg animate-scale-in">
            <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
          </div>
          <h2 className="mt-4 sm:mt-6 text-2xl sm:text-3xl font-extrabold text-slate-800 animate-slide-up">
            Clinician Sign In
          </h2>
          <p className="mt-2 text-sm text-slate-600 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Sign in with your email and password
          </p>
        </div>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm card-hover hover-lift animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="pb-4 sm:pb-6">
            <CardTitle className="text-lg sm:text-xl text-slate-800 animate-fade-in">Clinician Login</CardTitle>
            <CardDescription className="text-sm text-slate-600 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              Use demo credentials to access clinician features
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="clinician@example.com"
                  className="mt-1 text-sm sm:text-base"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password123!"
                  className="mt-1 text-sm sm:text-base"
                  disabled={isLoading}
                />
              </div>

              <Button
                type="submit"
                className="w-full text-sm sm:text-base hover-scale"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Login as Clinician'}
              </Button>
            </form>

            <div className="mt-4 sm:mt-6 text-center">
              <Button variant="link" className="text-sm" onClick={() => router.push('/login')}>
                Back to ABHA login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


