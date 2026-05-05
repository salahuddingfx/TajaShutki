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
      className="group relative bg-white rounded-[2rem] shadow-sm hover:shadow-2xl hover:shadow-teal-600/10 border border-slate-100 overflow-hidden transition-all duration-500 h-full flex flex-col"
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
          <div className="absolute top-4 left-4 bg-teal-600 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg z-10">
            SAVE ৳{Math.round(product.original_price - product.price)}
          </div>
        )}

        {/* Hover Actions Overlay */}
        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-2 backdrop-blur-[2px]">
           <Link 
             to={`/product/${product.slug || product.id}`}
             className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 shadow-xl"
           >
             <Eye size={18} />
           </Link>
           <button 
             onClick={handleAddToCart}
             className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75 shadow-xl"
           >
             <ShoppingCart size={18} />
           </button>
        </div>
      </div>

      {/* Product Info - Reduced Padding for Square Look */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[9px] font-bold text-teal-600 uppercase tracking-wider opacity-60">
              {product.category?.name || 'Fresh'}
            </span>
          </div>
          <Link 
            to={`/product/${product.slug || product.id}`}
            className={clsx(
              "text-base font-bold text-slate-800 hover:text-teal-600 transition-colors line-clamp-1 leading-tight mb-1",
              language === 'bn' ? "font-hindi" : "font-display"
            )}
          >
            {translate(product.name, product.name_bn)}
          </Link>
          <p className="text-[10px] text-slate-400 line-clamp-1 font-medium italic leading-relaxed">
            {translate(product.description, product.description_bn)}
          </p>
        </div>

        {/* Bottom CTA Area - Reduced Spacing */}
        <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            {product.original_price && product.original_price > product.price && (
              <span className="text-[9px] font-bold text-slate-300 line-through">৳{Number(product.original_price).toFixed(0)}</span>
            )}
            <div className="flex items-baseline gap-0.5 text-teal-600">
              <span className="text-[10px] font-black">৳</span>
              <span className="text-xl font-black tracking-tighter">
                {Number(product.price).toFixed(0)}
              </span>
            </div>
          </div>

          <button 
            onClick={handleOrderNow}
            className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-600/20 hover:shadow-teal-600/40 hover:-translate-y-0.5 transition-all group/btn"
            title="Order Now"
          >
            <ShoppingBag size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
