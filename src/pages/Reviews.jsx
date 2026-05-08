import { useState, useEffect } from 'react';
import { getReviews } from '../api/api';
import { Star, Loader2, MessageSquare, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [featuredIdx, setFeaturedIdx] = useState(0);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        const response = await getReviews({});
        setReviews(response.data);
      } catch (err) {
        console.error("Failed to fetch reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReviews();
  }, []);

  const featured = reviews.slice(0, 5);

  useEffect(() => {
    if (featured.length <= 1) return;
    const timer = setInterval(() => {
      setFeaturedIdx(prev => (prev + 1) % featured.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [featured.length]);

  const nextFeatured = () => setFeaturedIdx(prev => (prev + 1) % featured.length);
  const prevFeatured = () => setFeaturedIdx(prev => (prev - 1 + featured.length) % featured.length);

  const renderStars = (rating) => (
    <div className="flex text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <Star key={i} size={16} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i < Math.floor(rating) ? "" : "text-slate-300"} />
      ))}
    </div>
  );

  return (
    <div className="bg-cream min-h-screen pb-20">
      {loading ? (
        <div className="flex justify-center py-40">
          <Loader2 className="animate-spin text-maroon" size={40} />
        </div>
      ) : reviews.length === 0 ? (
        <div className="container-custom max-w-6xl pt-20">
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <MessageSquare size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No reviews yet!</h3>
            <p className="text-slate-500">Be the first to share your experience. Purchase a product and leave a review!</p>
          </div>
        </div>
      ) : (
        <>
          {/* Featured Reviews Carousel */}
          <section className="relative bg-slate-900 overflow-hidden pt-16 pb-24">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-10" />
            <div className="container-custom relative z-20">
              <div className="text-center mb-12">
                <span className="inline-block px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-teal-300 mb-6">
                  Customer Love
                </span>
                <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight tracking-tighter">
                  What Our Community Says
                </h1>
                <p className="text-slate-400 text-lg mt-4 max-w-2xl mx-auto font-medium">
                  Real stories from real customers who love our products.
                </p>
              </div>

              {featured.length > 0 && (
                <div className="max-w-3xl mx-auto">
                  <div className="overflow-hidden rounded-[32px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={featuredIdx}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 md:p-14 rounded-[32px]"
                      >
                        <div className="flex gap-1 mb-6">
                          {[...Array(featured[featuredIdx]?.rating || 5)].map((_, i) => (
                            <Star key={i} size={22} fill="#fbbf24" className="text-amber-400" />
                          ))}
                        </div>
                        <p className="text-white/90 text-xl md:text-2xl font-medium italic leading-relaxed mb-8">
                          "{featured[featuredIdx]?.comment}"
                        </p>
                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-teal-500/20 flex items-center justify-center text-teal-300 font-black text-lg">
                              {(featured[featuredIdx]?.customer_name || 'C')[0]}
                            </div>
                            <div>
                              <p className="font-bold text-white">{featured[featuredIdx]?.customer_name}</p>
                              {featured[featuredIdx]?.product && (
                                <p className="text-xs text-teal-300/60">{featured[featuredIdx]?.product?.name}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  <div className="flex items-center justify-center gap-6 mt-8">
                    <button onClick={prevFeatured} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all">
                      <ChevronLeft size={18} />
                    </button>
                    <div className="flex items-center gap-2">
                      {featured.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setFeaturedIdx(i)}
                          className={`w-2 h-2 rounded-full transition-all duration-500 ${i === featuredIdx ? 'bg-teal-400 w-6' : 'bg-white/20 hover:bg-white/40'}`}
                        />
                      ))}
                    </div>
                    <button onClick={nextFeatured} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* All Reviews — Masonry Grid */}
          <div className="container-custom max-w-6xl -mt-12 relative z-30">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {reviews.map((review, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  key={review.id} 
                  className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 break-inside-avoid relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-5">
                    <MessageSquare size={64} />
                  </div>
                  
                  {renderStars(review.rating)}
                  
                  <p className="text-slate-600 leading-relaxed my-6 font-medium text-lg italic relative z-10">
                    "{review.comment}"
                  </p>
                  
                  <div className="pt-4 border-t border-slate-100 mt-auto">
                    <p className="font-bold text-slate-800">{review.customer_name}</p>
                    
                    {review.media && review.media.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {review.media.map((m, idx) => (
                          <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-slate-100 shadow-sm cursor-pointer hover:border-slate-800/30 transition-all">
                            {m.type === 'image' ? (
                              <img 
                                src={m.file_path} 
                                alt="Review" 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                                onClick={() => window.open(m.file_path, '_blank')}
                              />
                            ) : (
                              <div 
                                className="w-full h-full bg-slate-900 flex items-center justify-center text-white"
                                onClick={() => window.open(m.file_path, '_blank')}
                              >
                                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                  <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-white border-b-[5px] border-b-transparent ml-1" />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {review.product && (
                      <p className="text-xs font-bold text-slate-600 mt-4 bg-slate-100 inline-block px-2 py-1 rounded-md uppercase tracking-wider">
                        {review.product.name}
                      </p>
                    )}
                    <p className="text-xs text-slate-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Reviews;
