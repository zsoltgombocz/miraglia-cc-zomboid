import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';

const Mods = () => {
  const { t } = useLanguage();
  const [mods, setMods] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetch('http://localhost:3000/api/mods')
      .then((res) => res.json())
      .then((data) => setMods(data))
      .catch((err) => console.error('Failed to fetch mods:', err));
  }, []);

  const displayedMods = showAll ? mods : mods.slice(0, 6);

  return (
    <section id="mods" className="scroll-mt-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <iconify-icon icon="solar:box-linear" className="text-zinc-500 text-lg"></iconify-icon>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
            {t('mods.title')} ({mods.length})
          </h2>
        </div>
        {mods.length > 6 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            {showAll ? t('mods.showLess') : t('mods.showMore')}
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {displayedMods.map((mod, index) => (
          <a
            key={index}
            href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.workshopId || mod.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 border border-zinc-800/60 bg-zinc-900/10 rounded-xl flex items-center gap-3 hover:bg-zinc-900/40 transition-colors group"
          >
            <img
              src={mod.image}
              alt={mod.name}
              className="w-12 h-12 rounded-lg object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all border border-zinc-800 shrink-0"
            />
            <div className="flex-1 flex flex-col">
              <div className="flex items-start justify-between">
                <span className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                  {mod.name}
                </span>
                <span className="text-zinc-500 group-hover:text-zinc-200 transition-colors">
                  <iconify-icon icon="solar:arrow-right-up-linear" className="text-lg"></iconify-icon>
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
        {showAll &&
            <button
                onClick={() => setShowAll(false)}
                className="justify-self-center mt-4 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
                {t('mods.showLess')}
            </button>
        }

      <div className="mt-6 flex items-center gap-4">
        <a
          href={"#"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-lime-600 hover:text-lime-500 font-medium transition-colors"
        >
          {t('mods.subscribeCollection')} <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
        </a>
      </div>
    </section>
  );
};

export default Mods;
