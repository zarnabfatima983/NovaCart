import { useState, useEffect } from 'react';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShoppingBag, Heart, User, Eye, Package,
  TrendingUp, CheckCircle, Clock, XCircle, ChevronRight,
  MapPin, Lock, Edit3, Save, X, Plus, Trash2
} from 'lucide-react';
import { orderAPI, userAPI, authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, formatDate, ORDER_STATUS_CONFIG, cn } from '../utils/helpers';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

/* ─── Stat Card ─────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="card p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-display font-black text-dark-900 dark:text-white">{value}</p>
      <p className="text-sm text-dark-500 dark:text-dark-400">{label}</p>
      {sub && <p className="text-xs text-dark-400 mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ─── Status Badge ───────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const cfg = ORDER_STATUS_CONFIG[status] || { label: status, color: 'gray' };
  const colors = {
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    primary: 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
    success: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
    error:   'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    gray:    'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400',
  };
  return (
    <span className={`badge ${colors[cfg.color] || colors.gray}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

/* ─── Overview Tab ───────────────────────────────────── */
const OverviewTab = ({ orders, wishlistCount }) => {
  const total     = orders.length;
  const pending   = orders.filter(o => ['processing','confirmed','shipped','out_for_delivery'].includes(o.status)).length;
  const completed = orders.filter(o => o.status === 'delivered').length;
  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag}   label="Total Orders"     value={total}              color="bg-primary-500"  />
        <StatCard icon={Clock}         label="In Progress"      value={pending}            color="bg-amber-500"    />
        <StatCard icon={CheckCircle}   label="Delivered"        value={completed}          color="bg-emerald-500"  />
        <StatCard icon={Heart}         label="Wishlist Items"   value={wishlistCount}      color="bg-red-500"      />
      </div>

      {/* Recent Orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-bold text-dark-900 dark:text-white text-lg">Recent Orders</h2>
          <NavLink to="/dashboard/orders" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </NavLink>
        </div>
        {orders.length === 0 ? (
          <div className="card p-10 text-center text-dark-400">
            <ShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p>No orders yet. Start shopping!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.slice(0, 3).map(order => (
              <OrderRow key={order._id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

/* ─── Order Row ──────────────────────────────────────── */
const OrderRow = ({ order }) => {
  const navigate = useNavigate();
  return (
    <div className="card p-4 flex items-center gap-4 flex-wrap cursor-pointer hover:shadow-medium transition-shadow" onClick={() => navigate(`/order-confirm/${order._id}`)}>
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="flex -space-x-2 flex-shrink-0">
          {order.items?.slice(0, 2).map((item, i) => (
            <img key={i} src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover border-2 border-white dark:border-dark-800" />
          ))}
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-dark-900 dark:text-white text-sm">{order.orderNumber}</p>
          <p className="text-xs text-dark-400">{formatDate(order.createdAt)} · {order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        <StatusBadge status={order.status} />
        <span className="font-bold text-dark-900 dark:text-white text-sm">{formatPrice(order.total)}</span>
        <ChevronRight size={16} className="text-dark-400" />
      </div>
    </div>
  );
};

/* ─── Orders Tab ─────────────────────────────────────── */
const OrdersTab = ({ orders, loading }) => (
  <div>
    <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl mb-6">My Orders</h2>
    {loading ? (
      <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}</div>
    ) : orders.length === 0 ? (
      <div className="card p-16 text-center">
        <ShoppingBag size={48} className="mx-auto mb-4 text-dark-300 dark:text-dark-600" />
        <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">No orders yet</h3>
        <p className="text-dark-400 mb-6">Start shopping and your orders will appear here.</p>
        <NavLink to="/shop" className="btn-primary">Browse Products</NavLink>
      </div>
    ) : (
      <div className="space-y-3">
        {orders.map(order => <OrderRow key={order._id} order={order} />)}
      </div>
    )}
  </div>
);

/* ─── Wishlist Tab ───────────────────────────────────── */
const WishlistTabContent = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success('Moved to cart!');
  };

  return (
    <div>
      <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl mb-6">
        My Wishlist <span className="text-primary-600 ml-1">({wishlist.length})</span>
      </h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="card p-16 text-center">
          <Heart size={48} className="mx-auto mb-4 text-dark-300 dark:text-dark-600" />
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">Your wishlist is empty</h3>
          <p className="text-dark-400 mb-6">Save items you love and they'll appear here.</p>
          <NavLink to="/shop" className="btn-primary">Discover Products</NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wishlist.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

/* ─── Profile Tab ────────────────────────────────────── */
const ProfileTab = () => {
  const { user, updateUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPw, setSavingPw] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    const result = await updateUser(form);
    if (result.success) {
      toast.success('Profile updated!');
      setEditing(false);
    } else {
      toast.error(result.error);
    }
    setSavingProfile(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) { toast.error('Passwords do not match'); return; }
    setSavingPw(true);
    try {
      await authAPI.updatePassword({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password changed!');
      setPwForm({ currentPassword: '', newPassword: '', confirm: '' });
      setShowPwForm(false);
    } catch (err) {
      toast.error(err.message);
    }
    setSavingPw(false);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">My Profile</h2>

      {/* Avatar & Name */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-glow">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-dark-900 dark:text-white text-lg">{user?.name}</p>
              <p className="text-dark-400 text-sm">{user?.email}</p>
              <span className="badge badge-primary text-xs capitalize">{user?.role}</span>
            </div>
          </div>
          {!editing ? (
            <button onClick={() => setEditing(true)} className="btn-secondary btn-sm gap-2">
              <Edit3 size={14} /> Edit
            </button>
          ) : (
            <div className="flex gap-2">
              <button onClick={handleSaveProfile} disabled={savingProfile} className="btn-primary btn-sm gap-2">
                <Save size={14} /> {savingProfile ? 'Saving...' : 'Save'}
              </button>
              <button onClick={() => setEditing(false)} className="btn-secondary btn-sm">
                <X size={14} />
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="input-label">Full Name</label>
            <input
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              disabled={!editing}
              className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <label className="input-label">Email</label>
            <input value={user?.email} disabled className="input-field opacity-60 cursor-not-allowed" />
          </div>
          <div>
            <label className="input-label">Phone</label>
            <input
              value={form.phone}
              onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              disabled={!editing}
              placeholder="+1 (555) 000-0000"
              className="input-field disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-dark-100 dark:bg-dark-700 rounded-xl flex items-center justify-center">
              <Lock size={18} className="text-dark-500" />
            </div>
            <div>
              <p className="font-semibold text-dark-900 dark:text-white">Password</p>
              <p className="text-xs text-dark-400">Keep your account secure</p>
            </div>
          </div>
          <button
            onClick={() => setShowPwForm(!showPwForm)}
            className="btn-secondary btn-sm"
          >
            {showPwForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>
        {showPwForm && (
          <form onSubmit={handleChangePassword} className="space-y-3 pt-4 border-t border-dark-100 dark:border-dark-700">
            {[
              { label: 'Current Password', field: 'currentPassword' },
              { label: 'New Password', field: 'newPassword' },
              { label: 'Confirm New Password', field: 'confirm' },
            ].map(({ label, field }) => (
              <div key={field}>
                <label className="input-label">{label}</label>
                <input
                  type="password"
                  value={pwForm[field]}
                  onChange={e => setPwForm(f => ({ ...f, [field]: e.target.value }))}
                  className="input-field"
                  required
                />
              </div>
            ))}
            <button type="submit" disabled={savingPw} className="btn-primary btn-sm">
              {savingPw ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

/* ─── Recently Viewed Tab ────────────────────────────── */
const RecentlyViewedTab = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) { setLoading(false); return; }
    userAPI.getRecentlyViewed()
      .then(res => setProducts(res.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  return (
    <div>
      <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl mb-6">Recently Viewed</h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="card p-16 text-center">
          <Eye size={48} className="mx-auto mb-4 text-dark-300 dark:text-dark-600" />
          <h3 className="text-lg font-semibold text-dark-900 dark:text-white mb-2">Nothing here yet</h3>
          <p className="text-dark-400 mb-6">Products you view will appear here.</p>
          <NavLink to="/shop" className="btn-primary">Start Exploring</NavLink>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
};

/* ─── Nav items ──────────────────────────────────────── */
const navItems = [
  { to: '/dashboard',               label: 'Overview',         icon: LayoutDashboard, exact: true },
  { to: '/dashboard/orders',        label: 'My Orders',        icon: ShoppingBag },
  { to: '/dashboard/wishlist',      label: 'Wishlist',         icon: Heart },
  { to: '/dashboard/profile',       label: 'Profile',          icon: User },
  { to: '/dashboard/recently-viewed', label: 'Recently Viewed', icon: Eye },
];

/* ─── Main Dashboard ─────────────────────────────────── */
const DashboardPage = () => {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    orderAPI.getMyOrders({ limit: 50 })
      .then(res => setOrders(res.orders || []))
      .catch(() => {})
      .finally(() => setOrdersLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-dark-50/50 dark:bg-dark-950">
      <div className="container-main py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="page-title">
            Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p className="text-dark-500 dark:text-dark-400 mt-1">Manage your orders, wishlist, and account settings.</p>
        </div>

        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Sidebar */}
          <aside className="lg:w-56 flex-shrink-0">
            <nav className="card p-3 lg:sticky lg:top-24 flex lg:flex-col flex-row overflow-x-auto gap-1 no-scrollbar">
              {navItems.map(({ to, label, icon: Icon, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap flex-shrink-0',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                      : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800'
                  )}
                >
                  <Icon size={17} className="flex-shrink-0" />
                  <span className="hidden lg:block">{label}</span>
                </NavLink>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Routes>
              <Route index element={<OverviewTab orders={orders} wishlistCount={wishlistCount} />} />
              <Route path="orders" element={<OrdersTab orders={orders} loading={ordersLoading} />} />
              <Route path="wishlist" element={<WishlistTabContent />} />
              <Route path="profile" element={<ProfileTab />} />
              <Route path="recently-viewed" element={<RecentlyViewedTab />} />
            </Routes>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
