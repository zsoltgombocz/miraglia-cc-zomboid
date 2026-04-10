import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { API_URL } from '../config';

const Navigation = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);

  const navItems = [
    { href: '#home', icon: 'solar:home-2-linear', labelKey: 'nav.home' },
    { href: '#info', icon: 'solar:info-circle-linear', labelKey: 'nav.info' },
    { href: '#mods', icon: 'solar:box-linear', labelKey: 'nav.mods' },
    { href: '#rules', icon: 'solar:clipboard-list-linear', labelKey: 'nav.rules' },
    { href: '#feedback', icon: 'solar:chat-round-line-linear', labelKey: 'nav.feedback' },
  ];

  useEffect(() => {
    // Fetch changelog and calculate unread count
    const calculateUnreadCount = async () => {
      try {
        const response = await fetch(`${API_URL}/api/changelog`);
        const data = await response.json();
        const lastViewed = localStorage.getItem('lastViewedChangelog');

        if (!lastViewed) {
          // If never viewed, count all changelogs
          setUnreadCount(data.changelogs.length);
        } else {
          // Count changelogs newer than last viewed
          const lastViewedDate = new Date(lastViewed);
          const unread = data.changelogs.filter(
            (entry) => new Date(entry.datetime) > lastViewedDate
          ).length;
          setUnreadCount(unread);
        }
      } catch (error) {
        console.error('Failed to calculate unread changelog count:', error);
      }
    };

    calculateUnreadCount();
  }, [location.pathname]); // Recalculate when route changes

  return (
    <nav className="fixed z-50 bottom-4 left-1/2 -translate-x-1/2 md:top-1/2 md:left-8 md:-translate-y-1/2 md:translate-x-0 w-max max-w-[90vw]">
      <div className="flex md:flex-col gap-1.5 p-1.5 bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-full md:rounded-2xl shadow-lg shadow-black/50 overflow-x-auto no-scrollbar">
        <LanguageSwitcher />

        <div className="w-px h-4 md:w-4 md:h-px bg-zinc-800 my-auto mx-1 md:mx-auto"></div>

        {navItems.map((item) => (
          <button
            key={item.href}
            onClick={() => {
              if (location.pathname === '/') {
                // On homepage, just scroll to section
                const element = document.querySelector(item.href);
                element?.scrollIntoView({ behavior: 'smooth' });
              } else {
                // On other pages, navigate to homepage with hash
                navigate(`/${item.href}`);
              }
            }}
            className="group relative p-2.5 rounded-full md:rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center justify-center text-zinc-400 hover:text-zinc-100"
          >
            <iconify-icon icon={item.icon} stroke-width="1.5" className="text-lg"></iconify-icon>
            <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block border border-zinc-700">
              {t(item.labelKey)}
            </span>
          </button>
        ))}

        <div className="w-[1px] h-4 md:w-4 md:h-[1px] bg-zinc-800 my-auto mx-1 md:mx-auto"></div>

        <button
          onClick={() => navigate('/changelog')}
          className="group relative p-2.5 rounded-full md:rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center justify-center text-zinc-400 hover:text-zinc-100"
        >
          <iconify-icon icon="solar:history-linear" stroke-width="1.5" className="text-lg"></iconify-icon>
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-lime-600 text-zinc-950 text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1">
              {unreadCount}
            </span>
          )}
          <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block border border-zinc-700">
            {t('nav.changelog')}
          </span>
        </button>

        <button
          onClick={() => {
            if (location.pathname === '/') {
              // On homepage, just scroll to section
              const element = document.querySelector('#join');
              element?.scrollIntoView({ behavior: 'smooth' });
            } else {
              // On other pages, navigate to homepage with hash
              navigate('/#join');
            }
          }}
          className="group relative p-2.5 rounded-full md:rounded-xl hover:bg-lime-900/20 text-lime-600 transition-colors flex items-center justify-center"
        >
          <iconify-icon icon="solar:login-2-linear" stroke-width="1.5" className="text-lg"></iconify-icon>
          <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block border border-zinc-700">
            {t('nav.join')}
          </span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;
