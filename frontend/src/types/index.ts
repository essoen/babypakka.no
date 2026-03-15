export interface AgeCategory {
  id: number;
  label: string;
  minMonths: number;
  maxMonths: number;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  condition: string;
}

export interface Package {
  id: number;
  name: string;
  description: string;
  type: 'base' | 'addon' | 'BASE' | 'ADDON';
  ageCategory: AgeCategory | null;
  monthlyPrice: number;
  challengeTag: string | null;
  products?: Product[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: string;
  streetAddress: string | null;
  postalCode: string | null;
  city: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Child {
  id: number;
  name: string;
  birthDate: string;
  ageCategory: AgeCategory | null;
  createdAt: string;
}

export interface Subscription {
  id: number;
  childId: number;
  childName: string;
  packageId: number | null;
  packageName: string;
  packageType: string;
  monthlyPrice: number;
  status: string;
  startedAt: string;
  endedAt: string | null;
  products: string[];
}

// Admin types
export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  childrenCount: number;
  activeSubscriptionCount: number;
  createdAt: string;
}

export interface AdminUserDetail {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  children: Child[];
  subscriptions: Subscription[];
}

export interface AdminStats {
  totalUsers: number;
  totalChildren: number;
  activeSubscriptions: number;
  totalProducts: number;
  totalPackages: number;
}

export interface Order {
  id: number;
  childName: string;
  packageName: string;
  status: string;
  trackingNumber: string | null;
  note: string | null;
  shippingAddress: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminOrder {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  childName: string;
  packageName: string;
  status: string;
  trackingNumber: string | null;
  note: string | null;
  shippingAddress: string;
  products: string[];
  createdAt: string;
  updatedAt: string;
}
