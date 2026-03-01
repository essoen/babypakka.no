'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import * as api from '@/lib/api';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Product | null>(null);
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formCondition, setFormCondition] = useState('NEW');
  const [saving, setSaving] = useState(false);

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null);

  async function loadProducts() {
    try {
      const data = await api.getAdminProducts();
      setProducts(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  function openCreateForm() {
    setEditingItem(null);
    setFormName('');
    setFormDescription('');
    setFormImageUrl('');
    setFormCondition('NEW');
    setShowForm(true);
  }

  function openEditForm(product: Product) {
    setEditingItem(product);
    setFormName(product.name);
    setFormDescription(product.description || '');
    setFormImageUrl(product.imageUrl || '');
    setFormCondition(product.condition || 'NEW');
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
        imageUrl: formImageUrl || undefined,
        condition: formCondition,
      };
      if (editingItem) {
        await api.updateProduct(editingItem.id, data);
      } else {
        await api.createProduct(data);
      }
      closeForm();
      await loadProducts();
    } catch {
      // stay on form
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await api.deleteProduct(id);
      setDeletingId(null);
      await loadProducts();
    } catch {
      // ignore
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
        <p className="text-lg text-baby-text">Kunne ikke laste produkter.</p>
        <p className="mt-2 text-sm text-baby-text-light">Vennligst prøv igjen senere.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-baby-text">Produkter</h1>
          <p className="mt-1 text-sm text-baby-text-light">Administrer produkter i Babypakka.</p>
        </div>
        <button
          onClick={openCreateForm}
          className="inline-flex items-center justify-center rounded-full bg-baby-blue px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-baby-blue-dark"
        >
          + Nytt produkt
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-bold text-baby-text">
              {editingItem ? 'Rediger produkt' : 'Nytt produkt'}
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
                  rows={3}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-baby-text">Bilde-URL</label>
                <input
                  type="text"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-baby-text">Tilstand</label>
                <select
                  value={formCondition}
                  onChange={(e) => setFormCondition(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                >
                  <option value="NEW">Ny</option>
                  <option value="USED">Brukt</option>
                </select>
              </div>
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

      {/* Products table */}
      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        {products.length === 0 ? (
          <div className="p-8 text-center text-baby-text-light">
            Ingen produkter funnet. Opprett det første produktet!
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 font-medium text-baby-text-light">Navn</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light sm:table-cell">Beskrivelse</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Tilstand</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light md:table-cell">Bilde</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Handlinger</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-gray-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-baby-text">{product.name}</td>
                  <td className="hidden max-w-xs truncate px-4 py-3 text-baby-text-light sm:table-cell">
                    {product.description || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        product.condition === 'NEW'
                          ? 'bg-baby-sage-light text-baby-sage'
                          : 'bg-baby-warm text-baby-warm-dark'
                      }`}
                    >
                      {product.condition === 'NEW' ? 'Ny' : 'Brukt'}
                    </span>
                  </td>
                  <td className="hidden max-w-[120px] truncate px-4 py-3 text-xs text-baby-text-light md:table-cell">
                    {product.imageUrl || '—'}
                  </td>
                  <td className="px-4 py-3">
                    {deletingId === product.id ? (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-red-600">Slett?</span>
                        <button
                          onClick={() => handleDelete(product.id)}
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
                          onClick={() => openEditForm(product)}
                          className="text-xs font-medium text-baby-blue hover:underline"
                        >
                          Rediger
                        </button>
                        <button
                          onClick={() => setDeletingId(product.id)}
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
        )}
      </div>
    </div>
  );
}
