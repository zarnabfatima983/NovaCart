import { createContext, useContext, useState } from 'react';
import toast from 'react-hot-toast';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState([]);

  const addToCompare = (product) => {
    if (compareList.length >= 4) {
      toast.error('You can compare up to 4 products at a time');
      return;
    }
    if (compareList.some((p) => p._id === product._id)) {
      toast('Product already in comparison', { icon: 'ℹ️' });
      return;
    }
    setCompareList((prev) => [...prev, product]);
    toast.success('Added to comparison', { icon: '⚖️' });
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((p) => p._id !== productId));
  };

  const clearCompare = () => setCompareList([]);

  const isInCompare = (productId) => compareList.some((p) => p._id === productId);

  return (
    <CompareContext.Provider value={{
      compareList,
      addToCompare,
      removeFromCompare,
      clearCompare,
      isInCompare,
      compareCount: compareList.length,
    }}>
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error('useCompare must be used within CompareProvider');
  return ctx;
};
