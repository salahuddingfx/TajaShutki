import { useState, useEffect, useRef } from 'react';
import { getDynamicPage } from '../api/api';
import { useSelector } from 'react-redux';
import { Loader2, Star, Award, Leaf, Heart, Users, TrendingUp, ShieldCheck, Package, Waves } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ICONS = [Waves, Heart, Package, Leaf, TrendingUp, Award, ShieldCheck, Users];
const COLORS = ['#0f766e', '#800000', '#7c3aed', '#b45309', '#15803d', '#1d4ed8', '#0369a1', '#be185d'];

const defaultAbout = {
  hero_title: 'From the Sea to Your Table',
  hero_subtitle: "Born in Cox's Bazar, shaped by the tides. Taja Shutki carries the soul of coastal Bangladesh.",
  stats: [
    { label: 'Happy Customers', value: '8,000+' },
    { label: 'Products', value: '30+' },
    { label: 'Years of Craft', value: '8+' },
    { label: 'Quality Guarantee', value: '100%' },
  ],
  timeline: [
    { year: '2017', title: 'Born by the Shore', description: "Started by a family of fishermen in Cox's Bazar using generations-old drying techniques." },
    { year: '2018', title: 'First Local Market', description: 'Our shutki became a local sensation at the Cox\'s Bazar market.' },
    { year: '2019', title: 'Expanding the Range', description: 'Grew from one product to 15+ premium dried seafood varieties.' },
    { year: '2021', title: 'Nationwide Delivery', description: 'Launched online operations and started shipping to every district of Bangladesh.' },
    { year: '2023', title: 'Certified Premium', description: 'Earned premium food safety certification and partnered with 30+ fishing families.' },
    { year: '2025', title: 'The Luxury Collection', description: 'Launched Taja Shutki Luxury Collection — exclusive, small-batch sun-dried delicacies.' },
  ],
  team: [
    { name: 'Halima Khatun', role: 'Founder & Master Artisan', bio: "A third-generation fish-drying artisan, Halima's expertise is unmatched.", initials: 'HK' },
    { name: 'Jamal Uddin', role: 'Sourcing & Fishermen Relations', bio: 'Jamal maintains relationships with 30+ coastal fishing families.', initials: 'JU' },
    { name: 'Rima Akter', role: 'Quality & Packaging', bio: "Rima's obsession with hygiene means every product meets the highest standards.", initials: 'RA' },
    { name: 'Noman Chowdhury', role: 'Logistics & Customer Care', bio: 'Noman ensures every order reaches you on time and in perfect condition.', initials: 'NC' },
  ],
  cta_title: 'Taste the Coast',
  cta_subtitle: "Every product is a chapter in our story. Now it's time to make it yours.",
};

