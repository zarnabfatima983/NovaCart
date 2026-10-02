import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Zap, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const passwordChecks = [
  { label: 'At least 6 characters', test: (p) => p.length >= 6 },
  { label: 'Contains a number', test: (p) => /\d/.test(p) },
  { label: 'Contains a letter', test: (p) => /[a-zA-Z]/.test(p) },
];

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setLoading(true);
    const result = await register({ name: form.name, email: form.email, password: form.password });
    if (result.success) {
      toast.success('Account created! Welcome to NOVA CART 🎉');
      navigate('/');
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-dark-950 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
            <Zap size={20} className="text-white" fill="currentColor" />
          </div>
          <span className="font-display font-black text-2xl text-dark-900 dark:text-white">NOVA<span className="text-primary-600">CART</span></span>
        </div>

        <h1 className="font-display font-black text-2xl text-dark-900 dark:text-white mb-1 text-center">Create your account</h1>
        <p className="text-dark-500 dark:text-dark-400 mb-8 text-center">Join thousands of happy shoppers</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="input-label">Full Name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type="text" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="John Doe" className="input-field pl-10" required />
            </div>
          </div>

          <div>
            <label className="input-label">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className="input-field pl-10" required />
            </div>
          </div>

          <div>
            <label className="input-label">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))} placeholder="Min. 6 characters" className="input-field pl-10 pr-10" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-dark-400">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {/* Password strength */}
            {form.password && (
              <div className="mt-2 space-y-1">
                {passwordChecks.map(({ label, test }) => (
                  <div key={label} className={`flex items-center gap-2 text-xs ${test(form.password) ? 'text-emerald-600' : 'text-dark-400'}`}>
                    <Check size={11} /> {label}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="input-label">Confirm Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400" />
              <input type={showPassword ? 'text' : 'password'} value={form.confirm} onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))} placeholder="Repeat your password" className="input-field pl-10" required />
              {form.confirm && (
                <div className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full flex items-center justify-center ${form.password === form.confirm ? 'bg-emerald-500' : 'bg-red-400'}`}>
                  <Check size={10} className="text-white" />
                </div>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full btn-lg mt-2">
            {loading ? <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p className="text-center text-sm text-dark-500 dark:text-dark-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-primary-600 dark:text-primary-400 font-semibold hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
