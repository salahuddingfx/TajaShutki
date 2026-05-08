import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetails from '@/pages/ProductDetails';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';
import Contact from '@/pages/Contact';
import About from '@/pages/About';
import Reviews from '@/pages/Reviews';
import FAQ from '@/pages/FAQ';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import OrderSuccess from '@/pages/OrderSuccess';
import Wishlist from '@/pages/Wishlist';
import Developer from '@/pages/Developer';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './store/productsSlice';
import { setInitData } from './store/settingsSlice';
import { getInitData } from './api/api';
import { motion, AnimatePresence } from 'framer-motion';

const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
);

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/shop" element={<PageTransition><Shop /></PageTransition>} />
        <Route path="/product/:id" element={<PageTransition><ProductDetails /></PageTransition>} />
        <Route path="/cart" element={<PageTransition><Cart /></PageTransition>} />
        <Route path="/checkout" element={<PageTransition><Checkout /></PageTransition>} />
        <Route path="/track" element={<PageTransition><OrderTracking /></PageTransition>} />
        <Route path="/track-order" element={<PageTransition><OrderTracking /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/reviews" element={<PageTransition><Reviews /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
        <Route path="/order-success" element={<PageTransition><OrderSuccess /></PageTransition>} />
        <Route path="/wishlist" element={<PageTransition><Wishlist /></PageTransition>} />
        <Route path="/developer" element={<PageTransition><Developer /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

import { Toaster, toast } from 'sonner';
import { useSelector } from 'react-redux';
import { selectCartItems } from './store/cartSlice';

function App() {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);

  useEffect(() => {
    // Abandoned Cart Nudge Logic
    if (cartItems.length > 0) {
      const lastNudge = localStorage.getItem('tajashutki-cart-nudge');
      const now = Date.now();
      
      // Only nudge once every 24 hours to avoid annoyance
      if (!lastNudge || (now - parseInt(lastNudge)) > 24 * 60 * 60 * 1000) {
        setTimeout(() => {
          toast.info("Still thinking about it? 🐟", {
            description: "Your favorite dry fish items are still in your cart. Checkout now!",
            action: {
              label: 'View Cart',
              onClick: () => window.location.href = '/cart'
            },
            duration: 8000,
            style: {
              background: '#475569',
              color: 'white',
              borderRadius: '20px',
              border: 'none'
            }
          });
          localStorage.setItem('tajashutki-cart-nudge', now.toString());
        }, 3000); // 3 second delay after load
      }
    }
  }, [cartItems.length]);

  useEffect(() => {
    dispatch(fetchProducts());
    
    const init = async () => {
      try {
        const res = await getInitData();
        dispatch(setInitData(res.data));
      } catch (err) {
        console.error("Initialization failed", err);
      }
    };
    init();

    // Round favicon logic
    const roundFavicon = (src) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        ctx.beginPath();
        ctx.arc(64, 64, 64, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();
        
        ctx.drawImage(img, 0, 0, 128, 128);
        
        const link = document.getElementById('favicon');
        if (link) {
          link.href = canvas.toDataURL("image/png");
        }
      };
      img.src = src + '?v=' + Date.now();
    };
    
    // Use a small delay to ensure link is in DOM
    const timer = setTimeout(() => roundFavicon('/TajaShutki.png'), 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </Router>
  );
}

export default App;
