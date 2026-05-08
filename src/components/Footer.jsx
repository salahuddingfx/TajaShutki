import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, ArrowUpRight, Heart } from 'lucide-react';
import { TikTok, Facebook, Instagram, Youtube } from './BrandIcons';
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
    <footer className="bg-slate-950 text-slate-400 pt-8 pb-4 overflow-hidden relative border-t border-white/5">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-maroon/5 rounded-full blur-[120px] -z-0" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
          
          {/* Brand Identity */}
          <div className="space-y-6">
            <Link to="/" className="group inline-flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-maroon text-xl font-black italic shadow-2xl transition-transform duration-500 group-hover:rotate-12">
                T
              </div>
              <span className="text-2xl font-display font-black text-white tracking-tighter">
                Taja<span className="text-maroon">Shutki</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400 max-w-sm font-medium">
              Elevating the tradition of sun-dried delicacies with artisanal precision and coastal integrity.
            </p>
            <div className="flex gap-3">
              {socials.map((social) => (
                <a 
                  key={social.id} 
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-maroon hover:border-maroon transition-all duration-500"
                >
                  <social.icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:pl-12">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Quick Links</h4>
            <ul className="grid grid-cols-2 gap-y-4 gap-x-4 font-bold tracking-tight text-xs">
              <li><Link to="/shop" className="hover:text-white transition-colors">Shop All</Link></li>
              <li><Link to="/track" className="hover:text-white transition-colors">Track Order</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Our Story</Link></li>
              <li><Link to="/reviews" className="hover:text-white transition-colors">Reviews</Link></li>
              <li><Link to="/wishlist" className="hover:text-rose-400 transition-colors flex items-center gap-1.5"><Heart size={12} className="text-rose-400" /> Wishlist</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="md:pl-12">
            <h4 className="text-white font-black uppercase tracking-widest text-[10px] mb-6">Contact Us</h4>
            <ul className="space-y-4 font-bold tracking-tight">
              <li className="flex gap-3 items-start text-xs">
                <MapPin className="text-maroon shrink-0" size={16} />
                <span className="leading-relaxed">{contact.address}</span>
              </li>
              <li className="flex gap-3 items-center text-xs">
                <Phone className="text-maroon shrink-0" size={16} />
                <span>{contact.phone}</span>
              </li>
              <li className="flex gap-3 items-center text-xs">
                <Mail className="text-maroon shrink-0" size={16} />
                <span>{contact.email}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Final Credits */}
        <div className="pt-4 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <p>© {currentYear} Taja Shutki</p>
              <div className="hidden md:block w-px h-3 bg-white/10" />
              <p>Direct from Cox's Bazar</p>
              <div className="hidden md:block w-px h-3 bg-white/10" />
              <Link 
                to="/developer" 
                className="group relative flex items-center gap-3 px-5 py-2.5 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 hover:border-maroon transition-all duration-500 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-maroon/0 via-maroon/10 to-maroon/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="w-5 h-5 rounded-md overflow-hidden border border-white/20 shrink-0">
                  <img src="https://github.com/salahuddingfx.png" alt="Dev" className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 group-hover:text-white transition-colors flex items-center gap-2">
                   Architect: <span className="text-maroon">Salah Uddin Kader</span>
                   <ArrowUpRight size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </Link>

           </div>
           
           <div className="flex items-center gap-4 text-slate-500">
              <span className="text-[10px] font-black uppercase tracking-widest">Handcrafted in</span>
              <span className="px-3 py-1 bg-white/5 rounded-full text-white text-[9px] font-black uppercase tracking-widest border border-white/10 italic">Bangladesh</span>
           </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
