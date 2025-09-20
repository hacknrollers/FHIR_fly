'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [abhaId, setAbhaId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(abhaId);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">FHIR-fly</h1>
          <p className="text-gray-600 mt-2">Terminology Management System</p>
        </div>

        <Card className="p-8 shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">ABHA Login</h2>
            <p className="text-gray-600 mt-2">Enter your ABHA ID to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="abhaId" className="block text-sm font-medium text-gray-700 mb-2">
                ABHA ID
              </label>
              <Input
                id="abhaId"
                type="text"
                placeholder="Enter your ABHA ID"
                value={abhaId}
                onChange={(e) => setAbhaId(e.target.value)}
                required
                className="w-full"
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !abhaId.trim()}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging in...
                </div>
              ) : (
                <div className="flex items-center">
                  Login
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Demo Mode: Enter any ABHA ID to continue
            </p>
          </div>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            Built for seamless FHIR terminology management
          </p>
        </div>
      </div>
    </div>
  );
}
