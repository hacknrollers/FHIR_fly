'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { SearchBox } from '@/components/SearchBox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, BookOpen } from 'lucide-react';
import { type TerminologyResult, addProblem, translateConcept, type TranslationRequest, type TranslationResponse } from '@/services/api';

export default function TerminologyPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [selectedTerm, setSelectedTerm] = useState<TerminologyResult | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [translationResult, setTranslationResult] = useState<TranslationResponse | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [targetCode, setTargetCode] = useState('');

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

  const handleTranslate = async () => {
    if (!sourceCode || !targetCode) return;

    try {
      setIsTranslating(true);
      const request: TranslationRequest = {
        source_codesystem: "http://loinc.org", // Default source
        target_codesystem: "http://snomed.info/sct", // Default target
        source_code: sourceCode
      };
      
      const result = await translateConcept(request);
      setTranslationResult(result);
    } catch (error) {
      console.error('Failed to translate concept:', error);
      setTranslationResult({ found: false, target_code: undefined, equivalence: undefined });
    } finally {
      setIsTranslating(false);
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
      <div className="p-4 sm:p-6 particle-bg">
        <div className="mb-6 sm:mb-8 animate-fade-in">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 animate-slide-up">
            Terminology Search
          </h1>
          <p className="text-slate-900 mt-2 text-sm sm:text-base font-medium animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Search and map medical terminology using NAMASTE and ICD-11 codes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4 sm:space-y-6">
            <Card className="border-slate-200 animate-slide-in-left min-h-[400px] sm:min-h-[500px]">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg sm:text-xl text-slate-800">
                  <Search className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Search Terminology
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col justify-center h-full">
                <div className="space-y-4">
                  <SearchBox
                    onSelect={handleTermSelect}
                    placeholder="Search for medical terms (e.g., Dengue, Rabies)..."
                    className="w-full"
                  />
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    Start typing to search for medical terminology. Results will show NAMASTE and ICD-11 mappings.
                  </p>
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">Search Tips:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Try searching by disease names (e.g., "Rabies", "Tetantus")</li>
                      <li>• Use symptoms like "Rubella", "Rotavirus", "Dengue"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {addSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  </div>
                  <div className="ml-3">
                    <p className="text-xs sm:text-sm font-medium text-green-800">
                      Successfully added to problem list!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            {selectedTerm ? (
              <Card className="border-slate-200 animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg sm:text-xl text-slate-800">
                    <BookOpen className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                    Selected Term
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Term Name
                      </label>
                      <div className="p-2 sm:p-3 bg-gray-50 rounded-md font-medium text-sm sm:text-base">
                        {selectedTerm.termName}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          NAMASTE Code
                        </label>
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-md font-mono text-xs sm:text-sm">
                          {selectedTerm.namasteCode}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          ICD-11 Code
                        </label>
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-md font-mono text-xs sm:text-sm">
                          {selectedTerm.icd11Code}
                        </div>
                      </div>
                    </div>

                    {selectedTerm.description && (
                      <div>
                        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <div className="p-2 sm:p-3 bg-gray-50 rounded-md text-xs sm:text-sm">
                          {selectedTerm.description}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAddToProblemList}
                      disabled={isAdding}
                      className="w-full text-sm sm:text-base"
                    >
                      <Plus className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      {isAdding ? 'Adding...' : 'Add to Problem List'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-slate-200 animate-slide-in-right">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl text-slate-800">No Term Selected</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 sm:py-8 text-gray-500">
                    <BookOpen className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-300 mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base">Search for a term to view its details and add it to your problem list.</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

       

        <div className="mt-6 sm:mt-8">  
          <Card className="border-slate-200 animate-fade-in">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-slate-800">Search Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Search by Term</h4>
                  <p className="text-gray-600">
                    Type the medical term name (e.g., "NAM032") for dengue
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
