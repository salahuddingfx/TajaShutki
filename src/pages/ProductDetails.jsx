import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem, selectCartItems, updateQuantity } from '../store/cartSlice';
import { ShoppingCart, ChevronLeft, Loader2, CheckCircle2, Phone, MessageCircle, Star, Truck, MapPin, Globe, CreditCard, ShieldCheck, AlertTriangle, X, Maximize2, Minus, Plus, ShoppingBag, Image as ImageIcon, Video, Trash2, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import { getProductDetails, getProducts, getReviews, submitReview } from '../api/api';
import ProductCard from '../components/ProductCard';
import Swal from 'sweetalert2';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

const ProductDetails = () => {
  const { language, t: translate } = useLanguage();
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [productReviews, setProductReviews] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMedia, setReviewMedia] = useState([]); // { file, type, preview }
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const initData = useSelector((state) => state.settings?.initData);
  const settings = initData?.site?.settings || {};

  const cartItems = useSelector(selectCartItems);
  const cartItem = cartItems.find(i => i.id === product?.id);

  useEffect(() => {
    if (cartItem) {
      setQuantity(cartItem.quantity);
    }
  }, [product?.id]);

  const productWeight = Math.max(1, Math.ceil(product?.weight || 1));
  const extraWeight = Math.max(0, productWeight - 1);
  const perKgExtra = Number(settings.delivery_per_kg || 10);
  const insideBase = Number(settings.delivery_inside || 70);
  const outsideBase = Number(settings.delivery_outside || 120);

  const deliveryInside = insideBase + (extraWeight * perKgExtra);
  const deliveryOutside = outsideBase + (extraWeight * perKgExtra);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        
        const response = await getProductDetails(id);
        const prod = response.data;
        
        const images = prod.images && prod.images.length > 0 
          ? prod.images.map(img => img.image_path)
          : ['https://images.unsplash.com/photo-1514516348920-f319999a5e8f?q=80&w=200&auto=format&fit=crop'];

        const normalizedProduct = {
          ...prod,
          category: prod.category?.name || 'Uncategorized',
          categorySlug: prod.category?.slug || '',
          image: images[0],
          allImages: images,
          variants: [prod.weight ? `${prod.weight} kg` : '1 kg']
        };

        setProduct(normalizedProduct);
        setActiveImage(images[0]);
        
        if (prod.category?.slug) {
          try {
            const relatedRes = await getProducts({ category: prod.category.slug });
            const related = (relatedRes.data?.data || relatedRes.data || [])
              .filter(p => p.id !== prod.id)
              .slice(0, 4)
              .map(p => ({
                ...p,
                category: p.category?.name || 'Uncategorized',
                image: p.images && p.images.length > 0 ? p.images[0].image_path : 'https://images.unsplash.com/photo-1514516348920-f319999a5e8f?q=80&w=200&auto=format&fit=crop'
              }));
            setRelatedProducts(related);
          } catch (err) {
            console.error("Failed to fetch related products", err);
          }
        }

        try {
          const revRes = await getReviews({ product_id: prod.id });
          setProductReviews(Array.isArray(revRes.data) ? revRes.data : []);
        } catch (err) {
          console.error("Failed to fetch reviews", err);
          setProductReviews([]);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // SEO tags are handled by <Helmet> in the return block

  if (loading) {
    return (
      <div className="container-custom py-12 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left: Images Skeleton */}
          <div className="space-y-6">
            <div className="aspect-square bg-slate-100 rounded-[40px] animate-pulse" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          </div>
          
          {/* Right: Info Skeleton */}
          <div className="space-y-8 pt-4">
            <div className="space-y-4">
              <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
              <div className="h-12 w-3/4 bg-slate-100 rounded-2xl animate-pulse" />
              <div className="h-6 w-1/2 bg-slate-100 rounded-xl animate-pulse" />
            </div>
            
            <div className="h-24 w-full bg-slate-50 rounded-3xl animate-pulse" />
            
            <div className="space-y-4 pt-4">
              <div className="h-16 w-full bg-slate-100 rounded-2xl animate-pulse" />
              <div className="h-16 w-full bg-slate-100 rounded-2xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-40 text-center min-h-[60vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-display font-bold text-slate-800">Product not found</h2>
        <p className="text-slate-500 mt-2">The product you're looking for doesn't exist or has been removed.</p>
        <Link to="/shop" className="btn-primary mt-8">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addItem({ 
      product: { ...product, category: product.category?.name || product.category || 'Uncategorized' }, 
      quantity: quantity 
    }));
    toast.success(`${translate(product.name, product.name_bn)} added to cart!`);
  };

  const updateProductQuantity = (newQty) => {
    const qty = Math.max(1, newQty);
    setQuantity(qty);
    if (cartItem) {
      dispatch(updateQuantity({ id: product.id, quantity: qty }));
    }
  };

  const handleOrderNow = () => {
    dispatch(addItem({ 
      product: { ...product, category: product.category?.name || product.category || 'Uncategorized' }, 
      quantity: quantity 
    }));
    navigate('/checkout');
  };

  const handleStarInteract = (e, index, isHover) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const isHalf = e.clientX - rect.left < rect.width / 2;
    const val = index - (isHalf ? 0.5 : 0);
    if (isHover) setHoverRating(val);
    else setRating(val);
  };

  const handleMediaChange = (e, type) => {
    const files = Array.from(e.target.files);
    const newMedia = files.map(file => ({
      file,
      type,
      preview: URL.createObjectURL(file)
    }));
    setReviewMedia(prev => [...prev, ...newMedia]);
  };

  const removeMedia = (index) => {
    setReviewMedia(prev => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewName) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Please provide both a rating and your name.',
        confirmButtonColor: '#800000'
      });
      return;
    }
    
    try {
      setSubmittingReview(true);
      
      const formData = new FormData();
      formData.append('site_id', '2'); // TajaShutki
      formData.append('product_id', product.id);
      formData.append('customer_name', reviewName);
      formData.append('rating', rating);
      formData.append('comment', reviewComment);
      
      reviewMedia.forEach((m) => {
        if (m.type === 'image') formData.append('images[]', m.file);
        else formData.append('videos[]', m.file);
      });

      await submitReview(formData);
      
      Swal.fire({
        icon: 'success',
        title: 'Review Submitted!',
        text: 'Thank you! Your review has been submitted and is waiting for approval.',
        confirmButtonColor: '#800000',
        timer: 3000,
        timerProgressBar: true
      });

      setRating(0);
      setReviewName('');
      setReviewComment('');
      setReviewMedia([]);
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to submit review. Please try again.',
        confirmButtonColor: '#800000'
      });
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{translate(product.name, product.name_bn)} | {settings.store_name || 'TajaShutki'}</title>
        <meta name="description" content={translate(product.description, product.description_bn)?.substring(0, 160)} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="product" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:title" content={translate(product.name, product.name_bn)} />
        <meta property="og:description" content={translate(product.description, product.description_bn)?.substring(0, 160)} />
        <meta property="og:image" content={product.image} />
        <meta property="og:site_name" content={settings.store_name || 'TajaShutki'} />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={window.location.href} />
        <meta name="twitter:title" content={translate(product.name, product.name_bn)} />
        <meta name="twitter:description" content={translate(product.description, product.description_bn)?.substring(0, 160)} />
        <meta name="twitter:image" content={product.image} />
      </Helmet>

      <div className="bg-cream min-h-screen pb-20 pt-10">
        <div className="container-custom max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <Link to="/shop" className="hover:text-teal-600 transition-colors">Shop</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-slate-800 font-bold">{translate(product.name, product.name_bn)}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          {/* Left Column: Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-5 space-y-6"
          >
            <div 
              className="group relative aspect-[4/5] rounded-[40px] overflow-hidden bg-white shadow-soft-xl border border-slate-100 cursor-zoom-in"
              onClick={() => setIsLightboxOpen(true)}
            >
              <AnimatePresence mode='wait'>
                <motion.img 
                  key={activeImage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={activeImage || product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-800 shadow-xl scale-90 group-hover:scale-100 transition-transform">
                  <Maximize2 size={24} />
                </div>
              </div>
            </div>

            {product.allImages && product.allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4 px-1">
                {product.allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all bg-white relative ${
                      activeImage === img ? 'border-teal-600 shadow-lg scale-105 z-10' : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    {activeImage === img && <motion.div layoutId="activeThumb" className="absolute inset-0 bg-teal-600/5" />}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Right Column: Product Info & Actions */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-7 flex flex-col"
          >
            {/* Card 1: Essential Info & Actions */}
            <div className="bg-white rounded-3xl p-8 md:p-10 shadow-soft-lg border border-slate-100 h-full flex flex-col justify-center">
              <span className="text-teal-600 font-bold tracking-widest uppercase text-xs mb-3 block">{product.category?.name || product.category || 'Uncategorized'}</span>
              <h1 className={clsx(
                "text-3xl md:text-5xl font-display font-black mb-4 text-slate-800 leading-tight",
                language === 'bn' && "text-4xl md:text-6xl"
              )}>{translate(product.name, product.name_bn)}</h1>
              
              <div className="flex items-center gap-4 mb-8">
                {product.original_price && product.original_price > product.price && (
                  <span className="text-2xl font-bold text-slate-900 line-through opacity-50">৳ {product.original_price}</span>
                )}
                <span className="text-4xl font-black text-teal-600">৳ {product.price}</span>
              </div>

              <div className="flex flex-wrap items-center gap-y-4 gap-x-8 mb-10 py-6 border-y border-slate-50">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Product Code</span>
                  <span className="text-sm font-black text-slate-700 uppercase tracking-wider">{product.slug}</span>
                </div>
              </div>


              <div className="h-px bg-slate-100 mb-8" />

              {/* Total Price Display */}
              <div className="mb-8 p-6 bg-teal-600/5 rounded-2xl border border-teal-600/10 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Total Price</span>
                <span className="text-3xl font-black text-teal-600">৳ {(product.price * quantity).toFixed(0)}</span>
              </div>

              {/* Action Buttons Grid */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="flex items-center bg-slate-100 rounded-2xl p-1 shrink-0 border border-slate-200">
                  <button 
                    onClick={() => updateProductQuantity(quantity - 1)}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-teal-600 transition-colors"
                  ><Minus size={20} /></button>
                  <span className="w-12 text-center font-black text-slate-900 text-lg">{quantity}</span>
                  <button 
                    onClick={() => updateProductQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-teal-600 transition-colors"
                  ><Plus size={20} /></button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl bg-white text-slate-900 border-2 border-slate-900 hover:bg-slate-50 hover:scale-[1.02] active:scale-95 shadow-slate-100"
                >
                  <ShoppingCart size={18} />
                  Add to Cart
                </button>

                <button 
                  onClick={handleOrderNow}
                  className="flex-[1.5] flex items-center justify-center gap-3 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-xl bg-teal-600 text-white hover:bg-teal-700 hover:scale-[1.02] active:scale-95 shadow-teal-600/20"
                >
                  <ShoppingBag size={18} />
                  Order Now
                </button>
              </div>

            </div>
          </motion.div>
        </div>

        {/* Card 2: Delivery & Benefits (Full Width) */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-soft-xl mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            
            {/* Left side: Delivery Pricing Cards */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h4 className="font-display font-black text-slate-800 text-2xl flex items-center gap-3">
                <Truck size={28} className="text-teal-600" />
                Delivery Information
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:border-teal-600/30 transition-all group hover:bg-white hover:shadow-soft-lg">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Inside Cox's Bazar</h5>
                  <p className="text-4xl font-display font-black text-slate-800 mb-3 flex items-baseline gap-1">
                    <span className="text-xl">৳</span> {deliveryInside}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">Estimated Delivery: 1-2 Days</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:border-teal-600/30 transition-all group hover:bg-white hover:shadow-soft-lg">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-teal-600 mb-6 group-hover:scale-110 transition-transform">
                    <Globe size={24} />
                  </div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Outside Cox's Bazar</h5>
                  <p className="text-4xl font-display font-black text-slate-800 mb-3 flex items-baseline gap-1">
                    <span className="text-xl">৳</span> {deliveryOutside}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">Estimated Delivery: 2-3 Days</p>
                </div>
              </div>

            </div>

            {/* Right side: Benefits & Terms */}
            <div className="lg:col-span-5 flex flex-col justify-between pt-2">
              <div>
                <h4 className="font-display font-black text-slate-800 text-2xl flex items-center gap-3 mb-8">
                  <ShieldCheck size={28} className="text-teal-600" />
                  Shopping Benefits
                </h4>
                <ul className="space-y-6 mb-8">
                  <li className="flex items-start gap-4">
                    <div className="bg-green-50 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed text-lg">
                      {translate('Cash on delivery is available, order with absolute confidence!', 'ক্যাশ অন ডেলিভারি সুবিধা আছে, নিশ্চিন্তে অর্ডার করুন!')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-green-50 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed text-lg">
                      {translate('Fast & secure delivery to your doorstep.', 'আপনার দোরগোড়ায় দ্রুত এবং নিরাপদ ডেলিভারি।')}
                    </span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-green-50 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed text-lg">
                      {translate('Premium quality & traditional taste guaranteed.', 'প্রিমিয়াম কোয়ালিটি এবং ঐতিহ্যগত স্বাদের নিশ্চয়তা।')}
                    </span>
                  </li>
                </ul>
              </div>

              <div className="bg-orange-50 border border-orange-100 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-bl-full -mr-4 -mt-4"></div>
                <h5 className="text-orange-800 font-black mb-3 flex items-center gap-2 text-lg">
                  <AlertTriangle size={20} />
                  Important Terms
                </h5>
                <p className="text-base text-orange-800/80 leading-relaxed font-medium mb-5">
                  If you decide not to accept the product despite it matching the description, you are required to pay the delivery charge (৳{deliveryInside} / ৳{deliveryOutside}) to the delivery man and return it immediately.
                </p>
                <span className="inline-block px-4 py-2 bg-white/80 backdrop-blur-sm text-orange-900 text-sm font-black rounded-xl border border-orange-200/50">
                  No complaints accepted later
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs */}
        <div className="mt-16 bg-white rounded-3xl shadow-soft-lg border border-slate-100 overflow-hidden">
          <div className="flex border-b border-slate-100 overflow-x-auto scrollbar-hide px-4 pt-4">
            <button 
              onClick={() => setActiveTab('description')}
              className={`px-8 py-5 font-bold text-base whitespace-nowrap transition-all rounded-t-2xl ${activeTab === 'description' ? 'bg-teal-600/5 text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {translate('Product Details', 'প্রোডাক্টের বিবরণ')}
            </button>
            <button 
              onClick={() => setActiveTab('delivery')}
              className={`px-8 py-5 font-bold text-base whitespace-nowrap transition-all rounded-t-2xl ${activeTab === 'delivery' ? 'bg-teal-600/5 text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {translate('Delivery & Return', 'ডেলিভারি ও রিটার্ন')}
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-5 font-bold text-base whitespace-nowrap transition-all rounded-t-2xl ${activeTab === 'reviews' ? 'bg-teal-600/5 text-teal-600 border-b-2 border-teal-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              {translate('Reviews', 'রিভিউ')} ({productReviews.length})
            </button>
          </div>
          <div className="p-8 md:p-12 text-slate-600 leading-relaxed min-h-[300px]">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="whitespace-pre-line text-[16px]">
                {translate(product.description, product.description_bn) || "No description available for this product."}
              </motion.div>
            )}
            {activeTab === 'delivery' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 text-[16px]">
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-slate-800 mb-2">Delivery Time</h4>
                  <p>Inside Dhaka: 1-2 Days<br/>Outside Dhaka: 2-3 Days.</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl">
                  <h4 className="font-bold text-slate-800 mb-2">Return Policy</h4>
                  <p>You may return the product instantly to the delivery man if it doesn't match the description. However, delivery charges must be paid.</p>
                </div>
              </motion.div>
            )}
            {activeTab === 'reviews' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Reviews List */}
                <div className="h-full">
                  {productReviews.length === 0 ? (
                    <div className="text-center py-12 bg-slate-50 rounded-3xl border border-slate-100 flex flex-col items-center justify-center h-full">
                      <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-4">
                        <MessageCircle size={32} className="text-slate-300" />
                      </div>
                      <h4 className="font-bold text-slate-800 text-lg mb-2">No Reviews Yet</h4>
                      <p className="text-slate-500">Be the first to review this product!</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {productReviews.map(rev => (
                        <div key={rev.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-800">{rev.customer_name}</span>
                            <div className="flex gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => {
                                const isFull = rev.rating >= star;
                                const isHalf = rev.rating >= star - 0.5 && !isFull;
                                return (
                                  <div key={star} className="relative text-yellow-400">
                                    <Star size={14} fill={isFull ? "currentColor" : "none"} className={isFull ? "" : "text-slate-300"} />
                                    {isHalf && (
                                      <div className="absolute top-0 left-0 overflow-hidden w-[50%] text-yellow-400">
                                        <Star size={14} fill="currentColor" />
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 italic">"{rev.comment}"</p>

                          {/* Review Media Gallery */}
                          {rev.media && rev.media.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                              {rev.media.map((m, idx) => (
                                <div key={idx} className="relative group w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow-sm cursor-pointer hover:border-maroon/30 transition-all">
                                  {m.type === 'image' ? (
                                    <img 
                                      src={m.file_path} 
                                      alt="Review" 
                                      className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                      onClick={() => {
                                        setActiveImage(m.file_path);
                                        setIsLightboxOpen(true);
                                      }}
                                    />
                                  ) : (
                                    <div 
                                      className="w-full h-full bg-slate-900 flex items-center justify-center text-white"
                                      onClick={() => window.open(m.file_path, '_blank')}
                                    >
                                      <PlayCircle size={24} />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-slate-400 mt-3">{new Date(rev.created_at).toLocaleDateString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Review Form */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-soft h-fit">
                  <h4 className="font-bold text-slate-800 text-xl mb-6">Write a Review</h4>
                  <form className="space-y-5" onSubmit={handleReviewSubmit}>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Rating</label>
                      <div className="flex items-center gap-2" onMouseLeave={() => setHoverRating(0)}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const current = hoverRating || rating;
                          const isFull = current >= star;
                          const isHalf = current >= star - 0.5 && !isFull;
                          return (
                            <button 
                              key={star} 
                              type="button" 
                              className="text-slate-300 hover:text-yellow-400 transition-colors relative cursor-pointer"
                              onMouseMove={(e) => handleStarInteract(e, star, true)}
                              onClick={(e) => handleStarInteract(e, star, false)}
                            >
                              <Star size={28} className={isFull || isHalf ? "text-yellow-400" : ""} fill={isFull ? "currentColor" : "none"} />
                              {isHalf && (
                                <div className="absolute top-0 left-0 overflow-hidden w-[50%] text-yellow-400">
                                  <Star size={28} fill="currentColor" />
                                </div>
                              )}
                            </button>
                          );
                        })}
                        <span className="ml-2 font-bold text-slate-500">{rating > 0 ? rating : ''}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Name</label>
                      <input 
                        type="text" 
                        required
                        value={reviewName}
                        onChange={(e) => setReviewName(e.target.value)}
                        placeholder="Enter your name" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Your Review</label>
                      <textarea 
                        rows="4" 
                        value={reviewComment}
                        onChange={(e) => setReviewComment(e.target.value)}
                        placeholder="What did you like about this product?" 
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-maroon focus:ring-1 focus:ring-maroon transition-all bg-slate-50 focus:bg-white resize-none"
                      ></textarea>
                    </div>

                    {/* Media Upload Section */}
                    <div className="space-y-4">
                      <label className="block text-sm font-bold text-slate-700">Add Visual Proof (Optional)</label>
                      <div className="flex flex-wrap gap-3">
                        {reviewMedia.map((m, idx) => (
                          <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group">
                            {m.type === 'image' ? (
                              <img src={m.preview} alt="preview" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                                <Video size={20} />
                              </div>
                            )}
                            <button 
                              type="button"
                              onClick={() => removeMedia(idx)}
                              className="absolute top-1 right-1 bg-rose-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        ))}
                        
                        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-maroon/30 hover:text-maroon hover:bg-maroon/5 transition-all cursor-pointer">
                          <ImageIcon size={20} />
                          <span className="text-[10px] font-bold mt-1 uppercase">Image</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            multiple 
                            className="hidden" 
                            onChange={(e) => handleMediaChange(e, 'image')} 
                          />
                        </label>

                        <label className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-maroon/30 hover:text-maroon hover:bg-maroon/5 transition-all cursor-pointer">
                          <Video size={20} />
                          <span className="text-[10px] font-bold mt-1 uppercase">Video</span>
                          <input 
                            type="file" 
                            accept="video/*" 
                            multiple 
                            className="hidden" 
                            onChange={(e) => handleMediaChange(e, 'video')} 
                          />
                        </label>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium italic">Max 5MB for images, 20MB for videos.</p>
                    </div>
                    <button 
                      type="submit"
                      disabled={submittingReview}
                      className="w-full bg-maroon hover:bg-maroon/90 text-white font-bold py-4 rounded-xl transition-all shadow-md shadow-maroon/20 hover:shadow-lg disabled:opacity-70 flex justify-center"
                    >
                      {submittingReview ? <Loader2 size={24} className="animate-spin" /> : 'Submit Review'}
                    </button>
                  </form>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4 flex-1">
                <h2 className="text-3xl font-display font-black text-slate-800">Related Products</h2>
                <div className="h-px bg-slate-200 flex-1"></div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="flex gap-4 md:gap-6 overflow-x-auto pb-10 scrollbar-hide snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0">
                {relatedProducts.map(p => (
                  <div key={p.id} className="w-[160px] md:w-[220px] shrink-0 snap-start">
                    <ProductCard product={p} />
                  </div>
                ))}
              </div>
              
              {/* Subtle visual indicator for more items */}
              <div className="absolute right-0 top-0 bottom-10 w-20 bg-gradient-to-l from-cream/50 to-transparent pointer-events-none md:hidden" />
            </div>
          </div>
        )}
      </div>

      {/* Image Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-slate-900/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              className="absolute top-8 right-8 w-14 h-14 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 transition-colors z-[210]"
              onClick={() => setIsLightboxOpen(false)}
            >
              <X size={28} />
            </button>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full aspect-[4/5] md:aspect-auto md:max-h-[85vh] rounded-[32px] overflow-hidden shadow-2xl shadow-black/50"
              onClick={(e) => e.stopPropagation()}
            >
              <img 
                src={activeImage || product.image} 
                alt={product.name}
                className="w-full h-full object-contain bg-slate-900"
              />
            </motion.div>

            {/* Lightbox Navigation/Thumbs (Optional) */}
            {product.allImages && product.allImages.length > 1 && (
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 px-6 py-3 bg-white/5 backdrop-blur-md rounded-full border border-white/10 overflow-hidden">
                {product.allImages.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setActiveImage(img); }}
                    className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${
                      activeImage === img ? 'border-white scale-110' : 'border-transparent opacity-40 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      </div>

      {/* Mobile Sticky Action Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-4 z-50 shadow-[0_-10px_30px_rgba(0,0,0,0.05)] animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center justify-between gap-4 max-w-lg mx-auto">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Price</p>
            <p className="text-xl font-black text-maroon leading-none">৳{product.price}</p>
          </div>
          <button 
            onClick={handleOrderNow}
            disabled={product.stock <= 0}
            className={`flex-1 py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${
              product.stock > 0 
                ? "bg-maroon text-white shadow-lg active:scale-95" 
                : "bg-slate-100 text-slate-400 cursor-not-allowed"
            }`}
          >
            <ShoppingCart size={18} />
            {product.stock > 0 ? 'Order Now' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductDetails;
