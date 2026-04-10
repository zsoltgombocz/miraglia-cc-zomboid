import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import { API_URL } from '../config';

const Changelog = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [changelogs, setChangelogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mark changelog as viewed when component mounts
    localStorage.setItem('lastViewedChangelog', new Date().toISOString());

    // Fetch changelog data
    fetch(`${API_URL}/api/changelog`)
      .then((res) => res.json())
      .then((data) => {
        console.log('Changelog data:', data);
        setChangelogs(data.changelogs);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch changelog:', err);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const ModList = ({ mods, type }) => {
    if (!mods || mods.length === 0) return null;

    const isAdded = type === 'added';
    const iconColor = isAdded ? 'text-green-500' : 'text-red-500';
    const icon = isAdded ? 'solar:add-circle-linear' : 'solar:close-circle-linear';

    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <iconify-icon icon={icon} className={`${iconColor} text-lg`}></iconify-icon>
          <h4 className="text-sm font-medium text-zinc-300">
            {isAdded ? t('changelog.addedMods') : t('changelog.removedMods')} ({mods.length})
          </h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {mods.map((mod, index) => (
            <a
              key={index}
              href={`https://steamcommunity.com/sharedfiles/filedetails/?id=${mod.workshopId}`}
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
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen relative overflow-x-hidden">
      <Navigation />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-16 md:py-32 pb-32 md:pb-32 md:ml-32 lg:ml-auto">
        {/* Header */}
        <section className="scroll-mt-32 mb-24">
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-200 transition-colors mb-8"
          >
            <iconify-icon icon="solar:arrow-left-linear" className="text-lg"></iconify-icon>
            {t('changelog.backToHome')}
          </button>
          <div className="flex items-center gap-3 mb-2">
            <iconify-icon icon="solar:history-linear" className="text-zinc-500 text-lg"></iconify-icon>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
              {t('changelog.title')}
            </h2>
          </div>
          <p className="text-zinc-400 text-sm mt-2">{t('changelog.description')}</p>
        </section>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12 text-zinc-500">
            {t('changelog.loading')}
          </div>
        )}

        {/* Changelog Entries */}
        {!loading && changelogs.length === 0 && (
          <div className="text-center py-12 text-zinc-500">
            {t('changelog.noChangelogs')}
          </div>
        )}

        {!loading && changelogs.length > 0 && (
          <div className="space-y-8">
            {changelogs.map((entry, index) => (
              <div
                key={entry.id}
                className="border border-zinc-800/60 bg-zinc-900/20 rounded-2xl p-6 hover:bg-zinc-900/30 transition-colors"
              >
                {/* Entry Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h2 className="text-xl font-semibold text-zinc-100">
                      {entry.title[language] || entry.title.en}
                    </h2>
                    <span className="text-sm text-zinc-500 shrink-0">
                      {formatDate(entry.datetime)}
                    </span>
                  </div>
                  {entry.description && entry.description[language] && (
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {entry.description[language] || entry.description.en}
                    </p>
                  )}
                </div>

                {/* Mod Lists */}
                <div className="space-y-6">
                  <ModList mods={entry.addedModsDetails} type="added" />
                  <ModList mods={entry.removedModsDetails} type="removed" />
                </div>

                {/* No Changes Message */}
                {(!entry.addedModsDetails || entry.addedModsDetails.length === 0) &&
                  (!entry.removedModsDetails || entry.removedModsDetails.length === 0) && (
                    <div className="text-center py-6 text-zinc-500 text-sm">
                      {t('changelog.noModChanges')}
                    </div>
                  )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Changelog;
