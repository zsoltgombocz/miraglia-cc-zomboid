import { useState } from 'react';

const Rules = () => {
  const [openRule, setOpenRule] = useState(null);

  const rules = [
    {
      title: '1. Respect other players outside of gameplay',
      content:
        'Trash talk in character is fine, but hate speech, real-life harassment, or extreme toxicity in global chat or Discord will result in an immediate ban.',
    },
    {
      title: '2. No cheating or exploiting',
      content:
        'The use of third-party software, duping items, or exploiting map glitches is strictly prohibited. Report exploits if you find them.',
    },
    {
      title: '3. Safehouse mechanics',
      content:
        'You may claim a safehouse after 3 days of survival time. Glitching into safehouses or destroying safehouse walls through exploits is forbidden. Normal raiding mechanics apply.',
    },
    {
      title: '4. Combat logging is cowardly',
      content:
        'Disconnecting while in active PvP combat or while being actively pursued by zombies to avoid death is not allowed. Your character remains in the world briefly after disconnect.',
    },
    {
      title: '5. Admin decisions are final',
      content:
        'If an admin makes a ruling on a dispute, respect it. If you believe an admin is acting unfairly, submit a ticket quietly rather than causing drama in global chat.',
    },
  ];

  const toggleRule = (index) => {
    setOpenRule(openRule === index ? null : index);
  };

  return (
    <section id="rules" className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-8">
        <iconify-icon icon="solar:shield-warning-linear" className="text-zinc-500 text-lg"></iconify-icon>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Server Rules</h2>
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
