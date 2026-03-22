import { useState } from 'react';

const HowToJoin = () => {
  const [copiedIP, setCopiedIP] = useState(false);
  const [copiedPort, setCopiedPort] = useState(false);

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
        <h2 className="text-xl font-semibold tracking-tight text-zinc-100">How to Join</h2>
      </div>

      <div className="relative pl-6 border-l border-zinc-800 flex flex-col gap-10">
        <div className="relative">
          <div className="absolute -left-[30px] top-1 w-3 h-3 bg-zinc-950 border-2 border-zinc-700 rounded-full"></div>
          <h3 className="text-sm font-medium text-zinc-200 mb-2">1. Subscribe to Mods</h3>
          <p className="text-sm text-zinc-500">
            Ensure you have downloaded all required mods from the Steam Workshop before launching the game.
          </p>
        </div>

        <div className="relative">
          <div className="absolute -left-[30px] top-1 w-3 h-3 bg-zinc-950 border-2 border-zinc-700 rounded-full"></div>
          <h3 className="text-sm font-medium text-zinc-200 mb-2">2. Enter Server Details</h3>
          <p className="text-sm text-zinc-500 mb-4">
            Launch Project Zomboid, select 'Join', and add a new server with the credentials below.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1.5 pl-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500 font-medium tracking-wider">
                  IP Address
                </span>
                <span className="text-sm font-mono text-zinc-300">123.45.67.89</span>
              </div>
              <button
                onClick={() => copyToClipboard('123.45.67.89', 'ip')}
                className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                title="Copy IP"
              >
                <iconify-icon
                  icon={copiedIP ? 'solar:check-circle-linear' : 'solar:copy-linear'}
                  className={`text-lg ${copiedIP ? 'text-lime-500' : ''}`}
                ></iconify-icon>
              </button>
            </div>
            <div className="w-full sm:w-32 bg-zinc-900/50 border border-zinc-800 rounded-lg p-1.5 pl-3 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase text-zinc-500 font-medium tracking-wider">Port</span>
                <span className="text-sm font-mono text-zinc-300">16261</span>
              </div>
              <button
                onClick={() => copyToClipboard('16261', 'port')}
                className="p-2 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-colors"
                title="Copy Port"
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
          <h3 className="text-sm font-medium text-zinc-200 mb-2">3. Survive</h3>
          <p className="text-sm text-zinc-500">
            Create your character, pick your spawn point carefully, and try not to get bitten.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowToJoin;
