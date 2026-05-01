import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useSelector, useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { selectHeroSlides } from '../store/settingsSlice';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const Hero = () => {
  const slides = useSelector(selectHeroSlides);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const slideRef = useRef(null);
  const contentRef = useRef(null);
  const dispatch = useDispatch();

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress >= 100) {
          nextSlide();
          return 0;
        }
        return oldProgress + 0.5; // Controls speed of auto-slide
      });
    }, 30);
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(contentRef.current.children, 
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1, stagger: 0.2, ease: "expo.out" }
      );
    });
    return () => ctx.revert();
  }, [currentSlide]);

  if (!slides.length) return null;
  const activeSlide = slides[currentSlide];

  return (
    <section className="relative h-[550px] w-full overflow-hidden bg-slate-950">
      {/* Cinematic Background Layer */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="absolute inset-0 z-0"
        >
          {/* Top Shadow for Navbar visibility */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-950/90 to-transparent z-15" />
          
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent z-10" />
          <div className="absolute inset-0 bg-black/40 z-5" />
          <img 
            src={activeSlide.image} 
            alt={activeSlide.title}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="container-custom relative z-20 h-full flex flex-col items-center">
        {/* Center Side: Main Text */}
        <div ref={contentRef} className="flex-1 flex flex-col justify-center items-center text-center max-w-4xl">
          <motion.div 
            key={`badge-${currentSlide}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block mb-4"
          >
             <span className="text-[10px] font-black uppercase tracking-[0.8em] text-cream/70 bg-white/5 backdrop-blur-md px-6 py-2 rounded-full border border-white/5 shadow-2xl">
               {activeSlide.badge || 'Coastal Traditions'}
             </span>
          </motion.div>

          <h1 className="text-5xl md:text-[6rem] font-display font-black text-white leading-[0.9] mb-6 tracking-tighter uppercase">
            {activeSlide.title}
          </h1>

          <p className="text-base md:text-lg text-cream/60 leading-relaxed max-w-xl mx-auto font-medium backdrop-blur-sm bg-black/5 p-3 rounded-xl">
            {activeSlide.subtitle}
          </p>
        </div>

        {/* Bottom Interaction Bar */}
        <div className="w-full pb-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* CTAs */}
          <div className="flex items-center gap-6">
            <button 
              onClick={() => dispatch(addItem({ product: { id: activeSlide.productId, name: activeSlide.title, price: activeSlide.price, image: activeSlide.image, weight: 0.5 } }))}
              className="group relative px-8 py-4 bg-maroon text-cream font-black uppercase tracking-widest text-[10px] rounded-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-maroon/20 flex items-center gap-3"
            >
              <ShoppingBag size={16} />
              Add to Cart
            </button>

            <Link 
              to={`/product/${activeSlide.productId}`}
              className="group flex items-center gap-4"
            >
              <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-maroon transition-all duration-500">
                <ArrowUpRight size={18} className="group-hover:rotate-45 transition-transform" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-0.5">Story</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest group-hover:text-maroon transition-colors">Discover Story</span>
              </div>
            </Link>
          </div>

          {/* Progress & Navigation */}
          <div className="flex items-center gap-10">
            <div className="hidden lg:flex items-center gap-4">
               {slides.map((_, index) => (
                 <div 
                   key={index}
                   className="flex items-center gap-3 cursor-pointer group"
                   onClick={() => { setCurrentSlide(index); setProgress(0); }}
                 >
                   <span className={clsx(
                     "text-[10px] font-black transition-all duration-500",
                     index === currentSlide ? "text-maroon" : "text-white/40 group-hover:text-white/60"
                   )}>
                     0{index + 1}
                   </span>
                   <div className="w-10 h-[2px] bg-white/10 relative overflow-hidden rounded-full">
                      {index === currentSlide && (
                        <motion.div 
                          className="absolute inset-0 bg-maroon"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                   </div>
                 </div>
               ))}
            </div>

            <div className="flex items-center gap-3">
              <button onClick={prevSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all duration-500">
                <ChevronLeft size={20} />
              </button>
              <button onClick={nextSlide} className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-white hover:text-slate-950 transition-all duration-500">
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
