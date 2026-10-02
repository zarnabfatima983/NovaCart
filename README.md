# NOVA CART — Full-Stack E-Commerce Platform

> **"Discover Better. Shop Smarter."**

A production-style full-stack e-commerce platform featuring secure authentication, product discovery, smart recommendations, wishlist, product comparison, shopping cart, multi-step checkout, order management, inventory management, and an analytics-powered admin dashboard.

![NOVA CART Banner](https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80)

---

## 🚀 Live Demo

| Role     | Email                    | Password      |
|----------|--------------------------|---------------|
| Admin    | admin@novacart.com       | admin123      |
| Customer | sarah@example.com        | password123   |

---

## ✨ Features

### Customer Features
- 🛍️ **Product Discovery** — Browse 40+ products across 8 categories with smart filtering & sorting
- 🔍 **Smart Search** — Real-time suggestions, popular searches, search by name/brand/description
- 💡 **AI Shopping Assistant** — Floating chat assistant with rule-based product recommendations
- ❤️ **Wishlist** — Persistent wishlist for logged-in users with move-to-cart
- ⚖️ **Product Comparison** — Side-by-side comparison of up to 4 products
- 🛒 **Shopping Cart** — Persistent cart with quantity controls, coupon codes, and free-shipping progress bar
- 📦 **Multi-Step Checkout** — 4-step checkout: Information → Shipping → Payment → Review
- 🎟️ **Coupon System** — Percentage & fixed discounts with expiry dates and minimum order values
- 📋 **User Dashboard** — Orders, wishlist, profile, recently viewed products
- 👁️ **Quick View** — Preview product details in a modal without leaving the shop page
- 🌗 **Dark / Light Mode** — Elegant theme toggle with system preference detection
- 📱 **Fully Responsive** — Optimized layouts for mobile, tablet, and desktop

### Admin Features
- 📊 **Analytics Dashboard** — Revenue charts, order trends, customer growth (powered by Recharts)
- 📦 **Product Management** — Full CRUD: create/edit/delete products with images, specs, colors, sizes
- 🏷️ **Category Management** — Create and manage product categories with icons and colors
- 🛒 **Order Management** — View all orders, update status, view customer details
- 👥 **Customer Management** — View customers, order history, activate/deactivate accounts
- 🎟️ **Coupon Management** — Create percentage/fixed coupons with expiry and usage limits
- 📦 **Inventory Alerts** — Low-stock warnings and real-time inventory overview

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React.js | 18.x | UI Framework |
| Vite | 5.x | Build Tool & Dev Server |
| Tailwind CSS | 3.x | Utility-first Styling |
| Framer Motion | 11.x | Animations & Transitions |
| React Router | 6.x | Client-side Routing |
| Lucide React | 0.x | Icon Library |
| Recharts | 2.x | Data Visualization (Admin) |
| Axios | 1.x | HTTP Client |
| React Hot Toast | 2.x | Toast Notifications |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express.js | 4.x | Web Framework |
| MongoDB | 6.x | Database |
| Mongoose | 8.x | ODM |
| JSON Web Tokens | 9.x | Authentication |
| bcryptjs | 2.x | Password Hashing |
| Helmet | 8.x | Security Headers |
| Morgan | 1.x | HTTP Logging |
| Express Rate Limit | 7.x | Rate Limiting |

---

## 🏗️ Architecture

```
NOVA cart/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Navbar, Footer, ProductCard, AIAssistant, etc.
│   │   │   ├── home/          # HomePage sections (Hero, Categories, Flash Sale, etc.)
│   │   │   └── product/       # QuickViewModal
│   │   ├── pages/
│   │   │   ├── admin/         # AdminDashboard, Products, Categories, Orders, Customers, Coupons
│   │   │   ├── HomePage.jsx
│   │   │   ├── ShopPage.jsx
│   │   │   ├── ProductPage.jsx
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── WishlistPage.jsx
│   │   │   ├── ComparePage.jsx
│   │   │   └── ...
│   │   ├── layouts/           # MainLayout, AdminLayout
│   │   ├── context/           # Auth, Cart, Wishlist, Compare, Theme
│   │   ├── services/          # api.js (Axios instance + all API calls)
│   │   ├── routes/            # ProtectedRoute, AdminRoute
│   │   └── utils/             # helpers.js (formatPrice, cn, debounce, etc.)
│   └── tailwind.config.js
│
└── server/                    # Node.js / Express backend
    ├── config/
    │   └── db.js              # MongoDB connection
    ├── controllers/           # authController, productController, orderController, etc.
    ├── middleware/            # auth.js, errorHandler.js, validate.js
    ├── models/                # User, Product, Category, Order, Review, Coupon
    ├── routes/                # authRoutes, productRoutes, orderRoutes, etc.
    ├── utils/
    │   └── seeder.js          # Database seed script
    └── server.js              # Express app entry point
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- npm 9+

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/nova-cart.git
cd nova-cart
```

