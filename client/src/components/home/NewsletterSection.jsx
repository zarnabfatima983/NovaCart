import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success('You\'re subscribed! Welcome to NOVA CART. 🎉');
    setEmail('');
  };

  return (
    <section className="section bg-gradient-to-br from-primary-600 to-accent-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border-2 border-white"
            style={{
              width: `${(i + 1) * 120}px`, height: `${(i + 1) * 120}px`,
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        ))}
      </div>

      <div className="container-main relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Mail size={24} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4">
            Get Exclusive Deals
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Subscribe to our newsletter and get 20% off your first order, plus early access to flash sales and new arrivals.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
              <CheckCircle size={20} className="text-white" />
              <span className="text-white font-semibold">You're subscribed! Check your inbox.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/60 text-sm"
                required
              />
              <button
                type="submit"
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-primary-600 font-bold rounded-xl hover:bg-white/90 transition-colors whitespace-nowrap"
              >
                Subscribe
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          <p className="text-white/50 text-xs mt-4">
            No spam, unsubscribe anytime. We respect your privacy.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsletterSection;
