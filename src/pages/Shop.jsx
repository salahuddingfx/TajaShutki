import { useState, useMemo, useEffect } from 'react';
import ProductCard from '@/components/ProductCard';
import { Search, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectProductsBySite } from '@/store/productsSlice';
import { selectCurrentSiteId, selectCategories } from '@/store/settingsSlice';
import { Helmet } from 'react-helmet-async';
import SkeletonCard from '@/components/SkeletonCard';

const Shop = () => {
  const [activeDropdown, setActiveDropdown] = useState(null); // 'category', 'price', 'rating'
  const [searchParams, setSearchParams] = useSearchParams();
  const currentSiteId = useSelector(selectCurrentSiteId);
  const siteProducts = useSelector(state => selectProductsBySite(state, currentSiteId));
  const categories = useSelector(selectCategories);
  
  const selectedCategoryName = searchParams.get('category') || 'All';
  const selectedPriceRange = searchParams.get('price') || 'All';
  const searchQuery = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const priceRanges = [
    { label: 'All Prices', value: 'All' },
    { label: 'Under ৳500', value: '0-500' },
    { label: '৳500 - ৳1000', value: '500-1000' },
    { label: '৳1000 - ৳2000', value: '1000-2000' },
    { label: 'Above ৳2000', value: '2000-99999' },
  ];


  useEffect(() => {
    const timer = setTimeout(() => {
      const newParams = new URLSearchParams(searchParams);
      if (localSearch) {
        newParams.set('search', localSearch);
      } else {
        newParams.delete('search');
      }
      setSearchParams(newParams, { replace: true });
    }, 500);

    return () => clearTimeout(timer);
  }, [localSearch]);

  const filteredProducts = useMemo(() => {
    let result = siteProducts || [];
    
    // Category Filter
    if (selectedCategoryName !== 'All') {
      result = result.filter(p => p.category?.name === selectedCategoryName || p.category === selectedCategoryName);
    }
    
    // Price Filter
    if (selectedPriceRange !== 'All') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      result = result.filter(p => p.price >= min && p.price <= max);
    }

    
    // Search Filter
    if (searchQuery) {
      result = result.filter(p =>
        (p.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return result;
  }, [selectedCategoryName, selectedPriceRange, searchQuery, siteProducts]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentItems = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategoryName, selectedPriceRange, searchQuery]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All') {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams, { replace: true });
    setActiveDropdown(null);
  };

  const clearAllFilters = () => {
    setSearchParams({}, { replace: true });
    setLocalSearch('');
  };

  return (
    <>
      <Helmet>
        <title>Shop | Taja Shutki - Premium Dried Fish & Seafood</title>
        <meta name="description" content="Browse our premium collection of naturally dried fish and seafood." />
      </Helmet>
      
      <div className="bg-[#FAF9F6] min-h-screen pt-10 pb-20">
        <div className="container-custom">
          {/* Header Area - Minimal */}
          <div className="mb-6">
            <h1 className="text-3xl md:text-4xl font-display font-black text-slate-900 tracking-tight uppercase italic">
              Shutki <span className="text-emerald-600">Collection</span>
            </h1>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-80 shrink-0">
              <div className="bg-white rounded-[32px] shadow-premium p-8 border border-slate-100 sticky top-28">
                <div className="space-y-10">
                  {/* Search */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Search</h3>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                      <input 
                        type="text" 
                        placeholder="Search products..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:bg-white focus:border-emerald-600/20 transition-all text-xs font-bold"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Categories */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Categories</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleFilterChange('category', 'All')}
                        className={clsx(
                          "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border",
                          selectedCategoryName === 'All' 
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" 
                            : "bg-slate-50 text-slate-500 border-transparent hover:border-slate-200"
                        )}
                      >
                        All
                      </button>
                      {categories.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleFilterChange('category', cat.name)}
                          className={clsx(
                            "px-4 py-2 rounded-xl text-[10px] font-bold transition-all border",
                            selectedCategoryName === cat.name 
                              ? "bg-emerald-600 text-white border-emerald-600 shadow-lg" 
                              : "bg-slate-50 text-slate-500 border-transparent hover:border-slate-200"
                          )}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 px-2">Price Range</h3>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <button
                          key={range.value}
                          onClick={() => handleFilterChange('price', range.value)}
                          className={clsx(
                            "w-full text-left px-5 py-3 rounded-xl text-[10px] font-bold transition-all flex items-center justify-between group",
                            selectedPriceRange === range.value 
                              ? "bg-slate-900 text-white shadow-lg" 
                              : "text-slate-500 hover:bg-slate-50"
                          )}
                        >
                          {range.label}
                          {selectedPriceRange === range.value && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                        </button>
                      ))}
                    </div>
                  </div>


                  <button 
                    onClick={clearAllFilters}
                    className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:bg-emerald-600/5 rounded-2xl transition-all"
                  >
                    Clear All
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-grow">
              {/* Mobile Toolbar */}
              <div className="lg:hidden mb-8 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {/* Category Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'category' ? null : 'category')}
                      className={clsx(
                        "w-full px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider border flex items-center justify-between",
                        selectedCategoryName !== 'All' ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-100 shadow-sm"
                      )}
                    >
                      <span className="truncate">{selectedCategoryName === 'All' ? 'Cat' : selectedCategoryName}</span>
                      <ChevronDown size={12} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === 'category' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-slate-50 z-50 p-2 overflow-hidden"
                        >
                          {[{ name: 'All' }, ...categories].map((cat) => (
                            <button
                              key={cat.id || 'all'}
                              onClick={() => handleFilterChange('category', cat.name || 'All')}
                              className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                            >
                              {cat.name || 'All Categories'}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Price Dropdown */}
                  <div className="relative">
                    <button 
                      onClick={() => setActiveDropdown(activeDropdown === 'price' ? null : 'price')}
                      className={clsx(
                        "w-full px-3 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider border flex items-center justify-between",
                        selectedPriceRange !== 'All' ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-600 border-slate-100 shadow-sm"
                      )}
                    >
                      <span>Price</span>
                      <ChevronDown size={12} />
                    </button>
                    <AnimatePresence>
                      {activeDropdown === 'price' && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white rounded-2xl shadow-premium border border-slate-50 z-50 p-2"
                        >
                          {priceRanges.map((range) => (
                            <button
                              key={range.value}
                              onClick={() => handleFilterChange('price', range.value)}
                              className="w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold text-slate-600 hover:bg-slate-50"
                            >
                              {range.label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                </div>

                {/* Search Mobile */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                  <input 
                    type="text" 
                    placeholder="Search products..."
                    className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-600/10 transition-all text-[10px] font-bold shadow-sm"
                    value={localSearch}
                    onChange={(e) => setLocalSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Product Grid */}
              {!siteProducts || siteProducts.length === 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {Array(8).fill(0).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {currentItems.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-40 bg-white rounded-[48px] border border-slate-50 shadow-sm">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Search size={32} className="text-slate-200" />
                  </div>
                  <h3 className="text-xl font-display font-black text-slate-800 mb-2">No results found</h3>
                  <p className="text-slate-400 font-medium text-sm">Try adjusting your filters or clearing all.</p>
                  <button 
                    onClick={clearAllFilters}
                    className="mt-6 text-emerald-600 font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-transform"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-2">
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className={clsx(
                        "w-10 h-10 rounded-xl font-black transition-all",
                        currentPage === i + 1 
                          ? "bg-emerald-600 text-white shadow-glow" 
                          : "bg-white text-slate-400 hover:text-slate-800 border border-slate-100"
                      )}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Shop;
