// Sidebar.jsx
// Sidebar navigation panel for administrators

import React, { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext.jsx';
import { 
  FiGrid, 
  FiBox, 
  FiLayers, 
  FiTrendingUp, 
  FiUsers, 
  FiDatabase, 
  FiStar, 
  FiHome, 
  FiUser, 
  FiLogOut,
  FiGift
} from 'react-icons/fi';

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  const adminMenu = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: FiGrid },
    { name: 'Products', path: '/admin/products', icon: FiBox },
    { name: 'Categories', path: '/admin/categories', icon: FiLayers },
    { name: 'Orders', path: '/admin/orders', icon: FiTrendingUp },
    { name: 'Customers', path: '/admin/customers', icon: FiUsers },
    { name: 'Inventory Alerts', path: '/admin/inventory', icon: FiDatabase },
    { name: 'Reviews', path: '/admin/reviews', icon: FiStar },
  ];

  const customerUrl = window.location.port === '5174'
    ? 'http://localhost:5173'
    : `${window.location.protocol}//${window.location.hostname.replace('admin.', '')}`;

  return (
    <aside className="w-64 bg-slate-900 text-slate-400 border-r border-slate-800 flex flex-col h-screen sticky top-0">
      
      {/* Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <Link to="/admin/dashboard" className="flex items-center space-x-2 text-white font-extrabold text-xl tracking-tight">
          <FiGift className="w-6 h-6 text-amber-500" />
          <span>Frame<span className="text-amber-500 text-sm italic font-medium ml-0.5">Admin</span></span>
        </Link>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {adminMenu.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30' 
                    : 'hover:bg-slate-800/60 hover:text-slate-200'
                }`
              }
            >
              <Icon className="w-5 h-5 shrink-0" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Account options */}
      <div className="p-4 border-t border-slate-800 space-y-1.5">
        <a 
          href={customerUrl}
          className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-slate-800/60 hover:text-slate-200 transition-colors"
        >
          <FiHome className="w-5 h-5" />
          <span>View Shop</span>
        </a>
        <button 
          onClick={logout} 
          className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-semibold text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-colors"
        >
          <FiLogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;
