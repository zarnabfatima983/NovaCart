import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign, ShoppingBag, Users, Package, Clock, AlertTriangle,
  TrendingUp, ArrowUpRight, ArrowDownRight, BarChart3, RefreshCw,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { orderAPI, userAPI, productAPI } from '../../services/api';
import { formatPrice, cn } from '../../utils/helpers';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const COLORS  = ['#6366f1','#d946ef','#06b6d4','#22c55e','#f59e0b','#ef4444','#8b5cf6','#10b981'];

/* ── Stat Card ─────────────────────────────────────────── */
const StatCard = ({ icon: Icon, label, value, sub, color, change, link }) => {
  const positive = change >= 0;
  return (
    <Link to={link || '#'} className="card p-5 hover:shadow-medium transition-all group block">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${color}`}>
          <Icon size={22} className="text-white" />
        </div>
        {change !== undefined && (
          <span className={cn(
            'flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg',
            positive ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' : 'text-red-500 bg-red-50 dark:bg-red-900/20'
          )}>
            {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-2xl font-display font-black text-dark-900 dark:text-white">{value}</p>
      <p className="text-sm text-dark-500 dark:text-dark-400 mt-0.5">{label}</p>
      {sub && <p className="text-xs text-dark-400 mt-1">{sub}</p>}
    </Link>
  );
};

/* ── Custom Tooltip ────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-dark-900 dark:bg-dark-700 rounded-xl px-4 py-3 shadow-large border border-dark-700">
      <p className="text-dark-300 text-xs mb-2">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-sm font-bold" style={{ color: p.color }}>
          {p.name === 'revenue' || p.name === 'Revenue' ? formatPrice(p.value) : p.value} {p.name !== 'revenue' && p.name !== 'Revenue' ? p.name : ''}
        </p>
      ))}
    </div>
  );
};

/* ── AdminDashboard ────────────────────────────────────── */
const AdminDashboard = () => {
  const [analytics, setAnalytics]     = useState(null);
  const [userStats, setUserStats]     = useState(null);
  const [inventory, setInventory]     = useState(null);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading]         = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [an, us, inv, prod] = await Promise.all([
        orderAPI.getAnalytics(),
        userAPI.getAdminStats(),
        productAPI.getInventory(),
        productAPI.getAll({ limit: 1 }),
      ]);
      setAnalytics(an.analytics);
      setUserStats(us);
      setInventory(inv);
      setTotalProducts(prod.total || 0);
    } catch { /* silently fail */ }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, []);

  // Build chart data
  const revenueData = analytics?.revenueByMonth?.map(d => ({
    month: MONTHS[(d._id.month - 1) % 12],
    Revenue: +(d.revenue || 0).toFixed(2),
    Orders:  d.orders || 0,
  })) || [];

  const statusData = analytics?.ordersByStatus?.map(s => ({
    name:  s._id?.replace('_', ' '),
    value: s.count,
  })) || [];

  const categoryRevData = analytics?.topProducts?.map(p => ({
    name:    (p.name || '').slice(0, 18) + ((p.name || '').length > 18 ? '…' : ''),
    Revenue: +(p.revenue || 0).toFixed(2),
    Sold:    p.totalSold,
  })) || [];

  const customerData = userStats?.customerGrowth?.map(d => ({
    month: MONTHS[(d._id.month - 1) % 12],
    Customers: d.count,
  })) || [];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
        <div className="grid lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-72 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Dashboard</h1>
          <p className="text-dark-500 dark:text-dark-400 text-sm mt-1">Welcome back! Here's what's happening.</p>
        </div>
        <button onClick={loadData} className="btn-secondary btn-sm gap-2">
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={DollarSign}    label="Total Revenue"    value={formatPrice(analytics?.totalRevenue || 0)}  color="bg-primary-500"  change={12}   link="/admin/orders" />
        <StatCard icon={ShoppingBag}   label="Total Orders"     value={analytics?.totalOrders || 0}                color="bg-accent-500"   change={8}    link="/admin/orders" />
        <StatCard icon={Users}         label="Customers"        value={userStats?.totalCustomers || 0}             color="bg-cyan-500"     change={15}   link="/admin/customers" />
        <StatCard icon={Package}       label="Products"         value={totalProducts}                              color="bg-emerald-500"  link="/admin/products" />
        <StatCard icon={Clock}         label="Pending Orders"   value={analytics?.pendingOrders || 0}              color="bg-amber-500"    link="/admin/orders" />
        <StatCard icon={AlertTriangle} label="Low Stock"        value={inventory?.lowStock || 0}                   color="bg-red-500"      link="/admin/products" />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Over Time */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white">Revenue Over Time</h3>
              <p className="text-dark-400 text-xs mt-0.5">Monthly revenue trend</p>
            </div>
            <div className="w-8 h-8 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-primary-600" />
            </div>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Revenue" stroke="#6366f1" strokeWidth={2} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-dark-400 text-sm">No revenue data yet</div>
          )}
        </div>

        {/* Orders Over Time */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white">Orders Over Time</h3>
              <p className="text-dark-400 text-xs mt-0.5">Monthly order volume</p>
            </div>
            <div className="w-8 h-8 bg-accent-50 dark:bg-accent-900/20 rounded-xl flex items-center justify-center">
              <BarChart3 size={16} className="text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          {revenueData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Orders" fill="#d946ef" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-dark-400 text-sm">No order data yet</div>
          )}
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Status Pie */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-dark-900 dark:text-white mb-5">Orders by Status</h3>
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {statusData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip formatter={(v, n) => [v, n]} />
                <Legend iconType="circle" iconSize={8} formatter={v => <span className="text-xs capitalize text-dark-600 dark:text-dark-400">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-dark-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Top Products */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-display font-bold text-dark-900 dark:text-white">Top Selling Products</h3>
            <Link to="/admin/products" className="text-xs text-primary-600 hover:underline">View All</Link>
          </div>
          {categoryRevData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryRevData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="Revenue" fill="#6366f1" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-56 flex items-center justify-center text-dark-400 text-sm">No product sales data yet</div>
          )}
        </div>
      </div>

      {/* Customer Growth */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card p-5 lg:col-span-2">
          <h3 className="font-display font-bold text-dark-900 dark:text-white mb-5">Customer Growth</h3>
          {customerData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={customerData}>
                <defs>
                  <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="Customers" stroke="#22c55e" strokeWidth={2} fill="url(#colorCustomers)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-dark-400 text-sm">No customer data yet</div>
          )}
        </div>

        {/* Inventory overview */}
        <div className="card p-5">
          <h3 className="font-display font-bold text-dark-900 dark:text-white mb-5">Inventory Status</h3>
          <div className="space-y-4">
            {[
              { label: 'In Stock',    value: inventory?.inStock || 0,    color: 'bg-emerald-500', text: 'text-emerald-600' },
              { label: 'Low Stock',   value: inventory?.lowStock || 0,   color: 'bg-amber-500',   text: 'text-amber-600' },
              { label: 'Out of Stock',value: inventory?.outOfStock || 0, color: 'bg-red-500',     text: 'text-red-500' },
            ].map(({ label, value, color, text }) => {
              const total = (inventory?.inStock || 0) + (inventory?.lowStock || 0) + (inventory?.outOfStock || 0);
              const pct   = total > 0 ? Math.round((value / total) * 100) : 0;
              return (
                <div key={label}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-dark-600 dark:text-dark-400">{label}</span>
                    <span className={`text-sm font-bold ${text}`}>{value} ({pct}%)</span>
                  </div>
                  <div className="h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
                    <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}

            {/* Low stock items */}
            {inventory?.lowStockProducts?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-700">
                <p className="text-xs font-bold text-dark-500 uppercase tracking-wide mb-3">⚠️ Needs Attention</p>
                {inventory.lowStockProducts.slice(0, 4).map(p => (
                  <div key={p._id} className="flex items-center gap-2 mb-2">
                    <img src={p.images?.[0]} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-dark-800 dark:text-white truncate">{p.name}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded-lg">{p.stock} left</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
