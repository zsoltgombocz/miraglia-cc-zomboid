import { LanguageProvider } from './contexts/LanguageContext';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import LatestChangelog from './components/LatestChangelog';
import ServerInfo from './components/ServerInfo';
import Mods from './components/Mods';
import HowToJoin from './components/HowToJoin';
import Rules from './components/Rules';
import Feedback from './components/Feedback';
import Changelog from './components/Changelog';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    // Handle hash navigation on page load
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location.hash]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative overflow-x-hidden">
      <Navigation />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 md:py-32 pb-32 md:pb-32 flex flex-col gap-24 md:gap-32 md:ml-32 lg:ml-auto">
        <Hero />
        <LatestChangelog />
        <ServerInfo />
        <Mods />
        <HowToJoin />
        <Rules />
        <Feedback />
      </main>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="bg-zinc-950 text-zinc-400 font-sans antialiased selection:bg-lime-900/30 selection:text-lime-200">
          {/* Atmospheric Background Glow */}
          <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(39,39,42,0.15),_transparent_40%)]"></div>
          <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_bottom_left,_rgba(63,98,18,0.05),_transparent_30%)]"></div>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/changelog" element={<Changelog />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  );
}

export default App;
