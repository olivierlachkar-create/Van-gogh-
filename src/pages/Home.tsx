import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useVincent } from '../lib/VincentLiveProvider';
import { Artwork, API_BASE } from '../lib/constants';
import { Link } from 'wouter';
import { Mic, ArrowRight, Book } from 'lucide-react';
import { useShopify } from '../lib/ShopifyProvider';
import { SoulVisualizer } from '../components/SoulVisualizer';

import { PageWrapper } from '../components/PageWrapper';

export function Home() {
  const { start, switchTopic, state } = useVincent();
  const { products } = useShopify();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [essentials, setEssentials] = useState<Artwork[]>([]);
  
  const targetRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: targetRef });
  
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 1.1]);

  useEffect(() => {
    fetch(`${API_BASE}/vangogh/artworks`)
      .then(res => res.json())
      .then((data: Artwork[]) => {
        setArtworks(data);
        setEssentials(data.slice(0, 41));
      })
      .catch(err => console.error('Error fetching artworks:', err));
  }, []);

  const heroWork = artworks.find(a => a.catalogNumber === 'F612') || artworks[0];

  return (
    <PageWrapper>
      <div className="bg-v-atmosphere min-h-screen">
      {/* SECTION A — HÉROS IMMERSIF */}
      <section ref={targetRef} className="relative h-[110vh] bg-v-night overflow-hidden flex flex-col items-center justify-center">
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="absolute inset-0 bg-v-black">
          {/* Secure Fallback Image (always loads instantly, sits beneath the video) */}
          <img 
            src={heroWork ? `/api/vangogh/img/${heroWork.id}?w=1600` : undefined} 
            alt="La Nuit Étoilée" 
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />

          {/* YouTube Video Background — The Animated Starry Night */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50">
            <iframe
              src="https://www.youtube.com/embed/Jnf-nlYRgrw?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=Jnf-nlYRgrw&playsinline=1"
              allow="autoplay; encrypted-media"
              frameBorder="0"
              style={{
                width: '100vw',
                height: '56.25vw',
                minHeight: '100vh',
                minWidth: '177.77vh',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            ></iframe>
          </div>
          
          {/* Overlays for flawless text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-v-black/90 via-v-black/40 to-v-black z-10" />
        </motion.div>

        <div className="relative z-10 px-6 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <h1 className="font-display text-cream text-[10vw] md:text-[8vw] tracking-tighter mb-4 leading-none mix-blend-plus-lighter drop-shadow-2xl font-normal">
              Van Gogh<br />
              <span className="text-stroke-gold opacity-100 not-italic tracking-[0.2em] uppercase text-[6vw] md:text-[4vw] font-light font-sans">Voice</span>
            </h1>
            <p className="font-serif text-gold text-[10px] md:text-sm tracking-[0.4em] uppercase mb-16 drop-shadow-lg italic">La Toile Vivante</p>
          </motion.div>

          <button 
            onClick={() => start()}
            className="group relative inline-flex flex-col items-center gap-6"
          >
            <div className={`w-32 h-32 rounded-full border border-gold/20 flex items-center justify-center p-2 transition-all duration-700 group-hover:scale-110 group-hover:border-gold/50 ${state.status === 'active' ? 'border-v-violet animate-canvas-pulse' : ''}`}>
              <div className="w-full h-full rounded-full bg-v-black overflow-hidden relative flex flex-col items-center justify-center text-cream">
                <Mic size={32} className={`transition-all duration-500 ${state.status === 'active' ? 'text-v-violet scale-125' : 'group-hover:text-gold'}`} />
                <div className="absolute inset-x-0 bottom-6 flex justify-center">
                  <SoulVisualizer isActive={state.status === 'active'} />
                </div>
              </div>
            </div>
            <span className="font-sans text-cream/40 text-[10px] tracking-[0.3em] uppercase group-hover:text-gold transition-colors">Éveiller Vincent</span>
          </button>
        </div>

        <div className="absolute bottom-16 left-6 md:left-12 flex flex-col gap-1">
          <span className="text-[10px] text-gold uppercase tracking-widest opacity-50">Ouvrage Actuel</span>
          <span className="font-serif text-cream text-lg italic">{heroWork?.titleFr || 'La Nuit étoilée'}</span>
        </div>
      </section>

      {/* SECTION B — MANIFESTE ASYMÉTRIQUE */}
      <section className="px-6 py-32 md:py-56 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="md:col-span-7"
        >
          <h2 className="font-serif text-5xl md:text-7xl mb-8 leading-[0.9]">
            Une confession <br />
            à <span className="text-carmine">l'huile.</span>
          </h2>
          <p className="font-sans text-v-gray text-xl md:text-2xl leading-relaxed mb-12 max-w-xl">
            Il a fallu cent trente-six ans pour que Vincent retrouve sa voix. 
            Écoutez-le murmurer ses doutes, crier ses couleurs et vous guider à travers ses chefs-d'œuvre.
          </p>
          <Link href="/store" className="inline-flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-v-black group">
            Retrouver sa trace <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="md:col-span-5 relative"
        >
          <div className="aspect-[3/4] overflow-hidden rounded-sm shadow-2xl skew-y-3">
             <img src="/api/vangogh/img/44?w=800" className="w-full h-full object-cover" alt="La Chambre à Arles" />
          </div>
          <div className="absolute -bottom-6 -left-6 bg-gold p-6 text-v-black font-serif italic text-lg shadow-xl">
             "La tristesse durera toujours."
          </div>
        </motion.div>
      </section>

      {/* SECTION C — LES ESSENTIELS (Layout Grille Éditoriale) */}
      <section id="essentiels" className="px-6 py-32 bg-v-black text-cream overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
          <div>
            <span className="text-[10px] text-gold uppercase tracking-[0.4em] mb-4 block">Sélection Permanente</span>
            <h2 className="font-serif text-5xl md:text-7xl leading-none">Les Essentiels</h2>
          </div>
          <p className="font-sans text-v-gray text-sm md:text-base max-w-xs italic border-l border-gold/30 pl-6">
            Quarante-et-un éclats de génie, annotés et racontés par l'artiste lui-même.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
          {essentials.slice(0, 9).map((work, i) => (
            <motion.div 
              key={work.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 3) * 0.1 }}
              viewport={{ once: true }}
              className={`group flex flex-col ${i % 2 === 1 ? 'md:translate-y-12' : ''}`}
            >
              <Link href={`/art/${work.catalogNumber}`}>
                <div className="aspect-[4/5] overflow-hidden mb-8 relative cursor-pointer">
                  <img 
                    src={`/api/vangogh/img/${work.id}?w=640`} 
                    alt={work.titleFr}
                    className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gold/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-4 right-4 w-12 h-12 rounded-full border border-cream/20 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                     <Mic size={16} className="text-cream" />
                  </div>
                </div>
              </Link>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-[10px] text-v-gray tracking-widest uppercase">{work.year}</span>
                  <span className="text-gold font-serif text-xs italic">{work.period.replace('-', ' ')}</span>
                </div>
                <h3 className="font-serif text-3xl group-hover:text-gold transition-colors">{work.titleFr}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION D — LE STORE (Mise en scène mockups) */}
      <section className="py-56 px-6 bg-cream border-y border-gold/10">
        <div className="max-w-7xl mx-auto text-center mb-32">
          <h2 className="font-serif text-4xl md:text-6xl mb-6">Habiter sa peinture.</h2>
          <p className="font-sans text-v-gray text-lg max-w-xl mx-auto">
            Chaque pièce est une extension physique de l'œuvre. Scannez, et Vincent vous raconte ce que vous tenez entre vos mains.
          </p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-24">
          {products.slice(0, 2).map((p, i) => (
            <motion.div 
               key={i}
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="group flex flex-col gap-8"
            >
              <div className="aspect-square bg-v-black overflow-hidden relative">
                <img 
                   src={`/api/vangogh/img/mockup/${p.gabaritId}`} 
                   className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000"
                   alt={p.title}
                />
                <div className="absolute bottom-8 left-8 bg-cream text-v-black px-6 py-3 font-sans text-[10px] font-bold tracking-widest uppercase shadow-2xl">
                  Découvrir l'objet
                </div>
              </div>
              <div className="flex justify-between items-center px-4">
                <h3 className="font-serif text-2xl uppercase tracking-widest">{p.title}</h3>
                <span className="text-carmine font-bold text-xl">{p.price}€</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION E — LES LETTRES (Profondeur textuelle) */}
      <section className="py-56 bg-v-black text-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div className="order-2 md:order-1">
             <div className="relative">
                <div className="text-[15vw] font-serif text-white/5 absolute -top-24 -left-12 pointer-events-none uppercase tracking-tighter">Lettres</div>
                <div className="space-y-12 relative z-10">
                   {artworks.slice(60, 63).map((work, i) => (
                     <div key={i} className="border-b border-cream/10 pb-8 hover:border-gold transition-colors cursor-pointer group">
                        <Link href={`/lettre/${work.letterNumber}`}>
                           <div className="flex justify-between items-start">
                              <div>
                                <p className="font-serif text-2xl italic leading-relaxed mb-4 group-hover:text-gold transition-colors">
                                  "{(work.letterExcerpt || "Je rêve toujours de peinture.").slice(0, 100)}..."
                                </p>
                                <span className="text-[10px] text-v-gray uppercase tracking-widest">{work.locationPainted}, {work.year}</span>
                              </div>
                              <ArrowRight size={20} className="text-gold opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-2" />
                           </div>
                        </Link>
                     </div>
                   ))}
                </div>
             </div>
          </div>
          <div className="order-1 md:order-2 space-y-8">
             <h2 className="font-serif text-5xl md:text-7xl text-gold italic leading-none">Chaque jour, à l'encre.</h2>
             <p className="font-sans text-v-gray text-xl leading-relaxed">
               930 lettres adressées principalement à son frère Théo. Un journal intime, brutal, magnifique, qui révèle l'homme derrière le mythe.
             </p>
             <Link href="/lettre/1" className="inline-flex items-center gap-4 bg-cream text-v-black px-10 py-5 font-sans text-xs font-bold uppercase tracking-widest">
               Voir l'archive épistolaire
             </Link>
          </div>
        </div>
      </section>
      </div>
    </PageWrapper>
  );
}
