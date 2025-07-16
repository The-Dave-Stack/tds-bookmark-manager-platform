/**
 * BookmarkGrid.tsx
 *
 * Purpose:
 * - Displays a grid of bookmarks, with filtering, searching, and sorting capabilities.
 * - Integrates with `useBookmarkStore` to fetch and manage bookmark data.
 *
 * Logic Overview:
 * 1. Uses `useState` for `searchQuery` and `sortBy` state management.
 * 2. Uses `useTranslation` for internationalization.
 * 3. Uses `useBookmarkStore` to access `bookmarks` and `loading` state.
 * 4. `filteredBookmarks` (memoized with `useMemo`):
 *    - Filters bookmarks based on `showArchived` prop (to display only archived or non-archived).
 *    - Filters by `folderFilter` to show bookmarks within a specific folder.
 *    - Filters by `searchQuery` (case-insensitive search on title and URL).
 *    - Sorts the filtered results by `date` (default), `title`, or `clicks`.
 * 5. Renders a loading indicator if `loading` is true.
 * 6. Renders a search input field and a sort dropdown.
 * 7. Conditionally renders a message for empty results or the `BookmarkCard` components in a grid layout.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { useState, useMemo } from 'react';

import { Search, SortDesc } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useBookmarkStore } from '../../stores/bookmarkStore';

import BookmarkCard from './BookmarkCard';

interface BookmarkGridProps {
  folderFilter?: string;
  showArchived?: boolean;
}

const BookmarkGrid = ({ folderFilter, showArchived = false }: BookmarkGridProps) => {
  const { t } = useTranslation();
  const { bookmarks, loading } = useBookmarkStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'clicks'>('date');
  
  // Filter and sort bookmarks
  const filteredBookmarks = useMemo(() => {
    const result = bookmarks.filter(bookmark => {
      // Filter by archived status
      if (showArchived !== bookmark.isHidden) return false;
      
      // Filter by folder if specified
      if (folderFilter && bookmark.folderId !== folderFilter) return false;
      
      // If no folder is specified but we're not showing archived, show all non-archived bookmarks
      if (!folderFilter && !showArchived && bookmark.isHidden) return false;
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          bookmark.title.toLowerCase().includes(query) ||
          bookmark.url.toLowerCase().includes(query)
        );
      }
      
      return true;
    });
    
    // Sort bookmarks
    return result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(); // Use non-null assertion
      } else if (sortBy === 'title') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'clicks') {
        return b.clickCount! - a.clickCount!; // Use non-null assertion
      }
      return 0;
    });
  }, [bookmarks, searchQuery, sortBy, folderFilter, showArchived]);
  
  if (loading) {
    return <div className="animate-pulse flex space-x-4">Loading...</div>;
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={t('bookmarks.search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="sm:w-48">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SortDesc className="h-5 w-5 text-gray-400" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'clicks')}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 appearance-none"
            >
              <option value="date">{t('bookmarks.sort.date')}</option>
              <option value="title">{t('bookmarks.sort.title')}</option>
              <option value="clicks">{t('bookmarks.sort.clicks')}</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredBookmarks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {showArchived ? t('bookmarks.emptyArchived') : t('bookmarks.empty')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard key={bookmark.id} bookmark={bookmark} />
          ))}
        </div>
      )}
    </div>
  );
};

export default BookmarkGrid;
