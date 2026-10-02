import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { productAPI } from '../../services/api';
import { storage } from '../../utils/helpers';
import ProductCard from '../common/ProductCard';
import { SkeletonGrid } from '../common/SkeletonCard';

const RecommendSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get recently viewed categories from storage
    const viewed = storage.get('nova_recently_viewed', []);
    const categoryIds = viewed.map((p) => p.category?._id || p.category).filter(Boolean);

    const params = {
      limit: 8,
      sort: 'rating',
      ...(categoryIds.length > 0 ? { categoryIds: [...new Set(categoryIds)].slice(0, 3).join(',') } : { isFeatured: 'true' }),
    };

    productAPI.getRecommendations(params)
      .then((res) => setProducts(res.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (!loading && products.length === 0) return null;

  return (
    <section className="section bg-white dark:bg-dark-950">
      <div className="container-main">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-accent-500" />
              <p className="text-accent-500 font-semibold text-sm uppercase tracking-widest">Personalized</p>
            </div>
            <h2 className="section-title">Picked For You</h2>
            <p className="section-subtitle text-sm">Based on your browsing and preferences</p>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-primary-600 font-semibold text-sm group">
            Explore All <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <SkeletonGrid count={8} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((p) => <ProductCard key={p._id} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
};

export default RecommendSection;
