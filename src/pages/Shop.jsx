import { useState, useMemo } from 'react';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/data/products';
import { Search, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectProductsBySite } from '@/store/productsSlice';
import { selectCurrentSiteId } from '@/store/settingsSlice';

const Shop = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSiteId = useSelector(selectCurrentSiteId);
  const siteProducts = useSelector(state => selectProductsBySite(state, currentSiteId));
  
  const selectedCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('search') || '';

  const filteredProducts = useMemo(() => {
    let result = siteProducts || [];
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (searchQuery) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [selectedCategory, searchQuery, siteProducts]);

  const handleSearchChange = (value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set('search', value);
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams, { replace: true });
  };

  const handleCategoryClick = (category) => {
    const newParams = new URLSearchParams(searchParams);
    if (category === 'All') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams, { replace: true });
  };

  return (
    <div className="bg-cream min-h-screen pb-20">
      {/* Header */}
      <div className="bg-maroon py-24 text-cream relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-0" />
        <div className="container-custom relative z-10">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-cream/60 mb-4">Premium Selection</p>
          <h1 className="text-5xl md:text-7xl font-display font-black mb-6 tracking-tight">Taja Shutki <span className="italic opacity-50">Market</span></h1>
          <p className="text-cream/70 max-w-2xl text-lg font-medium">
            Discover the finest sun-dried delicacies from the Bay of Bengal, delivered with coastal authenticity.
          </p>
        </div>
      </div>

      <div className="container-custom mt-[-60px] relative z-20">
        {/* Toolbar */}
        <div className={clsx(
          "bg-white/90 backdrop-blur-2xl rounded-[40px] shadow-premium p-8 mb-16 flex flex-col lg:flex-row gap-10 items-center justify-between border border-white/50",
          isDropdownOpen ? "relative z-50" : "relative z-20"
        )}>
          <div className="relative w-full lg:w-[500px]">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Search your favorites..."
              className="w-full pl-16 pr-8 py-5 bg-slate-100/50 border border-transparent rounded-[24px] focus:outline-none focus:ring-4 focus:ring-maroon/5 focus:bg-white focus:border-maroon/20 transition-all text-sm font-bold"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          
          <div className="relative group w-full lg:w-auto">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={clsx(
                "w-full lg:w-64 flex items-center justify-between px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                selectedCategory !== 'All' 
                  ? "bg-maroon text-cream border-maroon shadow-2xl shadow-maroon/20" 
                  : "bg-slate-100/50 text-slate-500 border-transparent hover:border-slate-200"
              )}
            >
              <span>{selectedCategory === 'All' ? 'Filter Categories' : selectedCategory}</span>
              <ChevronDown size={16} className={clsx("transition-transform duration-500", isDropdownOpen && "rotate-180")} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  <motion.div 
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                    className="absolute top-full right-0 mt-3 w-full md:w-72 bg-white rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 border border-slate-100 z-[100] overflow-hidden"
                  >
                    <div className="grid grid-cols-1 gap-2">
                      <button
                        onClick={() => { handleCategoryClick('All'); setIsDropdownOpen(false); }}
                        className={clsx(
                          "w-full text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                          selectedCategory === 'All' ? "bg-maroon text-cream" : "hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                        )}
                      >
                        All Categories
                      </button>
                      <div className="h-px bg-slate-100 my-1 mx-2" />
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => { handleCategoryClick(cat); setIsDropdownOpen(false); }}
                          className={clsx(
                            "w-full text-left px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                            selectedCategory === cat ? "bg-maroon text-cream shadow-lg" : "hover:bg-slate-50 text-slate-400 hover:text-slate-900"
                          )}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 bg-white/50 backdrop-blur-xl rounded-[48px] border border-white/60 shadow-premium">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <Search size={36} className="text-slate-300" />
            </div>
            <h3 className="text-2xl font-display font-black text-slate-800 mb-3">No Treasures Found</h3>
            <p className="text-slate-400 font-medium">Try adjusting your filters or refining your search.</p>
            <button 
              onClick={() => setSearchParams({}, { replace: true })}
              className="mt-8 text-maroon font-black uppercase tracking-widest text-[10px] hover:scale-110 transition-transform"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
