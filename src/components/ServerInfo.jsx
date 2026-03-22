const ServerInfo = () => {
  return (
    <section id="info" className="scroll-mt-32">
      <div className="flex items-center gap-3 mb-8">
        <iconify-icon icon="solar:server-linear" className="text-zinc-500 text-lg"></iconify-icon>
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">Server Overview</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">Region</span>
          <span className="text-sm text-zinc-200">North America (East)</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">Gameplay Style</span>
          <span className="text-sm text-zinc-200">PvPvE / Light Roleplay</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">Wipe Policy</span>
          <span className="text-sm text-amber-500">No scheduled wipes</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1">
          <span className="text-xs font-medium text-zinc-500">Loot Respawn</span>
          <span className="text-sm text-zinc-200">Every 2 in-game months</span>
        </div>
        <div className="p-5 border border-zinc-800/60 bg-zinc-900/20 rounded-xl flex flex-col gap-1 sm:col-span-2">
          <span className="text-xs font-medium text-zinc-500">Additional Notes</span>
          <span className="text-sm text-zinc-400 leading-relaxed">
            In-game voice chat is highly encouraged. Factions can claim safehouses after 3 days of playtime.
            Reading speeds are increased by 2x to respect your time.
          </span>
        </div>
      </div>
    </section>
  );
};

export default ServerInfo;
