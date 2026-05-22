import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShoppingBag, SearchX } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

const NotFound = () => {
  const initData = useSelector((state) => state.settings?.initData);
  const siteName = initData?.site?.name || 'TajaShutki';
  return (
    <>
      <Helmet>
        <title>{`Page Not Found | ${siteName}`}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <div className="min-h-[70vh] flex items-center justify-center bg-cream px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-28 h-28 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8"
        >
          <SearchX size={56} className="text-teal-600" />
        </motion.div>

        <h1 className="text-8xl font-display font-black text-teal-600 mb-4">404</h1>
        <h2 className="text-2xl font-display font-bold text-slate-800 mb-3">Page Not Found</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          This page swam away!<br />
          Let's get you back to shore.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-teal-600 text-white rounded-full font-bold hover:bg-teal-700 transition-all shadow-xl shadow-teal-600/20"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            to="/shop"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-teal-600 border-2 border-teal-200 rounded-full font-bold hover:border-teal-600 hover:bg-teal-600 hover:text-white transition-all"
          >
            <ShoppingBag size={18} />
            Browse Shop
          </Link>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default NotFound;
