import { motion } from 'framer-motion';

const SkeletonCard = () => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-full flex flex-col">
      {/* Image Skeleton */}
      <div className="relative aspect-square bg-slate-50 overflow-hidden">
        <motion.div 
          animate={{ x: ['-100%', '100%'] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-100 to-transparent"
        />
      </div>

      {/* Content Skeleton */}
      <div className="p-5 flex flex-col flex-grow gap-4">
        <div className="space-y-2">
          <div className="h-4 w-3/4 bg-slate-100 rounded-lg overflow-hidden relative">
            <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
          <div className="h-3 w-1/2 bg-slate-50 rounded-lg" />
        </div>
        
        <div className="mt-auto flex items-center justify-between">
          <div className="h-8 w-24 bg-slate-100 rounded-xl overflow-hidden relative">
             <motion.div animate={{ x: ['-100%', '100%'] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent" />
          </div>
          <div className="w-10 h-10 rounded-full bg-slate-50" />
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
