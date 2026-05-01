import { useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ShoppingBag, Truck, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Helmet } from 'react-helmet-async';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const orderId = searchParams.get('id');

  useEffect(() => {
    // Launch confetti
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Order Success | Taja Shutki</title>
      </Helmet>
      <div className="bg-cream min-h-screen py-20 flex items-center">
        <div className="container-custom max-w-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[48px] p-12 text-center shadow-premium border border-slate-100 overflow-hidden relative"
          >
            {/* Decorative background circle */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-maroon/5 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-maroon/5 rounded-full blur-3xl"></div>

            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", damping: 12, delay: 0.2 }}
              className="w-24 h-24 bg-maroon text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-maroon/30"
            >
              <CheckCircle2 size={48} />
            </motion.div>

            <h1 className="text-4xl font-display font-black text-slate-800 mb-4">Order Received!</h1>
            <p className="text-slate-500 mb-10 text-lg">Thank you for ordering from Taja Shutki. We're processing your premium seafood selection!</p>

            <div className="bg-slate-50 rounded-3xl p-8 mb-10 border border-slate-100">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Order Tracking ID</div>
              <div className="text-3xl font-display font-black text-maroon tracking-wider mb-6">{orderId || 'ORDER-PENDING'}</div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to={`/track-order?id=${orderId}`}
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-105"
                >
                  <Truck size={20} />
                  Track Status
                </Link>
                <Link 
                  to="/"
                  className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-700 border-2 border-slate-100 rounded-2xl font-bold hover:border-maroon hover:text-maroon transition-all"
                >
                  Return Home
                  <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            <p className="text-slate-400 text-sm">
              We'll notify you as soon as your package leaves our warehouse.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccess;
