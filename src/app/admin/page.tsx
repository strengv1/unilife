'use client';
import { useState, useEffect, useTransition } from 'react';
import { TournamentManager } from './components/TournamentManager';
import { Loading } from '@/components/Loading';
import { loginAction, logoutAction, checkAuthAction } from '@/app/lib/actions/auth-actions';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const result = await checkAuthAction();
    setIsAuthenticated(result.authenticated);
    setLoading(false);
  };

  const handleLogin = async (formData: FormData) => {
    setError('');
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setIsAuthenticated(true);
      }
    });
  };

  const handleLogout = async () => {
    startTransition(async () => {
      await logoutAction();
      setIsAuthenticated(false);
    });
  };

  if (loading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form action={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          {error && (
            <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}
          <input
            type="password"
            name="password"
            placeholder="Enter admin password"
            className="w-full p-3 border rounded-md mb-4"
            required
            autoFocus
            disabled={isPending}
          />
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tournament Admin</h1>
            <form action={handleLogout}>
              <button
                type="submit"
                disabled={isPending}
                className="text-sm bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md transition-colors disabled:opacity-50"
              >
                {isPending ? 'Logging out...' : 'Logout'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <TournamentManager />
    </div>
  );
}