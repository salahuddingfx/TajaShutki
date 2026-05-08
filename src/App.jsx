import { useEffect, useRef, useCallback, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'sonner';

// Lazy load pages for performance
const Home = lazy(() => import('@/pages/Home'));
const Shop = lazy(() => import('@/pages/Shop'));
const ProductDetails = lazy(() => import('@/pages/ProductDetails'));
const Cart = lazy(() => import('@/pages/Cart'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const OrderTracking = lazy(() => import('@/pages/OrderTracking'));
const Contact = lazy(() => import('@/pages/Contact'));
const About = lazy(() => import('@/pages/About'));
const Reviews = lazy(() => import('@/pages/Reviews'));
const FAQ = lazy(() => import('@/pages/FAQ'));
const PrivacyPolicy = lazy(() => import('@/pages/PrivacyPolicy'));
const Terms = lazy(() => import('@/pages/Terms'));
const OrderSuccess = lazy(() => import('@/pages/OrderSuccess'));
const Wishlist = lazy(() => import('@/pages/Wishlist'));
const Developer = lazy(() => import('@/pages/Developer'));
const NotFound = lazy(() => import('@/pages/NotFound'));

import Layout from '@/components/Layout';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageSkeleton from '@/components/PageSkeleton';
import { fetchProducts } from './store/productsSlice';
import { setInitData } from './store/settingsSlice';
import { getInitData, getVersion } from './api/api';
import { selectCartItems } from './store/cartSlice';
import { usePolling } from './hooks/usePolling';
import PushNotificationPrompt from './components/PushNotificationPrompt';

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
    <Suspense fallback={<PageSkeleton />}>
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
          <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

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
    
    // Clear notification badge if supported
    if ('clearAppBadge' in navigator) {
      navigator.clearAppBadge().catch(console.error);
    }

    // Dynamic circular favicon logic
    const updateFavicon = (src) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 128;
        canvas.height = 128;
        const ctx = canvas.getContext('2d');
        
        // Ensure perfect circular clipping
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
    
    const timer = setTimeout(() => updateFavicon('/TajaShutki.png'), 500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Smart data sync — version-polling + visibility/focus + BroadcastChannel
  const versionRef = useRef(null);

  const refetchAll = useCallback(() => {
    dispatch(fetchProducts());
    getInitData().then(res => dispatch(setInitData(res.data))).catch(console.error);
  }, [dispatch]);

  // Check version — if changed, refetch everything
  const checkVersion = useCallback(async () => {
    try {
      const res = await getVersion();
      const serverVersion = res?.version ?? 0;
      if (versionRef.current !== null && versionRef.current !== serverVersion) {
        versionRef.current = serverVersion;
        refetchAll();
      } else if (versionRef.current === null) {
        versionRef.current = serverVersion;
      }
    } catch (e) {}
  }, [refetchAll]);

  // Poll version every 10s (lightweight — just a number)
  usePolling(checkVersion, 10000);

  // Refetch on tab focus / visibility change (user comes back to tab)
  useEffect(() => {
    const onFocus = () => checkVersion();
    const onVisible = () => { if (document.visibilityState === 'visible') checkVersion(); };
    window.addEventListener('focus', onFocus);
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.removeEventListener('focus', onFocus);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [checkVersion]);

  // BroadcastChannel — instant update from admin in same browser
  useEffect(() => {
    let channel;
    try {
      channel = new BroadcastChannel('multivendor-storefront');
      channel.onmessage = (event) => {
        if (event.data?.type === 'data-changed') {
          versionRef.current = null;
          refetchAll();
        }
      };
    } catch (e) {}
    return () => { try { if (channel) channel.close(); } catch (e) {} };
  }, [refetchAll]);

  return (
    <Router>
      <Toaster richColors position="top-right" />
      <Layout>
        <ErrorBoundary>
          <AnimatedRoutes />
        </ErrorBoundary>
        <PushNotificationPrompt siteId={2} />
      </Layout>
    </Router>
  );
}

export default App;
