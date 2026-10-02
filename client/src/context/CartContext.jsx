import { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/helpers';

const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find(
        (i) => i._id === action.payload._id && i.selectedColor === action.payload.selectedColor && i.selectedSize === action.payload.selectedSize
      );
      const items = existing
        ? state.items.map((i) =>
            i._id === existing._id && i.selectedColor === existing.selectedColor && i.selectedSize === existing.selectedSize
              ? { ...i, quantity: Math.min(i.quantity + action.payload.quantity, action.payload.stock) }
              : i
          )
        : [...state.items, action.payload];
      return { ...state, items };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => i.cartId !== action.payload) };
    case 'UPDATE_QUANTITY': {
      const items = state.items.map((i) =>
        i.cartId === action.payload.cartId ? { ...i, quantity: action.payload.quantity } : i
      );
      return { ...state, items };
    }
    case 'CLEAR_CART':     return { ...state, items: [], coupon: null };
    case 'APPLY_COUPON':   return { ...state, coupon: action.payload };
    case 'REMOVE_COUPON':  return { ...state, coupon: null };
    case 'LOAD_CART':      return { ...state, ...action.payload };
    default: return state;
  }
};

const initialState = {
  items: [],
  coupon: null,
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    const saved = storage.get('nova_cart');
    return saved || init;
  });

  // Persist to localStorage
  useEffect(() => {
    storage.set('nova_cart', state);
  }, [state]);

  const addToCart = (product, quantity = 1, selectedColor = null, selectedSize = null) => {
    const cartId = `${product._id}-${selectedColor || ''}-${selectedSize || ''}`;
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        cartId,
        _id: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        discount: product.discount,
        discountedPrice: product.discountedPrice,
        brand: product.brand,
        stock: product.stock,
        quantity,
        selectedColor,
        selectedSize,
      },
    });
  };

  const removeFromCart = (cartId) => dispatch({ type: 'REMOVE_ITEM', payload: cartId });

  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartId, quantity } });
  };

  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const applyCoupon = (coupon) => dispatch({ type: 'APPLY_COUPON', payload: coupon });
  const removeCoupon = () => dispatch({ type: 'REMOVE_COUPON' });

  // Computed values
  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = +state.items.reduce((sum, i) => sum + i.discountedPrice * i.quantity, 0).toFixed(2);
  const couponDiscount = state.coupon?.discountAmount || 0;
  const shippingCost = subtotal >= 100 ? 0 : 9.99;
  const taxRate = 0.09;
  const tax = +((subtotal - couponDiscount) * taxRate).toFixed(2);
  const total = +(subtotal - couponDiscount + shippingCost + tax).toFixed(2);

  const isInCart = (productId) => state.items.some((i) => i._id === productId);

  return (
    <CartContext.Provider value={{
      items: state.items,
      coupon: state.coupon,
      itemCount,
      subtotal,
      couponDiscount,
      shippingCost,
      tax,
      total,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyCoupon,
      removeCoupon,
      isInCart,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};
