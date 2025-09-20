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
        <CardTitle>Problem List</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {problems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No problems added yet. Use the search to add terminology terms.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3 font-medium">Term Name</th>
                    <th className="text-left p-3 font-medium">NAMASTE Code</th>
                    <th className="text-left p-3 font-medium">ICD-11 Code</th>
                    <th className="text-left p-3 font-medium">Added</th>
                    <th className="text-left p-3 font-medium">Actions</th>
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
                            className="w-full"
                          />
                        ) : (
                          problem.termName
                        )}
                      </td>
                      <td className="p-3">
                        {editingId === problem.id ? (
                          <Input
                            value={editValues.namasteCode || ''}
                            onChange={(e) => handleInputChange('namasteCode', e.target.value)}
                            className="w-full"
                          />
                        ) : (
                          problem.namasteCode
                        )}
                      </td>
                      <td className="p-3">
                        {editingId === problem.id ? (
                          <Input
                            value={editValues.icd11Code || ''}
                            onChange={(e) => handleInputChange('icd11Code', e.target.value)}
                            className="w-full"
                          />
                        ) : (
                          problem.icd11Code
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
          )}
          
          {problems.length > 0 && (
            <div className="flex justify-end pt-4">
              <Button onClick={onSave} disabled={isLoading}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
