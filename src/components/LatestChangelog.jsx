import { useLanguage } from '../contexts/LanguageContext';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const LatestChangelog = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [latestEntry, setLatestEntry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/changelog`)
      .then((res) => res.json())
      .then((data) => {
        if (data.changelogs && data.changelogs.length > 0) {
          setLatestEntry(data.changelogs[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch latest changelog:', err);
        setLoading(false);
      });
  }, []);

  if (loading || !latestEntry) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  };

  return (
    <section className="scroll-mt-32">
      <button
        onClick={() => navigate('/changelog')}
        className="w-full p-4 border border-lime-800/40 bg-lime-950/20 rounded-xl hover:bg-lime-950/30 transition-colors group text-left"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <iconify-icon icon="solar:star-linear" className="text-lime-600 text-lg"></iconify-icon>
              <span className="text-xs font-semibold text-lime-600 uppercase tracking-wider">
                {t('latestChangelog.badge')}
              </span>
              <span className="text-xs text-zinc-500">
                {formatDate(latestEntry.datetime)}
              </span>
            </div>
            <h3 className="text-base font-semibold text-zinc-100 mb-1 group-hover:text-lime-500 transition-colors">
              {latestEntry.title[language] || latestEntry.title.en}
            </h3>
            {latestEntry.description && latestEntry.description[language] && (
              <p className="text-sm text-zinc-400 line-clamp-2">
                {latestEntry.description[language] || latestEntry.description.en}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-zinc-500 group-hover:text-lime-500 transition-colors shrink-0">
            <span className="text-xs hidden sm:inline">{t('latestChangelog.viewAll')}</span>
            <iconify-icon icon="solar:arrow-right-linear" className="text-lg"></iconify-icon>
          </div>
        </div>
      </button>
    </section>
  );
};

export default LatestChangelog;
