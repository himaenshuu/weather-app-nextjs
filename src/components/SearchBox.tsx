/** @format */

import { useState, useRef, useEffect } from 'react';
import { MdSearch, MdClose, MdHistory } from 'react-icons/md';

interface SearchBoxProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  recentSearches?: string[];
  onRecentSearchClick?: (search: string) => void;
  isLoading?: boolean;
}

export default function SearchBox({
  value,
  onChange,
  onSubmit,
  recentSearches = [],
  onRecentSearchClick,
  isLoading = false
}: SearchBoxProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showRecent, setShowRecent] = useState(false);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setShowRecent(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={inputRef}>
      <form 
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(e);
          setShowRecent(false);
        }}
        className="relative flex items-center"
      >
        <div className={`relative flex items-center w-full transition-all duration-200
                        ${isFocused ? 'ring-2 ring-blue-500 dark:ring-blue-400' : ''}`}>
          <div className="absolute left-3">
            {isLoading ? (
              <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent" />
            ) : (
              <MdSearch className="text-gray-400 text-xl" />
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={onChange}
            onFocus={() => {
              setIsFocused(true);
              setShowRecent(true);
            }}
            onBlur={() => setIsFocused(false)}
            placeholder="Search location..."
            className="w-full pl-10 pr-12 py-2 rounded-l-lg border border-gray-300 
                     dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 
                     focus:outline-none transition-colors duration-200
                     placeholder:text-gray-400 dark:placeholder:text-gray-500
                     disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={isLoading}
          />
          {value && (
            <button
              type="button"
              onClick={() => {
                onChange({ target: { value: '' } } as any);
                inputRef.current?.focus();
              }}
              className="absolute right-3 text-gray-400 hover:text-gray-600 
                       dark:hover:text-gray-300 transition-colors disabled:opacity-60"
              disabled={isLoading}
            >
              <MdClose className="text-xl" />
            </button>
          )}
        </div>
        <button 
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-r-lg
                   hover:bg-blue-600 active:bg-blue-700
                   dark:bg-blue-600 dark:hover:bg-blue-700
                   transition-colors duration-200 font-medium
                   disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!value.trim() || isLoading}
        >
          Search
        </button>
      </form>

      {/* Recent searches dropdown */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg 
                      max-h-60 overflow-y-auto z-50">
          <div className="p-2 text-sm text-gray-500 dark:text-gray-400 border-b 
                        border-gray-200 dark:border-gray-700">
            Recent searches
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => {
                onRecentSearchClick?.(search);
                setShowRecent(false);
              }}
              className="w-full px-4 py-2 text-left flex items-center gap-2 
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <MdHistory className="text-gray-400" />
              <span className="text-gray-700 dark:text-gray-200">{search}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
