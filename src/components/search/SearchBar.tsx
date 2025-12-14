'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { GoSearch, GoX } from 'react-icons/go';
import { useSearchSuggestions } from '@/lib/hooks/useSearchSuggestions';
import { slugify } from '@/lib/utils/string';
import { findArticleCategory } from '@/lib/utils/articleCategory';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import Link from 'next/link';
import Image from 'next/image';
import type { NewsArticle } from '@/types/news';

interface SearchBarProps {
  onClose?: () => void;
  className?: string;
}

export const SearchBar = ({ onClose, className = '' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [navigatingArticle, setNavigatingArticle] = useState<string | null>(null);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const { suggestions, isLoading, isDebouncing } = useSearchSuggestions(query);

  // Focus input when component mounts
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show suggestions when there are results
  useEffect(() => {
    setIsOpen(query.length >= 2 && (suggestions.length > 0 || isLoading));
  }, [query, suggestions, isLoading]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim().length >= 2) {
        const searchQuery = encodeURIComponent(query.trim());
        router.push(`/search?q=${searchQuery}`);
        setQuery('');
        setIsOpen(false);
        onClose?.();
      }
    },
    [query, router, onClose]
  );

  const handleSuggestionClick = useCallback(
    async (article: NewsArticle) => {
      const articleSlug = slugify(article.title);
      setNavigatingArticle(article.url);
      
      try {
        // Find the actual category of the article
        const category = await findArticleCategory(article);
        const searchParam = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
        router.push(`/${category}/${articleSlug}${searchParam}`);
      } catch (error) {
        // Fallback to general if category detection fails
        const searchParam = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
        router.push(`/general/${articleSlug}${searchParam}`);
      } finally {
        setQuery('');
        setIsOpen(false);
        setNavigatingArticle(null);
        onClose?.();
      }
    },
    [router, onClose, query]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!isOpen || suggestions.length === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
            handleSuggestionClick(suggestions[selectedIndex]);
          } else if (query.trim().length >= 2) {
            handleSubmit(e);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setQuery('');
          onClose?.();
          break;
      }
    },
    [isOpen, suggestions, selectedIndex, query, handleSuggestionClick, handleSubmit, onClose]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`} ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <GoSearch className="absolute left-4 text-gray-400 w-5 h-5" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => query.length >= 2 && setIsOpen(true)}
            placeholder="Search for news..."
            className="w-full pl-12 pr-12 py-3 border-2 border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 text-primary placeholder-gray-400"
            aria-label="Search news articles"
            aria-autocomplete="list"
            aria-expanded={isOpen}
            aria-controls="search-suggestions"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-12 text-gray-400 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded"
              aria-label="Clear search"
            >
              <GoX className="w-5 h-5" />
            </button>
          )}
          {isLoading && (
            <div className="absolute right-12">
              <LoadingSpinner size="sm" />
            </div>
          )}
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {isOpen && (
        <div
          id="search-suggestions"
          className="absolute z-50 w-full mt-2 bg-white border-2 border-primary rounded-lg shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
        >
          {isDebouncing ? (
            <div className="p-4 text-center text-gray-500">
              <LoadingSpinner size="sm" className="mx-auto mb-2" />
              <p className="text-sm">Searching...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="py-2" role="list">
              {suggestions.map((article, index) => {
                const isNavigating = navigatingArticle === article.url;
                return (
                  <li
                    key={article.url || index}
                    role="option"
                    aria-selected={selectedIndex === index}
                    className={`cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedIndex === index ? 'bg-gray-50' : ''
                    } ${isNavigating ? 'opacity-50' : ''}`}
                    onClick={() => !isNavigating && handleSuggestionClick(article)}
                  >
                    <div className="flex items-start gap-3 p-3">
                      {isNavigating && (
                        <div className="absolute right-3">
                          <LoadingSpinner size="sm" />
                        </div>
                      )}
                      {article.urlToImage && (
                        <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                          <Image
                            src={article.urlToImage}
                            alt=""
                            fill
                            className="object-cover"
                            sizes="64px"
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-primary line-clamp-2">
                          {article.title}
                        </p>
                        {article.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                            {article.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : query.length >= 2 && !isLoading ? (
            <div className="p-4 text-center text-gray-500">
              <p className="text-sm">No suggestions found</p>
              <button
                onClick={handleSubmit}
                className="mt-2 text-sm text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded px-2"
              >
                Search for &quot;{query}&quot;
              </button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
