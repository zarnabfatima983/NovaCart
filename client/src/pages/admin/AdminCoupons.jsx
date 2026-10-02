import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Ticket, X, Save, Trash2, AlertTriangle, Check } from 'lucide-react';
import { couponAPI } from '../../services/api';
import { formatDate, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const CouponFormModal = ({ coupon, onClose, onSaved }) => {
  const isEdit = !!coupon?._id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    code:          coupon?.code          || '',
    description:   coupon?.description   || '',
    discountType:  coupon?.discountType  || 'percentage',
    discountValue: coupon?.discountValue || '',
    minimumOrder:  coupon?.minimumOrder  || 0,
    maximumDiscount: coupon?.maximumDiscount || '',
    expiryDate:    coupon?.expiryDate ? coupon.expiryDate.split('T')[0] : '',
    usageLimit:    coupon?.usageLimit    || '',
    isActive:      coupon?.isActive !== undefined ? coupon.isActive : true,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        code:           form.code.toUpperCase(),
        discountValue:  Number(form.discountValue),
        minimumOrder:   Number(form.minimumOrder),
        maximumDiscount: form.maximumDiscount ? Number(form.maximumDiscount) : undefined,
        usageLimit:     form.usageLimit ? Number(form.usageLimit) : null,
      };
      if (isEdit) {
        await couponAPI.update(coupon._id, payload);
        toast.success('Coupon updated!');
      } else {
        await couponAPI.create(payload);
        toast.success('Coupon created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/70 backdrop-blur-sm p-4">
      <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-large w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-dark-100 dark:border-dark-700">
          <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">
            {isEdit ? 'Edit Coupon' : 'Create Coupon'}
          </h2>
          <button onClick={onClose} className="btn-icon text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700"><X size={20} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="input-label">Coupon Code *</label>
              <input
                value={form.code}
                onChange={e => set('code', e.target.value.toUpperCase())}
                placeholder="SAVE20"
                className="input-field font-mono font-bold tracking-widest uppercase"
                required
              />
            </div>
            <div className="col-span-2">
              <label className="input-label">Description</label>
              <input value={form.description} onChange={e => set('description', e.target.value)} placeholder="Short description of the offer" className="input-field" />
            </div>

            <div>
              <label className="input-label">Discount Type *</label>
              <select value={form.discountType} onChange={e => set('discountType', e.target.value)} className="input-field">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>
            <div>
              <label className="input-label">
                {form.discountType === 'percentage' ? 'Discount %' : 'Discount Amount ($)'} *
              </label>
              <input
                type="number" min="0" max={form.discountType === 'percentage' ? 100 : undefined} step="0.01"
                value={form.discountValue} onChange={e => set('discountValue', e.target.value)}
                className="input-field" required
              />
            </div>

            <div>
              <label className="input-label">Min Order Amount ($)</label>
              <input type="number" min="0" step="0.01" value={form.minimumOrder} onChange={e => set('minimumOrder', e.target.value)} className="input-field" />
            </div>
            {form.discountType === 'percentage' && (
              <div>
                <label className="input-label">Max Discount Cap ($)</label>
                <input type="number" min="0" step="0.01" value={form.maximumDiscount} onChange={e => set('maximumDiscount', e.target.value)} placeholder="No cap" className="input-field" />
              </div>
            )}

            <div>
              <label className="input-label">Expiry Date *</label>
              <input type="date" value={form.expiryDate} onChange={e => set('expiryDate', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Usage Limit</label>
              <input type="number" min="0" value={form.usageLimit} onChange={e => set('usageLimit', e.target.value)} placeholder="Unlimited" className="input-field" />
            </div>

            <div className="col-span-2 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isActive} onChange={e => set('isActive', e.target.checked)} className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm font-medium text-dark-700 dark:text-dark-300">Active</span>
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              {isEdit ? 'Update' : 'Create'} Coupon
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const AdminCoupons = () => {
  const [coupons, setCoupons]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCoupon, setEditCoupon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await couponAPI.getAll();
      setCoupons(r.coupons || []);
    } catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await couponAPI.delete(deleteId);
      toast.success('Coupon deactivated');
      setDeleteId(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Coupons</h1>
          <p className="text-dark-500 text-sm mt-0.5">{coupons.length} coupons</p>
        </div>
        <button onClick={() => { setEditCoupon(null); setShowForm(true); }} className="btn-primary gap-2">
          <Plus size={16} /> Create Coupon
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-44 rounded-2xl" />)}
        </div>
      ) : coupons.length === 0 ? (
        <div className="card p-16 text-center">
          <Ticket size={40} className="mx-auto mb-3 text-dark-300" />
          <p className="text-dark-500">No coupons yet. Create one to offer discounts!</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.map(c => {
            const expired = isExpired(c.expiryDate);
            const invalid = !c.isActive || expired;
            return (
              <motion.div key={c._id} layout className={cn('card p-5 relative', invalid && 'opacity-60')}>
                {/* Actions */}
                <div className="absolute top-3 right-3 flex gap-1">
                  <button onClick={() => { setEditCoupon(c); setShowForm(true); }}
                    className="w-7 h-7 bg-dark-100 dark:bg-dark-600 rounded-lg flex items-center justify-center text-dark-500 hover:text-primary-600 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button onClick={() => setDeleteId(c._id)}
                    className="w-7 h-7 bg-dark-100 dark:bg-dark-600 rounded-lg flex items-center justify-center text-dark-500 hover:text-red-500 transition-colors">
                    <Trash2 size={11} />
                  </button>
                </div>

                {/* Code */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-9 h-9 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                    <Ticket size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <span className="font-mono font-black text-lg text-primary-600 dark:text-primary-400 tracking-widest">{c.code}</span>
                </div>

                <p className="text-sm text-dark-600 dark:text-dark-400 mb-3 line-clamp-1">{c.description || 'No description'}</p>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-dark-400">Discount</span>
                    <span className="font-bold text-dark-900 dark:text-white">
                      {c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Min Order</span>
                    <span className="text-dark-700 dark:text-dark-300">${c.minimumOrder || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Expires</span>
                    <span className={expired ? 'text-red-500 font-medium' : 'text-dark-700 dark:text-dark-300'}>{formatDate(c.expiryDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dark-400">Used</span>
                    <span className="text-dark-700 dark:text-dark-300">{c.usedCount || 0}{c.usageLimit ? ` / ${c.usageLimit}` : ''}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-dark-100 dark:border-dark-700">
                  <span className={cn('badge text-xs font-semibold', !c.isActive ? 'badge-error' : expired ? 'bg-dark-100 dark:bg-dark-700 text-dark-500' : 'badge-success')}>
                    {!c.isActive ? '● Inactive' : expired ? '● Expired' : <><Check size={10} className="inline mr-0.5" /> Active</>}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <CouponFormModal coupon={editCoupon} onClose={() => { setShowForm(false); setEditCoupon(null); }} onSaved={load} />
        )}
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/70 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-sm w-full shadow-large text-center">
              <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white mb-2">Deactivate Coupon?</h3>
              <p className="text-dark-400 text-sm mb-5">The coupon will be deactivated and can no longer be used by customers.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleDelete} className="btn-danger flex-1">Deactivate</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCoupons;
