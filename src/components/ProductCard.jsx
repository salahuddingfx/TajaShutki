import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addItem({ product }));
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
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
        />
        
        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3">
           <Link 
             to={`/product/${product.id}`}
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
           <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pure Dried Fish</span>
        </div>
        
        <Link to={`/product/${product.id}`}>
          <h3 className="text-xl font-display font-black text-slate-800 mb-3 group-hover:text-maroon transition-colors tracking-tight line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
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
