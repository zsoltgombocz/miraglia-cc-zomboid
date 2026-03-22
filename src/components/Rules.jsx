import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Rules = () => {
  const { t } = useLanguage();
  const [openRule, setOpenRule] = useState(null);

  const rules = [
    { title: t('rules.rule1Title'), content: t('rules.rule1Content') },
    { title: t('rules.rule2Title'), content: t('rules.rule2Content') },
    { title: t('rules.rule3Title'), content: t('rules.rule3Content') },
    { title: t('rules.rule4Title'), content: t('rules.rule4Content') },
    { title: t('rules.rule5Title'), content: t('rules.rule5Content') },
  ];

  const toggleRule = (index) => {
    setOpenRule(openRule === index ? null : index);
  };

  return (
    <section id="rules" className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-8">
        <iconify-icon icon="solar:shield-warning-linear" className="text-zinc-500 text-lg"></iconify-icon>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">{t('rules.title')}</h2>
      </div>

      <div className="flex flex-col border-t border-zinc-800/60">
        {rules.map((rule, index) => (
          <details
            key={index}
            open={openRule === index}
            onToggle={() => toggleRule(index)}
            className="group border-b border-zinc-800/60 py-4"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-medium text-zinc-200 hover:text-white transition-colors">
              <span>{rule.title}</span>
              <span className="transition-transform duration-200 group-open:rotate-180 text-zinc-500">
                <iconify-icon icon="solar:alt-arrow-down-linear"></iconify-icon>
              </span>
            </summary>
            <div className="text-sm text-zinc-500 mt-3 leading-relaxed pr-8">{rule.content}</div>
          </details>
        ))}
      </div>
    </section>
  );
};

export default Rules;
