'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { searchTerminology, type TerminologyResult } from '@/services/api';

interface SearchBoxProps {
  onSelect: (term: TerminologyResult) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBox({ onSelect, placeholder = "Search terminology...", className }: SearchBoxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TerminologyResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const search = async () => {
      setIsLoading(true);
      try {
        const searchResults = await searchTerminology(query);
        setResults(searchResults);
        setIsOpen(true);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timeoutId = setTimeout(search, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleSelect = (term: TerminologyResult) => {
    onSelect(term);
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div ref={searchRef} className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pl-8 sm:pl-10 pr-8 sm:pr-10 text-sm sm:text-base"
        />
        {query && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8"
            onClick={clearSearch}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="p-2 sm:p-3 text-center text-gray-500 text-xs sm:text-sm">Searching...</div>
          ) : results.length > 0 ? (
            results.map((term) => (
              <button
                key={term.id}
                onClick={() => handleSelect(term)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
              >
                <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{term.termName}</div>
                <div className="text-xs sm:text-sm text-gray-500 truncate">
                  NAMASTE: {term.namasteCode} | ICD-11: {term.icd11Code}
                </div>
                {term.description && (
                  <div className="text-xs text-gray-400 mt-1 line-clamp-2">{term.description}</div>
                )}
              </button>
            ))
          ) : query.length >= 2 ? (
            <div className="p-2 sm:p-3 text-center text-gray-500 text-xs sm:text-sm">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
