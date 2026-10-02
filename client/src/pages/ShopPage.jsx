import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, Search, LayoutGrid, List, Filter } from 'lucide-react';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/common/ProductCard';
import { SkeletonGrid } from '../components/common/SkeletonCard';
import QuickViewModal from '../components/product/QuickViewModal';
import { cn, debounce } from '../utils/helpers';

const SORT_OPTIONS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'newest',     label: 'Newest' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'popular',    label: 'Most Popular' },
  { value: 'discount',   label: 'Biggest Discount' },
];

const PRICE_RANGES = [
  { label: 'Under $25',       min: '',   max: '25' },
  { label: '$25 – $100',      min: '25', max: '100' },
  { label: '$100 – $500',     min: '100', max: '500' },
  { label: '$500 – $1,000',   min: '500', max: '1000' },
  { label: 'Over $1,000',     min: '1000', max: '' },
];

const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category: categorySlug } = useParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filter state
  const page      = parseInt(searchParams.get('page') || '1');
  const sort      = searchParams.get('sort') || 'featured';
  const keyword   = searchParams.get('keyword') || '';
  const category  = searchParams.get('category') || '';
  const minPrice  = searchParams.get('minPrice') || '';
  const maxPrice  = searchParams.get('maxPrice') || '';
  const rating    = searchParams.get('rating') || '';
  const inStock   = searchParams.get('inStock') || '';
  const isOnSale  = searchParams.get('isOnSale') || '';
  const isNewArrival = searchParams.get('isNewArrival') || '';
  const isFeatured   = searchParams.get('isFeatured') || '';

  useEffect(() => {
    categoryAPI.getAll().then((res) => setCategories(res.categories || [])).catch(() => {});
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [searchParams, categorySlug]); // eslint-disable-line

  const fetchProducts = async () => {
    setLoading(true);
    try {
      // Resolve category ID from slug
      let categoryId = category;
      if (categorySlug && categories.length > 0) {
        const cat = categories.find((c) => c.slug === categorySlug);
        categoryId = cat?._id || '';
      }

      const params = {
        page, sort, limit: 12,
        ...(keyword && { keyword }),
        ...(categoryId && { category: categoryId }),
        ...(minPrice && { minPrice }),
        ...(maxPrice && { maxPrice }),
        ...(rating && { rating }),
        ...(inStock && { inStock }),
        ...(isOnSale && { isOnSale }),
        ...(isNewArrival && { isNewArrival }),
        ...(isFeatured && { isFeatured }),
      };

      const res = await productAPI.getAll(params);
      setProducts(res.products || []);
      setTotal(res.total || 0);
      setPages(res.pages || 1);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    next.delete('page');
    setSearchParams(next);
  };

  const clearAll = () => setSearchParams({});

  const hasFilters = [keyword, category, minPrice, maxPrice, rating, inStock, isOnSale, isNewArrival].some(Boolean);

  const currentCat = categories.find((c) => c._id === category || c.slug === categorySlug);

  const FilterPanel = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h4 className="font-semibold text-dark-900 dark:text-white text-sm mb-3">Categories</h4>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', '')}
            className={cn('w-full text-left px-3 py-2 rounded-xl text-sm transition-colors', !category && !categorySlug ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium' : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700')}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat._id}
              onClick={() => updateParam('category', cat._id)}
              className={cn('w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center justify-between', category === cat._id ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium' : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700')}
            >
              {cat.name}
              <span className="text-xs text-dark-400">{cat.productCount}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="font-semibold text-dark-900 dark:text-white text-sm mb-3">Price Range</h4>
        <div className="space-y-1">
          {PRICE_RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => { updateParam('minPrice', r.min); updateParam('maxPrice', r.max); }}
              className={cn('w-full text-left px-3 py-2 rounded-xl text-sm transition-colors', minPrice === r.min && maxPrice === r.max ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium' : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700')}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h4 className="font-semibold text-dark-900 dark:text-white text-sm mb-3">Min Rating</h4>
        <div className="space-y-1">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => updateParam('rating', rating === String(r) ? '' : String(r))}
              className={cn('w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2', rating === String(r) ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 font-medium' : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-700')}
            >
              {'★'.repeat(r)}{'☆'.repeat(5 - r)} <span className="text-dark-400">& up</span>
            </button>
          ))}
        </div>
      </div>

      {/* Quick filters */}
      <div>
        <h4 className="font-semibold text-dark-900 dark:text-white text-sm mb-3">Quick Filters</h4>
        <div className="space-y-2">
          {[
            { key: 'isOnSale',   label: 'On Sale' },
            { key: 'isNewArrival', label: 'New Arrivals' },
            { key: 'inStock',    label: 'In Stock Only' },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get(key) === 'true'}
                onChange={(e) => updateParam(key, e.target.checked ? 'true' : '')}
                className="w-4 h-4 rounded border-dark-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-dark-700 dark:text-dark-300">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-dark-950">
      {/* Header bar */}
      <div className="bg-dark-50/80 dark:bg-dark-900/80 border-b border-dark-100 dark:border-dark-700 py-4">
        <div className="container-main">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h1 className="font-display font-bold text-xl text-dark-900 dark:text-white">
                {currentCat ? currentCat.name : keyword ? `Results for "${keyword}"` : 'All Products'}
              </h1>
              {!loading && <p className="text-sm text-dark-400">{total.toLocaleString()} products found</p>}
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Keyword search */}
              <div className="relative hidden md:flex">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  defaultValue={keyword}
                  onChange={debounce((e) => updateParam('keyword', e.target.value), 400)}
                  className="input-field pl-9 w-48"
                />
              </div>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="input-field appearance-none pr-8 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 pointer-events-none" />
              </div>

              {/* Mobile filter toggle */}
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className={cn('lg:hidden btn-secondary btn-sm gap-2', filterOpen && 'bg-primary-50 dark:bg-primary-900/20 border-primary-300 text-primary-700')}
              >
                <Filter size={16} /> Filters
                {hasFilters && <span className="w-2 h-2 bg-primary-600 rounded-full" />}
              </button>

              {hasFilters && (
                <button onClick={clearAll} className="btn-ghost btn-sm text-red-500 gap-1">
                  <X size={14} /> Clear All
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-main py-8">
        <div className="flex gap-8">
          {/* Sidebar filters — desktop */}
          <aside className="hidden lg:block w-56 flex-shrink-0">
            <div className="card p-5 sticky top-24">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-display font-bold text-dark-900 dark:text-white">Filters</h3>
                {hasFilters && (
                  <button onClick={clearAll} className="text-xs text-red-500 hover:text-red-600">Clear all</button>
                )}
              </div>
              <FilterPanel />
            </div>
          </aside>

          {/* Mobile filter drawer */}
          <AnimatePresence>
            {filterOpen && (
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                className="fixed inset-0 z-50 flex lg:hidden"
              >
                <div className="w-72 bg-white dark:bg-dark-800 h-full overflow-y-auto p-6 shadow-large">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-display font-bold text-dark-900 dark:text-white">Filters</h3>
                    <button onClick={() => setFilterOpen(false)}><X size={20} /></button>
                  </div>
                  <FilterPanel />
                </div>
                <div className="flex-1 bg-dark-900/50" onClick={() => setFilterOpen(false)} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <SkeletonGrid count={12} />
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-display font-bold text-dark-900 dark:text-white mb-2">No products found</h3>
                <p className="text-dark-500 mb-6">Try adjusting your search or filters to find what you're looking for.</p>
                <button onClick={clearAll} className="btn-primary">Clear Filters</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
                  {products.map((p) => (
                    <ProductCard key={p._id} product={p} onQuickView={setQuickViewProduct} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => updateParam('page', String(page - 1))}
                      disabled={page === 1}
                      className="btn-secondary btn-sm disabled:opacity-40"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(pages, 7) }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => updateParam('page', String(p))}
                        className={cn('w-10 h-10 rounded-xl text-sm font-semibold transition-all', p === page ? 'bg-primary-600 text-white shadow-glow' : 'bg-white dark:bg-dark-800 border border-dark-200 dark:border-dark-600 text-dark-700 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700')}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => updateParam('page', String(page + 1))}
                      disabled={page === pages}
                      className="btn-secondary btn-sm disabled:opacity-40"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />}
    </div>
  );
};

export default ShopPage;
