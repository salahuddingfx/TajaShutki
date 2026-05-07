import React from 'react';
import { ShieldCheck, Truck, CreditCard, RefreshCw, Scale, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Terms = () => {
  const sections = [
    {
      id: 1,
      title: "Legally Binding Access",
      icon: Scale,
      notes: [
        "By accessing Taja Shutki, you agree to be bound by these Terms and Conditions. Disagreement requires immediate exit.",
        "We reserve the right to modify these terms at our absolute discretion. Updates are effective upon posting.",
        "Usage of the site after updates implies unconditional acceptance of the revised legal framework."
      ]
    },
    {
      id: 2,
      title: "Account Security & Conduct",
      icon: UserCheck,
      notes: [
        "You are responsible for all actions under your account. Keep your credentials confidential at all times.",
        "Any breach of security or unauthorized use must be reported within 2 hours of discovery.",
        "Exploiting site vulnerabilities or promotional codes will lead to permanent IP-based blacklisting."
      ]
    },
    {
      id: 3,
      title: "System Errors & Cancellations",
      icon: ShieldCheck,
      notes: [
        "We reserve the right to cancel orders resulting from technical glitches, database errors, or incorrect pricing.",
        "A full refund will be issued for such cancellations, but no additional compensation will be entertained.",
        "Inventory levels are dynamic; an order may be cancelled if a quality check fails during packaging."
      ]
    },
    {
      id: 4,
      title: "Natural Product Variations",
      icon: ShieldCheck,
      notes: [
        "Dried fish is a natural product. Variations in size, color, and texture are inherent and not considered defects.",
        "Seasonal changes affect the appearance of the catch. Images on the site are illustrative only.",
        "Salt levels may vary between batches as part of the traditional preservation process."
      ]
    },
    {
      id: 5,
      title: "Payment Finalization",
      icon: CreditCard,
      notes: [
        "All transactions are final once processed. We use secure, third-party encrypted payment gateways.",
        "Taja Shutki does not store sensitive financial data. Payment disputes must be settled with your bank.",
        "For COD, payment must be handed over before the courier releases the vacuum-sealed package."
      ]
    },
    {
      id: 6,
      title: "Shipping & Courier Policy",
      icon: Truck,
      notes: [
        "Estimated delivery timelines (Dhaka 2-3 days, Outside 3-5 days) are not guaranteed guarantees.",
        "Liability for the condition of the package shifts to the customer upon handover to the courier service.",
        "Failure to receive the order after 2 attempts will lead to order cancellation and loss of COD privileges."
      ]
    },
    {
      id: 7,
      title: "Mandatory Unboxing Proof",
      icon: RefreshCw,
      notes: [
        "A continuous, unedited unboxing video is MANDATORY to claim any missing items or package damage.",
        "The video must clearly show the courier seal and shipping label before the package is opened.",
        "Without this video proof, all claims for shortage or damage will be REJECTED without review."
      ]
    },
    {
      id: 8,
      title: "Strict Non-Returnable Policy",
      icon: ShieldCheck,
      notes: [
        "Dried seafood products are strictly non-returnable once the vacuum seal is broken or tampered with.",
        "We do not accept returns for 'Change of Mind' or because you no longer require the product.",
        "Approved returns for incorrect items must be sent back in original condition within 24 hours."
      ]
    },
    {
      id: 9,
      title: "Taste & Subjectivity Clause",
      icon: ShieldCheck,
      notes: [
        "Personal taste preference (e.g., saltiness, smell) is not a valid ground for return or refund.",
        "Our products follow traditional Cox's Bazar drying methods which have a distinct, natural aroma.",
        "By purchasing, you accept the traditional flavor profile of naturally sun-dried seafood."
      ]
    },
    {
      id: 10,
      title: "Allergy & Health Disclaimer",
      icon: ShieldCheck,
      notes: [
        "All products are processed in environments that handle various seafood and salt. Check for allergies.",
        "Taja Shutki is not responsible for any allergic reactions or health issues arising from consumption.",
        "Consult your doctor before adding dried seafood to your diet if you have high blood pressure or salt sensitivity."
      ]
    },
    {
      id: 11,
      title: "Zero Tolerance: Abuse",
      icon: UserCheck,
      notes: [
        "Abusive behavior towards our staff or delivery partners will result in immediate termination of your account.",
        "We maintain a record of all customer interactions for quality control and legal documentation.",
        "Harassment will be met with a permanent ban and potential reporting to local law enforcement."
      ]
    },
    {
      id: 12,
      title: "Anti-Fraud Verification",
      icon: Scale,
      notes: [
        "Faking damage or submitting altered media for refunds is a criminal offense under Bangladesh law.",
        "We verify every claim against our high-definition warehouse packaging footage.",
        "Fraudulent users will be blacklisted across all our partner networks and reported for legal action."
      ]
    },
    {
      id: 13,
      title: "Right to Refuse Service",
      icon: ShieldCheck,
      notes: [
        "We reserve the right to cancel any order if we detect a high RTO (Return to Origin) history on your profile.",
        "Orders from certain high-risk zones may require mandatory 100% advance digital payment.",
        "Suspicious bulk orders intended for unauthorized commercial resale will be flagged and cancelled."
      ]
    },
    {
      id: 14,
      title: "Proprietary Rights",
      icon: Scale,
      notes: [
        "All visual content, logos, and product descriptions are the exclusive intellectual property of Taja Shutki.",
        "Copying or scraping our content for commercial use without permission will trigger legal litigation.",
        "Customer reviews may be used in our marketing materials across social media and the web."
      ]
    },
    {
      id: 15,
      title: "Jurisdiction & Disputes",
      icon: Scale,
      notes: [
        "These terms are governed by the laws of the People's Republic of Bangladesh.",
        "Any legal disputes will be settled exclusively within the jurisdiction of the Dhaka courts.",
        "Informal mediation must be attempted before any formal legal proceedings are initiated."
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
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-teal-600 mb-4 block">Legal Framework</span>
          <h1 className="text-4xl md:text-5xl font-display font-black text-slate-900 tracking-tighter">
            Terms & <span className="text-teal-600">Conditions</span>
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
                    {section.notes.map((note, i) => (
                      <li key={i} className="flex gap-3 text-slate-600 text-sm leading-relaxed group-hover:text-slate-900 transition-colors">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-teal-600/40 shrink-0" />
                        <span className="font-medium">{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              {/* Decorative Number */}
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
          <p className="text-sm font-medium opacity-60 mb-2">Have specific questions?</p>
          <p className="text-lg font-bold">Contact our support team directly</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Terms;
