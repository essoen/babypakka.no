import { Package, Product, AgeCategory, AuthResponse, User, Child, Subscription, AdminUser, AdminUserDetail, AdminStats, Order, AdminOrder } from '@/types';

// Server-side env var (runtime) takes priority over build-time NEXT_PUBLIC_ var
const API_BASE = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Client-side API base (for 'use client' components that can't access server env vars)
const CLIENT_API_BASE = typeof window !== 'undefined'
  ? (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')
  : API_BASE;

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};
  const token = localStorage.getItem('babypakka_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Server-side fetch with ISR (for server components — no auth)
async function fetchApi<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`API-feil: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

// Client-side fetch with auth (for 'use client' components)
async function fetchAuthApi<T>(path: string): Promise<T> {
  const res = await fetch(`${CLIENT_API_BASE}${path}`, {
    headers: {
      ...getAuthHeaders(),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API-feil: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

async function postApi<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${CLIENT_API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(errorText || `API-feil: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

async function putApi<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${CLIENT_API_BASE}${path}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API-feil: ${res.status} ${res.statusText}`);
  }

  return res.json() as Promise<T>;
}

async function deleteApi(path: string): Promise<void> {
  const res = await fetch(`${CLIENT_API_BASE}${path}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeaders(),
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`API-feil: ${res.status} ${res.statusText}`);
  }
}

// ---- Public API (server components, anonymous) ----

export async function getPackages(
  type?: 'BASE' | 'ADDON',
  ageCategoryId?: number
): Promise<Package[]> {
  const params = new URLSearchParams();
  if (type) params.set('type', type);
  if (ageCategoryId) params.set('ageCategoryId', String(ageCategoryId));
  const query = params.toString();
  return fetchApi<Package[]>(`/api/packages${query ? `?${query}` : ''}`);
}

export async function getPackage(id: number): Promise<Package> {
  return fetchApi<Package>(`/api/packages/${id}`);
}

export async function getProducts(ageCategoryId?: number): Promise<Product[]> {
  const params = new URLSearchParams();
  if (ageCategoryId) params.set('ageCategoryId', String(ageCategoryId));
  const query = params.toString();
  return fetchApi<Product[]>(`/api/products${query ? `?${query}` : ''}`);
}

export async function getProduct(id: number): Promise<Product> {
  return fetchApi<Product>(`/api/products/${id}`);
}

export async function getAgeCategories(): Promise<AgeCategory[]> {
  return fetchApi<AgeCategory[]>('/api/age-categories');
}

// ---- Auth API (client components) ----

export async function login(email: string, password: string): Promise<AuthResponse> {
  return postApi<AuthResponse>('/api/auth/login', { email, password });
}

export async function register(email: string, password: string, name: string): Promise<AuthResponse> {
  return postApi<AuthResponse>('/api/auth/register', { email, password, name });
}

export async function getCurrentUser(): Promise<User> {
  return fetchAuthApi<User>('/api/users/me');
}

// ---- Children API (client components) ----

export async function getChildren(): Promise<Child[]> {
  return fetchAuthApi<Child[]>('/api/children');
}

export async function getChild(id: number): Promise<Child> {
  return fetchAuthApi<Child>(`/api/children/${id}`);
}

export async function createChild(name: string, birthDate: string): Promise<Child> {
  return postApi<Child>('/api/children', { name, birthDate });
}

export async function updateChild(id: number, name: string, birthDate: string): Promise<Child> {
  return putApi<Child>(`/api/children/${id}`, { name, birthDate });
}

export async function deleteChild(id: number): Promise<void> {
  return deleteApi(`/api/children/${id}`);
}

// ---- Subscriptions API (client components) ----

export async function getSubscriptions(): Promise<Subscription[]> {
  return fetchAuthApi<Subscription[]>('/api/subscriptions');
}

export async function getSubscription(id: number): Promise<Subscription> {
  return fetchAuthApi<Subscription>(`/api/subscriptions/${id}`);
}

