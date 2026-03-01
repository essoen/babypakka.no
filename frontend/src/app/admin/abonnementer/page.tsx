'use client';

import { useState, useEffect } from 'react';
import { Subscription } from '@/types';
import * as api from '@/lib/api';

const STATUS_OPTIONS = [
  { value: '', label: 'Alle' },
  { value: 'ACTIVE', label: 'Aktive' },
  { value: 'PAUSED', label: 'Pauset' },
  { value: 'CANCELLED', label: 'Kansellert' },
];

function statusBadgeClasses(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-baby-sage-light text-baby-sage';
    case 'PAUSED':
      return 'bg-baby-warm text-baby-warm-dark';
    case 'CANCELLED':
      return 'bg-red-100 text-red-600';
    default:
      return 'bg-gray-100 text-gray-600';
  }
}

function statusLabel(status: string): string {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'Aktiv';
    case 'PAUSED':
      return 'Pauset';
    case 'CANCELLED':
      return 'Kansellert';
    default:
      return status;
  }
}

export default function AdminSubscriptionsPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  async function loadSubscriptions(status?: string) {
    try {
      const data = await api.getAdminSubscriptions(status || undefined);
      setSubscriptions(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSubscriptions(statusFilter);
  }, [statusFilter]);

  async function handleStatusChange(id: number, newStatus: string) {
    setUpdatingId(id);
    try {
      await api.updateSubscriptionStatus(id, newStatus);
      await loadSubscriptions(statusFilter);
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-64 rounded-2xl bg-gray-200" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-baby-warm p-8 text-center">
        <p className="text-lg text-baby-text">Kunne ikke laste abonnementer.</p>
        <p className="mt-2 text-sm text-baby-text-light">Vennligst prøv igjen senere.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-baby-text">Abonnementer</h1>
          <p className="mt-1 text-sm text-baby-text-light">Administrer alle abonnementer.</p>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setLoading(true);
              setStatusFilter(e.target.value);
            }}
            className="rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        {subscriptions.length === 0 ? (
          <div className="p-8 text-center text-baby-text-light">
            Ingen abonnementer funnet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 font-medium text-baby-text-light">Barn</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light sm:table-cell">Pakke</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light md:table-cell">Type</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Pris/mnd</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Status</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light lg:table-cell">Startet</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light lg:table-cell">Avsluttet</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Endre status</th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((sub) => (
                <tr key={sub.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-baby-text">{sub.childName}</td>
                  <td className="hidden px-4 py-3 text-baby-text-light sm:table-cell">{sub.packageName}</td>
                  <td className="hidden px-4 py-3 text-baby-text-light md:table-cell">
                    {sub.packageType.toUpperCase() === 'BASE' || sub.packageType === 'base'
                      ? 'Basis'
                      : 'Tillegg'}
                  </td>
                  <td className="px-4 py-3 text-baby-text">{sub.monthlyPrice} kr</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${statusBadgeClasses(sub.status)}`}
                    >
                      {statusLabel(sub.status)}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 text-baby-text-light lg:table-cell">
                    {new Date(sub.startedAt).toLocaleDateString('nb-NO')}
                  </td>
                  <td className="hidden px-4 py-3 text-baby-text-light lg:table-cell">
                    {sub.endedAt ? new Date(sub.endedAt).toLocaleDateString('nb-NO') : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={sub.status.toUpperCase()}
                      disabled={updatingId === sub.id}
                      onChange={(e) => handleStatusChange(sub.id, e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs focus:border-baby-blue focus:outline-none disabled:opacity-50"
                    >
                      <option value="ACTIVE">Aktiv</option>
                      <option value="PAUSED">Pauset</option>
                      <option value="CANCELLED">Kansellert</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
