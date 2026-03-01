'use client';

import { useState, useEffect } from 'react';
import { Package, Product, AgeCategory } from '@/types';
import * as api from '@/lib/api';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [ageCategories, setAgeCategories] = useState<AgeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Package | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<'BASE' | 'ADDON'>('BASE');
  const [formAgeCategoryId, setFormAgeCategoryId] = useState<string>('');
  const [formMonthlyPrice, setFormMonthlyPrice] = useState('');
  const [formChallengeTag, setFormChallengeTag] = useState('');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Product assignment state
  const [assigningPackage, setAssigningPackage] = useState<Package | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
  const [savingProducts, setSavingProducts] = useState(false);

  async function loadData() {
    try {
      const [pkgs, prods, cats] = await Promise.all([
        api.getAdminPackages(),
        api.getAdminProducts(),
        api.getAgeCategories(),
      ]);
      setPackages(pkgs);
      setAllProducts(prods);
      setAgeCategories(cats);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function openCreateForm() {
    setEditingItem(null);
    setFormName('');
    setFormDescription('');
    setFormType('BASE');
    setFormAgeCategoryId('');
    setFormMonthlyPrice('');
    setFormChallengeTag('');
    setShowForm(true);
  }

  function openEditForm(pkg: Package) {
    setEditingItem(pkg);
    setFormName(pkg.name);
    setFormDescription(pkg.description || '');
    const normalizedType = pkg.type.toUpperCase() as 'BASE' | 'ADDON';
    setFormType(normalizedType);
    setFormAgeCategoryId(pkg.ageCategory?.id?.toString() || '');
    setFormMonthlyPrice(pkg.monthlyPrice.toString());
    setFormChallengeTag(pkg.challengeTag || '');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingItem(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const data = {
        name: formName,
        description: formDescription || undefined,
        type: formType,
        ageCategoryId: formType === 'BASE' && formAgeCategoryId ? Number(formAgeCategoryId) : undefined,
        monthlyPrice: Number(formMonthlyPrice),
        challengeTag: formType === 'ADDON' && formChallengeTag ? formChallengeTag : undefined,
      };
      if (editingItem) {
        await api.updatePackage(editingItem.id, data);
      } else {
        await api.createPackage(data);
      }
      closeForm();
      await loadData();
    } catch {
      // stay on form
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deletePackage(id);
      setDeletingId(null);
      await loadData();
    } catch {
      // ignore
    }
  }

  function openProductAssignment(pkg: Package) {
    setAssigningPackage(pkg);
    setSelectedProductIds(pkg.products?.map((p) => p.id) || []);
  }

  function toggleProduct(productId: number) {
    setSelectedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }

  async function handleSaveProducts() {
    if (!assigningPackage) return;
    setSavingProducts(true);
    try {
      await api.updatePackageProducts(assigningPackage.id, selectedProductIds);
      setAssigningPackage(null);
      await loadData();
    } catch {
      // ignore
    } finally {
      setSavingProducts(false);
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
        <p className="text-lg text-baby-text">Kunne ikke laste pakker.</p>
        <p className="mt-2 text-sm text-baby-text-light">Vennligst prøv igjen senere.</p>
      </div>
    );
  }

  const basePackages = packages.filter((p) => p.type === 'BASE' || p.type === 'base');
  const addonPackages = packages.filter((p) => p.type === 'ADDON' || p.type === 'addon');

  function renderPackageTable(pkgs: Package[], isBase: boolean) {
    if (pkgs.length === 0) {
      return (
        <div className="p-6 text-center text-baby-text-light">
          Ingen {isBase ? 'basispakker' : 'tilleggspakker'} funnet.
        </div>
      );
    }

    return (
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="px-4 py-3 font-medium text-baby-text-light">Navn</th>
            {isBase && (
              <th className="hidden px-4 py-3 font-medium text-baby-text-light sm:table-cell">Alderskategori</th>
            )}
            <th className="px-4 py-3 font-medium text-baby-text-light">Pris/mnd</th>
            <th className="hidden px-4 py-3 font-medium text-baby-text-light sm:table-cell">Produkter</th>
            {!isBase && (
              <th className="hidden px-4 py-3 font-medium text-baby-text-light md:table-cell">Utfordringstag</th>
            )}
            <th className="px-4 py-3 font-medium text-baby-text-light">Handlinger</th>
          </tr>
        </thead>
        <tbody>
          {pkgs.map((pkg) => (
            <tr key={pkg.id} className="border-b border-gray-50 last:border-0">
              <td className="px-4 py-3 font-medium text-baby-text">{pkg.name}</td>
              {isBase && (
                <td className="hidden px-4 py-3 text-baby-text-light sm:table-cell">
                  {pkg.ageCategory?.label || '—'}
                </td>
              )}
              <td className="px-4 py-3 text-baby-text">{pkg.monthlyPrice} kr</td>
              <td className="hidden px-4 py-3 text-baby-text-light sm:table-cell">
                {pkg.products?.length ?? 0} stk
              </td>
              {!isBase && (
                <td className="hidden px-4 py-3 text-baby-text-light md:table-cell">
                  {pkg.challengeTag || '—'}
                </td>
              )}
              <td className="px-4 py-3">
                {deletingId === pkg.id ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-red-600">Slett?</span>
                    <button
                      onClick={() => handleDelete(pkg.id)}
                      className="text-xs font-semibold text-red-600 hover:underline"
                    >
                      Ja
                    </button>
                    <button
                      onClick={() => setDeletingId(null)}
                      className="text-xs text-baby-text-light hover:underline"
                    >
                      Nei
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditForm(pkg)}
                      className="text-xs font-medium text-baby-blue hover:underline"
                    >
                      Rediger
                    </button>
                    <button
                      onClick={() => openProductAssignment(pkg)}
                      className="text-xs font-medium text-baby-sage hover:underline"
                    >
                      Produkter
                    </button>
                    <button
                      onClick={() => setDeletingId(pkg.id)}
                      className="text-xs font-medium text-red-500 hover:underline"
                    >
                      Slett
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-baby-text">Pakker</h1>
          <p className="mt-1 text-sm text-baby-text-light">Administrer basis- og tilleggspakker.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-full bg-baby-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
        >
          + Ny pakke
        </button>
      </div>

      {/* Package form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-baby-text">
              {editingItem ? 'Rediger pakke' : 'Ny pakke'}
            </h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-baby-text">Navn</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-baby-text">Beskrivelse</label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  rows={2}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-baby-text">Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as 'BASE' | 'ADDON')}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                >
                  <option value="BASE">Basispakke</option>
                  <option value="ADDON">Tilleggspakke</option>
                </select>
              </div>
              {formType === 'BASE' && (
                <div>
                  <label className="block text-sm font-medium text-baby-text">Alderskategori</label>
                  <select
                    value={formAgeCategoryId}
                    onChange={(e) => setFormAgeCategoryId(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                  >
                    <option value="">Velg alderskategori</option>
                    {ageCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label} ({cat.minMonths}–{cat.maxMonths} mnd)
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-baby-text">Pris per måned (kr)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="1"
                  value={formMonthlyPrice}
                  onChange={(e) => setFormMonthlyPrice(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                />
              </div>
              {formType === 'ADDON' && (
                <div>
                  <label className="block text-sm font-medium text-baby-text">Utfordringstag</label>
                  <input
                    type="text"
                    value={formChallengeTag}
                    onChange={(e) => setFormChallengeTag(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-baby-text transition-colors hover:bg-gray-50"
                >
                  Avbryt
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-full bg-baby-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark disabled:opacity-50"
                >
                  {saving ? 'Lagrer...' : editingItem ? 'Oppdater' : 'Opprett'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product assignment modal */}
      {assigningPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-baby-text">
              Produkter i &laquo;{assigningPackage.name}&raquo;
            </h2>
            <p className="mt-1 text-sm text-baby-text-light">
              Velg hvilke produkter som skal inkluderes i denne pakken.
            </p>
            <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
              {allProducts.length === 0 ? (
                <p className="text-sm text-baby-text-light">Ingen produkter tilgjengelig.</p>
              ) : (
                allProducts.map((product) => (
                  <label
                    key={product.id}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-100 p-3 transition-colors hover:bg-baby-cream"
                  >
                    <input
                      type="checkbox"
                      checked={selectedProductIds.includes(product.id)}
                      onChange={() => toggleProduct(product.id)}
                      className="h-4 w-4 rounded border-gray-300 text-baby-blue accent-baby-blue"
                    />
                    <div>
                      <p className="text-sm font-medium text-baby-text">{product.name}</p>
                      {product.description && (
                        <p className="text-xs text-baby-text-light">{product.description}</p>
                      )}
                    </div>
                  </label>
                ))
              )}
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAssigningPackage(null)}
                className="rounded-full border border-gray-200 px-5 py-2 text-sm font-medium text-baby-text transition-colors hover:bg-gray-50"
              >
                Avbryt
              </button>
              <button
                onClick={handleSaveProducts}
                disabled={savingProducts}
                className="rounded-full bg-baby-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark disabled:opacity-50"
              >
                {savingProducts ? 'Lagrer...' : 'Lagre produkter'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Base packages section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-baby-text">Basispakker</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl bg-white shadow-sm">
          {renderPackageTable(basePackages, true)}
        </div>
      </div>

      {/* Addon packages section */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-baby-text">Tilleggspakker</h2>
        <div className="mt-3 overflow-x-auto rounded-2xl bg-white shadow-sm">
          {renderPackageTable(addonPackages, false)}
        </div>
      </div>
    </div>
  );
}
