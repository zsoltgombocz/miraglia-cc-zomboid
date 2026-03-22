import { useState, useEffect } from 'react';

const ModManager = () => {
  const [mods, setMods] = useState([]);
  const [workshopId, setWorkshopId] = useState('');
  const [collectionUrl, setCollectionUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMods();
    fetchCollectionUrl();
  }, []);

  const fetchMods = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/mods');
      const data = await response.json();
      setMods(data);
    } catch (error) {
      console.error('Failed to fetch mods:', error);
    }
  };

  const fetchCollectionUrl = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/settings/collection_url');
      const data = await response.json();
      setCollectionUrl(data.value || '');
    } catch (error) {
      console.error('Failed to fetch collection URL:', error);
    }
  };

  const handleAddMod = async (e) => {
    e.preventDefault();
    if (!workshopId) return;

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/mods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workshopId }),
      });

      if (response.ok) {
        setWorkshopId('');
        fetchMods();
      } else {
        alert('Failed to add mod. Check the Workshop ID.');
      }
    } catch (error) {
      alert('Failed to add mod');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMod = async (id) => {
    if (!confirm('Delete this mod?')) return;

    try {
      await fetch(`http://localhost:3001/api/mods/${id}`, { method: 'DELETE' });
      fetchMods();
    } catch (error) {
      alert('Failed to delete mod');
    }
  };

  const handleSaveCollectionUrl = async () => {
    try {
      await fetch('http://localhost:3001/api/settings/collection_url', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value: collectionUrl }),
      });
      alert('Collection URL saved!');
    } catch (error) {
      alert('Failed to save collection URL');
    }
  };

  const moveModUp = (index) => {
    if (index === 0) return;
    const newMods = [...mods];
    [newMods[index - 1], newMods[index]] = [newMods[index], newMods[index - 1]];
    setMods(newMods);
    saveModOrder(newMods);
  };

  const moveModDown = (index) => {
    if (index === mods.length - 1) return;
    const newMods = [...mods];
    [newMods[index], newMods[index + 1]] = [newMods[index + 1], newMods[index]];
    setMods(newMods);
    saveModOrder(newMods);
  };

  const saveModOrder = async (orderedMods) => {
    try {
      const modOrder = orderedMods.map((mod, index) => ({
        id: mod.id,
        order: index,
      }));

      await fetch('http://localhost:3001/api/mods/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mods: modOrder }),
      });
    } catch (error) {
      console.error('Failed to save mod order:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Mod Form */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Add Workshop Mod</h2>
        <form onSubmit={handleAddMod} className="flex gap-3">
          <input
            type="text"
            value={workshopId}
            onChange={(e) => setWorkshopId(e.target.value)}
            placeholder="Enter Workshop ID"
            className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-lime-600"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-lime-600 hover:bg-lime-500 disabled:bg-zinc-700 text-zinc-950 font-medium rounded-lg transition-colors"
          >
            {loading ? 'Adding...' : 'Add Mod'}
          </button>
        </form>
      </div>

      {/* Collection URL */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Workshop Collection URL</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={collectionUrl}
            onChange={(e) => setCollectionUrl(e.target.value)}
            placeholder="https://steamcommunity.com/sharedfiles/filedetails/?id=..."
            className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-lime-600"
          />
          <button
            onClick={handleSaveCollectionUrl}
            className="px-6 py-2 bg-lime-600 hover:bg-lime-500 text-zinc-950 font-medium rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>

      {/* Mods List */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold text-zinc-100">Mods (Drag to Reorder)</h2>
        {mods.map((mod, index) => (
          <div
            key={mod.id}
            className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-4 flex items-center gap-4"
          >
            {/* Reorder buttons */}
            <div className="flex flex-col gap-1">
              <button
                onClick={() => moveModUp(index)}
                disabled={index === 0}
                className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move up"
              >
                <iconify-icon icon="solar:alt-arrow-up-linear" className="text-lg"></iconify-icon>
              </button>
              <button
                onClick={() => moveModDown(index)}
                disabled={index === mods.length - 1}
                className="p-1 text-zinc-500 hover:text-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Move down"
              >
                <iconify-icon icon="solar:alt-arrow-down-linear" className="text-lg"></iconify-icon>
              </button>
            </div>

            {mod.image && (
              <img
                src={mod.image}
                alt={mod.name}
                className="w-16 h-16 rounded-lg object-cover border border-zinc-800"
              />
            )}
            <div className="flex-1">
              <h3 className="font-medium text-zinc-200">{mod.name}</h3>
              <p className="text-sm text-zinc-500">{mod.description}</p>
              <p className="text-xs text-zinc-600 mt-1">ID: {mod.id}</p>
            </div>
            <button
              onClick={() => handleDeleteMod(mod.id)}
              className="px-4 py-2 bg-red-900/20 hover:bg-red-900/30 border border-red-800 text-red-400 rounded-lg transition-colors text-sm"
            >
              Delete
            </button>
          </div>
        ))}
        {mods.length === 0 && (
          <div className="text-center text-zinc-500 py-12">No mods added yet</div>
        )}
      </div>
    </div>
  );
};

export default ModManager;
