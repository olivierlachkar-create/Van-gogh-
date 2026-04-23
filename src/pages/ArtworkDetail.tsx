import { useState, useEffect } from 'react';
import { useRoute, useLocation } from 'wouter';
import { useVincent } from '../lib/VincentLiveProvider';
import { Artwork, API_BASE } from '../lib/constants';
import { Mic, Headphones, ChevronLeft, ArrowRight, Smartphone } from 'lucide-react';
import { useShopify } from '../lib/ShopifyProvider';
import { QuickShopDrawer } from '../components/QuickShopDrawer';
import { motion, AnimatePresence } from 'motion/react';
import { SoulVisualizer } from '../components/SoulVisualizer';
import { ARViewer } from '../components/ARViewer';

import { PageWrapper } from '../components/PageWrapper';

export function ArtworkDetail() {
  const [, params] = useRoute<{ cat: string }>('/art/:cat');
  const [, setLocation] = useLocation();
  const { start, playNarration, isNarrationPlaying, state } = useVincent();
  const { products } = useShopify();
  
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAROpen, setIsAROpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/vangogh/artworks`)
      .then(res => res.json())
      .then((data: Artwork[]) => {
        const found = data.find(a => a.catalogNumber === (params ? params.cat : null));
        if (found) setArtwork(found);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching artwork:', err);
        setLoading(false);
      });
  }, [params ? params.cat : null]);

  if (loading) return (
    <div className="h-screen bg-v-black flex flex-col items-center justify-center gap-6">
      <motion.div 
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="w-24 h-24 rounded-full border border-gold/20"
      />
      <span className="font-serif text-gold text-lg italic tracking-widest uppercase">Évocation de l'œuvre...</span>
    </div>
  );

  if (!artwork) return <div className="h-screen bg-v-black flex items-center justify-center text-cream font-serif text-2xl">L'œuvre s'est dissipée.</div>;

  return (
    <PageWrapper>
      <div className="bg-v-atmosphere min-h-screen">
      {/* SECTION 1 — L’EXPOSITION (HÉROS) */}
      <section className="relative h-[100vh] bg-v-night overflow-hidden flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          <img 
            src={`/api/vangogh/img/${artwork.id}?w=2400`} 
            className="w-full h-full object-contain p-4 md:p-12 opacity-80"
            alt={artwork.titleFr}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-v-black via-v-black/20 to-transparent" />
        </motion.div>
        
        <div className="absolute top-32 left-6 md:left-12 z-20">
           <button 
            onClick={() => setLocation('/')}
            className="group flex items-center gap-3 text-gold text-[10px] tracking-[0.3em] uppercase transition-all"
          >
            <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour à la galerie
          </button>
        </div>

        <div className="absolute bottom-12 left-6 right-6 md:left-12 md:right-12 z-20 flex flex-col md:flex-row justify-between items-end gap-12">
          <div className="max-w-3xl">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h1 className="font-serif text-cream text-5xl md:text-8xl mb-6 leading-[0.8]">{artwork.titleFr}</h1>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] text-v-gray uppercase tracking-widest mb-1">Année</span>
                  <span className="font-serif text-gold text-2xl italic">{artwork.year}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] text-v-gray uppercase tracking-widest mb-1">Localisation</span>
                  <span className="font-sans text-cream text-sm tracking-[0.2em] uppercase">{artwork.locationPainted}</span>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="flex flex-col gap-4 w-full md:w-auto">
             <button 
                onClick={() => start(artwork)}
                className={`relative overflow-hidden bg-v-violet text-white px-12 py-5 flex items-center justify-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.3em] transition-all hover:scale-[1.02] shadow-2xl ${state.status === 'active' ? 'ring-2 ring-gold' : ''}`}
              >
                <Mic size={20} className={state.status === 'active' ? 'animate-pulse' : ''} />
                <span>Interroger Vincent</span>
                <AnimatePresence>
                  {state.status === 'active' && (
                    <motion.div 
                      layoutId="soul"
                      className="ml-2"
                    >
                      <SoulVisualizer isActive={true} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button 
                onClick={() => playNarration(artwork.id)}
                className={`border border-cream/20 text-cream backdrop-blur-md px-12 py-5 flex items-center justify-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-cream hover:text-v-black ${isNarrationPlaying ? 'animate-pulse bg-v-red border-v-red' : ''}`}
              >
                <Headphones size={20} />
                <span>Récit de l'œuvre</span>
              </button>
              <button 
                onClick={() => setIsAROpen(true)}
                className="group border border-gold text-gold px-12 py-5 flex items-center justify-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-gold hover:text-v-black"
              >
                <Smartphone size={20} className="group-hover:rotate-12 transition-transform" />
                <span>Une apparition (AR)</span>
              </button>
          </div>
        </div>
      </section>

      {/* SECTION 2 — CARTEL DÉTAILLÉ */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 -mt-24 mb-32 grid grid-cols-1 md:grid-cols-4 gap-px bg-gold/20 shadow-2xl rounded-sm overflow-hidden">
        {[
          { label: "Technique", value: artwork.medium },
          { label: "Dimensions", value: artwork.dimensions },
          { label: "Musée Actuel", value: artwork.currentMuseum, color: "text-carmine" },
          { label: "Période", value: artwork.period.replace('-', ' ') }
        ].map((item, i) => (
          <div key={i} className="bg-cream p-12 transition-colors hover:bg-gold/5 group">
            <h4 className="text-[10px] tracking-[0.4em] uppercase text-v-gray mb-6 group-hover:text-v-black transition-colors">{item.label}</h4>
            <p className={`font-serif text-2xl ${item.color || 'text-v-black'} leading-tight`}>{item.value}</p>
          </div>
        ))}
      </section>

      {/* SECTION 3 — L'OBJET D'ART */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
           <h2 className="font-serif text-5xl md:text-7xl leading-none">
             L'œuvre, <br />
             <span className="italic text-gold opacity-50">incarnée.</span>
           </h2>
           <p className="font-sans text-v-gray text-base max-w-xs border-l border-carmine pl-6">
             Prolongez l'expérience. Chaque objet est une célébration physique de ce que vous venez d'entendre.
           </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {products.slice(0, 4).map((product, i) => (
            <motion.div 
              key={product.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              onClick={() => { setSelectedProduct(product); setIsDrawerOpen(true); }}
              className="group cursor-pointer"
            >
              <div className="aspect-[3/4] bg-v-black/5 mb-6 relative transition-all duration-700 group-hover:shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)]">
                <div className="w-full h-full overflow-hidden relative">
                  <img 
                     src={`/api/vangogh/img/mockup/${product.gabaritId}`} 
                     alt={product.title}
                     className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-v-violet/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0">
                     <div className="bg-v-black text-cream px-8 py-4 text-[10px] font-bold tracking-[0.3em] uppercase">Choisir</div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] tracking-widest uppercase text-v-gray">
                   <span>Gabarit 0{i+1}</span>
                   <span className="text-carmine font-bold">{product.price}€</span>
                </div>
                <h3 className="font-serif text-xl group-hover:text-carmine transition-colors">{product.title}</h3>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {artwork && selectedProduct && (
        <QuickShopDrawer 
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          product={selectedProduct}
          artwork={artwork}
        />
      )}

      <ARViewer 
        isOpen={isAROpen}
        onClose={() => setIsAROpen(false)}
        artworkUrl={`/api/vangogh/img/${artwork.id}?w=1200`}
        title={artwork.titleFr}
        dimensions={artwork.dimensions}
      />
      </div>
    </PageWrapper>
  );
}
