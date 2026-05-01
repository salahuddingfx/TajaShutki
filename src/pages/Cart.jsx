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
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Cart = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotal);
  const cartCount = useSelector(selectCartCount);

  if (items.length === 0) {
    return (
      <div className="container-custom py-40 text-center bg-cream min-h-[70vh]">
        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-soft">
          <ShoppingBag size={40} className="text-maroon/20" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-4">Your cart is empty</h2>
        <p className="text-slate-500 mb-10 max-w-md mx-auto">
          Looks like you haven't added any of our delicious pickles to your cart yet.
        </p>
        <Link to="/shop" className="btn-primary inline-flex">
          Go to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen pb-20 pt-10">
      <div className="container-custom">
        <h1 className="text-4xl font-display font-bold mb-12">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl shadow-soft border border-slate-100 flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-24 h-24 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-grow text-center sm:text-left">
                  <h3 className="font-bold text-lg text-slate-800">{item.name}</h3>
                  <p className="text-sm text-slate-400 mb-2">{item.category?.name || item.category || 'Uncategorized'} • {item.weight}kg</p>
                  <p className="font-bold text-maroon">{formatPrice(item.price)}</p>
                </div>

                <div className="flex items-center bg-slate-50 rounded-lg p-1">
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-500 rounded"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-10 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                    className="w-8 h-8 flex items-center justify-center hover:bg-slate-200 transition-colors text-slate-500 rounded"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="text-right sm:min-w-[100px]">
                  <p className="font-bold text-slate-800">{formatPrice(item.price * item.quantity)}</p>
                </div>

                <button 
                  onClick={() => dispatch(removeItem(item.id))}
                  className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-xl shadow-soft border border-slate-100 sticky top-32">
              <h3 className="font-display font-bold text-2xl mb-8">Order Summary</h3>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-slate-600 italic">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t border-slate-100 pt-4 mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold">Estimated Total</span>
                  <span className="text-2xl font-bold text-maroon">{formatPrice(totalPrice)}</span>
                </div>
              </div>

              <Link to="/checkout" className="btn-primary w-full py-4 text-lg">
                Proceed to Checkout
                <ArrowRight size={20} />
              </Link>
              
              <Link to="/shop" className="block text-center mt-6 text-sm font-medium text-slate-500 hover:text-maroon transition-colors">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
