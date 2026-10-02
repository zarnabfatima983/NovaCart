import { motion } from 'framer-motion';
import { Star, CheckCircle, Quote } from 'lucide-react';

const REVIEWS = [
  { name: 'Sarah Johnson', location: 'New York, NY', avatar: 'S', rating: 5, date: 'September 2026', text: 'NOVA CART has completely changed how I shop online. The product quality is outstanding and they arrived two days earlier than expected. The packaging was beautiful too!', verified: true },
  { name: 'Michael Chen', location: 'San Francisco, CA', avatar: 'M', rating: 5, date: 'August 2026', text: 'I was skeptical at first, but this platform has genuinely impressed me. The search and filter tools are incredibly intuitive. Found exactly what I needed in seconds.', verified: true },
  { name: 'Emma Williams', location: 'Chicago, IL', avatar: 'E', rating: 5, date: 'September 2026', text: 'The customer service team is phenomenal. Had a small issue with my order and they resolved it within hours. Will definitely be a repeat customer!', verified: true },
  { name: 'James Rodriguez', location: 'Austin, TX', avatar: 'J', rating: 4, date: 'July 2026', text: 'Amazing product selection across all categories. The recommendation engine is spot-on — it suggested items I didn\'t know I needed but absolutely love now.', verified: false },
  { name: 'Olivia Martinez', location: 'Miami, FL', avatar: 'O', rating: 5, date: 'August 2026', text: 'The compare feature is a game-changer. I was able to compare three laptops side by side and make an informed decision. Saved me hours of research!', verified: true },
  { name: 'David Thompson', location: 'Seattle, WA', avatar: 'D', rating: 5, date: 'September 2026', text: 'Free shipping over $100 is fantastic. I love how the cart shows me exactly how much more I need for free shipping. Very clever and user-friendly design.', verified: true },
];

const TestimonialsSection = () => (
  <section className="section bg-dark-50/50 dark:bg-dark-900/50">
    <div className="container-main">
      <div className="text-center mb-12">
        <p className="text-primary-600 font-semibold text-sm uppercase tracking-widest mb-2">Testimonials</p>
        <h2 className="section-title">What Our Customers Say</h2>
        <p className="section-subtitle mx-auto text-center">Thousands of happy customers trust NOVA CART for their shopping needs.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REVIEWS.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="card p-6 relative overflow-hidden"
          >
            {/* Quote icon */}
            <div className="absolute top-4 right-4 opacity-5">
              <Quote size={48} />
            </div>
            {/* Stars */}
            <div className="flex items-center gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < review.rating ? 'text-amber-400' : 'text-dark-200'} fill="currentColor" />
              ))}
            </div>
            {/* Review text */}
            <p className="text-dark-600 dark:text-dark-300 text-sm leading-relaxed mb-5 line-clamp-3">"{review.text}"</p>
            {/* Reviewer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">{review.avatar}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-semibold text-dark-900 dark:text-white text-sm">{review.name}</p>
                  {review.verified && <CheckCircle size={13} className="text-emerald-500 flex-shrink-0" />}
                </div>
                <p className="text-dark-400 text-xs">{review.location} · {review.date}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
