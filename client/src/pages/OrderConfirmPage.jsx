import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, ArrowRight, Home } from 'lucide-react';
import { orderAPI } from '../services/api';
import { formatPrice, formatDate } from '../utils/helpers';

const OrderConfirmPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(id)
      .then((res) => setOrder(res.order))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" /></div>;
  if (!order) return <div className="text-center py-20"><p className="text-dark-500">Order not found</p></div>;

  return (
    <div className="min-h-screen bg-dark-50/50 dark:bg-dark-950 py-12">
      <div className="container-main max-w-2xl">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
            className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-5"
          >
            <CheckCircle size={40} className="text-emerald-600" />
          </motion.div>
          <h1 className="font-display font-black text-3xl text-dark-900 dark:text-white mb-2">Order Confirmed!</h1>
          <p className="text-dark-500 dark:text-dark-400 text-lg">Thank you for your purchase. Your order is being processed.</p>
        </motion.div>

        <div className="card p-6 mb-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Order Number', value: order.orderNumber },
              { label: 'Date', value: formatDate(order.createdAt) },
              { label: 'Status', value: order.status },
              { label: 'Total', value: formatPrice(order.total) },
            ].map(({ label, value }) => (
              <div key={label} className="text-center p-3 bg-dark-50 dark:bg-dark-800 rounded-xl">
                <p className="text-xs text-dark-400 mb-1">{label}</p>
                <p className="font-bold text-dark-900 dark:text-white text-sm capitalize">{value}</p>
              </div>
            ))}
          </div>

          {/* Estimated delivery */}
          <div className="flex items-center gap-3 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl mb-5">
            <Truck size={20} className="text-primary-600" />
            <div>
              <p className="font-semibold text-dark-900 dark:text-white text-sm">Estimated Delivery</p>
              <p className="text-sm text-primary-600">{formatDate(order.estimatedDelivery)}</p>
            </div>
          </div>

          {/* Items */}
          <h3 className="font-bold text-dark-900 dark:text-white mb-3 flex items-center gap-2">
            <Package size={16} /> Items Ordered ({order.items?.length})
          </h3>
          <div className="space-y-3">
            {order.items?.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-dark-100 dark:border-dark-700 last:border-0">
                <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl" />
                <div className="flex-1">
                  <p className="font-medium text-dark-800 dark:text-white text-sm">{item.name}</p>
                  <p className="text-xs text-dark-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-bold text-dark-900 dark:text-white text-sm">{formatPrice(item.discountedPrice * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Total breakdown */}
          <div className="mt-4 pt-4 border-t border-dark-100 dark:border-dark-700 text-sm space-y-1">
            <div className="flex justify-between text-dark-500"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="flex justify-between text-dark-500"><span>Shipping</span><span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span></div>
            <div className="flex justify-between text-dark-500"><span>Tax</span><span>{formatPrice(order.tax)}</span></div>
            <div className="flex justify-between font-bold text-dark-900 dark:text-white text-base pt-1 border-t border-dark-100 dark:border-dark-700 mt-1">
              <span>Total</span><span className="text-primary-600">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/dashboard/orders" className="btn-primary flex-1 justify-center">
            <Package size={16} /> Track Order
          </Link>
          <Link to="/shop" className="btn-secondary flex-1 justify-center">
            <Home size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmPage;
