import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import { productAPI } from '../../services/api';
import ProductCard from '../common/ProductCard';

const NewArrivalsSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const visible = 4;

  useEffect(() => {
    productAPI.getNewArrivals()
      .then((res) => setProducts(res.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const canPrev = offset > 0;
  const canNext = offset + visible < products.length;

  return (
    <section className="section bg-dark-50/50 dark:bg-dark-900/50">
      <div className="container-main">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-primary-600" />
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Just In</p>
            </div>
            <h2 className="section-title">New Arrivals</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setOffset((o) => Math.max(0, o - visible))}
                disabled={!canPrev}
                className="w-10 h-10 rounded-xl border border-dark-200 dark:border-dark-700 flex items-center justify-center disabled:opacity-40 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                onClick={() => setOffset((o) => Math.min(products.length - visible, o + visible))}
                disabled={!canNext}
                className="w-10 h-10 rounded-xl border border-dark-200 dark:border-dark-700 flex items-center justify-center disabled:opacity-40 hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
              >
                <ArrowRight size={16} />
              </button>
            </div>
            <Link to="/shop?isNewArrival=true" className="hidden sm:flex items-center gap-1 text-primary-600 font-semibold text-sm group">
              View All <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton rounded-2xl h-72" />)}
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 overflow-hidden"
          >
            {products.slice(offset, offset + visible).map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default NewArrivalsSection;
