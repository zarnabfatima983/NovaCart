import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitCompare, X, ShoppingCart, Heart, Star, Check, Minus } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { formatPrice, cn } from '../utils/helpers';
import toast from 'react-hot-toast';

const Row = ({ label, children, highlight }) => (
  <tr className={cn('border-b border-dark-100 dark:border-dark-700', highlight && 'bg-primary-50/50 dark:bg-primary-900/10')}>
    <td className="py-3 px-4 text-sm font-semibold text-dark-600 dark:text-dark-400 w-32 sticky left-0 bg-white dark:bg-dark-800 z-10">
      {label}
    </td>
    {children}
  </tr>
);

const Cell = ({ children, className = '' }) => (
  <td className={cn('py-3 px-4 text-sm text-dark-800 dark:text-dark-200 text-center align-middle', className)}>
    {children}
  </td>
);

const ComparePage = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (compareList.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-primary-50 dark:bg-primary-900/20 rounded-full flex items-center justify-center mb-6">
          <GitCompare size={40} className="text-primary-400" />
        </div>
        <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-3">Nothing to compare</h2>
        <p className="text-dark-500 mb-8 text-center max-w-sm">
          Use the ⚖️ icon on product cards to add items here. You can compare up to 4 products.
        </p>
        <Link to="/shop" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50/50 dark:bg-dark-950 py-8">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="page-title">Compare Products</h1>
            <p className="text-dark-500 mt-1">Comparing {compareList.length} product{compareList.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={clearCompare} className="btn-secondary btn-sm gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
            <X size={14} /> Clear All
          </button>
        </div>

        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-dark-100 dark:border-dark-700">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-dark-500 w-32 sticky left-0 bg-white dark:bg-dark-800 z-10">
                    Product
                  </th>
                  {compareList.map(product => (
                    <th key={product._id} className="py-4 px-4 min-w-[200px]">
                      <div className="relative flex flex-col items-center gap-3">
                        <button
                          onClick={() => removeFromCompare(product._id)}
                          className="absolute -top-1 -right-1 w-6 h-6 bg-dark-100 dark:bg-dark-700 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 rounded-full flex items-center justify-center transition-colors"
                        >
                          <X size={12} />
                        </button>
                        <Link to={`/product/${product._id}`}>
                          <img
                            src={product.images?.[0]}
                            alt={product.name}
                            className="w-28 h-28 object-cover rounded-2xl border border-dark-100 dark:border-dark-700"
                          />
                        </Link>
                        <Link
                          to={`/product/${product._id}`}
                          className="text-sm font-semibold text-dark-900 dark:text-white hover:text-primary-600 text-center line-clamp-2"
                        >
                          {product.name}
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {/* Price */}
                <Row label="Price" highlight>
                  {compareList.map(p => (
                    <Cell key={p._id} className="font-black text-lg text-primary-600 dark:text-primary-400">
                      {formatPrice(p.discountedPrice || p.price)}
                      {p.discount > 0 && (
                        <div className="text-xs text-dark-400 line-through font-normal">
                          {formatPrice(p.price)}
                        </div>
                      )}
                    </Cell>
                  ))}
                </Row>

                {/* Discount */}
                <Row label="Discount">
                  {compareList.map(p => (
                    <Cell key={p._id}>
                      {p.discount > 0 ? (
                        <span className="badge bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold">
                          -{p.discount}%
                        </span>
                      ) : (
                        <Minus size={16} className="mx-auto text-dark-300" />
                      )}
                    </Cell>
                  ))}
                </Row>

                {/* Rating */}
                <Row label="Rating" highlight>
                  {compareList.map(p => (
                    <Cell key={p._id}>
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={13} className={i < Math.round(p.rating) ? 'text-amber-400' : 'text-dark-200'} fill="currentColor" />
                          ))}
                        </div>
                        <span className="text-sm font-bold">{p.rating?.toFixed(1)}</span>
                      </div>
                      <div className="text-xs text-dark-400">({p.numReviews} reviews)</div>
                    </Cell>
                  ))}
                </Row>

                {/* Brand */}
                <Row label="Brand">
                  {compareList.map(p => (
                    <Cell key={p._id} className="font-semibold">{p.brand}</Cell>
                  ))}
                </Row>

                {/* Stock */}
                <Row label="Availability" highlight>
                  {compareList.map(p => (
                    <Cell key={p._id}>
                      {p.stock === 0 ? (
                        <span className="badge badge-error">Out of Stock</span>
                      ) : p.stock <= 10 ? (
                        <span className="badge badge-warning">Only {p.stock} left</span>
                      ) : (
                        <span className="badge badge-success flex items-center gap-1 w-fit mx-auto">
                          <Check size={11} /> In Stock
                        </span>
                      )}
                    </Cell>
                  ))}
                </Row>

                {/* Colors */}
                <Row label="Colors">
                  {compareList.map(p => (
                    <Cell key={p._id}>
                      {p.colors?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.colors.slice(0, 4).map(c => (
                            <span key={c} className="text-xs bg-dark-100 dark:bg-dark-700 rounded-lg px-2 py-0.5">{c}</span>
                          ))}
                        </div>
                      ) : <Minus size={16} className="mx-auto text-dark-300" />}
                    </Cell>
                  ))}
                </Row>

                {/* Sizes */}
                <Row label="Sizes" highlight>
                  {compareList.map(p => (
                    <Cell key={p._id}>
                      {p.sizes?.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-center">
                          {p.sizes.slice(0, 4).map(s => (
                            <span key={s} className="text-xs bg-dark-100 dark:bg-dark-700 rounded-lg px-2 py-0.5">{s}</span>
                          ))}
                        </div>
                      ) : <Minus size={16} className="mx-auto text-dark-300" />}
                    </Cell>
                  ))}
                </Row>

                {/* Specs */}
                {compareList.some(p => p.specifications?.length > 0) && (
                  <Row label="Key Specs">
                    {compareList.map(p => (
                      <Cell key={p._id} className="text-left">
                        {p.specifications?.slice(0, 3).map(spec => (
                          <div key={spec.name} className="text-xs mb-1">
                            <span className="font-semibold text-dark-700 dark:text-dark-300">{spec.name}: </span>
                            <span className="text-dark-500 dark:text-dark-400">{spec.value}</span>
                          </div>
                        ))}
                      </Cell>
                    ))}
                  </Row>
                )}

                {/* Actions */}
                <Row label="Actions" highlight>
                  {compareList.map(p => (
                    <Cell key={p._id}>
                      <div className="flex flex-col gap-2 items-center">
                        <button
                          onClick={() => { addToCart(p, 1); toast.success('Added to cart!', { icon: '🛒' }); }}
                          disabled={p.stock === 0}
                          className="btn-primary btn-sm w-full disabled:opacity-50"
                        >
                          <ShoppingCart size={13} /> Add to Cart
                        </button>
                        <button
                          onClick={() => toggleWishlist(p)}
                          className={cn(
                            'btn-sm w-full flex items-center justify-center gap-1.5 rounded-xl px-3 py-1.5 border text-xs font-semibold transition-all',
                            isInWishlist(p._id)
                              ? 'border-red-300 bg-red-50 dark:bg-red-900/20 text-red-500'
                              : 'border-dark-200 dark:border-dark-600 text-dark-500 hover:border-red-300 hover:text-red-500'
                          )}
                        >
                          <Heart size={12} fill={isInWishlist(p._id) ? 'currentColor' : 'none'} />
                          {isInWishlist(p._id) ? 'Wishlisted' : 'Wishlist'}
                        </button>
                      </div>
                    </Cell>
                  ))}
                </Row>
              </tbody>
            </table>
          </div>
        </div>

        {compareList.length < 4 && (
          <div className="mt-6 text-center">
            <p className="text-dark-400 text-sm mb-3">Add up to {4 - compareList.length} more product{4 - compareList.length !== 1 ? 's' : ''} to compare</p>
            <Link to="/shop" className="btn-secondary btn-sm">
              <GitCompare size={14} /> Browse More Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComparePage;
