import { Kost, Booking, HeroBanner, FinancialTransaction, Promo, TenantRequest } from './types';

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('di_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  getKosts: async (options?: { compact?: boolean }): Promise<Kost[]> => {
    const url = options?.compact ? '/api/data/kosts?compact=true' : '/api/data/kosts';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to fetch kosts');
    const data = await res.json();
    return data;
  },

  getKostById: async (id: string): Promise<Kost> => {
    const res = await fetch(`/api/data/kosts/${id}`);
    if (!res.ok) throw new Error('Failed to fetch kost details');
    const data = await res.json();
    return data;
  },

  getBookedSlots: async (id: string): Promise<{ date: string; time: string }[]> => {
    const res = await fetch(`/api/data/kosts/${id}/booked-slots`);
    if (!res.ok) throw new Error('Failed to fetch booked slots');
    const data = await res.json();
    return data;
  },

  addKost: async (kost: Partial<Kost>): Promise<void> => {
    const res = await fetch('/api/data/kosts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(kost)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add kost');
    }
  },

  editKost: async (id: string, kost: Partial<Kost>): Promise<void> => {
    const res = await fetch(`/api/data/kosts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(kost)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to edit kost');
    }
  },

  getBookings: async (): Promise<Booking[]> => {
    const res = await fetch('/api/data/bookings', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch bookings');
    return await res.json();
  },

  createBooking: async (booking: Partial<Booking>): Promise<void> => {
    const res = await fetch('/api/data/bookings', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(booking)
    });
    if (!res.ok) throw new Error('Failed to create booking');
  },

  updateBookingStatus: async (bookingId: string, status: 'Disetujui' | 'Ditolak' | 'Penyewa'): Promise<void> => {
    const res = await fetch(`/api/data/bookings/${bookingId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) throw new Error('Failed to update status');
  },

  cancelBooking: async (bookingId: string): Promise<void> => {
    const res = await fetch(`/api/data/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.error || 'Failed to cancel booking');
    }
  },

  deleteKost: async (id: string): Promise<void> => {
    const res = await fetch(`/api/data/kosts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete kost');
    }
  },

  getBanners: async (): Promise<HeroBanner[]> => {
    const res = await fetch('/api/data/banners');
    if (!res.ok) throw new Error('Failed to fetch banners');
    return await res.json();
  },

  addBanner: async (banner: Partial<HeroBanner>): Promise<void> => {
    const res = await fetch('/api/data/banners', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(banner)
    });
    if (!res.ok) throw new Error('Failed to add banner');
  },

  editBanner: async (id: number, banner: Partial<HeroBanner>): Promise<void> => {
    const res = await fetch(`/api/data/banners/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(banner)
    });
    if (!res.ok) throw new Error('Failed to edit banner');
  },

  deleteBanner: async (id: number): Promise<void> => {
    const res = await fetch(`/api/data/banners/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to delete banner');
  },

  getTransactions: async (): Promise<FinancialTransaction[]> => {
    const res = await fetch('/api/data/transactions', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return await res.json();
  },

  addTransaction: async (tx: Partial<FinancialTransaction>): Promise<FinancialTransaction> => {
    const res = await fetch('/api/data/transactions', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(tx)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add transaction');
    }
    return await res.json();
  },

  editTransaction: async (id: number, tx: Partial<FinancialTransaction>): Promise<FinancialTransaction> => {
    const res = await fetch(`/api/data/transactions/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(tx)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to edit transaction');
    }
    return await res.json();
  },

  deleteTransaction: async (id: number): Promise<void> => {
    const res = await fetch(`/api/data/transactions/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete transaction');
    }
  },

  getPromos: async (): Promise<Promo[]> => {
    const res = await fetch('/api/data/promos', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch promos');
    return await res.json();
  },

  addPromo: async (promo: Partial<Promo>): Promise<void> => {
    const res = await fetch('/api/data/promos', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(promo)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to add promo');
    }
  },

  editPromo: async (id: number, promo: Partial<Promo>): Promise<void> => {
    const res = await fetch(`/api/data/promos/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(promo)
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to edit promo');
    }
  },

  deletePromo: async (id: number): Promise<void> => {
    const res = await fetch(`/api/data/promos/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to delete promo');
    }
  },

  getTenantRequests: async (): Promise<TenantRequest[]> => {
    const res = await fetch('/api/data/tenant-requests/owner', {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch tenant requests');
    return await res.json();
  },

  updateTenantRequestStatus: async (requestId: number, status: 'Approved' | 'Rejected'): Promise<void> => {
    const res = await fetch(`/api/data/tenant-requests/${requestId}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to update tenant request status');
    }
  }
};
