import { useRef, useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const Feedback = () => {
  const { t } = useLanguage();
  const sliderRef = useRef(null);
  const [selectedType, setSelectedType] = useState('feedback');

  const testimonials = [
    {
      quote:
        "Best balance of mods I've found. It's brutal enough to be scary, but the QoL mods make it bearable to rebuild after dying.",
      author: 'Marcus T.',
      initial: 'M',
    },
    {
      quote:
        'The admin team is super responsive. The server economy and faction wars make late-game actually worth playing.',
      author: 'Sarah204',
      initial: 'S',
    },
    {
      quote:
        'Love the customized safehouse rules. Gives us a reason to fight over territory without completely losing our progress to a glitch.',
      author: 'Alex G.',
      initial: 'A',
    },
    {
      quote:
        "Hardcore survival at its finest. If you're looking for an easy time, look elsewhere. The loot settings are perfectly scarce.",
      author: 'ZombieBait',
      initial: 'Z',
    },
  ];

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth > 400 ? 336 : sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <section id="feedback" className="scroll-mt-32">
      <div className="flex flex-col gap-16">
        {/* Survivor Log Slider */}
        <div className="w-full">
          <div className="flex items-center gap-3 mb-8">
            <iconify-icon icon="solar:chat-round-line-linear" className="text-zinc-500 text-lg"></iconify-icon>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">{t('feedback.title')}</h2>
          </div>

          <div className="relative group">
            <div
              ref={sliderRef}
              className="flex gap-4 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-4 scroll-smooth"
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="snap-start shrink-0 w-[85%] sm:w-80 p-5 border border-zinc-800/60 bg-zinc-900/10 rounded-xl relative flex flex-col"
                >
                  <iconify-icon
                    icon="solar:quote-left-linear"
                    className="absolute top-4 right-4 text-zinc-800 text-2xl"
                  ></iconify-icon>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-1">{testimonial.quote}</p>
                  <div className="flex items-center gap-2 mt-auto">
                    <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center text-[10px] font-medium text-zinc-400">
                      {testimonial.initial}
                    </div>
                    <span className="text-xs font-medium text-zinc-300">{testimonial.author}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Slider Controls */}
            <div className="hidden sm:flex items-center gap-2 mt-4">
              <button
                onClick={() => scrollSlider(-1)}
                className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
              >
                <iconify-icon icon="solar:alt-arrow-left-linear"></iconify-icon>
              </button>
              <button
                onClick={() => scrollSlider(1)}
                className="w-8 h-8 flex items-center justify-center bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 hover:border-zinc-700 transition-colors"
              >
                <iconify-icon icon="solar:alt-arrow-right-linear"></iconify-icon>
              </button>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="w-full">
          <div className="p-6 md:p-8 border border-zinc-800/80 bg-zinc-900/30 rounded-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-6 tracking-tight">{t('feedback.formTitle')}</h3>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
              {/* Message Type */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500">{t('feedback.messageType')}</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: 'feedback', labelKey: 'feedback.typeFeedback' },
                    { value: 'mod suggestion', labelKey: 'feedback.typeModSuggestion' },
                    { value: 'report', labelKey: 'feedback.typeReport' },
                  ].map((type) => (
                    <label key={type.value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="msgType"
                        value={type.value}
                        checked={selectedType === type.value}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="peer sr-only"
                      />
                      <div className="px-4 py-2 text-xs font-medium border border-zinc-800 rounded-lg text-zinc-400 peer-checked:bg-zinc-800 peer-checked:text-zinc-100 peer-checked:border-zinc-700 transition-colors">
                        {t(type.labelKey)}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500">{t('feedback.steamName')}</label>
                <input
                  type="text"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                  placeholder={t('feedback.steamNamePlaceholder')}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500">{t('feedback.message')}</label>
                <textarea
                  rows="4"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
                  placeholder={t('feedback.messagePlaceholder')}
                ></textarea>
              </div>

              <button
                type="submit"
                className="mt-2 w-full md:w-auto md:px-8 py-2.5 bg-zinc-200 hover:bg-white text-zinc-950 text-sm font-medium rounded-lg transition-colors ml-auto"
              >
                {t('feedback.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
