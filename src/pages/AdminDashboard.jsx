import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentEditor from '../components/admin/ContentEditor';
import ModManager from '../components/admin/ModManager';
import FormManager from '../components/admin/FormManager';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('content');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('admin-token');
    if (!token) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    navigate('/admin');
  };

  const tabs = [
    { id: 'content', label: 'Content', icon: 'solar:document-text-linear' },
    { id: 'mods', label: 'Mods', icon: 'solar:box-linear' },
    { id: 'forms', label: 'Forms & Testimonials', icon: 'solar:chat-round-line-linear' },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-400">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-zinc-100">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 rounded-lg transition-colors text-sm"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-zinc-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'text-lime-500 border-lime-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              <iconify-icon icon={tab.icon}></iconify-icon>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div>
          {activeTab === 'content' && <ContentEditor />}
          {activeTab === 'mods' && <ModManager />}
          {activeTab === 'forms' && <FormManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
