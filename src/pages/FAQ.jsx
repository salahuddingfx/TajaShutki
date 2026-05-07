import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageSquare } from 'lucide-react';

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      q: "How do I place an order for Shutki?",
      a: "Simply browse our collection of premium dried fish, add your desired quantity to the cart, and proceed to checkout. You can pay securely online or choose Cash on Delivery."
    },
    {
      q: "What payment methods are supported?",
      a: "We support bKash, Nagad, Rocket, and all major Debit/Credit cards. Cash on Delivery (COD) is also available across all districts of Bangladesh."
    },
    {
      q: "What is the typical delivery timeline?",
      a: "Within Dhaka, we deliver in 48-72 hours. For orders outside Dhaka, it typically takes 3-5 business days to reach your location."
    },
    {
      q: "Are your products naturally dried?",
      a: "Yes! All our fish are sun-dried using traditional methods on the shores of Cox's Bazar. We do not use any chemical drying agents or artificial heat."
    },
    {
      q: "Is there any sand or salt in the fish?",
      a: "We follow strict cleaning processes. While traditional drying involves salt for preservation, we ensure the salt levels are balanced and the fish are free from sand through thorough washing before drying."
    },
    {
      q: "How should I store dried fish?",
      a: "For long-term storage, we recommend keeping them in an airtight container inside the refrigerator. This preserves the aroma and prevents moisture buildup."
    },
    {
      q: "What is your return policy for food items?",
      a: "Due to the perishable nature of food, we only accept returns if the product is damaged, incorrect, or spoiled upon arrival. Return requests must be made within 24 hours."
    },
    {
      q: "Why do I need to record an unboxing video?",
      a: "An unedited unboxing video is mandatory for any claim regarding missing items or visible damage. This helps us verify the issue and process your claim quickly."
    },
    {
      q: "Can I change my order after payment?",
      a: "Order modifications are only possible before the status changes to 'Dispatched'. Once handed to the courier, we cannot change the items or delivery address."
    },
    {
      q: "Do you offer international shipping?",
      a: "Currently, we operate only within Bangladesh. However, we are exploring international logistics to serve our expatriate customers soon."
    },
    {
      q: "How are the products packaged?",
      a: "We use high-quality vacuum sealing for our premium shutki. This locks in freshness, prevents smell leakage during transit, and ensures a longer shelf life."
    },
    {
      q: "How do I track my shipment?",
      a: "After dispatch, you will receive a tracking link via SMS. You can also visit our 'Order Tracking' page and enter your order ID to see real-time updates."
    },
    {
      q: "Can I buy in bulk for wholesale?",
      a: "Yes, we offer wholesale pricing for bulk orders. Please contact our support team through the 'Contact' page or call our hotline for business inquiries."
    },
    {
      q: "Are your products safe for health?",
      a: "Our products are processed with high hygiene standards. However, if you have seafood allergies or high blood pressure, please consume moderately or consult a doctor."
    },
    {
      q: "How do I contact customer support?",
      a: "Our team is available from 10 AM to 10 PM. You can reach us via phone, Facebook Messenger, or the contact form on our website."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20 px-6">
      <div className="container-custom max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-teal-600/10 rounded-2xl flex items-center justify-center text-teal-600 mx-auto mb-6">
            <HelpCircle size={32} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600 mb-4 block">Information Hub</span>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
            Frequently Asked <span className="text-teal-600">Questions</span>
          </h1>
          <div className="w-20 h-1 bg-teal-600 mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className={`glass-premium rounded-3xl border border-white/50 overflow-hidden transition-all duration-300 ${activeIndex === i ? 'shadow-xl' : 'hover:shadow-md'}`}
            >
              <button
                onClick={() => toggleFAQ(i)}
                className="w-full p-6 text-left flex justify-between items-center group"
              >
                <span className={`font-bold text-lg transition-colors duration-300 ${activeIndex === i ? 'text-teal-600' : 'text-slate-800 group-hover:text-teal-600'}`}>
                  {faq.q}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${activeIndex === i ? 'bg-teal-600 text-white rotate-180' : 'bg-teal-600/10 text-teal-600'}`}>
                  {activeIndex === i ? <Minus size={18} /> : <Plus size={18} />}
                </div>
              </button>
              
              <AnimatePresence>
                {activeIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-slate-600 leading-relaxed font-medium text-sm">
                      <div className="pt-2 border-t border-teal-600/5">
                        {faq.a}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-10 rounded-[40px] bg-slate-900 text-white relative overflow-hidden group"
        >
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-black mb-2">Need more assistance?</h3>
              <p className="opacity-60 text-sm">Our support team is available to help you with any query.</p>
            </div>
            <button className="bg-teal-600 text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-teal-600/20">
              <MessageSquare size={20} />
              Contact Support
            </button>
          </div>
          
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-teal-600/20 rounded-full blur-[80px] group-hover:bg-teal-600/30 transition-all duration-700" />
        </motion.div>
      </div>
    </div>
  );
};

export default FAQ;
