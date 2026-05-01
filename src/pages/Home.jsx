import { useState, useEffect } from 'react';
import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { useSelector } from 'react-redux';
import { selectProductsBySite } from '@/store/productsSlice';
import { selectCurrentSiteId, selectCategories, selectContact, selectHomeSettings } from '@/store/settingsSlice';
import { motion } from 'framer-motion';
import {
  ArrowRight, Star, ShieldCheck, Truck, ArrowUpRight, Leaf, Heart,
  CheckCircle, MessageCircle, Mail, Flame, Award, Waves, Clock, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getReviews, submitContact } from '@/api/api';
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
  const featuredProducts = siteProducts.slice(0, 4);

  const [reviews, setReviews] = useState([]);
  const [email, setEmail] = useState('');
  const [newsletterLoading, setNewsletterLoading] = useState(false);

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
    .map(cat => {
      const product = siteProducts.find(p => p.category_id === cat.id);
      return {
        name: cat.name,
        image: cat.image_path || product?.image || siteProducts[0]?.image || 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=400&auto=format&fit=crop',
      };
    })
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

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setNewsletterLoading(true);
    try {
      await submitContact({ name: 'Newsletter', email, message: 'Newsletter subscription request.', site_id: 2 });
      toast.success('Subscribed! We\'ll keep you posted. 🎉');
      setEmail('');
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setNewsletterLoading(false);
    }
  };

  const whatsappUrl = contact?.whatsapp
    ? `https://wa.me/${contact.whatsapp.replace(/\D/g, '')}`
    : 'https://wa.me/';

  return (
    <>
      <Helmet>
        <title>Home | Taja Shutki - Premium Dried Fish & Seafood</title>
        <meta name="description" content="Shop premium quality naturally dried fish and seafood directly from Cox's Bazar at Taja Shutki." />
      </Helmet>
      <div className="bg-cream min-h-screen">
      <Hero />

      {/* Why Us */}
      <section className="py-24 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-maroon mb-3">Why Taja Shutki</p>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800">The Taja Shutki Difference</h2>
            <div className="w-20 h-1 bg-maroon mx-auto rounded-full mt-5" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyUs.map((item, i) => {
              const Icon = IconMap[item.icon] || Waves;
              return (
                <motion.div key={i} className="group flex gap-5 p-8 rounded-3xl bg-cream border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-400">
                  <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center shrink-0 group-hover:bg-teal-100 transition-colors">
                    <Icon size={22} className="text-teal-700" />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 mb-2">{item.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      {displayCategories.length > 0 && (
        <section className="py-24 overflow-hidden">
          <div className="container-custom">
            <div className="mb-16">
              <span className="text-maroon font-bold tracking-widest uppercase text-sm">Coastal Collections</span>
              <h2 className="text-5xl font-display font-bold mt-4 tracking-tighter">Featured Categories</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayCategories.map((cat, index) => (
                <motion.div key={cat.name}>
                  <Link to={`/shop?category=${cat.name}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[40px] shadow-premium">
                    <img src={cat.image} alt={cat.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 p-10 flex flex-col justify-end">
                      <p className="text-cream/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Coastal</p>
                      <h3 className="text-2xl font-display font-black text-white mb-6 group-hover:text-maroon transition-colors">{cat.name}</h3>
                      <div className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-[10px] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                        <span>Explore</span><ArrowUpRight size={14} />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-24 bg-slate-950 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-teal-700/5 blur-[200px]" />
        <div className="container-custom relative z-10 text-center mb-20">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-teal-400 mb-3">Our Process</p>
          <h2 className="text-4xl md:text-5xl font-display font-black">Sea to Your Table</h2>
          <div className="w-20 h-1 bg-maroon mx-auto rounded-full mt-5" />
        </div>
        <div className="container-custom grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {processSteps.map((step, i) => (
            <motion.div key={i} className="relative z-10 bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 hover:border-white/20 transition-all duration-300 h-full">
              <div className="text-5xl font-display font-black mb-6 opacity-20" style={{ color: step.color }}>{step.step || `0${i+1}`}</div>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ backgroundColor: step.color + '25' }}>
                <CheckCircle size={22} style={{ color: step.color }} />
              </div>
              <h3 className="text-xl font-black mb-3">{step.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Real Reviews */}
      <section className="py-24 bg-cream">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-16 flex-wrap gap-4">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-maroon mb-3">Customer Stories</p>
              <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800">What They're Saying</h2>
            </div>
            <Link to="/reviews" className="text-maroon font-bold flex items-center gap-2 hover:gap-3 transition-all">All Reviews <ArrowRight size={20} /></Link>
          </div>
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {reviews.map((rev, i) => (
                <motion.div key={rev.id || i} className="bg-white p-10 rounded-[40px] shadow-soft border border-slate-50 flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 mb-6 text-amber-400">
                      {[...Array(rev.rating || 5)].map((_, idx) => <Star key={idx} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-slate-600 font-medium italic leading-relaxed mb-8">"{rev.comment || rev.review}"</p>
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

      {/* WhatsApp Strip */}
      <section className="bg-green-600 py-6">
        <div className="container-custom flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><MessageCircle size={22} /></div>
            <div>
              <p className="font-black text-lg">Chat with Us on WhatsApp</p>
              <p className="text-green-100 text-sm">Quick support & custom orders</p>
            </div>
          </div>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-white text-green-600 font-black px-8 py-4 rounded-2xl shadow-lg">Start Chat</a>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-700/10 blur-[150px]" />
        <div className="container-custom relative z-10 max-w-2xl text-center">
          <div className="w-16 h-16 bg-teal-700/20 rounded-3xl flex items-center justify-center mx-auto mb-8"><Mail size={28} className="text-teal-400" /></div>
          <h2 className="text-4xl font-display font-black mb-4">{homeSettings?.newsletter_title || 'Stay in the Loop'}</h2>
          <p className="text-slate-400 text-lg mb-10">{homeSettings?.newsletter_subtitle || 'Get notified about seasonal catches.'}</p>
          <form onSubmit={handleNewsletterSubmit} className="flex gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" className="flex-1 px-6 py-4 bg-white/10 border border-white/10 rounded-2xl text-white outline-none focus:border-maroon" />
            <button type="submit" className="px-8 py-4 bg-maroon text-white font-black rounded-2xl disabled:opacity-50">Subscribe</button>
          </form>
        </div>
      </section>
    </div>
    </>
  );
};

export default Home;
