'use client';

import { useState, useEffect, Fragment } from 'react';
import { AdminOrder } from '@/types';
import * as api from '@/lib/api';

const STATUS_TABS = [
  { value: '', label: 'Alle' },
  { value: 'PENDING', label: 'Ventende' },
  { value: 'PACKING', label: 'Pakkes' },
  { value: 'SHIPPED', label: 'Sendt' },
  { value: 'DELIVERED', label: 'Levert' },
];

function statusBadgeClasses(status: string): string {
  switch (status) {
    case 'PENDING': return 'bg-baby-warm text-baby-warm-dark';
    case 'PACKING': return 'bg-baby-blue-light text-baby-blue-dark';
    case 'SHIPPED': return 'bg-baby-sage-light text-baby-sage';
    case 'DELIVERED': return 'bg-gray-200 text-gray-600';
    default: return 'bg-gray-200 text-gray-600';
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  // Tracking/note form for expanded order
  const [trackingInput, setTrackingInput] = useState('');
  const [noteInput, setNoteInput] = useState('');

  async function loadOrders(status?: string) {
    setLoading(true);
    try {
      const data = await api.getAdminOrders(status || undefined);
      setOrders(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders(statusFilter);
  }, [statusFilter]);

  function handleExpand(order: AdminOrder) {
    if (expandedId === order.id) {
      setExpandedId(null);
      return;
    }
    setExpandedId(order.id);
    setTrackingInput(order.trackingNumber || '');
    setNoteInput(order.note || '');
  }

  async function handleStatusChange(orderId: number, newStatus: string) {
    setUpdatingId(orderId);
    try {
      const data: { status: string; trackingNumber?: string; note?: string } = { status: newStatus };
      if (trackingInput) data.trackingNumber = trackingInput;
      if (noteInput) data.note = noteInput;
      await api.updateOrderStatus(orderId, data);
      await loadOrders(statusFilter);
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleSaveDetails(orderId: number) {
    setUpdatingId(orderId);
    const order = orders.find((o) => o.id === orderId);
    if (!order) return;
    try {
      await api.updateOrderStatus(orderId, {
        status: order.status,
        trackingNumber: trackingInput || undefined,
        note: noteInput || undefined,
      });
      await loadOrders(statusFilter);
    } catch {
      // ignore
    } finally {
      setUpdatingId(null);
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl bg-baby-warm p-8 text-center">
        <p className="text-lg text-baby-text">Kunne ikke laste ordrer.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-baby-text">Ordrer</h1>
      <p className="mt-1 text-sm text-baby-text-light">Administrer utsendelser og ordrestatus.</p>

      {/* Status filter tabs */}
      <div className="mt-6 flex gap-2 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-baby-blue text-white'
                : 'bg-white text-baby-text hover:bg-baby-warm'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders table */}
      <div className="mt-4 overflow-x-auto rounded-2xl bg-white shadow-sm">
        {loading ? (
          <div className="animate-pulse p-8 space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="h-12 rounded bg-gray-200" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-baby-text-light">Ingen ordrer funnet.</div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 font-medium text-baby-text-light">#</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Kunde</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light sm:table-cell">Barn</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Pakke</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light md:table-cell">Adresse</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Status</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light lg:table-cell">Opprettet</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <Fragment key={order.id}>
                  <tr
                    onClick={() => handleExpand(order)}
                    className="cursor-pointer border-b border-gray-50 transition-colors hover:bg-baby-cream last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-baby-text-light">
                      <div className="flex items-center gap-1">
                        <svg className={`h-4 w-4 text-baby-text-light transition-transform ${expandedId === order.id ? 'rotate-90' : ''}`}
                          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        {order.id}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-baby-text">{order.userName}</p>
                      <p className="text-xs text-baby-text-light">{order.userEmail}</p>
                    </td>
                    <td className="hidden px-4 py-3 text-baby-text sm:table-cell">{order.childName}</td>
                    <td className="px-4 py-3 text-baby-text">{order.packageName}</td>
                    <td className="hidden px-4 py-3 text-baby-text-light md:table-cell max-w-[200px] truncate">{order.shippingAddress}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updatingId === order.id}
                        className={`rounded-full border-0 px-2 py-0.5 text-xs font-medium cursor-pointer ${statusBadgeClasses(order.status)} ${updatingId === order.id ? 'opacity-50' : ''}`}
                      >
                        <option value="PENDING">Ventende</option>
                        <option value="PACKING">Pakkes</option>
                        <option value="SHIPPED">Sendt</option>
                        <option value="DELIVERED">Levert</option>
                      </select>
                    </td>
                    <td className="hidden px-4 py-3 text-baby-text-light lg:table-cell">
                      {new Date(order.createdAt).toLocaleDateString('nb-NO')}
                    </td>
                  </tr>
                  {expandedId === order.id && (
                    <tr key={`detail-${order.id}`}>
                      <td colSpan={7} className="bg-baby-cream px-4 py-4">
                        <div className="grid gap-4 md:grid-cols-3">
                          {/* Products */}
                          <div>
                            <h3 className="text-sm font-semibold text-baby-text">Produkter ({order.products.length})</h3>
                            <ul className="mt-2 space-y-1">
                              {order.products.map((p, i) => (
                                <li key={i} className="rounded-lg bg-white px-3 py-1.5 text-sm text-baby-text">{p}</li>
                              ))}
                            </ul>
                          </div>

                          {/* Tracking + Note */}
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-baby-text">Sporingsnummer</label>
                              <input
                                type="text"
                                value={trackingInput}
                                onChange={(e) => setTrackingInput(e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                                placeholder="f.eks. POSTEN123456"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-baby-text">Notat</label>
                              <textarea
                                value={noteInput}
                                onChange={(e) => setNoteInput(e.target.value)}
                                rows={2}
                                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-baby-blue focus:outline-none focus:ring-1 focus:ring-baby-blue"
                                placeholder="Internt notat..."
                              />
                            </div>
                            <button
                              onClick={() => handleSaveDetails(order.id)}
                              disabled={updatingId === order.id}
                              className="rounded-full bg-baby-blue px-4 py-1.5 text-sm font-medium text-white hover:bg-baby-blue-dark disabled:opacity-50"
                            >
                              {updatingId === order.id ? 'Lagrer...' : 'Lagre detaljer'}
                            </button>
                          </div>

                          {/* Address + info */}
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-sm font-semibold text-baby-text">Leveringsadresse</h3>
                              <p className="mt-1 whitespace-pre-line rounded-lg bg-white px-3 py-2 text-sm text-baby-text">
                                {order.shippingAddress}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-baby-text">Sist oppdatert</h3>
                              <p className="mt-1 text-sm text-baby-text-light">
                                {new Date(order.updatedAt).toLocaleString('nb-NO')}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
