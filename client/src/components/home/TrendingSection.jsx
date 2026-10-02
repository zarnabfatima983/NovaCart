import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { productAPI } from '../../services/api';
import ProductCard from '../common/ProductCard';
import { SkeletonGrid } from '../common/SkeletonCard';
import QuickViewModal from '../product/QuickViewModal';

const TrendingSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    productAPI.getAll({ isFeatured: 'true', limit: 8, sort: 'popular' })
      .then((res) => setProducts(res.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section bg-dark-50/50 dark:bg-dark-900/50">
      <div className="container-main">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={16} className="text-primary-600" />
              <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest">Trending Now</p>
            </div>
            <h2 className="section-title">Most Popular Products</h2>
          </div>
          <Link to="/shop?sort=popular" className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group">
            View All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} onQuickView={setQuickViewProduct} />
            ))}
          </div>
        )}
      </div>

      {quickViewProduct && (
        <QuickViewModal product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
      )}
    </section>
  );
};

export default TrendingSection;
