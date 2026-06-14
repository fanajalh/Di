import { useState, useMemo, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import ImmersiveHero from './components/ImmersiveHero';
import KostCard from './components/KostCard';
import Footer from './components/Footer';
import ToastContainer, { toast } from './components/Toast';
import { useSession } from './components/AuthContext';
import { Kost, Booking, FilterState, HeroBanner } from './types';

// Lazy-loaded route-level components (code splitting for performance)
const FilterSidebar = lazy(() => import('./components/FilterSidebar'));
const DashboardOwner = lazy(() => import('./components/DashboardOwner'));
const DashboardBuyer = lazy(() => import('./components/DashboardBuyer'));
const UserProfilePage = lazy(() => import('./components/UserProfilePage'));
const Login = lazy(() => import('./components/auth/Login'));
const Register = lazy(() => import('./components/auth/Register'));
const VerifyOTP = lazy(() => import('./components/auth/VerifyOTP'));
const DetailKostPage = lazy(() => import('./components/DetailKostPage'));
const BookingPage = lazy(() => import('./components/BookingPage'));
import { 
  X, 
  MapPin, 
  Sparkles, 
  Calendar, 
  CreditCard, 
  CheckCircle2, 
  MessageSquare, 
  Phone, 
  Plus, 
  ChevronRight, 
  Clock, 
  AlertCircle 
} from 'lucide-react';

import { api } from './api';

export default function App() {
  const { session } = useSession();

  // Page Routing view State
  const [currentView, setCurrentView] = useState<'landing' | 'catalog' | 'dashboard' | 'buyer-dashboard' | 'my-bookings' | 'profile' | 'login' | 'register' | 'forgot-password' | 'verify-otp' | 'detail-kost' | 'booking'>('landing');

  // Datasets State
  const [kosts, setKosts] = useState<Kost[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Fetch data from backend
  const refreshData = async (showLoading = false) => {
    if (showLoading) setIsDataLoading(true);
    try {
      const fetchedKosts = await api.getKosts();
      setKosts(fetchedKosts);
      
      const fetchedBanners = await api.getBanners();
      setBanners(fetchedBanners);
      
      if (session) {
        const fetchedBookings = await api.getBookings();
        setBookings(fetchedBookings);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error('Failed to refresh data', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    refreshData(true);
  }, [session]);

  // Filter State
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: 'All',
    type: 'All',
    roomClass: 'All',
    minPrice: 500000,
    maxPrice: 6000000,
    facilities: []
  });

  // Selected Detail Modal & Active booking States
  const [selectedKost, setSelectedKost] = useState<Kost | null>(null);
  const [bookingKost, setBookingKost] = useState<Kost | null>(null);

  // Auto-fill booking form with logged-in user details from NextAuth session
  // Removed from App.tsx since it's now handled inside BookingPage.tsx

  // Unique list of cities/locations for filter sidebar
  const availableLocations = useMemo(() => {
    const locs = kosts.map(k => k.location);
    return Array.from(new Set(locs));
  }, [kosts]);

  // Compute filtered dataset
  const filteredKosts = useMemo(() => {
    return kosts.filter(kost => {
      // 1. Search text filter match name or address
      if (filters.search) {
        const query = filters.search.toLowerCase();
        const matchesName = kost.name.toLowerCase().includes(query);
        const matchesAddress = kost.address.toLowerCase().includes(query);
        if (!matchesName && !matchesAddress) return false;
      }

      // 2. City location filter
      if (filters.location !== 'All' && kost.location !== filters.location) {
        return false;
      }

      // 3. Gender target type matching
      if (filters.type !== 'All' && kost.type !== filters.type) {
        return false;
      }

      // 4. Room class match
      if (filters.roomClass !== 'All' && kost.roomClass !== filters.roomClass) {
        return false;
      }

      // 5. Budget constraints Check
      if (kost.price < filters.minPrice || kost.price > filters.maxPrice) {
        return false;
      }

      // 6. Checked facilities must match all selected elements
      if (filters.facilities.length > 0) {
        const matchesAllFacilities = filters.facilities.every(fac => 
          kost.facilities.includes(fac)
        );
        if (!matchesAllFacilities) return false;
      }

      return true;
    });
  }, [kosts, filters]);

  // Handle owner booking approval
  const handleApproveBooking = async (id: string) => {
    const tid = toast.loading('Menyetujui reservasi...');
    try {
      await api.updateBookingStatus(id, 'Disetujui');
      await refreshData();
      toast.update(tid, { type: 'success', message: 'Sewa kost telah disetujui!' });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal menyetujui pesanan.' });
    }
  };

  const handleRejectBooking = async (id: string) => {
    const tid = toast.loading('Menolak reservasi...');
    try {
      await api.updateBookingStatus(id, 'Ditolak');
      await refreshData();
      toast.update(tid, { type: 'success', message: 'Sewa kost ditolak oleh pemilik.' });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal menolak pesanan.' });
    }
  };

  // Handler for adding new kost (Owner)
  const handleAddKost = async (newKost: Kost) => {
    const tid = toast.loading('Mendaftarkan properti baru...');
    try {
      await api.addKost(newKost);
      await refreshData();
      toast.update(tid, { type: 'success', message: `Kost "${newKost.name}" sukses didaftarkan!` });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal menambahkan kost.' });
    }
  };

  // Handle owner editing existing kost
  const handleEditKost = async (updatedKost: Kost) => {
    const tid = toast.loading('Memperbarui properti...');
    try {
      await api.editKost(updatedKost.id, updatedKost);
      await refreshData();
      toast.update(tid, { type: 'success', message: `Properti "${updatedKost.name}" berhasil diperbarui!` });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal memperbarui properti.' });
    }
  };

  const handleDeleteKost = async (id: string) => {
    const tid = toast.loading('Menghapus properti...');
    try {
      await api.deleteKost(id);
      await refreshData();
      toast.update(tid, { type: 'success', message: 'Properti berhasil dihapus.' });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal menghapus properti.' });
    }
  };

  // CRUD handlers for Hero Banners
  const handleAddBanner = async (newBanner: Omit<HeroBanner, 'id'>) => {
    const tid = toast.loading('Menambahkan banner baru...');
    try {
      await api.addBanner(newBanner);
      await refreshData();
      toast.update(tid, { type: 'success', message: 'Banner baru berhasil ditambahkan!' });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal menambahkan banner.' });
    }
  };

  const handleEditBanner = async (id: number, updatedBanner: Partial<HeroBanner>) => {
    const tid = toast.loading('Memperbarui banner...');
    try {
      await api.editBanner(id, updatedBanner);
      await refreshData();
      toast.update(tid, { type: 'success', message: 'Banner berhasil diperbarui!' });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal memperbarui banner.' });
    }
  };

  const handleDeleteBanner = async (id: number) => {
    const tid = toast.loading('Menghapus banner...');
    try {
      await api.deleteBanner(id);
      await refreshData();
      toast.update(tid, { type: 'success', message: 'Banner berhasil dihapus.' });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal menghapus banner.' });
    }
  };

  const handleCancelBooking = async (id: string) => {
    const tid = toast.loading('Membatalkan reservasi...');
    try {
      await api.cancelBooking(id);
      await refreshData();
      toast.update(tid, { type: 'success', message: 'Reservasi berhasil dibatalkan.' });
    } catch (err: any) {
      console.error(err);
      toast.update(tid, { type: 'error', message: err?.message || 'Gagal membatalkan reservasi.' });
    }
  };

  const handleConfirmReservation = async (bookingDetails: Partial<Booking>) => {
    const tid = toast.loading('Mengajukan reservasi...');
    try {
      await api.createBooking(bookingDetails);
      await refreshData();
      setBookingKost(null);
      setCurrentView('buyer-dashboard');
      toast.update(tid, { type: 'success', message: 'Sewa Di diajukan! Silakan tunggu persetujuan Owner.' });
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal membuat pesanan. Pastikan Anda sudah login.' });
    }
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans flex flex-col justify-between selection:bg-white/20 selection:text-white">
      {/* Global Toast Notifications */}
      <ToastContainer />
      
      {/* Main Top Navigation Head (Hidden on immersive landing, detail, and booking) */}
      {currentView !== 'landing' && currentView !== 'detail-kost' && currentView !== 'booking' && (
        <Navbar 
          currentView={currentView as any} 
          onNavigate={(view) => setCurrentView(view as any)} 
          pendingCount={bookings.filter(b => b.status === 'Pending').length}
        />
      )}

      {/* RENDER VIEWS ACCORDINGLY */}
      <main id="main-content" className="flex-grow flex flex-col">
        <Suspense fallback={<div className="flex-1 flex items-center justify-center min-h-[60vh]"><div className="w-6 h-6 border-2 border-[#2A2A2A] border-t-white rounded-full animate-spin" /></div>}>
        {/* AUTHENTICATION VIEWS */}
      {currentView === 'login' && <Login onNavigate={setCurrentView} onSuccess={() => setCurrentView('catalog')} />}
      {currentView === 'register' && <Register onNavigate={setCurrentView} />}
      {currentView === 'forgot-password' && <VerifyOTP onNavigate={setCurrentView} />}
      {currentView === 'verify-otp' && <VerifyOTP onNavigate={setCurrentView} />}
      
      {/* 1. LANDING PAGE VIEW */}
      {currentView === 'landing' && (
        <div className="flex-col">
          <ImmersiveHero 
            onExploreClick={() => setCurrentView('catalog')}
            featuredKosts={kosts.slice(0, 4)}
            onSelectKost={(kost) => {
              setSelectedKost(kost);
              setCurrentView('detail-kost');
            }}
            banners={banners}
          />
        </div>
      )}

      {/* 1.5 CATALOG DISCOVERY VIEW */}
      {currentView === 'catalog' && (
        <div className="flex-col">
          <div id="search-anchor" className="container mx-auto px-4 md:px-8 py-12 max-w-7xl">
            <div className="mb-12 border-b border-[#2A2A2A] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-[#5A5A5A] font-mono text-xs tracking-[0.2em] uppercase mb-2">Exclusive Catalog</p>
                <h2 className="text-3xl md:text-5xl font-light text-white tracking-tight leading-tight">
                  Koleksi <span className="font-semibold text-[#B0B0B0]">Kamar Premium.</span>
                </h2>
              </div>
              <p className="text-sm text-[#5A5A5A] font-light max-w-md leading-relaxed">
                Gunakan bilah filter dinamis untuk menyaring berdasarkan budget, target hunian, fasilitas eksklusif, atau lokasi impian Anda.
              </p>
            </div>

            <div className="flex flex-col gap-8">
              <div className="w-full relative z-40">
                <FilterSidebar 
                  filters={filters} 
                  onFilterChange={(f) => setFilters(f)} 
                  availableLocations={availableLocations}
                />
              </div>

              <div className="w-full space-y-8 relative z-30">
                <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-2 pl-6 flex items-center gap-3">
                  <span className="text-[#5A5A5A] font-mono text-xs uppercase tracking-widest hidden sm:inline">Search</span>
                  <div className="w-[1px] h-4 bg-[#2A2A2A] hidden sm:block mx-2"></div>
                  <input
                    type="text"
                    placeholder="Nama kost, alamat, atau area kampus..."
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    className="flex-1 bg-transparent border-none text-sm text-white outline-none placeholder:text-[#3A3A3A] font-light"
                  />
                  {filters.search && (
                    <button 
                      onClick={() => setFilters(prev => ({ ...prev, search: '' }))} 
                      className="text-xs text-[#5A5A5A] hover:text-white px-2"
                    >
                      Clear
                    </button>
                  )}
                  <div className="bg-[#1C1C1C] text-white px-4 py-2 rounded-xl text-xs font-medium border border-[#2A2A2A]">
                    {filteredKosts.length} Units
                  </div>
                </div>

                {filters.location !== 'All' && (
                  <div className="flex items-center text-xs text-[#5A5A5A]">
                    <span>Menampilkan hasil untuk area: <strong className="text-white font-medium ml-1">{filters.location}</strong></span>
                  </div>
                )}

                {filteredKosts.length === 0 ? (
                  <div className="bg-[#141414] border border-dashed border-[#2A2A2A] p-16 text-center rounded-2xl flex flex-col items-center justify-center">
                    <div className="p-4 bg-[#1C1C1C] rounded-full border border-[#2A2A2A] text-[#5A5A5A] mb-4">
                      <AlertCircle className="w-8 h-8 text-[#6B6B6B]" />
                    </div>
                    <h3 className="text-base font-bold text-white font-display">Kamar Kost tidak ditemukan</h3>
                    <p className="text-xs text-[#5A5A5A] mt-1 max-w-sm leading-relaxed">
                      Coba ganti kata kunci pencarian Anda atau reset filter harga s.d maksimal untuk menemukan kamar yang cocok kembali.
                    </p>
                    <button
                      onClick={() => setFilters({
                        search: '',
                        location: 'All',
                        type: 'All',
                        roomClass: 'All',
                        minPrice: 500000,
                        maxPrice: 6000000,
                        facilities: []
                      })}
                      className="mt-6 px-4 py-2 bg-white hover:bg-[#B0B0B0] text-black text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Reset Seluruh Filter
                    </button>
                  </div>
                ) : isDataLoading ? (
                  /* Skeleton loading cards */
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden animate-pulse">
                        <div className="h-48 bg-[#1C1C1C]" />
                        <div className="p-5 space-y-3">
                          <div className="flex gap-2">
                            <div className="h-4 bg-[#1C1C1C] rounded w-16" />
                            <div className="h-4 bg-[#1C1C1C] rounded w-20" />
                          </div>
                          <div className="h-5 bg-[#1C1C1C] rounded w-3/4" />
                          <div className="h-3 bg-[#1C1C1C] rounded w-1/2" />
                          <div className="flex gap-2 pt-2">
                            <div className="h-6 bg-[#1C1C1C] rounded w-14" />
                            <div className="h-6 bg-[#1C1C1C] rounded w-14" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredKosts.map(kost => (
                      <KostCard 
                        key={kost.id} 
                        kost={kost} 
                        onSelect={(sel) => {
                          setSelectedKost(sel);
                          setCurrentView('detail-kost');
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. DASHBOARD OWNER STATS VIEW */}
      {currentView === 'dashboard' && (
        <div className="container mx-auto max-w-7xl">
          <DashboardOwner 
            kostList={kosts}
            bookings={bookings}
            onApproveBooking={handleApproveBooking}
            onRejectBooking={handleRejectBooking}
            onAddKost={handleAddKost}
            onEditKost={handleEditKost}
            onDeleteKost={handleDeleteKost}
            banners={banners}
            onAddBanner={handleAddBanner}
            onEditBanner={handleEditBanner}
            onDeleteBanner={handleDeleteBanner}
          />
        </div>
      )}

      {/* 3. BUYER DASHBOARD VIEW */}
      {currentView === 'buyer-dashboard' && (
        <div className="container mx-auto max-w-7xl">
          <DashboardBuyer
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            isLoading={isDataLoading}
          />
        </div>
      )}

      {/* 4. USER PROFILE VIEW */}
      {currentView === 'profile' && (
        <div className="container mx-auto max-w-7xl">
          <UserProfilePage bookings={bookings} />
        </div>
      )}

      {/* 5. USER BOOKING STATUS HISTORY LIST */}
      {currentView === 'my-bookings' && (
        <div className="container mx-auto px-4 md:px-8 py-12 max-w-5xl flex-1">
          <div className="pb-6 border-b border-[#2A2A2A] mb-8 text-left">
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white flex items-center gap-2.5">
              <Calendar className="w-8 h-8 text-[#8A8A8A]" />
              Sewa Saya & Riwayat
            </h1>
            <p className="text-xs text-[#5A5A5A] mt-1">
              Pantau seluruh riwayat pendaftaran kos Anda, unduh kwitansi digital, atau teruskan s.d persetujuan pembayaran.
            </p>
          </div>

          {bookings.length === 0 ? (
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-16 text-center max-w-md mx-auto">
              <div className="w-12 h-12 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#5A5A5A] mx-auto mb-4">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-white text-base">Kotak Sewa Kosong</h3>
              <p className="text-xs text-[#5A5A5A] mt-2 leading-relaxed">
                Anda belum pernah memesan kos apa pun. Telusuri katalog landing kami untuk menempati kamar idaman pertama Anda!
              </p>
              <button
                onClick={() => setCurrentView('landing')}
                className="mt-6 px-4 py-2 bg-white hover:bg-[#B0B0B0] text-black font-semibold text-xs rounded-lg cursor-pointer transition-colors"
              >
                Cari Kost Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {bookings.map((book) => (
                <div 
                  key={book.id}
                  className="bg-[#141414] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-2xl p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start md:items-center gap-4">
                    <img 
                      src={book.kostImage} 
                      alt={book.kostName}
                      referrerPolicy="no-referrer"
                      className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-xl"
                    />
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono bg-[#1C1C1C] text-[#6B6B6B] px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                          KODE: {book.id.toUpperCase()}
                        </span>
                        
                        {book.status === 'Pending' ? (
                          <span className="text-[10px] font-mono bg-[#1C1C1C] border border-[#3A3A3A] px-2 py-0.5 rounded text-[#8A8A8A]">
                            Menunggu Verifikasi Owner
                          </span>
                        ) : book.status === 'Disetujui' ? (
                          <span className="text-[10px] font-mono bg-[#1C1C1C] border border-[#3A3A3A] px-2 py-0.5 rounded text-white font-bold uppercase">
                            DIKONFIRMASI AKTIF
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono bg-[#1C1C1C] border border-[#3A3A3A] px-2 py-0.5 rounded text-[#5A5A5A]">
                            Batal / Ditolak
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-white mt-2 font-display">{book.kostName}</h3>
                      
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-1 mt-3 text-xs text-[#5A5A5A]">
                        <p>Kontrak: <strong className="text-[#B0B0B0]">{book.duration} Bulan</strong></p>
                        <p>Bayar via: <strong className="text-white">{book.paymentMethod}</strong></p>
                        <p className="col-span-2 sm:col-span-1">Mulai: <strong className="text-[#8A8A8A]">{book.startDate}</strong></p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-[#2A2A2A] flex items-center justify-between md:flex-col md:items-end gap-2 md:gap-1.5 align-middle">
                    <p className="text-xs text-[#5A5A5A] font-mono">Invoice Dibuat</p>
                    <p className="text-base font-extrabold text-white font-mono">{formatRupiah(book.totalPrice)}</p>
                    {book.status === 'Pending' && (
                      <p className="text-[10px] text-[#5A5A5A] font-mono animate-pulse">
                        *Anda dapat menyetujui di Owner Panel
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FOOTER BRANDS */}
      {currentView !== 'detail-kost' && currentView !== 'booking' && <Footer />}

      {/* DETAIL KOST PAGE (REPLACES MODAL) */}
      {currentView === 'detail-kost' && selectedKost && (
        <DetailKostPage
          kost={selectedKost}
          onClose={() => {
            setSelectedKost(null);
            setCurrentView('catalog');
          }}
          onBookNow={() => {
            setBookingKost(selectedKost);
            setCurrentView('booking');
          }}
        />
      )}

        {/* BOOKING PAGE (REPLACES MODAL) */}
        {currentView === 'booking' && bookingKost && (
          <BookingPage
            kost={bookingKost}
            onBack={() => setCurrentView('detail-kost')}
            onConfirm={handleConfirmReservation}
          />
        )}
        </Suspense>
      </main>
    </div>
  );
}
