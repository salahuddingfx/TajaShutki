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
      className="group relative bg-white rounded-[1.5rem] shadow-sm hover:shadow-2xl hover:shadow-teal-600/10 border border-slate-100 overflow-hidden transition-all duration-500 h-full flex flex-col"
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

        {/* Badge */}
        {product.original_price && product.original_price > product.price && (
          <div className="absolute top-3 left-3 bg-teal-600 text-white text-[8px] font-black px-2 py-1 rounded-full shadow-lg z-10">
            SAVE ৳{Math.round(product.original_price - product.price)}
          </div>
        )}

        {/* Quick View Link overlay */}
        <Link 
          to={`/product/${product.slug || product.id}`}
          className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[0.5px]"
        >
          <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center shadow-xl transform scale-50 group-hover:scale-100 transition-all duration-500">
            <Eye size={18} />
          </div>
        </Link>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link 
            to={`/product/${product.slug || product.id}`}
            className={clsx(
              "text-sm font-bold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1 leading-tight mb-1",
              language === 'bn' ? "font-hindi" : "font-display"
            )}
          >
            {translate(product.name, product.name_bn)}
          </Link>
          <p className="text-[10px] text-slate-400 line-clamp-1 font-medium italic mb-2">
            {translate(product.description, product.description_bn)}
          </p>
        </div>

        {/* Bottom CTA Area - Balanced */}
        <div className="mt-2 pt-3 border-t border-slate-50 flex items-center justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-0.5 text-teal-600">
              <span className="text-[9px] font-black">৳</span>
              <span className="text-lg font-black tracking-tighter truncate">
                {Number(product.price).toFixed(0)}
              </span>
            </div>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[8px] font-bold text-slate-300 line-through -mt-1">৳{Number(product.original_price).toFixed(0)}</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button 
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
              title="Add to Cart"
            >
              <ShoppingCart size={16} />
            </button>
            <button 
              onClick={handleOrderNow}
              className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/10 hover:shadow-teal-600/20 hover:-translate-y-0.5 transition-all group/btn"
              title="Order Now"
            >
              <ShoppingBag size={16} className="group-hover/btn:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
