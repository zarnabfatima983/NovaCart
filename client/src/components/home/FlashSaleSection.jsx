import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Clock } from 'lucide-react';
import { productAPI } from '../../services/api';
import ProductCard from '../common/ProductCard';

// Countdown to next midnight
const getTimeUntilMidnight = () => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(midnight.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);
  return Math.floor((midnight - now) / 1000);
};

const pad = (n) => String(n).padStart(2, '0');

const FlashSaleSection = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState(getTimeUntilMidnight);

  useEffect(() => {
    productAPI.getFlashSale()
      .then((res) => setProducts(res.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const tick = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 0) return getTimeUntilMidnight();
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(tick);
  }, []);

  const hours   = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;

  if (!loading && products.length === 0) return null;

  return (
    <section className="section bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl" />
      </div>

      <div className="container-main relative z-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-red-500 rounded-xl flex items-center justify-center">
                <Zap size={16} className="text-white" fill="currentColor" />
              </div>
              <span className="text-red-400 font-bold text-sm uppercase tracking-widest">Flash Sale</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-white">Limited Time Deals</h2>
            <p className="text-dark-400 text-sm mt-1">Hurry! These deals won't last long.</p>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-dark-400 text-sm">
              <Clock size={14} />
              <span>Ends in:</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[pad(hours), pad(minutes), pad(seconds)].map((unit, i) => (
                <span key={i} className="flex items-center gap-1">
                  <motion.span
                    key={unit}
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/10 text-white font-display font-black text-xl w-12 h-12 flex items-center justify-center rounded-xl"
                  >
                    {unit}
                  </motion.span>
                  {i < 2 && <span className="text-white/50 font-bold text-lg">:</span>}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <div key={i} className="bg-white/5 rounded-2xl h-64 animate-pulse" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/shop?isOnSale=true" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold group">
            View All Flash Sale Items
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashSaleSection;
