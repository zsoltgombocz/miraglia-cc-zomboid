import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

const ServerInfo = () => {
  const { t, language } = useLanguage();
  const [content, setContent] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/content')
      .then((res) => res.json())
      .then((data) => setContent(data))
      .catch((err) => console.error('Failed to fetch content:', err));
  }, []);

  const serverInfo = content?.[language]?.serverInfo;

  return (
    <section id="info" className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-8">
        <iconify-icon icon="solar:server-linear" className="text-zinc-500 text-lg"></iconify-icon>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">{t('serverInfo.title')}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">{t('serverInfo.region')}</span>
          <span className="text-sm text-zinc-200">{serverInfo?.region || t('serverInfo.regionValue')}</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">{t('serverInfo.gameplayStyle')}</span>
          <span className="text-sm text-zinc-200">{serverInfo?.gameplayStyle || t('serverInfo.gameplayStyleValue')}</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">{t('serverInfo.wipePolicy')}</span>
          <span className="text-sm text-amber-500">{serverInfo?.wipePolicy || t('serverInfo.wipePolicyValue')}</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">{t('serverInfo.lootRespawn')}</span>
          <span className="text-sm text-zinc-200">{serverInfo?.lootRespawn || t('serverInfo.lootRespawnValue')}</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-medium text-zinc-500">{t('serverInfo.additionalNotes')}</span>
          <span className="text-sm text-zinc-400 leading-relaxed">
            {serverInfo?.additionalNotes || t('serverInfo.additionalNotesValue')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServerInfo;
