import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Shop from '@/pages/Shop';
import ProductDetails from '@/pages/ProductDetails';
import Cart from '@/pages/Cart';
import Checkout from '@/pages/Checkout';
import OrderTracking from '@/pages/OrderTracking';
import Contact from '@/pages/Contact';
import FAQ from '@/pages/FAQ';
import PrivacyPolicy from '@/pages/PrivacyPolicy';
import Terms from '@/pages/Terms';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchProducts } from './store/productsSlice';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/track" element={<OrderTracking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
