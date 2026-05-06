import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectContact } from '../store/settingsSlice';
import { MessageCircle, Phone, X, Send, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

const WhatsAppFloat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const contact = useSelector(selectContact);
  const number = contact?.whatsapp || contact?.phone || '';
  const phoneNumber = contact?.phone || '';
  
  const cleanNumber = number.replace(/\D/g, '');
  
  const topics = [
    { id: 'general', label: 'General Inquiry', message: 'Hello! I would like to know more about your fresh dried fish.' },
    { id: 'order', label: 'Order Support', message: 'Hi! I need help with my Taja Shutki order.' },
    { id: 'wholesale', label: 'Wholesale/Business', message: 'Hello! I am interested in wholesale dried fish opportunities.' },
  ];

  const handleWhatsApp = (message) => {
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  if (!cleanNumber) return null;

  return (
    <div className="fixed bottom-20 right-4 md:bottom-8 md:right-8 z-50 flex flex-col items-end">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20, transformOrigin: 'bottom right' }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-4 w-[260px] bg-white rounded-[28px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#075e54] p-5 text-white">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md">
                    <MessageCircle size={16} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="font-black text-[11px] uppercase tracking-widest">Chat with us</h3>
                    <p className="text-[9px] opacity-70 font-bold">Replies in minutes</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              <p className="text-[10px] font-medium leading-relaxed opacity-90">
                Hi there! 👋 Select a topic below to start chatting.
              </p>
            </div>

            {/* Content */}
            <div className="p-3 space-y-1.5">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] px-2 mb-1">Select a topic</p>
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  onClick={() => handleWhatsApp(topic.message)}
                  className="w-full group flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-100"
                >
                  <span className="text-[11px] font-black text-slate-700 group-hover:text-emerald-700">{topic.label}</span>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
                </button>
              ))}

              <div className="pt-1">
                <a
                  href={`tel:${phoneNumber}`}
                  className="w-full flex items-center justify-center gap-2 p-3 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-slate-900 transition-all shadow-lg active:scale-95"
                >
                  <Phone size={12} fill="currentColor" />
                  Call Support
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={clsx(
          "w-12 h-12 md:w-14 md:h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-500 group",
          isOpen ? "bg-slate-900 text-white" : "bg-[#25D366] text-white shadow-green-500/30"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={24} strokeWidth={3} />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle size={28} fill="currentColor" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
};

export default WhatsAppFloat;
