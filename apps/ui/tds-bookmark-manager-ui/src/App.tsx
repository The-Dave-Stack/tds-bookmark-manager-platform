import { Navigate, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';

import AdminPanel from './pages/AdminPanel';
import AdminRoute from './components/auth/AdminRoute';
import AdminSetup from './pages/AdminSetup';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import Layout from './components/layout/Layout';
import LoadingScreen from './components/common/LoadingScreen';
// Components
import Login from './pages/Login';
import ProfileSettings from './pages/ProfileSettings';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Register from './pages/Register';
import { api } from './api';
import { useAuthStore } from './stores/authStore';

function App() {
  const [loading, setLoading] = useState(true);
  const [needsAdminSetup, setNeedsAdminSetup] = useState(false);
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Simulate checking auth state
    const checkAuth = async () => {
      try {
        // Check if admin exists in the system
        const adminExists = await api.checkAdminExists();
        console.log('Admin exists:', adminExists);
        
        if (!adminExists) {
          setNeedsAdminSetup(true);
          setLoading(false);
          return;
        }
        
        // In a real app, this would check for existing auth tokens/sessions
        // For now, we just set loading to false setLoading(false);
        setLoading(false);
      } catch (error) {
        console.error('Error during authentication:', error);
        clearUser();
        setLoading(false);
      }
    };

    checkAuth();
  }, [setUser, clearUser]);

  const handleSetupComplete = () => {
    setNeedsAdminSetup(false);
  };
  
  if (loading) {
    return <LoadingScreen />;
  }

  // Show admin setup if no admin exists
  if (needsAdminSetup) {
    return (
      <Routes>
        <Route path="*" element={<AdminSetup onSetupComplete={handleSetupComplete} />} />
      </Routes>
    );
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