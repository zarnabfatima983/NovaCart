import { Link } from 'react-router-dom';
import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube, Linkedin, CreditCard, Shield, Truck, RotateCcw } from 'lucide-react';

const Footer = () => (
  <footer className="bg-dark-900 text-dark-300">
    {/* Trust bar */}
    <div className="border-b border-dark-700">
      <div className="container-main py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'On orders over $100' },
            { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
            { icon: Shield, title: 'Secure Payments', desc: 'SSL encrypted checkout' },
            { icon: Phone, title: '24/7 Support', desc: 'We\'re always here' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex items-center gap-3">
              <div className="w-10 h-10 bg-dark-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon size={18} className="text-primary-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-dark-400 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Main footer */}
    <div className="container-main py-14">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
        {/* Brand */}
        <div className="lg:col-span-2">
          <Link to="/" className="flex items-center gap-2.5 mb-5 group">
            <div className="w-9 h-9 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-glow">
              <Zap size={18} className="text-white" fill="currentColor" />
            </div>
            <span className="font-display font-black text-xl text-white">
              NOVA<span className="text-primary-400">CART</span>
            </span>
          </Link>
          <p className="text-dark-400 text-sm leading-relaxed mb-5 max-w-xs">
            Discover Better. Shop Smarter. Your premium destination for curated products across electronics, fashion, beauty, and more.
          </p>
          {/* Newsletter */}
          <div>
            <p className="text-white font-semibold text-sm mb-3">Get exclusive deals</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-xl text-sm text-white placeholder-dark-400 focus:outline-none focus:border-primary-500"
              />
              <button className="btn-primary btn-sm whitespace-nowrap">Subscribe</button>
            </div>
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Shop</h4>
          <ul className="space-y-2.5">
            {[
              { to: '/shop', label: 'All Products' },
              { to: '/shop?isNewArrival=true', label: 'New Arrivals' },
              { to: '/shop?isFeatured=true', label: 'Featured' },
              { to: '/shop?isOnSale=true', label: 'Sale' },
              { to: '/shop?sort=popular', label: 'Best Sellers' },
            ].map(({ to, label }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-dark-400 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Account</h4>
          <ul className="space-y-2.5">
            {[
              { to: '/dashboard', label: 'My Account' },
              { to: '/dashboard/orders', label: 'Orders' },
              { to: '/wishlist', label: 'Wishlist' },
              { to: '/dashboard/profile', label: 'Settings' },
            ].map(({ to, label }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-dark-400 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold text-sm mb-4">Support</h4>
          <ul className="space-y-2.5">
            {[
              { to: '/about', label: 'About Us' },
              { to: '/contact', label: 'Contact' },
              { to: '#', label: 'Privacy Policy' },
              { to: '#', label: 'Terms of Service' },
              { to: '#', label: 'Shipping Policy' },
            ].map(({ to, label }) => (
              <li key={label}>
                <Link to={to} className="text-sm text-dark-400 hover:text-white transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-dark-700">
      <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-dark-500 text-xs">© 2026 NOVA CART. All rights reserved.</p>
        <div className="flex items-center gap-3">
          {[
            { icon: Facebook, href: '#' },
            { icon: Twitter, href: '#' },
            { icon: Instagram, href: '#' },
            { icon: Youtube, href: '#' },
            { icon: Linkedin, href: '#' },
          ].map(({ icon: Icon, href }) => (
            <a key={href + Icon.displayName} href={href} className="w-8 h-8 bg-dark-700 hover:bg-primary-600 rounded-lg flex items-center justify-center transition-colors">
              <Icon size={14} className="text-dark-300 hover:text-white" />
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2 text-dark-500 text-xs">
          <CreditCard size={14} />
          <span>Visa • Mastercard • PayPal • AmEx</span>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
