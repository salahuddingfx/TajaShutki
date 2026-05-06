import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Truck, ArrowRight, MessageCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet-async';
import { trackOrder } from '../api/api';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('id');
  const initData = useSelector((state) => state.settings?.initData);
  const settings = initData?.site?.settings || {};
  
  const [orderStatus, setOrderStatus] = useState('placed');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Launch confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) return clearInterval(interval);

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  // Poll for status updates
  useEffect(() => {
    if (!orderId) return;

    const fetchStatus = async () => {
      try {
        const response = await trackOrder(orderId);
        if (response.success && response.data.status !== orderStatus) {
          setOrderStatus(response.data.status);
          setIsUpdating(true);
          setTimeout(() => setIsUpdating(false), 2000);
        }
      } catch (err) {
        console.error("Failed to fetch order status", err);
      }
    };

    fetchStatus();
    const pollInterval = setInterval(fetchStatus, 5000);
    return () => clearInterval(pollInterval);
  }, [orderId, orderStatus]);

  const statusMap = {
    'placed': { label: 'Catching Fresh', color: 'bg-blue-500' },
    'confirmed': { label: 'Order Confirmed', color: 'bg-emerald-500' },
    'packed': { label: 'Sourcing Quality', color: 'bg-orange-500' },
    'shipped': { label: 'At Sea / Transit', color: 'bg-purple-500' },
    'delivered': { label: 'Docked / Delivered', color: 'bg-green-500' },
    'cancelled': { label: 'Cancelled', color: 'bg-red-500' }
  };

  const currentStatus = statusMap[orderStatus] || statusMap['placed'];

  return (
    <>
      <Helmet>
        <title>Order Confirmed | TajaShutki</title>
      </Helmet>
      <div className="bg-[#F4F7FA] min-h-screen py-10 md:py-16 flex items-center relative overflow-hidden">
        {/* Animated Background Shapes - Sea themed colors */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -left-32 w-64 md:w-96 h-64 md:h-96 bg-blue-100/30 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-32 -right-32 w-64 md:w-96 h-64 md:h-96 bg-slate-200/30 rounded-full blur-3xl"
        />

        <div className="container-custom max-w-6xl mx-auto relative z-10 px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Success Card */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7 bg-white rounded-[40px] md:rounded-[60px] p-8 md:p-16 text-center shadow-[0_40px_120px_-20px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden"
            >
              <motion.div 
                initial={{ rotate: -180, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 15, delay: 0.2 }}
                className="w-20 md:w-28 h-20 md:h-28 bg-slate-900 text-white rounded-[24px] md:rounded-[32px] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-slate-900/20"
              >
                <CheckCircle2 size={40} className="md:w-14 md:h-14" strokeWidth={2.5} />
              </motion.div>

              <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-black text-slate-900 mb-4 tracking-tight">Got it! Order Confirmed.</h1>
              <p className="text-slate-500 mb-10 text-base md:text-lg leading-relaxed max-w-lg mx-auto">
                Thank you for choosing TajaShutki. Your premium dried delicacies are being sourced and packed with care.
              </p>

              <div className="bg-slate-50 rounded-[30px] md:rounded-[40px] p-6 md:p-10 mb-10 border border-slate-100 group hover:border-slate-900/10 transition-all">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Order Number</p>
                <h2 className="text-2xl md:text-4xl font-display font-black text-slate-900 tracking-wider mb-8">{orderId || 'ORDER-PENDING'}</h2>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link 
                    to={`/track?id=${orderId}`}
                    className="flex-1 flex items-center justify-center gap-2 px-6 md:px-8 py-4 md:py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-800 transition-all hover:shadow-xl active:scale-95"
                  >
                    <Truck size={18} />
                    Track Order
                  </Link>
                  <a 
                    href={`https://wa.me/${(settings.whatsapp_number || settings.phone || '8801851075537').replace(/[^0-9]/g, '')}?text=Hi, I want to track my order #${orderId}. Current status is: ${orderStatus}.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 md:px-8 py-4 md:py-5 bg-[#25D366] text-white rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-[#1da851] transition-all hover:shadow-xl active:scale-95 shadow-lg shadow-green-100"
                  >
                    <MessageCircle size={18} />
                    WhatsApp Support
                  </a>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8">
                <div className="flex items-center gap-3 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-100">
                  <motion.div 
                    animate={isUpdating ? { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] } : {}}
                    className={`w-2 h-2 ${currentStatus.color} rounded-full animate-pulse`} 
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-800">
                    Status: <span className="text-blue-600">{currentStatus.label}</span>
                  </span>
                </div>
                <Link to="/shop" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-2 group">
                  Back to Shop <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </motion.div>

            {/* Right Column: Next Steps & Promo */}
            <div className="lg:col-span-5 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-[30px] md:rounded-[40px] p-8 md:p-10 border border-slate-100 shadow-soft"
              >
                <h4 className="text-xl font-display font-black text-slate-900 mb-8">What's Next?</h4>
                <div className="space-y-8">
                  {[
                    { icon: ShoppingBag, title: "Sourcing", desc: "We select the best quality dried fish for you.", active: orderStatus === 'placed' },
                    { icon: Truck, title: "Audit", desc: "Each item passes a hygiene and quality audit.", active: orderStatus === 'shipped' },
                    { icon: CheckCircle2, title: "Delivering", desc: "Straight from the coast to your kitchen.", active: orderStatus === 'delivered' }
                  ].map((step, i) => (
                    <div key={i} className={`flex gap-5 relative ${step.active ? 'opacity-100' : 'opacity-40'}`}>
                      <div className={`w-12 h-12 ${step.active ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-400'} rounded-2xl flex items-center justify-center shrink-0 transition-all duration-500`}>
                        <step.icon size={20} />
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-black text-slate-900 mb-1 uppercase tracking-tight">{step.title}</p>
                        <p className="text-xs md:text-sm text-slate-500 leading-relaxed font-medium">{step.desc}</p>
                      </div>
                      {step.active && (
                        <motion.div 
                          layoutId="active-indicator"
                          className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-full"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-slate-900 rounded-[30px] md:rounded-[40px] p-8 md:p-10 text-white relative overflow-hidden group"
              >
                <div className="relative z-10">
                  <h4 className="text-2xl font-display font-black mb-3 tracking-wider">Loyalty Reward 🌊</h4>
                  <p className="text-sm text-white/60 mb-8 leading-relaxed font-medium">As a valued customer, get 10% off on your next haul.</p>
                  <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 flex justify-between items-center group-hover:bg-white/10 transition-all">
                    <span className="font-mono font-black text-xl tracking-[0.2em] uppercase text-blue-300">TAJA10</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText('TAJA10');
                        alert('Code copied!');
                      }}
                      className="text-[10px] font-black uppercase tracking-widest bg-blue-500 text-white px-5 py-3 rounded-xl shadow-lg active:scale-95 transition-transform"
                    >
                      Copy
                    </button>
                  </div>
                </div>
                {/* Wave Decoration */}
                <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700" />
              </motion.div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
