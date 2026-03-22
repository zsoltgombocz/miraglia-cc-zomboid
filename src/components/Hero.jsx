import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

const Hero = () => {
  const { t, language } = useLanguage();
  const [content, setContent] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/content')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error('Failed to fetch content:', err));

    // Fetch server status from RCON
    const fetchServerStatus = () => {
      fetch('http://localhost:3001/api/server-status')
        .then((res) => res.json())
        .then((data) => setServerStatus(data))
        .catch((err) => console.error('Failed to fetch server status:', err));
    };

    fetchServerStatus();
    // Update server status every 30 seconds
    const interval = setInterval(fetchServerStatus, 30000);

    return () => clearInterval(interval);
  }, []);

  const heroContent = content?.[language]?.hero;

  return (
    <section id="home" className="flex flex-col items-start pt-12 md:pt-0">
      <div className="text-sm font-semibold tracking-tighter text-zinc-300 mb-16 uppercase">
        ND.
      </div>

      <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100 mb-4 leading-tight">
        {heroContent?.title || t('hero.title')}
      </h1>
      <p className="text-lg text-zinc-400 mb-12 max-w-xl">
        {heroContent?.description || t('hero.description')}
      </p>

      {/* Status Block */}
      <div className="w-full bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5 mb-10 backdrop-blur-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t('hero.status')}</span>
            <div className="flex items-center gap-2">
              {serverStatus?.status === 'unavailable' ? (
                <>
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]"></div>
                  <span className="text-sm font-medium text-amber-400">{t('hero.unreachable')}</span>
                </>
              ) : (
                <>
                  <div className={`w-1.5 h-1.5 rounded-full ${serverStatus?.status === 'online' ? 'bg-lime-500 shadow-[0_0_8px_rgba(132,204,22,0.4)] animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}></div>
                  <span className="text-sm font-medium text-zinc-200">
                    {serverStatus?.status === 'online' ? t('hero.online') : t('hero.offline')}
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t('hero.players')}</span>
            <span className="text-sm font-medium text-zinc-200">
              {serverStatus?.status === 'unavailable' ? (
                <span className="text-amber-400">{t('hero.unreachable')}</span>
              ) : (
                <>{serverStatus?.players ?? '-'} <span className="text-zinc-600">/</span> {serverStatus?.maxPlayers ?? '-'}</>
              )}
            </span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t('hero.ipAddress')}</span>
            <span className="text-sm font-medium text-zinc-200 font-mono">{serverStatus?.ip || '-'}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">{t('hero.port')}</span>
            <span className="text-sm font-medium text-zinc-200 font-mono">{serverStatus?.port || '-'}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <a
          href="#join"
          className="px-5 py-2.5 bg-zinc-100 hover:bg-white text-zinc-950 text-sm font-medium rounded-lg transition-colors shadow-sm"
        >
          {t('hero.connectNow')}
        </a>
        <a
          href="#mods"
          className="px-5 py-2.5 bg-transparent border border-zinc-800 hover:bg-zinc-900/50 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
        >
          {t('hero.viewMods')}
        </a>
      </div>
    </section>
  );
};

export default Hero;
