/**
 * Layout.tsx
 *
 * Purpose:
 * - Defines the main layout structure for authenticated users in the application.
 * - Includes the header, sidebar, and a main content area where nested routes are rendered.
 *
 * Logic Overview:
 * 1. Uses `useState` to manage the open/closed state of the sidebar.
 * 2. Uses `useAuthStore` to check if a user is logged in; if not, it renders `null` (assuming `ProtectedRoute` handles redirection).
 * 3. `toggleSidebar`: Toggles the `sidebarOpen` state.
 * 4. Renders:
 *    - `Header` component, passing `toggleSidebar` as a prop.
 *    - `Sidebar` component, passing its `isOpen` state and a `onClose` function.
 *    - A `main` content area where `Outlet` renders the current nested route's component.
 *
 * Last Updated:
 * 2025-07-16 by Cline (Added file header documentation)
 */
import { useState } from 'react';

import { Outlet } from 'react-router-dom';

import { useAuthStore } from '../../stores/authStore';

import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!user) return null;
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pt-4 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
