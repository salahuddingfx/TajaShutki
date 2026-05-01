import { useSelector } from 'react-redux';
import { selectWishlistItems } from '@/store/wishlistSlice';
import ProductCard from '@/components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';

const Wishlist = () => {
  const wishlistItems = useSelector(selectWishlistItems);

  return (
    <>
      <Helmet>
        <title>My Wishlist | Taja Shutki</title>
      </Helmet>
      <div className="bg-cream min-h-screen py-20">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-2">Saved Items</h1>
              <p className="text-slate-500 font-medium">Seafood treasures you've saved for later.</p>
            </div>
            <Link to="/shop" className="btn-primary flex items-center gap-2">
              <ShoppingBag size={20} />
              Back to Shop
            </Link>
          </div>

          {wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {wishlistItems.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-32 bg-white rounded-[64px] border border-slate-100 shadow-soft"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Heart size={40} className="text-slate-200" />
              </div>
              <h3 className="text-2xl font-display font-black text-slate-800 mb-4">No Saved Items</h3>
              <p className="text-slate-400 mb-10 max-w-md mx-auto">Your wishlist is lonely! Add some premium dried fish to keep it company.</p>
              <Link to="/shop" className="text-maroon font-black uppercase tracking-widest text-sm hover:scale-110 transition-transform inline-block">
                Start Shopping
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
};

export default Wishlist;
