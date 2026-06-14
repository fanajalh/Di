import { useState } from 'react';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  Clock, 
  CreditCard, 
  XCircle, 
  TrendingUp, 
  Loader2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Booking } from '../types';

interface DashboardBuyerProps {
  bookings: Booking[];
  onCancelBooking: (id: string) => Promise<void>;
  isLoading: boolean;
}

export default function DashboardBuyer({ bookings, onCancelBooking, isLoading }: DashboardBuyerProps) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'pending' | 'active' | 'rejected'>('all');

  const formatRupiah = (num: number) => 'Rp ' + num.toLocaleString('id-ID');

  // Stats
  const totalBookings = bookings.length;
  const activeBookings = bookings.filter(b => b.status === 'Disetujui').length;
  const pendingBookings = bookings.filter(b => b.status === 'Pending').length;
  const rejectedBookings = bookings.filter(b => b.status === 'Ditolak').length;
  const totalSpent = bookings
    .filter(b => b.status === 'Disetujui')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    if (tab === 'pending') return b.status === 'Pending';
    if (tab === 'active') return b.status === 'Disetujui';
    if (tab === 'rejected') return b.status === 'Ditolak';
    return true;
  });

  const handleCancel = async (id: string) => {
    setCancellingId(id);
    try {
      await onCancelBooking(id);
    } finally {
      setCancellingId(null);
    }
  };

  // Skeleton card
  const SkeletonCard = () => (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-xl bg-[#1C1C1C]" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-[#1C1C1C] rounded w-1/3" />
          <div className="h-4 bg-[#1C1C1C] rounded w-2/3" />
          <div className="h-3 bg-[#1C1C1C] rounded w-1/2" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-4 md:p-8 text-left">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] pb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-black" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-extrabold text-white">
              Dashboard Penyewa
            </h1>
            <p className="text-xs text-[#808080] mt-0.5 font-mono">
              Kelola semua reservasi dan pantau status sewa Anda
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <CalendarCheck2 className="w-4 h-4 text-[#949494]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#808080]">Total Booking</span>
          </div>
          <p className="text-2xl font-black text-white font-mono">{isLoading ? '—' : totalBookings}</p>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-500/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#808080]">Sewa Aktif</span>
          </div>
          <p className="text-2xl font-black text-white font-mono">{isLoading ? '—' : activeBookings}</p>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-4 h-4 text-blue-400/60" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#808080]">Pending</span>
          </div>
          <p className="text-2xl font-black text-white font-mono">{isLoading ? '—' : pendingBookings}</p>
        </div>

        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#3A3A3A] transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-[#949494]" />
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#808080]">Total Bayar</span>
          </div>
          <p className="text-lg font-black text-white font-mono truncate">{isLoading ? '—' : formatRupiah(totalSpent)}</p>
        </div>
      </div>

      {/* Booking List with Tabs */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
        {/* Tab Header */}
        <div className="px-6 py-5 border-b border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-[#949494]" />
            Riwayat Reservasi
          </h2>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#0A0A0A] p-1.5 rounded-xl border border-[#2A2A2A]">
            {[
              { key: 'all' as const, label: 'Semua', count: totalBookings },
              { key: 'pending' as const, label: 'Pending', count: pendingBookings },
              { key: 'active' as const, label: 'Aktif', count: activeBookings },
              { key: 'rejected' as const, label: 'Ditolak', count: rejectedBookings },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  tab === t.key
                    ? 'bg-white text-black'
                    : 'text-[#808080] hover:text-white hover:bg-white/5'
                }`}
              >
                {t.label} ({t.count})
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6 space-y-4">
          {isLoading ? (
            // Skeleton loading
            <div className="space-y-4">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-12 h-12 bg-[#1C1C1C] border border-[#2A2A2A] rounded-full flex items-center justify-center text-[#808080] mx-auto mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-white">Tidak ada data</p>
              <p className="text-xs text-[#808080] mt-1">
                {tab === 'all'
                  ? 'Anda belum memiliki riwayat reservasi.'
                  : `Tidak ada booking berstatus "${tab}".`}
              </p>
            </div>
          ) : (
            filteredBookings.map(book => (
              <div
                key={book.id}
                className="bg-[#0A0A0A] border border-[#2A2A2A] hover:border-[#3A3A3A] rounded-xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
              >
                {/* Left: Image + Info */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <img
                    src={book.kostImage}
                    alt={book.kostName}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 md:w-16 md:h-16 object-cover rounded-xl border border-[#2A2A2A] shrink-0"
                  />
                  <div className="min-w-0">
                    {/* Status + Code */}
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      <span className="text-[9px] font-mono bg-[#141414] text-[#949494] px-2 py-0.5 rounded font-bold uppercase tracking-wide border border-[#2A2A2A]">
                        {book.id.slice(0, 12).toUpperCase()}
                      </span>
                      {book.status === 'Pending' ? (
                        <span className="text-[9px] font-mono bg-blue-950/30 border border-blue-900/30 px-2 py-0.5 rounded text-blue-400 font-bold uppercase">
                          Menunggu
                        </span>
                      ) : book.status === 'Disetujui' ? (
                        <span className="text-[9px] font-mono bg-emerald-950/30 border border-emerald-900/30 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase">
                          Aktif
                        </span>
                      ) : (
                        <span className="text-[9px] font-mono bg-red-950/30 border border-red-900/30 px-2 py-0.5 rounded text-red-400 font-bold uppercase">
                          Ditolak
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-white truncate max-w-[280px]">{book.kostName}</h4>

                    <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-[11px] text-[#808080] font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {book.duration} Bulan
                      </span>
                      <span className="flex items-center gap-1">
                        <CalendarCheck2 className="w-3 h-3" /> Mulai: {book.startDate}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3 h-3" /> {book.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Price + Cancel */}
                <div className="w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-[#2A2A2A] flex items-center justify-between md:flex-col md:items-end gap-2">
                  <div className="text-right">
                    <p className="text-[10px] text-[#808080] font-mono">Total Invoice</p>
                    <p className="text-base font-extrabold text-white font-mono">{formatRupiah(book.totalPrice)}</p>
                  </div>

                  {book.status === 'Pending' && (
                    <button
                      onClick={() => handleCancel(book.id)}
                      disabled={cancellingId === book.id}
                      className="px-3 py-1.5 bg-red-950/20 border border-red-900/30 hover:bg-red-900/30 rounded-lg text-[11px] font-bold text-red-400 hover:text-red-300 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cancellingId === book.id ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin" />
                          Membatalkan...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-3 h-3" />
                          Batalkan
                        </>
                      )}
                    </button>
                  )}

                  {book.status === 'Disetujui' && (
                    <span className="text-[10px] text-emerald-500/60 font-mono flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Terkonfirmasi
                    </span>
                  )}

                  {book.status === 'Ditolak' && (
                    <span className="text-[10px] text-red-500/50 font-mono flex items-center gap-1">
                      <XCircle className="w-3 h-3" /> Dibatalkan
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
