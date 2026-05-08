'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { GoSearch, GoX, GoHistory, GoArrowUpRight, GoRocket } from 'react-icons/go';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchSuggestions } from '@/features/search/hooks/useSearchSuggestions';
import { slugify, findArticleCategory } from '@/shared/utils';
import { LoadingSpinner } from '@/shared/components';
import Image from 'next/image';
import type { NewsArticle, SearchBarProps } from '@/shared/types';
import { CATEGORIES } from '@/shared/constants';

const MAX_RECENT_SEARCHES = 5;

/**
 * Component to highlight matching text in search results
 */
const HighlightMatch = ({ text, match }: { text: string; match: string }) => {
  if (!match.trim()) return <span>{text}</span>;
  
  const parts = text.split(new RegExp(`(${match})`, 'gi'));
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === match.toLowerCase() ? (
          <span key={i} className="text-primary font-bold bg-primary/5 px-0.5 rounded">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

export const SearchBar = ({ onClose, className = '' }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [navigatingArticle, setNavigatingArticle] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const { suggestions, isLoading, isDebouncing } = useSearchSuggestions(query);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse recent searches', e);
      }
    }
  }, []);

  // Save recent searches
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    const newRecent = [
      searchTerm,
      ...recentSearches.filter((s) => s.toLowerCase() !== searchTerm.toLowerCase()),
    ].slice(0, MAX_RECENT_SEARCHES);
    
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  }, [recentSearches]);

  const removeRecentSearch = useCallback((searchTerm: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newRecent = recentSearches.filter((s) => s !== searchTerm);
    setRecentSearches(newRecent);
    localStorage.setItem('recentSearches', JSON.stringify(newRecent));
  }, [recentSearches]);

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
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(-1);
  }, []);

  const executeSearch = useCallback((searchTerm: string) => {
    if (searchTerm.trim().length >= 2) {
      saveRecentSearch(searchTerm.trim());
      const encodedQuery = encodeURIComponent(searchTerm.trim());
      router.push(`/search?q=${encodedQuery}`);
      setQuery('');
      setIsFocused(false);
      onClose?.();
    }
  }, [router, onClose, saveRecentSearch]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      executeSearch(query);
    },
    [query, executeSearch]
  );

  const handleSuggestionClick = useCallback(
    async (article: NewsArticle) => {
      const articleSlug = slugify(article.title);
      setNavigatingArticle(article.url);
      saveRecentSearch(query.trim() || article.title.split(' ').slice(0, 3).join(' '));
      
      try {
        const category = await findArticleCategory(article);
        const searchParam = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
        router.push(`/${category}/${articleSlug}${searchParam}`);
      } catch (error) {
        const searchParam = query.trim() ? `?q=${encodeURIComponent(query.trim())}` : '';
        router.push(`/general/${articleSlug}${searchParam}`);
      } finally {
        setQuery('');
        setIsFocused(false);
        setNavigatingArticle(null);
        onClose?.();
      }
    },
    [router, onClose, query, saveRecentSearch]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      const itemsCount = query.length >= 2 ? suggestions.length : recentSearches.length;
      if (itemsCount === 0) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev < itemsCount - 1 ? prev + 1 : prev));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && selectedIndex < itemsCount) {
            if (query.length >= 2) {
              handleSuggestionClick(suggestions[selectedIndex]);
            } else {
              executeSearch(recentSearches[selectedIndex]);
            }
          } else if (query.trim().length >= 2) {
            handleSubmit(e);
          }
          break;
        case 'Escape':
          setIsFocused(false);
          setQuery('');
          onClose?.();
          break;
      }
    },
    [suggestions, selectedIndex, query, handleSuggestionClick, handleSubmit, onClose, recentSearches, executeSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  const showDropdown = isFocused && (query.length >= 2 || recentSearches.length > 0 || !query);

  const suggestedCategories = useMemo(() => 
    Object.values(CATEGORIES).slice(0, 4), 
  []);

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`} ref={suggestionsRef}>
      <form onSubmit={handleSubmit} className="relative z-50">
        <div className="relative flex items-center">
          <GoSearch className={`absolute left-5 w-6 h-6 transition-colors ${isFocused ? 'text-gray-900' : 'text-gray-400'}`} aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            placeholder="Search for news, topics, or categories..."
            className="w-full pl-14 pr-12 py-4.5 border-[1.5px] border-gray-900 rounded-2xl focus:outline-none text-gray-900 placeholder-gray-400 transition-all bg-white"
            aria-label="Search news articles"
            aria-autocomplete="list"
            aria-expanded={showDropdown}
          />
          <div className="absolute right-5 flex items-center gap-2">
            {isLoading && <LoadingSpinner size="sm" />}
            {query && !isLoading && (
              <button
                type="button"
                onClick={clearSearch}
                className="text-gray-400 hover:text-primary transition-colors focus:outline-none p-1 rounded-full hover:bg-gray-100"
                aria-label="Clear search"
              >
                <GoX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </form>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="mt-4 bg-gray-50/50 border border-gray-100 rounded-[2rem] p-4 shadow-inner overflow-hidden"
          >
            {/* Empty Input State: Recent & Categories */}
            {!query && (
              <div className="space-y-4">
                {recentSearches.length > 0 && (
                  <div className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm">
                    <div className="flex items-center justify-between px-3 py-2 mb-2">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                        <GoHistory className="w-3.5 h-3.5" />
                        Recent Searches
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 gap-1">
                      {recentSearches.map((search, index) => (
                        <li 
                          key={search}
                          onClick={() => executeSearch(search)}
                          onMouseEnter={() => setSelectedIndex(index)}
                          className={`flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-all ${selectedIndex === index ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                        >
                          <span className="text-sm font-semibold text-gray-700 flex items-center gap-3">
                            <GoHistory className="text-gray-400" />
                            {search}
                          </span>
                          <button 
                            onClick={(e) => removeRecentSearch(search, e)}
                            className="p-1.5 hover:bg-white rounded-lg text-gray-300 transition-colors border border-transparent hover:border-gray-100"
                          >
                            <GoX className="w-3.5 h-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="bg-white rounded-[2rem] p-5 border border-gray-100 shadow-sm">
                  <div className="flex items-center px-4 py-2 mb-4">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <GoRocket className="w-3.5 h-3.5" />
                      Popular Categories
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {suggestedCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          router.push(`/${cat}`);
                          onClose?.();
                        }}
                        className="flex items-center justify-between px-6 py-4.5 rounded-2xl border border-gray-50 hover:border-gray-200 hover:bg-gray-50 transition-all text-left group"
                      >
                        <span className="text-sm font-bold text-gray-800 capitalize tracking-tight">{cat.replace('-', ' ')}</span>
                        <GoArrowUpRight className="text-gray-300 group-hover:text-primary transition-all group-hover:scale-110" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Searching State */}
            {query.length >= 2 && (
              <div className="max-h-[60vh] overflow-y-auto space-y-4">
                {isDebouncing ? (
                  <div className="p-12 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                    <LoadingSpinner size="md" className="mx-auto mb-4" />
                    <p className="text-sm text-gray-400 font-bold tracking-tight">Looking for the latest matches...</p>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/30">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Top matches found</span>
                    </div>
                    <ul role="listbox" className="divide-y divide-gray-50">
                      {suggestions.map((article, index) => {
                        const isNavigating = navigatingArticle === article.url;
                        return (
                          <li
                            key={article.url || index}
                            role="option"
                            aria-selected={selectedIndex === index}
                            onMouseEnter={() => setSelectedIndex(index)}
                            onClick={() => !isNavigating && handleSuggestionClick(article)}
                            className={`px-6 py-4 cursor-pointer transition-all ${
                              selectedIndex === index ? 'bg-gray-50/80' : 'hover:bg-gray-50/50'
                            } ${isNavigating ? 'opacity-60 grayscale' : ''}`}
                          >
                            <div className="flex gap-5">
                              {article.urlToImage ? (
                                <div className="relative w-16 h-16 flex-shrink-0 rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                                  <Image
                                    src={article.urlToImage}
                                    alt=""
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 flex-shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-300 border border-dashed border-gray-200">
                                  <GoSearch className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0 flex flex-col justify-center">
                                <h4 className="text-[15px] font-bold text-gray-900 leading-snug line-clamp-2 mb-1.5 tracking-tight">
                                  <HighlightMatch text={article.title} match={query} />
                                </h4>
                                <div className="flex items-center gap-3">
                                  {article.source?.name && (
                                    <span className="text-[10px] font-black uppercase tracking-[0.1em] text-primary">
                                      {article.source.name}
                                    </span>
                                  )}
                                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                                  <span className="text-[10px] font-bold text-gray-400">
                                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                                  </span>
                                </div>
                              </div>
                              {isNavigating ? (
                                <div className="flex items-center">
                                  <LoadingSpinner size="sm" />
                                </div>
                              ) : (
                                <div className={`flex items-center transition-all ${selectedIndex === index ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}>
                                  <GoArrowUpRight className="w-5 h-5 text-gray-300" />
                                </div>
                              )}
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                    <div className="p-4 bg-gray-50/30 border-t border-gray-50">
                      <button
                        onClick={handleSubmit}
                        className="w-full py-3 bg-white border border-gray-200 rounded-2xl text-[13px] font-bold text-gray-900 hover:border-gray-900 transition-all shadow-sm flex items-center justify-center gap-2 group"
                      >
                        Explore all results for &quot;{query}&quot;
                        <GoArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </button>
                    </div>
                  </div>
                ) : !isLoading && (
                  <div className="p-16 text-center bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-gray-100">
                      <GoSearch className="w-10 h-10 text-gray-200" />
                    </div>
                    <p className="text-gray-900 font-black mb-1.5 text-xl tracking-tight">No matches found</p>
                    <p className="text-sm text-gray-400 font-medium mb-8 max-w-xs mx-auto">We couldn&apos;t find any news articles matching &quot;{query}&quot;</p>
                    <button
                      onClick={clearSearch}
                      className="px-8 py-3 bg-gray-900 text-white rounded-2xl text-[13px] font-black hover:bg-gray-800 transition-all active:scale-95 shadow-lg shadow-gray-200"
                    >
                      Reset Search
                    </button>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
