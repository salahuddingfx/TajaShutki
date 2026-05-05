import React from 'react';
import { ShieldCheck, Truck, CreditCard, RefreshCw, Scale, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms = () => {
  const sections = [
    {
      id: 1,
      title: "Order Placement",
      icon: UserCheck,
      notes: [
        "Orders can be placed 24/7 through our official website.",
        "Ensure all contact and delivery information is accurate to avoid delays.",
        "A confirmation call or message may be sent for large orders."
      ]
    },
    {
      id: 2,
      title: "Payment Policy",
      icon: CreditCard,
      notes: [
        "We support Cash on Delivery (COD) across Bangladesh.",
        "Online payments via SSLCommerz (bKash, Nagad, Visa/Mastercard) are available.",
        "Prices are inclusive of applicable taxes unless stated otherwise."
      ]
    },
    {
      id: 3,
      title: "Delivery & Shipping",
      icon: Truck,
      notes: [
        "Delivery within Dhaka: 48-72 hours.",
        "Outside Dhaka: 3-5 business days.",
        "Delivery charges are calculated based on location and weight."
      ]
    },
    {
      id: 4,
      title: "Quality Assurance",
      icon: ShieldCheck,
      notes: [
        "All products are handcrafted with natural ingredients.",
        "We follow strict hygiene and safety standards during production.",
        "Shelf life is mentioned on the packaging for each item."
      ]
    },
    {
      id: 5,
      title: "Return & Refund",
      icon: RefreshCw,
      notes: [
        "Report damaged or incorrect items within 24 hours of delivery.",
        "Refunds are processed within 7-10 working days for valid claims.",
        "Product must be in its original packaging for returns."
      ]
    },
    {
      id: 6,
      title: "Governance",
      icon: Scale,
      notes: [
        "All terms are governed by the laws of Bangladesh.",
        "We reserve the right to update policies without prior notice.",
        "By using this site, you agree to comply with all stated conditions."
      ]
    }
  ];

  return (
    <div className="bg-cream min-h-screen pt-32 pb-20 px-6">
      <div className="container-custom max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-maroon/60 mb-4 block">Legal Framework</span>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
            Terms & <span className="text-maroon">Conditions</span>
          </h1>
          <div className="w-20 h-1 bg-maroon mx-auto mt-6 rounded-full" />
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {sections.map((section, idx) => (
            <motion.div
              key={section.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-premium p-8 rounded-[32px] border border-white/50 relative overflow-hidden group hover:shadow-2xl transition-all duration-500"
            >
              <div className="flex flex-col md:flex-row gap-6 md:items-start relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-maroon flex items-center justify-center text-white shadow-lg shadow-maroon/20 shrink-0">
                  <section.icon size={24} />
                </div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    {section.title}
                    <span className="w-2 h-2 bg-maroon rounded-full opacity-20" />
                  </h3>
                  
                  <ul className="space-y-3">
                    {section.notes.map((note, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed group-hover:text-slate-900 transition-colors">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-maroon/40 shrink-0" />
                        <span className="font-medium">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Decorative Number */}
              <span className="absolute top-4 right-8 text-8xl font-black text-black/[0.03] pointer-events-none select-none italic">
                0{section.id}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 rounded-[32px] bg-slate-900 text-white text-center"
        >
          <p className="text-sm font-medium opacity-60 mb-2">Have specific questions?</p>
          <p className="text-lg font-bold">Contact our support team directly</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
