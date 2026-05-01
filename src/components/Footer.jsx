import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowUpRight, Facebook, Instagram, Youtube } from 'lucide-react';
import { TikTok } from './BrandIcons';
import { useSelector } from 'react-redux';
import { selectContact, selectSocialLinks } from '@/store/settingsSlice';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const contact = useSelector(selectContact);
  const socialLinks = useSelector(selectSocialLinks) || {};

  const socials = [
    { id: 'facebook', icon: Facebook, url: socialLinks.facebook },
    { id: 'instagram', icon: Instagram, url: socialLinks.instagram },
    { id: 'youtube', icon: Youtube, url: socialLinks.youtube },
    { id: 'tiktok', icon: TikTok, url: socialLinks.tiktok },
  ].filter(s => s.url);

  return (
    <footer className="bg-slate-950 text-slate-400 pt-24 pb-12 overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1000px] bg-maroon/5 rounded-full blur-[120px] -z-0" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          
          {/* Brand Identity */}
          <div className="space-y-10">
            <Link to="/" className="group inline-flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-maroon text-2xl font-black italic shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                T
              </div>
              <span className="text-3xl font-display font-black text-white tracking-tighter">
                Taja<span className="text-maroon">Shutki</span>
              </span>
            </Link>
            <p className="text-lg leading-relaxed text-slate-400 max-w-sm font-medium">
              Elevating the tradition of sun-dried delicacies with artisanal precision and coastal integrity.
            </p>
            <div className="flex gap-4">
              {socials.map((social) => (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-maroon hover:border-maroon transition-all duration-500 hover:scale-110"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Curations */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-10">Collections</h4>
            <ul className="space-y-6">
              {['All Products', 'Premium Selection', 'Spicy Coastal', 'Seasonal Specials'].map((item) => (
                <li key={item}>
                  <Link to="/shop" className="group flex items-center gap-2 hover:text-white transition-colors">
                    <span className="w-0 h-px bg-maroon group-hover:w-4 transition-all duration-500" />
                    <span className="font-bold tracking-tight">{item}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Client Concierge */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-10">Concierge</h4>
            <ul className="space-y-6 font-bold tracking-tight">
              <li><Link to="/track" className="hover:text-white transition-colors flex items-center gap-2">Order Tracking <ArrowUpRight size={14} className="opacity-40" /></Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story / About</Link></li>
              <li><Link to="/reviews" className="hover:text-white transition-colors">Customer Reviews</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Client FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy & Data</Link></li>
            </ul>
          </div>

          {/* Connection */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-10">Get in Touch</h4>
            <ul className="space-y-8 font-bold tracking-tight">
              <li className="flex gap-4">
                <MapPin className="text-maroon shrink-0" size={20} />
                <span className="text-sm leading-relaxed">{contact.address}</span>
              </li>
              <li className="flex gap-4">
                <Phone className="text-maroon shrink-0" size={20} />
                <span className="text-sm">{contact.phone}</span>
              </li>
              <li className="flex gap-4">
                <Mail className="text-maroon shrink-0" size={20} />
                <span className="text-sm">{contact.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Final Credits */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <p>© {currentYear} Taja Shutki Luxury</p>
              <div className="w-px h-4 bg-white/10" />
              <p>Direct from Cox's Bazar</p>
           </div>
           
           <div className="flex items-center gap-4 text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Handcrafted in</span>
              <span className="px-4 py-1.5 bg-white/5 rounded-full text-white text-[10px] font-black uppercase tracking-widest border border-white/10">Bangladesh</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
