import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ChevronRight, CreditCard, Truck, MapPin, Package, Shield, Lock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import { formatPrice, cn } from '../utils/helpers';
import toast from 'react-hot-toast';

const STEPS = ['Information', 'Shipping', 'Payment', 'Review'];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' },
  { id: 'paypal', label: 'PayPal', icon: '🅿️', desc: 'Secure PayPal checkout' },
  { id: 'cod', label: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
];

const CheckoutPage = () => {
  const { items, subtotal, coupon, couponDiscount, shippingCost, tax, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    fullName: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    street: '', city: '', state: '', postalCode: '', country: 'United States',
  });

  const [shipping, setShipping] = useState({ method: 'standard' });
  const [payment, setPayment] = useState({ method: 'card', cardNumber: '', cardName: '', expiry: '', cvv: '' });

  const shippingCostCalc = shipping.method === 'express' ? 14.99 : shippingCost;
  const totalCalc = +(subtotal - couponDiscount + shippingCostCalc + tax).toFixed(2);

  const handleNextStep = () => {
    if (step === 0) {
      if (!info.fullName || !info.email || !info.street || !info.city || !info.state || !info.postalCode) {
        toast.error('Please fill in all required fields');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        items: items.map((i) => ({ product: i._id, quantity: i.quantity, color: i.selectedColor, size: i.selectedSize })),
        shippingAddress: info,
        paymentMethod: payment.method,
        shippingMethod: shipping.method,
        couponCode: coupon?.code,
        subtotal,
        shippingCost: shippingCostCalc,
        tax,
        discount: couponDiscount,
        total: totalCalc,
      };

      const res = await orderAPI.create(orderData);
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirm/${res.order._id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const InfoField = ({ label, field, type = 'text', required = false, half = false }) => (
    <div className={half ? 'col-span-1' : 'col-span-2'}>
      <label className="input-label">{label}{required && ' *'}</label>
      <input
        type={type}
        value={info[field]}
        onChange={(e) => setInfo((i) => ({ ...i, [field]: e.target.value }))}
        className="input-field"
        required={required}
      />
    </div>
  );

  const OrderSummary = () => (
    <div className="card p-5">
      <h3 className="font-display font-bold text-dark-900 dark:text-white mb-4">Order Summary</h3>
      <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
        {items.map((item) => (
          <div key={item.cartId} className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-2xs rounded-full flex items-center justify-center font-bold">{item.quantity}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-dark-800 dark:text-white truncate">{item.name}</p>
              {(item.selectedColor || item.selectedSize) && <p className="text-2xs text-dark-400">{[item.selectedColor, item.selectedSize].filter(Boolean).join(' · ')}</p>}
            </div>
            <span className="text-xs font-bold text-dark-900 dark:text-white">{formatPrice(item.discountedPrice * item.quantity)}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-dark-100 dark:border-dark-700 pt-3 space-y-2 text-sm">
        <div className="flex justify-between"><span className="text-dark-500">Subtotal</span><span className="font-medium">{formatPrice(subtotal)}</span></div>
        {couponDiscount > 0 && <div className="flex justify-between text-emerald-600"><span>Coupon</span><span>-{formatPrice(couponDiscount)}</span></div>}
        <div className="flex justify-between"><span className="text-dark-500">Shipping</span><span className={shippingCostCalc === 0 ? 'text-emerald-600 font-medium' : 'font-medium'}>{shippingCostCalc === 0 ? 'FREE' : formatPrice(shippingCostCalc)}</span></div>
        <div className="flex justify-between"><span className="text-dark-500">Tax</span><span className="font-medium">{formatPrice(tax)}</span></div>
        <div className="border-t border-dark-100 dark:border-dark-700 pt-2 flex justify-between">
          <span className="font-bold text-dark-900 dark:text-white">Total</span>
          <span className="font-black text-lg text-primary-600">{formatPrice(totalCalc)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark-50/50 dark:bg-dark-950 py-8">
      <div className="container-main max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="page-title mb-2">Checkout</h1>
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={cn('flex items-center gap-2 text-sm font-medium', i < step ? 'text-emerald-600' : i === step ? 'text-primary-600' : 'text-dark-400')}>
                  <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all', i < step ? 'bg-emerald-600 border-emerald-600 text-white' : i === step ? 'bg-primary-600 border-primary-600 text-white' : 'border-dark-300 dark:border-dark-600 text-dark-400')}>
                    {i < step ? <Check size={13} /> : i + 1}
                  </div>
                  <span className="hidden sm:block">{s}</span>
                </div>
                {i < STEPS.length - 1 && <div className={cn('h-px w-6 sm:w-10', i < step ? 'bg-emerald-400' : 'bg-dark-200 dark:bg-dark-700')} />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                {/* Step 0: Information */}
                {step === 0 && (
                  <div className="card p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <MapPin size={20} className="text-primary-600" />
                      <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">Shipping Information</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoField label="Full Name" field="fullName" required half />
                      <InfoField label="Email" field="email" type="email" required half />
                      <InfoField label="Phone" field="phone" type="tel" half />
                      <div className="col-span-1" />
                      <InfoField label="Street Address" field="street" required />
                      <InfoField label="City" field="city" required half />
                      <InfoField label="State / Province" field="state" required half />
                      <InfoField label="Postal Code" field="postalCode" required half />
                      <InfoField label="Country" field="country" required half />
                    </div>
                  </div>
                )}

                {/* Step 1: Shipping */}
                {step === 1 && (
                  <div className="card p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <Truck size={20} className="text-primary-600" />
                      <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">Shipping Method</h2>
                    </div>
                    <div className="space-y-3">
                      {[
                        { id: 'standard', label: 'Standard Delivery', desc: '5-7 business days', price: shippingCost === 0 ? 'FREE' : formatPrice(9.99), days: '5-7 days' },
                        { id: 'express', label: 'Express Delivery', desc: '2-3 business days', price: formatPrice(14.99), days: '2-3 days' },
                      ].map((opt) => (
                        <label key={opt.id} className={cn('flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all', shipping.method === opt.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-600 hover:border-primary-300')}>
                          <input type="radio" name="shipping" value={opt.id} checked={shipping.method === opt.id} onChange={(e) => setShipping({ method: e.target.value })} className="text-primary-600" />
                          <div className="flex-1">
                            <p className="font-semibold text-dark-900 dark:text-white">{opt.label}</p>
                            <p className="text-sm text-dark-400">{opt.desc}</p>
                          </div>
                          <span className={cn('font-bold text-sm', opt.price === 'FREE' ? 'text-emerald-600' : 'text-dark-900 dark:text-white')}>{opt.price}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Payment */}
                {step === 2 && (
                  <div className="card p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <CreditCard size={20} className="text-primary-600" />
                      <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">Payment Method</h2>
                    </div>
                    <div className="space-y-3 mb-5">
                      {PAYMENT_METHODS.map((m) => (
                        <label key={m.id} className={cn('flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all', payment.method === m.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' : 'border-dark-200 dark:border-dark-600 hover:border-primary-300')}>
                          <input type="radio" name="payment" value={m.id} checked={payment.method === m.id} onChange={(e) => setPayment((p) => ({ ...p, method: e.target.value }))} className="text-primary-600" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{m.icon}</span>
                              <p className="font-semibold text-dark-900 dark:text-white">{m.label}</p>
                            </div>
                            <p className="text-sm text-dark-400">{m.desc}</p>
                          </div>
                        </label>
                      ))}
                    </div>
                    {payment.method === 'card' && (
                      <div className="space-y-4 p-4 bg-dark-50 dark:bg-dark-800 rounded-2xl">
                        <p className="text-xs text-dark-400 flex items-center gap-2"><Lock size={12} /> Demo mode — no real card required</p>
                        <div>
                          <label className="input-label">Card Number</label>
                          <input value={payment.cardNumber} onChange={(e) => setPayment((p) => ({ ...p, cardNumber: e.target.value }))} placeholder="4242 4242 4242 4242" className="input-field" maxLength={19} />
                        </div>
                        <div>
                          <label className="input-label">Cardholder Name</label>
                          <input value={payment.cardName} onChange={(e) => setPayment((p) => ({ ...p, cardName: e.target.value }))} placeholder="John Doe" className="input-field" />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="input-label">Expiry</label>
                            <input value={payment.expiry} onChange={(e) => setPayment((p) => ({ ...p, expiry: e.target.value }))} placeholder="MM/YY" className="input-field" maxLength={5} />
                          </div>
                          <div>
                            <label className="input-label">CVV</label>
                            <input value={payment.cvv} onChange={(e) => setPayment((p) => ({ ...p, cvv: e.target.value }))} placeholder="123" className="input-field" maxLength={4} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 3: Review */}
                {step === 3 && (
                  <div className="card p-6 space-y-5">
                    <h2 className="font-display font-bold text-dark-900 dark:text-white text-xl">Review Your Order</h2>
                    {/* Shipping info */}
                    <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                      <p className="text-xs font-bold text-dark-500 uppercase tracking-wide mb-2">Shipping to</p>
                      <p className="font-semibold text-dark-900 dark:text-white text-sm">{info.fullName}</p>
                      <p className="text-dark-500 text-sm">{info.street}, {info.city}, {info.state} {info.postalCode}</p>
                      <p className="text-dark-500 text-sm">{info.email} · {info.phone}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                        <p className="text-xs font-bold text-dark-500 uppercase tracking-wide mb-1">Shipping</p>
                        <p className="font-semibold text-dark-900 dark:text-white text-sm capitalize">{shipping.method} Delivery</p>
                      </div>
                      <div className="p-4 bg-dark-50 dark:bg-dark-800 rounded-xl">
                        <p className="text-xs font-bold text-dark-500 uppercase tracking-wide mb-1">Payment</p>
                        <p className="font-semibold text-dark-900 dark:text-white text-sm capitalize">{payment.method === 'cod' ? 'Cash on Delivery' : payment.method === 'card' ? 'Credit Card' : 'PayPal'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation buttons */}
                <div className="flex gap-3 mt-5">
                  {step > 0 && (
                    <button onClick={() => setStep((s) => s - 1)} className="btn-secondary flex-1">← Back</button>
                  )}
                  {step < 3 ? (
                    <button onClick={handleNextStep} className="btn-primary flex-1">
                      Continue <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button onClick={placeOrder} disabled={loading} className="btn-primary flex-1 btn-lg">
                      {loading ? 'Placing Order...' : `Place Order — ${formatPrice(totalCalc)}`}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary />
            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-dark-400">
              <Shield size={12} />
              <span>256-bit SSL encryption · Secure checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
