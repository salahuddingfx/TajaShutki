import { motion } from 'framer-motion';
import { Globe, Mail, Code2, Zap, Palette, Rocket, User, Server, Database, Layout, Cpu } from 'lucide-react';
import { Instagram } from '../components/BrandIcons';
import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

const GithubIcon = ({ size = 18 }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg>
);

const Developer = () => {
  const initData = useSelector((state) => state.settings?.initData);
  const siteName = initData?.site?.name || 'TajaShutki';
  return (
    <>
      <Helmet>
        <title>{`Meet the Developer | ${siteName}`}</title>
        <meta name="description" content={`Learn more about the architect behind ${siteName}.`} />
        <meta property="og:title" content={`Meet the Developer | ${siteName}`} />
        <meta property="og:description" content={`Learn more about the architect behind ${siteName}.`} />
      </Helmet>
      <div className="bg-cream min-h-screen py-24 overflow-hidden relative">
      {/* Abstract Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-maroon/5 rounded-full blur-[120px] -z-0" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-maroon/5 rounded-full blur-[100px] -z-0" />

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-20">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-block px-6 py-2 bg-maroon/10 rounded-full text-maroon text-[10px] font-black uppercase tracking-[0.3em] mb-6"
            >
              The Architect
            </motion.div>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-display font-black text-slate-900 mb-8 tracking-tighter"
            >
              Designed & Built with <span className="text-maroon italic">Excellence.</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              This platform was engineered to deliver a seamless multi-store e-commerce experience, blending coastal aesthetics with modern performance.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Developer Profile Card */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="md:col-span-1 bg-white p-10 rounded-[40px] shadow-soft border border-slate-100 flex flex-col items-center text-center"
            >
              <div className="w-32 h-32 rounded-3xl overflow-hidden mb-8 shadow-2xl rotate-3 border-4 border-white">
                <img src="https://github.com/salahuddingfx.png" alt="Salah Uddin Kader" className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Salah Uddin Kader</h2>
              <p className="text-maroon font-bold uppercase tracking-widest text-[10px] mb-8">Full-Stack Developer & UI Architect</p>
              
              <div className="flex gap-4 mb-10">
                <a href="https://github.com/salahuddingfx" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><GithubIcon size={18} /></a>
                <a href="https://instagram.com/salahuddingfx" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Instagram size={18} /></a>
                <a href="https://salahuddin.codes" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Globe size={18} /></a>
                <a href="mailto:salauddinkaderappy@gmail.com" className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-slate-900 hover:text-white transition-all"><Mail size={18} /></a>
              </div>

              <div className="w-full space-y-8 pt-10 border-t border-slate-50">
                <p className="text-sm font-bold text-slate-800 uppercase tracking-widest text-[10px]">Technical Expertise</p>
                
                <div className="space-y-6 text-left">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-maroon font-black uppercase text-[9px] tracking-widest">
                      <Layout size={12} /> Frontend
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['MERN Stack', 'React.js', 'Next.js', 'Tailwind'].map(s => (
                        <span key={s} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-blue-600 font-black uppercase text-[9px] tracking-widest">
                      <Server size={12} /> Backend
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['PHP', 'Laravel', 'Django', 'Node.js', 'Python'].map(s => (
                        <span key={s} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100">{s}</span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-orange-600 font-black uppercase text-[9px] tracking-widest">
                      <Database size={12} /> Database & Dev
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {['MySQL', 'PostgreSQL', 'Redis', 'WebSockets', 'Cloud'].map(s => (
                        <span key={s} className="px-3 py-1 bg-slate-50 rounded-lg text-[9px] font-bold text-slate-500 border border-slate-100">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Technical Highlights */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="md:col-span-2 space-y-8"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-sm hover:shadow-xl transition-all duration-500 group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Code2 size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Clean Architecture</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Built with a scalable multi-tenant architecture to power multiple storefronts from a single source of truth.</p>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-sm hover:shadow-xl transition-all duration-500 group">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Real-time Core</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Powered by WebSockets for instant order tracking and notification synchronization across all devices.</p>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-sm hover:shadow-xl transition-all duration-500 group">
                  <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Palette size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Premium UI/UX</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Meticulously crafted design tokens, micro-animations, and responsive layouts for a high-end feel.</p>
                </div>

                <div className="bg-white/60 backdrop-blur-md p-8 rounded-[32px] border border-white shadow-sm hover:shadow-xl transition-all duration-500 group">
                  <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Rocket size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 tracking-tight">Performance Driven</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">Optimized for speed with lightweight dependencies and efficient API communication strategies.</p>
                </div>
              </div>

              {/* Bottom Message */}
              <div className="bg-slate-900 p-10 rounded-[40px] text-white flex flex-col sm:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-white/10 transition-colors" />
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-2 tracking-tight">Ready for the Next Level?</h4>
                  <p className="text-slate-400 text-sm font-medium">Let's build something extraordinary together.</p>
                </div>
                <button 
                  onClick={() => window.open('https://salahuddin.codes', '_blank')}
                  className="relative z-10 px-8 py-4 bg-maroon rounded-2xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-xl shadow-maroon/20"
                >
                  Contact Developer
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Developer;
