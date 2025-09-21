'use client';

import { useState } from 'react';
import { Trash2, Plus, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type ProblemListItem, type TerminologyResult } from '@/services/api';

interface ProblemTableProps {
  problems: ProblemListItem[];
  onAdd: (term: TerminologyResult) => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ProblemListItem>) => void;
  onSave: () => void;
  isLoading?: boolean;
}

export function ProblemTable({ 
  problems, 
  onAdd, 
  onRemove, 
  onUpdate, 
  onSave, 
  isLoading = false 
}: ProblemTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<ProblemListItem>>({});

  const handleEdit = (problem: ProblemListItem) => {
    setEditingId(problem.id);
    setEditValues({
      termName: problem.termName,
      namasteCode: problem.namasteCode,
      icd11Code: problem.icd11Code
    });
  };

  const handleSave = (id: string) => {
    onUpdate(id, editValues);
    setEditingId(null);
    setEditValues({});
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleInputChange = (field: keyof ProblemListItem, value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Problem List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {problems.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
              No problems added yet. Use the search to add terminology terms.
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium text-sm">Term Name</th>
                      <th className="text-left p-3 font-medium text-sm">NAMASTE Code</th>
                      <th className="text-left p-3 font-medium text-sm">ICD-11 Code</th>
                      <th className="text-left p-3 font-medium text-sm">Added</th>
                      <th className="text-left p-3 font-medium text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {problems.map((problem) => (
                      <tr key={problem.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          {editingId === problem.id ? (
                            <Input
                              value={editValues.termName || ''}
                              onChange={(e) => handleInputChange('termName', e.target.value)}
                              className="w-full text-sm"
                            />
                          ) : (
                            <span className="text-sm">{problem.termName}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {editingId === problem.id ? (
                            <Input
                              value={editValues.namasteCode || ''}
                              onChange={(e) => handleInputChange('namasteCode', e.target.value)}
                              className="w-full text-sm"
                            />
                          ) : (
                            <span className="text-sm font-mono">{problem.namasteCode}</span>
                          )}
                        </td>
                        <td className="p-3">
                          {editingId === problem.id ? (
                            <Input
                              value={editValues.icd11Code || ''}
                              onChange={(e) => handleInputChange('icd11Code', e.target.value)}
                              className="w-full text-sm"
                            />
                          ) : (
                            <span className="text-sm font-mono">{problem.icd11Code}</span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-gray-500">
                          {new Date(problem.addedAt).toLocaleDateString()}
                        </td>
                        <td className="p-3">
                          <div className="flex space-x-2">
                            {editingId === problem.id ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleSave(problem.id)}
                                  className="h-8 px-2"
                                >
                                  <Save className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancel}
                                  className="h-8 px-2"
                                >
                                  Cancel
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(problem)}
                                  className="h-8 px-2"
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => onRemove(problem.id)}
                                  className="h-8 px-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="lg:hidden space-y-3">
                {problems.map((problem) => (
                  <div key={problem.id} className="border border-gray-200 rounded-lg p-3 sm:p-4 bg-white">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                          {editingId === problem.id ? (
                            <Input
                              value={editValues.termName || ''}
                              onChange={(e) => handleInputChange('termName', e.target.value)}
                              className="w-full text-sm"
                              placeholder="Term Name"
                            />
                          ) : (
                            problem.termName
                          )}
                        </h3>
                        <div className="flex space-x-1 ml-2">
                          {editingId === problem.id ? (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSave(problem.id)}
                                className="h-7 px-2 text-xs"
                              >
                                <Save className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleCancel}
                                className="h-7 px-2 text-xs"
                              >
                                Cancel
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(problem)}
                                className="h-7 px-2 text-xs"
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => onRemove(problem.id)}
                                className="h-7 px-2"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
                        <div>
                          <span className="text-gray-500">NAMASTE:</span>
                          {editingId === problem.id ? (
                            <Input
                              value={editValues.namasteCode || ''}
                              onChange={(e) => handleInputChange('namasteCode', e.target.value)}
                              className="w-full text-xs mt-1"
                              placeholder="NAMASTE Code"
                            />
                          ) : (
                            <span className="ml-1 font-mono">{problem.namasteCode}</span>
                          )}
                        </div>
                        <div>
                          <span className="text-gray-500">ICD-11:</span>
                          {editingId === problem.id ? (
                            <Input
                              value={editValues.icd11Code || ''}
                              onChange={(e) => handleInputChange('icd11Code', e.target.value)}
                              className="w-full text-xs mt-1"
                              placeholder="ICD-11 Code"
                            />
                          ) : (
                            <span className="ml-1 font-mono">{problem.icd11Code}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Added: {new Date(problem.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          
          {problems.length > 0 && (
            <div className="flex justify-end pt-4">
              <Button onClick={onSave} disabled={isLoading} className="text-sm sm:text-base">
                <Save className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
