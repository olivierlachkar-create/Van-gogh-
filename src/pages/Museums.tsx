import { useState, useEffect } from 'react';
import { Artwork, API_BASE } from '../lib/constants';
import { MapPin, ArrowRight, Map as MapIcon } from 'lucide-react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'motion/react';

export function Museums() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [museums, setMuseums] = useState<{ name: string; city: string; count: number; works: Artwork[] }[]>([]);
  const [selectedMuseum, setSelectedMuseum] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/vangogh/artworks`)
      .then(res => res.json())
      .then((data: Artwork[]) => {
        setArtworks(data);
        const museumMap = new Map();
        
        data.forEach(work => {
          if (work.currentMuseum && work.currentMuseum !== 'Private collection') {
            const name = work.currentMuseum;
            const city = work.locationPainted || 'Unknown';
            if (!museumMap.has(name)) {
              museumMap.set(name, { name, city, count: 0, works: [] });
            }
            const m = museumMap.get(name);
            m.count++;
            m.works.push(work);
          }
        });
        
        setMuseums(Array.from(museumMap.values()).sort((a, b) => b.count - a.count));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="h-screen bg-v-black flex items-center justify-center">
      <motion.div 
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="font-serif text-gold text-2xl italic uppercase tracking-[0.5em]"
      >
        Cartographie Artistique
      </motion.div>
    </div>
  );

  return (
    <div className="bg-v-atmosphere min-h-screen pt-48 pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <header className="mb-24 relative">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">Pélerinage Culturel</span>
            <h1 className="font-serif text-6xl md:text-9xl leading-none mb-8">Les Musées <br /><span className="text-stroke text-gold italic">du Monde</span></h1>
            <p className="font-sans text-v-gray text-lg max-w-xl italic leading-relaxed">
              Vincent n'appartient plus à personne, si ce n'est à ceux qui contemplent ses toiles. 
              Parcourez les institutions qui gardent vivante sa flamme.
            </p>
          </motion.div>
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none hidden lg:block">
             <MapIcon size={400} strokeWidth={0.5} className="text-gold" />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gold/10 shadow-2xl rounded-sm overflow-hidden">
          {museums.map((m, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              viewport={{ once: true }}
              className={`bg-cream p-12 transition-all duration-700 cursor-pointer group relative overflow-hidden ${selectedMuseum === m.name ? 'md:col-span-2 md:row-span-2' : 'hover:bg-gold/5'}`}
              onClick={() => setSelectedMuseum(selectedMuseum === m.name ? null : m.name)}
            >
              <div className="flex justify-between items-start mb-12 relative z-10 transition-transform group-hover:-translate-y-1">
                <div className="w-10 h-10 rounded-full border border-gold/30 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-v-black transition-all">
                  <MapPin size={16} />
                </div>
                <span className="text-[10px] tracking-[0.3em] uppercase text-v-gray border-b border-gold/30 pb-1">
                  {m.count} chefs-d'œuvre
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-serif text-3xl md:text-4xl mb-2 group-hover:text-carmine transition-colors">{m.name}</h3>
                <p className="font-sans text-v-gray text-xs tracking-[0.3em] uppercase italic">{m.city}</p>
              </div>

              <AnimatePresence>
                {selectedMuseum === m.name && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-12 pt-12 border-t border-gold/10 relative z-10"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                       <div className="space-y-6">
                         <h4 className="text-[10px] tracking-widest uppercase text-gold font-bold">Sélection en salle</h4>
                         <div className="space-y-4">
                            {m.works.slice(0, 3).map(work => (
                              <Link key={work.id} href={`/art/${work.catalogNumber}`} className="flex items-center gap-6 group/item hover:translate-x-2 transition-transform">
                                <div className="w-16 h-16 shrink-0 overflow-hidden rounded-sm ring-1 ring-gold/10">
                                  <img src={`/api/vangogh/img/${work.id}?w=320`} className="w-full h-full object-cover" alt="" />
                                </div>
                                <div className="flex flex-col">
                                  <span className="font-serif text-sm italic mb-1 group-hover/item:text-carmine transition-colors">{work.titleFr}</span>
                                  <span className="text-[8px] tracking-widest uppercase text-v-gray">{work.year}</span>
                                </div>
                              </Link>
                            ))}
                         </div>
                         <Link href={`/store?museum=${m.name}`} className="inline-block mt-4 text-[10px] uppercase tracking-widest text-gold hover:text-v-black transition-colors">Explorer sa collection complète →</Link>
                       </div>
                       <div className="hidden sm:block aspect-square bg-v-black overflow-hidden relative rounded-sm">
                          <img 
                            src={`/api/vangogh/img/${m.works[0].id}?w=800`} 
                            className="w-full h-full object-cover opacity-60 hover:opacity-100 transition-opacity duration-1000"
                            alt=""
                          />
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                             <div className="border border-cream/20 px-6 py-4 backdrop-blur-md">
                                <span className="text-cream text-[8px] tracking-[0.4em] uppercase font-bold">Inspiration Majeure</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {/* Background accent */}
              <div className="absolute -bottom-12 -right-12 text-gold opacity-[0.03] transition-transform group-hover:scale-110 pointer-events-none uppercase font-serif text-[10vw]">
                {m.city.slice(0, 3)}
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-48 p-16 md:p-32 bg-v-night text-cream relative overflow-hidden flex flex-col items-center text-center"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')] opacity-10 pointer-events-none" />
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-12 block relative z-10">Agenda Culturel</span>
          <h2 className="font-serif text-4xl md:text-7xl mb-12 leading-tight italic relative z-10 max-w-4xl">
            "Je voudrais bien que l'on vienne me chercher."
          </h2>
          <p className="font-sans text-v-gray text-lg max-w-xl mx-auto mb-16 relative z-10 italic">
            Certaines œuvres voyagent. Restez informés des prochaines rétrospectives et expositions temporaires à travers le monde.
          </p>
          <button className="bg-cream text-v-black px-12 py-5 font-sans text-xs font-bold uppercase tracking-widest relative z-10 hover:bg-gold transition-colors">S'inscrire à la gazette de Vincent</button>
        </motion.div>
      </div>
    </div>
  );
}
