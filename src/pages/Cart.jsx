import { useSelector, useDispatch } from 'react-redux';
import { 
  selectCartItems, 
  selectCartTotal, 
  selectCartCount, 
  removeItem, 
  updateQuantity 
} from '../store/cartSlice';
import { Link } from 'react-router-dom';
import { formatPrice } from '../utils/delivery';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  if (items.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl border border-slate-100">
            <ShoppingBag size={48} className="text-blue-600/20" />
          </div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4 tracking-tight">Your cart is empty</h2>
          <p className="text-slate-500 mb-10 max-w-sm mx-auto text-lg font-medium">
            Looks like you haven't added any of our fresh dried fish to your bag yet.
          </p>
          <Link 
            to="/shop" 
            className="inline-flex items-center gap-3 bg-blue-600 text-white px-10 py-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/20 group"
          >
            Start Shopping
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-32 pt-20">
      <div className="container-custom">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">My Shopping Bag</h1>
          <div className="flex items-center gap-4 text-slate-500 font-bold">
            <span>{cartCount} Premium Items</span>
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="text-blue-600">Free delivery over ৳2000</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Items List */}
          <div className="lg:col-span-8 space-y-8">
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9, x: -20 }}
                  className="group relative bg-white p-8 rounded-[32px] shadow-[0_10px_40px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col sm:flex-row gap-8 items-center hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all duration-500"
                >
                  <div className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 bg-slate-50 p-2 border border-slate-100">
                    <img 
                      src={item.image_path || item.image || 'https://images.unsplash.com/photo-1514516348920-f319999a5e8f?q=80&w=400&auto=format&fit=crop'} 
                      alt={item.name} 
                      className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110" 
                    />
                  </div>
                  
                  <div className="flex-grow text-center sm:text-left">
                    <div className="flex items-center gap-2 mb-2 opacity-60 justify-center sm:justify-start">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.category?.name || item.category || 'Pure Dried'}</span>
                    </div>
                    <h3 className="font-bold text-2xl text-slate-800 mb-2 group-hover:text-blue-600 transition-colors tracking-tight">{item.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-slate-400 font-bold justify-center sm:justify-start">
                      <span>{item.weight}kg</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span>{formatPrice(item.price)} each</span>
                    </div>
                  </div>

                  <div className="flex items-center bg-slate-50 rounded-2xl p-1.5 border border-slate-100">
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      disabled={item.quantity <= 1}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all text-slate-500 rounded-xl disabled:opacity-30"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-12 text-center font-black text-slate-800 text-lg">{item.quantity}</span>
                    <button 
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-white hover:text-blue-600 transition-all text-slate-500 rounded-xl"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="text-right sm:min-w-[120px]">
                    <p className="font-black text-3xl text-slate-900 tracking-tighter">{formatPrice(item.price * item.quantity)}</p>
                  </div>

                  <button 
                    onClick={() => dispatch(removeItem(item.id))}
                    className="absolute top-4 right-4 p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-300"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10">
              <div className="flex items-center gap-4 p-8 bg-white rounded-3xl border border-slate-100/50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Truck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Fresh Delivery</h4>
                  <p className="text-xs text-slate-400 font-medium">Safe & Fast Shipping</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-8 bg-white rounded-3xl border border-slate-100/50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">100% Pure</h4>
                  <p className="text-xs text-slate-400 font-medium">Naturally Dried</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-8 bg-white rounded-3xl border border-slate-100/50">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <RefreshCcw size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Easy Swap</h4>
                  <p className="text-xs text-slate-400 font-medium">7-day Return Policy</p>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-white p-10 rounded-[40px] shadow-[0_40px_80px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-600/5 rounded-full -mr-20 -mt-20 blur-3xl" />
              
              <h3 className="font-black text-3xl mb-10 text-slate-900 tracking-tight">Summary</h3>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Cart Subtotal</span>
                  <span className="text-slate-900">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-bold">
                  <span>Delivery Fee</span>
                  <span className="text-blue-600 uppercase text-xs tracking-widest">Calculated Later</span>
                </div>
                <div className="pt-8 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Grand Total</span>
                    <h4 className="text-4xl font-black text-blue-600 mt-1 tracking-tighter">{formatPrice(totalPrice)}</h4>
                  </div>
                </div>
              </div>

              <Link 
                to="/checkout" 
                className="flex items-center justify-center gap-4 bg-blue-600 text-white w-full py-6 rounded-3xl font-black text-xl hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/40 group"
              >
                Checkout Now
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <div className="mt-10 pt-8 border-t border-slate-50 flex flex-col gap-6">
                <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] justify-center">
                  <ShieldCheck size={14} className="text-blue-600" />
                  <span>Secure Transaction Guaranteed</span>
                </div>
                <Link to="/shop" className="text-center text-sm font-black text-slate-400 hover:text-blue-600 transition-colors uppercase tracking-widest">
                  Back to Shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
