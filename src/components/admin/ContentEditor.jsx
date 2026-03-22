import { useState, useEffect } from 'react';

const ContentEditor = () => {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/content');
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch('http://localhost:3001/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });
      alert('Content saved successfully!');
    } catch (error) {
      alert('Failed to save content');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (section, field, value) => {
    setContent((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Hero Section</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Title</label>
            <input
              type="text"
              value={content?.hero?.title || ''}
              onChange={(e) => updateField('hero', 'title', e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-lime-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-2">Description</label>
            <textarea
              rows="3"
              value={content?.hero?.description || ''}
              onChange={(e) => updateField('hero', 'description', e.target.value)}
              className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-lime-600 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Server Info Section */}
      <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-zinc-100 mb-4">Server Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(content?.serverInfo || {}).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-zinc-400 mb-2 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => updateField('serverInfo', key, e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 focus:outline-none focus:border-lime-600"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 bg-lime-600 hover:bg-lime-500 disabled:bg-zinc-700 text-zinc-950 font-medium rounded-lg transition-colors"
      >
        {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default ContentEditor;
