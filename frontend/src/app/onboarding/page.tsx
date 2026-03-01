'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Package, Child } from '@/types';
import * as api from '@/lib/api';

const STEPS = ['Legg til barn', 'Velg basispakke', 'Tilleggspakker', 'Bekreft'];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Address
  const [streetAddress, setStreetAddress] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');

  // Step 1: child info
  const [childName, setChildName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [createdChild, setCreatedChild] = useState<Child | null>(null);

  // Step 2: base packages
  const [basePackages, setBasePackages] = useState<Package[]>([]);
  const [selectedBasePackage, setSelectedBasePackage] = useState<Package | null>(null);

  // Step 3: addon packages
  const [addonPackages, setAddonPackages] = useState<Package[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Package[]>([]);

  // Redirect if not logged in, pre-fill address
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/logg-inn');
    }
    if (user) {
      setStreetAddress(user.streetAddress || '');
      setPostalCode(user.postalCode || '');
      setCity(user.city || '');
    }
  }, [authLoading, user, router]);

  // Step 1 → Step 2: Create child, then load packages
  async function handleChildSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const child = await api.createChild(childName, birthDate);
      setCreatedChild(child);

      // Load packages
      const allPackages = await api.getPackages();
      const base = allPackages.filter((p) => p.type.toUpperCase() === 'BASE');
      const addons = allPackages.filter((p) => p.type.toUpperCase() === 'ADDON');
      setBasePackages(base);
      setAddonPackages(addons);

      // Pre-select recommended package based on child's age category
      if (child.ageCategory) {
        const recommended = base.find(
          (p) => p.ageCategory?.id === child.ageCategory?.id
        );
        if (recommended) setSelectedBasePackage(recommended);
      }

      setStep(1);
    } catch {
      setError('Kunne ikke registrere barnet. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  // Step 2 → Step 3
  function handleBaseSelect() {
    if (!selectedBasePackage) {
      setError('Vennligst velg en basispakke.');
      return;
    }
    setError('');
    setStep(2);
  }

  // Step 3 → Step 4
  function handleAddonSelect() {
    setStep(3);
  }

  // Toggle addon
  function toggleAddon(pkg: Package) {
    setSelectedAddons((prev) =>
      prev.find((p) => p.id === pkg.id)
        ? prev.filter((p) => p.id !== pkg.id)
        : [...prev, pkg]
    );
  }

  // Step 4: Confirm and create subscriptions
  async function handleConfirm() {
    if (!createdChild || !selectedBasePackage) return;
    setError('');
    setLoading(true);

    try {
      // Save address if provided
      if (streetAddress && postalCode && city) {
        await api.updateAddress({ streetAddress, postalCode, city });
      }

      // Validate address is set
      if (!streetAddress || !postalCode || !city) {
        setError('Du må legge til en leveringsadresse før du kan bekrefte bestillingen.');
        setLoading(false);
        return;
      }

      await api.createSubscription(createdChild.id, selectedBasePackage.id);
      for (const addon of selectedAddons) {
        await api.createSubscription(createdChild.id, addon.id);
      }
      router.push('/dashboard');
    } catch {
      setError('Noe gikk galt. Sjekk at du har lagt til leveringsadresse og prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-baby-text-light">Laster...</p>
      </div>
    );
  }

  const totalPrice =
    (selectedBasePackage?.monthlyPrice || 0) +
    selectedAddons.reduce((sum, p) => sum + p.monthlyPrice, 0);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8">
      {/* Progress steps */}
      <div className="mb-10">
        <div className="flex items-center justify-between">
          {STEPS.map((label, i) => (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                  i <= step
                    ? 'bg-baby-blue text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i + 1}
              </div>
              <span className="mt-1 text-xs text-baby-text-light hidden sm:block">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex">
          {STEPS.slice(1).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded ${
                i < step ? 'bg-baby-blue' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
      )}

      {/* Step 1: Add child */}
      {step === 0 && (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-baby-text">Legg til barnet ditt</h1>
          <p className="mt-2 text-sm text-baby-text-light">
            Vi bruker fødselsdatoen til å finne riktig utstyrspakke.
          </p>

          <form onSubmit={handleChildSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="childName" className="block text-sm font-medium text-baby-text">
                Barnets navn
              </label>
              <input
                id="childName"
                type="text"
                required
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                placeholder="Lille Emma"
              />
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-baby-text">
                Fødselsdato
              </label>
              <input
                id="birthDate"
                type="date"
                required
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-baby-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark disabled:opacity-50"
            >
              {loading ? 'Registrerer...' : 'Neste'}
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Select base package */}
      {step === 1 && (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-baby-text">Velg basispakke</h1>
          {createdChild?.ageCategory && (
            <p className="mt-2 text-sm text-baby-text-light">
              Basert på {createdChild.name}s alder anbefaler vi pakken for fasen{' '}
              <strong>{createdChild.ageCategory.label}</strong> ({createdChild.ageCategory.minMonths}–{createdChild.ageCategory.maxMonths} mnd).
            </p>
          )}

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {basePackages.map((pkg) => {
              const isSelected = selectedBasePackage?.id === pkg.id;
              const isRecommended = pkg.ageCategory?.id === createdChild?.ageCategory?.id;
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => setSelectedBasePackage(pkg)}
                  className={`relative rounded-xl border-2 p-5 text-left transition-all ${
                    isSelected
                      ? 'border-baby-blue bg-baby-blue/5'
                      : 'border-gray-200 hover:border-baby-blue-light'
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-2.5 left-4 rounded-full bg-baby-sage px-2 py-0.5 text-xs font-medium text-white">
                      Anbefalt
                    </span>
                  )}
                  {pkg.ageCategory && (
                    <span className="text-xs font-medium text-baby-text-light">
                      {pkg.ageCategory.label} ({pkg.ageCategory.minMonths}–{pkg.ageCategory.maxMonths} mnd)
                    </span>
                  )}
                  <h3 className="mt-1 text-lg font-semibold text-baby-text">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-baby-text-light line-clamp-2">{pkg.description}</p>
                  <p className="mt-3 text-xl font-bold text-baby-blue">
                    {pkg.monthlyPrice} <span className="text-sm font-normal text-baby-text-light">kr/mnd</span>
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-medium text-baby-text transition-colors hover:bg-gray-50"
            >
              Tilbake
            </button>
            <button
              onClick={handleBaseSelect}
              className="flex-1 rounded-full bg-baby-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
            >
              Neste
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Select addon packages */}
      {step === 2 && (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-baby-text">Tilleggspakker</h1>
          <p className="mt-2 text-sm text-baby-text-light">
            Velg eventuelle tilleggspakker for ekstra behov. Du kan hoppe over dette steget.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {addonPackages.map((pkg) => {
              const isSelected = selectedAddons.some((p) => p.id === pkg.id);
              return (
                <button
                  key={pkg.id}
                  type="button"
                  onClick={() => toggleAddon(pkg)}
                  className={`rounded-xl border-2 p-5 text-left transition-all ${
                    isSelected
                      ? 'border-baby-sage bg-baby-sage-light/20'
                      : 'border-gray-200 hover:border-baby-sage-light'
                  }`}
                >
                  {pkg.challengeTag && (
                    <span className="inline-block rounded-full bg-baby-sage-light/50 px-2 py-0.5 text-xs font-medium text-baby-sage">
                      {pkg.challengeTag}
                    </span>
                  )}
                  <h3 className="mt-1 text-lg font-semibold text-baby-text">{pkg.name}</h3>
                  <p className="mt-1 text-sm text-baby-text-light line-clamp-2">{pkg.description}</p>
                  <p className="mt-3 text-xl font-bold text-baby-blue">
                    {pkg.monthlyPrice} <span className="text-sm font-normal text-baby-text-light">kr/mnd</span>
                  </p>
                </button>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-medium text-baby-text transition-colors hover:bg-gray-50"
            >
              Tilbake
            </button>
            <button
              onClick={handleAddonSelect}
              className="flex-1 rounded-full bg-baby-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
            >
              {selectedAddons.length > 0 ? 'Neste' : 'Hopp over'}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 3 && (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-baby-text">Bekreft bestilling</h1>
          <p className="mt-2 text-sm text-baby-text-light">
            Se over dine valg før du bekrefter.
          </p>

          <div className="mt-6 space-y-4">
            {/* Child summary */}
            <div className="rounded-xl bg-baby-cream p-4">
              <p className="text-sm font-medium text-baby-text-light">Barn</p>
              <p className="text-lg font-semibold text-baby-text">{createdChild?.name}</p>
              {createdChild?.ageCategory && (
                <p className="text-sm text-baby-text-light">
                  Fase: {createdChild.ageCategory.label} ({createdChild.ageCategory.minMonths}–{createdChild.ageCategory.maxMonths} mnd)
                </p>
              )}
            </div>

            {/* Address */}
            <div className="rounded-xl bg-white border border-gray-200 p-4">
              <p className="text-sm font-medium text-baby-text-light">Leveringsadresse</p>
              {user?.streetAddress && user?.postalCode && user?.city ? (
                <p className="mt-1 font-medium text-baby-text">{user.streetAddress}, {user.postalCode} {user.city}</p>
              ) : (
                <div className="mt-2 space-y-2">
                  <input type="text" required value={streetAddress} onChange={(e) => setStreetAddress(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                    placeholder="Gateadresse" />
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" required value={postalCode} onChange={(e) => setPostalCode(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                      placeholder="Postnummer" />
                    <input type="text" required value={city} onChange={(e) => setCity(e.target.value)}
                      className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                      placeholder="Poststed" />
                  </div>
                </div>
              )}
            </div>

            {/* Base package */}
            {selectedBasePackage && (
              <div className="rounded-xl border border-baby-blue-light bg-baby-blue/5 p-4">
                <p className="text-sm font-medium text-baby-text-light">Basispakke</p>
                <p className="text-lg font-semibold text-baby-text">{selectedBasePackage.name}</p>
                <p className="text-sm font-bold text-baby-blue">{selectedBasePackage.monthlyPrice} kr/mnd</p>
              </div>
            )}

            {/* Addons */}
            {selectedAddons.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-baby-text-light">Tilleggspakker</p>
                {selectedAddons.map((addon) => (
                  <div key={addon.id} className="rounded-xl border border-baby-sage-light bg-baby-sage-light/10 p-4">
                    <p className="font-semibold text-baby-text">{addon.name}</p>
                    <p className="text-sm font-bold text-baby-blue">{addon.monthlyPrice} kr/mnd</p>
                  </div>
                ))}
              </div>
            )}

            {/* Total */}
            <div className="rounded-xl bg-baby-warm p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-baby-text">Totalt per måned</span>
                <span className="text-2xl font-bold text-baby-blue">{totalPrice} kr</span>
              </div>
              <p className="mt-1 text-xs text-baby-text-light">Ingen bindingstid. Kanseller når som helst.</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-medium text-baby-text transition-colors hover:bg-gray-50"
            >
              Tilbake
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading}
              className="flex-1 rounded-full bg-baby-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark disabled:opacity-50"
            >
              {loading ? 'Bekrefter...' : 'Bekreft bestilling'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
