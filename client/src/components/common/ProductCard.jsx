import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Eye, Star, GitCompare, TrendingUp } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useCompare } from '../../context/CompareContext';
import { formatPrice, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const ProductCard = ({ product, onQuickView, variant = 'default' }) => {
  const [imgError, setImgError] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare, isInCompare } = useCompare();

  if (!product) return null;

  const {
    _id, name, brand, images, price, discount, discountedPrice,
    rating, numReviews, stock, isNewArrival, isFeatured, isOnSale,
  } = product;

  const inWishlist = isInWishlist(_id);
  const inCart = isInCart(_id);
  const inCompare = isInCompare(_id);
  const imgSrc = !imgError && images?.[0] ? images[0] : `https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400`;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock === 0) return;
    addToCart(product, 1);
    toast.success('Added to cart!', { icon: '🛒' });
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCompare(product);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn('card card-hover group relative flex flex-col h-full', variant === 'compact' && 'rounded-xl')}
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
        {discount > 0 && (
          <span className="badge bg-red-500 text-white font-bold text-xs px-2 py-0.5">-{discount}%</span>
        )}
        {isNewArrival && (
          <span className="badge bg-emerald-500 text-white font-bold text-xs px-2 py-0.5">New</span>
        )}
        {isFeatured && (
          <span className="badge bg-amber-500 text-white font-bold text-xs px-2 py-0.5">Featured</span>
        )}
        {stock === 0 && (
          <span className="badge bg-dark-500 text-white font-bold text-xs px-2 py-0.5">Sold Out</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={handleWishlist}
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center shadow-medium transition-all duration-200',
            inWishlist
              ? 'bg-red-500 text-white'
              : 'bg-white dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500'
          )}
          aria-label="Add to wishlist"
        >
          <Heart size={14} fill={inWishlist ? 'currentColor' : 'none'} />
        </button>
        {onQuickView && (
          <button
            onClick={handleQuickView}
            className="w-8 h-8 bg-white dark:bg-dark-700 rounded-xl flex items-center justify-center shadow-medium text-dark-600 dark:text-dark-300 hover:bg-primary-50 hover:text-primary-600 transition-all duration-200"
            aria-label="Quick view"
          >
            <Eye size={14} />
          </button>
        )}
        <button
          onClick={handleCompare}
          className={cn(
            'w-8 h-8 rounded-xl flex items-center justify-center shadow-medium transition-all duration-200',
            inCompare
              ? 'bg-primary-600 text-white'
              : 'bg-white dark:bg-dark-700 text-dark-600 dark:text-dark-300 hover:bg-primary-50 hover:text-primary-600'
          )}
          aria-label="Compare"
        >
          <GitCompare size={14} />
        </button>
      </div>

      {/* Image */}
      <Link to={`/product/${_id}`} className="block relative overflow-hidden aspect-product bg-dark-50 dark:bg-dark-700">
        <img
          src={imgSrc}
          alt={name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Add to cart overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={cn(
              'w-full py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all duration-200',
              stock === 0
                ? 'bg-dark-300 dark:bg-dark-600 text-dark-500 cursor-not-allowed'
                : inCart
                  ? 'bg-emerald-600 text-white'
                  : 'bg-primary-600 hover:bg-primary-700 text-white shadow-glow'
            )}
          >
            <ShoppingCart size={15} />
            {stock === 0 ? 'Out of Stock' : inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wide mb-1">{brand}</p>
        <Link to={`/product/${_id}`} className="flex-1">
          <h3 className="text-sm font-semibold text-dark-900 dark:text-white line-clamp-2 hover:text-primary-600 dark:hover:text-primary-400 transition-colors leading-snug mb-2">
            {name}
          </h3>
        </Link>

        {/* Rating */}
        {numReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={11}
                  className={i < Math.round(rating) ? 'text-amber-400' : 'text-dark-200 dark:text-dark-600'}
                  fill="currentColor"
                />
              ))}
            </div>
            <span className="text-xs text-dark-400">({numReviews})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-base font-bold text-dark-900 dark:text-white">
            {formatPrice(discountedPrice || price)}
          </span>
          {discount > 0 && (
            <span className="text-xs text-dark-400 line-through">{formatPrice(price)}</span>
          )}
          {stock > 0 && stock <= 10 && (
            <span className="ml-auto text-2xs text-amber-600 dark:text-amber-400 font-medium flex items-center gap-0.5">
              <TrendingUp size={10} /> Only {stock} left
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
