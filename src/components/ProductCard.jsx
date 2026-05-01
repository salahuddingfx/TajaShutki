import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Plus, Star, Heart } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { toggleWishlist, selectWishlistItems } from '@/store/wishlistSlice';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(selectWishlistItems);
  const isWishlisted = wishlistItems.some(item => item.id === product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
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
      className="group relative bg-white rounded-[40px] shadow-premium border border-black/[0.01] overflow-hidden hover:-translate-y-4 transition-all duration-700 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden rounded-t-[40px]">
        <img 
          src={product.image_path || product.image} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
           <Link 
             to={`/product/${product.slug || product.id}`}
             className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-maroon hover:text-white transition-all scale-75 group-hover:scale-100 duration-500 delay-75 shadow-xl"
           >
             <Eye size={22} />
           </Link>
           <button 
             onClick={handleAddToCart}
             className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-maroon hover:text-white transition-all scale-75 group-hover:scale-100 duration-500 delay-150 shadow-xl"
           >
             <ShoppingBag size={22} />
           </button>
        </div>

        {/* Wishlist Button */}
        <button 
          onClick={handleWishlist}
          className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isWishlisted ? 'bg-maroon text-white shadow-lg' : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-maroon'
          }`}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* New Arrival Badge */}
        {product.isNew && (
          <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">
            New Arrival
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-10 pt-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
           <span className="w-1 h-1 rounded-full bg-slate-300" />
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
             {product.category?.name || product.category || "Pure Dried Fish"}
           </span>
        </div>
        
        <Link to={`/product/${product.slug || product.id}`}>
          <h3 className="text-xl font-display font-black text-slate-800 mb-3 group-hover:text-maroon transition-colors tracking-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center gap-1 mb-4">
           {[...Array(5)].map((_, i) => (
             <Star 
               key={i} 
               size={12} 
               className={i < (product.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
             />
           ))}
           <span className="text-[10px] font-bold text-slate-400 ml-1">({product.reviews_count || 8})</span>
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
             <span className="text-xs font-bold text-slate-400">Weight: {product.weight}kg</span>
             <span className="text-2xl font-display font-black text-slate-900 mt-1">৳{product.price}</span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="w-14 h-14 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-maroon hover:text-white transition-all group-hover:shadow-glow"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
