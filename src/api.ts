import { Kost, Booking, HeroBanner } from './types';

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

  addKost: async (kost: Partial<Kost>): Promise<void> => {
    const res = await fetch('/api/data/kosts', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(kost)
    });
    if (!res.ok) throw new Error('Failed to add kost');
  },

  editKost: async (id: string, kost: Partial<Kost>): Promise<void> => {
    const res = await fetch(`/api/data/kosts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(kost)
    });
    if (!res.ok) throw new Error('Failed to edit kost');
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

  updateBookingStatus: async (bookingId: string, status: 'Disetujui' | 'Ditolak'): Promise<void> => {
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
    if (!res.ok) throw new Error('Failed to delete kost');
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
  }
};
