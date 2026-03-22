import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('admin-token', data.token);
        navigate('/admin/dashboard');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-semibold text-zinc-100 mb-6">Admin Panel</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Master Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-zinc-950/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-zinc-200 focus:outline-none focus:border-lime-600 focus:ring-1 focus:ring-lime-600 transition-colors"
                placeholder="Enter password"
                required
              />
            </div>

            {error && (
              <div className="text-sm text-red-400 bg-red-900/20 border border-red-800/50 rounded-lg px-4 py-2">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-lime-600 hover:bg-lime-500 text-zinc-950 font-medium py-2.5 rounded-lg transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
