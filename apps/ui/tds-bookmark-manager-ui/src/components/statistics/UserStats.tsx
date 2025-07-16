/**
 * UserStats.tsx
 *
 * Purpose:
 * - Displays personal usage statistics for the authenticated user's bookmarks.
 * - Allows filtering statistics by a date range.
 *
 * Logic Overview:
 * 1. Uses `useState` to manage the selected `dateRange` for filtering.
 * 2. Uses `useTranslation` for internationalization.
 * 3. Integrates with `useBookmarkStore` to access the user's `bookmarks`.
 * 4. `stats` (memoized with `useMemo`):
 *    - Filters bookmarks based on the selected `dateRange` (using `createdAt`).
 *    - Calculates `totalBookmarks`, `totalClicks`, `avgClicksPerBookmark`.
 *    - Identifies the `mostClickedBookmark` within the filtered set.
 * 5. Renders a `DateRangeSelector` component to allow users to choose a date range.
 * 6. Displays key statistics (Total Bookmarks, Total Clicks, Avg Clicks per Bookmark, Most Clicked Bookmark) in a grid of cards.
 * 7. Handles cases where no bookmarks are found within the selected range.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation and non-null assertions)
 */
import { useMemo, useState } from 'react';

import { BarChart3, TrendingUp, Clock, Bookmark } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useBookmarkStore } from '../../stores/bookmarkStore';

import DateRangeSelector from './DateRangeSelector';

import type { DateRange } from './DateRangeSelector';

const UserStats = () => {
  const { t } = useTranslation();
  const { bookmarks } = useBookmarkStore();
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date()
  });
  
  const stats = useMemo(() => {
    const filteredBookmarks = bookmarks.filter(b => {
      const bookmarkDate = new Date(b.createdAt!); // Use non-null assertion
      return bookmarkDate >= dateRange.start && bookmarkDate <= dateRange.end;
    });

    const totalBookmarks = filteredBookmarks.length;
    const totalClicks = filteredBookmarks.reduce((sum, b) => sum + b.clickCount!, 0); // Use non-null assertion
    const avgClicksPerBookmark = totalBookmarks ? (totalClicks / totalBookmarks).toFixed(1) : '0';
    const mostClickedBookmark = filteredBookmarks.length > 0 
      ? filteredBookmarks.reduce((max, b) => b.clickCount! > max.clickCount! ? b : max) // Use non-null assertion
      : null;
    
    return {
      totalBookmarks,
      totalClicks,
      avgClicksPerBookmark,
      mostClickedBookmark
    };
  }, [bookmarks, dateRange]);
  
  return (
    <div className="space-y-6">
      <DateRangeSelector onChange={setDateRange} />
      
      <div className="bg-white rounded-lg shadow-sm border border-lightBorder p-6">
        <h2 className="text-xl font-semibold text-mainText mb-6">
          {t('statistics.user.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-full p-2">
                <Bookmark className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">
                  {t('statistics.user.totalBookmarks')}
                </p>
                <h3 className="text-2xl font-bold text-blue-900">
                  {stats.totalBookmarks}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-green-100 rounded-full p-2">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-600 font-medium">
                  {t('statistics.user.totalClicks')}
                </p>
                <h3 className="text-2xl font-bold text-green-900">
                  {stats.totalClicks}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-purple-100 rounded-full p-2">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-purple-600 font-medium">
                  {t('statistics.user.avgClicks')}
                </p>
                <h3 className="text-2xl font-bold text-purple-900">
                  {stats.avgClicksPerBookmark}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-orange-100 rounded-full p-2">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-orange-600 font-medium">
                  {t('statistics.user.mostClicked')}
                </p>
                <h3 className="text-lg font-bold text-orange-900 truncate" 
                  title={stats.mostClickedBookmark?.title}>
                  {stats.mostClickedBookmark?.title || t('statistics.user.noBookmarks')}
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
