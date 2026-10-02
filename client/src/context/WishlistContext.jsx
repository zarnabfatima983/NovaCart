import { createContext, useContext, useEffect, useState } from 'react';
import { wishlistAPI } from '../services/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [isAuthenticated]); // eslint-disable-line

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistAPI.get();
      setWishlist(res.wishlist || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  const toggleWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please log in to use wishlist');
      return;
    }
    try {
      const res = await wishlistAPI.toggle(product._id);
      setWishlist(res.wishlist || []);
      toast.success(res.message, {
        icon: res.inWishlist ? '❤️' : '💔',
      });
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => {
      const id = typeof item === 'object' ? item._id : item;
      return id === productId || id?.toString() === productId?.toString();
    });
  };

  const removeFromWishlist = async (productId) => {
    try {
      const res = await wishlistAPI.remove(productId);
      setWishlist(res.wishlist || []);
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <WishlistContext.Provider value={{
      wishlist, loading,
      toggleWishlist, isInWishlist, removeFromWishlist, fetchWishlist,
      wishlistCount: wishlist.length,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
};
