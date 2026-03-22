import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const HowToJoin = () => {
  const { t } = useLanguage();
  const [copiedIP, setCopiedIP] = useState(false);
  const [copiedPort, setCopiedPort] = useState(false);
  const [serverStatus, setServerStatus] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/server-status')
      .then((res) => res.json())
      .then((data) => setServerStatus(data))
      .catch((err) => console.error('Failed to fetch server status:', err));
  }, []);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'ip') {
        setCopiedIP(true);
        setTimeout(() => setCopiedIP(false), 2000);
      } else {
        setCopiedPort(true);
        setTimeout(() => setCopiedPort(false), 2000);
      }
    });
  };

  return (
    <section id="join" className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-8">
        <iconify-icon icon="solar:login-2-linear" className="text-zinc-500 text-lg"></iconify-icon>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">{t('howToJoin.title')}</h2>
      </div>

      <div className="relative pl-6 border-l border-zinc-800 flex flex-col gap-10">
        <div className="relative">
          <div className="absolute -left-[30px] top-1 w-3 h-3 bg-zinc-950 border-2 border-zinc-700 rounded-full"></div>
          <h3 className="text-sm font-medium text-zinc-200 mb-2">{t('howToJoin.step1Title')}</h3>
          <p className="text-sm text-zinc-500">
            {t('howToJoin.step1Description')}
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-[30px] top-1 w-3 h-3 bg-zinc-950 border-2 border-zinc-700 rounded-full"></div>
          <h3 className="text-sm font-medium text-zinc-200 mb-2">{t('howToJoin.step2Title')}</h3>
          <p className="text-sm text-zinc-500">
            {t('howToJoin.step2Description')}
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-[30px] top-1 w-3 h-3 bg-zinc-950 border-2 border-zinc-700 rounded-full"></div>
          <h3 className="text-sm font-medium text-zinc-200 mb-2">{t('howToJoin.step3Title')}</h3>
          <p className="text-sm text-zinc-500 mb-4">
            {t('howToJoin.step3Description')}
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1.5 pl-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500 font-medium tracking-wider">
                  {t('howToJoin.ipAddress')}
                </span>
                <span className="text-sm font-mono text-zinc-300">{serverStatus?.ip || '-'}</span>
              </div>
              <button
                onClick={() => copyToClipboard(serverStatus?.ip || '', 'ip')}
                className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                title="Copy IP"
                disabled={!serverStatus?.ip}
              >
                <iconify-icon
                  icon={copiedIP ? 'solar:check-circle-linear' : 'solar:copy-linear'}
                  className={`text-lg ${copiedIP ? 'text-lime-500' : ''}`}
                ></iconify-icon>
              </button>
            </div>
            <div className="w-full sm:w-32 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1.5 pl-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500 font-medium tracking-wider">{t('howToJoin.port')}</span>
                <span className="text-sm font-mono text-zinc-300">{serverStatus?.port || '-'}</span>
              </div>
              <button
                onClick={() => copyToClipboard(serverStatus?.port || '', 'port')}
                className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                title="Copy Port"
                disabled={!serverStatus?.port}
              >
                <iconify-icon
                  icon={copiedPort ? 'solar:check-circle-linear' : 'solar:copy-linear'}
                  className={`text-lg ${copiedPort ? 'text-lime-500' : ''}`}
                ></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-[30px] top-1 w-3 h-3 bg-zinc-950 border-2 border-zinc-700 rounded-full"></div>
          <h3 className="text-sm font-medium text-zinc-200 mb-2">{t('howToJoin.step4Title')}</h3>
          <p className="text-sm text-zinc-500">
            {t('howToJoin.step4Description')}
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-[30px] top-1 w-3 h-3 bg-zinc-950 border-2 border-zinc-700 rounded-full"></div>
          <h3 className="text-sm font-medium text-zinc-200 mb-2">{t('howToJoin.step5Title')}</h3>
          <p className="text-sm text-zinc-500">
            {t('howToJoin.step5Description')}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowToJoin;
