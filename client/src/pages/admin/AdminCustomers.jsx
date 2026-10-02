import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Eye, UserCheck, UserX, ShoppingBag, DollarSign } from 'lucide-react';
import { userAPI, orderAPI } from '../../services/api';
import { formatPrice, formatDate, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

/* ── Customer Detail Modal ──────────────────────────────── */
const CustomerDetailModal = ({ customer, onClose, onToggle }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load customer orders via admin endpoint
    orderAPI.getAll({ limit: 50 })
      .then(r => {
        const userOrders = (r.orders || []).filter(o => o.user?._id === customer._id || o.user === customer._id);
        setOrders(userOrders);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [customer._id]);

  const totalSpent = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-large w-full max-w-xl my-4">
        <div className="flex items-center justify-between p-6 border-b border-dark-100 dark:border-dark-700">
          <h2 className="font-display font-bold text-dark-900 dark:text-white">Customer Details</h2>
          <button onClick={onClose} className="btn-icon text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer info */}
          <div className="flex items-center gap-4 p-4 bg-dark-50 dark:bg-dark-700 rounded-2xl">
            <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-white font-black text-xl flex-shrink-0 shadow-glow">
              {customer.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <p className="font-bold text-dark-900 dark:text-white text-lg">{customer.name}</p>
              <p className="text-dark-400 text-sm">{customer.email}</p>
              {customer.phone && <p className="text-dark-400 text-sm">{customer.phone}</p>}
            </div>
            <div className="text-right">
              <span className={cn('badge text-sm', customer.isActive ? 'badge-success' : 'badge-error')}>
                {customer.isActive ? '● Active' : '● Inactive'}
              </span>
              <p className="text-xs text-dark-400 mt-1">Joined {formatDate(customer.createdAt)}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ShoppingBag size={16} className="text-primary-600" />
                <p className="text-2xl font-black text-dark-900 dark:text-white">{orders.length}</p>
              </div>
              <p className="text-sm text-dark-500">Total Orders</p>
            </div>
            <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-xl text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <DollarSign size={16} className="text-emerald-600" />
                <p className="text-2xl font-black text-dark-900 dark:text-white">{formatPrice(totalSpent)}</p>
              </div>
              <p className="text-sm text-dark-500">Total Spent</p>
            </div>
          </div>

          {/* Recent Orders */}
          <div>
            <p className="font-bold text-dark-900 dark:text-white text-sm mb-3">Recent Orders</p>
            {loading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}</div>
            ) : orders.length === 0 ? (
              <p className="text-dark-400 text-sm text-center py-4">No orders yet</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {orders.slice(0, 8).map(o => (
                  <div key={o._id} className="flex items-center justify-between p-3 bg-dark-50 dark:bg-dark-700 rounded-xl">
                    <div>
                      <p className="font-mono text-xs text-primary-600 font-semibold">{o.orderNumber}</p>
                      <p className="text-xs text-dark-400">{formatDate(o.createdAt)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-dark-900 dark:text-white text-sm">{formatPrice(o.total)}</p>
                      <p className="text-xs text-dark-400 capitalize">{o.status?.replace('_', ' ')}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Toggle status */}
          <button
            onClick={() => onToggle(customer._id)}
            className={cn('w-full btn-sm gap-2 flex items-center justify-center', customer.isActive ? 'btn-danger' : 'btn-primary')}
          >
            {customer.isActive ? <><UserX size={16} /> Deactivate Account</> : <><UserCheck size={16} /> Activate Account</>}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── AdminCustomers ─────────────────────────────────────── */
const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [selected, setSelected]   = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await userAPI.getAll({ page, limit: 15, search: search || undefined });
      setCustomers(r.users || []);
      setTotal(r.total || 0);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search]); // eslint-disable-line

  const handleToggle = async (id) => {
    try {
      const r = await userAPI.toggleStatus(id);
      toast.success(r.message);
      setCustomers(prev => prev.map(c => c._id === id ? { ...c, isActive: !c.isActive } : c));
      setSelected(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Customers</h1>
          <p className="text-dark-500 text-sm mt-0.5">{total} registered customers</p>
        </div>
      </div>

      {/* Search */}
      <div className="card p-4 flex items-center gap-3">
        <Search size={16} className="text-dark-400 flex-shrink-0" />
        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." className="flex-1 bg-transparent text-sm text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none" />
        {search && <button onClick={() => setSearch('')}><X size={14} className="text-dark-400" /></button>}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-700">
              <tr>
                {['Customer', 'Phone', 'Joined', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>{[...Array(5)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                ))
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-12 text-center text-dark-400">No customers found</td></tr>
              ) : (
                customers.map(c => (
                  <tr key={c._id} className="hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {c.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-dark-900 dark:text-white text-sm">{c.name}</p>
                          <p className="text-xs text-dark-400">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-500 dark:text-dark-400">{c.phone || '—'}</td>
                    <td className="px-4 py-3 text-sm text-dark-500 dark:text-dark-400 whitespace-nowrap">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge text-xs', c.isActive ? 'badge-success' : 'badge-error')}>
                        {c.isActive ? '● Active' : '● Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setSelected(c)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                          <Eye size={14} />
                        </button>
                        <button onClick={() => handleToggle(c._id)}
                          className={cn('w-8 h-8 flex items-center justify-center rounded-lg transition-colors',
                            c.isActive
                              ? 'text-dark-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
                              : 'text-dark-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                          )}>
                          {c.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {total > 15 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-100 dark:border-dark-700">
            <p className="text-sm text-dark-400">Showing {Math.min((page-1)*15+1, total)}–{Math.min(page*15, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-secondary btn-sm disabled:opacity-40">← Prev</button>
              <button onClick={() => setPage(p => p+1)} disabled={page * 15 >= total} className="btn-secondary btn-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <CustomerDetailModal customer={selected} onClose={() => setSelected(null)} onToggle={handleToggle} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCustomers;
