import { useState, useEffect } from 'react';
import { Bell, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { subscribePush } from '../api/api';
import { toast } from 'sonner';

const PushNotificationPrompt = ({ siteId }) => {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check if browser supports notifications
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    // Check if permission is already granted or denied
    if (Notification.permission !== 'default') return;

    // Show after 10 seconds
    const timer = setTimeout(() => {
      const dismissed = localStorage.getItem('push_prompt_dismissed');
      if (!dismissed) setShow(true);
    }, 10000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubscribe = async () => {
    try {
      setLoading(true);
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        const registration = await navigator.serviceWorker.register('/service-worker.js');
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: 'BEl62iUZuU7yRT97Id_ZclS5S6f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s3f6s' // Placeholder VAPID key
        });

        await subscribePush(subscription.toJSON(), siteId);
        toast.success('Successfully subscribed to notifications!');
        setShow(false);
      } else {
        toast.error('Notification permission denied.');
        setShow(false);
      }
    } catch (err) {
      console.error('Push Subscription Error:', err);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('push_prompt_dismissed', 'true');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-6 left-6 z-[100] w-[350px] bg-white rounded-[32px] p-6 shadow-2xl border border-slate-100 overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4">
            <button onClick={handleDismiss} className="text-slate-300 hover:text-slate-500 transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-teal-600/5 rounded-full flex items-center justify-center mb-4 relative">
              <Bell className="text-teal-600 animate-bounce" size={32} />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center">
                 <ShieldCheck size={12} className="text-white" />
              </div>
            </div>

            <h3 className="text-xl font-display font-black text-slate-800 mb-2">Get Fresh Updates</h3>
            <p className="text-slate-500 text-sm mb-6 px-2">Enable notifications for real-time order tracking and exclusive seafood deals.</p>

            <div className="flex gap-3 w-full">
               <button 
                 onClick={handleDismiss}
                 className="flex-1 py-3 px-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-all border border-slate-100"
               >
                 Not Now
               </button>
               <button 
                 onClick={handleSubscribe}
                 disabled={loading}
                 className="flex-1 py-3 px-4 rounded-2xl bg-teal-600 text-white font-bold shadow-lg shadow-teal-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-70"
               >
                 {loading ? 'Subscribing...' : 'Enable Now'}
               </button>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-300 font-medium text-center uppercase tracking-widest">
             No Spam. Unsubscribe anytime.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PushNotificationPrompt;
