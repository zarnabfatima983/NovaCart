import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GitCompare, X } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';

const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  return (
    <AnimatePresence>
      {compareList.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-dark-900 dark:bg-dark-800 text-white rounded-2xl shadow-large px-4 py-3 flex items-center gap-3 border border-dark-700"
        >
          <div className="flex items-center gap-2 mr-2">
            <GitCompare size={16} className="text-primary-400" />
            <span className="text-sm font-medium">Compare ({compareList.length}/4)</span>
          </div>
          <div className="flex items-center gap-2">
            {compareList.map((p) => (
              <div key={p._id} className="relative group">
                <img src={p.images?.[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border-2 border-dark-600" />
                <button
                  onClick={() => removeFromCompare(p._id)}
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity flex"
                >
                  <X size={9} />
                </button>
              </div>
            ))}
          </div>
          {compareList.length >= 2 && (
            <Link to="/compare" className="btn-primary btn-sm whitespace-nowrap">Compare Now</Link>
          )}
          <button onClick={clearCompare} className="btn-ghost btn-sm text-dark-400 hover:text-white">
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompareBar;
