import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categoryAPI } from '../../services/api';

const FALLBACK_IMAGES = {
  electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&q=80',
  fashion: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=300&q=80',
  beauty: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=300&q=80',
  'home & living': 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=80',
  accessories: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=300&q=80',
  sports: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=300&q=80',
  books: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&q=80',
  gaming: 'https://images.unsplash.com/photo-1593118247619-e2d6f056869e?w=300&q=80',
};

const CategorySection = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryAPI.getAll()
      .then((res) => setCategories(res.categories || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="section bg-white dark:bg-dark-950">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Categories</p>
            <h2 className="section-title">Shop by Category</h2>
          </div>
          <Link to="/shop" className="hidden sm:flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-sm group">
            All Categories
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => <div key={i} className="skeleton rounded-2xl aspect-square" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const imgSrc = cat.image || FALLBACK_IMAGES[cat.name.toLowerCase()] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300';
              return (
                <motion.div
                  key={cat._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                >
                  <Link
                    to={`/shop/${cat.slug}`}
                    className="group relative block rounded-2xl overflow-hidden aspect-square shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1"
                  >
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-4">
                      <div className="text-2xl mb-1">{cat.icon}</div>
                      <h3 className="text-white font-display font-bold text-lg leading-tight">{cat.name}</h3>
                      {cat.productCount > 0 && (
                        <p className="text-white/60 text-xs mt-0.5">{cat.productCount} products</p>
                      )}
                    </div>
                    {/* Hover arrow */}
                    <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <ArrowRight size={14} className="text-white" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default CategorySection;
