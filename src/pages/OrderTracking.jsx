import { useState, useEffect } from 'react';
import { trackOrder } from '../api/api';
import { formatPrice } from '../utils/delivery';
import { Search, Package, MapPin, Truck, CheckCircle2, Clock, Calendar, ShieldCheck, CreditCard, ArrowRight, User, Wifi, Cpu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Star, StarHalf, Send, ImageIcon, Video, Trash2, Loader2, PlayCircle } from 'lucide-react';
import { submitReview } from '../api/api';
import Swal from 'sweetalert2';
import clsx from 'clsx';

const OrderTracking = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const queryId = queryParams.get('id');
  
  const [trackingId, setTrackingId] = useState(location.state?.trackingId || queryId || '');
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const idToSearch = location.state?.trackingId || queryId;
    if (idToSearch) {
      performSearch(idToSearch);
    }
  }, [location.state, queryId]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!trackingId) return;
    performSearch(trackingId);
  };

  useEffect(() => {
    let interval;
    if (selectedOrder?.tracking_id && (selectedOrder.status !== 'delivered' && selectedOrder.status !== 'cancelled')) {
      interval = setInterval(() => {
        performSearch(selectedOrder.tracking_id, true);
      }, 5000); 
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [selectedOrder?.tracking_id, selectedOrder?.status]);

  const performSearch = async (id, isPoll = false) => {
    if (!isPoll) setIsSearching(true);
    setError('');
    
    try {
      const response = await trackOrder(id);
      if (response.success) {
        const orderData = Array.isArray(response.data) ? response.data : [response.data];
        setOrders(orderData);
        
        if (isPoll && selectedOrder) {
          const updated = orderData.find(o => o.tracking_id === selectedOrder.tracking_id);
          if (updated) setSelectedOrder(updated);
        } else if (orderData.length === 1) {
          setSelectedOrder(orderData[0]);
        } else if (orderData.length > 1 && !selectedOrder) {
          setSelectedOrder(null);
        }
      } else {
        if (!isPoll) setError('No order found with that tracking ID.');
      }
    } catch (err) {
      if (!isPoll) setError('Something went wrong. Please try again.');
    } finally {
      if (!isPoll) setIsSearching(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'placed': return <Clock className="text-blue-500" />;
      case 'confirmed': return <CheckCircle2 className="text-blue-600" />;
      case 'packed': return <Package className="text-emerald-600" />;
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
  const currentStepIndex = statusSteps.indexOf(selectedOrder?.status || 'placed');

  return (
    <div className="bg-[#F4F9F6] min-h-screen pb-20 pt-24 relative overflow-hidden">
      <Helmet>
        <title>Track Order | Taja Shutki</title>
      </Helmet>

      {/* Animated Background Shapes */}
      <motion.div 
        animate={{ rotate: 360, x: [0, 50, 0], y: [0, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-0"
      />
      <motion.div 
        animate={{ rotate: -360, x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-100/30 rounded-full blur-[100px] -z-0"
      />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          
          <div className="text-center mb-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-6 py-2 bg-emerald-600/10 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] mb-6"
            >
              Order Status
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-display font-black text-slate-900 mb-6 tracking-tighter"
            >
              Where is my <span className="text-emerald-600 italic">Product?</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-lg text-slate-500 max-w-xl mx-auto font-medium leading-relaxed"
            >
              Stay updated with your order's journey from the sea to your doorstep.
            </motion.p>
          </div>

          {/* Search Box */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-4 md:p-6 rounded-[40px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.08)] border border-slate-100 mb-10 max-w-2xl mx-auto"
          >
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-grow">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="Tracking ID or Phone Number"
                  className="w-full pl-16 pr-6 py-5 bg-slate-50 border-transparent rounded-[30px] focus:bg-white focus:ring-4 focus:ring-emerald-500/5 focus:border-emerald-500/20 outline-none transition-all text-sm font-bold text-slate-800"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSearching}
                className="bg-emerald-600 text-white px-10 py-5 rounded-[30px] font-black uppercase tracking-widest text-[11px] hover:bg-slate-900 transition-all shadow-xl shadow-emerald-500/20 disabled:opacity-70 active:scale-95 flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Track Now <ArrowRight size={14} /></>
                )}
              </button>
            </form>
            {error && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-[10px] mt-4 ml-6 font-black uppercase tracking-widest">{error}</motion.p>}
          </motion.div>

          {/* Order Details */}
          <AnimatePresence mode="wait">
            {orders.length > 1 && !selectedOrder && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10"
              >
                <div className="md:col-span-2 mb-2">
                  <h3 className="text-xl font-black text-slate-800">Found {orders.length} orders for this number:</h3>
                  <p className="text-sm text-slate-500">Please select an order to track</p>
                </div>
                {orders.map((o) => (
                  <button 
                    key={o.tracking_id}
                    onClick={() => setSelectedOrder(o)}
                    className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm hover:shadow-md hover:border-emerald-600/20 transition-all text-left flex justify-between items-center group"
                  >
                    <div>
                      <p className="text-[10px] font-black uppercase text-emerald-600 mb-1">#{o.tracking_id}</p>
                      <h4 className="text-lg font-black text-slate-800">{new Date(o.created_at).toLocaleDateString()}</h4>
                      <p className="text-xs text-slate-400 font-bold">{o.items?.length || 0} Items • {formatPrice(o.total_amount)}</p>
                    </div>
                    <div className={clsx(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                      o.status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      {statusMap[o.status] || o.status}
                    </div>
                  </button>
                ))}
              </motion.div>
            )}

            {selectedOrder ? (
              <motion.div 
                key="order-found"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="space-y-8"
              >
                {/* Back to list button if multiple */}
                {orders.length > 1 && (
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-emerald-600 transition-colors"
                  >
                    <ArrowRight size={14} className="rotate-180" /> Back to Order List
                  </button>
                )}

                {/* Main Status Card */}
                <div className="bg-white rounded-[50px] p-8 md:p-16 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-10 relative z-10">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={clsx(
                          "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                          selectedOrder.status === 'delivered' ? "bg-emerald-50 text-emerald-600" : "bg-emerald-50 text-emerald-600"
                        )}>
                          {getStatusIcon(selectedOrder.status)}
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Current Status</p>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{statusMap[selectedOrder.status] || selectedOrder.status}</h3>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-[30px] border border-slate-100">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 text-center">Tracking ID</p>
                      <h3 className="text-xl font-black text-emerald-600 tracking-wider">#{selectedOrder.tracking_id}</h3>
                    </div>
                  </div>

                  {/* Enhanced Timeline */}
                  <div className="relative mb-8">
                    {/* Horizontal Line (Desktop Only) */}
                    <div className="absolute top-5 left-0 w-full h-1.5 bg-slate-50 rounded-full hidden md:block overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                        transition={{ duration: 1.5, ease: "circOut" }}
                        className="h-full bg-emerald-600"
                      />
                    </div>
                    
                    <div className="relative grid grid-cols-3 md:flex md:flex-row justify-between items-start gap-y-10 md:gap-0">
                      {statusSteps.map((step, index) => {
                        const isCompleted = index <= currentStepIndex;
                        const isActive = index === currentStepIndex;
                        
                        return (
                          <div key={step} className="flex flex-col items-center relative z-10 group">
                            <div className={clsx(
                              "w-12 h-12 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl relative",
                              isCompleted ? "bg-emerald-600 text-white scale-110" : "bg-white text-slate-300 border border-slate-100 scale-90"
                            )}>
                              {isCompleted ? <CheckCircle2 className="w-6 h-6" strokeWidth={3} /> : <div className="w-2 h-2 bg-slate-200 rounded-full" />}
                              
                              {isActive && (
                                <motion.div 
                                  layoutId="active-glow"
                                  className="absolute -inset-2 bg-emerald-600/20 blur-xl rounded-full -z-10"
                                />
                              )}
                            </div>
                            <div className="text-center mt-4 md:mt-6 px-1">
                              <p className={clsx(
                                "text-[9px] md:text-[11px] font-black uppercase tracking-widest transition-colors leading-tight",
                                isCompleted ? "text-slate-900" : "text-slate-300"
                              )}>
                                {statusMap[step]}
                              </p>
                              {isActive && <p className="text-[8px] md:text-[9px] text-emerald-600 font-bold uppercase tracking-tighter mt-1 animate-pulse">In Progress</p>}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Summary & Billing */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-soft border border-slate-100">
                      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
                        <h4 className="font-display font-black text-2xl text-slate-900 flex items-center gap-3">
                          <Package className="text-emerald-600" size={24} />
                          Order Content
                        </h4>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-slate-50 px-4 py-2 rounded-full text-slate-400">
                          {selectedOrder.items?.length} Items
                        </span>
                      </div>
                      
                      <div className="space-y-6">
                        {selectedOrder.items?.map((item, idx) => (
                          <div key={idx} className="space-y-4">
                            <div className="flex justify-between items-center group">
                              <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden shrink-0 border border-slate-100 group-hover:scale-105 transition-transform">
                                  {item.product?.images && item.product.images.length > 0 ? (
                                    <img src={item.product.images[0].image_path} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                      <Package size={24} />
                                    </div>
                                  )}
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-slate-800 font-bold text-lg">{item.name}</span>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-black text-emerald-600 uppercase bg-emerald-600/5 px-2 py-0.5 rounded">Qty: {item.quantity}</span>
                                    {item.sku && <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">SKU: {item.sku}</span>}
                                  </div>
                                </div>
                              </div>
                              <span className="font-black text-slate-900 text-lg">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                            
                            {/* Review Section for each product */}
                            {selectedOrder.status === 'delivered' && (
                              <ProductReviewSection item={item} order={selectedOrder} />
                            )}
                            
                            {idx < selectedOrder.items.length - 1 && <div className="h-px bg-slate-50 w-full" />}
                          </div>
                        ))}
                      </div>

                      <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                           <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                             <span>Subtotal</span>
                             <span className="text-slate-800">{formatPrice(selectedOrder.subtotal)}</span>
                           </div>
                           <div className="flex justify-between text-sm font-bold text-slate-500 uppercase tracking-widest">
                             <span>Delivery Fee</span>
                             <span className="text-slate-800">{formatPrice(selectedOrder.delivery_charge)}</span>
                           </div>
                           {parseFloat(selectedOrder.discount_amount) > 0 && (
                             <div className="flex justify-between text-sm font-black text-emerald-600 uppercase tracking-widest">
                               <span>Discount {selectedOrder.coupon_code ? `(${selectedOrder.coupon_code})` : 'Applied'}</span>
                               <span>-{formatPrice(selectedOrder.discount_amount)}</span>
                             </div>
                           )}
                           <div className="flex justify-between items-center pt-4 border-t-2 border-dashed border-slate-100">
                             <span className="text-lg font-black text-slate-900">{selectedOrder.payment_status === 'paid' ? 'Total Paid' : 'Total Payable'}</span>
                             <span className="text-3xl font-black text-emerald-600">{formatPrice(selectedOrder.total_amount)}</span>
                           </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 ml-2">Payment Authentication</p>
                          <div 
                            className={clsx(
                              "relative h-48 rounded-[24px] p-5 text-white overflow-hidden shadow-xl",
                              selectedOrder.payment_status === 'paid' ? "bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700" :
                              selectedOrder.payment_method?.toLowerCase() === 'bkash' ? "bg-gradient-to-br from-[#D12053] via-[#E2136E] to-[#A01840]" :
                              selectedOrder.payment_method?.toLowerCase() === 'nagad' ? "bg-gradient-to-br from-[#F7941D] via-[#F15A22] to-[#E41E26]" :
                              "bg-gradient-to-br from-emerald-800 via-emerald-900 to-slate-900"
                            )}
                          >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/20 rounded-full -ml-24 -mb-24 blur-2xl" />
                            
                            {/* Card Top: Chip & Status */}
                            <div className="flex justify-between items-start mb-4 relative z-10">
                              <div className="w-10 h-8 bg-gradient-to-br from-yellow-200 via-yellow-400 to-yellow-600 rounded-md relative overflow-hidden shadow-inner">
                                <div className="absolute inset-0 opacity-30 border-[0.5px] border-black/20 grid grid-cols-3 grid-rows-3" />
                                <div className="absolute top-1/2 left-0 w-full h-px bg-black/10" />
                                <div className="absolute top-0 left-1/2 w-px h-full bg-black/10" />
                              </div>
                              <div className="flex flex-col items-end">
                                <div className={clsx(
                                  "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-md border",
                                  selectedOrder.payment_status === 'paid' ? "bg-white/20 border-white/30 text-white" : "bg-rose-500/20 border-rose-400/30 text-rose-300"
                                )}>
                                  {selectedOrder.payment_status || 'Unpaid'}
                                </div>
                              </div>
                            </div>

                            {/* Card Middle: Number/Phone & Type */}
                            <div className="mb-4 relative z-10">
                              <div className="flex items-center gap-3 mb-2">
                                <p className="text-xl font-mono font-bold tracking-[0.2em] drop-shadow-md">
                                  {selectedOrder.payment_method === 'cod' ? 
                                    '**** **** **** COD' : 
                                    `${selectedOrder.customer_phone?.slice(0, 3)} ${selectedOrder.customer_phone?.slice(3, 5)}** **${selectedOrder.customer_phone?.slice(-2)}`
                                  }
                                </p>
                                <Wifi size={16} className="rotate-90 opacity-40" />
                              </div>
                              {/* Clear Transaction ID */}
                              {selectedOrder.transaction_id && (
                                <p className="text-[10px] font-mono tracking-widest uppercase opacity-90 bg-black/30 px-3 py-1 rounded-lg border border-white/10 inline-block">
                                  TXN ID: {selectedOrder.transaction_id}
                                </p>
                              )}
                            </div>

                            {/* Card Bottom: Name & Method Logo */}
                            <div className="flex justify-between items-end relative z-10 mt-2">
                              <div className="space-y-0.5">
                                <p className="text-[7px] font-bold opacity-60 tracking-[0.2em] uppercase">Customer Name</p>
                                <p className="text-sm font-black tracking-wider uppercase truncate max-w-[150px]">{selectedOrder.customer_name}</p>
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <span className="text-[7px] font-bold opacity-50 mb-1 tracking-widest uppercase">
                                  {selectedOrder.payment_method === 'cod' ? 'Hand Cash' : 'Digital Gateway'}
                                </span>
                                {selectedOrder.payment_method?.toLowerCase() === 'bkash' ? (
                                  <span className="text-lg font-black italic tracking-tighter leading-none">bKash</span>
                                ) : selectedOrder.payment_method?.toLowerCase() === 'nagad' ? (
                                  <span className="text-lg font-black italic tracking-tighter leading-none">Nagad</span>
                                ) : (
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-black uppercase tracking-widest">COD</span>
                                    <Truck size={14} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Customer & Location */}
                  <div className="space-y-8">
                    <div className="bg-white rounded-[40px] p-8 shadow-soft border border-slate-100">
                      <h4 className="font-display font-black text-xl mb-8 flex items-center gap-3">
                        <MapPin className="text-emerald-600" size={20} />
                        Shipping To
                      </h4>
                      <div className="space-y-8">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                            <User size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Customer</p>
                            <p className="font-bold text-slate-800 text-lg leading-tight">{selectedOrder.customer_name}</p>
                            <p className="text-sm text-slate-500 mt-1">{selectedOrder.customer_phone}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                            <MapPin size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Address</p>
                            <p className="font-bold text-slate-800 leading-relaxed">{selectedOrder.customer_address}</p>
                            <span className="inline-block mt-2 px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-black uppercase tracking-widest text-slate-400 border border-slate-100">
                              {selectedOrder.location}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-4 pt-4 border-t border-slate-50">
                          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
                            <Calendar size={18} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Order Date</p>
                            <p className="font-bold text-slate-800">{new Date(selectedOrder.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            <p className="text-xs text-slate-400 mt-0.5">{new Date(selectedOrder.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-900 rounded-[40px] p-8 text-white relative overflow-hidden group">
                      <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                           <ShieldCheck size={20} className="text-emerald-400" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400/80">Authenticity Verified</span>
                        </div>
                        <h5 className="text-xl font-bold mb-2">Safe & Secure</h5>
                        <p className="text-sm text-white/60 leading-relaxed">Your order is being handled with strict hygiene standards.</p>
                      </div>
                      <Package size={80} className="absolute -bottom-6 -right-6 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              !isSearching && orders.length === 0 && (
                <motion.div 
                  key="search-placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-32 text-center"
                >
                  <div className="relative inline-block mb-8">
                     <div className="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full" />
                     <Package size={120} className="relative text-slate-100 mx-auto" />
                  </div>
                  <h3 className="text-2xl font-display font-black text-slate-900 mb-3">Ready to track?</h3>
                  <p className="text-slate-400 max-w-xs mx-auto">Enter your credentials above to see your order's real-time progress.</p>
                  
                  <div className="mt-12 flex justify-center gap-10">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 mb-2 border border-slate-50">
                        <Truck size={20} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Fast Delivery</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-slate-400 mb-2 border border-slate-50">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Secure Pack</span>
                    </div>
                  </div>
                </motion.div>
              )
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};


const ProductReviewSection = ({ item, order }) => {
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [media, setMedia] = useState([]);

  const handleMediaChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      file,
      type,
      preview: URL.createObjectURL(file)
    }));
    setMedia(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (index) => {
    setMedia(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('site_id', order.site_id);
      formData.append('product_id', item.product_id);
      formData.append('customer_name', order.customer_name);
      formData.append('rating', rating);
      formData.append('comment', comment);
      
      media.forEach((m) => {
        if (m.type === 'image') formData.append('images[]', m.file);
        else formData.append('videos[]', m.file);
      });

      await submitReview(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: 'Thank you for your feedback! It means a lot to us.',
        confirmButtonColor: '#059669',
        timer: 3000
      });
      
      setIsSubmitted(true);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Oops...', text: 'Failed to submit review.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl text-xs font-bold flex items-center gap-2 border border-emerald-100 mt-4 md:ml-20">
        <CheckCircle2 size={14} /> Review submitted successfully!
      </div>
    );
  }

  return (
    <div className="mt-6 md:ml-20">
      {!showForm ? (
        <button 
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-emerald-600/5 border border-emerald-600/10 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 shadow-sm active:scale-95"
        >
          <Star size={12} fill="currentColor" /> Write a Review
        </button>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 rounded-3xl p-4 md:p-6 border border-slate-100 space-y-4"
        >
          <div className="flex justify-between items-center">
            <h5 className="text-xs font-black uppercase tracking-widest text-slate-800">Share your experience</h5>
            <button onClick={() => setShowForm(false)} className="text-[10px] font-black text-slate-400 hover:text-emerald-600">CANCEL</button>
          </div>
          
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <div key={star} className="relative flex items-center">
                {/* Left Half Click Area */}
                <button 
                  onClick={() => setRating(star - 0.5)} 
                  className="absolute left-0 w-1/2 h-full z-10"
                />
                {/* Right Half Click Area */}
                <button 
                  onClick={() => setRating(star)} 
                  className="absolute right-0 w-1/2 h-full z-10"
                />
                
                {/* Visual Representation */}
                <div className="flex">
                  {rating >= star ? (
                    <Star size={24} fill="currentColor" className="text-emerald-600" />
                  ) : rating >= star - 0.5 ? (
                    <StarHalf size={24} fill="currentColor" className="text-emerald-600" />
                  ) : (
                    <Star size={24} className="text-slate-200" />
                  )}
                </div>
              </div>
            ))}
            <span className="ml-4 text-lg font-black text-slate-800">{rating.toFixed(1)}</span>
          </div>

          <textarea 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="How was the taste and quality?"
            className="w-full bg-white border border-slate-100 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/10 focus:border-emerald-600/20 transition-all resize-none"
            rows="3"
          />

          <div className="flex flex-wrap gap-2">
            {media.map((m, idx) => (
              <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-200 group">
                {m.type === 'image' ? (
                  <img src={m.preview} alt="preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                    <Video size={16} />
                  </div>
                )}
                <button 
                  type="button"
                  onClick={() => removeMedia(idx)}
                  className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={10} />
                </button>
              </div>
            ))}
            
            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-600/30 hover:text-emerald-600 transition-all cursor-pointer">
              <ImageIcon size={16} />
              <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleMediaChange(e, 'image')} />
            </label>
            <label className="w-16 h-16 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-600/30 hover:text-emerald-600 transition-all cursor-pointer">
              <Video size={16} />
              <input type="file" accept="video/*" multiple className="hidden" onChange={(e) => handleMediaChange(e, 'video')} />
            </label>
          </div>

          <button 
            disabled={isSubmitting || !comment}
            onClick={handleSubmit}
            className="w-full bg-slate-900 text-white py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <><Send size={12} /> Submit Feedback</>}
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default OrderTracking;

