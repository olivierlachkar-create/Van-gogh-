import { useState, useEffect } from 'react';
import { useRoute, Link } from 'wouter';
import { Artwork, API_BASE } from '../lib/constants';
import { useVincent } from '../lib/VincentLiveProvider';
import { Mic, BookOpen, Quote, ChevronLeft, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { SoulVisualizer } from '../components/SoulVisualizer';

export function LetterDetail() {
  const [, params] = useRoute<{ id: string }>('/lettre/:id');
  const { start, state } = useVincent();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/vangogh/artworks`)
      .then(res => res.json())
      .then((data: Artwork[]) => {
        const found = data.find(a => a.letterNumber === (params ? params.id : null)) || data[0];
        setArtwork(found);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params ? params.id : null]);

  if (loading) return (
    <div className="h-screen bg-v-black flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-serif text-gold text-2xl italic"
      >
        L'encre sèche...
      </motion.div>
    </div>
  );

  if (!artwork) return null;

  return (
    <div className="bg-v-atmosphere min-h-screen pt-48 pb-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <header className="mb-24 flex flex-col md:flex-row justify-between items-end gap-8 relative">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/" className="group flex items-center gap-3 text-gold text-[10px] tracking-[0.3em] uppercase mb-8">
               <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Vers la correspondance
            </Link>
            <h1 className="font-serif text-5xl md:text-8xl mb-4 italic leading-none">Mon cher Théo,</h1>
            <p className="text-[10px] tracking-[0.5em] uppercase text-v-gray">{artwork.locationPainted}, {artwork.year}</p>
          </motion.div>
          <div className="text-[12vw] font-serif text-gold/5 absolute -top-12 -right-12 pointer-events-none select-none italic text-stroke">
             Epistola
          </div>
        </header>
        
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-white p-12 md:p-20 shadow-2xl relative border-t-4 border-gold"
          >
            <Quote size={60} className="absolute -top-6 -left-6 text-gold opacity-20" />
            <div className="font-sans text-v-black text-xl md:text-2xl leading-[2] italic indent-12 whitespace-pre-wrap relative z-10 selection:bg-gold/30">
              {artwork.letterExcerpt || `Je t'écris ces quelques mots car je rêve toujours de peinture et de tournesols. La lumière ici est d'une violence insoupçonnée, et j'essaie de la capturer sur la toile avant qu'elle ne s'échappe...`}
            </div>
            
            <div className="mt-20 pt-12 border-t border-gold/10 flex flex-col sm:flex-row gap-6">
               <button 
                  onClick={() => start(artwork)}
                  className={`flex-1 bg-v-violet text-white px-10 py-5 flex items-center justify-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-xl ${state.status === 'active' ? 'ring-1 ring-gold' : ''}`}
                >
                  <Mic size={18} /> 
                  <span>Écouter Vincent lire</span>
                  {state.status === 'active' && <SoulVisualizer isActive={true} />}
                </button>
                <button 
                  onClick={() => start(artwork)}
                  className="flex-1 border border-v-violet text-v-violet px-10 py-5 flex items-center justify-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.2em] hover:bg-v-violet hover:text-white transition-all shadow-sm"
                >
                  <BookOpen size={18} /> 
                  <span>Disséquer cette lettre</span>
                </button>
            </div>
          </motion.div>

          <div className="lg:col-span-4 sticky top-32 space-y-12">
             <div className="flex flex-col">
                <span className="text-[10px] text-gold uppercase tracking-[0.4em] mb-4">Contexte</span>
                <p className="font-sans text-v-gray text-base leading-relaxed italic">
                   Cette missive a été rédigée dans un moment de {artwork.id.includes('44') ? 'sérénité' : 'fièvre créatrice'}. Vincent y évoque l'impossibilité de fixer la couleur pure.
                </p>
             </div>
             <div className="pt-12 border-t border-gold/10">
                <span className="text-[10px] text-v-gray uppercase tracking-[0.4em] mb-8 block font-bold">Archives Royales</span>
                <div className="aspect-[3/4] bg-v-black/5 rounded-sm p-8 flex flex-col justify-center text-center italic border border-gold/10">
                   <p className="text-v-black/40 text-sm mb-4">Document manuscrit scanné</p>
                   <p className="text-gold font-serif">Van Gogh Museum Collection</p>
                </div>
             </div>
          </div>
        </section>

        {/* Œuvre liée */}
        <section className="pt-32 border-t border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-20 text-center md:text-left">
             <div>
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">L'Œuvre Évoquée</span>
                <h2 className="font-serif text-5xl md:text-7xl leading-none italic">De l'encre à l'huile</h2>
             </div>
             <p className="font-sans text-v-gray text-base max-w-xs border-l border-carmine pl-6 italic">
                Dans cette lettre, Vincent décrit précisément cette composition.
             </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <motion.div 
               whileHover={{ scale: 1.02 }}
               className="lg:col-span-7 bg-v-black p-4 md:p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]"
            >
              <img 
                src={`/api/vangogh/img/${artwork.id}?w=1200`} 
                className="w-full aspect-[4/3] object-cover opacity-90 transition-opacity hover:opacity-100 duration-700" 
                alt={artwork.titleFr} 
              />
            </motion.div>
            <div className="lg:col-span-5 space-y-12">
              <div className="space-y-4">
                <h3 className="font-serif text-5xl leading-tight text-v-black">{artwork.titleFr}</h3>
                <p className="font-sans text-v-gray text-lg leading-relaxed italic">
                   {artwork.descriptionVincent || "Vincent décrit cette œuvre dans sa lettre comme une tentative de saisir l'indicible."}
                </p>
              </div>
              <Link href={`/art/${artwork.catalogNumber}`} className="inline-flex items-center gap-6 bg-v-black text-cream px-12 py-5 font-sans text-xs font-bold uppercase tracking-[0.3em] group">
                 Visiter cette œuvre <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
