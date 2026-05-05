import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Loader2, CheckCircle2, MessageCircle } from 'lucide-react';
import { Facebook, Instagram, Twitter } from '../components/BrandIcons';
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectContact } from '../store/settingsSlice';
import { submitContact } from '../api/api';
import { clsx } from 'clsx';

const Contact = () => {
  const contact = useSelector(selectContact);
  
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null);
    try {
      await submitContact(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: <Phone size={24} />,
      title: "Call Us",
      details: contact.support_phone || contact.phone || "+880 1234-567890",
      description: "Mon-Fri from 9am to 6pm",
      color: "bg-blue-500",
      lightColor: "bg-blue-50/50 text-blue-600"
    },
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      details: contact.store_email || contact.email || "hello@tajashutki.com",
      description: "Our friendly team is here to help",
      color: "bg-teal-600",
      lightColor: "bg-teal-50 text-teal-600"
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      details: contact.address || "Marine Drive, Cox's Bazar, Bangladesh",
      description: "Headquarters",
      color: "bg-slate-500",
      lightColor: "bg-slate-50 text-slate-600"
    }
  ];

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      {/* Dynamic Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] bg-slate-900 overflow-hidden flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[120%] bg-teal-500/5 skew-x-[-15deg] blur-3xl" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[30%] h-[80%] bg-teal-600/10 rounded-full blur-[120px]" />
          <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-teal-100 mb-8">
                <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
                Connect With Us
              </span>
              <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-[1.1] tracking-tighter mb-8">
                We'd love to hear <br />
                <span className="text-teal-400/40">from you.</span>
              </h1>
              <p className="text-slate-400 text-lg md:text-xl max-w-xl leading-relaxed font-medium">
                Have questions about our premium sun-dried delicacies or want to discuss a bulk 
                partnership? Our team is always ready to assist you.
              </p>
            </motion.div>
          </div>
        </div>
        
        {/* Decorative Scroll Down */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30">
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-teal-500 to-transparent" />
        </div>
      </section>

      <div className="container-custom -mt-24 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar: Info Cards */}
          <div className="lg:col-span-4 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
              {contactInfo.map((info, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white p-8 rounded-[32px] shadow-soft border border-slate-100 group hover:shadow-premium hover:-translate-y-1 transition-all duration-500"
                >
                  <div className={clsx(
                    "w-14 h-14 rounded-2xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6",
                    info.lightColor
                  )}>
                    {info.icon}
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-3">{info.title}</h3>
                  <p className="text-lg font-black text-slate-800 leading-tight mb-2">{info.details}</p>
                  <p className="text-xs font-bold text-slate-400">{info.description}</p>
                </motion.div>
              ))}
            </div>

            {/* Hours Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-teal-950 p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                    <Clock size={20} className="text-teal-400" />
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-teal-400/60">Operating Hours</h4>
                </div>
                
                <div className="space-y-5">
                  <div className="flex justify-between items-center group/item">
                    <span className="text-teal-400/40 text-sm font-bold group-hover/item:text-teal-400 transition-colors">Sat - Thu</span>
                    <span className="text-sm font-black tracking-tight bg-white/5 px-4 py-2 rounded-xl border border-white/5">9:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center group/item">
                    <span className="text-teal-400/40 text-sm font-bold group-hover/item:text-teal-400 transition-colors">Friday</span>
                    <span className="text-sm font-black tracking-tight text-teal-400 bg-teal-400/5 px-4 py-2 rounded-xl border border-teal-400/20 uppercase">Closed</span>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                  {[Facebook, Instagram, Twitter, MessageCircle].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-teal-500 hover:text-white transition-all duration-500">
                      <Icon size={18} />
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Main: Contact Form */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-8 bg-white rounded-[48px] shadow-premium-lg border border-slate-100 overflow-hidden"
          >
            <div className="p-8 md:p-12 lg:p-20 relative">
              {/* Background Accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-[100px] -z-0 opacity-50" />

              <div className="relative z-10">
                <header className="mb-12">
                  <div className="inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-teal-50 border border-teal-100 text-teal-600 mb-6">
                    <MessageSquare size={18} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Message Desk</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800 tracking-tight">
                    Send us a <span className="text-teal-600">message.</span>
                  </h2>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <AnimatePresence>
                    {success && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-6 rounded-3xl flex items-center gap-4 overflow-hidden"
                      >
                        <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                          <CheckCircle2 size={20} />
                        </div>
                        <div>
                          <p className="font-black text-sm uppercase tracking-tight">Submission Received</p>
                          <p className="text-xs font-bold opacity-80">We'll get back to you within 24 hours.</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-teal-600 transition-colors">
                        Full Name
                      </label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Salah Uddin" 
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:bg-white focus:border-teal-600/20 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      />
                    </div>
                    <div className="group space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-teal-600 transition-colors">
                        Email Address
                      </label>
                      <input 
                        type="email" 
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="salah@example.com" 
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:bg-white focus:border-teal-600/20 transition-all font-bold text-slate-800 placeholder:text-slate-300"
                      />
                    </div>
                  </div>

                  <div className="group space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-teal-600 transition-colors">
                      Subject Matter
                    </label>
                    <div className="relative">
                      <select 
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[24px] focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:bg-white focus:border-teal-600/20 transition-all font-bold text-slate-800 appearance-none cursor-pointer"
                      >
                        <option value="General Inquiry">General Inquiry</option>
                        <option value="Bulk Order Request">Bulk Order Request</option>
                        <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                        <option value="Support">Support & Logistics</option>
                      </select>
                      <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                        <Globe size={18} />
                      </div>
                    </div>
                  </div>

                  <div className="group space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-teal-600 transition-colors">
                      Your Message
                    </label>
                    <textarea 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      placeholder="Tell us everything..." 
                      rows="6" 
                      className="w-full px-8 py-6 bg-slate-50 border border-slate-100 rounded-[32px] focus:outline-none focus:ring-4 focus:ring-teal-500/5 focus:bg-white focus:border-teal-600/20 transition-all font-bold text-slate-800 placeholder:text-slate-300 resize-none"
                    ></textarea>
                  </div>

                  <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-4 text-slate-400">
                      <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-200 flex items-center justify-center animate-spin-slow">
                        <Clock size={16} />
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest max-w-[150px]">
                        Average response time: <span className="text-slate-800">4 Hours</span>
                      </p>
                    </div>

                    <button 
                      type="submit" 
                      disabled={loading}
                      className="w-full md:w-auto bg-teal-600 text-white px-12 py-6 rounded-[24px] font-black uppercase tracking-[0.2em] text-[10px] shadow-teal-600/20 shadow-2xl hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all duration-500 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          Dispatch Message
                          <Send size={18} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            {/* Visual Footer/Accent */}
            <div className="h-4 bg-gradient-to-r from-teal-600 via-teal-400 to-teal-600 shadow-inner" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
