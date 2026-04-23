import { X, Check, ShoppingBag, Info, Smartphone } from 'lucide-react';
import { useShopify } from '../lib/ShopifyProvider';
import { Artwork, ShopifyProduct } from '../lib/constants';
import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { ARViewer } from './ARViewer';

interface QuickShopDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  product: ShopifyProduct;
  artwork?: Artwork;
}

export function QuickShopDrawer({ isOpen, onClose, product, artwork }: QuickShopDrawerProps) {
  const { addToCart } = useShopify();
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isAROpen, setIsAROpen] = useState(false);
  const needsSize = ['t-shirt', 'hoodie', 'sweatshirt'].includes(product.gabaritId.toLowerCase());
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

  const handleAdd = () => {
    if (!artwork) return;
    addToCart({
      product,
      variantId: product.variantGid,
      artworkId: artwork.catalogNumber,
      artworkTitle: artwork.titleFr,
      size: needsSize ? selectedSize : undefined
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-v-black/70 backdrop-blur-md z-[120]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-v-atmosphere z-[130] shadow-2xl flex flex-col md:flex-row"
          >
            {/* Visual Preview Section */}
            <div className="md:w-1/2 bg-v-black relative overflow-hidden flex items-center justify-center p-12">
               <div className="absolute inset-0 opacity-20 bg-v-night" />
               <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')]" />
               
               <div className="relative w-full aspect-[3/4] flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-radial from-gold/10 to-transparent blur-3xl animate-pulse" />
                  
                  {/* The Artwork Incarnation with a real gallery frame effect */}
                  {artwork && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0, rotate: -3 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      transition={{ delay: 0.3, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                      className="relative w-full h-full shadow-[0_50px_100px_-20px_rgba(0,0,0,1)] group"
                    >
                       {/* Ornate Frame Shadow */}
                       <div className="absolute -inset-4 border-[1px] border-gold/20 pointer-events-none" />
                       <div className="absolute -inset-8 border-[1px] border-gold/10 pointer-events-none" />

                       <img 
                        src={`/api/vangogh/img/${artwork.id}?w=1000`}
                        className="w-full h-full object-cover rounded-[1px] brightness-[0.9] group-hover:brightness-110 transition-all duration-1000"
                        alt=""
                      />
                      
                      {/* Artistic Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-v-black/40 via-transparent to-white/5 pointer-events-none" />
                      
                      {/* Product Mockup Overlay — The Incarnation */}
                      <motion.img
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 0.6, y: 0 }}
                        transition={{ delay: 1, duration: 1 }}
                        src={`/api/vangogh/img/mockup/${product.gabaritId}`}
                        className="absolute bottom-8 right-8 w-32 h-32 object-contain pointer-events-none invert mix-blend-screen"
                        alt=""
                      />
                    </motion.div>
                  )}
               </div>

               <div className="absolute bottom-8 left-12 right-12 flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-gold text-[8px] tracking-[0.5em] uppercase font-bold mb-1">Authenticité</span>
                    <span className="text-white/40 text-[7px] tracking-[0.2em] uppercase font-mono">ID: {artwork?.catalogNumber}</span>
                  </div>
                  <div className="h-px flex-grow mx-8 bg-gold/10 mb-2" />
                  <span className="text-gold text-[8px] tracking-[0.5em] uppercase font-bold mb-1">Studio Arles</span>
               </div>
            </div>

            {/* Config Section */}
            <div className="md:w-1/2 bg-cream flex flex-col">
              <div className="p-8 md:p-12 flex items-center justify-between border-b border-gold/10">
                <div className="flex flex-col">
                   <span className="text-gold text-[10px] tracking-[0.3em] uppercase mb-1">Configuration</span>
                   <h2 className="font-serif text-3xl text-v-black leading-none">L'Objet</h2>
                </div>
                <button onClick={onClose} className="text-v-black hover:rotate-90 transition-transform">
                  <X size={32} strokeWidth={1} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto no-scrollbar p-8 md:p-12 space-y-12">
                <div className="space-y-4">
                  <h3 className="font-serif text-4xl text-v-black">{product.title}</h3>
                  <div className="flex items-center gap-6">
                     <span className="text-carmine font-bold text-3xl">{product.price}€</span>
                     <span className="text-[10px] tracking-widest uppercase text-v-gray bg-gold/5 px-3 py-1 rounded-full border border-gold/10">Édition Artisanale</span>
                  </div>
                </div>

                <div className="space-y-4 pt-8 border-t border-gold/10">
                   <div className="flex items-center gap-3 text-gold">
                      <Info size={16} />
                      <span className="text-[10px] tracking-[0.2em] uppercase font-bold">Détails de fabrication</span>
                   </div>
                   <p className="font-sans text-v-black/70 text-base leading-relaxed italic">
                      "On ne peut pas faire d’art sans souffrir, mais il faut aussi savoir l'entourer de douceur." <br />
                      Imprimé avec des pigments naturels sur {product.category === 'soie' ? 'soie lyonnaise' : 'coton biologique haute densité'}.
                   </p>
                </div>

                {needsSize && (
                  <div className="space-y-6 pt-8 border-t border-gold/10">
                    <div className="flex justify-between items-end">
                       <span className="text-[10px] tracking-[0.3em] uppercase font-bold text-v-gray">Choisir la dimension</span>
                       <span className="text-[10px] text-gold underline">Guide des tailles</span>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      {sizes.map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-4 flex items-center justify-center border font-sans text-sm transition-all ${selectedSize === size ? 'bg-v-black text-cream border-v-black scale-[1.05] shadow-lg' : 'border-gold/20 hover:border-gold text-v-black/40'}`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-8 md:p-12 border-t border-gold/10 bg-v-black">
                 <div className="flex gap-4">
                   <button 
                    onClick={() => setIsAROpen(true)}
                    className="flex-1 bg-white border border-gold/20 text-gold py-6 flex items-center justify-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.4em] transition-all hover:border-gold hover:scale-[1.02] active:scale-[0.98] group"
                   >
                    <Smartphone size={18} className="group-hover:rotate-12 transition-transform" />
                    Sublimer mon espace
                   </button>
                   <button 
                    onClick={handleAdd}
                    className="flex-[1.5] bg-cream text-v-black py-6 flex items-center justify-center gap-4 font-sans text-xs font-bold uppercase tracking-[0.4em] transition-all hover:bg-gold hover:scale-[1.02] active:scale-[0.98] group"
                   >
                    <ShoppingBag size={18} className="group-hover:-translate-y-1 transition-transform" />
                    Placer dans ma galerie
                   </button>
                 </div>
              </div>
            </div>
          </motion.div>
        <ARViewer 
          isOpen={isAROpen}
          onClose={() => setIsAROpen(false)}
          artworkUrl={artwork ? `/api/vangogh/img/${artwork.id}?w=1200` : undefined}
          title={artwork?.titleFr || product.title}
        />
        </>
      )}
    </AnimatePresence>
  );
}
