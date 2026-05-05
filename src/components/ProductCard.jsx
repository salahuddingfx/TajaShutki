import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { toast } from 'sonner';

import { useLanguage } from '../context/LanguageContext';

const ProductCard = ({ product }) => {
  const { language, t: translate } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrderNow = (e) => {
    e.preventDefault();
    dispatch(addItem({ product }));
    toast.success(`${translate(product.name, product.name_bn)} added to cart!`);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addItem({ product }));
    toast.success(`${translate(product.name, product.name_bn)} added to cart!`);
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-teal-600/10 border border-slate-100 overflow-hidden transition-all duration-500 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50">
        <Link to={`/product/${product.slug || product.id}`} className="block h-full w-full">
          <img 
            src={product.images?.find(i => i.is_primary)?.image_path || (product.images && product.images.length > 0 ? product.images[0].image_path : (product.image_path || product.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop'))} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        </Link>

        {/* Badge - if any (e.g. New or Sale) */}
        {product.original_price && product.original_price > product.price && (
          <div className="absolute top-6 left-6 bg-teal-600 text-white text-[10px] font-black px-4 py-1.5 rounded-full shadow-lg z-10">
            SAVE ৳{Math.round(product.original_price - product.price)}
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-3 backdrop-blur-[2px]">
           <Link 
             to={`/product/${product.slug || product.id}`}
             className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl"
           >
             <Eye size={22} />
           </Link>
           <button 
             onClick={handleAddToCart}
             className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 shadow-xl"
           >
             <ShoppingCart size={22} />
           </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold text-teal-600 uppercase tracking-[0.2em] opacity-60">
              {product.category?.name || 'Fresh'}
            </span>
          </div>
          <Link 
            to={`/product/${product.slug || product.id}`}
            className={clsx(
              "text-lg font-bold text-slate-800 hover:text-teal-600 transition-colors line-clamp-2 leading-tight mb-2",
              language === 'bn' ? "font-hindi" : "font-display"
            )}
          >
            {translate(product.name, product.name_bn)}
          </Link>
          <p className="text-xs text-slate-400 line-clamp-2 font-medium italic leading-relaxed">
            {translate(product.description, product.description_bn)}
          </p>
        </div>

        {/* Bottom CTA Area */}
        <div className="mt-12 pt-10 border-t border-slate-50 flex items-end justify-between">
          <div className="flex flex-col">
            {product.original_price && product.original_price > product.price && (
              <span className="text-xs font-bold text-slate-300 line-through mb-1">৳{Number(product.original_price).toFixed(2)}</span>
            )}
            <div className="flex items-baseline gap-0.5 text-teal-600">
              <span className="text-sm font-black">৳</span>
              <span className="text-3xl font-black tracking-tighter">
                {Number(product.price).toFixed(2)}
              </span>
            </div>
          </div>

          <button 
            onClick={handleOrderNow}
            className="px-7 py-4 rounded-[1.25rem] bg-teal-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-1 active:translate-y-0 transition-all flex items-center gap-2 group/btn"
          >
            Order
            <ShoppingBag size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
