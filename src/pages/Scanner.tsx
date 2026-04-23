import { useState, useEffect } from 'react';
import { Camera, X, QrCode, Mic, Sparkles, Box } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useVincent } from '../lib/VincentLiveProvider';
import { Artwork, API_BASE } from '../lib/constants';
import { SoulVisualizer } from '../components/SoulVisualizer';

export function Scanner() {
  const { start, state } = useVincent();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [simulatedScan, setSimulatedScan] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/vangogh/artworks`)
      .then(res => res.json())
      .then(data => setArtworks(data));
  }, []);

  const triggerScan = () => {
    setSimulatedScan(true);
    setTimeout(() => {
      setSuccess(true);
      if (artworks.length > 0) {
        const randomWork = artworks[Math.floor(Math.random() * artworks.length)];
        start(randomWork);
      }
      setTimeout(() => {
        setSimulatedScan(false);
        setSuccess(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-v-night min-h-screen pt-48 pb-20 px-6 flex flex-col items-center overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/4 -left-1/4 w-[60vw] h-[60vw] bg-carmine rounded-full blur-[15vw] animate-float" />
         <div className="absolute bottom-0 -right-1/4 w-[50vw] h-[50vw] bg-v-violet rounded-full blur-[12vw] animate-canvas-pulse" />
      </div>

      <div className="max-w-xl w-full text-center mb-16 relative z-10 transition-all">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gold text-[10px] tracking-[0.5em] uppercase mb-4 block"
        >
          Expérience Anima
        </motion.span>
        <h1 className="font-serif text-cream text-5xl md:text-7xl mb-6 leading-none italic">
          L'Apparition
        </h1>
        <p className="font-sans text-v-gray text-lg italic max-w-sm mx-auto leading-relaxed">
          Approchez votre produit du regard. <br />
          Laissez Vincent l'animer par sa voix.
        </p>
      </div>

      <div className="relative w-full max-w-md aspect-square mb-12 group z-10">
        {/* Scanner HUD */}
        <div className="absolute inset-0 border border-gold/20 rounded-full flex items-center justify-center">
           <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-4 border border-dashed border-gold/10 rounded-full" 
           />
           <div className="absolute h-px w-full bg-gradient-to-r from-transparent via-gold to-transparent top-1/2 -translate-y-1/2 opacity-20" />
           <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-gold to-transparent left-1/2 -translate-x-1/2 opacity-20" />
        </div>

        {/* Scan Area */}
        <div className="absolute inset-12 overflow-hidden bg-v-black/40 backdrop-blur-3xl shadow-2xl flex items-center justify-center transition-transform hover:scale-105 duration-700">
           <AnimatePresence mode="wait">
             {!simulatedScan ? (
               <motion.div 
                 key="idle"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center gap-6"
               >
                  <div className="w-20 h-20 rounded-full flex items-center justify-center ring-1 ring-gold/30">
                    <QrCode size={32} className="text-gold animate-pulse" />
                  </div>
                  <button 
                    onClick={triggerScan}
                    className="text-cream text-[10px] tracking-[0.3em] uppercase bg-gold/10 px-8 py-3 rounded-full border border-gold/20 hover:bg-gold hover:text-v-black transition-all"
                  >
                     Démarrer le scan
                  </button>
               </motion.div>
             ) : success ? (
               <motion.div 
                 key="success"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1, opacity: 1 }}
                 className="flex flex-col items-center gap-6"
               >
                  <Sparkles size={64} className="text-gold animate-bounce" />
                  <div className="text-center">
                    <p className="text-gold text-xs tracking-widest uppercase font-bold mb-2">Séquence identifiée</p>
                    <p className="font-serif text-cream text-3xl italic">"Vincent approche..."</p>
                  </div>
                  <SoulVisualizer isActive={true} />
               </motion.div>
             ) : (
               <motion.div 
                 key="scanning"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="flex flex-col items-center gap-6"
               >
                  <div className="relative w-32 h-32 flex items-center justify-center">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="absolute inset-0 bg-gold rounded-full blur-2xl"
                    />
                    <Box size={40} className="text-white relative z-10 animate-spin" />
                  </div>
                  <p className="text-cream text-[10px] tracking-[0.4em] uppercase font-bold animate-pulse">Analyse du support...</p>
               </motion.div>
             )}
           </AnimatePresence>

           {/* Corner Borders */}
           <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-gold/50" />
           <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-gold/50" />
           <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-gold/50" />
           <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-gold/50" />
        </div>
      </div>

      <div className="mt-12 max-w-sm text-center relative z-10 px-8">
        <div className="flex justify-center gap-12 mb-12">
           <div className="flex flex-col items-center gap-2 opacity-40">
              <div className="w-1 focus-within:w-2 transition-all h-1 bg-gold rounded-full" />
              <span className="text-[8px] tracking-widest uppercase text-v-gray">Optique artisanale</span>
           </div>
           <div className="flex flex-col items-center gap-2">
              <div className="w-1 h-1 bg-carmine rounded-full animate-ping" />
              <span className="text-[8px] tracking-widest uppercase text-gold font-bold">Système Anima Prêt</span>
           </div>
        </div>
        <p className="font-sans text-v-gray text-xs leading-loose italic">
          Cette interface utilise votre caméra pour reconnaître les marqueurs d’âme insérés sur chaque produit. 
          Si le scan échoue, assurez-vous d’être dans un lieu baigné de lumière.
        </p>
      </div>

      {state.status === 'active' && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 glass-panel p-8 rounded-2xl flex items-center gap-8 shadow-2xl relative z-10 border-gold/20"
        >
           <img 
            src={`/api/vangogh/img/${state.activeArtwork?.id}?w=320`} 
            className="w-20 h-20 object-cover rounded-lg shadow-lg ring-1 ring-gold/20" 
            alt="" 
           />
           <div>
              <span className="text-gold text-[8px] tracking-widest uppercase block mb-1">Récit en cours</span>
              <h4 className="font-serif text-cream text-lg italic">{state.activeArtwork?.titleFr}</h4>
           </div>
        </motion.div>
      )}
    </div>
  );
}