### 2. Backend setup

```bash
cd server
npm install
```

Create your `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Edit `server/.env`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/novacart
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:3000
```

### 3. Frontend setup

```bash
cd ../client
npm install
```

### 4. Seed the database

```bash
cd ../server
npm run seed
```

This creates:
- 8 categories
- 40+ products across all categories
- 6 users (1 admin + 5 customers)
- Sample orders and reviews
- 5 coupon codes

### 5. Run the application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
```

Open **http://localhost:3000** in your browser.

---

## 🌐 Environment Variables

### Server (`server/.env`)

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Environment (`development`/`production`) | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/novacart` |
| `JWT_SECRET` | Secret key for JWT signing | — (required) |
| `JWT_EXPIRE` | JWT expiry duration | `30d` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
```
POST   /api/auth/register          Register a new user
POST   /api/auth/login             Login and receive JWT
GET    /api/auth/me                Get current user (protected)
PUT    /api/auth/profile           Update profile (protected)
PUT    /api/auth/password          Change password (protected)
```

### Products
```
GET    /api/products               List products (supports filters, search, pagination)
GET    /api/products/featured      Get featured products
GET    /api/products/new-arrivals  Get new arrival products
GET    /api/products/flash-sale    Get sale products
GET    /api/products/recommendations  Get personalized recommendations
GET    /api/products/search/suggestions?q=  Search suggestions
GET    /api/products/:id           Get single product
POST   /api/products               Create product (admin)
PUT    /api/products/:id           Update product (admin)
DELETE /api/products/:id           Delete product (admin)
GET    /api/products/:id/related   Get related products
GET    /api/products/admin/inventory  Inventory overview (admin)
```

### Query Parameters (GET /api/products)
| Param | Description | Example |
|---|---|---|
| `keyword` | Search term | `?keyword=headphones` |
| `category` | Category ID | `?category=abc123` |
| `minPrice` | Min price | `?minPrice=50` |
| `maxPrice` | Max price | `?maxPrice=500` |
| `rating` | Min rating | `?rating=4` |
| `sort` | Sort order | `?sort=price_asc` |
| `page` | Page number | `?page=2` |
| `limit` | Items per page | `?limit=12` |
| `isOnSale` | On-sale only | `?isOnSale=true` |
| `isNewArrival` | New arrivals only | `?isNewArrival=true` |

### Categories
```
GET    /api/categories             List all categories
POST   /api/categories             Create category (admin)
PUT    /api/categories/:id         Update category (admin)
DELETE /api/categories/:id         Delete category (admin)
```

### Orders
```
POST   /api/orders                 Place new order (protected)
GET    /api/orders/my-orders       Get current user's orders (protected)
GET    /api/orders/:id             Get single order (protected)
GET    /api/orders                 Get all orders (admin)
PUT    /api/orders/:id/status      Update order status (admin)
GET    /api/orders/admin/analytics Analytics data (admin)
```

### Reviews
```
GET    /api/products/:id/reviews   Get product reviews
POST   /api/products/reviews       Submit review (protected)
PUT    /api/products/reviews/:id   Update review (protected)
DELETE /api/products/reviews/:id   Delete review (protected)
```

### Wishlist
```
GET    /api/wishlist               Get wishlist (protected)
POST   /api/wishlist               Add to wishlist (protected)
POST   /api/wishlist/toggle        Toggle wishlist item (protected)
DELETE /api/wishlist/:productId    Remove from wishlist (protected)
```

