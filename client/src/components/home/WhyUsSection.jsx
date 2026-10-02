import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Headphones, Star, Package } from 'lucide-react';

const features = [
  { icon: Truck,       title: 'Fast Delivery',      desc: 'Free 2-day shipping on orders over $100. Express delivery available.' },
  { icon: Shield,      title: 'Secure Payments',    desc: 'Shop with confidence. All transactions are 256-bit SSL encrypted.' },
  { icon: RotateCcw,   title: 'Easy Returns',       desc: '30-day hassle-free return policy. No questions asked.' },
  { icon: Headphones,  title: '24/7 Support',       desc: 'Our expert team is available around the clock to help you.' },
  { icon: Star,        title: 'Verified Products',  desc: 'Every product is verified for quality and authenticity.' },
  { icon: Package,     title: 'Premium Packaging',  desc: 'Your orders arrive in premium eco-friendly packaging.' },
];

const WhyUsSection = () => (
  <section className="section bg-white dark:bg-dark-950">
    <div className="container-main">
      <div className="text-center mb-12">
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Why NOVA CART</p>
        <h2 className="section-title">Shopping Made Premium</h2>
        <p className="section-subtitle mx-auto text-center">We go beyond just selling products — we deliver an extraordinary experience.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map(({ icon: Icon, title, desc }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="group card card-hover p-6"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl flex items-center justify-center mb-4 group-hover:shadow-glow transition-shadow duration-300">
              <Icon size={22} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="font-display font-bold text-dark-900 dark:text-white mb-2">{title}</h3>
            <p className="text-dark-500 dark:text-dark-400 text-sm leading-relaxed">{desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyUsSection;
