import { useState } from 'react';
import { useSession } from './AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Edit2, 
  Save, 
  X, 
  ShieldAlert, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  Bookmark,
  Sparkles,
  Info 
} from 'lucide-react';
import { Booking } from '../types';

interface UserProfilePageProps {
  bookings: Booking[];
}

export default function UserProfilePage({ bookings }: UserProfilePageProps) {
  const { session, signOut, updateProfile } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form states
  const [editName, setEditName] = useState(session?.user.name || '');
  const [editEmail, setEditEmail] = useState(session?.user.email || '');
  const [editPhone, setEditPhone] = useState(session?.user.phone || '');
  const [editAddress, setEditAddress] = useState(session?.user.address || '');
  const [editBio, setEditBio] = useState(session?.user.bio || '');

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center p-16 bg-[#141414] rounded-2xl border border-[#2A2A2A] max-w-md mx-auto my-12 text-center">
        <ShieldAlert className="w-12 h-12 text-[#808080] mb-4" />
        <h3 className="text-white font-sans font-bold text-lg">Akses Terbatas</h3>
        <p className="text-[#808080] text-xs mt-2 leading-relaxed">
          Silakan masuk melalui panel login terlebih dahulu untuk mengakses data profil personal Anda.
        </p>
      </div>
    );
  }

  const handleStartEdit = () => {
    setEditName(session.user.name);
    setEditEmail(session.user.email);
    setEditPhone(session.user.phone || '');
    setEditAddress(session.user.address || '');
    setEditBio(session.user.bio || '');
    setIsEditing(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName,
      email: editEmail,
      phone: editPhone,
      address: editAddress,
      bio: editBio
    });
    setIsEditing(false);
  };

  // Filter bookings to match the logged-in user name
  const myBookings = bookings.filter(b => 
    b.userName.toLowerCase().includes(session.user.name.split(' ')[0].toLowerCase()) ||
    b.userPhone === session.user.phone
  );

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <div className="space-y-8 bg-[#0A0A0A] text-white min-h-screen p-4 md:p-8">
      {/* Upper Profile Cover header banner code */}
      <div className="relative rounded-2xl overflow-hidden border border-[#2A2A2A] bg-gradient-to-r from-[#1C1C1C] via-[#141414] to-[#0A0A0A] p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <img 
              src={session.user.image} 
              alt={session.user.name}
              referrerPolicy="no-referrer"
              className="w-24 h-24 rounded-2xl object-cover border border-[#2A2A2A] shadow-lg shadow-black/40 group-hover:brightness-90 transition-all"
            />
          </div>

          <div className="text-center md:text-left">
            <div className="flex items-center gap-2.5 justify-center md:justify-start">
              <h2 className="text-xl md:text-2xl font-sans font-black text-white">{session.user.name}</h2>
              <span className="text-[9px] font-mono uppercase bg-white/5 text-[#A3A3A3] border border-[#2A2A2A] px-2.5 py-0.5 rounded-full font-bold">
                {session.user.role} Verified
              </span>
            </div>
            
            <p className="text-xs text-[#808080] mt-1 font-sans font-light max-w-md">
              {session.user.bio || 'Belum ada deskripsi profil bio ditambahkan.'}
            </p>
            
            <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3 justify-center md:justify-start text-xs text-[#808080] font-mono">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#949494]" />
                Gabung: {session.user.joinedDate || '2026-06-12'}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#949494]" />
                {session.user.address || 'DKI Jakarta'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row items-center gap-3">
          <button
            onClick={handleStartEdit}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-[#2A2A2A] rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <Edit2 className="w-3.5 h-3.5" />
            Edit Profil
          </button>
          
          <button
            onClick={signOut}
            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-[#2A2A2A] text-[#A3A3A3] hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            Keluar akun
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Full editable details form */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 md:p-6 space-y-6">
          <h3 className="font-sans font-black text-xs uppercase tracking-wider text-[#808080] flex items-center gap-2">
            <User className="w-4 h-4 text-[#949494]" />
            Detail Identifikasi Personal
          </h3>

          {isEditing ? (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#808080] tracking-wider mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#808080]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#808080] tracking-wider mb-1">Email Klien</label>
                <input
                  type="email"
                  required
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#808080]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#808080] tracking-wider mb-1">No WhatsApp</label>
                <input
                  type="text"
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#808080]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#808080] tracking-wider mb-1">Alamat Asal</label>
                <input
                  type="text"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#808080]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#808080] tracking-wider mb-1">Biografi/Minat Hunian</label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#808080] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 py-2 rounded-xl border border-[#2A2A2A] hover:bg-white/5 text-xs font-bold text-[#949494] hover:text-white"
                >
                  <X className="w-3.5 h-3.5 inline mr-1" />
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-white hover:bg-[#B0B0B0] text-xs font-bold text-black"
                >
                  <Save className="w-3.5 h-3.5 inline mr-1" />
                  Simpan
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#808080]" />
                  <span className="text-[#808080]">Alamat Email</span>
                </div>
                <span className="font-semibold text-white">{session.user.email}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#808080]" />
                  <span className="text-[#808080]">Kontak Ponsel</span>
                </div>
                <span className="font-mono font-semibold text-white">{session.user.phone || '-'}</span>
              </div>

              <div className="flex items-center justify-between pb-3 border-b border-[#2A2A2A]">
                <div className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-[#808080]" />
                  <span className="text-[#808080]">Tipe Lisensi</span>
                </div>
                <span className="font-mono bg-white/5 border border-[#2A2A2A] px-2 py-0.5 rounded text-white">{session.user.role}</span>
              </div>

              {/* Security info tips box */}
              <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl p-3 flex gap-2.5 items-start">
                <Info className="w-4 h-4 text-[#808080] shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-[10px] uppercase font-mono">Catatan Keamanan</h4>
                  <p className="text-[10px] text-[#808080] mt-0.5 leading-relaxed">
                    Sesi aman Anda dilindungi oleh Token. Kredensial tidak akan diungkapkan kepada pihak eksternal non-terafiliasi.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Reservation / Booking status specific to user */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 md:p-6">
            <h3 className="font-sans font-black text-xs uppercase tracking-wider text-[#808080] mb-6 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#949494]" />
              Riwayat Sewa Unit Kos Terdaftar ({myBookings.length})
            </h3>

            {myBookings.length === 0 ? (
              <div className="py-12 text-center text-[#808080] max-w-sm mx-auto">
                <Clock className="w-8 h-8 mx-auto text-[#606060] mb-3" />
                <p className="text-xs font-semibold text-white">Belum Ada Riwayat Pemesanan</p>
                <p className="text-[11px] text-[#808080] mt-1 leading-relaxed">
                  Data pemesanan akan otomatis terakumulasi di sini setelah Anda mengajukan pemesanan di menu katalog kost.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {myBookings.map((book) => (
                  <div 
                    key={book.id} 
                    className="p-4 bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={book.kostImage} 
                        alt={book.kostName}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 object-cover rounded-lg border border-[#2A2A2A]"
                      />
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#0A0A0A] border border-[#2A2A2A] font-bold text-[#808080]">
                            {book.id.toUpperCase()}
                          </span>
                          {book.status === 'Pending' ? (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#0A0A0A] text-[#A3A3A3] border border-[#606060]">
                              PENDING
                            </span>
                          ) : book.status === 'Disetujui' ? (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#0A0A0A] text-white border border-[#606060]">
                              AKTIF SEWA
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-[#0A0A0A] text-[#808080] border border-[#2A2A2A]">
                              DITOLAK
                            </span>
                          )}
                        </div>

                        <h4 className="font-bold text-white text-xs mt-1 truncate max-w-[240px]">{book.kostName}</h4>
                        <p className="text-[10px] text-[#808080] font-mono mt-0.5">Jadwal Survey: {book.startDate} @ {book.surveyTime || '—'}</p>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-y-0 border-[#2A2A2A] pt-2 sm:pt-0">
                      <span className="text-[10px] text-[#808080] font-mono">Biaya Survey</span>
                      <span className="font-mono font-bold text-xs text-emerald-400 mt-0.5">Gratis</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
