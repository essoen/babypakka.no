'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch {
      setError('Feil e-postadresse eller passord. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-baby-text">Logg inn</h1>
        <p className="mt-2 text-sm text-baby-text-light">
          Logg inn for å administrere abonnementene dine.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-baby-text">
              E-postadresse
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
              placeholder="din@epost.no"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-baby-text">
              Passord
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
              placeholder="Ditt passord"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-baby-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark disabled:opacity-50"
          >
            {loading ? 'Logger inn...' : 'Logg inn'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-baby-text-light">
          Har du ikke konto?{' '}
          <Link href="/registrer" className="font-medium text-baby-blue hover:text-baby-blue-dark">
            Registrer deg
          </Link>
        </p>
      </div>
    </div>
  );
}
