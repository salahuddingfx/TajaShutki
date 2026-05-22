import { useState, useEffect, useRef, useCallback } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { useSelector } from 'react-redux';
import { selectProductsBySite, selectProductsLoading } from '@/store/productsSlice';
import SkeletonCard from '@/components/SkeletonCard';
import { selectCurrentSiteId, selectCategories, selectContact, selectHomeSettings, selectFeaturedProducts } from '@/store/settingsSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';
import {
  ArrowRight, Star, ShieldCheck, Truck, ArrowUpRight, Leaf, Heart,
  CheckCircle, Flame, Award, Waves, Clock, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getReviews } from '@/api/api';
import { toast } from 'sonner';
import { gsap } from 'gsap';
import { Helmet } from 'react-helmet-async';

// Helper to map icon names to components
const IconMap = {
  Leaf, ShieldCheck, Truck, Star, Heart, Flame, Award, Waves, Clock, ChevronRight, CheckCircle
};

const Home = () => {
  const currentSiteId = useSelector(selectCurrentSiteId);
  const siteProducts = useSelector(state => selectProductsBySite(state, currentSiteId));
  const loading = useSelector(selectProductsLoading);
  const categories = useSelector(selectCategories);
  const contact = useSelector(selectContact);
  const homeSettings = useSelector(selectHomeSettings);
  const bestSellers = siteProducts.slice(0, 10);
  const featuredCollection = useSelector(selectFeaturedProducts);

  const [reviews, setReviews] = useState([]);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [slideDir, setSlideDir] = useState(1);
  const sliderRef = useRef(null);
  const reviewContentRef = useRef(null);

  const scroll = (direction) => {
    if (sliderRef.current) {
      const { scrollLeft, clientWidth } = sliderRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2;
      sliderRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scroll('right');
        }
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Fallback data if DB settings aren't set yet
  const whyUs = homeSettings?.why_us || [
    { icon: 'Waves', title: 'Coastal Origin', desc: 'Sourced directly from the shores of Cox\'s Bazar.' },
    { icon: 'Leaf', title: 'All-Natural Drying', desc: 'Sun-dried using traditional methods.' },
    { icon: 'ShieldCheck', title: 'Certified Quality', desc: 'Tested for safety and hygiene.' },
  ];

  const processSteps = homeSettings?.process || [
    { step: '01', title: 'Fresh Catch', desc: 'Selecting only premium-grade fish.', color: '#0f766e' },
    { step: '02', title: 'Sun Drying', desc: 'Dried under the sun for 3–5 days.', color: '#b45309' },
    { step: '03', title: 'Quality Check', desc: 'Only the best makes the cut.', color: '#800000' },
    { step: '04', title: 'To Your Kitchen', desc: 'Vacuum-sealed for maximum shelf life.', color: '#7c3aed' },
  ];

  const displayCategories = categories
    .filter(c => c.is_featured)
    .map(cat => ({ name: cat.name }))
    .slice(0, 4);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await getReviews({ site_id: 2, limit: 5 });
        const data = Array.isArray(res) ? res : (res?.data || []);
        setReviews(data);
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    };
    fetchReviews();
  }, []);

  // Auto-slide reviews every 3s
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => {
      setSlideDir(1);
      setReviewIdx(prev => (prev + 1) % reviews.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  // Reset index when reviews change
  useEffect(() => { setReviewIdx(0); }, [reviews.length]);

  // GSAP entrance on review content change
  useEffect(() => {
    if (reviewContentRef.current) {
      gsap.fromTo(reviewContentRef.current.children,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: "power2.out" }
      );
    }
  }, [reviewIdx]);



  return (
    <>
      <Helmet>
        <title>Home | Taja Shutki - Premium Dried Fish & Seafood</title>
        <meta name="description" content="Shop premium quality naturally dried fish and seafood directly from Cox's Bazar at Taja Shutki." />
      </Helmet>
      <div className="bg-cream min-h-screen">
      <Hero />

      {/* Why Us */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center mb-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-maroon mb-3">Why Taja Shutki</p>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800">The Taja Shutki Difference</h2>
            <div className="w-20 h-1 bg-maroon mx-auto rounded-full mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUs.map((item, i) => {
              const Icon = IconMap[item.icon] || Waves;
              return (
                <motion.div key={i} className="group flex gap-4 p-4 rounded-3xl bg-cream border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-400">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                    <Icon size={24} className="text-teal-700" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {displayCategories.length > 0 && (
        <section className="py-10 bg-white border-y border-slate-50">
          <div className="container-custom">
            <div className="text-center mb-8">
              <h2 className="text-xl font-display font-black text-slate-800">Browse by Category</h2>
            </div>
            <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
              {displayCategories.map((cat, index) => {
                const Icon = cat.name.toLowerCase().includes('fish') || cat.name.toLowerCase().includes('shutki') ? Waves : 
                             cat.name.toLowerCase().includes('prawn') || cat.name.toLowerCase().includes('shrimp') ? Heart : 
                             cat.name.toLowerCase().includes('spicy') ? Flame : Leaf;
                
                return (
                  <motion.div
                    key={cat.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    viewport={{ once: true }}
                  >
                    <Link
                      to={`/shop?category=${cat.name}`}
                      className="group flex flex-col items-center gap-2 text-center"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-3xl bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-700 group-hover:bg-teal-600 group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-lg group-hover:shadow-teal-600/20 group-hover:-translate-y-1">
                        <Icon size={32} />
                      </div>
                      <span className="text-[11px] font-black text-slate-500 uppercase tracking-widest group-hover:text-teal-600 transition-colors">{cat.name}</span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Slider */}
      {bestSellers.length > 0 && (
        <section className="py-12 bg-white overflow-hidden">
          <div className="container-custom">
            <div className="flex justify-between items-end mb-12 px-4 md:px-0">
              <div>
                <span className="text-teal-600 font-black uppercase tracking-[0.4em] text-[10px]">Most Wanted</span>
                <h2 className="text-4xl md:text-5xl font-display font-black mt-3 text-slate-900 tracking-tight">Best Sellers</h2>
              </div>
              <div className="hidden md:flex gap-4">
                 <button 
                  onClick={() => scroll('left')}
                  className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-600 hover:bg-teal-600 hover:text-white transition-all"
                  aria-label="Scroll Left"
                >
                  <ChevronRight size={20} className="rotate-180" />
                </button>
                 <button 
                  onClick={() => scroll('right')}
                  className="w-12 h-12 rounded-full border border-teal-600 flex items-center justify-center text-teal-600 hover:bg-teal-600 hover:text-white transition-all"
                  aria-label="Scroll Right"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="relative group">
            <div 
              ref={sliderRef}
              className="flex gap-4 md:gap-6 overflow-x-auto pb-12 px-4 md:px-[calc((100vw-1200px)/2)] no-scrollbar snap-x snap-mandatory scroll-smooth"
            >
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <div key={i} className="w-[160px] md:w-[220px] shrink-0 snap-start">
                    <SkeletonCard />
                  </div>
                ))
              ) : (
                bestSellers.map((product, i) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: i * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="w-[160px] md:w-[220px] shrink-0 snap-start"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>
      )}

      {/* Featured Collection Grid */}
      <section className="py-12 bg-teal-50/30">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="text-teal-600 font-black uppercase tracking-[0.4em] text-[10px]">Pure Coastal Bounty</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mt-3 text-slate-900 tracking-tight">Featured Collection</h2>
            <p className="text-slate-600 mt-4 max-w-lg mx-auto font-medium">Naturally sun-dried seafood, sourced directly from the fishermen of Cox's Bazar.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {loading ? (
              [...Array(10)].map((_, i) => (
                <SkeletonCard key={i} />
              ))
            ) : (
              featuredCollection.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          <div className="mt-10 text-center">
            <Link 
              to="/shop" 
              className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-teal-600 hover:scale-105 transition-all shadow-2xl shadow-slate-900/20"
            >
              Discover Full Shop <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>


      {/* Real Reviews — Auto-sliding Carousel */}
      <section className="py-12 bg-cream overflow-hidden">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-maroon mb-3">Customer Stories</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800">What They're Saying</h2>
            </div>
            <Link to="/reviews" className="text-maroon font-bold flex items-center gap-2 hover:gap-3 transition-all">All Reviews <ArrowRight size={20} /></Link>
          </div>
          {reviews.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden rounded-[40px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={reviewIdx}
                    initial={{ opacity: 0, x: slideDir * 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -slideDir * 60 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="bg-white p-10 md:p-14 rounded-[40px] shadow-soft border border-slate-50"
                  >
                    <div ref={reviewContentRef} className="flex flex-col">
                      <div className="flex gap-1 mb-6 text-amber-400">
                        {[...Array(reviews[reviewIdx]?.rating || 5)].map((_, idx) => <Star key={idx} size={20} fill="currentColor" />)}
                      </div>
                      <p className="text-slate-600 font-medium italic leading-relaxed md:text-xl mb-8 max-w-3xl">
                        "{reviews[reviewIdx]?.comment || reviews[reviewIdx]?.review}"
                      </p>
                      <div className="flex items-center gap-4 pt-6 border-t border-slate-50">
                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-black text-sm">
                          {(reviews[reviewIdx]?.customer_name || reviews[reviewIdx]?.name || '?')[0]}
                        </div>
                        <span className="font-black text-slate-900">{reviews[reviewIdx]?.customer_name || reviews[reviewIdx]?.name}</span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              {reviews.length > 1 && (
                <div className="flex items-center justify-center gap-6 mt-8">
                  <button
                    onClick={() => { setSlideDir(-1); setReviewIdx(prev => (prev - 1 + reviews.length) % reviews.length); }}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-maroon hover:text-white hover:border-maroon transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="flex items-center gap-3">
                    {reviews.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => { setSlideDir(i > reviewIdx ? 1 : -1); setReviewIdx(i); }}
                        className={clsx(
                          "w-2.5 h-2.5 rounded-full transition-all duration-500",
                          i === reviewIdx ? "bg-maroon w-8" : "bg-slate-300 hover:bg-slate-400"
                        )}
                      />
                    ))}
                  </div>
                  <button
                    onClick={() => { setSlideDir(1); setReviewIdx(prev => (prev + 1) % reviews.length); }}
                    className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-maroon hover:text-white hover:border-maroon transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100"><p className="text-slate-500 font-medium">No reviews yet.</p></div>
          )}
        </div>
      </section>

    </div>
    </>
  );
};

export default Home;