const About = () => {
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const initData = useSelector((state) => state.settings?.initData);
  const rawAbout = initData?.site?.settings?.about;
  const about = rawAbout
    ? (typeof rawAbout === 'string' ? JSON.parse(rawAbout) : rawAbout)
    : defaultAbout;

  const timelineRef = useRef(null);
  const statsRef = useRef(null);
  const teamRef = useRef(null);

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        setLoading(true);
        const response = await getDynamicPage('about-us');
        setPageData(response.data || response);
      } catch (err) {
        console.error('About us page not found', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  useEffect(() => {
    if (loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo('.about-hero-text', { opacity: 0, y: 60 }, { opacity: 1, y: 0, duration: 1, stagger: 0.15, ease: 'power3.out' });

      gsap.fromTo('.stat-card', { opacity: 0, scale: 0.8, y: 40 }, {
        opacity: 1, scale: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: statsRef.current, start: 'top 80%' }
      });

      gsap.fromTo('.timeline-line', { scaleY: 0, transformOrigin: 'top' }, {
        scaleY: 1, duration: 2, ease: 'none',
        scrollTrigger: { trigger: timelineRef.current, start: 'top 70%', end: 'bottom 60%', scrub: 1 }
      });

      gsap.utils.toArray('.timeline-card').forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, x: i % 2 === 0 ? -80 : 80 }, {
          opacity: 1, x: 0, duration: 0.8, ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 82%' }
        });
      });

      gsap.utils.toArray('.timeline-dot').forEach((dot) => {
        gsap.fromTo(dot, { scale: 0 }, {
          scale: 1, duration: 0.5, ease: 'back.out(2)',
          scrollTrigger: { trigger: dot, start: 'top 80%' }
        });
      });

      gsap.fromTo('.team-card', { opacity: 0, y: 60 }, {
        opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: teamRef.current, start: 'top 75%' }
      });
    });
    return () => ctx.revert();
  }, [loading]);

  if (loading) return (
    <div className="min-h-[60vh] flex items-center justify-center bg-cream">
      <Loader2 size={40} className="animate-spin text-maroon" />
    </div>
  );

  return (
    <div className="bg-cream min-h-screen overflow-x-hidden">

      {/* HERO */}
      <section className="relative bg-slate-950 text-white py-36 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-700/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-maroon/10 rounded-full blur-[100px]" />
        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <p className="about-hero-text text-[10px] font-black uppercase tracking-[0.5em] text-teal-400 mb-6">Our Story</p>
          <h1 className="about-hero-text text-5xl md:text-7xl font-display font-black leading-none mb-8">
            {about.hero_title}
          </h1>
          <p className="about-hero-text text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">{about.hero_subtitle}</p>
          <div className="about-hero-text flex items-center justify-center gap-2 mt-10">
            {[...Array(5)].map((_, i) => <Star key={i} size={20} className="text-yellow-400" fill="currentColor" />)}
            <span className="ml-2 text-slate-400 font-bold">Loved by thousands of families</span>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-24 bg-white border-b border-slate-100">
        <div className="container-custom max-w-5xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {(about.stats || []).map(({ label, value }, i) => {
              const Icon = ICONS[i % ICONS.length];
              return (
                <div key={label} className="stat-card text-center bg-cream rounded-3xl p-8 border border-slate-100 shadow-soft">
                  <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={24} className="text-teal-700" />
                  </div>
                  <p className="text-4xl font-display font-black text-slate-800 mb-1">{value}</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section ref={timelineRef} className="py-32 bg-cream">
        <div className="container-custom max-w-5xl">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-maroon mb-4">Our Journey</p>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800">A Story Worth Telling</h2>
            <div className="w-20 h-1 bg-maroon mx-auto rounded-full mt-6" />
          </div>
          <div className="relative">
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-slate-200 hidden md:block">
              <div className="timeline-line absolute inset-0 bg-teal-700" />
            </div>
            <div className="space-y-16">
              {(about.timeline || []).map((event, idx) => {
                const Icon = ICONS[idx % ICONS.length];
                const color = COLORS[idx % COLORS.length];
                const isLeft = idx % 2 === 0;
                return (
                  <div key={idx} className={`timeline-card relative flex flex-col md:flex-row items-center gap-8 ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${isLeft ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white rounded-3xl p-8 shadow-soft border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-500 w-full">
                        <div className={`flex items-center gap-3 mb-4 ${isLeft ? 'md:flex-row-reverse' : ''}`}>
                          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ backgroundColor: color + '20' }}>
                            <Icon size={22} style={{ color }} />
                          </div>
                          <span className="text-4xl font-display font-black" style={{ color }}>{event.year}</span>
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">{event.title}</h3>
                        <p className="text-slate-500 leading-relaxed">{event.description}</p>
                      </div>
                    </div>
                    <div className="timeline-dot z-10 w-6 h-6 rounded-full border-4 border-white shadow-lg shrink-0 hidden md:block" style={{ backgroundColor: color }} />
                    <div className="flex-1 hidden md:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section ref={teamRef} className="py-32 bg-white">
        <div className="container-custom max-w-6xl">
          <div className="text-center mb-20">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-maroon mb-4">The People</p>
            <h2 className="text-4xl md:text-5xl font-display font-black text-slate-800">Meet the Team</h2>
            <p className="text-slate-500 mt-4 max-w-xl mx-auto">The passionate humans behind every product — dedicated to coastal excellence.</p>
            <div className="w-20 h-1 bg-maroon mx-auto rounded-full mt-6" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(about.team || []).map((member, idx) => {
              const color = COLORS[idx % COLORS.length];
              return (
                <div key={idx} className="team-card group bg-cream rounded-3xl p-8 border border-slate-100 shadow-soft hover:shadow-xl hover:-translate-y-2 transition-all duration-500 text-center">
                  <div className="w-20 h-20 rounded-3xl mx-auto mb-6 flex items-center justify-center text-white text-2xl font-black shadow-lg group-hover:scale-110 transition-transform duration-500" style={{ backgroundColor: color }}>
                    {member.initials || member.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <h3 className="font-black text-slate-800 text-lg mb-1">{member.name}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest mb-4" style={{ color }}>{member.role}</p>
                  <p className="text-slate-500 text-sm leading-relaxed">{member.bio}</p>
                  <div className="flex justify-center gap-1 mt-6 text-yellow-400">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DYNAMIC ADMIN CONTENT */}
      {pageData?.content && (
        <section className="py-24 bg-cream">
          <div className="container-custom max-w-4xl">
            <div className="bg-white rounded-[40px] p-10 md:p-16 shadow-soft border border-slate-100">
              <h2 className="text-3xl font-display font-black text-slate-800 mb-8 text-center">{pageData.title}</h2>
              <style>{`
                .about-content h2,.about-content h3{font-weight:800;color:#1e293b;margin-bottom:.75rem;margin-top:1.5rem}
                .about-content h2{font-size:1.5rem}.about-content h3{font-size:1.15rem;color:#0f766e}
                .about-content p{margin-bottom:1rem;font-size:1.05rem;color:#475569;line-height:1.8}
                .about-content ul{padding-left:1.5rem;margin-bottom:1rem}
                .about-content li{margin-bottom:.4rem;list-style:disc;font-size:1.05rem;color:#475569}
              `}</style>
              <div className="about-content" dangerouslySetInnerHTML={{ __html: pageData.content }} />
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-slate-950 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-teal-700/10 blur-[200px]" />
        <div className="container-custom relative z-10 max-w-2xl">
          <h2 className="text-4xl font-display font-black text-white mb-6">{about.cta_title}</h2>
          <p className="text-slate-400 text-lg mb-10">{about.cta_subtitle}</p>
          <a href="/shop" className="inline-block bg-maroon text-white font-black px-12 py-5 rounded-2xl shadow-xl shadow-maroon/30 hover:scale-105 transition-all duration-300 text-lg">
            Shop Now →
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
