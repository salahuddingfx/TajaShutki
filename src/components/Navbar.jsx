import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Menu, X, Search, ChevronDown, Phone, MessageCircle, Globe, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { selectCategories } from '../store/settingsSlice';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/api';

import { useLanguage } from '@/context/LanguageContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartItemsCount = useSelector(selectCartCount);
  const categories = useSelector(selectCategories);
  const location = useLocation();
  const navigate = useNavigate();
  const clickTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const { language, t: translate } = useLanguage();

  const translations = {
    en: {
      menu: "Menu",
      categories: "Categories",
      home: "Home",
      shop: "Shop",
      track: "Track Order",
      wishlist: "Wishlist",
      about: "About Us",
      contact: "Contact",
      cart: "Cart"
    },
    bn: {
      menu: "মেনু",
      categories: "ক্যাটাগরি",
      home: "হোম",
      shop: "দোকান",
      track: "অর্ডার ট্র্যাক",
      wishlist: "উইশলিস্ট",
      about: "আমাদের সম্পর্কে",
      contact: "যোগাযোগ",
      cart: "কার্ট"
    }
  };

  const t = translations[language];

  const mainLinks = [
    { name: t.home, href: '/' },
    { name: t.shop, href: '/shop' },
  ];

  return (
    <nav className={clsx(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-500 flex items-center px-4 md:px-8",
      isScrolled 
        ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 h-12 md:h-14 shadow-lg" 
        : "bg-white/80 backdrop-blur-md border-b border-black/[0.03] h-14 md:h-16"
    )}>
      <div className="container-custom flex items-center justify-between w-full">
        <div className="flex items-center gap-3 md:gap-6">
          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="xl:hidden p-2 rounded-xl bg-slate-100 text-slate-800 transition-all active:scale-90"
          >
            <Menu size={20} />
          </button>

          {/* Logo */}
          <Link to="/" className="group relative flex items-center gap-2 md:gap-3">
            <div className={clsx(
              "w-7 h-7 md:w-9 md:h-9 rounded-xl flex items-center justify-center font-black italic transition-all duration-500 group-hover:scale-110 group-active:scale-95 group-hover:-translate-y-1",
              "bg-maroon text-cream shadow-lg shadow-maroon/20"
            )}>
              T
            </div>
            <span className="text-lg md:text-xl font-display font-black tracking-tighter text-slate-900 group-hover:text-maroon transition-colors">
              Taja<span className="text-maroon">Shutki</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden xl:flex items-center gap-5 2xl:gap-8">
          {mainLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={clsx(
                "text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:text-maroon relative group",
                location.pathname === link.href ? "text-maroon" : "text-slate-600"
              )}
            >
              {link.name}
              <span className={clsx(
                "absolute -bottom-1 left-0 w-0 h-0.5 bg-maroon transition-all duration-500 group-hover:w-full",
                location.pathname === link.href && "w-full"
              )} />
            </Link>
          ))}

          <div className="w-px h-4 bg-slate-100 mx-2" />

          {[
            { name: t.track, href: '/track' },
            { name: t.about, href: '/about' },
            { name: t.contact, href: '/contact' },
          ].map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-maroon transition-all duration-500"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons Area */}
        <div className="flex items-center gap-4">
          <div 
            className="relative group cursor-pointer"
            onClick={(e) => {
              if (clickTimer.current) {
                clearTimeout(clickTimer.current);
                clickTimer.current = null;
                navigate('/');
              } else {
                clickTimer.current = setTimeout(() => {
                  clickTimer.current = null;
                  navigate('/cart');
                }, 300);
              }
            }}
          >
            <div className={clsx(
              "w-7 h-7 md:w-9 md:h-9 rounded-xl transition-all duration-500 flex items-center justify-center group-hover:scale-110 group-active:scale-95 group-hover:-translate-y-1",
              "bg-maroon text-white shadow-lg shadow-maroon/20"
            )}>
              <ShoppingCart size={16} className="md:w-[18px] md:h-[18px]" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 md:w-5 md:h-5 bg-slate-900 text-white text-[8px] md:text-[9px] font-black rounded-full flex items-center justify-center shadow-lg border-2 border-white group-hover:bg-maroon transition-colors">
                  {cartItemsCount}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            key="mobile-menu-overlay"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-0 z-[9999] bg-white flex flex-col h-[100dvh] w-full"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 h-20 border-b border-slate-100 bg-white z-20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-maroon rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shadow-maroon/20">T</div>
                <span className="text-xl font-display font-black tracking-tighter text-slate-900">Taja<span className="text-maroon">Shutki</span></span>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMenuOpen(false)} 
                  className="p-3 bg-slate-50 rounded-full text-slate-400 active:scale-90 transition-transform"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 bg-white z-10">
              <div className="space-y-8 pb-20">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">{t.menu}</p>
                  <div className="flex flex-col gap-2">
                    {[
                      { name: t.home, href: '/' },
                      { name: t.shop, href: '/shop' },
                      { name: t.track, href: '/track' },
                      { name: t.about, href: '/about' },
                      { name: t.contact, href: '/contact' },
                    ].map((link) => {
                      const isActive = location.pathname === link.href;
                      return (
                        <Link 
                          key={link.name} 
                          to={link.href} 
                          onClick={() => setIsMenuOpen(false)}
                          className={clsx(
                            "px-6 py-4 rounded-2xl text-lg font-bold transition-all flex items-center justify-between group",
                            isActive 
                              ? "bg-maroon text-white shadow-xl shadow-maroon/30 -translate-y-1" 
                              : "text-slate-600 hover:bg-slate-50"
                          )}
                        >
                          {link.name}
                          {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-6 px-4">ক্যাটাগরি</p>
                  <div className="grid grid-cols-2 gap-3">
                    {categories.map(cat => (
                      <Link 
                        key={cat.id} 
                        to={`/shop?category=${cat.name}`} 
                        onClick={() => setIsMenuOpen(false)}
                        className="px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 hover:bg-maroon hover:text-white transition-all active:scale-95"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
