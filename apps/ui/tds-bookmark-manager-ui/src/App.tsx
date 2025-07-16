/**
 * App.tsx
 *
 * Purpose:
 * - Main application component responsible for routing and initial setup.
 * - Handles authentication state and redirects based on user login status and admin setup.
 *
 * Logic Overview:
 * 1. Initializes application by checking if an admin user exists.
 * 2. If no admin exists, redirects to the AdminSetup page.
 * 3. If an admin exists, checks the current user's authentication status.
 * 4. Manages loading states and displays a loading screen during initialization.
 * 5. Defines application routes using react-router-dom, including protected routes for authenticated users and admin-only routes.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
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
  const { user, checkAuth } = useAuthStore();

  useEffect(() => {
    // Simulate checking auth state
    const initializeApp = async () => {
      try {
        // Check if admin exists in the system
        const adminExists = await api.checkAdminExists();
        
        if (!adminExists) {
          setNeedsAdminSetup(true);
        } else {
          // If an admin exists, check if the current user has a valid session cookie
          console.log('Admin exists, checking auth state...');
          await checkAuth();
        }
      } catch (error) {
        console.error('Error during app initialization:', error);
        useAuthStore.getState().setUser(null); // Clear state in case of error
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, [checkAuth]);

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
      <Route path="/" element={user ? <Navigate to="/bookmarks" replace /> : <LandingPage />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App
