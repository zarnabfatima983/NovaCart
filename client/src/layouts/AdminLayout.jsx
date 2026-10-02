import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  LayoutDashboard, Package, Tag, ShoppingBag, Users, Ticket,
  LogOut, Menu, X, Bell, Settings, ChevronRight, BarChart3,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/helpers';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, exact: true },
  { to: '/admin/products',   label: 'Products',   icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
  { to: '/admin/orders',     label: 'Orders',     icon: ShoppingBag },
  { to: '/admin/customers',  label: 'Customers',  icon: Users },
  { to: '/admin/coupons',    label: 'Coupons',    icon: Ticket },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="flex h-screen bg-dark-50 dark:bg-dark-950 overflow-hidden">
      {/* Sidebar */}
      <aside className={cn(
        'flex flex-col bg-dark-900 text-white transition-all duration-300 flex-shrink-0 z-50',
        sidebarOpen ? 'w-64' : 'w-16',
        'lg:relative fixed inset-y-0 left-0'
      )}>
        {/* Logo */}
        <div className="flex items-center gap-3 p-4 border-b border-dark-700">
          <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          {sidebarOpen && (
            <div>
              <p className="font-display font-bold text-white text-sm">NOVA CART</p>
              <p className="text-dark-400 text-xs">Admin Panel</p>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto btn-icon text-dark-400 hover:text-white hover:bg-dark-700"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ to, label, icon: Icon, exact }) => (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary-600 text-white shadow-glow'
                  : 'text-dark-400 hover:text-white hover:bg-dark-700'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{label}</span>}
              {sidebarOpen && <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-dark-700">
          <div className={cn('flex items-center gap-3 px-3 py-2', sidebarOpen ? 'mb-2' : 'justify-center')}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
            </div>
            {sidebarOpen && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">{user?.name}</p>
                <p className="text-xs text-dark-400 truncate">{user?.email}</p>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 w-full px-3 py-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-xl transition-all duration-200 text-sm',
              !sidebarOpen && 'justify-center'
            )}
          >
            <LogOut size={18} />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white dark:bg-dark-800 border-b border-dark-100 dark:border-dark-700 px-6 py-4 flex items-center gap-4 flex-shrink-0">
          <button
            className="lg:hidden btn-icon text-dark-500 hover:bg-dark-100 dark:hover:bg-dark-700"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-2">
            <button className="btn-icon text-dark-500 dark:text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700 relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="btn-secondary btn-sm"
            >
              View Store
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
