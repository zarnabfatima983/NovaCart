import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Shield, Truck, Star, Users, Package, ArrowRight, Heart } from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

const TEAM = [
  { name: 'Alex Chen', role: 'CEO & Co-Founder', avatar: 'A', bio: 'Passionate about reimagining the online shopping experience for the modern consumer.' },
  { name: 'Sarah Kim', role: 'CTO & Co-Founder', avatar: 'S', bio: 'Building the technology stack that powers a seamless, fast and reliable platform.' },
  { name: 'Marcus Rivera', role: 'Head of Design', avatar: 'M', bio: 'Crafting beautiful, intuitive interfaces that make shopping a genuine pleasure.' },
  { name: 'Priya Patel', role: 'Head of Operations', avatar: 'P', bio: 'Ensuring every order is fulfilled with precision, speed, and care.' },
];

const STATS = [
  { value: '50K+',   label: 'Products',          icon: Package },
  { value: '200K+',  label: 'Happy Customers',   icon: Users },
  { value: '4.9★',   label: 'Average Rating',    icon: Star },
  { value: '30+',    label: 'Countries Served',  icon: Truck },
];

const VALUES = [
  { icon: Shield, title: 'Trust & Transparency', desc: 'We are honest about pricing, shipping, and returns. No surprises, ever.' },
  { icon: Heart,  title: 'Customer First',        desc: 'Every decision we make is guided by how it impacts our customers.' },
  { icon: Zap,    title: 'Continuous Innovation', desc: 'We constantly improve our platform, our product selection, and our service.' },
  { icon: Star,   title: 'Premium Quality',       desc: 'We curate only products that meet our rigorous quality standards.' },
];

const AboutPage = () => (
  <div className="bg-white dark:bg-dark-950">
    {/* Hero */}
    <section className="relative bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950 py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-96 h-96 bg-primary-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-accent-600/10 rounded-full blur-3xl" />
      </div>
      <div className="container-main relative z-10 text-center">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 border border-primary-500/30 rounded-full text-primary-300 text-sm font-medium mb-6">
            <Zap size={14} className="text-primary-400" /> Our Story
          </div>
          <h1 className="font-display font-black text-4xl md:text-6xl text-white mb-6 leading-tight">
            We're Reinventing <br />
            <span className="text-gradient">Online Shopping</span>
          </h1>
          <p className="text-dark-300 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            NOVA CART was born from a simple belief: shopping online should be as enjoyable, trustworthy, and satisfying as the very best in-store experience.
          </p>
        </motion.div>
      </div>
    </section>

    {/* Stats */}
    <section className="section-sm border-b border-dark-100 dark:border-dark-800">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(({ value, label, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="text-center"
            >
              <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Icon size={22} className="text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-3xl font-display font-black text-dark-900 dark:text-white">{value}</p>
              <p className="text-dark-500 dark:text-dark-400 text-sm mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Mission */}
    <section className="section">
      <div className="container-main">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-3">Our Mission</p>
            <h2 className="section-title mb-5">Making Premium Shopping Accessible to Everyone</h2>
            <p className="text-dark-600 dark:text-dark-400 leading-relaxed mb-4">
              We started NOVA CART in 2023 with a clear mission: to create the world's most customer-centric online shopping platform. We believe that everyone deserves access to high-quality products, transparent pricing, and exceptional service.
            </p>
            <p className="text-dark-600 dark:text-dark-400 leading-relaxed mb-6">
              From meticulously curated product listings to our industry-leading return policy, every aspect of NOVA CART is designed with one question in mind: "How does this make our customer's life better?"
            </p>
            <Link to="/shop" className="btn-primary gap-2">
              Explore Our Collection <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=300&q=80',
              'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=300&q=80',
              'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&q=80',
              'https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=300&q=80',
            ].map((src, i) => (
              <div key={i} className={`rounded-2xl overflow-hidden ${i === 0 ? 'row-span-2' : ''}`}>
                <img src={src} alt="Products" className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>

    {/* Values */}
    <section className="section bg-dark-50/50 dark:bg-dark-900/50">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Our Values</p>
          <h2 className="section-title">What We Stand For</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="card p-6 text-center group"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-primary-50 to-accent-50 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-glow transition-shadow">
                <Icon size={24} className="text-primary-600 dark:text-primary-400" />
              </div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white mb-2">{title}</h3>
              <p className="text-dark-500 dark:text-dark-400 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="section">
      <div className="container-main">
        <div className="text-center mb-12">
          <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">The Team</p>
          <h2 className="section-title">Meet the People Behind NOVA CART</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM.map(({ name, role, avatar, bio }, i) => (
            <motion.div
              key={name}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={i}
              variants={fadeUp}
              className="card p-6 text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white font-black text-2xl shadow-glow">
                {avatar}
              </div>
              <h3 className="font-display font-bold text-dark-900 dark:text-white">{name}</h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-2">{role}</p>
              <p className="text-dark-500 dark:text-dark-400 text-sm leading-relaxed">{bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="section bg-gradient-to-br from-primary-600 to-accent-600">
      <div className="container-main text-center">
        <h2 className="text-3xl md:text-4xl font-display font-black text-white mb-4">Ready to start shopping?</h2>
        <p className="text-white/80 text-lg mb-8 max-w-xl mx-auto">
          Join over 200,000 happy customers who trust NOVA CART for their everyday shopping needs.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link to="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-primary-600 font-bold rounded-2xl hover:bg-white/90 transition-colors text-lg">
            <Package size={20} /> Shop Now
          </Link>
          <Link to="/register" className="inline-flex items-center gap-2 px-8 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold rounded-2xl transition-colors text-lg">
            Create Account
          </Link>
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
