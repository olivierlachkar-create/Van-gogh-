import { Link, useLocation } from 'wouter';
import { Menu, Search, QrCode, User, Mic, X, ShoppingBag } from 'lucide-react';
import { useVincent } from '../lib/VincentLiveProvider';
import { useShopify } from '../lib/ShopifyProvider';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { SoulVisualizer } from './SoulVisualizer';

export function Navbar() {
  const [location] = useLocation();
  const { state, stop, start } = useVincent();
  const { cart, setIsCartOpen } = useShopify();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <>
      <nav 
        className={`fixed top-0 inset-x-0 z-[80] transition-all duration-700 px-6 md:px-12 py-6 flex items-center justify-between ${scrolled ? 'bg-v-black/80 backdrop-blur-lg py-4' : 'bg-transparent'}`}
      >
        <div className="flex items-center gap-10">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="text-cream hover:text-gold transition-colors p-2"
          >
            <Menu size={24} strokeWidth={1.5} />
          </button>
          
          <div className="hidden lg:flex items-center gap-8">
             <Link href="/store" className="text-[10px] tracking-[0.3em] uppercase text-cream/70 hover:text-gold transition-colors">Collection</Link>
             <Link href="/musees" className="text-[10px] tracking-[0.3em] uppercase text-cream/70 hover:text-gold transition-colors">Musées</Link>
          </div>
        </div>

        <Link href="/">
          <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center cursor-pointer">
            <span className="font-display text-cream text-3xl md:text-5xl tracking-tight leading-none font-normal">Van Gogh</span>
            <span className="text-gold text-[9px] tracking-[0.8em] uppercase font-sans mt-2 opacity-60 font-light">Voice</span>
          </div>
        </Link>

        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-6">
             <Link href="/scanner" className="text-cream/70 hover:text-gold transition-colors"><QrCode size={20} strokeWidth={1.5} /></Link>
             <Link href="/compte" className="text-cream/70 hover:text-gold transition-colors"><User size={20} strokeWidth={1.5} /></Link>
          </div>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative text-cream hover:text-gold transition-colors p-2"
          >
            <ShoppingBag size={24} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-carmine text-white text-[8px] flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* OVERLAY MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-v-black flex flex-col p-12 overflow-hidden"
          >
             <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 -right-1/4 w-[60vw] h-[60vw] bg-v-violet rounded-full blur-[15vw] animate-canvas-pulse" />
                <div className="absolute bottom-0 -left-1/4 w-[50vw] h-[50vw] bg-gold rounded-full blur-[12vw] animate-float" />
             </div>

             <div className="flex justify-between items-center relative z-10 mb-24">
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase">Navigation</span>
                <button onClick={() => setIsMenuOpen(false)} className="text-cream p-4 hover:scale-110 transition-transform">
                   <X size={32} strokeWidth={1} />
                </button>
             </div>

             <div className="flex flex-col gap-8 md:gap-12 relative z-10">
                {[
                  { label: "Accueil", href: "/" },
                  { label: "La Collection", href: "/store" },
                  { label: "Les Musées", href: "/musees" },
                  { label: "Scanner une œuvre", href: "/scanner" },
                  { label: "Votre Compte", href: "/compte" }
                ].map((item, i) => (
                  <motion.div
                    key={item.href}
                    initial={{ x: -30, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link href={item.href}>
                       <div 
                        onClick={() => setIsMenuOpen(false)}
                        className="font-serif text-5xl md:text-8xl text-cream hover:text-gold transition-all hover:pl-8 inline-block cursor-pointer"
                       >
                         {item.label}
                       </div>
                    </Link>
                  </motion.div>
                ))}
             </div>

             <div className="mt-auto relative z-10 flex flex-col md:flex-row justify-between items-end gap-8 pt-12 border-t border-cream/10">
                <div className="max-w-md">
                   <p className="font-sans text-v-gray text-lg italic leading-relaxed">
                     "Je voudrais faire des portraits qui un siècle plus tard apparaîtraient comme des apparitions."
                   </p>
                </div>
                <div className="flex gap-8">
                   <a href="#" className="text-[10px] tracking-widest uppercase text-gold">Instagram</a>
                   <a href="#" className="text-[10px] tracking-widest uppercase text-gold">Youtube</a>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VOICE FLOATING INDICATOR */}
      <AnimatePresence>
        {state.status !== 'idle' && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[90] glass-panel rounded-full px-8 py-4 flex items-center gap-6 shadow-2xl"
          >
             <div className="w-10 h-10 rounded-full bg-v-violet flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(107,33,168,0.5)]">
                <Mic size={16} className="text-white" />
             </div>
             <div className="flex flex-col pr-4 border-r border-white/10">
                <span className="text-[8px] text-gold uppercase tracking-[0.2em] mb-0.5">Vincent Témoigne</span>
                <span className="font-serif text-cream text-sm truncate max-w-[120px] md:max-w-xs">{state.activeArtwork?.titleFr || "Son âme..."}</span>
             </div>
             <SoulVisualizer isActive={true} />
             <button 
              onClick={stop}
              className="ml-2 p-2 hover:bg-white/10 rounded-full transition-colors text-cream"
             >
                <X size={16} />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
