// AdminLayout.jsx
// Template layout for administrative board panels

import React, { useContext } from 'react';
import { Outlet, Navigate, Link } from 'react-router-dom';
import Sidebar from '../components/admin/Sidebar.jsx';
import { AuthContext } from '../context/AuthContext.jsx';
import { FiBell, FiUser } from 'react-icons/fi';

const AdminLayout = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex bg-slate-100 min-h-screen text-slate-800">
      
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header Navigation */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-30">
          <div>
            <h1 className="text-lg font-bold text-slate-800">Management Panel</h1>
            <p className="text-slate-400 text-xs font-semibold">FrameWala Shop Administration</p>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-1.5 text-slate-500 hover:text-indigo-600 transition-colors" title="Notifications">
              <FiBell className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 border-l border-slate-200 pl-4">
              <span className="text-xs font-bold text-slate-700">{user?.first_name} {user?.last_name}</span>
              <span className="bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider">
                {user?.role}
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Pages Mount */}
        <main className="flex-grow p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
