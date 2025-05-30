import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './stores/authStore';

// Components
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import ProfileSettings from './pages/ProfileSettings';
import LandingPage from './pages/LandingPage';

function App() {
  const [loading, setLoading] = useState(true);
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Simulate checking auth state
    const checkAuth = async () => {
      try {
        // In a real app, this would check Firebase auth state
        setLoading(false);
      } catch (error) {
        console.error('Error during authentication:', error);
        clearUser();
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, clearUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/bookmarks\" replace /> : <LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="bookmarks" element={<Dashboard />} />
        <Route path="bookmarks/folder/:folderId" element={<Dashboard />} />
        <Route path="bookmarks/archived" element={<Dashboard isArchived />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="admin" element={
          <AdminRoute>
            <AdminPanel />
          </AdminRoute>
        } />
      </Route>
      <Route path="*" element={<Navigate to="/\" replace />} />
    </Routes>
  );
}

export default App