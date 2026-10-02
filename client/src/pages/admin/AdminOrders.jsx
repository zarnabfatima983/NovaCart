import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ChevronDown, Eye, Package, Truck, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { orderAPI } from '../../services/api';
import { formatPrice, formatDate, ORDER_STATUS_CONFIG, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  processing:       'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  confirmed:        'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  shipped:          'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
  out_for_delivery: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300',
  delivered:        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  cancelled:        'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  refunded:         'bg-dark-100 dark:bg-dark-700 text-dark-600 dark:text-dark-400',
};

const ALL_STATUSES = ['processing','confirmed','shipped','out_for_delivery','delivered','cancelled','refunded'];

/* ── Order Detail Modal ─────────────────────────────────── */
const OrderDetailModal = ({ order, onClose, onStatusUpdate }) => {
  const [newStatus, setNewStatus] = useState(order.status);
  const [note, setNote]           = useState('');
  const [updating, setUpdating]   = useState(false);

  const handleUpdate = async () => {
    if (newStatus === order.status) { toast('Status unchanged'); return; }
    setUpdating(true);
    try {
      await orderAPI.updateStatus(order._id, { status: newStatus, note });
      toast.success(`Order status → ${newStatus}`);
      onStatusUpdate();
      onClose();
    } catch (err) { toast.error(err.message); }
    finally { setUpdating(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/70 backdrop-blur-sm p-4 overflow-y-auto">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-large w-full max-w-2xl my-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-100 dark:border-dark-700">
          <div>
            <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">{order.orderNumber}</h2>
            <p className="text-dark-400 text-sm">{formatDate(order.createdAt)}</p>
          </div>
          <button onClick={onClose} className="btn-icon text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Customer */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-2xl">
              <p className="text-xs font-bold text-dark-400 uppercase tracking-wide mb-2">Customer</p>
              <p className="font-semibold text-dark-900 dark:text-white">{order.user?.name || order.shippingAddress?.fullName}</p>
              <p className="text-sm text-dark-500">{order.user?.email || order.shippingAddress?.email}</p>
            </div>
            <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-2xl">
              <p className="text-xs font-bold text-dark-400 uppercase tracking-wide mb-2">Ship To</p>
              <p className="text-sm text-dark-700 dark:text-dark-300">{order.shippingAddress?.fullName}</p>
              <p className="text-sm text-dark-500">{order.shippingAddress?.street}</p>
              <p className="text-sm text-dark-500">{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.postalCode}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-bold text-dark-400 uppercase tracking-wide mb-3">Items ({order.items?.length})</p>
            <div className="space-y-2">
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-dark-50 dark:bg-dark-700 rounded-xl">
                  <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-dark-900 dark:text-white text-sm truncate">{item.name}</p>
                    <p className="text-xs text-dark-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-dark-900 dark:text-white text-sm">{formatPrice(item.discountedPrice * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="p-4 bg-dark-50 dark:bg-dark-700 rounded-2xl space-y-2 text-sm">
            <div className="flex justify-between text-dark-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-dark-500"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between text-dark-500"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
            {order.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Discount</span><span>-{formatPrice(order.discount)}</span></div>}
            <div className="flex justify-between font-black text-dark-900 dark:text-white border-t border-dark-200 dark:border-dark-600 pt-2">
              <span>Total</span><span className="text-primary-600">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Update Status */}
          <div className="p-4 bg-primary-50 dark:bg-primary-900/10 rounded-2xl border border-primary-100 dark:border-primary-800">
            <p className="text-sm font-bold text-dark-800 dark:text-white mb-3">Update Order Status</p>
            <div className="grid sm:grid-cols-2 gap-3 mb-3">
              <div className="relative">
                <select value={newStatus} onChange={e => setNewStatus(e.target.value)} className="input-field appearance-none pr-8">
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_CONFIG[s]?.label || s}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
              </div>
              <input value={note} onChange={e => setNote(e.target.value)} placeholder="Optional note..." className="input-field" />
            </div>
            <button onClick={handleUpdate} disabled={updating} className="btn-primary btn-sm gap-2">
              {updating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <RefreshCw size={14} />}
              Update Status
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ── AdminOrders ────────────────────────────────────────── */
const AdminOrders = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [total, setTotal]       = useState(0);
  const [page, setPage]         = useState(1);
  const [search, setSearch]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await orderAPI.getAll({ page, limit: 15, search: search || undefined, status: statusFilter || undefined });
      setOrders(r.orders || []);
      setTotal(r.total || 0);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, search, statusFilter]); // eslint-disable-line

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Orders</h1>
          <p className="text-dark-500 text-sm mt-0.5">{total} total orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search size={16} className="text-dark-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search order number..." className="flex-1 bg-transparent text-sm focus:outline-none text-dark-900 dark:text-white placeholder-dark-400" />
          {search && <button onClick={() => setSearch('')}><X size={14} className="text-dark-400" /></button>}
        </div>
        <div className="relative">
          <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input-field appearance-none pr-8 min-w-[160px]">
            <option value="">All Statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{ORDER_STATUS_CONFIG[s]?.label || s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
        </div>
        <button onClick={load} className="btn-secondary btn-sm gap-2 flex-shrink-0"><RefreshCw size={14} /> Refresh</button>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-700">
              <tr>
                {['Order', 'Customer', 'Date', 'Items', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>{[...Array(8)].map((_, j) => <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>)}</tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-dark-400">No orders found</td></tr>
              ) : (
                orders.map(order => (
                  <tr key={order._id} className="hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono font-semibold text-primary-600 dark:text-primary-400 text-sm">{order.orderNumber}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-dark-900 dark:text-white text-sm">{order.user?.name}</p>
                      <p className="text-xs text-dark-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-500 dark:text-dark-400 whitespace-nowrap">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3 text-sm text-dark-600 dark:text-dark-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td className="px-4 py-3 font-bold text-dark-900 dark:text-white text-sm">{formatPrice(order.total)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge text-xs font-medium', order.isPaid ? 'badge-success' : 'badge-warning')}>
                        {order.isPaid ? '✓ Paid' : '⏳ Pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge text-xs font-semibold', STATUS_COLORS[order.status] || 'bg-dark-100 text-dark-600')}>
                        {ORDER_STATUS_CONFIG[order.status]?.icon} {ORDER_STATUS_CONFIG[order.status]?.label || order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelectedOrder(order)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                        <Eye size={14} />
                      </button>
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
        {selectedOrder && (
          <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} onStatusUpdate={load} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
