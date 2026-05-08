import React from 'react';

const PageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header Skeleton */}
      <div className="h-20 bg-white border-b border-slate-100 flex items-center px-4 md:px-10 justify-between">
        <div className="w-40 h-10 bg-slate-200 rounded-lg animate-pulse" />
        <div className="hidden md:flex gap-10">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="w-16 h-4 bg-slate-100 rounded animate-pulse" />
          ))}
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
          <div className="w-10 h-10 bg-slate-100 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 px-4 md:px-10 py-10">
        {/* Top bar */}
        <div className="flex justify-between items-center mb-10">
            <div className="w-64 h-6 bg-slate-200 rounded animate-pulse" />
            <div className="w-32 h-10 bg-slate-100 rounded-full animate-pulse" />
        </div>

        {/* Categories/Banner area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="col-span-2 h-[450px] bg-slate-200 rounded-[2rem] animate-pulse" />
            <div className="h-[450px] bg-slate-100 rounded-[2rem] animate-pulse" />
        </div>

        {/* Section Title */}
        <div className="w-56 h-10 bg-slate-200 rounded-xl mb-10 animate-pulse" />

        {/* Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
            <div key={i} className="space-y-5">
              <div className="aspect-[4/5] bg-slate-200 rounded-[1.5rem] animate-pulse" />
              <div className="space-y-2">
                <div className="w-full h-5 bg-slate-100 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-slate-50 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
