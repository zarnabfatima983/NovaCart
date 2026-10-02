import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Heart, Eye, Star, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatPrice, cn } from '../../utils/helpers';
import toast from 'react-hot-toast';

const QuickViewModal = ({ product, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || null);
  const [selectedSize, setSelectedSize] = useState(null);

  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const { _id, name, brand, images, price, discount, discountedPrice, rating, numReviews, stock, description, colors, sizes } = product;

  const handleAddToCart = () => {
    if (sizes && sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedColor, selectedSize);
    toast.success('Added to cart!', { icon: '🛒' });
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-900/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white dark:bg-dark-800 rounded-3xl shadow-large max-w-2xl w-full overflow-hidden max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 z-10 w-10 h-10 bg-dark-100 dark:bg-dark-700 rounded-xl flex items-center justify-center hover:bg-dark-200 dark:hover:bg-dark-600 transition-colors">
            <X size={18} />
          </button>

          <div className="grid md:grid-cols-2">
            {/* Image */}
            <div className="relative bg-dark-50 dark:bg-dark-700 aspect-square">
              <img src={images?.[imgIdx] || images?.[0]} alt={name} className="w-full h-full object-cover" />
              {images?.length > 1 && (
                <>
                  <button onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-dark-800/90 rounded-full flex items-center justify-center shadow-soft">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={() => setImgIdx((i) => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/90 dark:bg-dark-800/90 rounded-full flex items-center justify-center shadow-soft">
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
              {discount > 0 && (
                <div className="absolute top-3 left-3 badge bg-red-500 text-white font-bold">-{discount}%</div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 flex flex-col">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-widest mb-1">{brand}</p>
              <h2 className="text-xl font-display font-bold text-dark-900 dark:text-white mb-3 line-clamp-2">{name}</h2>

              {/* Rating */}
              {numReviews > 0 && (
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className={i < Math.round(rating) ? 'text-amber-400' : 'text-dark-200'} fill="currentColor" />
                    ))}
                  </div>
                  <span className="text-sm text-dark-500">({numReviews} reviews)</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl font-black text-dark-900 dark:text-white">{formatPrice(discountedPrice || price)}</span>
                {discount > 0 && <span className="text-sm text-dark-400 line-through">{formatPrice(price)}</span>}
              </div>

              <p className="text-sm text-dark-500 dark:text-dark-400 line-clamp-3 mb-4">{description}</p>

              {/* Colors */}
              {colors && colors.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">Color: <span className="font-normal">{selectedColor}</span></p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((c) => (
                      <button key={c} onClick={() => setSelectedColor(c)} className={cn('px-3 py-1 rounded-lg border text-xs font-medium transition-all', selectedColor === c ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300' : 'border-dark-200 dark:border-dark-600 text-dark-600 dark:text-dark-400 hover:border-primary-300')}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {sizes && sizes.length > 0 && (
                <div className="mb-4">
                  <p className="text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((s) => (
                      <button key={s} onClick={() => setSelectedSize(s)} className={cn('w-12 h-10 rounded-lg border text-sm font-medium transition-all', selectedSize === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700' : 'border-dark-200 dark:border-dark-600 text-dark-600 dark:text-dark-400 hover:border-primary-300')}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity + Cart */}
              <div className="flex items-center gap-3 mt-auto">
                <div className="flex items-center border border-dark-200 dark:border-dark-600 rounded-xl overflow-hidden">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-dark-700 dark:text-dark-300 text-lg font-bold">−</button>
                  <span className="w-10 text-center text-sm font-semibold text-dark-900 dark:text-white">{quantity}</span>
                  <button onClick={() => setQuantity((q) => Math.min(stock, q + 1))} className="w-10 h-10 flex items-center justify-center hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-dark-700 dark:text-dark-300 text-lg font-bold">+</button>
                </div>

                <button onClick={handleAddToCart} disabled={stock === 0} className="btn-primary flex-1 disabled:opacity-50">
                  <ShoppingCart size={16} />
                  {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>

                <button onClick={() => toggleWishlist(product)} className={cn('w-10 h-10 rounded-xl border flex items-center justify-center transition-all', isInWishlist(_id) ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500' : 'border-dark-200 dark:border-dark-600 text-dark-500 hover:border-red-300 hover:text-red-500')}>
                  <Heart size={16} fill={isInWishlist(_id) ? 'currentColor' : 'none'} />
                </button>
              </div>

              <Link to={`/product/${_id}`} onClick={onClose} className="flex items-center justify-center gap-2 mt-3 text-sm text-primary-600 hover:underline">
                <ExternalLink size={14} /> View Full Details
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default QuickViewModal;
