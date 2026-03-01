'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Subscription } from '@/types';
import * as api from '@/lib/api';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function SubscriptionDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/logg-inn');
      return;
    }

    if (user) {
      api.getSubscription(Number(id))
        .then(setSubscription)
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [authLoading, user, router, id]);

  async function handleCancel() {
    setCancelling(true);
    try {
      const updated = await api.cancelSubscription(Number(id));
      setSubscription(updated);
      setShowConfirm(false);
    } catch {
      setError(true);
    } finally {
      setCancelling(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200 mx-auto" />
          <div className="h-64 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error || !subscription) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-baby-blue hover:text-baby-blue-dark transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
          Tilbake til oversikten
        </Link>
        <div className="mt-8 rounded-2xl bg-baby-warm p-8 text-center">
          <p className="text-lg text-baby-text">
            Vi klarte dessverre ikke å hente dette abonnementet.
          </p>
        </div>
      </div>
    );
  }

  const isActive = subscription.status === 'ACTIVE';

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-baby-blue hover:text-baby-blue-dark transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        Tilbake til oversikten
      </Link>

      <div className="mt-8 rounded-2xl bg-white p-8 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-baby-text">{subscription.packageName}</h1>
            <p className="mt-1 text-sm text-baby-text-light">
              {subscription.packageType === 'base' ? 'Basispakke' : 'Tilleggspakke'}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              isActive
                ? 'bg-baby-sage-light text-baby-sage'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {isActive ? 'Aktiv' : 'Kansellert'}
          </span>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex justify-between rounded-lg bg-baby-cream px-4 py-3">
            <span className="text-sm text-baby-text-light">Barn</span>
            <span className="font-medium text-baby-text">{subscription.childName}</span>
          </div>

          <div className="flex justify-between rounded-lg bg-baby-cream px-4 py-3">
            <span className="text-sm text-baby-text-light">Månedspris</span>
            <span className="font-bold text-baby-blue">{subscription.monthlyPrice} kr</span>
          </div>

          <div className="flex justify-between rounded-lg bg-baby-cream px-4 py-3">
            <span className="text-sm text-baby-text-light">Startet</span>
            <span className="font-medium text-baby-text">
              {new Date(subscription.startedAt).toLocaleDateString('nb-NO')}
            </span>
          </div>

          {subscription.endedAt && (
            <div className="flex justify-between rounded-lg bg-baby-cream px-4 py-3">
              <span className="text-sm text-baby-text-light">Avsluttet</span>
              <span className="font-medium text-baby-text">
                {new Date(subscription.endedAt).toLocaleDateString('nb-NO')}
              </span>
            </div>
          )}
        </div>

        {isActive && !showConfirm && (
          <button
            onClick={() => setShowConfirm(true)}
            className="mt-8 w-full rounded-full border border-red-300 py-2.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            Kanseller abonnement
          </button>
        )}

        {showConfirm && (
          <div className="mt-8 rounded-xl bg-red-50 p-4">
            <p className="text-sm text-red-600">
              Er du sikker på at du vil kansellere dette abonnementet? Du kan ikke angre denne handlingen.
            </p>
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 rounded-full border border-gray-300 py-2 text-sm font-medium text-baby-text"
              >
                Avbryt
              </button>
              <button
                onClick={handleCancel}
                disabled={cancelling}
                className="flex-1 rounded-full bg-red-500 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-600 disabled:opacity-50"
              >
                {cancelling ? 'Kansellerer...' : 'Ja, kanseller'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
