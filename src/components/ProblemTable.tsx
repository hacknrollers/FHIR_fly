'use client';

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Trash2, Save, Edit, X } from 'lucide-react';
import { ProblemListItem } from '@/lib/api';

interface ProblemTableProps {
  problems: ProblemListItem[];
  onRemove: (id: string) => void;
  onUpdate: (id: string, updatedProblem: Partial<ProblemListItem>) => void;
  isLoading?: boolean;
}

export function ProblemTable({ problems, onRemove, onUpdate, isLoading = false }: ProblemTableProps) {
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

  const handleSave = () => {
    if (editingId) {
      onUpdate(editingId, editValues);
      setEditingId(null);
      setEditValues({});
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValues({});
  };

  const handleInputChange = (field: keyof ProblemListItem, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Card>
    );
  }

  if (problems.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-gray-500">
          <p>No problems in the list yet.</p>
          <p className="text-sm mt-1">Use the Terminology Search to add problems.</p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-4 border-b">
        <h3 className="text-lg font-semibold">Problem List</h3>
        <p className="text-sm text-gray-600">Manage patient problems and their mappings</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Term Name</TableHead>
              <TableHead>NAMASTE Code</TableHead>
              <TableHead>ICD-11 Code</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {problems.map((problem) => (
              <TableRow key={problem.id}>
                <TableCell>
                  {editingId === problem.id ? (
                    <input
                      type="text"
                      value={editValues.termName || ''}
                      onChange={(e) => handleInputChange('termName', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <div className="font-medium">{problem.termName}</div>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === problem.id ? (
                    <input
                      type="text"
                      value={editValues.namasteCode || ''}
                      onChange={(e) => handleInputChange('namasteCode', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <Badge variant="secondary">{problem.namasteCode}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {editingId === problem.id ? (
                    <input
                      type="text"
                      value={editValues.icd11Code || ''}
                      onChange={(e) => handleInputChange('icd11Code', e.target.value)}
                      className="w-full px-2 py-1 border rounded"
                    />
                  ) : (
                    <Badge variant="outline">{problem.icd11Code}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(problem.addedAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {editingId === problem.id ? (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleSave}
                        >
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancel}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(problem)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onRemove(problem.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
