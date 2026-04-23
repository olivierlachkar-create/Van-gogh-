import { useState, useEffect, useMemo, useRef } from 'react';
import { ShopifyProduct, Artwork, API_BASE } from '../lib/constants';
import { useShopify } from '../lib/ShopifyProvider';
import { QuickShopDrawer } from '../components/QuickShopDrawer';
import { Search, ArrowRight, Filter, X, Smartphone, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useDebounce, useClickOutside } from '../lib/hooks';
import Fuse from 'fuse.js';
import { ARViewer } from '../components/ARViewer';
import { ArtisticGrid } from '../components/ArtisticGrid';

import { PageWrapper } from '../components/PageWrapper';

export function Store() {
  const { products } = useShopify();
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 300);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Filter states
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [selectedMediums, setSelectedMediums] = useState<string[]>([]);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>('year-desc');

  useClickOutside(searchRef, () => setShowSuggestions(false));
  
  const [selectedProduct, setSelectedProduct] = useState<ShopifyProduct | null>(null);
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isArOpen, setIsArOpen] = useState(false);
  const [arArtwork, setArArtwork] = useState<Artwork | null>(null);

  const categories = ['Tous', 'Estampes & Impressions', 'Soie & Textile', 'Maison & Déco', 'Digital & Livres'];

  // Derived filter options
  const filterOptions = useMemo(() => {
    const years = Array.from(new Set(artworks.map(a => a.year))).sort((a: number, b: number) => b - a);
    const periods = Array.from(new Set(artworks.map(a => a.period))).sort();
    const mediums = Array.from(new Set(artworks.map(a => a.medium))).sort();
    return { years, periods, mediums };
  }, [artworks]);

  useEffect(() => {
    fetch(`${API_BASE}/artworks?medium=oil`)
      .then(res => res.json())
      .then(data => {
        setArtworks(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching store artworks:', err);
        setLoading(false);
      });
  }, []);

  const fuse = useMemo(() => {
    return new Fuse(artworks, {
      keys: [
        'titleFr',
        'title',
        'medium',
        'currentMuseum',
        'locationPainted',
        'descriptionVincent'
      ],
      threshold: 0.3,
      includeMatches: true
    });
  }, [artworks]);

  const filteredArtworks = useMemo(() => {
    let base = artworks;
    
    // Apply fuzzy search if exists
    if (debouncedFilter) {
      base = fuse.search(debouncedFilter).map(result => result.item);
    }

    // Apply multi-attribute filters
    const filtered = base.filter(work => {
      const matchYear = selectedYears.length === 0 || selectedYears.includes(work.year);
      const matchPeriod = selectedPeriods.length === 0 || selectedPeriods.includes(work.period);
      const matchMedium = selectedMediums.length === 0 || selectedMediums.includes(work.medium);
      return matchYear && matchPeriod && matchMedium;
    });

    // Apply sorting
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'year-asc':
          return a.year - b.year;
        case 'year-desc':
          return b.year - a.year;
        case 'title-asc':
          return a.titleFr.localeCompare(b.titleFr);
        case 'title-desc':
          return b.titleFr.localeCompare(a.titleFr);
        case 'medium-asc':
          return a.medium.localeCompare(b.medium);
        default:
          return 0;
      }
    });
  }, [debouncedFilter, artworks, fuse, selectedYears, selectedPeriods, selectedMediums, sortBy]);

  const toggleFilter = (list: any[], setList: Function, value: any) => {
    if (list.includes(value)) {
      setList(list.filter(i => i !== value));
    } else {
      setList([...list, value]);
    }
  };

  const clearAllFilters = () => {
    setSelectedYears([]);
    setSelectedPeriods([]);
    setSelectedMediums([]);
    setFilter('');
  };

  const suggestions = useMemo(() => {
    if (filter.length < 2) return [];
    return fuse.search(filter).slice(0, 5).map(result => result.item);
  }, [filter, artworks, fuse]);

  const openShop = (product: ShopifyProduct, artwork: Artwork) => {
    setSelectedProduct(product);
    setSelectedArtwork(artwork);
    setIsDrawerOpen(true);
  };

  return (
    <PageWrapper>
      <div className="bg-v-atmosphere min-h-screen">
      {/* SECTION 1 — HÉROS ÉDITORIAL */}
      <section className="bg-v-night text-cream px-6 py-40 md:py-60 flex flex-col items-center text-center overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
           <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')] opacity-20" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10"
        >
          <span className="text-gold text-[10px] tracking-[0.5em] uppercase mb-6 block">Le Commerce de l'Émotion</span>
          <h1 className="font-serif text-6xl md:text-9xl leading-none mb-8">La Collection</h1>
          <p className="font-sans text-v-gray text-lg md:text-xl max-w-2xl mx-auto italic leading-relaxed">
            "Je cherche maintenant à exagérer le caractère de la personnalité par des couleurs éclatantes." <br />
            Trouvez l'œuvre, choisissez son support. Vincent l'animera.
          </p>
        </motion.div>
      </section>

      {/* SECTION 2 — NAVIGATION PAR ŒUVRE */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-32">
           <div className="relative">
              <span className="absolute -top-12 left-0 text-gold/20 font-serif text-[120px] select-none pointer-events-none leading-none -translate-x-12 translate-y-8">V.</span>
              <h2 className="font-serif text-5xl md:text-8xl text-v-black relative z-10 leading-none">Sélectionner <br />une Toile.</h2>
              <div className="mt-8 flex items-center gap-8">
                 <p className="font-sans text-v-gray text-[10px] tracking-widest uppercase font-bold italic">{filteredArtworks.length} toiles disponibles</p>
                 <button 
                  onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
                  className="flex items-center gap-3 text-gold hover:text-v-black transition-all group"
                 >
                    <Filter size={14} className="group-hover:rotate-180 transition-transform duration-700" />
                    <span className="text-[10px] uppercase tracking-widest font-bold">Inspiration Filtrée</span>
                 </button>
              </div>
           </div>

           <div className="relative w-full md:w-96 group" ref={searchRef}>
             <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-v-gray group-hover:text-gold transition-colors" />
             <input 
              type="text" 
              placeholder="Chercher dans les pensées de Vincent..."
              value={filter}
              onChange={(e) => {
                setFilter(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              className="bg-transparent border-b-2 border-gold/20 pl-16 pr-12 py-5 font-serif text-xl focus:outline-none focus:border-carmine transition-all w-full italic"
            />
            {filter && (
              <button 
                onClick={() => setFilter('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-v-gray hover:text-carmine transition-colors"
                id="clear-search"
              >
                <X size={16} />
              </button>
            )}

            <AnimatePresence>
              {showSuggestions && suggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 w-full bg-white shadow-2xl border border-gold/10 z-50 rounded-b-sm mt-1 overflow-hidden"
                >
                  <div className="p-4 border-b border-gold/5">
                    <span className="text-[8px] uppercase tracking-[0.3em] text-v-gray font-bold">Suggestions de Vincent</span>
                  </div>
                  <div className="flex flex-col">
                    {suggestions.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => {
                          setFilter(s.titleFr);
                          setShowSuggestions(false);
                        }}
                        className="flex items-center gap-4 p-4 hover:bg-gold/5 transition-colors text-left group"
                        id={`suggestion-${s.id}`}
                      >
                        <div className="w-10 h-10 shrink-0 overflow-hidden rounded-sm ring-1 ring-gold/10">
                          <img src={`/api/vangogh/img/${s.id}?w=100`} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex flex-col">
                           <span className="font-serif text-sm group-hover:text-carmine transition-colors line-clamp-1">{s.titleFr}</span>
                           <span className="text-[8px] tracking-widest text-v-gray uppercase">{s.year} — {s.period}</span>
                        </div>
                        <ArrowRight size={12} className="ml-auto text-gold opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
           </div>
        </div>

        {/* Expandable Filter Bar */}
        <AnimatePresence>
          {isFilterBarOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-12 border-t border-gold/10 pt-12"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                {/* Year Filter */}
                <div className="space-y-6">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-v-gray border-b border-gold/20 pb-2 block">Année</span>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto no-scrollbar">
                    {filterOptions.years.map(year => (
                      <button 
                        key={year}
                        onClick={() => toggleFilter(selectedYears, setSelectedYears, year)}
                        className={`px-4 py-2 rounded-full text-[10px] border transition-all ${selectedYears.includes(year) ? 'bg-carmine text-white border-carmine' : 'bg-white text-v-black border-gold/20 hover:border-gold'}`}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Period Filter */}
                <div className="space-y-6">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-v-gray border-b border-gold/20 pb-2 block">Période</span>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto no-scrollbar">
                    {filterOptions.periods.map(period => (
                      <button 
                        key={period}
                        onClick={() => toggleFilter(selectedPeriods, setSelectedPeriods, period)}
                        className={`px-4 py-2 rounded-full text-[10px] border transition-all ${selectedPeriods.includes(period) ? 'bg-gold text-v-black border-gold' : 'bg-white text-v-black border-gold/20 hover:border-gold'}`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Medium Filter */}
                <div className="space-y-6">
                  <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-v-gray border-b border-gold/20 pb-2 block">Médium</span>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto no-scrollbar">
                    {filterOptions.mediums.map(m => (
                      <button 
                        key={m}
                        onClick={() => toggleFilter(selectedMediums, setSelectedMediums, m)}
                        className={`px-4 py-2 rounded-full text-[10px] border transition-all ${selectedMediums.includes(m) ? 'bg-v-black text-white border-v-black' : 'bg-white text-v-black border-gold/20 hover:border-gold'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(selectedYears.length > 0 || selectedPeriods.length > 0 || selectedMediums.length > 0) && (
                <div className="mt-12 pt-6 border-t border-gold/10 flex justify-end">
                  <button 
                    onClick={clearAllFilters}
                    className="text-[10px] uppercase tracking-widest text-carmine font-bold hover:underline"
                  >
                    Effacer tout le trouble
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="aspect-[4/5] bg-gold/5 animate-pulse rounded-sm" />
            ))}
          </div>
        ) : (
          <ArtisticGrid 
            items={filteredArtworks.slice(0, 36)} 
            onItemClick={openShop}
            onArClick={(w) => { setArArtwork(w); setIsArOpen(true); }}
            baseProduct={products[0]}
          />
        )}
      </section>

      {/* ATMOSPHERIC QUOTE DIVIDER */}
      <section className="py-60 px-6 overflow-hidden bg-v-black text-cream flex flex-col items-center justify-center text-center relative">
         <div className="absolute inset-0 opacity-10 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg')] bg-cover bg-center grayscale" />
         <motion.div 
          initial={{ opacity: 0, scale: 1.1 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
          className="relative z-10 max-w-3xl"
         >
            <p className="font-serif text-4xl md:text-6xl text-gold italic leading-tight mb-12">
              "Ce que j'espère obtenir, c'est de faire des choses qui touchent les gens."
            </p>
            <div className="h-px w-32 bg-gold/50 mx-auto mb-12" />
            <span className="text-[10px] tracking-[0.5em] uppercase text-v-gray">Lettre à Théo, 1882</span>
         </motion.div>
      </section>

      {/* SECTION 3 — LE SUPPORT (Catégories) */}
      <section className="bg-v-night py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-24">
             <div>
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase mb-4 block">Matières & Support</span>
                <h2 className="font-serif text-cream text-5xl md:text-7xl leading-none">L'Objet Incarné</h2>
             </div>
             <div className="flex gap-8 overflow-x-auto no-scrollbar pb-2">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`pb-4 text-[10px] tracking-[0.3em] uppercase transition-all whitespace-nowrap border-b-2 ${selectedCategory === cat ? 'text-gold border-gold' : 'text-v-gray border-transparent hover:text-cream'}`}
                  >
                    {cat}
                  </button>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                onClick={() => { setSelectedProduct(product); setIsDrawerOpen(true); }}
                className="group cursor-pointer glass-panel p-8 flex flex-col justify-between hover:border-gold/50 transition-all duration-500"
              >
                <div className="w-full">
                  <div className="overflow-hidden mb-8 aspect-square flex items-center justify-center transition-all duration-700 group-hover:shadow-[0_30px_60px_-15px_rgba(212,175,55,0.3)]">
                    <img 
                      src={`/api/vangogh/img/mockup/${product.gabaritId}`} 
                      alt={product.title}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-1000"
                    />
                  </div>
                  <div className="space-y-4">
                     <span className="text-[10px] text-gold uppercase tracking-[0.3em]">Édition Limitée</span>
                     <h3 className="font-serif text-cream text-3xl leading-tight group-hover:text-gold transition-colors">{product.title}</h3>
                  </div>
                </div>
                <div className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
                  <span className="text-cream/40 text-[10px] uppercase tracking-widest">À partir de</span>
                  <span className="text-carmine font-bold text-2xl">{product.price}€</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && artworks.length > 0 && (
        <QuickShopDrawer 
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          product={selectedProduct}
          artwork={selectedArtwork || artworks[0]}
        />
      )}

      <ARViewer 
        isOpen={isArOpen}
        onClose={() => setIsArOpen(false)}
        artworkUrl={arArtwork ? `/api/vangogh/img/${arArtwork.id}?w=800` : undefined}
        title={arArtwork?.titleFr || ''}
        dimensions={arArtwork?.dimensions}
      />
      </div>
    </PageWrapper>
  );
}
