import { useState, useEffect } from 'react';
import { getReviews } from '../api/api';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllReviews = async () => {
      try {
        setLoading(true);
        window.scrollTo(0, 0);
        // Backend handles filtering `is_approved = true`
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

  const renderStars = (rating) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} fill={i < Math.floor(rating) ? "currentColor" : "none"} className={i < Math.floor(rating) ? "" : "text-slate-300"} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-cream min-h-screen pb-20 pt-10">
      <div className="container-custom max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-800 mb-4">Customer Love</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">See what our community is saying about our authentic, hand-picked ingredients.</p>
          <div className="w-24 h-1 bg-maroon mx-auto rounded-full mt-6"></div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-maroon" size={40} />
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 max-w-2xl mx-auto">
            <MessageSquare size={64} className="mx-auto text-slate-200 mb-6" />
            <h3 className="text-2xl font-bold text-slate-800 mb-2">No reviews yet!</h3>
            <p className="text-slate-500">Be the first to share your experience. Purchase a product and leave a review!</p>
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {reviews.map((review, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
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
                  {review.product && (
                    <p className="text-xs font-bold text-maroon mt-1 bg-maroon/5 inline-block px-2 py-1 rounded-md">
                      {review.product.name}
                    </p>
                  )}
                  <p className="text-xs text-slate-400 mt-2">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
