'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Child, Subscription, Order } from '@/types';
import * as api from '@/lib/api';

function orderStatusLabel(status: string): string {
  switch (status) {
    case 'PENDING': return 'Behandles';
    case 'PACKING': return 'Pakkes';
    case 'SHIPPED': return 'Sendt';
    case 'DELIVERED': return 'Levert';
    default: return status;
  }
}

function orderStatusClasses(status: string): string {
  switch (status) {
    case 'PENDING': return 'bg-baby-warm text-baby-warm-dark';
    case 'PACKING': return 'bg-baby-blue-light text-baby-blue-dark';
    case 'SHIPPED': return 'bg-baby-sage-light text-baby-sage';
    case 'DELIVERED': return 'bg-gray-200 text-gray-600';
    default: return 'bg-gray-200 text-gray-600';
  }
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [children, setChildren] = useState<Child[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Address form
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [addressSaving, setAddressSaving] = useState(false);
  const [addressError, setAddressError] = useState('');
  const [hasAddress, setHasAddress] = useState(false);

  // Password form
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/logg-inn');
      return;
    }

    if (user) {
      // Check address
      const addrSet = !!(user.streetAddress && user.postalCode && user.city);
      setHasAddress(addrSet);
      if (addrSet) {
        setStreetAddress(user.streetAddress || '');
        setPostalCode(user.postalCode || '');
        setCity(user.city || '');
      }

      Promise.all([api.getChildren(), api.getSubscriptions(), api.getOrders()])
        .then(([c, s, o]) => {
          setChildren(c);
          setSubscriptions(s);
          setOrders(o);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    }
  }, [authLoading, user, router]);

  async function handleAddressSave(e: React.FormEvent) {
    e.preventDefault();
    setAddressError('');
    setAddressSaving(true);
    try {
      await api.updateAddress({ streetAddress, postalCode, city });
      setHasAddress(true);
      setShowAddressForm(false);
    } catch {
      setAddressError('Kunne ikke lagre adressen. Vennligst prøv igjen.');
    } finally {
      setAddressSaving(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('Passordene er ikke like.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('Nytt passord må være minst 6 tegn.');
      return;
    }
    setPasswordSaving(true);
    try {
      await api.changePassword({ currentPassword, newPassword });
      setPasswordSuccess('Passordet er endret.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Kunne ikke endre passord. Prøv igjen.');
    } finally {
      setPasswordSaving(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 rounded bg-gray-200 mx-auto" />
          <div className="h-48 rounded-2xl bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-baby-text">Min side</h1>
        <div className="mt-8 rounded-2xl bg-baby-warm p-8 text-center">
          <p className="text-lg text-baby-text">Vi klarte dessverre ikke å hente dataene dine akkurat nå.</p>
          <p className="mt-2 text-sm text-baby-text-light">Vennligst prøv igjen senere.</p>
        </div>
      </div>
    );
  }

  const activeSubscriptions = subscriptions.filter((s) => s.status === 'ACTIVE');
  const totalMonthly = activeSubscriptions.reduce((sum, s) => sum + s.monthlyPrice, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-baby-text">Hei, {user?.name}!</h1>
          <p className="mt-1 text-baby-text-light">Her er en oversikt over dine abonnementer.</p>
        </div>
        <Link
          href="/onboarding"
          className="inline-flex items-center justify-center rounded-full bg-baby-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
        >
          + Legg til barn
        </Link>
      </div>

      {/* Address banner */}
      {!hasAddress && !showAddressForm && (
        <div className="mt-6 rounded-2xl border-2 border-dashed border-baby-warm-dark bg-baby-warm/50 p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-semibold text-baby-text">Du mangler leveringsadresse</p>
              <p className="text-sm text-baby-text-light">Legg til adresse for å kunne motta pakker.</p>
            </div>
            <button
              onClick={() => setShowAddressForm(true)}
              className="rounded-full bg-baby-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
            >
              Legg til adresse
            </button>
          </div>
        </div>
      )}

      {/* Address form */}
      {showAddressForm && (
        <div className="mt-6 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-baby-text">Leveringsadresse</h2>
          {addressError && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{addressError}</div>
          )}
          <form onSubmit={handleAddressSave} className="mt-4 space-y-3">
            <div>
              <label htmlFor="street" className="block text-sm font-medium text-baby-text">Gateadresse</label>
              <input id="street" type="text" required value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                placeholder="Storgata 1" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="postal" className="block text-sm font-medium text-baby-text">Postnummer</label>
                <input id="postal" type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                  placeholder="0182" />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-baby-text">Poststed</label>
                <input id="city" type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                  placeholder="Oslo" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowAddressForm(false)}
                className="flex-1 rounded-full border border-gray-300 py-2 text-sm font-medium text-baby-text">
                Avbryt
              </button>
              <button type="submit" disabled={addressSaving}
                className="flex-1 rounded-full bg-baby-blue py-2 text-sm font-semibold text-white hover:bg-baby-blue-dark disabled:opacity-50">
                {addressSaving ? 'Lagrer...' : 'Lagre adresse'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address display + edit when set */}
      {hasAddress && !showAddressForm && (
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm">
          <div className="text-sm">
            <span className="text-baby-text-light">Leveringsadresse: </span>
            <span className="font-medium text-baby-text">{streetAddress}, {postalCode} {city}</span>
          </div>
          <button onClick={() => setShowAddressForm(true)} className="text-sm font-medium text-baby-blue hover:text-baby-blue-dark">
            Endre
          </button>
        </div>
      )}

      {/* Password change */}
      {!showPasswordForm && (
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-5 py-3 shadow-sm">
          <div className="text-sm">
            <span className="text-baby-text-light">Passord</span>
            {passwordSuccess && <span className="ml-2 text-baby-sage text-xs font-medium">{passwordSuccess}</span>}
          </div>
          <button onClick={() => { setShowPasswordForm(true); setPasswordSuccess(''); }} className="text-sm font-medium text-baby-blue hover:text-baby-blue-dark">
            Bytt passord
          </button>
        </div>
      )}

      {showPasswordForm && (
        <div className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-baby-text">Bytt passord</h2>
          {passwordError && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-600">{passwordError}</div>
          )}
          <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
            <div>
              <label htmlFor="currentPw" className="block text-sm font-medium text-baby-text">Nåværende passord</label>
              <input id="currentPw" type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue" />
            </div>
            <div>
              <label htmlFor="newPw" className="block text-sm font-medium text-baby-text">Nytt passord</label>
              <input id="newPw" type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                placeholder="Minst 6 tegn" />
            </div>
            <div>
              <label htmlFor="confirmPw" className="block text-sm font-medium text-baby-text">Bekreft nytt passord</label>
              <input id="confirmPw" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue" />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setShowPasswordForm(false); setPasswordError(''); }}
                className="flex-1 rounded-full border border-gray-300 py-2 text-sm font-medium text-baby-text">
                Avbryt
              </button>
              <button type="submit" disabled={passwordSaving}
                className="flex-1 rounded-full bg-baby-blue py-2 text-sm font-semibold text-white hover:bg-baby-blue-dark disabled:opacity-50">
                {passwordSaving ? 'Lagrer...' : 'Endre passord'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Summary card */}
      {activeSubscriptions.length > 0 && (
        <div className="mt-6 rounded-2xl bg-gradient-to-r from-baby-blue to-baby-blue-dark p-6 text-white shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-white/80">Aktive abonnementer</p>
              <p className="text-3xl font-bold">{activeSubscriptions.length}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-white/80">Totalt per måned</p>
              <p className="text-3xl font-bold">{totalMonthly} kr</p>
            </div>
          </div>
        </div>
      )}

      {/* Children and their subscriptions */}
      {children.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-white p-8 text-center shadow-sm">
          <p className="text-lg text-baby-text">Du har ikke registrert noen barn ennå.</p>
          <Link href="/onboarding" className="mt-4 inline-flex items-center rounded-full bg-baby-blue px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark">
            Kom i gang
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {children.map((child) => {
            const childSubs = activeSubscriptions.filter((s) => s.childId === child.id);
            // Phase-change detection: find base subscription and compare age categories
            const baseSub = childSubs.find((s) => s.packageType === 'base');

            return (
              <div key={child.id} className="rounded-2xl bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-baby-pink-light text-baby-pink">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-baby-text">{child.name}</h2>
                    {child.ageCategory && (
                      <p className="text-sm text-baby-text-light">
                        {child.ageCategory.label} ({child.ageCategory.minMonths}–{child.ageCategory.maxMonths} mnd)
                      </p>
                    )}
                  </div>
                </div>

                {/* Phase-change suggestion */}
                {child.ageCategory && baseSub && !baseSub.packageName.toLowerCase().includes(child.ageCategory.label.split(' ')[0].toLowerCase()) && (
                  <div className="mt-4 rounded-xl border border-baby-blue-light bg-baby-blue/5 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-medium text-baby-text">
                          {child.name} er nå i fasen {child.ageCategory.label}
                        </p>
                        <p className="text-sm text-baby-text-light">
                          Nåværende pakke: {baseSub.packageName}. Vil du velge produkter tilpasset ny fase?
                        </p>
                      </div>
                      <Link href="/pakker" className="shrink-0 rounded-full bg-baby-blue px-4 py-1.5 text-sm font-semibold text-white hover:bg-baby-blue-dark">
                        Velg nye produkter
                      </Link>
                    </div>
                  </div>
                )}

                {childSubs.length > 0 ? (
                  <div className="mt-4 space-y-3">
                    {childSubs.map((sub) => (
                      <Link key={sub.id} href={`/abonnement/${sub.id}`}
                        className="block rounded-xl bg-baby-cream p-4 transition-colors hover:bg-baby-warm">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-baby-text">{sub.packageName}</p>
                            <p className="text-xs text-baby-text-light">
                              Startet {new Date(sub.startedAt).toLocaleDateString('nb-NO')}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-baby-blue">{sub.monthlyPrice} kr/mnd</p>
                            <span className="inline-block rounded-full bg-baby-sage-light px-2 py-0.5 text-xs font-medium text-baby-sage">Aktiv</span>
                          </div>
                        </div>
                        {sub.products && sub.products.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {sub.products.map((p, i) => (
                              <span key={i} className="inline-block rounded-full bg-white px-2 py-0.5 text-xs text-baby-text-light">
                                {p}
                              </span>
                            ))}
                          </div>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-baby-text-light">Ingen aktive abonnementer for dette barnet.</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Orders section */}
      {orders.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-baby-text">Mine bestillinger</h2>
          <div className="mt-4 space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-baby-text">{order.packageName}</p>
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${orderStatusClasses(order.status)}`}>
                        {orderStatusLabel(order.status)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-baby-text-light">
                      Til {order.childName} &middot; {new Date(order.createdAt).toLocaleDateString('nb-NO')}
                    </p>
                    {order.trackingNumber && (
                      <p className="mt-1 text-sm text-baby-text-light">
                        Sporingsnr: <span className="font-medium text-baby-text">{order.trackingNumber}</span>
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-baby-text-light">
                    <p className="font-medium text-baby-text">Produkter:</p>
                    <ul className="mt-1 list-disc pl-4">
                      {order.products.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
