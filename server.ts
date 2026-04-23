import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { GoogleGenAI } from "@google/genai";
import { WebSocketServer } from 'ws';
import http from 'http';

// Mock Data (In a real app, these would be in a database or external service)
const ARTWORKS = [
  {
    id: 1,
    catalogNumber: "F612",
    title: "La Nuit Étoilée",
    titleFr: "La Nuit Étoilée",
    year: 1889,
    period: "Saint-Rémy",
    medium: "Huile sur toile",
    dimensions: "73.7 cm × 92.1 cm",
    currentMuseum: "MoMA, New York",
    locationPainted: "Saint-Rémy-de-Provence",
    letterNumber: "595",
    descriptionVincent: "Ce matin, j'ai vu la campagne de ma fenêtre longtemps avant le lever du soleil, avec rien que l'étoile du matin, laquelle paraissait très grande.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/1280px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg"
  },
  {
    id: 2,
    catalogNumber: "F454",
    title: "Les Tournesols",
    titleFr: "Les Tournesols",
    year: 1888,
    period: "Arles",
    medium: "Huile sur toile",
    dimensions: "92.1 cm × 73 cm",
    currentMuseum: "National Gallery, Londres",
    locationPainted: "Arles",
    letterNumber: "524",
    descriptionVincent: "Je suis en train de peindre avec l'entrain d'un Marseillais mangeant de la bouillabaisse, ce qui ne t'étonnera pas lorsqu'il s'agit de peindre de grands Tournesols.",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Vincent_Willem_van_Gogh_127.jpg/800px-Vincent_Willem_van_Gogh_127.jpg"
  },
  {
    id: 3,
    catalogNumber: "F382",
    title: "La Chambre à coucher",
    titleFr: "La Chambre à Arles",
    year: 1888,
    period: "Arles",
    medium: "Huile sur toile",
    dimensions: "72 cm × 90 cm",
    currentMuseum: "Van Gogh Museum, Amsterdam",
    locationPainted: "Arles",
    descriptionVincent: "Cette fois-ci cela doit être tout simplement ma chambre à coucher, seulement ici la couleur doit tout faire...",
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg/1280px-Vincent_van_Gogh_-_De_slaapkamer_-_Google_Art_Project.jpg"
  }
];

const PRODUCTS = [
  {
    shopifyId: "prod_1",
    title: "Estampe Fine Art",
    handle: "estampe-fine-art",
    price: "85.00",
    variantGid: "gid://shopify/ProductVariant/1",
    gabaritId: "estampe",
    category: "estampes",
    variants: [{ id: "gid://shopify/ProductVariant/1", title: "Standard", price: "85.00" }]
  },
  {
    shopifyId: "prod_2",
    title: "Carré de Soie Lyonnaise",
    handle: "carre-soie",
    price: "150.00",
    variantGid: "gid://shopify/ProductVariant/2",
    gabaritId: "foulard",
    category: "soie",
    variants: [{ id: "gid://shopify/ProductVariant/2", title: "Unique", price: "150.00" }]
  },
  {
    shopifyId: "prod_3",
    title: "Coffret de Lettres",
    handle: "coffret-lettres",
    price: "45.00",
    variantGid: "gid://shopify/ProductVariant/3",
    gabaritId: "livre",
    category: "livres",
    variants: [{ id: "gid://shopify/ProductVariant/3", title: "Standard", price: "45.00" }]
  }
];

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/vangogh/artworks", (req, res) => {
    res.json(ARTWORKS);
  });

  app.get("/api/shopify/catalog", (req, res) => {
    res.json(PRODUCTS);
  });

  app.get("/api/vangogh/img/:id", (req, res) => {
    const artwork = ARTWORKS.find(a => a.id === parseInt(req.params.id) || a.catalogNumber === req.params.id);
    if (artwork) {
      res.redirect(artwork.imageUrl);
    } else {
      res.status(404).send("Image not found");
    }
  });

  // Mock implementation for checkout
  app.post("/api/shopify/storefront", (req, res) => {
    res.json({
      data: {
        checkoutCreate: {
          checkout: {
            webUrl: "https://checkout.shopify.com/mock-checkout"
          }
        }
      }
    });
  });

  // WebSocket for AI voice interaction
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (request, socket, head) => {
    const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
    if (pathname === '/api/vangogh/voice-call') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    } else {
      socket.destroy();
    }
  });

  wss.on('connection', (ws) => {
    console.log('Vincent session started');
    
    ws.on('message', (message) => {
      // Mock AI response for now
      // In a real implementation, you'd use Google Gemini Live API or similar
      console.log('Received audio/message from client');
    });

    ws.on('close', () => console.log('Vincent session ended'));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
