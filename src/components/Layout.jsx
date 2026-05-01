import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ScrollToTop from '../components/ScrollToTop';
import BottomNav from '../components/BottomNav';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-maroon selection:text-cream">
      <Navbar />
      <main className="flex-grow pt-20 pb-20 md:pb-0">
        {children}
      </main>
      <Footer />
      <BottomNav />
      <ScrollToTop />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Layout;
