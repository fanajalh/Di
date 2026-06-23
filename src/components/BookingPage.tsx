import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, ShieldCheck, Calendar, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Kost, Booking } from '../types';
import { useSession } from './AuthContext';
import { api } from '../api';

interface BookingPageProps {
  kost: Kost;
  onBack: () => void;
  onConfirm: (bookingDetails: Partial<Booking>) => Promise<void>;
}

const TIME_SLOTS = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00"];

const DAYS_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const DAYS_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS_SHORT = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
const MONTHS_FULL = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

const getDayNameIndo = (dayIndex: number, short = false) => {
  return short ? DAYS_SHORT[dayIndex] : DAYS_FULL[dayIndex];
};

const getMonthNameIndo = (monthIndex: number, short = false) => {
  return short ? MONTHS_SHORT[monthIndex] : MONTHS_FULL[monthIndex];
};

const isSameDay = (d1: Date, d2: Date) => {
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

const isDateInPast = (d: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(d);
  compareDate.setHours(0, 0, 0, 0);
  return compareDate < today;
};

const formatDateToString = (date: Date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  
  const firstDay = new Date(year, month, 1);
  const totalDays = new Date(year, month + 1, 0).getDate();
  const startDayOfWeek = firstDay.getDay(); 
  
  const days: (Date | null)[] = [];
  
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  
  for (let day = 1; day <= totalDays; day++) {
    days.push(new Date(year, month, day));
  }
  
  return days;
};

export default function BookingPage({ kost, onBack, onConfirm }: BookingPageProps) {
  const { session } = useSession();
  
  const getTodayString = () => {
    return new Date().toISOString().split('T')[0];
  };

  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingStartDate, setBookingStartDate] = useState(getTodayString());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [bookedSlots, setBookedSlots] = useState<{ date: string; time: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const handlePrevMonth = () => {
    const today = new Date();
    if (calendarMonth.getFullYear() === today.getFullYear() && calendarMonth.getMonth() === today.getMonth()) {
      return;
    }
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1));
  };

  const quickDates = [];
  const todayDate = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() + i);
    quickDates.push(d);
  }

  useEffect(() => {
    if (session?.user) {
      setBookingName(session.user.name);
      setBookingPhone(session.user.phone || '');
      setBookingEmail(session.user.email || '');
    }
  }, [session]);

  useEffect(() => {
    const fetchBookedSlots = async () => {
      try {
        const slots = await api.getBookedSlots(kost.id);
        setBookedSlots(slots);
      } catch (err) {
        console.error("Gagal memuat jadwal terisi:", err);
      }
    };
    fetchBookedSlots();
  }, [kost.id]);

  const isSlotBooked = (date: string, time: string) => {
    return bookedSlots.some(slot => slot.date === date && slot.time === time);
  };

  const isSlotDisabled = (time: string) => {
    if (!bookingStartDate) return true;
    
    // Check if booked in DB
    if (isSlotBooked(bookingStartDate, time)) return true;

    // Check if date is today and time has passed
    const todayStr = getTodayString();
    if (bookingStartDate === todayStr) {
      const currentHour = new Date().getHours();
      const slotHour = parseInt(time.split(':')[0]);
      if (slotHour <= currentHour) return true;
    }

    return false;
  };

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName.trim() || !bookingPhone.trim() || !bookingEmail.trim()) {
      alert('Mohon lengkapi formulir data diri penyewa.');
      return;
    }
    if (!bookingStartDate) {
      alert('Mohon tentukan tanggal survey.');
      return;
    }
    if (!selectedTimeSlot) {
      alert('Mohon pilih jam survey.');
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
      userEmail: bookingEmail,
      startDate: bookingStartDate, // Used as surveyDate
      surveyTime: selectedTimeSlot,
      duration: 0,
      totalPrice: 0,
      bookingDate: getTodayString(),
      paymentMethod: 'Bayar Langsung di Tempat Kost'
    };

    try {
      await onConfirm(newBooking);
    } catch (err: any) {
      alert(err?.message || 'Gagal membuat reservasi.');
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

        {/* Top Content */}
        <div className="relative z-10">
          <button 
            onClick={onBack}
            className="text-[#949494] hover:text-white flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-colors mb-12"
          >
            <ArrowLeft className="w-4 h-4" /> Batal & Kembali
          </button>

          <h2 className="text-3xl font-black tracking-tight mb-8">
            Jadwal <br/><span className="text-[#808080]">Survey Kost</span>
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
              Pembayaran langsung di lokasi kost
            </div>
            <div className="flex items-center gap-3 text-sm text-[#A3A3A3]">
              <CheckCircle2 className="w-5 h-5 text-[#808080]" />
              Pendaftaran jadwal survey gratis
            </div>
          </div>
        </div>

        {/* Bottom Content (Pushed to bottom on desktop by justify-between) */}
        <div className="relative z-10 mt-12 pt-6 border-t border-[#1C1C1C] space-y-4">
          <p className="text-[10px] font-mono text-[#808080] uppercase tracking-widest">Tips Survey Lapangan</p>
          <ul className="space-y-3 text-xs text-[#949494]">
            <li className="flex gap-2">
              <span className="text-white font-mono font-bold">01.</span>
              <span>Periksa kekuatan sinyal HP & kondisi air bersih di dalam kamar kost.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-white font-mono font-bold">02.</span>
              <span>Tanyakan tentang fasilitas bersama seperti jam malam, parkiran, & kebersihan.</span>
            </li>
            <li className="flex gap-2">
              <span className="text-white font-mono font-bold">03.</span>
              <span>Konfirmasikan apakah biaya sewa bulanan sudah termasuk tagihan listrik.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Right Pane - Elegant Form (Input Heavy) */}
      <div className="w-full md:w-7/12 lg:w-8/12 bg-[#0A0A0A] p-8 md:p-16 lg:p-24 overflow-y-auto">
        <div className="max-w-2xl mx-auto">
          
          <div className="mb-12">
            <p className="text-[#808080] font-mono text-[10px] tracking-widest uppercase mb-3">Reservasi Kunjungan</p>
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">
              Lengkapi Data <br/><span className="font-bold">Jadwal Survey.</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            
            {/* Section 1: Personal Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#1A1A1C] pb-3 text-[#B0B0B0]">1. Identitas Diri</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Nama Lengkap</label>
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
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">No WhatsApp</label>
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

              <div>
                <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Alamat Email</label>
                <input
                  type="email"
                  required
                  value={bookingEmail}
                  onChange={(e) => setBookingEmail(e.target.value)}
                  className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors placeholder:text-[#606060]"
                  placeholder="contoh@email.com"
                />
              </div>
            </div>

            {/* Section 2: Survey Schedule */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#1A1A1C] pb-3 text-[#B0B0B0]">2. Tentukan Tanggal & Jam Survey</h3>
              
              <div className="space-y-8">
                {/* Date Selection */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Pilih Tanggal Survey
                    </label>
                    
                    {/* Quick Select Dates */}
                    <div className="mb-6">
                      <p className="text-[10px] font-mono text-[#606060] uppercase tracking-widest mb-3">Pilihan Cepat (7 Hari ke Depan)</p>
                      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#2A2A2A] scrollbar-track-transparent -mx-4 px-4 sm:mx-0 sm:px-0">
                        {quickDates.map((date) => {
                          const dateStr = formatDateToString(date);
                          const isSelected = bookingStartDate === dateStr;
                          
                          const isToday = isSameDay(date, todayDate);
                          const tomorrow = new Date(todayDate);
                          tomorrow.setDate(todayDate.getDate() + 1);
                          const isTomorrow = isSameDay(date, tomorrow);
                          
                          let displayDay = getDayNameIndo(date.getDay(), true);
                          if (isToday) displayDay = "Hari Ini";
                          else if (isTomorrow) displayDay = "Besok";

                          return (
                            <button
                              key={dateStr}
                              type="button"
                              onClick={() => {
                                setBookingStartDate(dateStr);
                                setSelectedTimeSlot('');
                              }}
                              className={`flex flex-col items-center justify-center p-3 rounded-xl border min-w-[80px] transition-all duration-200 cursor-pointer ${
                                isSelected
                                  ? 'bg-white text-black border-white font-bold scale-105 shadow-lg shadow-white/10'
                                  : 'bg-[#141414] text-[#949494] border-[#1C1C1C] hover:border-[#2A2A2A] hover:bg-[#1A1A1A] hover:text-white'
                              }`}
                            >
                              <span className="text-[9px] font-mono uppercase tracking-wider opacity-75 mb-1">{displayDay}</span>
                              <span className="text-xl font-black tracking-tight">{date.getDate()}</span>
                              <span className="text-[9px] font-mono uppercase tracking-widest mt-1">{getMonthNameIndo(date.getMonth(), true)}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Inline Calendar */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-mono text-[#606060] uppercase tracking-widest">Atau Cari di Kalender</p>
                      <div className="bg-[#141414] border border-[#1C1C1C] rounded-2xl p-5 max-w-sm w-full">
                        {/* Calendar Header */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-xs font-bold uppercase tracking-wider font-mono text-white">
                            {getMonthNameIndo(calendarMonth.getMonth())} {calendarMonth.getFullYear()}
                          </span>
                          <div className="flex gap-1.5">
                            <button
                              type="button"
                              disabled={calendarMonth.getFullYear() === todayDate.getFullYear() && calendarMonth.getMonth() === todayDate.getMonth()}
                              onClick={handlePrevMonth}
                              className="p-1.5 rounded-lg border border-[#2A2A2A] hover:bg-[#1C1C1C] disabled:opacity-20 disabled:cursor-not-allowed text-[#B0B0B0] hover:text-white transition-colors cursor-pointer"
                            >
                              <ChevronLeft className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={handleNextMonth}
                              className="p-1.5 rounded-lg border border-[#2A2A2A] hover:bg-[#1C1C1C] text-[#B0B0B0] hover:text-white transition-colors cursor-pointer"
                            >
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Weekdays */}
                        <div className="gap-1 text-center mb-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                          {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
                            <div key={day} className="text-[9px] font-mono text-[#606060] uppercase tracking-wider py-1 font-semibold">
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Days Grid */}
                        <div className="gap-1 text-center" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, minmax(0, 1fr))' }}>
                          {getDaysInMonth(calendarMonth).map((day, idx) => {
                            if (!day) {
                              return <div key={`empty-${idx}`} />;
                            }

                            const dateStr = formatDateToString(day);
                            const isSelected = bookingStartDate === dateStr;
                            const isPast = isDateInPast(day);
                            const isToday = isSameDay(day, todayDate);

                            return (
                              <button
                                key={dateStr}
                                type="button"
                                disabled={isPast}
                                onClick={() => {
                                  setBookingStartDate(dateStr);
                                  setSelectedTimeSlot('');
                                }}
                                className={`aspect-square flex flex-col items-center justify-center rounded-lg text-xs font-mono transition-all relative cursor-pointer ${
                                  isPast
                                    ? 'text-[#2A2A2A] cursor-not-allowed line-through'
                                    : isSelected
                                      ? 'bg-white text-black font-black scale-105 shadow-md shadow-white/5'
                                      : 'text-[#949494] hover:bg-[#1C1C1C] hover:text-white'
                                }`}
                              >
                                <span>{day.getDate()}</span>
                                {isToday && !isSelected && (
                                  <span className="absolute bottom-1 w-1 h-1 bg-white rounded-full animate-pulse" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Pilih Jam Survey
                  </label>
                  <div className="gap-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))' }}>
                    {TIME_SLOTS.map((time) => {
                      const disabled = isSlotDisabled(time);
                      const isSelected = selectedTimeSlot === time;

                      return (
                        <button
                          key={time}
                          type="button"
                          disabled={disabled}
                          onClick={() => setSelectedTimeSlot(time)}
                          className={`py-3 px-1 rounded-xl text-xs font-mono border text-center transition-all cursor-pointer ${
                            disabled 
                              ? 'bg-transparent text-[#3A3A3A] border-[#1C1C1C] line-through cursor-not-allowed'
                              : isSelected
                                ? 'bg-white text-black border-white font-bold scale-105 shadow-md shadow-white/10'
                                : 'bg-transparent text-[#949494] border-[#1C1C1C] hover:border-[#2A2A2A] hover:bg-[#141414] hover:text-white'
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Payment Type */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-wider border-b border-[#1A1A1C] pb-3 text-[#B0B0B0]">3. Pembayaran Sewa Kost</h3>
              
              <div>
                <button
                  type="button"
                  className="py-4 px-5 w-full rounded-xl border text-sm font-medium text-left transition-all bg-[#1C1C1C] text-white border-[#808080]"
                >
                  <p className="font-bold">Bayar Langsung di Tempat Kost</p>
                  <p className="text-[11px] text-[#A3A3A3] mt-1 font-normal font-sans">
                    Pembayaran sewa kost dilakukan secara cash/transfer langsung ke pemilik kost di lokasi survey setelah Anda setuju menempati kamar.
                  </p>
                </button>
              </div>
            </div>

            {/* Total Calculation & Submit */}
            <div className="bg-[#141414] border border-[#1A1A1C] rounded-2xl p-6 md:p-8 mt-12 space-y-4">
              <div className="flex justify-between items-center gap-4 text-sm text-[#A3A3A3]">
                <span className="truncate">Biaya Sewa Bulanan</span>
                <span className="font-mono text-white font-semibold whitespace-nowrap">{formatRupiah(kost.price)}/bln</span>
              </div>
              <div className="flex justify-between items-center gap-4 text-sm text-[#A3A3A3]">
                <span className="truncate">Pendaftaran Survey</span>
                <span className="font-mono text-emerald-400 font-bold uppercase tracking-wider whitespace-nowrap">Gratis</span>
              </div>
              <div className="border-t border-[#2A2A2A] pt-4 mt-4 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                  <p className="text-[10px] text-[#808080] font-mono uppercase tracking-widest mb-1">Total Pembayaran Sekarang</p>
                  <p className="text-3xl font-black tracking-tight text-white font-mono">Rp 0</p>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-white hover:bg-[#B0B0B0] text-black font-bold py-4 px-8 rounded-xl text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                >
                  {isSubmitting ? 'Memproses...' : 'Jadwalkan Survey'}
                </button>
              </div>
            </div>

          </form>
        </div>
      </div>
    </motion.div>
  );
}
