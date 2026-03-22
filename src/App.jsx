import { LanguageProvider } from './contexts/LanguageContext';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import ServerInfo from './components/ServerInfo';
import Mods from './components/Mods';
import HowToJoin from './components/HowToJoin';
import Rules from './components/Rules';
import Feedback from './components/Feedback';

function App() {
  return (
    <LanguageProvider>
      <div className="bg-zinc-950 text-zinc-400 font-sans antialiased selection:bg-lime-900/30 selection:text-lime-200">
        {/* Atmospheric Background Glow */}
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,_rgba(39,39,42,0.15),_transparent_40%)]"></div>
        <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_bottom_left,_rgba(63,98,18,0.05),_transparent_30%)]"></div>

        <div className="flex flex-col md:flex-row min-h-screen relative overflow-x-hidden">
          <Navigation />

          <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 md:py-32 pb-32 md:pb-32 flex flex-col gap-24 md:gap-32 md:ml-32 lg:ml-auto">
            <Hero />
            <ServerInfo />
            <Mods />
            <HowToJoin />
            <Rules />
            <Feedback />
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}

export default App;
