import { Link, useNavigate } from 'react-router-dom';
import LazyImage from './LazyImage';
import { ShoppingBag, ShoppingCart, Star, StarHalf } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { toast } from 'sonner';
import Swal from 'sweetalert2';

import { useLanguage } from '../context/LanguageContext';

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} size={10} fill="currentColor" className="text-amber-400" />
      ))}
      {hasHalfStar && <StarHalf size={10} fill="currentColor" className="text-amber-400" />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} size={10} className="text-slate-200" />
      ))}
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { language, t: translate } = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOrderNow = (e) => {
    e.preventDefault();
    dispatch(addItem({ 
      product,
      selectedVariation: product.variations?.length > 0 ? product.variations[0] : null
    }));
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${translate(product.name, product.name_bn)} added to cart!`,
      confirmButtonColor: '#0D9488',
      timer: 2000,
      timerProgressBar: true
    });
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addItem({ 
      product,
      selectedVariation: product.variations?.length > 0 ? product.variations[0] : null
    }));
    Swal.fire({
      icon: 'success',
      title: 'Added to Cart',
      text: `${translate(product.name, product.name_bn)} added to cart!`,
      confirmButtonColor: '#0D9488',
      timer: 2000,
      timerProgressBar: true
    });
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
        <LazyImage 
          src={product.images?.find(i => i.is_primary)?.image_path || (product.images && product.images.length > 0 ? product.images[0].image_path : (product.image_path || product.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop'))} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </Link>

      {/* Content Area - Very Compact */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex-grow">
          <div className="flex items-center gap-2 mb-0.5">
            <Link 
              to={`/product/${product.slug || product.id}`}
              className={clsx(
                "text-[13px] font-bold text-slate-800 hover:text-emerald-600 transition-colors line-clamp-1 leading-tight",
                language === 'bn' ? "font-hindi" : "font-display"
              )}
            >
              {translate(product.name, product.name_bn)}
            </Link>
            {product.weight && (
              <span className="shrink-0 px-1.5 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-md border border-emerald-100">
                {product.weight}
              </span>
            )}
          </div>
          
          {/* Rating Section */}
          <div className="flex items-center gap-1.5 mb-1.5">
            <StarRating rating={product.average_rating ? Number(product.average_rating) : 5.0} />
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-black text-slate-800 leading-none">
                {product.average_rating ? Number(product.average_rating).toFixed(1) : "5.0"}
              </span>
              <span className="text-[10px] text-slate-300 font-bold tracking-tight leading-none">
                ({product.reviews_count || 0})
              </span>
            </div>
          </div>

          <p className="text-[9px] text-slate-400 line-clamp-1 font-medium italic">
            {translate(product.description, product.description_bn)}
          </p>
        </div>

        {/* Action Row - Ultra Compact */}
        <div className="mt-2 pt-2 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col min-w-0">
            <div className="flex items-baseline gap-0.5 text-emerald-600 leading-none">
              <span className="text-[10px] font-black">৳</span>
              <span className="text-base font-black tracking-tighter truncate">
                {Number(product.price).toFixed(0)}
              </span>
            </div>
            {product.original_price && product.original_price > product.price && (
              <span className="text-[8px] font-bold text-rose-600 line-through">৳{Number(product.original_price).toFixed(0)}</span>
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
