import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Bot, User, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { productAPI } from '../../services/api';

const QUICK_PROMPTS = [
  'Best headphones under $300',
  'Show me new arrivals',
  'What\'s on sale today?',
  'Top rated electronics',
];

// Rule-based response engine
const processQuery = async (query) => {
  const q = query.toLowerCase();
  let params = {};

  if (q.includes('sale') || q.includes('deal') || q.includes('discount')) params.isOnSale = 'true';
  if (q.includes('new') || q.includes('arrival') || q.includes('latest')) params.isNewArrival = 'true';
  if (q.includes('featured') || q.includes('popular') || q.includes('best seller')) params.isFeatured = 'true';
  if (q.includes('headphone') || q.includes('earphone') || q.includes('earbud')) params.keyword = 'headphone';
  if (q.includes('laptop') || q.includes('computer')) params.keyword = 'laptop';
  if (q.includes('phone') || q.includes('mobile')) params.keyword = 'phone';
  if (q.includes('watch')) params.keyword = 'watch';
  if (q.includes('shoe') || q.includes('sneaker') || q.includes('boot')) params.keyword = 'shoe';

  const under = q.match(/under \$?(\d+)/);
  const upto  = q.match(/up to \$?(\d+)/);
  const max   = (under?.[1] || upto?.[1]);
  if (max) params.maxPrice = max;

  const above = q.match(/over \$?(\d+)|above \$?(\d+)/);
  if (above) params.minPrice = above[1] || above[2];

  if (q.includes('rating') || q.includes('rated') || q.includes('best quality')) params.rating = 4;

  params.limit = 4;
  const res = await productAPI.getAll(params);
  return res;
};

const buildRoute = (query) => {
  const q = query.toLowerCase();
  const params = new URLSearchParams();
  if (q.includes('sale') || q.includes('deal')) params.set('isOnSale', 'true');
  if (q.includes('new') || q.includes('arrival')) params.set('isNewArrival', 'true');
  const under = q.match(/under \$?(\d+)/);
  if (under) params.set('maxPrice', under[1]);
  return `/shop?${params.toString()}`;
};

const AIAssistant = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I\'m your NOVA CART shopping assistant 🛍️ Ask me anything — "Show me headphones under $200" or "What\'s on sale?"' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await processQuery(text);
      const products = res.products || [];

      if (products.length === 0) {
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: 'I couldn\'t find specific products for that query. Try browsing our full shop!',
          action: { label: 'Browse Shop', href: '/shop' },
        }]);
      } else {
        setMessages((prev) => [...prev, {
          role: 'bot',
          text: `Found ${products.length} products for you! ✨`,
          products: products.slice(0, 4),
          action: { label: 'See All Results', href: buildRoute(text) },
        }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'bot', text: 'Oops! Something went wrong. Try again or browse the shop.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-primary-600 to-accent-600 text-white rounded-2xl shadow-glow-lg flex items-center justify-center"
        aria-label="AI Shopping Assistant"
      >
        <AnimatePresence mode="wait">
          {open
            ? <motion.div key="x"  initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X size={22} /></motion.div>
            : <motion.div key="ai" initial={{ rotate: 90, opacity: 0 }}  animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Sparkles size={22} /></motion.div>
          }
        </AnimatePresence>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-white dark:bg-dark-800 rounded-2xl shadow-large border border-dark-100 dark:border-dark-700 flex flex-col overflow-hidden"
            style={{ maxHeight: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-accent-600 px-4 py-3 flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">NOVA AI Assistant</p>
                <p className="text-white/70 text-xs">Always here to help</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ minHeight: 200 }}>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'bot' && (
                    <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot size={13} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[75%] ${msg.role === 'user' ? 'order-first' : ''}`}>
                    <div className={`px-3 py-2 rounded-xl text-sm ${msg.role === 'user' ? 'bg-primary-600 text-white ml-auto' : 'bg-dark-50 dark:bg-dark-700 text-dark-800 dark:text-dark-100'}`}>
                      {msg.text}
                    </div>
                    {msg.products && (
                      <div className="mt-2 grid grid-cols-2 gap-1.5">
                        {msg.products.map((p) => (
                          <button
                            key={p._id}
                            onClick={() => { navigate(`/product/${p._id}`); setOpen(false); }}
                            className="bg-white dark:bg-dark-700 border border-dark-100 dark:border-dark-600 rounded-lg p-1.5 text-left hover:border-primary-300 transition-colors"
                          >
                            <img src={p.images?.[0]} alt={p.name} className="w-full h-14 object-cover rounded-md mb-1" />
                            <p className="text-xs font-medium text-dark-800 dark:text-white line-clamp-1">{p.name}</p>
                            <p className="text-xs text-primary-600 font-bold">${p.discountedPrice?.toFixed(2)}</p>
                          </button>
                        ))}
                      </div>
                    )}
                    {msg.action && (
                      <button
                        onClick={() => { navigate(msg.action.href); setOpen(false); }}
                        className="mt-2 text-xs text-primary-600 dark:text-primary-400 font-medium hover:underline"
                      >
                        {msg.action.label} →
                      </button>
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-7 h-7 bg-dark-200 dark:bg-dark-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <User size={13} className="text-dark-600 dark:text-dark-300" />
                    </div>
                  )}
                </div>
              ))}
              {loading && (
                <div className="flex gap-2.5">
                  <div className="w-7 h-7 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center">
                    <Bot size={13} className="text-white" />
                  </div>
                  <div className="bg-dark-50 dark:bg-dark-700 rounded-xl px-4 py-3">
                    <Loader size={14} className="text-primary-500 animate-spin" />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-3 py-2 border-t border-dark-100 dark:border-dark-700 flex gap-1.5 overflow-x-auto no-scrollbar">
              {QUICK_PROMPTS.map((p) => (
                <button
                  key={p}
                  onClick={() => sendMessage(p)}
                  className="whitespace-nowrap text-xs px-2.5 py-1.5 bg-dark-50 dark:bg-dark-700 text-dark-600 dark:text-dark-300 rounded-lg hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 flex gap-2 border-t border-dark-100 dark:border-dark-700">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Ask me anything..."
                className="flex-1 input-field py-2 text-sm"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="btn-primary btn-sm px-3 disabled:opacity-50"
              >
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
