import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hu' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2.5 rounded-full md:rounded-xl hover:bg-zinc-800/50 transition-colors flex items-center justify-center text-zinc-400 hover:text-zinc-100 group relative"
      title="Change language"
    >
      <span className="text-xs font-medium uppercase">{language}</span>
      <span className="absolute left-full ml-4 px-2 py-1 bg-zinc-800 text-zinc-200 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden md:block border border-zinc-700 whitespace-nowrap">
        {language === 'en' ? 'Magyar' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;
