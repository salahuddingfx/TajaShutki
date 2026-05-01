import Hero from '@/components/Hero';
import ProductCard from '@/components/ProductCard';
import { useSelector } from 'react-redux';
import { selectProductsBySite } from '@/store/productsSlice';
import { selectCurrentSiteId } from '@/store/settingsSlice';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categories } from '@/data/products';

const Home = () => {
  const currentSiteId = useSelector(selectCurrentSiteId);
  const siteProducts = useSelector(state => selectProductsBySite(state, currentSiteId));
  const featuredProducts = siteProducts.slice(0, 4);

  const displayCategories = categories.filter(c => c !== 'All').map(cat => {
    const product = siteProducts.find(p => p.category === cat);
    return { name: cat, image: product?.image || siteProducts[0]?.image };
  }).slice(0, 4);

  const features = [
    {
      icon: <ShieldCheck className="text-maroon" size={32} />,
      title: "100% Naturally Dried",
      description: "Traditional sun-drying process without any chemical preservatives."
    },
    {
      icon: <Truck className="text-maroon" size={32} />,
      title: "Fast Delivery",
      description: "Carefully packed and delivered to your doorstep."
    },
    {
      icon: <Star className="text-maroon" size={32} />,
      title: "Premium Quality",
      description: "Only the freshest ingredients and spices are used."
    }
  ];

  return (
    <div className="bg-cream min-h-screen">
      <Hero />

      {/* Features */}
      <section className="py-20 bg-white">
        {/* ... existing features mapping ... */}
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center flex flex-col items-center"
              >
                <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{feature.title}</h3>
                <p className="text-slate-500">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 overflow-hidden">
        <div className="container-custom">
          <div className="mb-16">
             <span className="text-maroon font-bold tracking-widest uppercase text-sm">Curated Collections</span>
             <h2 className="text-5xl font-display font-bold mt-4 tracking-tighter">Featured Categories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayCategories.map((cat, index) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={`/shop?category=${cat.name}`}
                  className="group relative block aspect-[4/5] overflow-hidden rounded-[40px] shadow-premium"
                >
                  <img 
                    src={cat.image} 
                    alt={cat.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  
                  <div className="absolute inset-0 p-10 flex flex-col justify-end">
                    <p className="text-cream/60 text-[10px] font-black uppercase tracking-[0.4em] mb-2">Heritage</p>
                    <h3 className="text-2xl font-display font-black text-white mb-6 group-hover:text-maroon transition-colors">{cat.name}</h3>
                    <div className="flex items-center gap-4 text-white font-black uppercase tracking-widest text-[10px] opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                      <span>Explore</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-24">
        <div className="container-custom">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-maroon font-bold tracking-widest uppercase text-sm">Our Favorites</span>
              <h2 className="text-4xl font-display font-bold mt-2">Best Sellers</h2>
            </div>
            <Link to="/shop" className="text-maroon font-bold flex items-center gap-2 hover:gap-3 transition-all">
              View All <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-24 bg-white/50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="text-maroon font-bold tracking-[0.4em] uppercase text-[10px]">Voices of the Coast</span>
            <h2 className="text-4xl md:text-5xl font-display font-black mt-4 tracking-tighter">Verified Reviews</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Hasan Mahmud",
                review: "The sun-dried Loitta is perfectly salted and very fresh. Tastes like home. Will definitely order again.",
                rating: 5,
                date: "3 days ago"
              },
              {
                name: "Nasrin Sultana",
                review: "Finally found high-quality dried fish online. The packaging kept the aroma sealed. Very impressed with the quality.",
                rating: 5,
                date: "1 week ago"
              },
              {
                name: "Imtiaz Rahim",
                review: "Premium Rupchanda is a must-try. Fast delivery to Dhaka and excellent customer service.",
                rating: 5,
                date: "2 weeks ago"
              }
            ].map((rev, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-10 rounded-[40px] shadow-soft border border-slate-50 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6 text-amber-400">
                    {[...Array(rev.rating)].map((_, idx) => (
                      <Star key={idx} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-slate-600 font-medium italic leading-relaxed mb-8">"{rev.review}"</p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <span className="font-black text-slate-900 text-sm">{rev.name}</span>
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{rev.date}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Section */}
      <section className="py-32 bg-maroon text-cream overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-black/5 -skew-x-12 translate-x-1/2" />
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-20">
            <div className="flex-1 space-y-10">
              <span className="text-[10px] font-black uppercase tracking-[0.6em] text-cream/40 px-6 py-2 border border-cream/10 rounded-full">Coastal Heritage</span>
              <h2 className="text-5xl md:text-7xl font-display font-black leading-[0.9] tracking-tighter">
                Authentic Sea Taste, <br />Delivered Home.
              </h2>
              <p className="text-cream/70 text-lg leading-relaxed max-w-xl">
                We bring you the freshest sun-dried fish from the coastal waters of Bangladesh. Naturally preserved to lock in that authentic sea flavor you love.
              </p>
              <div className="flex flex-col sm:flex-row gap-10">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl">15+</div>
                  <span className="font-bold text-sm uppercase tracking-widest opacity-60">Fish Varieties</span>
                </div>
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center font-black text-xl">3k+</div>
                  <span className="font-bold text-sm uppercase tracking-widest opacity-60">Seafood Lovers</span>
                </div>
              </div>
              <Link to="/shop" className="group flex items-center gap-6 bg-white text-maroon px-12 py-6 rounded-3xl font-black uppercase tracking-[0.2em] text-xs hover:scale-105 transition-all shadow-2xl shadow-maroon/50">
                Explore Collection
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            <div className="flex-1 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-white/[0.03] rounded-full blur-3xl" />
              <motion.div
                initial={{ rotate: 0 }}
                whileInView={{ rotate: -5 }}
                transition={{ duration: 1 }}
                className="relative z-10"
              >
                <img 
                  src="https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop" 
                  alt="Dried fish process" 
                  className="rounded-[40px] shadow-2xl border-4 border-white/10"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
