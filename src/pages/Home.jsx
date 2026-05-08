import { useState, useEffect, useRef } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { useSelector } from 'react-redux';
import { selectProductsBySite } from '@/store/productsSlice';
import { selectCurrentSiteId, selectCategories, selectContact, selectHomeSettings } from '@/store/settingsSlice';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, ShieldCheck, Truck, ArrowUpRight, Leaf, Heart,
  CheckCircle, Flame, Award, Waves, Clock, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getReviews } from '@/api/api';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

// Helper to map icon names to components
const IconMap = {
  Leaf, ShieldCheck, Truck, Star, Heart, Flame, Award, Waves, Clock, ChevronRight, CheckCircle
};

const Home = () => {
  const currentSiteId = useSelector(selectCurrentSiteId);
  const siteProducts = useSelector(state => selectProductsBySite(state, currentSiteId));
  const categories = useSelector(selectCategories);
  const contact = useSelector(selectContact);
  const homeSettings = useSelector(selectHomeSettings);
  const bestSellers = siteProducts.slice(0, 10);
  const featuredCollection = siteProducts.slice(0, 25);

  const [reviews, setReviews] = useState([]);
  const sliderRef = useRef(null);

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
        const res = await getReviews({ site_id: 2, limit: 3 });
        const data = Array.isArray(res) ? res : (res?.data || []);
        setReviews(data.slice(0, 3));
      } catch (err) {
        console.error('Failed to load reviews', err);
      }
    };
    fetchReviews();
  }, []);



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
                  className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-teal-600 hover:text-white transition-all"
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
              {bestSellers.map((product) => (
                <div key={product.id} className="w-[160px] md:w-[220px] shrink-0 snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
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
            {featuredCollection.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
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


      {/* Real Reviews */}
      <section className="py-12 bg-cream">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-maroon mb-3">Customer Stories</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800">What They're Saying</h2>
            </div>
            <Link to="/reviews" className="text-maroon font-bold flex items-center gap-2 hover:gap-3 transition-all">All Reviews <ArrowRight size={20} /></Link>
          </div>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev, i) => (
                <motion.div key={rev.id || i} className="bg-white p-8 rounded-[40px] shadow-soft border border-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-6 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-slate-600 font-medium italic leading-relaxed mb-6">"{rev.comment || rev.review}"</p>
                  </div>
                  <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                    <span className="font-black text-slate-900 text-sm">{rev.customer_name || rev.name}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-100"><p className="text-slate-400">No reviews yet.</p></div>
          )}
        </div>
      </section>

    </div>
    </>
  );
};

export default Home;
