const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const colors = require('colors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');

dotenv.config();

connectDB();

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? process.env.CLIENT_URL
      ? process.env.CLIENT_URL.split(',').map(o => o.trim())
      : true
    : 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'NOVA CART API is running 🚀', env: process.env.NODE_ENV });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Error handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`\n🚀 NOVA CART Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold);
  console.log(`📡 API: http://localhost:${PORT}/api`.cyan);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.log(`Error: ${err.message}`.red.bold);
  server.close(() => process.exit(1));
});
