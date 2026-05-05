import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Eye, ShoppingCart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addItem } from '@/store/cartSlice';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

import { useLanguage } from '@/context/LanguageContext';

const ProductCard = ({ product }) => {
  const { language, t: translate } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrderNow = (e) => {
    e.preventDefault();
    dispatch(addItem({ product }));
    navigate('/checkout');
  };

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
      className="group relative bg-white rounded-3xl shadow-sm hover:shadow-xl border border-slate-100 overflow-hidden transition-all duration-500 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50/50">
        <Link to={`/product/${product.slug || product.id}`} className="block h-full w-full">
          <img 
            src={product.images?.find(i => i.is_primary)?.image_path || (product.images && product.images.length > 0 ? product.images[0].image_path : (product.image_path || product.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop'))} 
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Hover Actions */}
        <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center pointer-events-none">
           <Link 
             to={`/product/${product.slug || product.id}`}
             className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all scale-75 group-hover:scale-100 duration-500 shadow-xl pointer-events-auto"
           >
             <Eye size={22} />
           </Link>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-2.5 flex flex-col flex-grow">
        <div className="flex-grow mb-3">
          <Link 
            to={`/product/${product.slug || product.id}`}
            className={clsx(
              "text-xs font-black text-slate-800 hover:text-teal-600 transition-colors line-clamp-1 uppercase tracking-tight",
              language === 'bn' && "text-[14px] leading-tight"
            )}
          >
            {translate(product.name, product.name_bn)}
          </Link>
          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5 font-medium">
            {translate(product.description, product.description_bn)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-1 mt-auto pt-2 border-t border-slate-50">
          <div className="flex flex-col">
            {product.original_price && product.original_price > product.price && (
              <span className="text-[9px] font-bold text-slate-400 line-through">৳{product.original_price}</span>
            )}
            <span className="text-base font-black text-teal-600 leading-none">৳{product.price}</span>
          </div>

          <div className="flex gap-1 shrink-0">
            <button 
              onClick={handleAddToCart}
              className="w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-slate-100 text-slate-700 hover:bg-teal-600 hover:text-white"
              title="Add to Cart"
            >
              <ShoppingCart size={12} />
            </button>
            <button 
              onClick={handleOrderNow}
              className="px-2 h-7 rounded-lg flex items-center justify-center gap-1 transition-all shadow-md bg-teal-600 text-white hover:bg-teal-700 shadow-teal-600/20"
            >
              <span className="text-[8px] font-black uppercase tracking-wider whitespace-nowrap">Order Now</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
