export interface StoreBrief {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Store {
  id: string;
  code: string;
  name: string;
  city: string;
  country: string;
  isActive: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount?: number;
  newProductCount?: number;
}

export interface Product {
  id: string;
  code: string;
  barcode: string | null;
  name: string;
  description: string | null;
  categoryId: string;
  categoryName: string;
  categoryIcon: string;
  isNew: number; // 1 = nuevo, 0 = actual
  price: number;
  unit: string;
  status: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  stores: StoreBrief[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'cajero';
  storeId?: string | null;
  storeName?: string | null;
}

export interface AuditLog {
  id: string;
  userId: string | null;
  userName: string | null;
  action: string;
  entity: string;
  entityId: string | null;
  details: string | null;
  ip: string | null;
  createdAt: string;
}

export interface GeneralStats {
  totalProducts: number;
  newProducts: number;
  currentProducts: number;
  totalStores: number;
  totalCategories: number;
}
