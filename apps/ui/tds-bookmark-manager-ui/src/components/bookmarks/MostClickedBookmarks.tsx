/**
 * MostClickedBookmarks.tsx
 *
 * Purpose:
 * - Displays a list of the top 5 most clicked non-hidden bookmarks.
 * - Allows users to visit these bookmarks and tracks their clicks.
 *
 * Logic Overview:
 * 1. Uses `useTranslation` for internationalization.
 * 2. Integrates with `useBookmarkStore` to access `bookmarks` and `incrementClickCount`.
 * 3. Integrates with `useAuthStore` to get the current `user` (specifically `apiToken`).
 * 4. `topBookmarks` (memoized with `useMemo`):
 *    - Filters out bookmarks that are hidden.
 *    - Sorts the remaining bookmarks by `clickCount` in descending order.
 *    - Slices the array to get only the top 5.
 * 5. `handleVisit`:
 *    - Checks if `user.apiToken` exists before proceeding.
 *    - Opens the bookmark URL in a new tab.
 *    - Calls `incrementClickCount` (from `useBookmarkStore`) to update the click count in the background.
 * 6. Renders `null` if there are no top bookmarks to display.
 * 7. Renders a card-like structure for each top bookmark, including favicon (with error handling for broken images), title, and click count.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation and fixed incrementClickCount call)
 */
import { useMemo } from 'react';

import { ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAuthStore } from '../../stores/authStore';
import { useBookmarkStore } from '../../stores/bookmarkStore';

const MostClickedBookmarks = () => {
  const { t } = useTranslation();
  const { bookmarks } = useBookmarkStore();
  const { user } = useAuthStore();
  const { incrementClickCount } = useBookmarkStore();
  
  const topBookmarks = useMemo(() => {
    // Filter out archived bookmarks and sort by click count
    return bookmarks
      .filter(bookmark => !bookmark.isHidden)
      .sort((a, b) => b.clickCount - a.clickCount)
      .slice(0, 5); // Take top 5
  }, [bookmarks]);
  
  const handleVisit = async (id: string, url: string) => {
    if (!user?.apiToken) return;
    
    // Open URL in new tab
    window.open(url, '_blank');
    
    // Increment click count in the background
    incrementClickCount(id); // Removed user.apiToken
  };
  
  if (topBookmarks.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">{t('bookmarks.mostClicked')}</h2>
      
      <div className="space-y-3">
        {topBookmarks.map((bookmark) => (
          <div 
            key={bookmark.id}
            className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md transition-colors"
          >
            <div className="flex items-center space-x-3">
              {bookmark.faviconUrl ? (
                <img 
                  src={bookmark.faviconUrl} 
                  alt="favicon" 
                  className="w-5 h-5 rounded"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-5 h-5 rounded bg-gray-200 flex items-center justify-center">
                  <ExternalLink className="w-3 h-3 text-gray-500" />
                </div>
              )}
              
              <span className="text-sm font-medium text-gray-900 truncate max-w-[180px]">
                {bookmark.title}
              </span>
            </div>
            
            <div className="flex items-center">
              <span className="text-xs text-gray-500 mr-3">
                {t('bookmarks.actions.clickCount', { count: bookmark.clickCount })}
              </span>
              
              <button
                onClick={() => handleVisit(bookmark.id, bookmark.url)}
                className="text-blue-600 hover:text-blue-800"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostClickedBookmarks;
