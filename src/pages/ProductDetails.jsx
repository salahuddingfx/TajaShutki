import { useParams, Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { ShoppingCart, ChevronLeft, Loader2, CheckCircle2, Phone, MessageCircle, Star, Truck, MapPin, Globe, CreditCard, ShieldCheck, AlertTriangle, X, Maximize2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { getProductDetails, getProducts, getReviews, submitReview } from '../api/api';
import ProductCard from '../components/ProductCard';
import { useSelector } from 'react-redux';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeImage, setActiveImage] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [productReviews, setProductReviews] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const initData = useSelector((state) => state.settings?.initData);
  const settings = initData?.site?.settings || {};

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
          setProductReviews(revRes.data);
        } catch (err) {
          console.error("Failed to fetch reviews", err);
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

  // Update SEO Meta Tags when product is loaded
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | ${settings.store_name || 'Store'}`;
      
      const setMetaTag = (property, content) => {
        let element = document.querySelector(`meta[property="${property}"]`);
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute('property', property);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
      };

      setMetaTag('og:title', product.name);
      setMetaTag('og:description', product.description ? product.description.substring(0, 150) + '...' : '');
      setMetaTag('og:image', product.image);
      setMetaTag('og:url', window.location.href);
      setMetaTag('og:type', 'product');

      return () => {
        document.title = settings.store_name || 'Store';
      };
    }
  }, [product, settings.store_name]);

  if (loading) {
    return (
      <div className="container-custom py-40 flex items-center justify-center min-h-[60vh]">
        <Loader2 size={40} className="animate-spin text-maroon" />
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
      quantity: 1 
    }));
  };

  const handleOrderNow = () => {
    dispatch(addItem({ 
      product: { ...product, category: product.category?.name || product.category || 'Uncategorized' }, 
      quantity: 1 
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

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || !reviewName) {
      alert("Please provide a rating and your name.");
      return;
    }
    
    try {
      setSubmittingReview(true);
      await submitReview({
        site_id: 2, // TajaShutki
        product_id: product.id,
        customer_name: reviewName,
        rating: rating,
        comment: reviewComment
      });
      alert("Thank you! Your review has been submitted and is waiting for approval.");
      setRating(0);
      setReviewName('');
      setReviewComment('');
    } catch (err) {
      alert("Failed to submit review. Please try again.");
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen pb-20 pt-10">
      <div className="container-custom max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link to="/" className="hover:text-maroon transition-colors">Home</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <Link to="/shop" className="hover:text-maroon transition-colors">Shop</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-slate-800 font-bold">{product.name}</span>
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
                      activeImage === img ? 'border-maroon shadow-lg scale-105 z-10' : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                    {activeImage === img && <motion.div layoutId="activeThumb" className="absolute inset-0 bg-maroon/5" />}
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
              <span className="text-maroon font-bold tracking-widest uppercase text-xs mb-3 block">{product.category?.name || product.category || 'Uncategorized'}</span>
              <h1 className="text-3xl md:text-5xl font-display font-black mb-4 text-slate-800 leading-tight">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-2">
                <span className="text-4xl font-black text-maroon">৳ {product.price}</span>
              </div>

              <div className="text-sm text-slate-400 font-medium mb-10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span>
                Product Code: <span className="text-slate-600 uppercase tracking-wider">{product.slug}</span>
              </div>

              {/* Action Buttons Grid */}
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleOrderNow}
                  className="bg-maroon hover:bg-maroon/90 text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-maroon/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-lg"
                >
                  <ShoppingCart size={22} />
                  Order Now
                </button>
                
                <button 
                  onClick={handleAddToCart}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-5 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-lg"
                >
                  <ShoppingCart size={22} />
                  Add To Cart
                </button>
                
                <a 
                  href={`tel:${settings.support_phone || '01330336084'}`}
                  className="col-span-2 bg-white hover:bg-slate-50 text-slate-700 border-2 border-slate-100 font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-4 hover:border-slate-300 transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-maroon group-hover:text-white transition-colors">
                    <Phone size={18} />
                  </div>
                  Click to Call : {settings.support_phone || '01330336084'}
                </a>
                
                <a 
                  href={`https://wa.me/88${settings.whatsapp_number || '01330336084'}`}
                  target="_blank"
                  rel="noreferrer"
                  className="col-span-2 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-500/20 hover:shadow-xl hover:scale-[1.01] active:scale-95 transition-all"
                >
                  <MessageCircle size={22} />
                  WhatsApp Message : {settings.whatsapp_number || '01330336084'}
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Card 2: Delivery & Benefits (Full Width) */}
        <div className="bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-soft-xl mb-12 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-maroon/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
            
            {/* Left side: Delivery Pricing Cards */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <h4 className="font-display font-black text-slate-800 text-2xl flex items-center gap-3">
                <Truck size={28} className="text-maroon" />
                Delivery Information
              </h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:border-maroon/30 transition-all group hover:bg-white hover:shadow-soft-lg">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-maroon mb-6 group-hover:scale-110 transition-transform">
                    <MapPin size={24} />
                  </div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Inside Cox's Bazar</h5>
                  <p className="text-4xl font-display font-black text-slate-800 mb-3 flex items-baseline gap-1">
                    <span className="text-xl">৳</span> {deliveryInside}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">Estimated Delivery: 1-2 Days</p>
                </div>
                
                <div className="bg-slate-50 border border-slate-100 p-8 rounded-3xl hover:border-maroon/30 transition-all group hover:bg-white hover:shadow-soft-lg">
                  <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-maroon mb-6 group-hover:scale-110 transition-transform">
                    <Globe size={24} />
                  </div>
                  <h5 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Outside Cox's Bazar</h5>
                  <p className="text-4xl font-display font-black text-slate-800 mb-3 flex items-baseline gap-1">
                    <span className="text-xl">৳</span> {deliveryOutside}
                  </p>
                  <p className="text-sm text-slate-500 font-medium">Estimated Delivery: 2-3 Days</p>
                </div>
              </div>

              <div className="bg-maroon/5 border border-maroon/10 p-8 rounded-3xl flex items-center justify-between hover:bg-maroon/10 transition-colors">
                <div>
                  <h5 className="text-xs font-black text-maroon uppercase tracking-widest mb-2">bKash Payment Number</h5>
                  <p className="text-2xl font-black text-slate-800 tracking-wider">{settings.bkash_number || '01886460526'}</p>
                </div>
                <div className="w-16 h-16 bg-maroon text-white rounded-2xl shadow-xl shadow-maroon/20 flex items-center justify-center">
                  <CreditCard size={28} />
                </div>
              </div>
            </div>

            {/* Right side: Benefits & Terms */}
            <div className="lg:col-span-5 flex flex-col justify-between pt-2">
              <div>
                <h4 className="font-display font-black text-slate-800 text-2xl flex items-center gap-3 mb-8">
                  <ShieldCheck size={28} className="text-maroon" />
                  Buyer Protection
                </h4>
                <ul className="space-y-6 mb-8">
                  <li className="flex items-start gap-4">
                    <div className="bg-green-50 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed text-lg">Cash on delivery is available, order with absolute confidence!</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-green-50 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed text-lg">Free delivery on selected promotional items.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-green-50 text-green-600 w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                      <CheckCircle2 size={18} />
                    </div>
                    <span className="text-slate-700 font-medium leading-relaxed text-lg">100% authentic and meticulously hand-picked ingredients.</span>
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
              className={`px-8 py-5 font-bold text-base whitespace-nowrap transition-all rounded-t-2xl ${activeTab === 'description' ? 'bg-maroon/5 text-maroon border-b-2 border-maroon' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              Product Details
            </button>
            <button 
              onClick={() => setActiveTab('delivery')}
              className={`px-8 py-5 font-bold text-base whitespace-nowrap transition-all rounded-t-2xl ${activeTab === 'delivery' ? 'bg-maroon/5 text-maroon border-b-2 border-maroon' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              Delivery & Return Policy
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`px-8 py-5 font-bold text-base whitespace-nowrap transition-all rounded-t-2xl ${activeTab === 'reviews' ? 'bg-maroon/5 text-maroon border-b-2 border-maroon' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
            >
              Reviews ({productReviews.length})
            </button>
          </div>
          <div className="p-8 md:p-12 text-slate-600 leading-relaxed min-h-[300px]">
            {activeTab === 'description' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="whitespace-pre-line text-[16px]">
                {product.description || "No description available for this product."}
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
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={14} fill={i < Math.floor(rev.rating) ? "currentColor" : "none"} className={i < Math.floor(rev.rating) ? "" : "text-slate-300"} />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-slate-600 italic">"{rev.comment}"</p>
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

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex items-center gap-4 mb-10">
              <h2 className="text-3xl font-display font-black text-slate-800">Related Products</h2>
              <div className="h-px bg-slate-200 flex-1"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
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
  );
};

export default ProductDetails;
