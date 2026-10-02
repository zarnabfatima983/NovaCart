import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit, Trash2, Search, X, Save, ChevronDown, Package,
  ImagePlus, AlertTriangle, Check,
} from 'lucide-react';
import { productAPI, categoryAPI } from '../../services/api';
import { formatPrice, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

/* ── Product Form Modal ─────────────────────────────────── */
const ProductFormModal = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product?._id;
  const [loading, setLoading] = useState(false);
  const [specInput, setSpecInput] = useState({ name: '', value: '' });

  const [form, setForm] = useState({
    name:         product?.name         || '',
    description:  product?.description  || '',
    shortDescription: product?.shortDescription || '',
    price:        product?.price        || '',
    discount:     product?.discount     || 0,
    category:     product?.category?._id || product?.category || '',
    brand:        product?.brand        || '',
    stock:        product?.stock        ?? '',
    images:       product?.images?.join('\n') || '',
    colors:       product?.colors?.join(', ') || '',
    sizes:        product?.sizes?.join(', ')  || '',
    tags:         product?.tags?.join(', ')   || '',
    specifications: product?.specifications  || [],
    isFeatured:   product?.isFeatured   || false,
    isNewArrival: product?.isNewArrival || false,
    isOnSale:     product?.isOnSale     || false,
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addSpec = () => {
    if (!specInput.name || !specInput.value) return;
    set('specifications', [...form.specifications, { ...specInput }]);
    setSpecInput({ name: '', value: '' });
  };

  const removeSpec = (i) => set('specifications', form.specifications.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        price:    Number(form.price),
        discount: Number(form.discount),
        stock:    Number(form.stock),
        images:   form.images.split('\n').map(s => s.trim()).filter(Boolean),
        colors:   form.colors.split(',').map(s => s.trim()).filter(Boolean),
        sizes:    form.sizes.split(',').map(s => s.trim()).filter(Boolean),
        tags:     form.tags.split(',').map(s => s.trim()).filter(Boolean),
      };

      if (isEdit) {
        await productAPI.update(product._id, payload);
        toast.success('Product updated!');
      } else {
        await productAPI.create(payload);
        toast.success('Product created!');
      }
      onSaved();
      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, name, type = 'text', required, half, ...rest }) => (
    <div className={half ? '' : 'col-span-2'}>
      <label className="input-label">{label}{required && ' *'}</label>
      <input
        type={type}
        value={form[name]}
        onChange={e => set(name, e.target.value)}
        className="input-field"
        required={required}
        {...rest}
      />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-start justify-center bg-dark-900/70 backdrop-blur-sm overflow-y-auto py-6 px-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white dark:bg-dark-800 rounded-2xl shadow-large w-full max-w-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-100 dark:border-dark-700">
          <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="btn-icon text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
          <div className="grid grid-cols-2 gap-4">
            {/* Name */}
            <div className="col-span-2">
              <label className="input-label">Product Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className="input-field" required />
            </div>

            {/* Brand + Category */}
            <div>
              <label className="input-label">Brand *</label>
              <input value={form.brand} onChange={e => set('brand', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Category *</label>
              <select value={form.category} onChange={e => set('category', e.target.value)} className="input-field" required>
                <option value="">Select category</option>
                {categories.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>

            {/* Price + Discount */}
            <div>
              <label className="input-label">Price ($) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={e => set('price', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Discount (%)</label>
              <input type="number" min="0" max="100" value={form.discount} onChange={e => set('discount', e.target.value)} className="input-field" />
            </div>

            {/* Stock */}
            <div>
              <label className="input-label">Stock *</label>
              <input type="number" min="0" value={form.stock} onChange={e => set('stock', e.target.value)} className="input-field" required />
            </div>

            {/* Flags */}
            <div className="flex flex-col justify-end gap-2 pb-1">
              {[
                { key: 'isFeatured',   label: 'Featured' },
                { key: 'isNewArrival', label: 'New Arrival' },
                { key: 'isOnSale',     label: 'On Sale' },
              ].map(({ key, label }) => (
                <label key={key} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form[key]}
                    onChange={e => set(key, e.target.checked)}
                    className="w-4 h-4 rounded text-primary-600"
                  />
                  <span className="text-sm text-dark-700 dark:text-dark-300">{label}</span>
                </label>
              ))}
            </div>

            {/* Short description */}
            <div className="col-span-2">
              <label className="input-label">Short Description</label>
              <input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} className="input-field" placeholder="1–2 sentence summary" />
            </div>

            {/* Description */}
            <div className="col-span-2">
              <label className="input-label">Full Description *</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" rows={4} required />
            </div>

            {/* Images */}
            <div className="col-span-2">
              <label className="input-label flex items-center gap-2"><ImagePlus size={14} /> Image URLs (one per line)</label>
              <textarea
                value={form.images}
                onChange={e => set('images', e.target.value)}
                className="input-field resize-none font-mono text-xs"
                rows={3}
                placeholder="https://images.unsplash.com/photo-xxx?w=600"
              />
            </div>

            {/* Colors + Sizes */}
            <div>
              <label className="input-label">Colors (comma-separated)</label>
              <input value={form.colors} onChange={e => set('colors', e.target.value)} className="input-field" placeholder="Black, White, Blue" />
            </div>
            <div>
              <label className="input-label">Sizes (comma-separated)</label>
              <input value={form.sizes} onChange={e => set('sizes', e.target.value)} className="input-field" placeholder="S, M, L, XL" />
            </div>

            {/* Tags */}
            <div className="col-span-2">
              <label className="input-label">Tags (comma-separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} className="input-field" placeholder="wireless, headphone, premium" />
            </div>

            {/* Specifications */}
            <div className="col-span-2">
              <label className="input-label">Specifications</label>
              <div className="flex gap-2 mb-2">
                <input
                  value={specInput.name}
                  onChange={e => setSpecInput(s => ({ ...s, name: e.target.value }))}
                  placeholder="Name (e.g. Battery)"
                  className="input-field flex-1"
                />
                <input
                  value={specInput.value}
                  onChange={e => setSpecInput(s => ({ ...s, value: e.target.value }))}
                  placeholder="Value (e.g. 20 hours)"
                  className="input-field flex-1"
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSpec())}
                />
                <button type="button" onClick={addSpec} className="btn-primary btn-sm px-3 flex-shrink-0">
                  <Plus size={14} />
                </button>
              </div>
              {form.specifications.length > 0 && (
                <div className="space-y-1.5 max-h-32 overflow-y-auto">
                  {form.specifications.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 bg-dark-50 dark:bg-dark-700 rounded-xl px-3 py-2">
                      <span className="text-xs font-semibold text-dark-700 dark:text-dark-300 flex-shrink-0">{s.name}:</span>
                      <span className="text-xs text-dark-500 flex-1">{s.value}</span>
                      <button type="button" onClick={() => removeSpec(i)} className="text-dark-400 hover:text-red-500 flex-shrink-0">
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-6 pt-5 border-t border-dark-100 dark:border-dark-700">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              {isEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

/* ── AdminProducts ──────────────────────────────────────── */
const AdminProducts = () => {
  const [products, setProducts]   = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [search, setSearch]       = useState('');
  const [editProduct, setEditProduct] = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [deleteId, setDeleteId]   = useState(null);

  useEffect(() => {
    categoryAPI.getAll().then(r => setCategories(r.categories || [])).catch(() => {});
  }, []);

  useEffect(() => { loadProducts(); }, [page, search]); // eslint-disable-line

  const loadProducts = async () => {
    setLoading(true);
    try {
      const r = await productAPI.getAll({ page, limit: 12, keyword: search || undefined });
      setProducts(r.products || []);
      setTotal(r.total || 0);
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await productAPI.delete(id);
      toast.success('Product deleted');
      setDeleteId(null);
      loadProducts();
    } catch (err) { toast.error(err.message); }
  };

  const stockColor = (stock) => {
    if (stock === 0)    return 'text-red-500 bg-red-50 dark:bg-red-900/20';
    if (stock <= 10)    return 'text-amber-600 bg-amber-50 dark:bg-amber-900/20';
    return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Products</h1>
          <p className="text-dark-500 text-sm mt-0.5">{total} total products</p>
        </div>
        <button onClick={() => { setEditProduct(null); setShowForm(true); }} className="btn-primary gap-2">
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="card p-4 flex items-center gap-3">
        <Search size={16} className="text-dark-400 flex-shrink-0" />
        <input
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by name, brand..."
          className="flex-1 bg-transparent text-sm text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none"
        />
        {search && <button onClick={() => setSearch('')}><X size={16} className="text-dark-400 hover:text-dark-600" /></button>}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-50 dark:bg-dark-700">
              <tr>
                {['Product', 'Category', 'Price', 'Stock', 'Status', 'Rating', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-dark-500 dark:text-dark-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-100 dark:divide-dark-700">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    {[...Array(7)].map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="skeleton h-4 rounded" /></td>
                    ))}
                  </tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-dark-400">No products found</td></tr>
              ) : (
                products.map(p => (
                  <tr key={p._id} className="hover:bg-dark-50 dark:hover:bg-dark-700/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="font-semibold text-dark-900 dark:text-white text-sm truncate max-w-[180px]">{p.name}</p>
                          <p className="text-xs text-dark-400">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark-600 dark:text-dark-400">{p.category?.name}</td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-dark-900 dark:text-white text-sm">{formatPrice(p.discountedPrice || p.price)}</p>
                      {p.discount > 0 && <p className="text-xs text-dark-400 line-through">{formatPrice(p.price)}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge text-xs font-bold', stockColor(p.stock))}>
                        {p.stock === 0 ? 'Out' : `${p.stock} units`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {p.isFeatured   && <span className="badge badge-primary text-2xs">Featured</span>}
                        {p.isNewArrival && <span className="badge badge-success text-2xs">New</span>}
                        {p.isOnSale     && <span className="badge badge-error text-2xs">Sale</span>}
                        {!p.isFeatured && !p.isNewArrival && !p.isOnSale && <span className="text-xs text-dark-400">–</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-xs">★</span>
                        <span className="text-sm font-medium text-dark-700 dark:text-dark-300">{p.rating?.toFixed(1)}</span>
                        <span className="text-xs text-dark-400">({p.numReviews})</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => { setEditProduct(p); setShowForm(true); }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-dark-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setDeleteId(p._id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-dark-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 12 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-dark-100 dark:border-dark-700">
            <p className="text-sm text-dark-400">Showing {Math.min((page-1)*12+1, total)}–{Math.min(page*12, total)} of {total}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page === 1} className="btn-secondary btn-sm disabled:opacity-40">← Prev</button>
              <button onClick={() => setPage(p => p+1)} disabled={page * 12 >= total} className="btn-secondary btn-sm disabled:opacity-40">Next →</button>
            </div>
          </div>
        )}
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <ProductFormModal
            product={editProduct}
            categories={categories}
            onClose={() => { setShowForm(false); setEditProduct(null); }}
            onSaved={loadProducts}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/70 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-sm w-full shadow-large text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white text-lg mb-2">Delete Product?</h3>
              <p className="text-dark-400 text-sm mb-5">This action cannot be undone. The product will be permanently removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
