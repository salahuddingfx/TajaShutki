import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, ChevronDown, Heart, Phone, MessageCircle, Globe, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { selectCategories } from '../store/settingsSlice';
import { selectWishlistItems } from '../store/wishlistSlice';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/api/api';

import { useLanguage } from '@/context/LanguageContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const cartItemsCount = useSelector(selectCartCount);
  const categories = useSelector(selectCategories);
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setIsSearching(true);
        try {
          const results = await api.searchProducts(searchQuery);
          setSearchResults(results);
        } catch (error) {
          console.error("Search failed", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: 'Reviews', href: '/reviews' },
    { name: 'About', href: '/about' },
    { name: 'Track', href: '/track' },
    { name: 'Contact', href: '/contact' },
  ];

  const { language, toggleLanguage } = useLanguage();

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
      searchPlaceholder: "Search for seafood...",
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
      searchPlaceholder: "খুঁজুন...",
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
        ? "bg-white/95 backdrop-blur-xl border-b border-slate-100 h-14 md:h-16 shadow-lg" 
        : "bg-white/80 backdrop-blur-md border-b border-black/[0.03] h-16 md:h-20"
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
              "w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center font-black italic transition-all duration-500 group-hover:rotate-12",
              "bg-maroon text-cream shadow-lg shadow-maroon/20"
            )}>
              T
            </div>
            <span className="text-lg md:text-xl font-display font-black tracking-tighter text-slate-900">
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
                "text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 hover:text-maroon relative group",
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
              className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-maroon transition-all duration-500"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Icons Area */}
        <div className="flex items-center gap-4">
          {/* Language Switcher */}
          <button 
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="hidden md:flex items-center gap-2 px-3 py-2 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all text-[10px] font-black text-maroon border border-maroon/10 uppercase tracking-tighter"
          >
            <Globe size={14} className="text-maroon" />
            {language === 'en' ? 'BN' : 'EN'}
          </button>
          {/* Search */}
          <div className="">
            <AnimatePresence>
              {searchOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="fixed inset-x-0 top-0 h-24 bg-white/95 backdrop-blur-2xl z-[120] flex items-center shadow-2xl border-b border-slate-100"
                >
                  <div className="container-custom flex items-center gap-6">
                    <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center gap-4">
                      <Search size={24} className="text-maroon shrink-0" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                        placeholder={t.searchPlaceholder}
                        className="w-full bg-transparent border-none outline-none text-xl font-bold text-slate-800 placeholder:text-slate-300"
                      />
                      {isSearching && <Loader2 size={20} className="animate-spin text-maroon" />}
                    </form>
                    <button 
                      onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                      className="p-3 bg-slate-100 hover:bg-maroon hover:text-white rounded-2xl transition-all"
                    >
                      <X size={24} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <button
              onClick={() => setSearchOpen(true)}
              className={clsx(
                "p-3 md:p-4 rounded-2xl transition-all duration-500 hover:scale-110",
                isScrolled ? "text-slate-800 hover:bg-slate-100" : "text-slate-800 hover:bg-slate-100"
              )}
            >
              <Search size={20} />
            </button>

            {/* Autocomplete Results Dropdown */}
            <AnimatePresence>
              {searchResults.length > 0 && searchOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full right-0 mt-4 w-72 md:w-96 bg-white rounded-3xl shadow-premium border border-black/[0.03] overflow-hidden z-[100]"
                >
                  <div className="p-2">
                    {searchResults.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={() => { setSearchOpen(false); setSearchQuery(''); setSearchResults([]); }}
                        className="flex items-center gap-3 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                          <img src={p.images?.[0]?.image_path || p.image_path} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-xs font-bold text-slate-800 truncate">{p.name}</p>
                          <p className="text-[10px] font-black text-maroon uppercase tracking-widest">৳{p.price}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/wishlist" className="hidden md:flex relative group">
            <div className={clsx(
              "p-4 rounded-2xl transition-all duration-500 group-hover:scale-110",
              isScrolled ? "text-slate-800 hover:bg-slate-100" : "text-slate-800 hover:bg-slate-100"
            )}>
              <Heart size={22} className={useSelector(selectWishlistItems).length > 0 ? "fill-maroon text-maroon" : ""} />
            </div>
          </Link>
          
          <Link to="/cart" className="relative group">
            <div className={clsx(
              "p-3 md:p-4 rounded-2xl transition-all duration-500 group-hover:scale-110",
              isScrolled ? "bg-maroon text-white shadow-xl shadow-maroon/20" : "bg-maroon text-white shadow-lg shadow-maroon/20"
            )}>
              <ShoppingBag size={20} />
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-6 h-6 bg-maroon text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                  {cartItemsCount}
                </span>
              )}
            </div>
          </Link>

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
                  onClick={toggleLanguage}
                  className="px-4 py-2 bg-slate-50 rounded-xl text-[10px] font-black text-maroon border border-maroon/10"
                >
                  {language === 'en' ? 'বাংলা' : 'ENGLISH'}
                </button>
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
                      { name: t.wishlist, href: '/wishlist' },
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
