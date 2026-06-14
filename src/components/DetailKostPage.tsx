import { motion } from 'motion/react';
import { MapPin, ArrowLeft, Star, Users, CheckCircle2, Navigation } from 'lucide-react';
import { Kost } from '../types';

interface DetailKostPageProps {
  kost: Kost;
  onClose: () => void;
  onBookNow: () => void;
}

export default function DetailKostPage({ kost, onClose, onBookNow }: DetailKostPageProps) {
  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans relative"
    >
      {/* Floating Action Header */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center pointer-events-none">
        <button 
          onClick={onClose}
          className="pointer-events-auto bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/10 text-white rounded-full px-5 py-2.5 flex items-center gap-2 text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Katalog
        </button>
      </div>

      {/* Gallery Section */}
      <div className="w-full relative bg-[#0A0A0A]">
        {(!kost.additionalImages || kost.additionalImages.length === 0) ? (
          // Single Image Cinematic Hero
          <div className="relative w-full h-[60vh] md:h-[70vh]">
            <img 
              src={kost.image} 
              alt={kost.name} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/20"></div>
            
            {/* Overlapping Hero Title */}
            <div className="absolute bottom-0 left-0 right-0 px-6 md:px-12 pb-12 z-10">
              <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="max-w-3xl">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm">
                      {kost.type} TARGET
                    </span>
                    <span className="px-3 py-1 bg-transparent border border-white/20 text-white text-[10px] font-mono uppercase tracking-widest rounded-sm backdrop-blur-sm">
                      {kost.roomClass} CLASS
                    </span>
                  </div>
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4">
                    {kost.name}
                  </h1>
                  <div className="flex items-center gap-2 text-[#B0B0B0] text-sm font-medium">
                    <MapPin className="w-4 h-4" />
                    {kost.address}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Multi-Image Gallery Layout
          <div className="w-full relative max-w-[1600px] mx-auto md:pt-4 md:px-4">
             {/* Desktop Grid Layout */}
             <div className="hidden md:grid grid-cols-4 grid-rows-2 h-[75vh] gap-3">
                <div className="col-span-3 row-span-2 relative rounded-3xl overflow-hidden group">
                  <img src={kost.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30"></div>
                  
                  {/* Title overlay inside large image */}
                  <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm">{kost.type} TARGET</span>
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-widest rounded-sm">{kost.roomClass} CLASS</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-3">{kost.name}</h1>
                    <div className="flex items-center gap-2 text-[#B0B0B0] text-base font-medium">
                      <MapPin className="w-5 h-5" />
                      {kost.address}
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group bg-[#141414]">
                  <img src={kost.additionalImages[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 1" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                
                <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group bg-[#141414]">
                  {kost.additionalImages.length > 1 ? (
                    <>
                      <img src={kost.additionalImages[1]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 2" />
                      {kost.additionalImages.length > 2 && (
                         <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm cursor-pointer hover:bg-black/70 transition-colors">
                           <span className="text-white font-bold tracking-widest text-sm uppercase">+{kost.additionalImages.length - 2} Foto Lainnya</span>
                         </div>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full bg-[#141414] border border-[#1C1C1C] flex items-center justify-center text-[#606060] font-mono text-xs">Kosong</div>
                  )}
                </div>
             </div>

             {/* Mobile view - Horizontal Snap Scroll */}
             <div className="md:hidden flex overflow-x-auto snap-x snap-mandatory h-[65vh] w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                <div className="min-w-full h-full snap-center relative flex-shrink-0">
                  <img src={kost.image} className="w-full h-full object-cover" alt="Cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/20"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="px-2 py-1 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-sm">{kost.type}</span>
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tight leading-[1.1] mb-2">{kost.name}</h1>
                    <div className="flex items-center gap-2 text-[#B0B0B0] text-xs">
                      <MapPin className="w-3.5 h-3.5" />
                      {kost.address}
                    </div>
                  </div>
                </div>
                {kost.additionalImages.map((img, idx) => (
                  <div key={idx} className="min-w-full h-full snap-center relative flex-shrink-0">
                    <img src={img} className="w-full h-full object-cover" alt={`Gallery ${idx+1}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/20"></div>
                  </div>
                ))}
             </div>
             
             {/* Pagination Dots for Mobile */}
             <div className="md:hidden absolute bottom-6 right-6 z-20 flex gap-1.5 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                {kost.additionalImages.map((_, idx) => (
                   <div key={idx} className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                ))}
             </div>
          </div>
        )}
      </div>

      {/* Main Content Area - Split Editorial Layout */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 relative w-full">
        
        {/* Left Column - Details (Takes 7 cols) */}
        <div className="lg:col-span-7 space-y-12">
          {/* Key Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-[#1A1A1C]">
            <div>
              <p className="text-[10px] text-[#808080] font-mono uppercase tracking-widest mb-2">Rating</p>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-white fill-white" />
                <span className="text-xl font-bold">{kost.rating.toFixed(1)}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-[#808080] font-mono uppercase tracking-widest mb-2">Kapasitas</p>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-white" />
                <span className="text-xl font-bold">{kost.totalRooms} Unit</span>
              </div>
            </div>
            <div className="col-span-2 md:col-span-2">
              <p className="text-[10px] text-[#808080] font-mono uppercase tracking-widest mb-2">Ketersediaan</p>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-white" />
                <span className="text-xl font-bold">{kost.availableRooms} Kamar Kosong</span>
              </div>
            </div>
          </div>

          {/* Description Article */}
          <article className="prose prose-invert prose-p:text-[#A3A3A3] prose-p:leading-relaxed prose-p:font-light max-w-none">
            <h3 className="text-xl font-medium text-white mb-4">Tentang Properti Ini</h3>
            <p className="text-base md:text-lg">{kost.description}</p>
          </article>

          {/* Facilities */}
          <div>
            <h3 className="text-xl font-medium text-white mb-6">Fasilitas Eksklusif</h3>
            <div className="grid grid-cols-2 gap-4">
              {kost.facilities.map((fac, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#141414] border border-[#1C1C1C] p-4 rounded-2xl">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#808080]"></div>
                  <span className="text-[#B0B0B0] text-sm font-medium">{fac}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Map */}
          <div>
            <h3 className="text-xl font-medium text-white mb-6 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-[#808080]" />
              Lokasi Peta
            </h3>
            <div className="w-full h-[400px] rounded-3xl overflow-hidden border border-[#1A1A1C] bg-[#141414]">
              <iframe 
                title={`Peta lokasi ${kost.name}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(kost.address)}&output=embed`} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                className="grayscale opacity-80 mix-blend-screen"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Right Column - Sticky Reservation Widget (Takes 5 cols) */}
        <div className="lg:col-span-5 relative">
          <div className="sticky top-8 bg-[#141414] border border-[#2A2A2A] p-8 rounded-3xl shadow-2xl">
            <div className="pb-6 border-b border-[#2A2A2A] mb-6 flex items-end justify-between">
              <div>
                <p className="text-[10px] text-[#808080] font-mono uppercase tracking-widest mb-2">Harga Sewa / Bulan</p>
                <div className="text-3xl font-black tracking-tight">{formatRupiah(kost.price)}</div>
              </div>
            </div>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm text-[#A3A3A3]">
                <span>Tipe Properti</span>
                <strong className="text-white font-medium">{kost.roomClass}</strong>
              </div>
              <div className="flex justify-between items-center text-sm text-[#A3A3A3]">
                <span>Status Ketersediaan</span>
                <strong className="text-white font-medium">{kost.availableRooms > 0 ? 'Tersedia' : 'Penuh'}</strong>
              </div>
              <div className="flex justify-between items-center text-sm text-[#A3A3A3]">
                <span>Dikelola Oleh</span>
                <strong className="text-white font-medium">{kost.author}</strong>
              </div>
            </div>

            <button
              onClick={onBookNow}
              disabled={kost.availableRooms === 0}
              className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-[#B0B0B0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {kost.availableRooms > 0 ? 'Mulai Reservasi' : 'Kamar Penuh'}
            </button>
            <p className="text-center text-[10px] text-[#808080] font-mono mt-4 uppercase tracking-widest">
              Belum dipungut biaya saat ini
            </p>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
