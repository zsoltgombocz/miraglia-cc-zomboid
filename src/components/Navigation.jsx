import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';

const Navigation = () => {
  const { t } = useLanguage();

  const navItems = [
    { href: '#home', icon: 'solar:home-2-linear', labelKey: 'nav.home' },
    { href: '#info', icon: 'solar:info-circle-linear', labelKey: 'nav.info' },
    { href: '#mods', icon: 'solar:box-linear', labelKey: 'nav.mods' },
    { href: '#rules', icon: 'solar:clipboard-list-linear', labelKey: 'nav.rules' },
    { href: '#feedback', icon: 'solar:chat-round-line-linear', labelKey: 'nav.feedback' },
  ];

  return (
    <nav className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 md:top-1/2 md:left-8 md:-translate-y-1/2 md:translate-x-0 w-max max-w-[90vw]">
      <div className="flex md:flex-col gap-1.5 p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-full md:rounded-2xl shadow-lg shadow-black/50 overflow-x-auto no-scrollbar">
        <LanguageSwitcher />

        <div className="w-px h-4 md:w-4 md:h-px bg-zinc-800 my-auto mx-1 md:mx-auto"></div>

        {navItems.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="group relative p-2.5 rounded-full md:rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center justify-center text-zinc-400 hover:text-zinc-100"
          >
            <iconify-icon icon={item.icon} stroke-width="1.5" className="text-lg"></iconify-icon>
            <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block border border-zinc-700">
              {t(item.labelKey)}
            </span>
          </a>
        ))}

        <div className="w-[1px] h-4 md:w-4 md:h-[1px] bg-zinc-800 my-auto mx-1 md:mx-auto"></div>

        <a
          href="#join"
          className="group relative p-2.5 rounded-full md:rounded-xl hover:bg-lime-900/20 text-lime-600 transition-colors flex items-center justify-center"
        >
          <iconify-icon icon="solar:login-2-linear" stroke-width="1.5" className="text-lg"></iconify-icon>
          <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block border border-zinc-700">
            {t('nav.join')}
          </span>
        </a>
      </div>
    </nav>
  );
};

export default Navigation;
