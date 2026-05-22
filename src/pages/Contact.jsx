import { Mail, Phone, MapPin, Clock, MessageCircle, HelpCircle, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { Facebook, Instagram, Twitter, TikTok, Youtube } from '../components/BrandIcons';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectContact, selectSocialLinks } from '../store/settingsSlice';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  const initData = useSelector((state) => state.settings?.initData);
  const contact = useSelector(selectContact);
  const socialLinks = useSelector(selectSocialLinks);
  const siteName = initData?.site?.name || 'Taja Shutki';

  const contactInfo = [
    {
      icon: Phone,
      title: 'Call Us',
      details: contact.phone || '+880 1886-460526',
      sub: 'Mon-Fri from 9am to 6pm'
    },
    {
      icon: Mail,
      title: 'Email Us',
      details: contact.email || 'hello@tajashutki.com',
      sub: 'Online support 24/7'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: contact.address || "Cox's Bazar, Bangladesh",
      sub: 'Sea-side processing unit'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      details: '09:00 AM - 09:00 PM',
      sub: 'Daily operational hours'
    }
  ];

  const activeSocials = [
    { icon: Facebook, link: socialLinks.facebook, name: 'Facebook' },
    { icon: Instagram, link: socialLinks.instagram, name: 'Instagram' },
    { icon: Twitter, link: socialLinks.twitter, name: 'Twitter' },
    { icon: TikTok, link: socialLinks.tiktok, name: 'TikTok' },
    { icon: Youtube, link: socialLinks.youtube, name: 'YouTube' },
  ].filter(s => s.link && s.link !== '' && s.link !== '#');

  return (
    <>
      <Helmet>
        <title>{`Contact Us | ${siteName}`}</title>
        <meta name="description" content={`Get in touch with the ${siteName} team for orders, queries, and support.`} />
        <meta property="og:title" content={`Contact Us | ${siteName}`} />
        <meta property="og:description" content={`Get in touch with the ${siteName} team for orders, queries, and support.`} />
      </Helmet>
      <div className="bg-[#F4F9F6] min-h-screen">
      {/* Top Info Cards Row */}
      <div className="container-custom pt-32 pb-12 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 rounded-[40px] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-50 flex flex-col items-center text-center group hover:border-emerald-600/20 transition-all"
            >
              <div className="w-16 h-16 bg-emerald-600/5 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <info.icon size={28} />
              </div>
              <h3 className="font-display font-black text-lg text-slate-900 mb-2 uppercase tracking-tight">{info.title}</h3>
              <p className="text-slate-500 font-bold text-sm leading-relaxed whitespace-pre-line">{info.details}</p>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-2">{info.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="container-custom py-12 relative z-10">
        <div className="bg-white rounded-[60px] p-12 md:p-24 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-slate-50 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/5 rounded-full blur-[100px] -mr-48 -mt-48" />
          
          <div className="max-w-3xl mx-auto text-center relative z-10">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-block px-6 py-2 bg-emerald-600/10 rounded-full text-emerald-700 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
            >
              Get in touch
            </motion.div>
            <h1 className="text-6xl md:text-7xl font-display font-black text-slate-900 mb-8 tracking-tighter leading-tight">
              How can we <span className="text-emerald-600 italic">help?</span>
            </h1>
            <p className="text-xl text-slate-500 font-medium leading-relaxed mb-12">
              Our team is here to ensure your experience with Taja Shutki is as fresh and authentic as our sea products.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              {activeSocials.map((social, idx) => (
                <a 
                  key={idx}
                  href={social.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-emerald-600 hover:text-white hover:scale-110 hover:rotate-6 transition-all duration-300"
                  title={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Support Cards */}
      <div className="container-custom pb-32 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* WhatsApp Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-emerald-600 rounded-[50px] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl shadow-emerald-900/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8">
                <MessageCircle size={32} />
              </div>
              <h2 className="text-4xl font-display font-black mb-4 tracking-tight">WhatsApp Us</h2>
              <p className="text-white/80 font-medium text-lg mb-10 max-w-sm">
                Get instant support and exclusive oceanic updates directly on your phone.
              </p>
              <a 
                href={`https://wa.me/${(contact.whatsapp || socialLinks.whatsapp || '8801886460526').replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-emerald-700 px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-all hover:scale-105 active:scale-95 shadow-xl"
              >
                Start Chatting <ArrowRight size={16} />
              </a>
            </div>
            <MessageCircle size={200} className="absolute -bottom-20 -right-20 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
          </motion.div>

          {/* Help Center Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 rounded-[50px] p-10 md:p-16 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/20 rounded-full blur-3xl -mr-32 -mt-32" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-3xl flex items-center justify-center mb-8">
                <HelpCircle size={32} />
              </div>
              <h2 className="text-4xl font-display font-black mb-4 tracking-tight">Help Center</h2>
              <p className="text-white/60 font-medium text-lg mb-10 max-w-sm">
                Find answers to frequently asked questions about our sea products and shipping.
              </p>
              <Link 
                to="/faq" 
                className="inline-flex items-center gap-3 bg-emerald-600 text-white px-10 py-5 rounded-[24px] font-black uppercase tracking-widest text-xs hover:bg-emerald-600/80 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-emerald-600/20"
              >
                Visit FAQ <ArrowRight size={16} />
              </Link>
            </div>
            <HelpCircle size={200} className="absolute -bottom-20 -right-20 text-white/5 group-hover:rotate-12 transition-transform duration-700" />
          </motion.div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="container-custom pb-32">
        <div className="bg-slate-50 rounded-[40px] p-10 flex flex-wrap justify-center gap-10 md:gap-20 border border-slate-100">
          <div className="flex items-center gap-4">
             <ShieldCheck size={24} className="text-emerald-600" />
             <span className="font-black text-[10px] uppercase tracking-widest text-slate-800">100% Authentic</span>
          </div>
          <div className="flex items-center gap-4">
             <Truck size={24} className="text-emerald-600" />
             <span className="font-black text-[10px] uppercase tracking-widest text-slate-800">Safe Delivery</span>
          </div>
          <div className="flex items-center gap-4">
             <MessageCircle size={24} className="text-emerald-600" />
             <span className="font-black text-[10px] uppercase tracking-widest text-slate-800">Active Support</span>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;
