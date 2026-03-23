import { useRef, useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

const TESTIMONIALS = [
  {
    author: "Miraglia",
    quote: "Best server ever!!!",
    initial: "M"
  }
];

const Feedback = () => {
  const { t } = useLanguage();
  const sliderRef = useRef(null);
  const [selectedType, setSelectedType] = useState('feedback');
  const [steamName, setSteamName] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [turnstileLoaded, setTurnstileLoaded] = useState(false);

  // Load Cloudflare Turnstile script dynamically
  useEffect(() => {
    if (window.turnstile) {
      setTurnstileLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
    script.async = true;
    script.defer = true;
    
    window.onloadTurnstileCallback = () => {
      setTurnstileLoaded(true);
    };
    
    document.head.appendChild(script);

    return () => {
      delete window.onloadTurnstileCallback;
    };
  }, []);

  const scrollSlider = (direction) => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth > 400 ? 336 : sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({ left: scrollAmount * direction, behavior: 'smooth' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const token = window.turnstile?.getResponse();
    
    if (!token) {
      setSubmitMessage(t('feedback.messages.captchaRequired'));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('https://api.zomboid.miraglia.cc/api/form/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: selectedType,
          steamName,
          message,
          'cf-turnstile-response': token
        })
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage(t(`feedback.messages.${result.message}`));
        setSteamName('');
        setMessage('');
        setSelectedType('feedback');
        window.turnstile?.reset();
      } else {
        setSubmitMessage(t(`feedback.messages.${result.message}`));
      }
    } catch (error) {
      setSubmitMessage(t('feedback.messages.serverError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="scroll-mt-32">
      <div className="flex flex-col gap-16">
        {/* Survivor Log Slider - Only show if testimonials exist */}
        {TESTIMONIALS.length > 0 && (
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
              {TESTIMONIALS.map((testimonial, index) => (
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
        )}

        {/* Form */}
        <div className="w-full">
          <div className="p-6 md:p-8 border border-zinc-800/80 bg-zinc-900/30 rounded-2xl">
            <h3 className="text-base font-semibold text-zinc-100 mb-6 tracking-tight">{t('feedback.formTitle')}</h3>

            {submitMessage && (
              <div className={`p-3 rounded mb-4 ${submitMessage.includes('Thank') || submitMessage.includes('Köszönjük') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {submitMessage}
              </div>
            )}

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
                  value={steamName}
                  onChange={(e) => setSteamName(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors"
                  placeholder={t('feedback.steamNamePlaceholder')}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-medium text-zinc-500">{t('feedback.message')}</label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-700 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600 transition-colors resize-none"
                  placeholder={t('feedback.messagePlaceholder')}
                  required
                ></textarea>
              </div>

              <div className="flex flex-col gap-2">
                <div 
                  className="cf-turnstile" 
                  data-sitekey={"0x4AAAAAACvCiaOh7Uhs1cJI"}
                  data-callback="onSubmit"
                  data-size="normal"
                ></div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !turnstileLoaded}
                className={`mt-2 w-full md:w-auto md:px-8 py-2.5 text-sm font-medium rounded-lg transition-colors ml-auto ${
                  isSubmitting || !turnstileLoaded
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-zinc-200 hover:bg-white text-zinc-950'
                }`}
              >
                {isSubmitting ? 'Submitting...' : t('feedback.submit')}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feedback;
