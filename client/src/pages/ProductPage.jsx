import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Star, Shield, Truck, RotateCcw, ChevronRight,
  Minus, Plus, Share2, GitCompare, Check, ZoomIn, Package,
} from 'lucide-react';
import { productAPI, reviewAPI, userAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, cn, formatDate, storage } from '../utils/helpers';
import { InteractiveStarRating } from '../components/common/StarRating';
import ProductCard from '../components/common/ProductCard';
import toast from 'react-hot-toast';

const TABS = ['Description', 'Specifications', 'Reviews', 'Shipping', 'Returns'];

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart, isInCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Description');
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [addedToCart, setAddedToCart] = useState(false);

  // Review form
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]); // eslint-disable-line

  const loadProduct = async () => {
    setLoading(true);
    try {
      const [pRes, revRes] = await Promise.all([
        productAPI.getById(id),
        reviewAPI.getByProduct(id, { limit: 10 }),
      ]);

      const p = pRes.product;
      setProduct(p);
      setSelectedColor(p.colors?.[0] || null);
      setReviews(revRes.reviews || []);

      // Track recently viewed
      if (isAuthenticated) {
        userAPI.addRecentlyViewed(p._id).catch(() => {});
      } else {
        const viewed = storage.get('nova_recently_viewed', []);
        const filtered = viewed.filter((v) => v._id !== p._id);
        storage.set('nova_recently_viewed', [p, ...filtered].slice(0, 10));
      }

      // Load related
      const relRes = await productAPI.getRelated(p._id);
      setRelatedProducts(relRes.products || []);
    } catch {
      navigate('/404');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedColor, selectedSize);
    setAddedToCart(true);
    toast.success('Added to cart!', { icon: '🛒' });
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please login to submit a review'); return; }
    if (!reviewForm.comment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await reviewAPI.create({ product: product._id, ...reviewForm });
      setReviews((prev) => [res.review, ...prev]);
      setReviewForm({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="container-main py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="skeleton aspect-square rounded-2xl" />
            <div className="flex gap-3">{[...Array(4)].map((_, i) => <div key={i} className="skeleton w-20 h-20 rounded-xl" />)}</div>
          </div>
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded-xl" />
            <div className="skeleton h-6 w-1/4 rounded-xl" />
            <div className="skeleton h-10 w-1/3 rounded-xl" />
            <div className="skeleton h-32 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const { name, brand, images, price, discount, discountedPrice, rating, numReviews, stock, description, colors, sizes, specifications, isNewArrival, category } = product;

  const stockStatus = stock === 0 ? 'Out of Stock' : stock <= 10 ? `Only ${stock} left` : 'In Stock';
  const stockColor  = stock === 0 ? 'text-red-500' : stock <= 10 ? 'text-amber-600' : 'text-emerald-600';

  return (
    <div className="bg-white dark:bg-dark-950 min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-dark-100 dark:border-dark-800 py-3">
        <div className="container-main">
          <div className="flex items-center gap-2 text-sm text-dark-400">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <ChevronRight size={14} />
            <Link to="/shop" className="hover:text-primary-600">Shop</Link>
            {category && (
              <>
                <ChevronRight size={14} />
                <Link to={`/shop/${category.slug}`} className="hover:text-primary-600">{category.name}</Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-dark-700 dark:text-dark-300 truncate max-w-xs">{name}</span>
          </div>
        </div>
      </div>

      <div className="container-main py-10">
        {/* Main product */}
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 mb-16">
          {/* Images */}
          <div>
            <div className="relative bg-dark-50 dark:bg-dark-800 rounded-3xl overflow-hidden aspect-square mb-4 group">
              <img
                src={images?.[activeImg] || images?.[0]}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {discount > 0 && <div className="absolute top-4 left-4 badge bg-red-500 text-white font-bold text-sm px-3 py-1">-{discount}% OFF</div>}
              {isNewArrival && <div className="absolute top-4 right-4 badge bg-emerald-500 text-white font-bold">New</div>}
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar">
              {images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={cn('flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200', activeImg === i ? 'border-primary-500 shadow-glow' : 'border-dark-200 dark:border-dark-600 hover:border-primary-300')}
                >
                  <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <div className="flex items-start justify-between gap-4 mb-1">
              <p className="text-sm font-bold text-primary-600 uppercase tracking-widest">{brand}</p>
              <div className="flex items-center gap-2">
                <button onClick={() => addToCompare(product)} className="btn-ghost btn-sm p-2" title="Compare">
                  <GitCompare size={16} className="text-dark-500" />
                </button>
                <button className="btn-ghost btn-sm p-2" title="Share">
                  <Share2 size={16} className="text-dark-500" />
                </button>
              </div>
            </div>

            <h1 className="font-display font-black text-2xl md:text-3xl text-dark-900 dark:text-white mb-3 leading-tight">{name}</h1>

            {/* Rating */}
            {numReviews > 0 && (
              <div className="flex items-center gap-3 mb-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={i < Math.round(rating) ? 'text-amber-400' : 'text-dark-200'} fill="currentColor" />
                  ))}
                </div>
                <span className="font-bold text-dark-700 dark:text-dark-300 text-sm">{rating}</span>
                <button onClick={() => setActiveTab('Reviews')} className="text-sm text-primary-600 hover:underline">
                  {numReviews} reviews
                </button>
              </div>
            )}

            {/* Price */}
            <div className="flex items-center gap-4 mb-5">
              <span className="text-3xl font-black text-dark-900 dark:text-white">{formatPrice(discountedPrice || price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-lg text-dark-400 line-through">{formatPrice(price)}</span>
                  <span className="badge badge-error text-sm font-bold">Save {formatPrice(price - discountedPrice)}</span>
                </>
              )}
            </div>

            {/* Stock */}
            <p className={cn('text-sm font-semibold mb-5 flex items-center gap-1.5', stockColor)}>
              <Package size={14} /> {stockStatus}
            </p>

            <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed mb-6">{description?.slice(0, 200)}{description?.length > 200 ? '...' : ''}</p>

            {/* Colors */}
            {colors && colors.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-dark-800 dark:text-dark-200 mb-2">Color: <span className="font-normal text-dark-500">{selectedColor}</span></p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setSelectedColor(c)}
                      className={cn('px-4 py-2 rounded-xl border text-sm font-medium transition-all', selectedColor === c ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 shadow-glow' : 'border-dark-200 dark:border-dark-600 text-dark-600 dark:text-dark-400 hover:border-primary-300')}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes && sizes.length > 0 && (
              <div className="mb-5">
                <p className="text-sm font-semibold text-dark-800 dark:text-dark-200 mb-2">Size</p>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={cn('min-w-[3rem] h-10 px-3 rounded-xl border text-sm font-medium transition-all', selectedSize === s ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 shadow-glow' : 'border-dark-200 dark:border-dark-600 text-dark-600 dark:text-dark-400 hover:border-primary-300')}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity + Actions */}
            <div className="flex items-center gap-4 mb-5">
              <div className="flex items-center border-2 border-dark-200 dark:border-dark-600 rounded-xl overflow-hidden">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-11 h-11 flex items-center justify-center hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors text-dark-700 dark:text-dark-300 text-xl font-bold">
                  <Minus size={16} />
                </button>
                <span className="w-12 text-center font-bold text-dark-900 dark:text-white">{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(stock, q + 1))} className="w-11 h-11 flex items-center justify-center hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors text-dark-700 dark:text-dark-300 text-xl font-bold">
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => toggleWishlist(product)}
                className={cn('w-11 h-11 rounded-xl border-2 flex items-center justify-center transition-all', isInWishlist(product._id) ? 'border-red-400 bg-red-50 dark:bg-red-900/20 text-red-500' : 'border-dark-200 dark:border-dark-600 text-dark-500 hover:border-red-400 hover:text-red-500')}
              >
                <Heart size={18} fill={isInWishlist(product._id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={stock === 0}
                className={cn('btn-primary flex-1', addedToCart && '!bg-emerald-600')}
              >
                {addedToCart ? <><Check size={18} /> Added!</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>
              <button
                onClick={handleBuyNow}
                disabled={stock === 0}
                className="btn-outline flex-1"
              >
                Buy Now
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl">
              {[
                { icon: Shield, text: 'Secure Payment' },
                { icon: Truck, text: 'Fast Shipping' },
                { icon: RotateCcw, text: '30-Day Return' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex flex-col items-center gap-1.5 text-center">
                  <Icon size={18} className="text-primary-600" />
                  <span className="text-xs text-dark-500 dark:text-dark-400 font-medium">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-16">
          <div className="flex gap-1 border-b border-dark-100 dark:border-dark-700 mb-8 overflow-x-auto no-scrollbar">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn('px-5 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px', activeTab === tab ? 'border-primary-600 text-primary-600 dark:text-primary-400' : 'border-transparent text-dark-500 dark:text-dark-400 hover:text-dark-800 dark:hover:text-dark-200')}
              >
                {tab} {tab === 'Reviews' && `(${reviews.length})`}
              </button>
            ))}
          </div>

          <div className="max-w-3xl">
            {activeTab === 'Description' && (
              <div className="prose dark:prose-invert prose-sm max-w-none text-dark-600 dark:text-dark-400 leading-relaxed">
                {description}
              </div>
            )}

            {activeTab === 'Specifications' && (
              <div className="grid sm:grid-cols-2 gap-3">
                {specifications?.map(({ name: n, value }) => (
                  <div key={n} className="flex items-start gap-3 p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                    <span className="text-sm font-semibold text-dark-700 dark:text-dark-300 flex-shrink-0 w-32">{n}</span>
                    <span className="text-sm text-dark-500 dark:text-dark-400">{value}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Reviews' && (
              <div>
                {/* Write review */}
                {isAuthenticated && (
                  <form onSubmit={handleReviewSubmit} className="card p-6 mb-8">
                    <h3 className="font-display font-bold text-dark-900 dark:text-white mb-4">Write a Review</h3>
                    <div className="mb-4">
                      <p className="input-label">Your Rating</p>
                      <InteractiveStarRating value={reviewForm.rating} onChange={(r) => setReviewForm((f) => ({ ...f, rating: r }))} />
                    </div>
                    <div className="mb-4">
                      <label className="input-label">Title</label>
                      <input type="text" value={reviewForm.title} onChange={(e) => setReviewForm((f) => ({ ...f, title: e.target.value }))} className="input-field" placeholder="Summarize your review" />
                    </div>
                    <div className="mb-4">
                      <label className="input-label">Review *</label>
                      <textarea value={reviewForm.comment} onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))} className="input-field resize-none" rows={4} placeholder="Share your experience..." required />
                    </div>
                    <button type="submit" disabled={submittingReview} className="btn-primary">
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                )}

                {reviews.length === 0 ? (
                  <div className="text-center py-10 text-dark-400">
                    <Star size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((rev) => (
                      <div key={rev._id} className="card p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">{rev.user?.name?.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold text-dark-900 dark:text-white text-sm">{rev.user?.name}</p>
                              <div className="flex items-center gap-2">
                                <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={11} className={i < rev.rating ? 'text-amber-400' : 'text-dark-200'} fill="currentColor" />)}</div>
                                {rev.isVerifiedPurchase && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><Check size={10} /> Verified</span>}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs text-dark-400">{formatDate(rev.createdAt)}</span>
                        </div>
                        {rev.title && <p className="font-semibold text-dark-800 dark:text-dark-200 mt-3 text-sm">{rev.title}</p>}
                        <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed mt-1">{rev.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Shipping' && (
              <div className="space-y-4">
                {[
                  { title: 'Standard Shipping', desc: '5-7 business days · Free on orders over $100 · $9.99 otherwise' },
                  { title: 'Express Shipping', desc: '2-3 business days · $14.99' },
                  { title: 'Overnight Shipping', desc: '1 business day · $29.99' },
                  { title: 'International Shipping', desc: '10-21 business days · Rates vary by destination' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl">
                    <Truck size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white text-sm">{title}</p>
                      <p className="text-dark-500 dark:text-dark-400 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'Returns' && (
              <div className="space-y-4">
                <p className="text-dark-600 dark:text-dark-400 text-sm leading-relaxed">We want you to be completely satisfied with your purchase. If you're not happy, we'll make it right.</p>
                {[
                  { title: '30-Day Return Window', desc: 'Items can be returned within 30 days of delivery in original, unused condition.' },
                  { title: 'Free Return Shipping', desc: 'We cover return shipping for defective or incorrect items.' },
                  { title: 'Fast Refunds', desc: 'Refunds are processed within 3-5 business days of receiving your return.' },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-4 p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl">
                    <RotateCcw size={20} className="text-primary-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-dark-900 dark:text-white text-sm">{title}</p>
                      <p className="text-dark-500 dark:text-dark-400 text-sm">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="section-title mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
