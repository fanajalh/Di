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

