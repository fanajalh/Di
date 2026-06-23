import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowLeft, Star, Users, CheckCircle2, Navigation, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Kost } from '../types';
import { optimizeImageUrl } from '../utils/image';

interface DetailKostPageProps {
  kost: Kost;
  onClose: () => void;
  onBookNow: () => void;
}

export default function DetailKostPage({ kost, onClose, onBookNow }: DetailKostPageProps) {
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const [currentMobileIndex, setCurrentMobileIndex] = useState<number>(0);
  const mobileScrollRef = useRef<HTMLDivElement>(null);

  const allImages = [kost.image, ...(kost.additionalImages || [])];

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;
    if (width > 0) {
      const index = Math.round(scrollLeft / width);
      if (index !== currentMobileIndex) {
        setCurrentMobileIndex(index);
      }
    }
  };

  const scrollToMobileIndex = (index: number) => {
    if (mobileScrollRef.current) {
      const width = mobileScrollRef.current.clientWidth;
      mobileScrollRef.current.scrollTo({
        left: index * width,
        behavior: 'smooth'
      });
      setCurrentMobileIndex(index);
    }
  };

  // Handle keyboard navigation for Lightbox
  useEffect(() => {
    if (activeImageIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveImageIndex((prev) => (prev !== null && prev < allImages.length - 1 ? prev + 1 : prev));
      } else if (e.key === 'ArrowLeft') {
        setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
      } else if (e.key === 'Escape') {
        setActiveImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, allImages.length]);

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#0A0A0A] text-white flex flex-col font-sans relative pb-24 md:pb-0"
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
        {/* DESKTOP VIEW */}
        <div className="hidden md:block">
          {(!kost.additionalImages || kost.additionalImages.length === 0) ? (
            // Single Image Cinematic Hero
            <div className="relative w-full h-[70vh] cursor-pointer" onClick={() => setActiveImageIndex(0)}>
              <img 
                src={optimizeImageUrl(kost.image, 1200, 75)} 
                alt={kost.name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 to-black/20 rounded-3xl"></div>
              
              {/* Overlapping Hero Title */}
              <div className="absolute bottom-0 left-0 right-0 px-12 pb-12 z-10">
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
                    <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-4 break-words">
                      {kost.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-2 text-[#B0B0B0] text-sm font-medium">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="break-words">{kost.address}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Multi-Image Gallery Layout
            <div className="w-full relative max-w-[1600px] mx-auto pt-4 px-4">
              <div className="grid grid-cols-4 grid-rows-2 h-[75vh] gap-3">
                <div className="col-span-3 row-span-2 relative rounded-3xl overflow-hidden group cursor-pointer" onClick={() => setActiveImageIndex(0)}>
                  <img src={optimizeImageUrl(kost.image, 1200, 75)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-black/30"></div>
                  
                  {/* Title overlay inside large image */}
                  <div className="absolute bottom-0 left-0 right-0 p-12 z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="px-3 py-1 bg-white text-black text-[10px] font-black uppercase tracking-widest rounded-sm">{kost.type} TARGET</span>
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-widest rounded-sm">{kost.roomClass} CLASS</span>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-[1.1] mb-3 break-words">{kost.name}</h1>
                    <div className="flex flex-wrap items-center gap-2 text-[#B0B0B0] text-base font-medium">
                      <MapPin className="w-5 h-5 shrink-0" />
                      <span className="break-words">{kost.address}</span>
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group bg-[#141414] cursor-pointer" onClick={() => setActiveImageIndex(1)}>
                  <img src={optimizeImageUrl(kost.additionalImages[0], 400, 70)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 1" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                </div>
                
                <div className="col-span-1 row-span-1 relative rounded-3xl overflow-hidden group bg-[#141414] cursor-pointer" onClick={() => setActiveImageIndex(2)}>
                  {kost.additionalImages.length > 1 ? (
                    <>
                      <img src={optimizeImageUrl(kost.additionalImages[1], 400, 70)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery 2" />
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
            </div>
          )}
        </div>

        {/* MOBILE VIEW (Shopee Taller Aspect Ratio Image Carousel with Gradient) */}
        <div className="md:hidden w-full relative">
          <div 
            ref={mobileScrollRef}
            onScroll={handleMobileScroll}
            className="flex overflow-x-auto snap-x snap-mandatory w-full h-[60vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-[#141414]"
          >
            <div className="min-w-full h-full snap-center relative flex-shrink-0 cursor-pointer" onClick={() => setActiveImageIndex(0)}>
              <img src={optimizeImageUrl(kost.image, 600, 75)} className="w-full h-full object-cover" alt="Cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15"></div>
            </div>
            {kost.additionalImages && kost.additionalImages.map((img, idx) => (
              <div key={idx} className="min-w-full h-full snap-center relative flex-shrink-0 cursor-pointer" onClick={() => setActiveImageIndex(idx + 1)}>
                <img src={optimizeImageUrl(img, 600, 75)} className="w-full h-full object-cover" alt={`Gallery ${idx+1}`} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/15"></div>
              </div>
            ))}
          </div>

          {/* Bottom Blend Gradient Overlay */}
          <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/70 to-transparent pointer-events-none z-10"></div>
          
          {/* Pagination Dots for Mobile */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 right-4 z-20 flex gap-2 bg-black/60 backdrop-blur-md px-3 py-2 rounded-full border border-white/10 items-center">
              {allImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    scrollToMobileIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    currentMobileIndex === idx ? 'bg-white scale-110' : 'bg-white/30 hover:bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile-only Info Section (Shopee-like UX) */}
      <div className="md:hidden px-6 pt-6 pb-2 space-y-4 border-b border-[#1A1A1C] text-left">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-sm">
            {kost.type}
          </span>
          <span className="px-2.5 py-0.5 bg-transparent border border-white/20 text-[#A3A3A3] text-[9px] font-mono uppercase tracking-widest rounded-sm">
            {kost.roomClass} CLASS
          </span>
        </div>
        
        <h1 className="text-xl font-bold text-white tracking-tight leading-[1.2] break-words">
          {kost.name}
        </h1>

        <div className="text-xl font-black text-white tracking-tight font-mono">
          {formatRupiah(kost.price)}<span className="text-xs text-[#808080] font-normal font-sans"> / bulan</span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-[#808080] text-xs leading-relaxed">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="break-words text-left">{kost.address}</span>
        </div>
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
              className="hidden md:block w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-[#B0B0B0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {kost.availableRooms > 0 ? 'Mulai Reservasi' : 'Kamar Penuh'}
            </button>
            <p className="hidden md:block text-center text-[10px] text-[#808080] font-mono mt-4 uppercase tracking-widest">
              Belum dipungut biaya saat ini
            </p>
          </div>
        </div>

      </div>

      {/* Sticky Bottom Bar for Mobile (Shopee-like UX) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#141414]/95 backdrop-blur-md border-t border-[#2A2A2A] px-5 py-4 flex items-center justify-between shadow-2xl safe-bottom">
        <div>
          <p className="text-[9px] text-[#808080] font-mono uppercase tracking-widest mb-0.5">Harga Sewa</p>
          <p className="text-base font-black text-white leading-none">
            {formatRupiah(kost.price)}<span className="text-[10px] text-[#808080] font-normal font-sans">/bln</span>
          </p>
        </div>
        <button
          onClick={onBookNow}
          disabled={kost.availableRooms === 0}
          className="bg-white text-black text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg shadow-white/5"
        >
          {kost.availableRooms > 0 ? 'Reservasi' : 'Penuh'}
        </button>
      </div>

      {/* Fullscreen Lightbox Modal */}
      <AnimatePresence>
        {activeImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col justify-between p-6 select-none"
          >
            {/* Top Header */}
            <div className="flex justify-between items-center w-full z-10">
              <span className="text-xs font-mono uppercase tracking-widest text-[#808080]">
                Gambar {activeImageIndex + 1} dari {allImages.length}
              </span>
              <button
                onClick={() => setActiveImageIndex(null)}
                className="bg-white/5 border border-white/10 hover:bg-white/20 text-white rounded-full p-2.5 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Area: Image with Navigation Controls */}
            <div className="flex-grow flex items-center justify-between gap-6 max-h-[70vh] relative my-auto">
              {/* Left Arrow */}
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : 0))}
                disabled={activeImageIndex === 0}
                className="bg-white/5 border border-white/10 text-white hover:bg-white/20 p-3.5 rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0 z-10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Centered Image */}
              <div className="relative max-w-full max-h-full flex items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-[#0D0D0E]">
                <motion.img
                  key={activeImageIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  src={allImages[activeImageIndex]}
                  alt={`Preview ${activeImageIndex + 1}`}
                  className="max-w-full max-h-[65vh] object-contain rounded-2xl"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Right Arrow */}
              <button
                onClick={() => setActiveImageIndex((prev) => (prev !== null && prev < allImages.length - 1 ? prev + 1 : prev))}
                disabled={activeImageIndex === allImages.length - 1}
                className="bg-white/5 border border-white/10 text-white hover:bg-white/20 p-3.5 rounded-full transition-all disabled:opacity-20 disabled:cursor-not-allowed cursor-pointer shrink-0 z-10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Bottom Area: Thumbnails Selector */}
            <div className="w-full flex justify-center gap-3 overflow-x-auto py-4 scrollbar-none z-10">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-16 h-16 rounded-xl overflow-hidden cursor-pointer transition-all shrink-0 ${
                    activeImageIndex === idx
                      ? 'border-2 border-white scale-105'
                      : 'border border-white/10 opacity-40 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
