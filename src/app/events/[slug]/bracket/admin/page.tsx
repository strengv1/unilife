'use client';
import { useState, useEffect, useTransition } from 'react';
import { useParams } from 'next/navigation';
import { ScoreReporter } from '../../components/ScoreReporter';
import { loginAction, checkAuthAction } from '@/app/lib/actions/auth-actions';

export default function AdminPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      const result = await checkAuthAction();
      setIsAuthenticated(result.authenticated);
    };
    checkAuth();
  }, []);

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

  if (!isAuthenticated) {
    return (
      <div className="min-h-[66vh] flex items-center justify-center">
        <form action={handleLogin} className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>
          
          {error && (
            <div className="text-red-600 text-sm mb-4 p-2 bg-red-50 rounded">
              {error}
            </div>
          )}

          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter admin password"
              className="w-full p-2 border rounded pr-10"
              required
              disabled={isPending}
              aria-label="Admin password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(prev => !prev)}
              className="absolute inset-y-0 right-2 text-sm text-blue-600 hover:underline cursor-pointer"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isPending ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    );
  }

  return <ScoreReporter tournamentSlug={slug} />;
}