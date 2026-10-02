import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Zap, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login({ email: form.email, password: form.password });
    if (result.success) {
      toast.success('Welcome back! 👋');
      navigate(from, { replace: true });
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  const fillDemo = (role) => {
    if (role === 'admin') setForm((f) => ({ ...f, email: 'admin@novacart.com', password: 'admin123' }));
    else setForm((f) => ({ ...f, email: 'sarah@example.com', password: 'password123' }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent-600/10 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Zap size={28} className="text-white" fill="currentColor" />
          </div>
          <h2 className="font-display font-black text-4xl text-white mb-4">NOVA CART</h2>
          <p className="text-dark-300 text-lg mb-8">Discover Better. Shop Smarter.</p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {['50K+ Products', '200K+ Customers', 'Free Shipping', 'Easy Returns'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-dark-300 text-sm">
                <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-dark-950">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2 mb-8 lg:hidden">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
              <Zap size={20} className="text-white" fill="currentColor" />
            </div>
            <span className="font-display font-black text-2xl text-dark-900 dark:text-white">NOVA<span className="text-primary-600">CART</span></span>
          </div>

          <h1 className="font-display font-black text-2xl text-dark-900 dark:text-white mb-1">Welcome back</h1>
          <p className="text-dark-500 dark:text-dark-400 mb-8">Sign in to your account to continue</p>

          {/* Demo credentials */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
            <button onClick={() => fillDemo('customer')} className="text-xs p-2 bg-white dark:bg-dark-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors text-dark-600 dark:text-dark-300 text-center font-medium">
              👤 Demo Customer
            </button>
            <button onClick={() => fillDemo('admin')} className="text-xs p-2 bg-white dark:bg-dark-700 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors text-dark-600 dark:text-dark-300 text-center font-medium">
              🛡️ Demo Admin
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="input-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  className="input-field pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <label className="input-label">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  className="input-field pl-10 pr-10"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-600">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.remember} onChange={(e) => setForm((f) => ({ ...f, remember: e.target.checked }))} className="rounded text-primary-600" />
                <span className="text-sm text-dark-600 dark:text-dark-400">Remember me</span>
              </label>
              <Link to="#" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 font-medium">Forgot password?</Link>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
              {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-dark-500 dark:text-dark-400 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Create account</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
