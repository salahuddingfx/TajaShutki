import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-[40px] shadow-premium border border-black/[0.01] overflow-hidden h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden rounded-t-[40px]">
        <motion.div 
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-10 pt-6 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1 h-1 rounded-full bg-slate-200" />
          <div className="h-2 w-20 bg-slate-100 rounded-full" />
        </div>
        
        <div className="h-6 w-3/4 bg-slate-100 rounded-lg mb-3" />
        
        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col gap-2">
             <div className="h-2 w-12 bg-slate-50 rounded-full" />
             <div className="h-6 w-16 bg-slate-100 rounded-lg" />
          </div>
          
          <div className="w-14 h-14 rounded-2xl bg-slate-50" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
