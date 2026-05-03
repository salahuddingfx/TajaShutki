import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, Plus, Star, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { toggleWishlist, selectWishlistItems } from '@/store/wishlistSlice';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import { useLanguage } from '@/context/LanguageContext';

const ProductCard = ({ product }) => {
  const { language, t: translate } = useLanguage();
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);
  const navigate = useNavigate();

  const handleOrderNow = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    dispatch(addItem({ product }));
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (product.stock <= 0) return;
    dispatch(addItem({ product }));
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    dispatch(toggleWishlist(product));
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={clsx(
        "group relative bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-500 h-full flex flex-col",
        product.stock <= 0 && "opacity-75"
      )}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50/50">
        <img 
          src={product.images?.find(i => i.is_primary)?.image_path || (product.images && product.images.length > 0 ? product.images[0].image_path : (product.image_path || product.image || 'https://images.unsplash.com/photo-1514516348920-f319999a5e8f?q=80&w=400&auto=format&fit=crop'))} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className={clsx(
            "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
            product.stock <= 0 && "grayscale brightness-75"
          )}
        />
        
        {/* Stock Badge */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          {product.stock <= 0 ? (
            <span className="bg-slate-900/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-xl">
              Out of Stock
            </span>
          ) : product.stock <= 10 ? (
            <span className="bg-amber-500/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-xl animate-pulse">
              Only {product.stock} Left
            </span>
          ) : (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-xl">
              In Stock
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {product.original_price && Number(product.original_price) > Number(product.price) && (
          <div className="absolute top-4 right-4 z-10">
            <span className="bg-maroon/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-xl shadow-xl animate-pulse">
              {Math.round(((Number(product.original_price) - Number(product.price)) / Number(product.original_price)) * 100)}% OFF
            </span>
          </div>
        )}

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-3">
           <Link 
             to={`/product/${product.slug || product.id}`}
             className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-maroon hover:text-white transition-all scale-75 group-hover:scale-100 duration-500 delay-75 shadow-xl"
           >
             <Eye size={22} />
           </Link>
           <button 
             onClick={handleAddToCart}
             disabled={product.stock <= 0}
             className={`w-14 h-14 rounded-full bg-white flex items-center justify-center transition-all scale-75 group-hover:scale-100 duration-500 delay-150 shadow-xl ${
               product.stock > 0 ? 'text-slate-900 hover:bg-maroon hover:text-white' : 'text-slate-300 cursor-not-allowed'
             }`}
           >
             <ShoppingBag size={22} />
           </button>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isWishlisted ? 'bg-maroon text-white shadow-lg' : 'bg-white text-slate-400 hover:text-maroon shadow-md'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>


      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow mb-3">
          <Link 
            to={`/product/${product.slug || product.id}`}
            className={clsx(
              "text-xs font-black text-slate-800 hover:text-maroon transition-colors line-clamp-1 uppercase tracking-tight",
              language === 'bn' && "text-[14px] leading-tight" // Slightly bigger for Bengali font
            )}
          >
            {translate(product.name, product.name_bn)}
          </Link>
        </div>

        <div className="flex items-end justify-between gap-4 mt-auto">
          <div className="flex flex-col">
            <span className="text-lg font-black text-slate-900 tracking-tighter">৳{product.price}</span>
            {product.original_price && Number(product.original_price) > Number(product.price) && (
              <span className="text-[10px] text-slate-400 line-through font-bold tracking-tight">৳{product.original_price}</span>
            )}
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className={clsx(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-sm",
                product.stock > 0 
                  ? "bg-slate-100 text-slate-900 hover:bg-slate-200" 
                  : "bg-slate-100 text-slate-300 cursor-not-allowed"
              )}
              title="Add to Cart"
            >
              <ShoppingBag size={18} />
            </button>
            <button 
              onClick={handleOrderNow}
              disabled={product.stock <= 0}
              className={clsx(
                "px-4 h-10 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md",
                product.stock > 0 
                  ? "bg-maroon text-white hover:bg-maroon/90 hover:-translate-y-0.5 shadow-maroon/20" 
                  : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              )}
            >
              <span className="text-[10px] font-black uppercase tracking-widest">Order</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
