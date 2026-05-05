import { useSelector } from 'react-redux';
import { selectContact } from '@/store/settingsSlice';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const WhatsAppFloat = () => {
  const contact = useSelector(selectContact);
  const number = contact?.whatsapp || contact?.phone || '';
  
  // Clean the number for the WhatsApp link
  const cleanNumber = number.replace(/\D/g, '');
  const whatsappUrl = `https://wa.me/${cleanNumber}`;

  if (!cleanNumber) return null;

  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-[#25D366] text-white rounded-full shadow-xl shadow-green-500/30 flex items-center justify-center hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 group"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle size={28} fill="currentColor" className="text-white" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-xl">
        Chat with us
      </div>
    </motion.a>
  );
};

export default WhatsAppFloat;
