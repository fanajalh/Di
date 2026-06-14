import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';
import { Kost, Booking } from '../types';
import { useSession } from './AuthContext';

interface BookingPageProps {
  kost: Kost;
  onBack: () => void;
  onConfirm: (bookingDetails: Partial<Booking>) => Promise<void>;
}

export default function BookingPage({ kost, onBack, onConfirm }: BookingPageProps) {
  const { session } = useSession();
  
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingStartDate, setBookingStartDate] = useState('2026-07-01');
  const [bookingDuration, setBookingDuration] = useState(3); // in months
  const [bookingPayment, setBookingPayment] = useState('M-Banking BCA');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setBookingName(session.user.name);
      setBookingPhone(session.user.phone || '');
    }
  }, [session]);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const calculatedTotal = kost.price * bookingDuration;
  const discount = bookingDuration >= 6 ? calculatedTotal * 0.1 : 0;
  const finalTotal = calculatedTotal - discount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim()) {
      alert('Mohon lengkapi formulir data diri penyewa.');
      return;
    }
    
    setIsSubmitting(true);
    
    const newBooking: Partial<Booking> = {
      id: `book-${Date.now()}`,
      kostId: kost.id,
      kostName: kost.name,
      kostImage: kost.image,
      userName: bookingName,
      userPhone: bookingPhone,
      startDate: bookingStartDate,
      duration: bookingDuration,
      totalPrice: finalTotal,
      bookingDate: new Date().toISOString().split('T')[0],
      paymentMethod: bookingPayment
    };

    try {
      await onConfirm(newBooking);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A0A0A] text-white flex flex-col md:flex-row font-sans"
    >
      {/* Left Pane - Summary & Context (Visual Heavy) */}
      <div className="w-full md:w-5/12 lg:w-4/12 bg-[#141414] border-r border-[#1A1A1C] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Background Accent */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#1C1C1C] to-transparent opacity-50 pointer-events-none"></div>

        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="text-[#949494] hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> Batal & Kembali
          </button>

          <h2 className="text-3xl font-black tracking-tight mb-8">
            Ringkasan <br/><span className="text-[#808080]">Reservasi</span>
          </h2>

          <div className="rounded-2xl overflow-hidden border border-[#2A2A2A] mb-6">
            <img src={kost.image} alt={kost.name} className="w-full h-48 object-cover grayscale-[20%]" referrerPolicy="no-referrer" />
            <div className="p-5 bg-[#0A0A0A]">
              <div className="text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-1.5">{kost.type} • {kost.roomClass}</div>
              <h3 className="font-bold text-lg leading-tight mb-1">{kost.name}</h3>
              <p className="text-[#949494] text-xs">{kost.address}</p>
            </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#1C1C1C]">
            <div className="flex items-center gap-3 text-sm text-[#A3A3A3]">
              <ShieldCheck className="w-5 h-5 text-[#808080]" />
              Pembayaran aman & terenkripsi
            </div>
            <div className="flex items-center gap-3 text-sm text-[#A3A3A3]">
              <CheckCircle2 className="w-5 h-5 text-[#808080]" />
              Pembatalan gratis 24 jam pertama
            </div>
          </div>
        </div>
      </div>

      {/* Right Pane - Elegant Form (Input Heavy) */}
      <div className="w-full md:w-7/12 lg:w-8/12 bg-[#0A0A0A] p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          
          <div className="mb-12">
            <p className="text-[#808080] font-mono text-[10px] tracking-widest uppercase mb-3">Langkah Terakhir</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Lengkapi Data <br/><span className="font-bold">Penghuni.</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section 1: Personal Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#1A1A1C] pb-3 text-[#B0B0B0]">1. Identitas Penyewa</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Nama Lengkap Sesuai KTP</label>
                  <input
                    type="text"
                    required
                    value={bookingName}
                    onChange={(e) => setBookingName(e.target.value)}
                    className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-[#606060]"
                    placeholder="Contoh: Arfan Alamsyah"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">No Handphone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={bookingPhone}
                    onChange={(e) => setBookingPhone(e.target.value)}
                    className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-[#606060]"
                    placeholder="081234567890"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Stay Duration */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#1A1A1C] pb-3 text-[#B0B0B0]">2. Detail Hunian</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Mulai Menempati</label>
                  <input
                    type="date"
                    required
                    value={bookingStartDate}
                    onChange={(e) => setBookingStartDate(e.target.value)}
                    className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Durasi Sewa</label>
                  <div className="relative">
                    <select
                      value={bookingDuration}
                      onChange={(e) => setBookingDuration(Number(e.target.value))}
                      className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors appearance-none cursor-pointer"
                    >
                      <option value={1} className="bg-[#141414]">1 Bulan</option>
                      <option value={3} className="bg-[#141414]">3 Bulan</option>
                      <option value={6} className="bg-[#141414]">6 Bulan (Diskon 10%)</option>
                      <option value={12} className="bg-[#141414]">12 Bulan (Diskon 10%)</option>
                    </select>
                    <ChevronRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080] pointer-events-none rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Method */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#1A1A1C] pb-3 text-[#B0B0B0]">3. Metode Pembayaran</h3>
              
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'M-Banking BCA', label: 'BCA VA' },
                  { val: 'M-Banking Mandiri', label: 'Mandiri VA' },
                  { val: 'GoPay', label: 'GoPay' },
                  { val: 'ShopeePay', label: 'QRIS / OVO' }
                ].map((pay) => (
                  <button
                    key={pay.val}
                    type="button"
                    onClick={() => setBookingPayment(pay.val)}
                    className={`py-4 px-5 rounded-xl border text-sm font-medium text-left transition-all ${
                      bookingPayment === pay.val
                        ? 'bg-[#1C1C1C] text-white border-[#808080]'
                        : 'bg-transparent text-[#949494] border-[#1A1A1C] hover:border-[#2A2A2A] hover:bg-[#141414]'
                    }`}
                  >
                    {pay.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Total Calculation & Submit */}
            <div className="bg-[#141414] border border-[#1A1A1C] rounded-2xl p-6 md:p-8 mt-12 space-y-4">
              <div className="flex justify-between items-center text-sm text-[#A3A3A3]">
                <span>Biaya Sewa ({bookingDuration} bulan)</span>
                <span className="font-mono">{formatRupiah(calculatedTotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between items-center text-sm text-white">
                  <span>Diskon Jangka Panjang (10%)</span>
                  <span className="font-mono">-{formatRupiah(discount)}</span>
                </div>
              )}
              <div className="border-t border-[#2A2A2A] pt-4 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-[10px] text-[#808080] font-mono uppercase tracking-widest mb-1">Total Pembayaran</p>
                  <p className="text-3xl font-black tracking-tight">{formatRupiah(finalTotal)}</p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white hover:bg-[#B0B0B0] text-black font-bold py-4 px-8 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isSubmitting ? 'Memproses...' : 'Konfirmasi Reservasi'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </motion.div>
  );
}
