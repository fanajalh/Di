export interface Kost {
  id: string;
  name: string;
  type: 'Putra' | 'Putri' | 'Campur';
  roomClass: 'Standar' | 'VIP' | 'Eksklusif';
  price: number; // in IDR
  rating: number;
  reviewsCount: number;
  location: string;
  image: string;
  additionalImages?: string[];
  facilities: string[];
  availableRooms: number;
  totalRooms: number;
  description: string;
  address: string;
  author: string;
}

export interface Booking {
  id: string;
  kostId: string;
  kostName: string;
  kostImage: string;
  userName: string;
  userPhone: string;
  userEmail?: string;
  surveyTime?: string;
  startDate: string;
  duration: number; // in months
  totalPrice: number;
  status: 'Pending' | 'Disetujui' | 'Ditolak';
  bookingDate: string;
  paymentMethod: string;
}

export interface FilterState {
  search: string;
  location: string;
  type: string; // Putra, Putri, Campur, All
  roomClass: string; // Standar, VIP, Eksklusif, All
  minPrice: number;
  maxPrice: number;
  facilities: string[];
}

export interface HeroBanner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  order: number;
}

export interface FinancialTransaction {
  id: number;
  ownerId?: number;
  kostId?: string | null;
  type: 'Income' | 'Expense';
  amount: number;
  category: string;
  description?: string;
  date: string;
  createdAt: number;
}

export interface Promo {
  id: number;
  code: string;
  discountPercent: number;
  title: string;
  description?: string;
  expiresAt: number;
}

export interface TenantRequest {
  id: number;
  userId: number;
  userName?: string;
  userPhone?: string;
  kostId: string;
  kostName?: string;
  type: 'Checkout' | 'Extension' | 'RoomChange';
  details: {
    checkoutDate?: string;
    months?: number;
    targetRoom?: string;
    reason?: string;
  };
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: number;
}

