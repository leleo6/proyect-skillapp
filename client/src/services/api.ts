import { Product, Category, Store, User, AuditLog, GeneralStats } from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('actinvent_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data?.error?.message || `Error en la solicitud (${res.status})`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Products
  async getProducts(params: {
    search?: string;
    is_new?: number;
    category_id?: string;
    store_id?: string;
  } = {}): Promise<{ total: number; items: Product[] }> {
    const query = new URLSearchParams();
    if (params.search) query.set('search', params.search);
    if (params.is_new !== undefined) query.set('is_new', params.is_new.toString());
    if (params.category_id) query.set('category_id', params.category_id);
    if (params.store_id) query.set('store_id', params.store_id);

    const res = await fetch(`${API_BASE}/products?${query.toString()}`);
    return handleResponse(res);
  },

  async getProductById(id: string): Promise<{ product: Product }> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  async createProduct(data: {
    code: string;
    barcode?: string;
    name: string;
    description?: string;
    categoryId: string;
    isNew: boolean;
    price: number;
    unit: string;
    notes?: string;
    storeIds?: string[];
  }): Promise<{ product: Product }> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async updateProduct(id: string, data: Partial<{
    code: string;
    barcode?: string;
    name: string;
    description?: string;
    categoryId: string;
    isNew: boolean;
    price: number;
    unit: string;
    notes?: string;
    storeIds?: string[];
  }>): Promise<{ product: Product }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async toggleProductNew(id: string): Promise<{ product: Product }> {
    const res = await fetch(`${API_BASE}/products/${id}/toggle-new`, {
      method: 'PATCH',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async deleteProduct(id: string): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // Categories & Stores & Stats
  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await fetch(`${API_BASE}/products/categories`);
    return handleResponse(res);
  },

  async getStores(): Promise<{ stores: Store[] }> {
    const res = await fetch(`${API_BASE}/stores`);
    return handleResponse(res);
  },

  async getStats(): Promise<GeneralStats> {
    const res = await fetch(`${API_BASE}/products/stats`);
    return handleResponse(res);
  },

  async getAuditLogs(): Promise<{ logs: AuditLog[] }> {
    const res = await fetch(`${API_BASE}/audit`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};
