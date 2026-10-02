import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Search, ArrowRight } from 'lucide-react';

const NotFoundPage = () => (
  <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center px-4">
    <div className="text-center max-w-lg">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Giant 404 */}
        <div className="relative mb-8">
          <p className="text-[160px] md:text-[200px] font-display font-black text-dark-100 dark:text-dark-800 leading-none select-none">
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center shadow-glow-lg">
              <Search size={40} className="text-white" />
            </div>
          </div>
        </div>

        <h1 className="font-display font-black text-3xl text-dark-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-dark-500 dark:text-dark-400 text-lg mb-8 leading-relaxed">
          Oops! The page you're looking for has either been moved, deleted, or doesn't exist.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary btn-lg gap-2">
            <Home size={18} /> Back to Home
          </Link>
          <Link to="/shop" className="btn-secondary btn-lg gap-2">
            <ArrowRight size={18} /> Browse Shop
          </Link>
        </div>
      </motion.div>
    </div>
  </div>
);

export default NotFoundPage;
