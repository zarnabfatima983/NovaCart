import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';
import PageLoader from './components/common/PageLoader';

// Lazy-loaded pages
const HomePage         = lazy(() => import('./pages/HomePage'));
const ShopPage         = lazy(() => import('./pages/ShopPage'));
const ProductPage      = lazy(() => import('./pages/ProductPage'));
const CartPage         = lazy(() => import('./pages/CartPage'));
const CheckoutPage     = lazy(() => import('./pages/CheckoutPage'));
const OrderConfirmPage = lazy(() => import('./pages/OrderConfirmPage'));
const LoginPage        = lazy(() => import('./pages/LoginPage'));
const RegisterPage     = lazy(() => import('./pages/RegisterPage'));
const DashboardPage    = lazy(() => import('./pages/DashboardPage'));
const WishlistPage     = lazy(() => import('./pages/WishlistPage'));
const ComparePage      = lazy(() => import('./pages/ComparePage'));
const AboutPage        = lazy(() => import('./pages/AboutPage'));
const ContactPage      = lazy(() => import('./pages/ContactPage'));

// Admin pages
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts    = lazy(() => import('./pages/admin/AdminProducts'));
const AdminCategories  = lazy(() => import('./pages/admin/AdminCategories'));
const AdminOrders      = lazy(() => import('./pages/admin/AdminOrders'));
const AdminCustomers   = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminCoupons     = lazy(() => import('./pages/admin/AdminCoupons'));

// Error pages
const NotFoundPage     = lazy(() => import('./pages/NotFoundPage'));
const UnauthorizedPage = lazy(() => import('./pages/UnauthorizedPage'));

const App = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* Main layout routes */}
      <Route element={<MainLayout />}>
        <Route path="/"               element={<HomePage />} />
        <Route path="/shop"           element={<ShopPage />} />
        <Route path="/shop/:category" element={<ShopPage />} />
        <Route path="/product/:id"    element={<ProductPage />} />
        <Route path="/cart"           element={<CartPage />} />
        <Route path="/wishlist"       element={<WishlistPage />} />
        <Route path="/compare"        element={<ComparePage />} />
        <Route path="/about"          element={<AboutPage />} />
        <Route path="/contact"        element={<ContactPage />} />
        <Route path="/login"          element={<LoginPage />} />
        <Route path="/register"       element={<RegisterPage />} />
        <Route path="/unauthorized"   element={<UnauthorizedPage />} />

        {/* Protected customer routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout"          element={<CheckoutPage />} />
          <Route path="/order-confirm/:id" element={<OrderConfirmPage />} />
          <Route path="/dashboard/*"       element={<DashboardPage />} />
        </Route>
      </Route>

      {/* Admin layout routes */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin"             element={<AdminDashboard />} />
          <Route path="/admin/products"    element={<AdminProducts />} />
          <Route path="/admin/categories"  element={<AdminCategories />} />
          <Route path="/admin/orders"      element={<AdminOrders />} />
          <Route path="/admin/customers"   element={<AdminCustomers />} />
          <Route path="/admin/coupons"     element={<AdminCoupons />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  </Suspense>
);

export default App;
