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
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-500 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50/50 p-4">
        <img 
          src={product.images && product.images.length > 0 ? product.images[0].image_path : (product.image_path || product.image || 'https://images.unsplash.com/photo-1514516348920-f319999a5e8f?q=80&w=400&auto=format&fit=crop')} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
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
          className={`absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
            isWishlisted ? 'bg-maroon text-white shadow-lg' : 'bg-white text-slate-400 hover:text-maroon shadow-md'
          }`}
        >
          <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} />
        </button>

        {/* New Arrival Badge */}
        {product.isNew && (
          <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-slate-800 shadow-sm">
            New Arrival
          </div>
        )}
      </div>

      {/* Content */}
      {/* Content */}
      <div className="p-4 md:p-5 flex flex-col flex-grow">
        <Link to={`/product/${product.slug || product.id}`} className="block mb-2">
          <h3 className="text-sm md:text-base font-bold text-slate-800 hover:text-maroon transition-colors line-clamp-2 h-10 md:h-12 leading-tight">
            {product.name}
          </h3>
        </Link>
        
        <div className="mb-4">
           <span className="text-xl md:text-2xl font-black text-maroon">৳{product.price}</span>
           {product.oldPrice && (
             <span className="ml-2 text-sm text-slate-400 line-through font-medium">৳{product.oldPrice}</span>
           )}
        </div>
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-0.5">
             {[...Array(5)].map((_, i) => (
               <Star 
                 key={i} 
                 size={14} 
                 className={i < (product.rating || 5) ? "fill-amber-400 text-amber-400" : "text-slate-200"} 
               />
             ))}
          </div>
          
          <button 
            onClick={handleAddToCart}
            className="text-maroon hover:scale-125 transition-transform"
          >
            <ShoppingBag size={24} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
