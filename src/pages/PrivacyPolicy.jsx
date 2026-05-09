import React from 'react';
import { ShieldCheck, Eye, Lock, Database, Globe, Share2, Bell, UserX, Info, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivacyPolicy = () => {
  const sections = [
    {
      id: 1,
      title: "Information Gathering",
      icon: Database,
      content: [
        "Core Identifiers: Full name, primary email address, verified phone number, and delivery coordinates.",
        "Purchase Architecture: Records of products ordered, transaction dates, and billing status (excluding sensitive card data).",
        "Analytical Data: Browser fingerprints, IP tracking, and user navigation paths captured through essential cookies."
      ]
    },
    {
      id: 2,
      title: "Data Utilization",
      icon: Info,
      content: [
        "Logistical Execution: Ensuring your premium dried seafood reaches the correct destination within the promised timeframe.",
        "Support Ecosystem: Addressing your queries regarding product quality or delivery status through our helpline.",
        "Strategic Enhancement: Monitoring platform interactions to refine the user interface and product recommendations."
      ]
    },
    {
      id: 3,
      title: "Shielding Your Data",
      icon: Lock,
      content: [
        "Infrastructure: We utilize high-level TLS/SSL encryption for all data transmissions to prevent interceptive threats.",
        "Access Controls: Internal data visibility is strictly rationed on a 'need-to-know' basis for operational staff.",
        "Evolving Defense: We continuously update our security protocols to counter emerging cyber threats and vulnerabilities."
      ]
    },
    {
      id: 4,
      title: "Logistical Collaborations",
      icon: Share2,
      content: [
        "Fulfillment Partners: Essential delivery data is shared with our trusted courier networks for last-mile shipping.",
        "Financial Gateways: Encrypted transaction tokens are processed by verified partners like SSLCommerz.",
        "Regulatory Compliance: Information may be disclosed to government authorities if mandated by Bangladesh law."
      ]
    },
    {
      id: 5,
      title: "Browser Cookie Policy",
      icon: Globe,
      content: [
        "Essential Cookies: Used for maintaining secure sessions and preserving your cart contents during navigation.",
        "Diagnostic Cookies: Helping us understand which seafood categories are most popular to optimize inventory.",
        "Preference Control: You may opt to disable cookies via browser settings, though this will degrade certain site functions."
      ]
    },
    {
      id: 6,
      title: "Your Privacy Sovereignty",
      icon: Eye,
      content: [
        "Data Auditing: You have the right to request a summary of the personal information stored in our databases.",
        "Correction & Erasure: Users may update their profiles or request total deletion of their account and data history.",
        "Processing Time: Requests for data removal are typically fulfilled within 5-10 business days."
      ]
    },
    {
      id: 7,
      title: "Information Longevity",
      icon: FileText,
      content: [
        "Temporal Storage: We retain data only for the duration required to provide our services and meet legal obligations.",
        "Archival Records: Transaction summaries are archived for financial transparency and audit requirements.",
        "Instant Purge: Personal marketing data is removed immediately upon your request.",
      ]
    },
    {
      id: 8,
      title: "Minor Protection",
      icon: UserX,
      content: [
        "Age Restriction: Taja Shutki is intended for adult audiences and does not target users under the age of 13.",
        "Proactive Deletion: If we detect data belonging to a minor has been collected, it is purged without delay.",
        "Parental Oversight: We encourage parents to monitor their children's online shopping activities."
      ]
    },
    {
      id: 9,
      title: "Communication Channels",
      icon: Bell,
      content: [
        "Communication Policy: We may contact you regarding your order status or critical security updates.",
        "Response Protocol: Inquiries sent via our contact forms will be addressed through the provided email or phone.",
        "Service Notices: Mandatory system alerts will be sent regardless of general contact preferences."
      ]
    },
    {
      id: 10,
      title: "Evolving Legal Policy",
      icon: ShieldCheck,
      content: [
        "Document Revisions: This policy is subject to updates as we expand our services or as laws evolve.",
        "Notice of Change: Major structural changes to our data handling will be announced via site banners or email.",
        "Acceptance: Continued use of Taja Shutki implies acceptance of the most current version of this policy."
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
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600 mb-4 block">Data Governance</span>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
            Privacy <span className="text-teal-600">Policy</span>
          </h1>
          <div className="w-20 h-1 bg-teal-600 mx-auto mt-6 rounded-full" />
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
                <div className="w-14 h-14 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-lg shadow-teal-600/20 shrink-0">
                  <section.icon size={24} />
                </div>
                
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    {section.title}
                    <span className="w-2 h-2 bg-teal-600 rounded-full opacity-20" />
                  </h3>
                  
                  <ul className="space-y-3">
                    {section.content.map((point, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed group-hover:text-slate-900 transition-colors">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600/40 shrink-0" />
                        <span className="font-medium">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <span className="absolute top-4 right-8 text-8xl font-black text-black/[0.03] pointer-events-none select-none italic">
                {section.id < 10 ? `0${section.id}` : section.id}
              </span>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-16 p-8 rounded-[32px] bg-slate-900 text-white text-center"
        >
          <p className="text-sm font-medium opacity-60 mb-2">Concerned about your data?</p>
          <p className="text-lg font-bold">Email us at privacy@tajashutki.com</p>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
