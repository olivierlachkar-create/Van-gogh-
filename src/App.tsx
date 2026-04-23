/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Route, Switch, Redirect, Link } from 'wouter';
import { AnimatePresence } from 'motion/react';
import { VincentLiveProvider } from './lib/VincentLiveProvider';
import { ShopifyProvider } from './lib/ShopifyProvider';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';
import { Footer } from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { ArtworkDetail } from './pages/ArtworkDetail';
import { Store } from './pages/Store';
import { Museums } from './pages/Museums';
import { Scanner } from './pages/Scanner';
import { LetterDetail } from './pages/LetterDetail';
import { Account } from './pages/Account';

import { MagicalEnvironment } from './components/MagicalEnvironment';

export default function App() {
  return (
    <VincentLiveProvider>
      <ShopifyProvider>
        <MagicalEnvironment>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            
            <main className="flex-grow">
              <AnimatePresence mode="wait">
                <Switch>
              <Route path="/" component={Home} />
              <Route path="/art/:cat" component={ArtworkDetail} />
              <Route path="/store" component={Store} />
              <Route path="/musees" component={Museums} />
              <Route path="/scanner" component={Scanner} />
              <Route path="/lettre/:id" component={LetterDetail} />
              <Route path="/compte" component={Account} />
              
              {/* Redirections */}
              <Route path="/vincent">
                <Redirect to="/" />
              </Route>
              <Route path="/audio">
                <Redirect to="/" />
              </Route>
              <Route path="/livre">
                <Redirect to="/store" />
              </Route>
              <Route path="/expositions">
                <Redirect to="/musees" />
              </Route>
              <Route path="/galerie">
                <Redirect to="/" />
              </Route>
              <Route path="/listen/:cat">
                {(params) => <Redirect to={`/art/${params.cat}?autoplay=true`} />}
              </Route>
              <Route path="/qr/:cat">
                {(params) => <Redirect to={`/art/${params.cat}?autoplay=true`} />}
              </Route>
              <Route path="/store/voice-store/:rest*">
                <Redirect to="/store" />
              </Route>
              <Route path="/app">
                <Redirect to="/" />
              </Route>

              <Route>
                <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
                  <h1 className="font-serif text-3xl mb-4">Cette toile n'existe pas encore.</h1>
                  <Link href="/" className="text-carmine underline uppercase tracking-widest text-sm">
                    Retour à l'accueil
                  </Link>
                </div>
              </Route>
                </Switch>
          </AnimatePresence>
            </main>
            
            <Footer />
            <CartDrawer />
          </div>
        </MagicalEnvironment>
      </ShopifyProvider>
    </VincentLiveProvider>
  );
}
