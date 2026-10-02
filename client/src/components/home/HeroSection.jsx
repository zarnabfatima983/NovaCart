import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, ShoppingBag, Sparkles, TrendingUp, Shield } from 'lucide-react';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
  'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=500&q=80',
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] } }),
};

const HeroSection = () => (
  <section className="relative overflow-hidden bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950 min-h-[88vh] flex items-center">
    {/* Background orbs */}
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary-600 rounded-full blur-3xl opacity-15"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.1, 0.2, 0.1] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-accent-600 rounded-full blur-3xl opacity-10"
      />
    </div>

    <div className="container-main relative z-10 py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — Text */}
        <div>
          {/* Badge */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-6"
          >
            <Sparkles size={14} className="text-primary-400" />
            <span>Premium Shopping Experience</span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.1}
            className="font-display font-black text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white leading-[1.1] mb-6"
          >
            Everything You{' '}
            <span className="text-gradient">Want.</span>
            <br />
            <span className="text-white/90">One Extraordinary</span>
            <br />
            <span className="text-gradient">Store.</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.2}
            className="text-dark-300 text-lg leading-relaxed mb-8 max-w-xl"
          >
            Discover curated products from the world's best brands. Smart search, fast delivery, and an unmatched shopping experience — all in one place.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.3}
            className="flex flex-wrap gap-4 mb-10"
          >
            <Link to="/shop" className="btn-primary btn-lg group">
              <ShoppingBag size={20} />
              Shop Collection
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/shop?isNewArrival=true" className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl transition-all duration-200 text-lg backdrop-blur-sm">
              <TrendingUp size={20} />
              New Arrivals
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={0.4}
            className="flex flex-wrap gap-8"
          >
            {[
              { value: '50K+', label: 'Products' },
              { value: '200K+', label: 'Customers' },
              { value: '4.9★', label: 'Avg Rating' },
              { value: '99%', label: 'Satisfaction' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-display font-black text-white">{value}</p>
                <p className="text-dark-400 text-sm">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Right — Product images */}
        <div className="relative hidden lg:flex items-center justify-center">
          {/* Central image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative z-20"
          >
            <div className="w-64 h-64 rounded-3xl overflow-hidden border-4 border-white/10 shadow-large">
              <img src={HERO_IMAGES[0]} alt="Featured product" className="w-full h-full object-cover" />
            </div>
            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -bottom-4 -left-4 glass rounded-2xl p-3 shadow-large"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber-400 rounded-xl flex items-center justify-center">
                  <Star size={14} className="text-white" fill="currentColor" />
                </div>
                <div>
                  <p className="text-xs font-bold text-dark-900 dark:text-white">Top Rated</p>
                  <p className="text-2xs text-dark-500">4.9 / 5.0</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Side image 1 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="absolute top-0 right-0 z-10"
          >
            <div className="w-44 h-44 rounded-2xl overflow-hidden border-2 border-white/10 shadow-medium">
              <img src={HERO_IMAGES[1]} alt="Product" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Side image 2 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="absolute bottom-0 right-8 z-10"
          >
            <div className="w-36 h-36 rounded-2xl overflow-hidden border-2 border-white/10 shadow-medium">
              <img src={HERO_IMAGES[2]} alt="Product" className="w-full h-full object-cover" />
            </div>
          </motion.div>

          {/* Floating card */}
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute top-8 left-0 glass rounded-2xl px-4 py-3 shadow-large"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Shield size={14} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark-900 dark:text-white">Secure</p>
                <p className="text-2xs text-dark-500">100% Guaranteed</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>

    {/* Wave divider */}
    <div className="absolute bottom-0 left-0 right-0">
      <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-white dark:text-dark-950">
        <path d="M0 60L1440 0V60H0Z" fill="currentColor" />
      </svg>
    </div>
  </section>
);

export default HeroSection;
