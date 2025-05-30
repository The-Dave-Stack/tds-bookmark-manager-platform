import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../stores/authStore';
import { api } from '../api/apiService';
import toast from 'react-hot-toast';
import { User, UserCog } from 'lucide-react';
import AdminStats from '../components/statistics/AdminStats';

interface AdminUser {
  id: string;
  email: string;
  role: 'user' | 'admin';
}

const AdminPanel = () => {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user?.id) return;
      
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
  
  const handleRoleChange = async (userId: string, currentRole: 'user' | 'admin') => {
    if (!user?.id) return;
    
    const newRole = currentRole === 'user' ? 'admin' : 'user';
    
    try {
      await api.updateUserRole(userId, newRole);
      
      setUsers(users.map(u => 
        u.id === userId ? { ...u, role: newRole } : u
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
                    {t('admin.userTable.role')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-mainText/70 uppercase tracking-wider">
                    {t('admin.userTable.actions')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-invertedText divide-y divide-lightBorder">
                {users.map((adminUser) => (
                  <tr key={adminUser.id} className="hover:bg-lightBg transition-colors duration-200">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-mainText/70">
                      {adminUser.id.substring(0, 8)}...
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
                        adminUser.role === 'admin' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-success/10 text-success'
                      }`}>
                        {adminUser.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleRoleChange(adminUser.id, adminUser.role)}
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