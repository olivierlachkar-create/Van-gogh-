import { useVincent } from '../lib/VincentLiveProvider';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, Pause, Play, X } from 'lucide-react';

export function VoiceIndicator() {
  const { state, stop } = useVincent();

  if (state.status === 'idle') return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        className="fixed bottom-6 right-6 z-[100] flex items-center gap-4 bg-v-violet text-white px-6 py-4 rounded-full shadow-2xl backdrop-blur-md"
      >
        <div className="flex flex-col">
          <span className="text-[10px] tracking-widest uppercase opacity-60">Vincent parle...</span>
          <span className="font-serif text-sm italic">
            {state.activeArtwork ? state.activeArtwork.titleFr : "Un souvenir d'Auvers..."}
          </span>
        </div>

        <div className="flex items-center gap-2 ml-4">
          <div className="flex gap-1 items-end h-4 mr-2">
            {[1, 2, 3, 4].map(i => (
              <motion.div 
                key={i}
                animate={{ height: ['40%', '100%', '40%'] }}
                transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                className="w-0.5 bg-white rounded-full"
              />
            ))}
          </div>
          
          <button 
            onClick={stop}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={18} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
