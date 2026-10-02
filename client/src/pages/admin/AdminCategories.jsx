import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit, Trash2, X, Save, Tag, AlertTriangle } from 'lucide-react';
import { categoryAPI } from '../../services/api';
import { cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const COLORS_PRESET = [
  '#6366f1','#d946ef','#06b6d4','#22c55e',
  '#f59e0b','#ef4444','#8b5cf6','#10b981',
  '#f43f5e','#3b82f6','#ec4899','#84cc16',
];

const CategoryFormModal = ({ category, onClose, onSaved }) => {
  const isEdit = !!category?._id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name:        category?.name        || '',
    description: category?.description || '',
    image:       category?.image       || '',
    icon:        category?.icon        || '📦',
    color:       category?.color       || '#6366f1',
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await categoryAPI.update(category._id, form);
        toast.success('Category updated!');
      } else {
        await categoryAPI.create(form);
        toast.success('Category created!');
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
            {isEdit ? 'Edit Category' : 'New Category'}
          </h2>
          <button onClick={onClose} className="btn-icon text-dark-400 hover:bg-dark-100 dark:hover:bg-dark-700"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Preview */}
          <div className="flex items-center gap-4 p-4 bg-dark-50 dark:bg-dark-700 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl" style={{ background: form.color + '20', border: `2px solid ${form.color}40` }}>
              {form.icon}
            </div>
            <div>
              <p className="font-bold text-dark-900 dark:text-white">{form.name || 'Category Name'}</p>
              <p className="text-xs text-dark-400">Preview</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="input-label">Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} className="input-field" required />
            </div>
            <div>
              <label className="input-label">Icon (emoji)</label>
              <input value={form.icon} onChange={e => set('icon', e.target.value)} className="input-field text-2xl" maxLength={2} />
            </div>
            <div>
              <label className="input-label">Color</label>
              <div className="flex gap-1 flex-wrap mt-1">
                {COLORS_PRESET.map(c => (
                  <button key={c} type="button" onClick={() => set('color', c)}
                    className={cn('w-7 h-7 rounded-lg border-2 transition-all', form.color === c ? 'border-dark-900 dark:border-white scale-110' : 'border-transparent')}
                    style={{ backgroundColor: c }} />
                ))}
              </div>
            </div>
            <div className="col-span-2">
              <label className="input-label">Image URL</label>
              <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://..." className="input-field" />
            </div>
            <div className="col-span-2">
              <label className="input-label">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} className="input-field resize-none" rows={3} />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={loading} className="btn-primary flex-1 gap-2">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              {isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showForm, setShowForm]     = useState(false);
  const [editCat, setEditCat]       = useState(null);
  const [deleteId, setDeleteId]     = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const r = await categoryAPI.getAll();
      setCategories(r.categories || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async () => {
    try {
      await categoryAPI.delete(deleteId);
      toast.success('Category deleted');
      setDeleteId(null);
      load();
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-dark-900 dark:text-white">Categories</h1>
          <p className="text-dark-500 text-sm mt-0.5">{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditCat(null); setShowForm(true); }} className="btn-primary gap-2">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton h-40 rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(cat => (
            <motion.div key={cat._id} layout className="card p-5 relative group">
              {/* Actions */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => { setEditCat(cat); setShowForm(true); }}
                  className="w-7 h-7 bg-white dark:bg-dark-600 rounded-lg flex items-center justify-center text-dark-500 hover:text-primary-600 shadow-soft">
                  <Edit size={12} />
                </button>
                <button onClick={() => setDeleteId(cat._id)}
                  className="w-7 h-7 bg-white dark:bg-dark-600 rounded-lg flex items-center justify-center text-dark-500 hover:text-red-500 shadow-soft">
                  <Trash2 size={12} />
                </button>
              </div>

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4"
                style={{ background: (cat.color || '#6366f1') + '20', border: `2px solid ${(cat.color || '#6366f1')}40` }}>
                {cat.icon || '📦'}
              </div>
              <p className="font-bold text-dark-900 dark:text-white text-sm mb-0.5">{cat.name}</p>
              <p className="text-xs text-dark-400 line-clamp-2">{cat.description || 'No description'}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="text-xs font-semibold text-dark-500 dark:text-dark-400 bg-dark-100 dark:bg-dark-700 px-2 py-0.5 rounded-lg">
                  <Tag size={9} className="inline mr-1" />{cat.productCount || 0} products
                </span>
                <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: cat.color || '#6366f1' }} />
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <CategoryFormModal
            category={editCat}
            onClose={() => { setShowForm(false); setEditCat(null); }}
            onSaved={load}
          />
        )}
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/70 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="bg-white dark:bg-dark-800 rounded-2xl p-6 max-w-sm w-full shadow-large text-center">
              <div className="w-14 h-14 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={28} className="text-red-500" />
              </div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white mb-2">Delete Category?</h3>
              <p className="text-dark-400 text-sm mb-5">Categories with products cannot be deleted. Make sure it is empty first.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">Cancel</button>
                <button onClick={handleDelete} className="btn-danger flex-1">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminCategories;
