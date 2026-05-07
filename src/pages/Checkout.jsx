import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartWeight, 
  clearCart 
} from '../store/cartSlice';
import { selectDeliverySettings } from '../store/settingsSlice';
import { calculateDeliveryCharge, formatPrice } from '../utils/delivery';
import { placeOrder, validateCoupon } from '../api/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle2, MapPin, Phone, User, CreditCard, Truck, Ticket, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

const Checkout = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const totalWeight = useSelector(selectCartWeight);
  const deliverySettings = useSelector(selectDeliverySettings);
  const navigate = useNavigate();
  const location = useLocation();
  
  const { discountAmount: initialDiscount = 0, appliedCoupon: initialCoupon = null } = location.state || {};
  
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(initialCoupon);
  const [discountAmount, setDiscountAmount] = useState(initialDiscount);
  const [couponLoading, setCouponLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    location: "Cox's Bazar", // Default to local for better UX
    notes: '',
    paymentMethod: 'cod',
    paymentNumber: '',
    transactionId: ''
  });
  
  const initData = useSelector((state) => state.settings?.initData);
  const settings = initData?.site?.settings || {};
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const deliveryCharge = calculateDeliveryCharge(formData.location, totalWeight, totalPrice, deliverySettings);
  const totalAmount = Math.max(0, totalPrice + deliveryCharge - discountAmount);

  useEffect(() => {
    // Check if we are currently submitting to avoid premature redirect
    if (items.length === 0 && !orderSuccess && !isSubmitting) {
      navigate('/cart');
    }
  }, [items, orderSuccess, isSubmitting, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const response = await validateCoupon(couponCode);
      const coupon = response.coupon;
      setAppliedCoupon(coupon);
      
      const discount = coupon.type === 'percentage' 
        ? (totalPrice * (coupon.value / 100)) 
        : parseFloat(coupon.value);
      
      setDiscountAmount(discount);
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Invalid coupon code');
      setAppliedCoupon(null);
      setDiscountAmount(0);
    } finally {
      setCouponLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCode('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_address: formData.address,
        location: formData.location === "Cox's Bazar" ? 'Cox' : 'Outside',
        items: items.map(item => ({
          product_id: item.id,
          variation_id: item.variation_id || null,
          variation_info: item.variation_info || null,
          quantity: item.quantity
        })),
        payment_method: formData.paymentMethod,
        transaction_id: formData.transactionId,
        sender_number: formData.paymentNumber,
        coupon_code: appliedCoupon?.code || null,
        discount_amount: discountAmount
      };
      
      const response = await placeOrder(orderData);
      
      // Check if tracking_id is nested or direct
      const trackingId = response.data?.tracking_id || response.tracking_id || response.data?.id;

      if (response.success || response.status === 'success' || trackingId) {
        setOrderSuccess(response.data || { tracking_id: trackingId });
        dispatch(clearCart());
        navigate(`/order-success?id=${trackingId || 'PENDING'}`);
      } else {
        toast.error(response.message || 'Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Order failed', error);
      toast.error(error.response?.data?.message || 'Failed to place order. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="container-custom py-40 text-center bg-cream min-h-screen">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md mx-auto bg-white p-12 rounded-3xl shadow-soft-lg border border-slate-100"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-display font-bold mb-4">Order Placed!</h2>
          <p className="text-slate-500 mb-2">Thank you for your purchase, {orderSuccess.customer_name}.</p>
          <p className="text-maroon font-bold text-lg mb-8">Tracking ID: {orderSuccess.tracking_id}</p>
          <p className="text-sm text-slate-400 mb-10">We've sent a confirmation message to your phone.</p>
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/track', { state: { trackingId: orderSuccess.tracking_id } })}
              className="btn-primary w-full"
            >
              Track Your Order
            </button>
            <button 
              onClick={() => navigate('/')}
              className="text-slate-500 font-medium hover:text-maroon transition-colors"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-20 pt-10">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold mb-12">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Checkout Form */}
          <div>
            <div className="bg-white p-8 md:p-10 rounded-2xl shadow-soft border border-slate-100">
              <h3 className="text-2xl font-display font-bold mb-8 flex items-center gap-3 text-slate-800">
                <div className="w-8 h-8 rounded-lg bg-maroon/10 text-maroon flex items-center justify-center text-sm">1</div>
                Delivery Information
              </h3>
              
              <form id="checkout-form" onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      required
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        required
                        type="tel" 
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="01XXX-XXXXXX"
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Delivery Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <select 
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all appearance-none cursor-pointer"
                      >
                        <option value="Dhaka">Dhaka</option>
                        <option value="Chittagong">Chittagong</option>
                        <option value="Cox's Bazar">Cox's Bazar</option>
                        <option value="Sylhet">Sylhet</option>
                        <option value="Rajshahi">Rajshahi</option>
                        <option value="Khulna">Khulna</option>
                        <option value="Other">Other District</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Full Address</label>
                  <textarea 
                    required
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="House, Road, Area..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all"
                  ></textarea>
                </div>

                <div className="pt-8 border-t border-slate-100">
                  <h3 className="text-2xl font-display font-bold mb-6 flex items-center gap-3 text-slate-800">
                    <div className="w-8 h-8 rounded-lg bg-maroon/10 text-maroon flex items-center justify-center text-sm">2</div>
                    Payment Method
                  </h3>
                  
                  <div className="space-y-4">
                    {/* COD */}
                    <label className={`block p-5 rounded-xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'cod' ? 'border-maroon bg-slate-50' : 'border-slate-100 hover:border-slate-200'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="cod" 
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'cod' ? 'bg-maroon/10 text-maroon' : 'bg-slate-100 text-slate-400'}`}>
                            <Truck size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Cash on Delivery</p>
                            <p className="text-xs text-slate-500">Pay when you receive the order</p>
                          </div>
                        </div>
                        {formData.paymentMethod === 'cod' && <CheckCircle2 className="text-maroon" size={24} />}
                      </div>
                    </label>

                    {/* bKash */}
                    <label className={`block p-5 rounded-xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'bkash' ? 'border-[#D12053] bg-[#D12053]/5' : 'border-slate-100 hover:border-slate-200'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="bkash" 
                        checked={formData.paymentMethod === 'bkash'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'bkash' ? 'bg-[#D12053] text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">bKash (Manual)</p>
                            <p className="text-xs text-slate-500">Send money to {settings.bkash_number || '01886-460526'} (Personal)</p>
                          </div>
                        </div>
                        {formData.paymentMethod === 'bkash' && <CheckCircle2 className="text-[#D12053]" size={24} />}
                      </div>
                    </label>

                    {/* Nagad */}
                    <label className={`block p-5 rounded-xl border-2 transition-all cursor-pointer ${formData.paymentMethod === 'nagad' ? 'border-[#F1592A] bg-[#F1592A]/5' : 'border-slate-100 hover:border-slate-200'}`}>
                      <input 
                        type="radio" 
                        name="paymentMethod" 
                        value="nagad" 
                        checked={formData.paymentMethod === 'nagad'}
                        onChange={handleChange}
                        className="hidden"
                      />
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${formData.paymentMethod === 'nagad' ? 'bg-[#F1592A] text-white' : 'bg-slate-100 text-slate-400'}`}>
                            <CreditCard size={20} />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">Nagad (Manual)</p>
                            <p className="text-xs text-slate-500">Send money to {settings.nagad_number || '01886-460526'} (Personal)</p>
                          </div>
                        </div>
                        {formData.paymentMethod === 'nagad' && <CheckCircle2 className="text-[#F1592A]" size={24} />}
                      </div>
                    </label>

                    {/* Payment Details Input (bKash/Nagad only) */}
                    {(formData.paymentMethod === 'bkash' || formData.paymentMethod === 'nagad') && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="space-y-4 pt-4 overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Your {formData.paymentMethod.toUpperCase()} Number</label>
                            <input 
                              required
                              type="tel"
                              name="paymentNumber"
                              value={formData.paymentNumber}
                              onChange={handleChange}
                              placeholder="01XXX-XXXXXX"
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Transaction ID</label>
                            <input 
                              required
                              type="text"
                              name="transactionId"
                              value={formData.transactionId}
                              onChange={handleChange}
                              placeholder="TrxID (e.g. 8X9Y...)"
                              className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon text-sm"
                            />
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Please send the total amount ৳{totalAmount} to our number first, then provide the details above.</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 sticky top-32">
              <h3 className="font-display font-bold text-2xl mb-8">Your Order</h3>
              
              {/* Checkout Coupon Section */}
              <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Have a coupon?</p>
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Enter code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-grow min-w-0 bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-800 text-xs focus:ring-2 focus:ring-blue-600/20 transition-all"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode}
                    className="shrink-0 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
                {appliedCoupon && (
                  <div className="mt-3 flex items-center justify-between text-blue-600 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Ticket size={12} />
                      <span className="text-[10px] font-black">{appliedCoupon.code} Applied</span>
                    </div>
                    <button onClick={removeCoupon} className="text-slate-400 hover:text-red-500">
                      <X size={12} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 mb-8 space-y-4">
                {items.map((item, index) => (
                  <div key={`${item.id}-${index}`} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">
                        {item.name} {item.variation_info && <span className="text-teal-600">({item.variation_info})</span>}
                      </p>
                      <p className="text-xs text-slate-400">{item.quantity} x {formatPrice(item.price)}</p>
                    </div>
                    <p className="font-bold text-slate-800 text-sm">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <div className="flex items-center gap-2">
                    <span>Delivery Charge</span>
                    <div className="group relative">
                      <Truck size={14} className="text-slate-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-800 text-cream text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        Total Weight: {totalWeight.toFixed(2)}kg.
                        {formData.location === "Cox's Bazar" ? " Local delivery rate applied." : " Outside delivery rate applied."}
                      </div>
                    </div>
                  </div>
                  <span className="font-medium">{formatPrice(deliveryCharge)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-blue-600 font-bold">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-bold">Total Payable Amount</span>
                  <span className="text-3xl font-bold text-maroon">{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className="btn-primary w-full mt-10 py-5 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : (
                  "Confirm Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
