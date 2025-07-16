/**
 * AdminPanel.tsx
 *
 * Purpose:
 * - Provides an administrative interface for managing users and viewing global statistics.
 * - Accessible only to users with the 'ADMIN' role.
 *
 * Logic Overview:
 * 1. Uses `useState` to manage the list of users and loading state.
 * 2. Uses `useTranslation` for internationalization.
 * 3. Integrates with `useAuthStore` to get the current `user`.
 * 4. `useEffect` hook: Fetches all registered users from the API when the component mounts or `user` changes.
 *    - Sets `loading` state during the API call.
 *    - Handles success by updating `users` state and error by showing a toast.
 * 5. `handleRoleChange`:
 *    - Toggles a user's role between `USER` and `ADMIN`.
 *    - Calls `api.updateUserRole` to persist the change.
 *    - Updates the local `users` state optimistically and shows success/error toasts.
 * 6. Renders:
 *    - A title for the admin panel.
 *    - `AdminStats` component to display global statistics.
 *    - A table listing all registered users with their ID (truncated), email, roles, and an action button to change their role.
 *    - Displays a loading indicator while fetching user data.
 *    - Formats user roles for display (e.g., "ADMIN", "USER").
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation and improved role change/display logic)
 */
import { User as AdminUser, Role } from "@tds/tds-bm-common";
import { User, UserCog } from 'lucide-react';
import { useEffect, useState } from 'react';

import AdminStats from '../components/statistics/AdminStats';
import { api } from '../api';
import toast from 'react-hot-toast';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from 'react-i18next';

const AdminPanel = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.username) return;
      
      try {
        setLoading(true);
        const response = await api.getUsers();
        setUsers(response || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error(t('common.error'));
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [user, t]);
  
  const handleRoleChange = async (userId: string, currentRoles: Role[]) => { // Changed currentRole to currentRoles
    if (!user?.username) return;
    
    const newRole = currentRoles.includes(Role.ADMIN) ? Role.USER : Role.ADMIN; // More robust logic
    
    try {
      await api.updateUserRole(userId, { roles: [newRole] });
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, roles: [newRole] } : u // Update roles array
      ));
      
      toast.success(t('admin.changeRole.success'));
    } catch (error) {
      console.error('Error changing user role:', error);
      toast.error(t('admin.changeRole.error'));
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center mb-8">
        <UserCog className="h-8 w-8 text-primary mr-3" />
        <h1 className="text-2xl font-bold text-mainText">
          {t('admin.title')}
        </h1>
      </div>
      
      <AdminStats />
      
      <div className="bg-invertedText rounded-lg shadow-sm border border-lightBorder overflow-hidden">
        <div className="px-6 py-5 border-b border-lightBorder">
          <h2 className="text-lg font-medium text-mainText">
            {t('admin.users')}
          </h2>
          <p className="mt-1 text-sm text-mainText/70">
            {t('admin.usersCount', { count: users.length })}
          </p>
        </div>
        
        {loading ? (
          <div className="p-6 text-center text-mainText/70">
            {t('common.loading')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-lightBorder">
              <thead>
                <tr className="bg-lightBg">
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mainText/70 uppercase tracking-wider">
                    {t('admin.userTable.id')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mainText/70 uppercase tracking-wider">
                    {t('admin.userTable.email')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-mainText/70 uppercase tracking-wider">
                    {t('admin.userTable.roles')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-mainText/70 uppercase tracking-wider">
                    {t('admin.userTable.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-invertedText divide-y divide-lightBorder">
                {users.map((adminUser) => (
                  <tr key={adminUser.id} className="hover:bg-lightBg transition-colors duration-200"> {/* Changed key to adminUser.id */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mainText/70">
                      {adminUser.id?.substring(0, 8)}... {/* Changed to adminUser.id */}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8 bg-lightBg rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-mainText">
                            {adminUser.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        adminUser.roles.includes(Role.ADMIN) 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-success/10 text-success'
                      }`}>
                        {adminUser.roles.join(', ')} {/* Join roles array for display */}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRoleChange(adminUser.id!, adminUser.roles)}
                        className="text-primary hover:text-secondary transition-colors duration-200"
                      >
                        {t('admin.changeRole.button')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
