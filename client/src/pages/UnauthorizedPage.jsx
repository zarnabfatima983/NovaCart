import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldOff, Home, ArrowLeft } from 'lucide-react';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white dark:bg-dark-950 flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <ShieldOff size={44} className="text-red-500" />
          </div>
          <h1 className="font-display font-black text-3xl text-dark-900 dark:text-white mb-4">
            Access Denied
          </h1>
          <p className="text-dark-500 dark:text-dark-400 text-lg mb-8 leading-relaxed">
            You don't have permission to access this page. If you believe this is a mistake, please contact support.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={() => navigate(-1)} className="btn-secondary btn-lg gap-2">
              <ArrowLeft size={18} /> Go Back
            </button>
            <Link to="/" className="btn-primary btn-lg gap-2">
              <Home size={18} /> Home
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;
