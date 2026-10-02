import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/helpers';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, loading } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product._id);
    toast.success('Moved to cart!', { icon: '🛒' });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
          <Heart size={40} className="text-red-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-3">Sign in to view your Wishlist</h2>
        <p className="text-dark-500 mb-8 text-center max-w-sm">Save your favourite products and access them from any device.</p>
        <div className="flex gap-3">
          <Link to="/login" className="btn-primary">Sign In</Link>
          <Link to="/register" className="btn-secondary">Create Account</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50/50 dark:bg-dark-950 py-8">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">My Wishlist</h1>
            <p className="text-dark-500 dark:text-dark-400 mt-1">
              {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
            </p>
          </div>
          {wishlist.length > 0 && (
            <Link to="/shop" className="btn-secondary btn-sm gap-2">
              <ArrowRight size={15} /> Continue Shopping
            </Link>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton rounded-2xl h-72" />
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <div className="w-28 h-28 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
              <Heart size={48} className="text-red-300 dark:text-red-700" />
            </div>
            <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-3">Your wishlist is empty</h2>
            <p className="text-dark-500 dark:text-dark-400 mb-8 max-w-sm">
              Tap the heart icon on any product to save it here for later.
            </p>
            <Link to="/shop" className="btn-primary btn-lg">
              <ArrowRight size={18} /> Discover Products
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Bulk actions */}
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-sm text-dark-500 dark:text-dark-400">
                Showing {wishlist.length} saved item{wishlist.length !== 1 ? 's' : ''}
              </p>
              <button
                onClick={() => {
                  wishlist.forEach(p => addToCart(p, 1));
                  toast.success('All items added to cart!', { icon: '🛒' });
                }}
                className="btn-primary btn-sm gap-2"
              >
                <ShoppingCart size={14} /> Add All to Cart
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {wishlist.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
