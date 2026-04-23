import { Link } from 'wouter';
import { motion } from 'motion/react';

export function Footer() {
  return (
    <footer className="relative bg-v-black text-cream px-6 py-24 md:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
         <div className="absolute -bottom-1/4 -right-1/4 w-[60vw] h-[60vw] bg-v-violet rounded-full blur-[15vw]" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24 mb-32">
          {/* Brand & Manifesto */}
          <div className="lg:col-span-5 space-y-12">
            <div className="flex flex-col">
              <span className="font-display text-5xl md:text-7xl tracking-tighter leading-none mb-2 font-normal">Van Gogh</span>
              <span className="text-gold text-[10px] tracking-[0.8em] uppercase font-sans opacity-70 font-light">Voice — La Toile Vivante</span>
            </div>
            <p className="font-sans text-v-gray text-lg md:text-xl italic leading-relaxed max-w-md">
              "Je voudrais faire des portraits qui un siècle plus tard apparaîtraient comme des apparitions."
            </p>
            <div className="pt-8 flex gap-8">
               <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-gold hover:text-cream transition-colors border-b border-gold/30 pb-1">Instagram</a>
               <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-gold hover:text-cream transition-colors border-b border-gold/30 pb-1">Youtube</a>
               <a href="#" className="text-[10px] tracking-[0.3em] uppercase text-gold hover:text-cream transition-colors border-b border-gold/30 pb-1">Letters</a>
            </div>
          </div>

          {/* Links Grid */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12 text-sm italic">
            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-gold not-italic font-bold mb-2">La Collection</h4>
              <Link href="/store" className="text-cream/70 hover:text-gold transition-colors">Estampes & Impressions</Link>
              <Link href="/store" className="text-cream/70 hover:text-gold transition-colors">Soie & Textile</Link>
              <Link href="/store" className="text-cream/70 hover:text-gold transition-colors">Décoration</Link>
              <Link href="/store" className="text-cream/70 hover:text-gold transition-colors">Livres & Digital</Link>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-gold not-italic font-bold mb-2">L'Expérience</h4>
              <Link href="/#essentiels" className="text-cream/70 hover:text-gold transition-colors">Les Incontournables</Link>
              <Link href="/#archive" className="text-cream/70 hover:text-gold transition-colors">L'Archive Complète</Link>
              <Link href="/musees" className="text-cream/70 hover:text-gold transition-colors">Guide des Musées</Link>
              <Link href="/scanner" className="text-cream/70 hover:text-gold transition-colors">Scanner une œuvre</Link>
            </div>

            <div className="flex flex-col gap-6">
              <h4 className="text-[10px] tracking-[0.4em] uppercase text-gold not-italic font-bold mb-2">Maison</h4>
              <Link href="/compte" className="text-cream/70 hover:text-gold transition-colors">Votre Compte</Link>
              <a href="mailto:contact@vangoghvoice.art" className="text-cream/70 hover:text-gold transition-colors">Contact</a>
              <Link href="/faq" className="text-cream/70 hover:text-gold transition-colors">Questions fréquentes</Link>
              <Link href="/mentions" className="text-cream/70 hover:text-gold transition-colors">Mentions Légales</Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <div className="text-[10px] tracking-[0.3em] uppercase opacity-30">
              © 2026 Van Gogh Voice · Imaginé à Arles
           </div>
           <motion.div 
             whileHover={{ scale: 1.1 }}
             className="w-12 h-12 flex items-center justify-center border border-gold/20 rounded-full"
           >
              <span className="font-serif text-gold text-lg">V</span>
           </motion.div>
           <div className="flex gap-8 text-[9px] tracking-[0.2em] uppercase opacity-30">
              <Link href="/cgv">CGV</Link>
              <Link href="/confidentialite">Cookies</Link>
           </div>
        </div>
      </div>
    </footer>
  );
}
