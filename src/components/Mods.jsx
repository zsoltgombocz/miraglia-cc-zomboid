const Mods = () => {
  const mods = [
    {
      name: "Brita's Weapons",
      description: 'Expanded arsenal and attachments.',
      image: 'https://images.unsplash.com/photo-1595590424283-b8f1784cb2c2?w=100&h=100&fit=crop',
    },
    {
      name: 'True Actions',
      description: 'Adds sitting and lying down animations.',
      image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=100&h=100&fit=crop',
    },
    {
      name: 'Filibuster Cars',
      description: 'Dozens of new lore-friendly vehicles.',
      image: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=100&h=100&fit=crop',
    },
    {
      name: 'RV Interior',
      description: 'Explore and live inside larger vehicles.',
      image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?w=100&h=100&fit=crop',
    },
    {
      name: 'Authentic Z',
      description: 'More clothing, zombies, and upgrades.',
      image: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=100&h=100&fit=crop',
    },
    {
      name: 'Skill Journal',
      description: 'Record and recover skills after death.',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=100&h=100&fit=crop',
    },
  ];

  return (
    <section id="mods" className="scroll-mt-32">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <iconify-icon icon="solar:box-linear" className="text-zinc-500 text-lg"></iconify-icon>
          <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Workshop Mods</h2>
        </div>
      </div>

      <p className="text-sm text-zinc-400 mb-6 border-l-2 border-lime-800 pl-4 py-1">
        Important: Please subscribe to our collection before joining to avoid connection timeouts.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {mods.map((mod, index) => (
          <div
            key={index}
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
                <button
                  className="text-zinc-500 group-hover:text-zinc-200 transition-colors"
                  title="View on Workshop"
                >
                  <iconify-icon icon="solar:arrow-right-up-linear" className="text-lg"></iconify-icon>
                </button>
              </div>
              <span className="text-xs text-zinc-500 line-clamp-1">{mod.description}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center gap-4">
        <a
          href="#"
          className="inline-flex items-center gap-2 text-sm text-lime-600 hover:text-lime-500 font-medium transition-colors"
        >
          Subscribe to full collection <iconify-icon icon="solar:arrow-right-linear"></iconify-icon>
        </a>
      </div>
    </section>
  );
};

export default Mods;
