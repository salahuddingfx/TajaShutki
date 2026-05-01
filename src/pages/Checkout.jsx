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
import { placeOrder } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, MapPin, Phone, User, CreditCard, Truck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Checkout = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const totalWeight = useSelector(selectCartWeight);
  const deliverySettings = useSelector(selectDeliverySettings);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    location: 'Dhaka', // Default
    notes: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  const deliveryCharge = calculateDeliveryCharge(formData.location, totalWeight, deliverySettings);
  const totalAmount = totalPrice + deliveryCharge;

  useEffect(() => {
    if (items.length === 0 && !orderSuccess) {
      navigate('/cart');
    }
  }, [items, orderSuccess, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
          quantity: item.quantity
        }))
      };
      
      const response = await placeOrder(orderData);
      if (response.success) {
        setOrderSuccess(response.data);
        dispatch(clearCart());
      }
    } catch (error) {
      console.error('Order failed', error);
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
                  <div className="bg-slate-50 border-2 border-maroon p-5 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-maroon/10 text-maroon flex items-center justify-center">
                        <CreditCard size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">Cash on Delivery</p>
                        <p className="text-xs text-slate-500">Pay when you receive the pickles</p>
                      </div>
                    </div>
                    <CheckCircle2 className="text-maroon" size={24} />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div>
            <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 sticky top-32">
              <h3 className="font-display font-bold text-2xl mb-8">Your Order</h3>
              
              <div className="max-h-[300px] overflow-y-auto pr-2 mb-8 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 rounded-lg bg-slate-50 overflow-hidden shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-grow">
                      <p className="font-bold text-slate-800 text-sm line-clamp-1">{item.name}</p>
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
                <div className="pt-4 mt-4 border-t-2 border-dashed border-slate-100 flex justify-between items-center">
                  <span className="text-lg font-bold">Total Amount</span>
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
