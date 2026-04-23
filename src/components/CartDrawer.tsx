import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useShopify } from '../lib/ShopifyProvider';
import { motion, AnimatePresence } from 'motion/react';

export function CartDrawer() {
  const { cart, removeFromCart, checkout, isCartOpen, setIsCartOpen, total } = useShopify();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-v-black/60 backdrop-blur-sm z-[100]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-lg bg-v-atmosphere z-[110] shadow-2xl flex flex-col"
          >
            <div className="absolute inset-0 opacity-10 pointer-events-none">
               <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/canvas-orange.png')] opacity-20" />
            </div>

            <div className="p-8 md:p-12 flex items-center justify-between border-b border-gold/10 relative z-10">
              <div className="flex flex-col">
                <span className="text-gold text-[10px] tracking-[0.4em] uppercase mb-1">Votre Sélection</span>
                <h2 className="font-serif text-3xl md:text-4xl text-v-black leading-none">Ma Galerie</h2>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)} 
                className="text-v-black hover:rotate-90 transition-transform p-2"
              >
                <X size={32} strokeWidth={1} />
              </button>
            </div>

            <div className="flex-grow overflow-y-auto no-scrollbar p-8 md:p-12 space-y-12 relative z-10">
              {cart.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center py-20 grayscale opacity-40">
                  <ShoppingBag size={64} strokeWidth={0.5} className="text-gold mb-8" />
                  <p className="font-serif text-2xl italic">"Votre toile est encore blanche."</p>
                  <p className="font-sans text-xs tracking-widest uppercase mt-4">Vincent attend votre choix.</p>
                </div>
              ) : (
                <div className="space-y-10">
                  {cart.map((item, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-8 group"
                    >
                      <div className="w-32 h-32 md:w-40 md:h-40 shrink-0 bg-v-black p-2 rotate-1 shadow-xl hover:rotate-0 transition-transform duration-500 overflow-hidden">
                        <img 
                          src={`/api/vangogh/img/${item.artworkId}?w=480`} 
                          alt={item.artworkTitle}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                        />
                      </div>
                      <div className="flex flex-col justify-between py-2 flex-grow">
                        <div className="space-y-1">
                          <span className="text-[10px] text-gold uppercase tracking-[0.3em]">{item.product.title}</span>
                          <h3 className="font-serif text-xl md:text-2xl text-v-black leading-tight selection:bg-gold/30">{item.artworkTitle}</h3>
                          {item.size && <p className="text-[10px] text-v-gray tracking-widest uppercase">Format: <span className="text-v-black font-bold">{item.size}</span></p>}
                        </div>
                        <div className="flex items-center justify-between mt-4">
                           <span className="text-carmine font-bold text-xl">{item.product.price}€</span>
                           <button 
                            onClick={() => removeFromCart(index)}
                            className="text-[10px] tracking-widest uppercase text-v-gray hover:text-carmine transition-colors border-b border-transparent hover:border-carmine pb-0.5"
                           >
                            Supprimer
                           </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 md:p-12 bg-v-night text-cream space-y-8 relative z-10 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
                <div className="flex justify-between items-end border-b border-white/10 pb-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] tracking-[0.4em] uppercase text-gold mb-2">Total de la Galerie</span>
                    <span className="font-serif text-5xl md:text-6xl italic leading-none">{total}€</span>
                  </div>
                  <span className="text-[10px] text-v-gray italic mb-2 tracking-widest">TVA incluse</span>
                </div>
                
                <div className="space-y-4">
                  <button 
                    onClick={checkout}
                    className="w-full bg-cream text-v-black py-6 text-xs tracking-[0.4em] font-bold uppercase transition-all hover:bg-gold flex items-center justify-center gap-4 group"
                  >
                    Finaliser l'acquisition <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                  <p className="text-[8px] text-center text-v-gray tracking-[0.3em] uppercase opacity-60 leading-relaxed font-sans">
                    Expédition soignée en 48h · Certificat d'authenticité inclus · Paiement sécurisé
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
