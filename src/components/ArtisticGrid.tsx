import { motion } from 'motion/react';
import { Artwork, ShopifyProduct } from '../lib/constants';
import { Smartphone } from 'lucide-react';

interface ArtisticGridProps {
  items: Artwork[];
  onItemClick: (product: ShopifyProduct, artwork: Artwork) => void;
  onArClick: (artwork: Artwork) => void;
  baseProduct: ShopifyProduct;
}

export function ArtisticGrid({ items, onItemClick, onArClick, baseProduct }: ArtisticGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-24 items-start">
      {items.map((work, i) => {
        // Create an organic feel with varied vertical offsets
        const offset = i % 4 === 1 ? 'mt-0' : i % 4 === 2 ? 'mt-20' : i % 4 === 3 ? 'mt-10' : 'mt-32';
        
        return (
          <motion.div 
            key={work.id} 
            initial={{ opacity: 0, y: 50, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ 
              duration: 1,
              delay: (i % 4) * 0.1,
              ease: [0.22, 1, 0.36, 1]
            }}
            viewport={{ once: true, margin: "-100px" }}
            onClick={() => onItemClick(baseProduct, work)}
            className={`group cursor-pointer flex flex-col ${offset}`}
          >
            <div className="relative aspect-[3/4] mb-8 transition-all duration-700 group-hover:shadow-[0_40px_100px_-15px_rgba(0,0,0,0.4)]">
              <div className="w-full h-full overflow-hidden relative">
                 {/* Frame decoration */}
                 <div className="absolute inset-0 border-[20px] border-v-black z-10 transition-transform duration-700 pointer-events-none group-hover:scale-95 opacity-0 group-hover:opacity-100" />
                 <div className="absolute inset-0 ring-1 ring-gold/10 z-20 group-hover:ring-gold/50 transition-all duration-700" />
                 
                 <img 
                  src={`/api/vangogh/img/${work.id}?w=600`} 
                  alt={work.titleFr}
                  className="w-full h-full object-cover transition-all duration-[3s] ease-out group-hover:scale-105 saturate-[0.8] group-hover:saturate-[1.2]"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-v-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-30" />
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center z-40 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onArClick(work);
                  }}
                  className="bg-cream/10 backdrop-blur-md border border-white/20 text-white p-3 rounded-full hover:bg-gold hover:text-v-black hover:border-gold transition-all duration-300"
                  title="Augmented Reality"
                >
                  <Smartphone size={16} />
                </button>
                <span className="text-gold text-[8px] tracking-[.3em] font-bold uppercase">Acquérir l'âme</span>
              </div>
            </div>

            <div className="space-y-3 px-2">
               <div className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold/30" />
                  <span className="text-[9px] text-gold uppercase tracking-[0.4em] font-bold">{work.year}</span>
               </div>
               <h4 className="font-serif text-2xl text-v-black leading-tight group-hover:text-carmine transition-colors duration-500 pr-4">{work.titleFr}</h4>
               <p className="text-[10px] text-v-gray font-sans italic tracking-widest leading-relaxed line-clamp-2 max-w-[200px]">
                {work.currentMuseum || 'Collection particulière'}
               </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
