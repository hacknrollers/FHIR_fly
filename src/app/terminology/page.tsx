'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SearchBox } from '@/components/SearchBox';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { addProblem, getProblemList } from '@/lib/api';
import { TerminologyResult } from '@/lib/api';
import { Plus, Check, AlertCircle } from 'lucide-react';

export default function TerminologySearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const queryClient = useQueryClient();

  // Get current problem list to check which terms are already added
  const { data: problemList = [] } = useQuery({
    queryKey: ['problem-list'],
    queryFn: getProblemList,
  });

  // Mutation to add term to problem list
  const addToProblemListMutation = useMutation({
    mutationFn: addProblem,
    onSuccess: () => {
      // Invalidate and refetch problem list
      queryClient.invalidateQueries({ queryKey: ['problem-list'] });
    },
  });

  const handleAddToProblemList = async (term: TerminologyResult) => {
    try {
      await addToProblemListMutation.mutateAsync(term);
    } catch (error) {
      console.error('Error adding to problem list:', error);
    }
  };

  const isTermInProblemList = (termId: string) => {
    return problemList.some(problem => 
      problem.termName === problemList.find(p => p.id === termId)?.termName
    );
  };

  return (
    <ProtectedRoute>
      <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Terminology Search</h1>
          <p className="text-gray-600 mt-2">Search and map medical terminology using NAMASTE and ICD-11 codes</p>
        </div>

        {/* Search Section */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Search Medical Terms</h2>
              <p className="text-sm text-gray-600">
                Enter a term name, NAMASTE code, or ICD-11 code to find terminology mappings
              </p>
            </div>
            
            <SearchBox
              onAddToProblemList={handleAddToProblemList}
              placeholder="Search for terms like 'Jwara', 'NAM-001', or 'ICD11-AB01'..."
              className="w-full"
            />
          </div>
        </Card>

        {/* Instructions */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">How to use Terminology Search</h3>
              <div className="mt-2 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>Search by term name (e.g., "Jwara", "Ajeerna")</li>
                  <li>Search by NAMASTE code (e.g., "NAM-001", "NAM-002")</li>
                  <li>Search by ICD-11 code (e.g., "ICD11-AB01", "ICD11-DD90")</li>
                  <li>Click "Add" to add terms to your problem list</li>
                  <li>Terms already in your problem list will be marked as added</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Recent Additions */}
        {problemList.length > 0 && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Recently Added to Problem List</h2>
                <p className="text-sm text-gray-600">
                  Terms you've recently added to your problem list
                </p>
              </div>
              
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {problemList.slice(0, 6).map((problem) => (
                  <div
                    key={problem.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">{problem.termName}</div>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {problem.namasteCode}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {problem.icd11Code}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center text-green-600">
                      <Check className="h-4 w-4" />
                    </div>
                  </div>
                ))}
              </div>
              
              {problemList.length > 6 && (
                <div className="text-center">
                  <Button variant="outline" asChild>
                    <a href="/problems">View All Problems ({problemList.length})</a>
                  </Button>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Popular Terms */}
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Popular Terms</h2>
              <p className="text-sm text-gray-600">
                Commonly searched and mapped terminology
              </p>
            </div>
            
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { term: 'Jwara', namaste: 'NAM-001', icd11: 'ICD11-AB01', description: 'Fever' },
                { term: 'Ajeerna', namaste: 'NAM-002', icd11: 'ICD11-DD90', description: 'Indigestion' },
                { term: 'Kasa', namaste: 'NAM-003', icd11: 'ICD11-CA40', description: 'Cough' },
                { term: 'Shwasa', namaste: 'NAM-004', icd11: 'ICD11-CB40', description: 'Breathing difficulty' },
                { term: 'Hridroga', namaste: 'NAM-005', icd11: 'ICD11-BA00', description: 'Heart disease' },
                { term: 'Pandu', namaste: 'NAM-006', icd11: 'ICD11-3A10', description: 'Anemia' }
              ].map((term) => (
                <div
                  key={term.term}
                  className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="font-medium text-gray-900">{term.term}</div>
                  <div className="text-sm text-gray-600 mt-1">{term.description}</div>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary" className="text-xs">
                      {term.namaste}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {term.icd11}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