export async function createSubscription(childId: number, packageId: number): Promise<Subscription> {
  return postApi<Subscription>('/api/subscriptions', { childId, packageId });
}

export async function cancelSubscription(id: number): Promise<Subscription> {
  return putApi<Subscription>(`/api/subscriptions/${id}/cancel`);
}

// ---- Address API (client components) ----

export async function updateAddress(data: { streetAddress: string; postalCode: string; city: string }): Promise<User> {
  return putApi<User>('/api/users/me/address', data);
}

export async function changePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
  const res = await fetch(`${CLIENT_API_BASE}/api/users/me/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
    cache: 'no-store',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || `API-feil: ${res.status} ${res.statusText}`);
  }
}

// ---- Orders API (client components) ----

export async function getOrders(): Promise<Order[]> {
  return fetchAuthApi<Order[]>('/api/orders');
}

// ---- Admin API (client components, requires ADMIN role) ----

export async function getAdminStats(): Promise<AdminStats> {
  return fetchAuthApi<AdminStats>('/api/admin/stats');
}

// Admin Products
export async function getAdminProducts(): Promise<Product[]> {
  return fetchAuthApi<Product[]>('/api/admin/products');
}

export async function createProduct(data: { name: string; description?: string; imageUrl?: string; condition: string }): Promise<Product> {
  return postApi<Product>('/api/admin/products', data);
}

export async function updateProduct(id: number, data: { name: string; description?: string; imageUrl?: string; condition: string }): Promise<Product> {
  return putApi<Product>(`/api/admin/products/${id}`, data);
}

export async function deleteProduct(id: number): Promise<void> {
  return deleteApi(`/api/admin/products/${id}`);
}

// Admin Packages
export async function getAdminPackages(): Promise<Package[]> {
  return fetchAuthApi<Package[]>('/api/admin/packages');
}

export async function createPackage(data: { name: string; description?: string; type: string; ageCategoryId?: number; monthlyPrice: number; challengeTag?: string }): Promise<Package> {
  return postApi<Package>('/api/admin/packages', data);
}

export async function updatePackage(id: number, data: { name: string; description?: string; type: string; ageCategoryId?: number; monthlyPrice: number; challengeTag?: string }): Promise<Package> {
  return putApi<Package>(`/api/admin/packages/${id}`, data);
}

export async function deletePackage(id: number): Promise<void> {
  return deleteApi(`/api/admin/packages/${id}`);
}

export async function updatePackageProducts(id: number, productIds: number[]): Promise<Package> {
  return putApi<Package>(`/api/admin/packages/${id}/products`, { productIds });
}

// Admin Subscriptions
export async function getAdminSubscriptions(status?: string): Promise<Subscription[]> {
  const params = status ? `?status=${status}` : '';
  return fetchAuthApi<Subscription[]>(`/api/admin/subscriptions${params}`);
}

export async function updateSubscriptionStatus(id: number, status: string): Promise<Subscription> {
  return putApi<Subscription>(`/api/admin/subscriptions/${id}/status`, { status });
}

// Admin Users
export async function getAdminUsers(): Promise<AdminUser[]> {
  return fetchAuthApi<AdminUser[]>('/api/admin/users');
}

export async function getAdminUser(id: number): Promise<AdminUserDetail> {
  return fetchAuthApi<AdminUserDetail>(`/api/admin/users/${id}`);
}

export async function updateUserRole(id: number, role: string): Promise<User> {
  return putApi<User>(`/api/admin/users/${id}/role`, { role });
}

// Admin Orders
export async function getAdminOrders(status?: string): Promise<AdminOrder[]> {
  const params = status ? `?status=${status}` : '';
  return fetchAuthApi<AdminOrder[]>(`/api/admin/orders${params}`);
}

export async function updateOrderStatus(id: number, data: { status: string; trackingNumber?: string; note?: string }): Promise<AdminOrder> {
  return putApi<AdminOrder>(`/api/admin/orders/${id}/status`, data);
}
