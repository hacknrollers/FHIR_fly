'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { SearchBox } from '@/components/SearchBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, BookOpen } from 'lucide-react';
import { type TerminologyResult, addProblem } from '@/services/api';

export default function TerminologyPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedTerm, setSelectedTerm] = useState<TerminologyResult | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleTermSelect = (term: TerminologyResult) => {
    setSelectedTerm(term);
    setAddSuccess(false);
  };

  const handleAddToProblemList = async () => {
    if (!selectedTerm) return;

    try {
      setIsAdding(true);
      await addProblem(selectedTerm);
      setAddSuccess(true);
      setSelectedTerm(null);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => setAddSuccess(false), 3000);
    } catch (error) {
      console.error('Failed to add problem:', error);
    } finally {
      setIsAdding(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Terminology Search</h1>
          <p className="text-gray-600 mt-2">
            Search and map medical terminology using NAMASTE and ICD-11 codes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="mr-2 h-5 w-5" />
                  Search Terminology
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBox
                  onSelect={handleTermSelect}
                  placeholder="Search for medical terms (e.g., Jwara, Ajeerna)..."
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Start typing to search for medical terminology. Results will show NAMASTE and ICD-11 mappings.
                </p>
              </CardContent>
            </Card>

            {addSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      Successfully added to problem list!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {selectedTerm ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Selected Term
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Term Name
                      </label>
                      <div className="p-3 bg-gray-50 rounded-md font-medium">
                        {selectedTerm.termName}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          NAMASTE Code
                        </label>
                        <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                          {selectedTerm.namasteCode}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          ICD-11 Code
                        </label>
                        <div className="p-3 bg-gray-50 rounded-md font-mono text-sm">
                          {selectedTerm.icd11Code}
                        </div>
                      </div>
                    </div>

                    {selectedTerm.description && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <div className="p-3 bg-gray-50 rounded-md text-sm">
                          {selectedTerm.description}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAddToProblemList}
                      disabled={isAdding}
                      className="w-full"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      {isAdding ? 'Adding...' : 'Add to Problem List'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>No Term Selected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <p>Search for a term to view its details and add it to your problem list.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Search Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Search by Term</h4>
                  <p className="text-gray-600">
                    Type the medical term name (e.g., "Jwara" for fever)
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Search by Code</h4>
                  <p className="text-gray-600">
                    Search using NAMASTE or ICD-11 codes directly
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Add to List</h4>
                  <p className="text-gray-600">
                    Select any term to add it to your problem list
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
