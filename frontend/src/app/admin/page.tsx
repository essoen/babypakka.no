'use client';

import { useState, useEffect } from 'react';
import { AdminStats } from '@/types';
import * as api from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.getAdminStats()
      .then(setStats)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-gray-200" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-baby-warm p-8 text-center">
        <p className="text-lg text-baby-text">Kunne ikke laste statistikk.</p>
        <p className="mt-2 text-sm text-baby-text-light">Vennligst prøv igjen senere.</p>
      </div>
    );
  }

  const cards = [
    {
      label: 'Brukere',
      value: stats?.totalUsers ?? 0,
      color: 'bg-baby-blue',
      icon: 'M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z',
    },
    {
      label: 'Barn',
      value: stats?.totalChildren ?? 0,
      color: 'bg-baby-pink',
      icon: 'M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z',
    },
    {
      label: 'Aktive abonnementer',
      value: stats?.activeSubscriptions ?? 0,
      color: 'bg-baby-sage',
      icon: 'M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z',
    },
    {
      label: 'Produkter',
      value: stats?.totalProducts ?? 0,
      color: 'bg-baby-warm-dark',
      icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z',
    },
    {
      label: 'Pakker',
      value: stats?.totalPackages ?? 0,
      color: 'bg-baby-blue-dark',
      icon: 'm21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-baby-text">Adminpanel</h1>
      <p className="mt-1 text-sm text-baby-text-light">Oversikt over Babypakka.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color} text-white`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d={card.icon} />
                </svg>
              </div>
              <div>
                <p className="text-sm text-baby-text-light">{card.label}</p>
                <p className="text-2xl font-bold text-baby-text">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
