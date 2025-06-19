import { useEffect, useState } from 'react';

import { BookmarkIcon, MousePointerClick, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { api } from '../../api';
import { useAuthStore } from '../../stores/authStore';


import DateRangeSelector from './DateRangeSelector';

import type { DateRange } from './DateRangeSelector';

interface AdminStatistics {
  totalUsers: number;
  totalBookmarks: number;
  totalClicks: number;
  avgBookmarksPerUser: number;
  avgClicksPerUser: number;
  topUsers: Array<{
    email: string;
    bookmarkCount: number;
    clickCount: number;
  }>;
}

const AdminStats = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [stats, setStats] = useState<AdminStatistics>({
    totalUsers: 0,
    totalBookmarks: 0,
    totalClicks: 0,
    avgBookmarksPerUser: 0,
    avgClicksPerUser: 0,
    topUsers: []
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<DateRange>({
    start: new Date(Date.now() - 24 * 60 * 60 * 1000),
    end: new Date()
  });
  
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const response = await api.getAdminStatistics(dateRange);
        setStats(response);
      } catch (error) {
        console.error('Error fetching admin statistics:', error);
        toast.error(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [user, dateRange, t]);
  
  if (loading) {
    return <div className="animate-pulse">{t('common.loading')}</div>;
  }
  
  return (
    <div className="space-y-6">
      <DateRangeSelector onChange={setDateRange} />
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          {t('statistics.admin.title')}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-indigo-100 rounded-full p-2">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-indigo-600 font-medium">
                  {t('statistics.admin.totalUsers')}
                </p>
                <h3 className="text-2xl font-bold text-indigo-900">
                  {stats.totalUsers}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-cyan-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-cyan-100 rounded-full p-2">
                <BookmarkIcon className="h-6 w-6 text-cyan-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-cyan-600 font-medium">
                  {t('statistics.admin.totalBookmarks')}
                </p>
                <h3 className="text-2xl font-bold text-cyan-900">
                  {stats.totalBookmarks}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-rose-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-rose-100 rounded-full p-2">
                <MousePointerClick className="h-6 w-6 text-rose-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-rose-600 font-medium">
                  {t('statistics.admin.totalClicks')}
                </p>
                <h3 className="text-2xl font-bold text-rose-900">
                  {stats.totalClicks}
                </h3>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="bg-amber-100 rounded-full p-2">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-amber-600 font-medium">
                  {t('statistics.admin.avgBookmarks')}
                </p>
                <h3 className="text-2xl font-bold text-amber-900">
                  {stats.avgBookmarksPerUser.toFixed(1)}
                </h3>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {t('statistics.admin.topUsers')}
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('statistics.admin.userEmail')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('statistics.admin.bookmarkCount')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('statistics.admin.clickCount')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.topUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.bookmarkCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.clickCount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;