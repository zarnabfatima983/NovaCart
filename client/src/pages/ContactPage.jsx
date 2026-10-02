import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const CONTACT_INFO = [
  { icon: Mail,    title: 'Email Us',         value: 'support@novacart.shop',  sub: 'We reply within 2 hours' },
  { icon: Phone,   title: 'Call Us',           value: '+1 (800) 123-4567',     sub: 'Mon–Fri, 9am–6pm EST' },
  { icon: MapPin,  title: 'Visit Us',          value: '123 Commerce Ave, NY',  sub: 'New York, NY 10001' },
  { icon: Clock,   title: 'Support Hours',     value: '24 / 7',                sub: 'Chat support always on' },
];

const FAQ = [
  { q: 'How long does shipping take?',              a: 'Standard shipping takes 5–7 business days. Express shipping takes 2–3 business days. We also offer overnight shipping.' },
  { q: 'What is your return policy?',               a: 'We offer a 30-day hassle-free return policy. Items must be in original, unused condition. Return shipping is free for defective items.' },
  { q: 'How do I track my order?',                  a: 'Once your order ships, you will receive a tracking number via email. You can also view your order status in your dashboard.' },
  { q: 'Are my payment details secure?',            a: 'Absolutely. We use 256-bit SSL encryption and never store your full card details. All payments are processed through certified payment providers.' },
  { q: 'Can I change or cancel my order?',          a: 'You can cancel or modify your order within 1 hour of placing it. After that, please contact our support team.' },
  { q: 'Do you ship internationally?',              a: 'Yes! We ship to 30+ countries. International orders typically arrive within 10–21 business days depending on destination.' },
];

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setSent(true);
    setLoading(false);
    toast.success('Message sent! We\'ll get back to you shortly. 📬');
  };

  return (
    <div className="bg-white dark:bg-dark-950">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-950 via-dark-900 to-dark-950 py-20">
        <div className="container-main text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MessageCircle size={24} className="text-white" />
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl text-white mb-4">Get in Touch</h1>
            <p className="text-dark-300 text-lg max-w-xl mx-auto">
              Have a question, suggestion, or issue? Our team is here to help — typically within 2 hours.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact cards */}
      <section className="section-sm border-b border-dark-100 dark:border-dark-800">
        <div className="container-main">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CONTACT_INFO.map(({ icon: Icon, title, value, sub }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card p-5 text-center"
              >
                <div className="w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} className="text-primary-600 dark:text-primary-400" />
                </div>
                <p className="font-semibold text-dark-900 dark:text-white text-sm">{title}</p>
                <p className="text-dark-700 dark:text-dark-300 text-sm font-medium mt-1">{value}</p>
                <p className="text-dark-400 text-xs mt-0.5">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + FAQ */}
      <section className="section">
        <div className="container-main">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div>
              <h2 className="section-title mb-6">Send us a Message</h2>
              {sent ? (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="card p-10 text-center"
                >
                  <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} className="text-emerald-600" />
                  </div>
                  <h3 className="font-display font-bold text-xl text-dark-900 dark:text-white mb-2">Message Received!</h3>
                  <p className="text-dark-500 mb-6">Thank you for contacting us. A member of our team will respond to your email within 2 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }} className="btn-secondary btn-sm">
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="input-label">Full Name *</label>
                      <input
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="John Doe"
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="input-label">Email Address *</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="input-field"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="input-label">Subject *</label>
                    <select
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="input-field"
                      required
                    >
                      <option value="">Select a topic...</option>
                      <option>Order Issue</option>
                      <option>Returns & Refunds</option>
                      <option>Product Question</option>
                      <option>Technical Support</option>
                      <option>Partnership Inquiry</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label">Message *</label>
                    <textarea
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Describe your question or issue in detail..."
                      rows={5}
                      className="input-field resize-none"
                      required
                    />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary w-full btn-lg">
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <><Send size={18} /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* FAQ */}
            <div>
              <h2 className="section-title mb-6">Frequently Asked Questions</h2>
              <div className="space-y-3">
                {FAQ.map((item, i) => (
                  <div key={i} className="card overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-dark-50 dark:hover:bg-dark-700 transition-colors"
                    >
                      <span className="font-semibold text-dark-900 dark:text-white text-sm pr-4">{item.q}</span>
                      <span className={`text-xl font-bold text-primary-600 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                    </button>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="px-4 pb-4"
                      >
                        <p className="text-dark-500 dark:text-dark-400 text-sm leading-relaxed border-t border-dark-100 dark:border-dark-700 pt-3">{item.a}</p>
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
