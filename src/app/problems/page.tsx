'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { ProblemTable } from '@/components/ProblemTable';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getProblemList, removeProblem, addProblem } from '@/lib/api';
import { ProblemListItem, TerminologyResult } from '@/lib/api';
import { Plus, Download, Upload, AlertCircle } from 'lucide-react';

export default function ProblemListPage() {
  const [showAddForm, setShowAddForm] = useState(false);
  const queryClient = useQueryClient();

  // Get problem list
  const { data: problems = [], isLoading, error } = useQuery({
    queryKey: ['problem-list'],
    queryFn: getProblemList,
  });

  // Mutation to remove problem
  const removeProblemMutation = useMutation({
    mutationFn: removeProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem-list'] });
    },
  });

  // Mutation to add problem
  const addProblemMutation = useMutation({
    mutationFn: addProblem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['problem-list'] });
      setShowAddForm(false);
    },
  });

  const handleRemove = async (id: string) => {
    if (confirm('Are you sure you want to remove this problem from the list?')) {
      try {
        await removeProblemMutation.mutateAsync(id);
      } catch (error) {
        console.error('Error removing problem:', error);
      }
    }
  };

  const handleUpdate = async (id: string, updatedProblem: Partial<ProblemListItem>) => {
    // In a real implementation, this would call an update API
    console.log('Update problem:', id, updatedProblem);
    // For now, we'll just show a success message
    alert('Problem updated successfully! (This is a demo - changes are not persisted)');
  };

  const handleAddToProblemList = async (term: TerminologyResult) => {
    try {
      await addProblemMutation.mutateAsync(term);
    } catch (error) {
      console.error('Error adding to problem list:', error);
    }
  };

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      ['Term Name', 'NAMASTE Code', 'ICD-11 Code', 'Added Date'],
      ...problems.map(problem => [
        problem.termName,
        problem.namasteCode,
        problem.icd11Code,
        new Date(problem.addedAt).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `problem-list-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <Layout>
        <div className="text-center text-red-600">
          <p>Error loading problem list</p>
        </div>
      </Layout>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Problem List</h1>
            <p className="text-gray-600 mt-2">Manage patient problems and their terminology mappings</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={problems.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Problem
            </Button>
          </div>
        </div>

        {/* Add Problem Form */}
        {showAddForm && (
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Add New Problem</h3>
                <p className="text-sm text-gray-600">
                  Search for a term to add to your problem list
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Enter term name, NAMASTE code, or ICD-11 code..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const value = (e.target as HTMLInputElement).value;
                        if (value.trim()) {
                          // Create a dummy term for demo
                          const dummyTerm: TerminologyResult = {
                            id: `temp-${Date.now()}`,
                            termName: value,
                            namasteCode: `NAM-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
                            icd11Code: `ICD11-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
                            description: 'Custom term added by user'
                          };
                          handleAddToProblemList(dummyTerm);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Problem List Table */}
        <ProblemTable
          problems={problems}
          onRemove={handleRemove}
          onUpdate={handleUpdate}
          isLoading={isLoading}
        />

        {/* Summary Stats */}
        {problems.length > 0 && (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{problems.length}</div>
                <div className="text-sm text-gray-600">Total Problems</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(problems.map(p => p.namasteCode)).size}
                </div>
                <div className="text-sm text-gray-600">Unique NAMASTE Codes</div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {new Set(problems.map(p => p.icd11Code)).size}
                </div>
                <div className="text-sm text-gray-600">Unique ICD-11 Codes</div>
              </div>
            </Card>
          </div>
        )}

        {/* Help Section */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Managing Your Problem List</h3>
              <div className="mt-2 text-sm text-blue-800">
                <ul className="list-disc list-inside space-y-1">
                  <li>Click the edit icon to modify term details</li>
                  <li>Click the trash icon to remove problems from the list</li>
                  <li>Use the "Add Problem" button to manually add new terms</li>
                  <li>Export your problem list as CSV for external use</li>
                  <li>All changes are automatically saved (demo mode)</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
    </ProtectedRoute>
  );
}
