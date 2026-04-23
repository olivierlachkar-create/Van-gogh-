import { User, Mail, Link as LinkIcon, ShieldCheck, Clock, Archive } from 'lucide-react';
import { motion } from 'motion/react';

export function Account() {
  return (
    <div className="bg-v-atmosphere min-h-screen pt-48 px-6 flex flex-col items-center overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-gold/10 rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full glass-panel text-cream p-12 md:p-16 shadow-2xl relative overflow-hidden backdrop-blur-3xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-v-violet/10 rounded-full blur-[100px] -ml-32 -mb-32" />
        
        <div className="relative z-10">
          <div className="flex flex-col items-center mb-16 text-center">
             <div className="w-16 h-16 rounded-full border border-gold/30 flex items-center justify-center mb-6">
                <User size={32} className="text-gold" strokeWidth={1} />
             </div>
             <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-2">Espace Privé</span>
             <h1 className="font-serif text-5xl text-v-black italic">Votre Cabinet</h1>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-4">
              <label className="block text-[10px] tracking-[0.4em] uppercase text-v-gray font-bold">Identité Numérique</label>
              <div className="relative group">
                <Mail size={16} className="absolute left-6 top-1/2 -translate-y-1/2 text-v-gray group-focus-within:text-gold transition-colors" />
                <input 
                  type="email" 
                  placeholder="art@vincent.com"
                  className="w-full bg-v-black/5 border-b border-gold/20 pl-16 pr-6 py-5 font-sans text-lg text-v-black italic outline-none focus:border-carmine transition-all"
                />
              </div>
            </div>
            
            <button className="w-full bg-v-black text-cream py-6 font-sans text-xs font-bold tracking-[0.4em] uppercase transition-all hover:bg-gold hover:text-v-black shadow-xl flex items-center justify-center gap-4">
               Accéder par Clef Magique <ShieldCheck size={18} />
            </button>
            <p className="text-[10px] text-v-gray text-center italic tracking-widest leading-relaxed">
               Un lien d'accès unique sera déposé dans votre boîte aux lettres.
            </p>
          </div>

          <div className="mt-20 pt-12 border-t border-gold/10 grid grid-cols-2 gap-8">
            <div className="flex flex-col items-center gap-3 text-center group cursor-help">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/5 group-hover:bg-gold/10 transition-colors">
                <Clock size={16} className="text-v-gray" />
              </div>
              <span className="text-[9px] tracking-widest uppercase text-v-gray font-bold">Mémoire d'écoute</span>
            </div>
            <div className="flex flex-col items-center gap-3 text-center group cursor-help">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gold/5 group-hover:bg-gold/10 transition-colors">
                <Archive size={16} className="text-v-gray" />
              </div>
              <span className="text-[9px] tracking-widest uppercase text-v-gray font-bold">Ma Galerie</span>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1 }}
        className="mt-12 text-v-black text-[10px] tracking-[0.4em] uppercase font-bold"
      >
        Van Gogh Voice · Archives de l'Inconscient
      </motion.p>
    </div>
  );
}
