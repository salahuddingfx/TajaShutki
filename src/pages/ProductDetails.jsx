import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { products } from '../data/products';
import { useDispatch } from 'react-redux';
import { addItem } from '../store/cartSlice';
import { formatPrice } from '../utils/delivery';
import { ShoppingCart, Plus, Minus, ChevronLeft, Shield, Truck, RefreshCcw } from 'lucide-react';
import { motion } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');

  useEffect(() => {
    const foundProduct = products.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setSelectedVariant(foundProduct.variants[0]);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container-custom py-40 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/shop" className="text-maroon font-bold mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addItem({ product, quantity }));
  };

  return (
    <div className="bg-cream min-h-screen pb-20 pt-10">
      <div className="container-custom">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-10">
          <Link to="/" className="hover:text-maroon transition-colors">Home</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <Link to="/shop" className="hover:text-maroon transition-colors">Shop</Link>
          <ChevronLeft size={14} className="rotate-180" />
          <span className="text-slate-800 font-medium">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-soft-lg border border-slate-100">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col"
          >
            <div className="mb-8">
              <span className="text-maroon font-bold tracking-widest uppercase text-sm">{product.category}</span>
              <h1 className="text-4xl md:text-5xl font-display font-bold mt-2 mb-4 text-slate-900">{product.name}</h1>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl font-bold text-maroon">{formatPrice(product.price)}</span>
                <span className="text-slate-400">/ {product.weight} kg</span>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg mb-8">
                {product.description}
              </p>
            </div>

            {/* Variants */}
            <div className="mb-8">
              <h4 className="font-bold text-slate-800 mb-4 uppercase text-xs tracking-widest">Select Weight</h4>
              <div className="flex gap-4">
                {product.variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-6 py-2 rounded-lg border-2 transition-all font-medium ${
                      selectedVariant === variant 
                      ? 'border-maroon bg-maroon/5 text-maroon' 
                      : 'border-slate-200 text-slate-500 hover:border-maroon/50'
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex flex-wrap gap-6 items-center mb-12">
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1 shadow-soft">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
                >
                  <Minus size={18} />
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors text-slate-500"
                >
                  <Plus size={18} />
                </button>
              </div>

              <button 
                onClick={handleAddToCart}
                className="btn-primary !px-12 flex-grow sm:flex-grow-0"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0">
                  <Truck size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Fast Delivery</h5>
                  <p className="text-xs text-slate-500">To all of BD</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0">
                  <Shield size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Safe Payment</h5>
                  <p className="text-xs text-slate-500">100% Secure</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-maroon/5 flex items-center justify-center text-maroon shrink-0">
                  <RefreshCcw size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-800">Easy Return</h5>
                  <p className="text-xs text-slate-500">Within 7 days</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
