import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon,
  ChevronDown, LogOut, LayoutDashboard, Package, Zap,
  Sparkles, Bell,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productAPI } from '../../services/api';
import { cn, debounce } from '../../utils/helpers';
import toast from 'react-hot-toast';

const navLinks = [
  { to: '/', label: 'Home', exact: true },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?isNewArrival=true', label: 'New Arrivals' },
  { to: '/shop?isOnSale=true', label: 'Deals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);

  const { isDark, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Scroll handler
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
        setSuggestions([]);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Search suggestions
  const fetchSuggestions = debounce(async (q) => {
    if (!q || q.length < 2) { setSuggestions([]); return; }
    setSearchLoading(true);
    try {
      const res = await productAPI.getSuggestions(q);
      setSuggestions(res.suggestions || []);
    } catch { setSuggestions([]); }
    finally { setSearchLoading(false); }
  }, 300);

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    fetchSuggestions(val);
  };

  const doSearch = (q = searchQuery) => {
    if (!q.trim()) return;
    navigate(`/shop?keyword=${encodeURIComponent(q.trim())}`);
    setSearchOpen(false);
    setSuggestions([]);
    setSearchQuery('');
  };

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <>
      {/* Announcement Bar */}
      <div className="bg-primary-600 text-white text-xs sm:text-sm py-2 text-center font-medium">
        <div className="flex items-center justify-center gap-4">
          <span className="hidden sm:inline">🚚 Free shipping on orders over $100</span>
          <span className="hidden md:inline">•</span>
          <span>✨ New collection just dropped — <Link to="/shop?isNewArrival=true" className="underline hover:no-underline">Shop New Arrivals</Link></span>
          <span className="hidden md:inline">•</span>
          <span className="hidden sm:inline">🎟️ Use code <strong>WELCOME20</strong> for 20% off</span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className={cn(
        'sticky top-0 z-40 transition-all duration-300',
        scrolled
          ? 'bg-white/95 dark:bg-dark-900/95 backdrop-blur-lg shadow-medium border-b border-dark-100 dark:border-dark-700'
          : 'bg-white dark:bg-dark-900 border-b border-dark-100 dark:border-dark-800'
      )}>
        <div className="container-main">
          <div className="flex items-center h-16 gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                <Zap size={18} className="text-white" fill="currentColor" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-black text-xl tracking-tight text-dark-900 dark:text-white">
                  NOVA<span className="text-primary-600">CART</span>
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1 ml-4">
              {navLinks.map(({ to, label, exact }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={exact}
                  className={({ isActive }) => cn(
                    'px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800'
                  )}
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex-1" />

            {/* Right side icons */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className={cn(
                    'btn-icon text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white',
                    searchOpen ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600' : 'hover:bg-dark-50 dark:hover:bg-dark-800'
                  )}
                  aria-label="Search"
                >
                  <Search size={20} />
                </button>

                <AnimatePresence>
                  {searchOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-80 md:w-96 bg-white dark:bg-dark-800 rounded-2xl shadow-large border border-dark-100 dark:border-dark-700 overflow-hidden"
                    >
                      <div className="p-3">
                        <div className="flex items-center gap-2 bg-dark-50 dark:bg-dark-700 rounded-xl px-3 py-2">
                          <Search size={16} className="text-dark-400" />
                          <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            onKeyDown={(e) => e.key === 'Enter' && doSearch()}
                            placeholder="Search products, brands..."
                            className="flex-1 bg-transparent text-sm text-dark-900 dark:text-white placeholder-dark-400 focus:outline-none"
                            autoFocus
                          />
                          {searchQuery && (
                            <button onClick={() => { setSearchQuery(''); setSuggestions([]); }}>
                              <X size={14} className="text-dark-400 hover:text-dark-600" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Suggestions */}
                      {suggestions.length > 0 && (
                        <div className="border-t border-dark-100 dark:border-dark-700">
                          {suggestions.map((s) => (
                            <button
                              key={s._id}
                              onClick={() => { navigate(`/product/${s._id}`); setSearchOpen(false); setSearchQuery(''); }}
                              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors text-left"
                            >
                              <img src={s.images?.[0]} alt={s.name} className="w-10 h-10 object-cover rounded-lg" />
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-dark-900 dark:text-white truncate">{s.name}</p>
                                <p className="text-xs text-dark-400">${s.discountedPrice?.toFixed(2)}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Popular searches */}
                      {!searchQuery && (
                        <div className="px-4 pb-4">
                          <p className="text-xs font-semibold text-dark-400 uppercase tracking-wide mb-2">Popular Searches</p>
                          <div className="flex flex-wrap gap-2">
                            {['Headphones', 'iPhone', 'Laptop', 'Watch', 'Sneakers'].map((t) => (
                              <button
                                key={t}
                                onClick={() => doSearch(t)}
                                className="px-3 py-1 bg-dark-50 dark:bg-dark-700 text-dark-600 dark:text-dark-300 rounded-lg text-xs hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggleTheme}
                className="btn-icon text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800"
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isDark ? 'dark' : 'light'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                  </motion.div>
                </AnimatePresence>
              </button>

              {/* Wishlist */}
              <Link
                to="/wishlist"
                className="btn-icon relative text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800"
                aria-label="Wishlist"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-2xs rounded-full flex items-center justify-center font-bold">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <Link
                to="/cart"
                className="btn-icon relative text-dark-600 dark:text-dark-300 hover:text-dark-900 dark:hover:text-white hover:bg-dark-50 dark:hover:bg-dark-800"
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-2xs rounded-full flex items-center justify-center font-bold"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </Link>

              {/* User */}
              <div ref={userMenuRef} className="relative">
                {isAuthenticated ? (
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-1.5 pl-1 pr-2 py-1 rounded-xl hover:bg-dark-50 dark:hover:bg-dark-800 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">{user?.name?.charAt(0)}</span>
                    </div>
                    <ChevronDown size={14} className="text-dark-400 hidden sm:block" />
                  </button>
                ) : (
                  <Link to="/login" className="btn-primary btn-sm hidden sm:flex">
                    Sign In
                  </Link>
                )}

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-52 bg-white dark:bg-dark-800 rounded-2xl shadow-large border border-dark-100 dark:border-dark-700 overflow-hidden py-2"
                    >
                      <div className="px-4 py-3 border-b border-dark-100 dark:border-dark-700">
                        <p className="font-semibold text-dark-900 dark:text-white text-sm">{user?.name}</p>
                        <p className="text-xs text-dark-400 truncate">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                        <LayoutDashboard size={16} /> My Account
                      </Link>
                      <Link to="/dashboard/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors">
                        <Package size={16} /> My Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors">
                          <Sparkles size={16} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-dark-100 dark:border-dark-700 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="btn-icon lg:hidden text-dark-600 dark:text-dark-300 hover:bg-dark-50 dark:hover:bg-dark-800"
                aria-label="Menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-dark-100 dark:border-dark-700 bg-white dark:bg-dark-900 overflow-hidden"
            >
              <nav className="container-main py-4 space-y-1">
                {navLinks.map(({ to, label }) => (
                  <NavLink
                    key={to}
                    to={to}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) => cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20'
                        : 'text-dark-600 dark:text-dark-300'
                    )}
                  >
                    {label}
                  </NavLink>
                ))}
                {!isAuthenticated && (
                  <div className="flex gap-2 pt-3">
                    <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 justify-center">Sign In</Link>
                    <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-secondary flex-1 justify-center">Register</Link>
                  </div>
                )}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
};

export default Navbar;
