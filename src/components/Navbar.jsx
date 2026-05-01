import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, X, Search, ChevronDown, Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '../store/cartSlice';
import { selectCategories } from '../store/settingsSlice';
import { selectWishlistItems } from '../store/wishlistSlice';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

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
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) searchInputRef.current.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
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

  return (
    <nav className={clsx(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-700 flex items-center",
      isScrolled ? "bg-white/80 backdrop-blur-2xl border-b border-black/[0.03] h-20 shadow-premium" : "bg-white/5 backdrop-blur-xl border-b border-white/5 h-28"
    )}>
      <div className="container-custom flex items-center justify-between w-full">
        {/* Mobile Menu Toggle */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={clsx(
            "lg:hidden p-3 rounded-2xl transition-all",
            isScrolled ? "bg-slate-100 text-slate-800" : "bg-white/10 text-white backdrop-blur-md"
          )}
        >
          <Menu size={24} />
        </button>

        {/* Logo */}
        <Link to="/" className="group relative flex items-center gap-4">
          <div className={clsx(
            "w-12 h-12 rounded-2xl flex items-center justify-center font-black italic transition-all duration-500 group-hover:rotate-12",
            isScrolled ? "bg-maroon text-cream shadow-xl shadow-maroon/20" : "bg-white text-maroon shadow-2xl shadow-black/20"
          )}>
            T
          </div>
          <span className={clsx(
            "text-2xl font-display font-black tracking-tighter transition-colors duration-500",
            isScrolled ? "text-slate-900" : "text-white"
          )}>
            Taja<span className="text-maroon">Shutki</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={clsx(
                "text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:text-maroon relative group",
                isScrolled ? "text-slate-500" : "text-slate-900/60"
              )}
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-maroon transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}

          {/* Categories Button */}
          <div 
            className="relative group"
            onMouseEnter={() => setIsCategoriesOpen(true)}
            onMouseLeave={() => setIsCategoriesOpen(false)}
          >
            <button className={clsx(
              "flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:text-maroon",
              isScrolled ? "text-slate-500" : "text-slate-900/60"
            )}>
               Categories <ChevronDown size={14} className={clsx("transition-transform duration-500", isCategoriesOpen && "rotate-180")} />
            </button>
            
            <AnimatePresence>
              {isCategoriesOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-4 w-64 bg-white rounded-[32px] shadow-premium p-6 border border-black/[0.03] backdrop-blur-xl"
                >
                  <div className="grid grid-cols-1 gap-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        to={`/shop?category=${cat.name}`}
                        className="px-4 py-3 rounded-xl hover:bg-slate-50 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-maroon transition-all"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {navLinks.slice(3).map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={clsx(
                "text-[10px] font-black uppercase tracking-[0.3em] transition-all duration-500 hover:text-maroon relative group",
                isScrolled ? "text-slate-500" : "text-slate-900/60"
              )}
            >
              {link.name}
              <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-maroon transition-all duration-500 group-hover:w-full" />
            </Link>
          ))}
        </div>

        {/* Icons Area */}
        <div className="flex items-center gap-4">
          {/* Search */}
          {searchOpen ? (
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Escape' && setSearchOpen(false)}
                placeholder="Search products..."
                className={clsx(
                  "w-48 px-4 py-2.5 rounded-2xl text-sm font-medium outline-none border-2 transition-all duration-300",
                  isScrolled
                    ? "bg-slate-50 border-slate-200 text-slate-800 focus:border-maroon"
                    : "bg-white/90 border-transparent text-slate-800 focus:border-maroon"
                )}
              />
              <button type="submit" className={clsx(
                "p-2.5 rounded-2xl transition-all",
                isScrolled ? "text-maroon hover:bg-maroon/10" : "text-maroon bg-white/90 hover:bg-white"
              )}>
                <Search size={18} />
              </button>
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-slate-400 hover:text-slate-700">
                <X size={18} />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className={clsx(
                "p-3 md:p-4 rounded-2xl transition-all duration-500 hover:scale-110",
                isScrolled ? "text-slate-800 hover:bg-slate-100" : "text-slate-900 hover:bg-black/5"
              )}
            >
              <Search size={20} />
            </button>
          )}

          <Link to="/wishlist" className="hidden md:flex relative group">
            <div className={clsx(
              "p-4 rounded-2xl transition-all duration-500 group-hover:scale-110",
              isScrolled ? "text-slate-800 hover:bg-slate-100" : "text-slate-900 hover:bg-black/5"
            )}>
              <Heart size={22} className={useSelector(selectWishlistItems).length > 0 ? "fill-maroon text-maroon" : ""} />
            </div>
          </Link>
          
          <Link to="/cart" className="relative group">
            <div className={clsx(
              "p-3 md:p-4 rounded-2xl transition-all duration-500 group-hover:scale-110",
              isScrolled ? "bg-slate-950 text-white shadow-xl shadow-slate-900/20" : "bg-white text-slate-950 shadow-2xl"
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
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-[60] bg-white p-10 flex flex-col"
          >
            <div className="flex justify-between items-center mb-20">
              <span className="text-3xl font-display font-black tracking-tighter">Taja<span className="text-maroon">Shutki</span></span>
              <button onClick={() => setIsMenuOpen(false)} className="p-4 bg-slate-100 rounded-2xl"><X size={24} /></button>
            </div>
            <div className="space-y-8">
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 mb-4">Explore Categories</p>
              <div className="flex flex-wrap gap-3 mb-12">
                {categories.map(cat => (
                  <Link 
                    key={cat.id} 
                    to={`/shop?category=${cat.name}`} 
                    onClick={() => setIsMenuOpen(false)}
                    className="px-6 py-3 bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <div className="space-y-10">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.href} 
                    onClick={() => setIsMenuOpen(false)}
                    className="block text-5xl font-display font-black text-slate-900 hover:text-maroon transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
