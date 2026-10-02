import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, Plus, Minus, Heart, Tag, ArrowRight, Package, Shield, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { couponAPI } from '../services/api';
import { formatPrice, cn } from '../utils/helpers';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { items, subtotal, coupon, couponDiscount, shippingCost, tax, total, updateQuantity, removeFromCart, applyCoupon, removeCoupon, clearCart } = useCart();
  const { toggleWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!isAuthenticated) { toast.error('Please login to use coupons'); return; }
    setCouponLoading(true);
    try {
      const res = await couponAPI.validate({ code: couponCode, orderTotal: subtotal });
      applyCoupon(res.coupon);
      toast.success(`Coupon applied! You save ${formatPrice(res.coupon.discountAmount)}`);
      setCouponCode('');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCouponLoading(false);
    }
  };

  const FREE_SHIPPING_THRESHOLD = 100;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-20 px-4">
        <div className="w-24 h-24 bg-dark-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart size={40} className="text-dark-300 dark:text-dark-600" />
        </div>
        <h2 className="text-2xl font-display font-bold text-dark-900 dark:text-white mb-3">Your cart is empty</h2>
        <p className="text-dark-500 dark:text-dark-400 mb-8 text-center max-w-sm">Looks like you haven't added anything to your cart yet. Start shopping!</p>
        <Link to="/shop" className="btn-primary btn-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-50/50 dark:bg-dark-950 py-8">
      <div className="container-main">
        <div className="flex items-center justify-between mb-8">
          <h1 className="page-title">Shopping Cart <span className="text-primary-600 ml-2">({items.length})</span></h1>
          <button onClick={clearCart} className="text-sm text-red-500 hover:text-red-600 flex items-center gap-1">
            <Trash2 size={14} /> Clear Cart
          </button>
        </div>

        {/* Free shipping bar */}
        {remaining > 0 && (
          <div className="card p-4 mb-6 border-l-4 border-primary-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-dark-700 dark:text-dark-300">
                <span className="text-primary-600 font-bold">Add {formatPrice(remaining)}</span> more to unlock FREE Shipping!
              </p>
              <Truck size={16} className="text-primary-600" />
            </div>
            <div className="h-2 bg-dark-100 dark:bg-dark-700 rounded-full overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.6 }} className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full" />
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.cartId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="card p-4 sm:p-5"
                >
                  <div className="flex gap-4">
                    {/* Image */}
                    <Link to={`/product/${item._id}`} className="flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl" />
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to={`/product/${item._id}`} className="font-semibold text-dark-900 dark:text-white text-sm hover:text-primary-600 line-clamp-2">{item.name}</Link>
                          <p className="text-xs text-dark-400 mt-0.5">{item.brand}</p>
                          {(item.selectedColor || item.selectedSize) && (
                            <p className="text-xs text-dark-400 mt-1">
                              {[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}
                            </p>
                          )}
                        </div>
                        <button onClick={() => removeFromCart(item.cartId)} className="text-dark-400 hover:text-red-500 transition-colors flex-shrink-0 p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-3 gap-4 flex-wrap">
                        {/* Qty */}
                        <div className="flex items-center border border-dark-200 dark:border-dark-600 rounded-xl overflow-hidden">
                          <button onClick={() => item.quantity === 1 ? removeFromCart(item.cartId) : updateQuantity(item.cartId, item.quantity - 1)} className="w-9 h-9 flex items-center justify-center hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-dark-700 dark:text-dark-300">
                            {item.quantity === 1 ? <Trash2 size={13} className="text-red-400" /> : <Minus size={13} />}
                          </button>
                          <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} disabled={item.quantity >= item.stock} className="w-9 h-9 flex items-center justify-center hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-dark-700 dark:text-dark-300 disabled:opacity-40">
                            <Plus size={13} />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="font-bold text-dark-900 dark:text-white">{formatPrice(item.discountedPrice * item.quantity)}</p>
                          {item.discount > 0 && <p className="text-xs text-dark-400 line-through">{formatPrice(item.price * item.quantity)}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to="/shop" className="btn-ghost w-full justify-center border border-dark-200 dark:border-dark-700">
              ← Continue Shopping
            </Link>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-24">
              <h2 className="font-display font-bold text-dark-900 dark:text-white text-lg mb-5">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-5">
                {coupon ? (
                  <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-200 dark:border-emerald-800">
                    <div className="flex items-center gap-2">
                      <Tag size={14} className="text-emerald-600" />
                      <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{coupon.code}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-emerald-600 font-bold">-{formatPrice(coupon.discountAmount)}</span>
                      <button onClick={removeCoupon} className="text-dark-400 hover:text-red-500 transition-colors text-lg leading-none">×</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Coupon code"
                      className="input-field flex-1"
                      onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                    />
                    <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode} className="btn-primary btn-sm disabled:opacity-50">
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Line items */}
              <div className="space-y-3 text-sm mb-5">
                <div className="flex justify-between">
                  <span className="text-dark-500 dark:text-dark-400">Subtotal</span>
                  <span className="font-medium text-dark-900 dark:text-white">{formatPrice(subtotal)}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Coupon Discount</span>
                    <span className="font-medium">-{formatPrice(couponDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-dark-500 dark:text-dark-400">Shipping</span>
                  <span className={cn('font-medium', shippingCost === 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-dark-900 dark:text-white')}>
                    {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dark-500 dark:text-dark-400">Tax (9%)</span>
                  <span className="font-medium text-dark-900 dark:text-white">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-dark-100 dark:border-dark-700 pt-3 flex justify-between">
                  <span className="font-bold text-dark-900 dark:text-white text-base">Total</span>
                  <span className="font-black text-xl text-primary-600 dark:text-primary-400">{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => isAuthenticated ? navigate('/checkout') : navigate('/login', { state: { from: '/checkout' } })}
                className="btn-primary w-full btn-lg mb-3"
              >
                {isAuthenticated ? 'Proceed to Checkout' : 'Sign In to Checkout'}
                <ArrowRight size={18} />
              </button>

              {/* Trust badges */}
              <div className="flex items-center justify-center gap-4 pt-3 border-t border-dark-100 dark:border-dark-700">
                {[{ icon: Shield, text: 'Secure' }, { icon: Package, text: 'Insured' }, { icon: Truck, text: 'Fast' }].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-1 text-xs text-dark-400">
                    <Icon size={12} />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
