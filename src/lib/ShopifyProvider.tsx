import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ShopifyProduct, API_BASE } from './constants';

interface CartItem {
  product: ShopifyProduct;
  variantId: string;
  artworkId: string;
  artworkTitle: string;
  size?: string;
}

interface ShopifyContextType {
  products: ShopifyProduct[];
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (index: number) => void;
  checkout: () => Promise<void>;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  total: string;
}

const ShopifyContext = createContext<ShopifyContextType | null>(null);

export function ShopifyProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/shopify/catalog`)
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Error fetching Shopify catalog:', err));
  }, []);

  const addToCart = useCallback((item: CartItem) => {
    setCart(prev => [...prev, item]);
    setIsCartOpen(true);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  }, []);

  const checkout = useCallback(async () => {
    // This calls the Shopify Storefront API via proxy to get a checkout URL
    // For this example, we'll simulate the process and log it
    // In a real implementation, you'd send the variantIds to the GraphQL endpoint
    console.log('Checking out with:', cart);
    
    try {
      const response = await fetch(`${API_BASE}/shopify/storefront`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `mutation { checkoutCreate(input: { lineItems: [${cart.map(i => `{ variantId: "${i.variantId}", quantity: 1 }`).join(',')}] }) { checkout { webUrl } } }`
        })
      });
      const result = await response.json();
      if (result.data?.checkoutCreate?.checkout?.webUrl) {
        window.open(result.data.checkoutCreate.checkout.webUrl, '_blank');
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    }
  }, [cart]);

  const total = cart.reduce((acc, item) => acc + parseFloat(item.product.price), 0).toFixed(2);

  return (
    <ShopifyContext.Provider value={{ products, cart, addToCart, removeFromCart, checkout, isCartOpen, setIsCartOpen, total }}>
      {children}
    </ShopifyContext.Provider>
  );
}

export function useShopify() {
  const context = useContext(ShopifyContext);
  if (!context) throw new Error('useShopify must be used within ShopifyProvider');
  return context;
}
