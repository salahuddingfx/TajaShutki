import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppFloat from '../components/WhatsAppFloat';
import BottomNav from '../components/BottomNav';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Toaster } from 'sonner';
import { clsx } from 'clsx';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen font-sans selection:bg-maroon selection:text-cream">
      <Navbar />
      <main className={clsx(
        "flex-grow pb-20 md:pb-0",
        pathname === '/' ? "pt-0" : "pt-16"
      )}>
        {children}
      </main>
      <Footer />
      <BottomNav />
      <WhatsAppFloat />
      <Toaster richColors position="top-right" />
    </div>
  );
};

export default Layout;
