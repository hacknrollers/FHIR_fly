'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProblemTable } from '@/components/ProblemTable';
import { SearchBox } from '@/components/SearchBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, List, AlertCircle } from 'lucide-react';
import { 
  getProblemList, 
  addProblem, 
  removeProblem, 
  type ProblemListItem, 
  type TerminologyResult 
} from '@/services/api';

export default function ProblemsPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [problems, setProblems] = useState<ProblemListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      loadProblems();
    }
  }, [user, authLoading, router]);

  const loadProblems = async () => {
    try {
      setIsLoading(true);
      const data = await getProblemList();
      setProblems(data);
    } catch (error) {
      console.error('Failed to load problems:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProblem = async (term: TerminologyResult) => {
    try {
      const newProblem = await addProblem(term);
      setProblems(prev => [...prev, newProblem]);
    } catch (error) {
      console.error('Failed to add problem:', error);
    }
  };

  const handleRemoveProblem = async (id: string) => {
    try {
      await removeProblem(id);
      setProblems(prev => prev.filter(problem => problem.id !== id));
    } catch (error) {
      console.error('Failed to remove problem:', error);
    }
  };

  const handleUpdateProblem = (id: string, updates: Partial<ProblemListItem>) => {
    setProblems(prev => 
      prev.map(problem => 
        problem.id === id ? { ...problem, ...updates } : problem
      )
    );
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      // In a real app, this would save all changes to the backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaveMessage('Changes saved successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save changes:', error);
    } finally {
      setIsSaving(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Problem List</h1>
          <p className="text-gray-600 mt-2">
            Manage patient problems and medical terminology mappings.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <List className="mr-2 h-5 w-5" />
                  Current Problems
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading problems...</p>
                  </div>
                ) : (
                  <ProblemTable
                    problems={problems}
                    onAdd={handleAddProblem}
                    onRemove={handleRemoveProblem}
                    onUpdate={handleUpdateProblem}
                    onSave={handleSave}
                    isLoading={isSaving}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Add New Problem
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SearchBox
                  onSelect={handleAddProblem}
                  placeholder="Search to add problem..."
                  className="w-full"
                />
                <p className="text-sm text-gray-500 mt-2">
                  Search for medical terms to add them to the problem list.
                </p>
              </CardContent>
            </Card>

            {saveMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {saveMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertCircle className="mr-2 h-5 w-5" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Total Problems</span>
                    <span className="font-medium">{problems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">NAMASTE Mapped</span>
                    <span className="font-medium">
                      {problems.filter(p => p.namasteCode).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">ICD-11 Mapped</span>
                    <span className="font-medium">
                      {problems.filter(p => p.icd11Code).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Problem List Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Adding Problems</h4>
                  <p className="text-gray-600">
                    Use the search box to find and add medical terms to the problem list.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Editing Problems</h4>
                  <p className="text-gray-600">
                    Click "Edit" to modify term names, NAMASTE codes, or ICD-11 codes.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Saving Changes</h4>
                  <p className="text-gray-600">
                    Click "Save Changes" to persist your modifications to the system.
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
