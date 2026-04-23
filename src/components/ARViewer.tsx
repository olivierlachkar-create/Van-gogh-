import React, { useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Box, Smartphone } from 'lucide-react';
import '@google/model-viewer';

interface ARViewerProps {
  isOpen: boolean;
  onClose: () => void;
  artworkUrl?: string;
  title: string;
  dimensions?: string; // e.g., "73 cm x 92 cm"
}

export function ARViewer({ isOpen, onClose, artworkUrl, title, dimensions }: ARViewerProps) {
  const modelViewerRef = useRef<any>(null);

  // Parse dimensions and calculate scale
  const parsedDimensions = useMemo(() => {
    if (!dimensions) return { x: 1, y: 1, z: 0.05 };
    const numbers = dimensions.match(/\d+/g);
    if (!numbers || numbers.length < 2) return { x: 1, y: 1, z: 0.05 };
    
    const w = parseInt(numbers[0]) / 100; // cm to m
    const h = parseInt(numbers[1]) / 100; // cm to m
    
    return { x: w, y: h, z: 0.05 };
  }, [dimensions]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-v-black/95 backdrop-blur-xl"
        >
          <div className="relative w-full h-full max-w-4xl max-h-[80vh] flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
              <div className="space-y-1">
                <h3 className="font-serif text-cream text-3xl">{title}</h3>
                <div className="flex items-center gap-4">
                  <span className="text-gold text-[10px] tracking-[0.3em] uppercase">Visualisation Réelle</span>
                  {dimensions && <span className="text-v-gray text-[10px] uppercase font-mono">{dimensions}</span>}
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-cream hover:bg-white/10 transition-colors"
                id="close-ar-viewer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex-grow bg-v-night/50 rounded-sm overflow-hidden relative border border-gold/10 group">
              {/* @ts-ignore */}
              <model-viewer
                ref={modelViewerRef}
                src="https://modelviewer.dev/shared-assets/models/glTF-Sample-Models/2.0/BoxTextured/glTF-Binary/BoxTextured.glb"
                alt={`Une visualisation 3D de ${title}`}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                poster={artworkUrl || null}
                shadow-intensity="1"
                autoplay
                scale={`${parsedDimensions.x} ${parsedDimensions.y} ${parsedDimensions.z}`}
                style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
                class="w-full h-full"
              >
                <button
                  slot="ar-button"
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gold text-v-black px-8 py-4 font-sans text-xs font-bold uppercase tracking-widest shadow-2xl flex items-center gap-3 active:scale-95 transition-transform"
                  id="ar-button"
                >
                  <Smartphone size={18} />
                  Placer dans mon espace
                </button>
                
                <div id="ar-prompt" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-0 group-[.ar-visible]:opacity-100 transition-opacity">
                   <div className="animate-bounce text-gold flex flex-col items-center gap-4">
                      <Box size={48} />
                      <span className="text-[10px] uppercase tracking-widest text-cream">Déplacez votre téléphone</span>
                   </div>
                </div>
              </model-viewer>
            </div>

            <div className="mt-8 text-center">
              <p className="font-sans text-v-gray text-xs leading-relaxed max-w-md mx-auto italic">
                Optimisé pour iOS Quick Look et Android Scene Viewer. Assurez-vous d'être dans un endroit bien éclairé pour une meilleure détection des surfaces.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
