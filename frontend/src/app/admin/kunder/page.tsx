'use client';

import { useState, useEffect } from 'react';
import { AdminUser, AdminUserDetail } from '@/types';
import * as api from '@/lib/api';

function roleBadgeClasses(role: string): string {
  switch (role.toUpperCase()) {
    case 'ADMIN':
      return 'bg-purple-100 text-purple-700';
    case 'USER':
    default:
      return 'bg-baby-blue-light text-baby-blue-dark';
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Expanded user detail
  const [expandedUserId, setExpandedUserId] = useState<number | null>(null);
  const [userDetail, setUserDetail] = useState<AdminUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [roleUpdating, setRoleUpdating] = useState<number | null>(null);

  async function loadUsers() {
    try {
      const data = await api.getAdminUsers();
      setUsers(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleRoleChange(userId: number, newRole: string) {
    setRoleUpdating(userId);
    try {
      await api.updateUserRole(userId, newRole);
      await loadUsers();
    } catch {
      // ignore
    } finally {
      setRoleUpdating(null);
    }
  }

  async function toggleExpand(userId: number) {
    if (expandedUserId === userId) {
      setExpandedUserId(null);
      setUserDetail(null);
      return;
    }

    setExpandedUserId(userId);
    setUserDetail(null);
    setDetailLoading(true);
    try {
      const detail = await api.getAdminUser(userId);
      setUserDetail(detail);
    } catch {
      // ignore
    } finally {
      setDetailLoading(false);
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
        <p className="text-lg text-baby-text">Kunne ikke laste brukere.</p>
        <p className="mt-2 text-sm text-baby-text-light">Vennligst prøv igjen senere.</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold text-baby-text">Kunder</h1>
        <p className="mt-1 text-sm text-baby-text-light">Oversikt over alle registrerte brukere.</p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-sm">
        {users.length === 0 ? (
          <div className="p-8 text-center text-baby-text-light">
            Ingen brukere funnet.
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-4 py-3 font-medium text-baby-text-light">Navn</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light sm:table-cell">E-post</th>
                <th className="px-4 py-3 font-medium text-baby-text-light">Rolle</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light md:table-cell">Barn</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light md:table-cell">Aktive abo.</th>
                <th className="hidden px-4 py-3 font-medium text-baby-text-light lg:table-cell">Registrert</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <>
                  <tr
                    key={user.id}
                    onClick={() => toggleExpand(user.id)}
                    className="cursor-pointer border-b border-gray-50 transition-colors hover:bg-baby-cream last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-baby-text">
                      <div className="flex items-center gap-2">
                        <svg
                          className={`h-4 w-4 text-baby-text-light transition-transform ${
                            expandedUserId === user.id ? 'rotate-90' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                        {user.name}
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-baby-text-light sm:table-cell">{user.email}</td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={roleUpdating === user.id}
                        className={`rounded-full px-2 py-0.5 text-xs font-medium border-0 cursor-pointer ${roleBadgeClasses(user.role)} ${roleUpdating === user.id ? 'opacity-50' : ''}`}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    <td className="hidden px-4 py-3 text-baby-text-light md:table-cell">{user.childrenCount}</td>
                    <td className="hidden px-4 py-3 text-baby-text-light md:table-cell">
                      {user.activeSubscriptionCount}
                    </td>
                    <td className="hidden px-4 py-3 text-baby-text-light lg:table-cell">
                      {new Date(user.createdAt).toLocaleDateString('nb-NO')}
                    </td>
                  </tr>
                  {expandedUserId === user.id && (
                    <tr key={`detail-${user.id}`}>
                      <td colSpan={6} className="bg-baby-cream px-4 py-4">
                        {detailLoading ? (
                          <div className="animate-pulse space-y-2">
                            <div className="h-4 w-32 rounded bg-gray-200" />
                            <div className="h-16 rounded bg-gray-200" />
                          </div>
                        ) : userDetail ? (
                          <div className="grid gap-4 md:grid-cols-2">
                            {/* Children */}
                            <div>
                              <h3 className="text-sm font-semibold text-baby-text">
                                Barn ({userDetail.children.length})
                              </h3>
                              {userDetail.children.length === 0 ? (
                                <p className="mt-1 text-xs text-baby-text-light">Ingen barn registrert.</p>
                              ) : (
                                <ul className="mt-2 space-y-1">
                                  {userDetail.children.map((child) => (
                                    <li
                                      key={child.id}
                                      className="rounded-lg bg-white px-3 py-2 text-sm"
                                    >
                                      <span className="font-medium text-baby-text">{child.name}</span>
                                      {child.ageCategory && (
                                        <span className="ml-2 text-xs text-baby-text-light">
                                          {child.ageCategory.label}
                                        </span>
                                      )}
                                      <span className="ml-2 text-xs text-baby-text-light">
                                        Født: {new Date(child.birthDate).toLocaleDateString('nb-NO')}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>

                            {/* Subscriptions */}
                            <div>
                              <h3 className="text-sm font-semibold text-baby-text">
                                Abonnementer ({userDetail.subscriptions.length})
                              </h3>
                              {userDetail.subscriptions.length === 0 ? (
                                <p className="mt-1 text-xs text-baby-text-light">Ingen abonnementer.</p>
                              ) : (
                                <ul className="mt-2 space-y-1">
                                  {userDetail.subscriptions.map((sub) => (
                                    <li
                                      key={sub.id}
                                      className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm"
                                    >
                                      <div>
                                        <span className="font-medium text-baby-text">{sub.packageName}</span>
                                        <span className="ml-2 text-xs text-baby-text-light">
                                          {sub.monthlyPrice} kr/mnd
                                        </span>
                                      </div>
                                      <span
                                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                                          sub.status.toUpperCase() === 'ACTIVE'
                                            ? 'bg-baby-sage-light text-baby-sage'
                                            : sub.status.toUpperCase() === 'PAUSED'
                                              ? 'bg-baby-warm text-baby-warm-dark'
                                              : 'bg-red-100 text-red-600'
                                        }`}
                                      >
                                        {sub.status.toUpperCase() === 'ACTIVE'
                                          ? 'Aktiv'
                                          : sub.status.toUpperCase() === 'PAUSED'
                                            ? 'Pauset'
                                            : 'Kansellert'}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-baby-text-light">Kunne ikke laste brukerdetaljer.</p>
                        )}
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
