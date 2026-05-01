import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, Loader2, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { selectContact } from '../store/settingsSlice';
import { submitContact } from '../api/api';

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
      details: contact.support_phone || contact.phone || "+880 1330-336084",
      description: "Mon-Fri from 9am to 6pm",
      color: "bg-blue-50 text-blue-600"
    },
    {
      icon: <Mail size={24} />,
      title: "Email Us",
      details: contact.store_email || contact.email || "support@tajashutki.com",
      description: "Our friendly team is here to help",
      color: "bg-maroon/5 text-maroon"
    },
    {
      icon: <MapPin size={24} />,
      title: "Visit Us",
      details: contact.address || "Dhaka, Bangladesh",
      description: "Headquarters",
      color: "bg-green-50 text-green-600"
    }
  ];

  return (
    <div className="bg-cream min-h-screen">
      {/* Premium Header */}
      <div className="bg-maroon pt-32 pb-48 text-cream overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
        <div className="container-custom relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="inline-block bg-white/10 backdrop-blur-md px-4 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              Get In Touch
            </span>
            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight">
              We'd love to hear <br /> from you.
            </h1>
            <p className="text-cream/70 text-lg md:text-xl max-w-xl leading-relaxed">
              Have questions about our pickles or want to discuss a bulk order? Our team is always ready to assist you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom -mt-32 pb-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-soft border border-black/[0.03] group hover:border-maroon/20 transition-all duration-500"
              >
                <div className={`w-14 h-14 rounded-2xl ${info.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  {info.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">{info.title}</h3>
                <p className="font-bold text-slate-900 mb-1">{info.details}</p>
                <p className="text-sm text-slate-500">{info.description}</p>
              </motion.div>
            ))}

            {/* Quick Stats/Hours */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-maroon p-8 rounded-3xl text-cream"
            >
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-cream/60" />
                <h4 className="font-bold uppercase tracking-widest text-xs">Operating Hours</h4>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-cream/60">Saturday - Thursday</span>
                  <span className="font-bold">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-cream/60">Friday</span>
                  <span className="font-bold text-maroon-light">Closed</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Contact Form Card */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white rounded-[40px] shadow-soft-lg border border-black/[0.03] overflow-hidden flex flex-col md:flex-row"
          >
            <div className="flex-grow p-8 md:p-12 lg:p-16">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-full bg-maroon/5 text-maroon flex items-center justify-center">
                  <MessageSquare size={20} />
                </div>
                <h2 className="text-3xl font-display font-bold text-slate-800">Send a Message</h2>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {success && (
                  <div className="md:col-span-2 bg-green-50 text-green-700 p-4 rounded-2xl flex items-center gap-3">
                    <CheckCircle2 size={20} />
                    <p className="font-medium text-sm">Your message has been sent successfully!</p>
                  </div>
                )}
                {error && (
                  <div className="md:col-span-2 bg-red-50 text-red-700 p-4 rounded-2xl">
                    <p className="font-medium text-sm">{error}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="John Doe" 
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-maroon/10 focus:bg-white focus:border-maroon/20 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="john@example.com" 
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-maroon/10 focus:bg-white focus:border-maroon/20 transition-all font-medium"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-2xl focus:outline-none focus:ring-2 focus:ring-maroon/10 focus:bg-white focus:border-maroon/20 transition-all font-medium appearance-none"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Bulk Order Request">Bulk Order Request</option>
                    <option value="Feedback & Suggestions">Feedback & Suggestions</option>
                    <option value="Support">Support</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Tell us how we can help..." 
                    rows="5" 
                    className="w-full px-6 py-4 bg-slate-50 border border-transparent rounded-3xl focus:outline-none focus:ring-2 focus:ring-maroon/10 focus:bg-white focus:border-maroon/20 transition-all font-medium resize-none"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="btn-primary w-full md:w-auto px-12 group disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={18} className="animate-spin" /> Sending...
                      </span>
                    ) : (
                      <>
                        Send Message
                        <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
            
            {/* Sidebar with Image/Brand */}
            <div className="hidden xl:flex w-72 bg-maroon relative items-center justify-center p-12 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-cream text-maroon rounded-3xl flex items-center justify-center text-4xl font-display font-bold rotate-12 mb-8 shadow-2xl">
                  A
                </div>
                <p className="text-cream/60 text-sm italic">"Taste the tradition in every message."</p>
              </div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cream/20 to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