### Coupons
```
POST   /api/coupons/validate       Validate & apply coupon (protected)
GET    /api/coupons                List all coupons (admin)
POST   /api/coupons                Create coupon (admin)
PUT    /api/coupons/:id            Update coupon (admin)
DELETE /api/coupons/:id            Deactivate coupon (admin)
```

### Users
```
GET    /api/users                  List customers (admin)
GET    /api/users/admin/stats      Customer growth stats (admin)
GET    /api/users/recently-viewed  Get recently viewed (protected)
POST   /api/users/recently-viewed  Add recently viewed (protected)
PUT    /api/users/:id/toggle-status  Toggle user active status (admin)
```

---

## 🎟️ Demo Coupon Codes

| Code | Type | Value | Min Order |
|---|---|---|---|
| `WELCOME20` | 20% off | 20% | $50 |
| `SAVE50` | Fixed | $50 off | $200 |
| `FLASH15` | 15% off | 15% | None |
| `NOVA10` | 10% off | 10% | $30 |
| `FREESHIP` | Free shipping | $9.99 off | None |

---

## 🗂️ Database Schema

### User
```js
{ name, email, password (hashed), role, phone, addresses[], wishlist[], recentlyViewed[], isActive, createdAt }
```

### Product
```js
{ name, slug, description, shortDescription, price, discount, discountedPrice, category, brand, images[], stock, sold, rating, numReviews, specifications[], colors[], sizes[], tags[], isFeatured, isNewArrival, isOnSale, isActive, createdAt }
```

### Category
```js
{ name, slug, description, image, icon, color, isActive, productCount }
```

### Order
```js
{ orderNumber, user, items[], shippingAddress, paymentMethod, isPaid, paidAt, shippingMethod, subtotal, shippingCost, tax, discount, couponCode, total, status, statusHistory[], estimatedDelivery, deliveredAt, createdAt }
```

### Review
```js
{ user, product, rating, title, comment, isVerifiedPurchase, createdAt }
```

### Coupon
```js
{ code, description, discountType, discountValue, minimumOrder, maximumDiscount, expiryDate, usageLimit, usedCount, isActive }
```

---

## 📸 Screenshots

| Page | Description |
|---|---|
| **Home** | Hero, categories, trending products, flash sale, recommendations |
| **Shop** | Filters sidebar, grid/list, search, sort, pagination |
| **Product** | Image gallery, specs tabs, reviews, related products |
| **Cart** | Item management, coupon, order summary, free shipping bar |
| **Checkout** | 4-step flow with address, shipping, payment forms |
| **Dashboard** | Orders, wishlist, profile, recently viewed |
| **Admin** | Analytics charts, product/order/customer management |

---

## 🔐 Security Features

- JWT authentication with 30-day expiry
- Passwords hashed with bcryptjs (12 salt rounds)
- Role-based access control (customer / admin)
- Protected routes on frontend (ProtectedRoute, AdminRoute)
- Helmet.js for HTTP security headers
- Express Rate Limiter (200 req / 15 min per IP)
- CORS configured for specific client origin
- Environment variables — no secrets in code

---

## 🚀 Deployment Notes

### MongoDB Atlas
Replace `MONGO_URI` in `.env` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/novacart
```

### Build for production
```bash
# Build frontend
cd client && npm run build

# Start backend (serves API; frontend served separately or via CDN)
cd ../server && npm start
```

---

## 🔮 Future Improvements

- [ ] Real payment gateway (Stripe / PayPal SDK)
- [ ] Email notifications (order confirmation, shipping updates)
- [ ] Real-time order tracking with WebSockets
- [ ] Product image upload to cloud storage (Cloudinary / S3)
- [ ] AI recommendations using OpenAI API
- [ ] Multi-vendor / seller marketplace
- [ ] Mobile app (React Native)
- [ ] Internationalization (i18n) and multi-currency
- [ ] Social login (Google / GitHub OAuth)
- [ ] Product video support
- [ ] Advanced analytics with date range filters

---

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with ❤️ for portfolio showcase**

[⭐ Star this repo](https://github.com/yourusername/nova-cart) · [🐛 Report Bug](https://github.com/yourusername/nova-cart/issues) · [💡 Request Feature](https://github.com/yourusername/nova-cart/issues)

</div>
