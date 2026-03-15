'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Package, Product, Child, AgeCategory } from '@/types';
import * as api from '@/lib/api';

const STEPS = ['Legg til barn', 'Velg produkter', 'Bekreft'];

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

  // Step 2: product selection
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([]);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<AgeCategory | null>(null);
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [basePackages, setBasePackages] = useState<Package[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [monthlyPrice, setMonthlyPrice] = useState(0);

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

  // Load products when age category changes
  useEffect(() => {
    if (!selectedAgeCategory) return;
    setLoadingProducts(true);
    api.getProducts(selectedAgeCategory.id)
      .then((products) => {
        setAvailableProducts(products);
        // Clear selections when switching category
        setSelectedProducts([]);
      })
      .catch(() => setError('Kunne ikke hente produkter.'))
      .finally(() => setLoadingProducts(false));

    // Find price for this age category
    const basePkg = basePackages.find(
      (p) => p.ageCategory?.id === selectedAgeCategory.id
    );
    setMonthlyPrice(basePkg?.monthlyPrice ?? 0);
  }, [selectedAgeCategory, basePackages]);

  // Step 1 -> Step 2: Create child, then load age categories + packages
  async function handleChildSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const child = await api.createChild(childName, birthDate);
      setCreatedChild(child);

      // Load age categories and packages for pricing
      const [categories, allPackages] = await Promise.all([
        api.getAgeCategories(),
        api.getPackages(),
      ]);
      setAgeCategories(categories);
      const base = allPackages.filter((p) => p.type.toUpperCase() === 'BASE');
      setBasePackages(base);

      // Pre-select recommended age category based on child
      if (child.ageCategory) {
        const recommended = categories.find((c) => c.id === child.ageCategory?.id);
        if (recommended) setSelectedAgeCategory(recommended);
      }

      setStep(1);
    } catch {
      setError('Kunne ikke registrere barnet. Vennligst prøv igjen.');
    } finally {
      setLoading(false);
    }
  }

  // Toggle product selection
  function toggleProduct(product: Product) {
    setSelectedProducts((prev) =>
      prev.find((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  }

  // Step 2 -> Step 3
  function handleProductsSelect() {
    if (selectedProducts.length === 0) {
      setError('Du må velge minst ett produkt.');
      return;
    }
    if (!selectedAgeCategory) {
      setError('Du må velge en alderskategori.');
      return;
    }
    setError('');
    setStep(2);
  }

  // Step 3: Confirm and create subscription
  async function handleConfirm() {
    if (!createdChild || !selectedAgeCategory || selectedProducts.length === 0) return;
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

      const productIds = selectedProducts.map((p) => p.id);
      await api.createSubscription(createdChild.id, selectedAgeCategory.id, productIds);
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
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
            Vi bruker fødselsdatoen til å foreslå riktige produkter for barnets alder.
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

      {/* Step 2: Select products */}
      {step === 1 && (
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-baby-text">Velg dine produkter</h1>
          <p className="mt-2 text-sm text-baby-text-light">
            Velg alderskategori og plukk de produktene du vil ha. Fast månedspris uansett antall.
          </p>

          {/* Age category selector */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-baby-text mb-2">Alderskategori</label>
            <div className="flex flex-wrap gap-2">
              {ageCategories.map((cat) => {
                const isSelected = selectedAgeCategory?.id === cat.id;
                const isRecommended = cat.id === createdChild?.ageCategory?.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedAgeCategory(cat)}
                    className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      isSelected
                        ? 'bg-baby-blue text-white'
                        : 'bg-baby-cream text-baby-text hover:bg-baby-warm'
                    }`}
                  >
                    {isRecommended && (
                      <span className="absolute -top-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-baby-sage text-[8px] text-white font-bold">
                        ★
                      </span>
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>
            {createdChild?.ageCategory && (
              <p className="mt-2 text-xs text-baby-text-light">
                ★ Anbefalt for {createdChild.name} basert på alder
              </p>
            )}
          </div>

          {/* Price display */}
          {selectedAgeCategory && monthlyPrice > 0 && (
            <div className="mt-4 rounded-xl bg-baby-blue/5 border border-baby-blue-light p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-baby-text">
                    {selectedAgeCategory.label}
                  </p>
                  <p className="text-xs text-baby-text-light">
                    {selectedAgeCategory.minMonths}–{selectedAgeCategory.maxMonths} mnd
                  </p>
                </div>
                <p className="text-2xl font-bold text-baby-blue">
                  {monthlyPrice} <span className="text-sm font-normal text-baby-text-light">kr/mnd</span>
                </p>
              </div>
            </div>
          )}

          {/* Products grid */}
          {loadingProducts ? (
            <div className="mt-6 text-center text-baby-text-light">Henter produkter...</div>
          ) : selectedAgeCategory && availableProducts.length > 0 ? (
            <div className="mt-6">
              <p className="text-sm font-medium text-baby-text mb-3">
                Velg produkter ({selectedProducts.length} valgt)
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {availableProducts.map((product) => {
                  const isSelected = selectedProducts.some((p) => p.id === product.id);
                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => toggleProduct(product)}
                      className={`flex items-start gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                        isSelected
                          ? 'border-baby-blue bg-baby-blue/5'
                          : 'border-gray-200 hover:border-baby-blue-light'
                      }`}
                    >
                      {/* Checkbox */}
                      <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                        isSelected ? 'border-baby-blue bg-baby-blue' : 'border-gray-300'
                      }`}>
                        {isSelected && (
                          <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-baby-text text-sm">{product.name}</p>
                        <p className="mt-0.5 text-xs text-baby-text-light line-clamp-2">{product.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : selectedAgeCategory ? (
            <p className="mt-6 text-baby-text-light">Ingen produkter tilgjengelige for denne fasen.</p>
          ) : null}

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(0)}
              className="flex-1 rounded-full border border-gray-300 py-2.5 text-sm font-medium text-baby-text transition-colors hover:bg-gray-50"
            >
              Tilbake
            </button>
            <button
              onClick={handleProductsSelect}
              disabled={selectedProducts.length === 0}
              className="flex-1 rounded-full bg-baby-blue py-2.5 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark disabled:opacity-50"
            >
              Neste ({selectedProducts.length} valgt)
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 2 && (
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

            {/* Age category */}
            {selectedAgeCategory && (
              <div className="rounded-xl border border-baby-blue-light bg-baby-blue/5 p-4">
                <p className="text-sm font-medium text-baby-text-light">Alderskategori</p>
                <p className="text-lg font-semibold text-baby-text">{selectedAgeCategory.label}</p>
                <p className="text-sm text-baby-text-light">
                  {selectedAgeCategory.minMonths}–{selectedAgeCategory.maxMonths} mnd
                </p>
              </div>
            )}

            {/* Selected products */}
            <div>
              <p className="text-sm font-medium text-baby-text-light mb-2">Valgte produkter ({selectedProducts.length})</p>
              <div className="space-y-2">
                {selectedProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-3 rounded-xl border border-gray-200 p-3">
                    <svg className="h-5 w-5 shrink-0 text-baby-sage" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <div>
                      <p className="font-medium text-baby-text text-sm">{product.name}</p>
                      <p className="text-xs text-baby-text-light">{product.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="rounded-xl bg-baby-warm p-4">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-baby-text">Totalt per måned</span>
                <span className="text-2xl font-bold text-baby-blue">{monthlyPrice} kr</span>
              </div>
              <p className="mt-1 text-xs text-baby-text-light">Ingen bindingstid. Kanseller når som helst.</p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={() => setStep(1)}
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
