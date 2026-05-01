import { useState, useEffect } from 'react';
import { trackOrder } from '../api/api';
import { formatPrice } from '../utils/delivery';
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

const OrderTracking = () => {
  const location = useLocation();
  const [trackingId, setTrackingId] = useState(location.state?.trackingId || '');
  const [order, setOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (location.state?.trackingId) {
      performSearch(location.state.trackingId);
    }
  }, [location.state]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId) return;
    performSearch(trackingId);
  };

  const performSearch = async (id) => {
    setIsSearching(true);
    setError('');
    setOrder(null);
    
    try {
      const response = await trackOrder(id);
      if (response.success) {
        setOrder(response.data);
      } else {
        setError('No order found with that tracking ID.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed': return <Clock className="text-blue-500" />;
      case 'confirmed': return <CheckCircle2 className="text-blue-600" />;
      case 'packed': return <Package className="text-maroon" />;
      case 'shipped': return <Truck className="text-orange-500" />;
      case 'delivered': return <CheckCircle2 className="text-green-500" />;
      case 'cancelled': return <CheckCircle2 className="text-red-500" />;
      default: return <Clock className="text-slate-400" />;
    }
  };

  const statusMap = {
    'placed': 'Order Received',
    'confirmed': 'Order Processed',
    'packed': 'Packaged',
    'shipped': 'Shipping',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };

  const statusSteps = [
    'placed',
    'confirmed',
    'packed',
    'shipped',
    'delivered'
  ];
  const currentStepIndex = statusSteps.indexOf(order?.status || 'placed');

  return (
    <div className="bg-cream min-h-screen pb-20 pt-10">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-display font-bold mb-4 text-center">Track Your Order</h1>
          <p className="text-slate-500 text-center mb-12">
            Enter your Tracking ID or Phone Number to check the status of your delicious pickles.
          </p>

          {/* Search Box */}
          <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100 mb-12">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Order ID (ORD-XXXX) or Phone Number"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-maroon/20 focus:border-maroon transition-all"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className="btn-primary !py-4 px-10 whitespace-nowrap disabled:opacity-70"
              >
                {isSearching ? 'Searching...' : 'Track Now'}
              </button>
            </form>
            {error && <p className="text-red-500 text-sm mt-4 text-center font-medium">{error}</p>}
          </div>

          {/* Order Details */}
          <AnimatePresence>
            {order && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                {/* Status Bar */}
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-soft border border-slate-100">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Status</p>
                      <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                        {getStatusIcon(order.status)}
                        {statusMap[order.status] || order.status}
                      </h3>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Tracking ID</p>
                      <h3 className="text-xl font-bold text-maroon">{order.tracking_id}</h3>
                    </div>
                  </div>

                  {/* Progress Timeline */}
                  <div className="relative">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden md:block" />
                    <div 
                      className="absolute top-1/2 left-0 h-1 bg-maroon -translate-y-1/2 transition-all duration-1000 hidden md:block" 
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                    <div className="relative flex flex-col md:flex-row justify-between items-center gap-8 md:gap-0">
                      {statusSteps.map((step, index) => (
                        <div key={step} className="flex flex-col items-center relative z-10 bg-white px-4">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                            index <= currentStepIndex ? 'bg-maroon text-cream' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {index <= currentStepIndex ? <CheckCircle2 size={20} /> : index + 1}
                          </div>
                          <p className={`mt-3 font-bold text-sm ${index <= currentStepIndex ? 'text-slate-800' : 'text-slate-400'}`}>
                            {statusMap[step]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Summary */}
                  <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100">
                    <h4 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                      <Package className="text-maroon" size={20} />
                      Order Items
                    </h4>
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-sm">
                          <span className="text-slate-600">{item.quantity}x {item.name}</span>
                          <span className="font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center font-bold text-lg">
                        <span>Total Paid</span>
                        <span className="text-maroon">{formatPrice(order.total_amount)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Delivery Info */}
                  <div className="bg-white p-8 rounded-2xl shadow-soft border border-slate-100">
                    <h4 className="font-display font-bold text-xl mb-6 flex items-center gap-2">
                      <MapPin className="text-maroon" size={20} />
                      Delivery Details
                    </h4>
                    <div className="space-y-4 text-sm text-slate-600">
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Customer</p>
                        <p>{order.customer_name}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 mb-1">Address</p>
                        <p>{order.customer_address}, {order.location}</p>
                      </div>
                      <div className="flex gap-8 pt-2">
                        <div>
                          <p className="font-bold text-slate-800 mb-1">Date</p>
                          <div className="flex items-center gap-2">
                            <Calendar size={14} />
                            {new Date(order.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 mb-1">Method</p>
                          <p>Cash on Delivery</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!order && !isSearching && (
            <div className="mt-12 text-center text-slate-400">
              <Package size={64} className="mx-auto mb-4 opacity-20" />
              <p>Search for an order to see its history.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
