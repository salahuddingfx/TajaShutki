import { Link, useLocation } from 'react-router-dom';
import { Home, ShoppingBag, Heart, ShoppingCart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCartCount } from '@/store/cartSlice';
import { selectWishlistItems } from '@/store/wishlistSlice';
import { clsx } from 'clsx';

const BottomNav = () => {
  const location = useLocation();
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistItems).length;

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Shop', icon: ShoppingBag, path: '/shop' },
    { name: 'Wishlist', icon: Heart, path: '/wishlist', badge: wishlistCount },
    { name: 'Cart', icon: ShoppingCart, path: '/cart', badge: cartCount },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-white/80 backdrop-blur-xl border-t border-slate-100 px-6 py-3 pb-8 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              to={item.path}
              className={clsx(
                "relative flex flex-col items-center gap-1 transition-all duration-300",
                isActive ? "text-maroon scale-110" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <div className={clsx(
                "p-2 rounded-xl transition-all",
                isActive && "bg-maroon/5"
              )}>
                <Icon size={20} className={isActive ? "fill-maroon/10" : ""} />
              </div>
              
              {item.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-maroon text-white text-[8px] font-black flex items-center justify-center rounded-full border-2 border-white">
                  {item.badge}
                </span>
              )}
              
              <span className="text-[9px] font-black uppercase tracking-widest">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
