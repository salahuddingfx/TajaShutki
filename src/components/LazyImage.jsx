import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const LazyImage = ({ src, alt, className, wrapperClassName, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={clsx("relative overflow-hidden", wrapperClassName)}>
      {/* Shimmer/Placeholder */}
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-100 flex items-center justify-center overflow-hidden"
          >
             <div className="w-full h-full relative">
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                  animate={{ translateX: ['-100%', '100%'] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={clsx(
          className,
          "transition-all duration-700",
          isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-105 blur-lg"
        )}
        {...props}
      />

      {error && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center text-slate-300">
          <span className="text-[10px] font-black uppercase tracking-widest">Image Failed</span>
        </div>
      )}
    </div>
  );
};

export default LazyImage;
