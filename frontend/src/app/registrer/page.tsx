'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passordene stemmer ikke overens.');
      return;
    }

    if (password.length < 6) {
      setError('Passordet må være minst 6 tegn.');
      return;
    }

    setLoading(true);

    try {
      await register(email, password, name);
      router.push('/onboarding');
    } catch {
      setError('Kunne ikke opprette konto. E-postadressen kan allerede være i bruk.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-baby-text">Opprett konto</h1>
        <p className="mt-2 text-sm text-baby-text-light">
          Registrer deg for å komme i gang med Babypakka.
        </p>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-baby-text">
              Fullt navn
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
              placeholder="Ola Nordmann"
            />
          </div>

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
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
              placeholder="Minst 6 tegn"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-baby-text">
              Bekreft passord
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
              placeholder="Gjenta passordet"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-baby-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark disabled:opacity-50"
          >
            {loading ? 'Oppretter konto...' : 'Opprett konto'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-baby-text-light">
          Har du allerede konto?{' '}
          <Link href="/logg-inn" className="font-medium text-baby-blue hover:text-baby-blue-dark">
            Logg inn
          </Link>
        </p>
      </div>
    </div>
  );
}
