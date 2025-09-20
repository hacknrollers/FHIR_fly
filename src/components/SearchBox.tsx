'use client';

import { useState, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Plus } from 'lucide-react';
import { TerminologyResult } from '@/lib/api';

interface SearchBoxProps {
  onAddToProblemList: (term: TerminologyResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBox({ onAddToProblemList, placeholder = "Search terminology...", className }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TerminologyResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (query.trim().length > 0) {
        setIsLoading(true);
        try {
          const { searchTerminology } = await import('@/lib/api');
          const searchResults = await searchTerminology(query);
          setResults(searchResults);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
          setResults([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Close results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddToProblemList = async (term: TerminologyResult) => {
    try {
      await onAddToProblemList(term);
      setQuery('');
      setShowResults(false);
    } catch (error) {
      console.error('Error adding to problem list:', error);
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length > 0 && setShowResults(true)}
          className="pl-10 pr-4"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          </div>
        )}
      </div>

      {showResults && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-y-auto">
          <div className="p-2">
            {results.map((result) => (
              <div
                key={result.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{result.termName}</div>
                  <div className="text-sm text-gray-600 mt-1">
                    <div className="flex gap-2">
                      <Badge variant="secondary" className="text-xs">
                        NAMASTE: {result.namasteCode}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ICD-11: {result.icd11Code}
                      </Badge>
                    </div>
                    {result.description && (
                      <div className="text-gray-500 mt-1">{result.description}</div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleAddToProblemList(result)}
                  className="ml-3"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showResults && query.trim().length > 0 && results.length === 0 && !isLoading && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50">
          <div className="p-4 text-center text-gray-500">
            No results found for "{query}"
          </div>
        </Card>
      )}
    </div>
  );
}
