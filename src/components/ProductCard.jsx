import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, ShoppingCart } from 'lucide-react';
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
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-teal-600/5 border border-slate-100 overflow-hidden transition-all duration-500 flex flex-col h-full"
    >
      {/* Image Container - Clickable */}
      <Link 
        to={`/product/${product.slug || product.id}`} 
        className="relative aspect-square overflow-hidden bg-slate-50 block"
      >
        <img 
          src={product.images?.find(i => i.is_primary)?.image_path || (product.images && product.images.length > 0 ? product.images[0].image_path : (product.image_path || product.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop'))} 
          alt={product.name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Content Area - Very Compact */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link 
            to={`/product/${product.slug || product.id}`}
            className={clsx(
              "text-[13px] font-bold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1 leading-tight mb-0.5",
              language === 'bn' ? "font-hindi" : "font-display"
            )}
          >
            {translate(product.name, product.name_bn)}
          </Link>
          <p className="text-[9px] text-slate-400 line-clamp-1 font-medium italic">
            {translate(product.description, product.description_bn)}
          </p>
        </div>

        {/* Action Row - Ultra Compact */}
        <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-0.5 text-teal-600 leading-none">
              <span className="text-[10px] font-black">৳</span>
              <span className="text-base font-black tracking-tighter truncate">
                {Number(product.price).toFixed(0)}
              </span>
            </div>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[8px] font-bold text-slate-300 line-through">৳{Number(product.original_price).toFixed(0)}</span>
            )}
          </div>

          <div className="flex items-center gap-1">
            <button 
              onClick={handleAddToCart}
              className="w-7 h-7 rounded-md bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-teal-600/10 hover:text-teal-600 transition-all"
              title="Add to Cart"
            >
              <ShoppingCart size={14} />
            </button>
            <button 
              onClick={handleOrderNow}
              className="w-7 h-7 rounded-md bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/10 hover:-translate-y-0.5 transition-all"
              title="Order Now"
            >
              <ShoppingBag size={14} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
