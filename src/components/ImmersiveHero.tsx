import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ChevronDown, Download, Smartphone, Search, Shield, Zap, Users } from 'lucide-react';
import KostCard from './KostCard';
import { Kost, HeroBanner } from '../types';
import { useState, useEffect } from 'react';
import { optimizeImageUrl } from '../utils/image';


const Marquee = () => {
  return (
    <div className="w-full h-48 md:h-64 relative overflow-hidden my-24 bg-transparent flex items-center justify-center">
      {/* Row 2: Kiri ke Kanan (Pita Abu Gelap, diputar berlawanan arah jarum jam) */}
      <div 
        className="absolute w-[120%] -left-[10%] py-4 bg-[#0A0A0A] border-y border-[#2A2A2A] text-[#9A9A9A] font-mono text-xs tracking-widest uppercase overflow-hidden shadow-lg select-none"
        style={{ transform: 'rotate(-3deg)' }}
      >
        <motion.div 
          className="flex whitespace-nowrap items-center gap-10"
          animate={{ x: ["-50%", "0%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>Smart Lock Access</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
              <span>High Speed Internet</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
              <span>24/7 Security System</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
              <span>Premium Boarding Rooms</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Row 1: Kanan ke Kiri (Pita Abu Terang, diputar searah jarum jam) */}
      <div 
        className="absolute w-[120%] -left-[10%] py-4 bg-[#0A0A0A] border-y border-[#2A2A2A] text-[#B0B0B0] font-mono text-xs tracking-widest uppercase overflow-hidden shadow-2xl select-none z-10"
        style={{ transform: 'rotate(3deg)' }}
      >
        <motion.div 
          className="flex whitespace-nowrap items-center gap-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 25, repeat: Infinity }}
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className="flex items-center gap-10">
              <span>Di Exclusive</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
              <span>Modern Minimalist Living</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
              <span>No Hidden Fees</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
              <span>Verified Listings Only</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#7A7A7A]"></span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    { q: "Apakah ada biaya tambahan di luar harga sewa?", a: "Tidak ada. Harga yang tertera sudah termasuk biaya listrik standar, air, dan fasilitas umum." },
    { q: "Bagaimana sistem pembayaran di Di?", a: "Pembayaran dapat dilakukan secara bulanan, per 3 bulan, atau tahunan (dengan diskon khusus) via transfer bank atau e-wallet." },
    { q: "Apakah boleh membawa tamu menginap?", a: "Tamu diperbolehkan berkunjung hingga jam 22.00. Untuk menginap, wajib lapor ke pengelola dan mungkin ada biaya tambahan." },
    { q: "Apakah bisa chat langsung dengan pemilik?", a: "Ya, setiap halaman detail kost memiliki fitur chat langsung dengan admin/pemilik kost untuk tanya ketersediaan dan negosiasi." },
    { q: "Bagaimana cara booking survey kost?", a: "Pilih kost yang diminati, klik 'Survey Now', atur tanggal dan jam survey, lalu lanjutkan ke pembayaran biaya survey." },
  ];

  return (
    <div className="max-w-3xl mx-auto px-8 py-20">
      <div className="mb-12 text-left">
        <p className="text-[#9A9A9A] font-mono text-xs tracking-[0.2em] uppercase mb-3">Support</p>
        <h2 className="text-3xl font-light text-white mb-4">Pertanyaan yang Sering Diajukan</h2>
        <div className="w-16 h-[1px] bg-[#7A7A7A]"></div>
      </div>
      <div className="space-y-0">
        {faqs.map((faq, i) => (
          <div 
            key={i} 
            className="border-b border-[#2A2A2A] group"
          >
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="w-full text-left py-5 flex items-center justify-between gap-4 cursor-pointer"
            >
              <h3 className="text-sm font-medium text-[#C0C0C0] group-hover:text-white transition-colors">{faq.q}</h3>
              <ChevronDown className={`w-4 h-4 text-[#9A9A9A] shrink-0 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
            </button>
            {openIndex === i && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pb-5"
              >
                <p className="text-sm text-[#B0B0B0] leading-relaxed pl-0">{faq.a}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const DownloadAPK = () => {
  return (
    <div className="max-w-7xl mx-auto px-8 py-24 pb-32 border-t border-[#2A2A2A]">
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-8 md:p-16 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative text-left">
        {/* Subtle cement texture overlay */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#1C1C1C] blur-[80px] rounded-full translate-x-1/2 -translate-y-1/2"></div>
        
        <div className="max-w-xl relative z-10">
          <p className="text-[#9A9A9A] font-mono text-xs tracking-[0.25em] uppercase mb-4 flex items-center gap-2">
            <Smartphone className="w-4 h-4" /> Di Mobile App
          </p>
          <h2 className="text-3xl md:text-5xl font-light text-white mb-6 leading-tight font-display">
            Cari & Pesan Kost <br /> <span className="font-semibold text-[#C0C0C0]">Lebih Cepat.</span>
          </h2>
          <p className="text-[#B0B0B0] leading-relaxed mb-8">
            Dapatkan pengalaman terbaik mencari kos premium idaman Anda langsung dari genggaman. Pantau tagihan, ajukan keluhan, dan perpanjang sewa hanya dengan satu ketukan.
          </p>
          <button className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-[#B0B0B0] transition-colors cursor-pointer">
            <Download className="w-5 h-5" />
            Download APK Sekarang
          </button>
        </div>
        
        <div className="relative z-10 hidden md:block mt-8 md:mt-0">
          {/* Minimalist phone mockup */}
          <div className="w-56 h-80 bg-[#0A0A0A] border-4 border-[#2A2A2A] rounded-[2.5rem] shadow-2xl overflow-hidden relative transform rotate-6 hover:rotate-0 transition-all duration-500">
            <div className="absolute top-0 inset-x-0 h-5 bg-[#1C1C1C] rounded-b-xl mx-14 z-20"></div>
            <div className="w-full h-full p-4 pt-10">
              <div className="w-full h-24 bg-[#1C1C1C] rounded-xl mb-3 border border-[#2A2A2A]"></div>
              <div className="w-full h-16 bg-[#141414] rounded-xl mb-3 border border-[#2A2A2A]"></div>
              <div className="w-full h-16 bg-[#141414] rounded-xl mb-3 border border-[#2A2A2A]"></div>
              <div className="w-3/4 h-10 bg-white rounded-lg mx-auto border border-[#2A2A2A]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ImmersiveHero({ onExploreClick, featuredKosts, onSelectKost, banners = [] }: { onExploreClick: () => void, featuredKosts: Kost[], onSelectKost: (k: Kost) => void, banners?: HeroBanner[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play the banner slider
  useEffect(() => {
    if (!banners || banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  // Card styles for stacked/peeking deck layout
  const getCardStyles = (idx: number) => {
    if (!banners || banners.length === 0) {
      return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 0, zIndex: 0 };
    }
    if (banners.length === 1) {
      return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 };
    }

    let diff = idx - currentSlide;
    if (diff < 0) diff += banners.length;

    // Active Card (Front)
    if (diff === 0) {
      return { x: 0, y: 0, scale: 1, rotate: 0, opacity: 1, zIndex: 30 };
    }
    // Middle peeking card (slightly offset to right and top)
    if (diff === 1) {
      return { x: 16, y: -16, scale: 0.95, rotate: 3, opacity: 0.65, zIndex: 20 };
    }
    // Back peeking card
    if (diff === 2) {
      return { x: 32, y: -32, scale: 0.90, rotate: 6, opacity: 0.35, zIndex: 10 };
    }
    // Card that just exited (Swipe left flyout)
    if (diff === banners.length - 1) {
      return { x: -500, y: 30, scale: 0.95, rotate: -12, opacity: 0, zIndex: 40 };
    }
    // Hidden
    return { x: 48, y: -48, scale: 0.85, rotate: 9, opacity: 0, zIndex: 5 };
  };
  
  return (
    <div className="w-full bg-[#0A0A0A] font-sans overflow-hidden">
      {/* Visually hidden h1 for heading hierarchy / accessibility */}
      <h1 className="sr-only">Di - Platform Sewa Kost Premium Indonesia</h1>
      {/* Top Navbar overlay */}
      <div className="w-full p-6 md:p-10 flex items-center justify-between">
        <div className="font-semibold tracking-[0.25em] text-white text-sm uppercase font-display">
          Di
        </div>
        <div className="flex items-center gap-4 md:gap-8 font-medium text-[10px] md:text-xs tracking-widest uppercase text-[#9A9A9A]">
          <button onClick={onExploreClick} className="hover:text-white transition-colors animate-pulse duration-1000 cursor-pointer min-h-[48px] min-w-[48px] flex items-center">Catalog</button>
          <a href="#faq-section" className="hover:text-white transition-colors min-h-[48px] flex items-center">FAQ</a>
          <a href="#download-section" className="hover:text-white transition-colors min-h-[48px] flex items-center">App</a>
        </div>
      </div>

      {/* Hero Section — Flat Industrialist Grid */}
      <div className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 gap-12 items-center px-8 md:px-24 py-12 pb-24 relative">
        {/* Subtle background grid texture */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Left Column (Content & Search) */}
        <div className="lg:col-span-7 flex flex-col justify-center relative z-10 text-left">
          <motion.p 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-[#9A9A9A] font-mono text-xs tracking-[0.25em] uppercase mb-6"
          >
            Premium Living Experience
          </motion.p>
          
          <h1 
            className="text-5xl md:text-7xl lg:text-8xl font-light tracking-tight leading-[0.95] mb-8 text-white font-display"
            aria-label="Elegance in Every Square Meter"
          >
            Elegance in <br />
            Every <span className="font-semibold text-[#C0C0C0]">Square Meter.</span>
          </h1>
          
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm text-[#B0B0B0] max-w-lg mb-10 leading-relaxed font-light"
          >
            Discover meticulously designed modular spaces that adapt to your lifestyle. Simplicity meets sophisticated comfort.
          </motion.p>

          {/* Search Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 mb-12 max-w-xl"
          >
            <div className="flex-1 bg-[#141414] border border-[#2A2A2A] rounded-xl px-5 py-3.5 flex items-center gap-3">
              <Search className="w-4 h-4 text-[#9A9A9A]" />
              <input
                type="text"
                placeholder="Cari lokasi atau nama kost..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[#7A7A7A] font-light"
              />
            </div>
            <button
              onClick={onExploreClick}
              className="bg-white text-black px-8 py-3.5 rounded-xl text-sm font-bold hover:bg-[#B0B0B0] transition-colors flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              Cari Kost
              <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          {/* Trust Stats */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-3 gap-8 max-w-md"
          >
            <div className="border-t border-[#2A2A2A] pt-4">
              <p className="text-2xl font-semibold text-white font-display">120+</p>
              <p className="text-[10px] text-[#9A9A9A] uppercase tracking-wider font-mono mt-1">Properti</p>
            </div>
            <div className="border-t border-[#2A2A2A] pt-4">
              <p className="text-2xl font-semibold text-white font-display">92.4%</p>
              <p className="text-[10px] text-[#9A9A9A] uppercase tracking-wider font-mono mt-1">Okupansi</p>
            </div>
            <div className="border-t border-[#2A2A2A] pt-4">
              <p className="text-2xl font-semibold text-white font-display">4.9 ★</p>
              <p className="text-[10px] text-[#9A9A9A] uppercase tracking-wider font-mono mt-1">Rating</p>
            </div>
          </motion.div>
        </div>

        {/* Right Column (Rotating Premium Image Banner Stack) */}
        <div className="lg:col-span-5 relative z-10 w-full flex justify-center lg:justify-end items-center mt-10 lg:mt-0 px-8">
          {banners && banners.length > 0 ? (
            <div className="relative w-full max-w-[440px] aspect-[4/5] flex items-center justify-center">
              {banners.map((banner, idx) => {
                const styles = getCardStyles(idx);
                const isActive = idx === currentSlide;

                return (
                  <motion.div
                    key={banner.id}
                    style={{ zIndex: styles.zIndex }}
                    animate={{
                       x: styles.x,
                       y: styles.y,
                       scale: styles.scale,
                       rotate: styles.rotate,
                       opacity: styles.opacity,
                    }}
                    transition={{ duration: 0.7, ease: [0.25, 0.8, 0.25, 1] }}
                    className="absolute inset-0 w-full h-full bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl origin-bottom"
                  >
                    <img
                      src={optimizeImageUrl(banner.image, 500, 60)}
                      alt={banner.title}
                      referrerPolicy="no-referrer"
                      loading={idx === currentSlide ? 'eager' : 'lazy'}
                      decoding="async"
                      width={440}
                      height={550}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    
                    {/* Linear dark gradient overlay and text details on the active card only */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="absolute inset-0 flex flex-col justify-end"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none"></div>
                          
                          <div className="p-6 md:p-8 flex flex-col gap-2 z-10 text-left">
                            <motion.h2 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2, duration: 0.5 }}
                              className="text-lg md:text-xl font-bold font-display text-white tracking-wide leading-snug"
                            >
                              {banner.title}
                            </motion.h2>
                            <motion.p 
                              initial={{ opacity: 0, y: 15 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3, duration: 0.5 }}
                              className="text-xs text-[#B0B0B0] font-light leading-relaxed max-w-sm"
                            >
                              {banner.subtitle}
                            </motion.p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}

              {/* Minimal Dot Indicators */}
              {banners.length > 1 && (
                <div className="absolute -bottom-10 right-0 flex items-center gap-0 z-20">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className="relative px-1 py-3 cursor-pointer flex items-center justify-center"
                      title={`Slide ${idx + 1}`}
                      aria-label={`Go to slide ${idx + 1}`}
                    >
                      <span className={`block h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/30 hover:bg-white/60'
                      }`} />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* Fallback skeleton/loader when banners are loading */
            <div className="w-full max-w-[420px] aspect-[4/5] bg-[#141414] border border-dashed border-[#2A2A2A] rounded-2xl flex flex-col items-center justify-center text-[#808080] text-xs">
              <span className="animate-pulse">Loading Banners...</span>
            </div>
          )}
        </div>

        {/* Scroll indicator */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
          className="absolute bottom-6 left-8 md:left-24 text-[#7A7A7A] flex items-center gap-2 text-xs font-mono uppercase tracking-widest z-10"
        >
          <span>Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </motion.div>
      </div>

      {/* Features Strip */}
      <div className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-[#2A2A2A] text-left">
        <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-colors group">
          <Shield className="w-5 h-5 text-[#B0B0B0] mb-4 group-hover:text-white transition-colors" />
          <div className="text-sm font-semibold text-white mb-2 font-display">Terverifikasi</div>
          <p className="text-xs text-[#9A9A9A] leading-relaxed">Setiap properti melewati proses verifikasi ketat untuk memastikan kenyamanan hunian Anda.</p>
        </div>
        <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-colors group">
          <Zap className="w-5 h-5 text-[#B0B0B0] mb-4 group-hover:text-white transition-colors" />
          <div className="text-sm font-semibold text-white mb-2 font-display">Booking Instan</div>
          <p className="text-xs text-[#9A9A9A] leading-relaxed">Proses pemesanan cepat dan transparan. Survey, bayar, dan pindah tanpa ribet.</p>
        </div>
        <div className="p-6 bg-[#141414] border border-[#2A2A2A] rounded-xl hover:border-[#3A3A3A] transition-colors group">
          <Users className="w-5 h-5 text-[#B0B0B0] mb-4 group-hover:text-white transition-colors" />
          <div className="text-sm font-semibold text-white mb-2 font-display">Chat Langsung</div>
          <p className="text-xs text-[#9A9A9A] leading-relaxed">Hubungi pemilik kost langsung melalui chat untuk tanya ketersediaan dan negosiasi.</p>
        </div>
      </div>

      <Marquee />

      {/* Section: Featured Rooms */}
      <div id="featured-section" className="w-full pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 border-b border-[#2A2A2A] pb-6 text-left">
            <div>
              <p className="text-[#9A9A9A] font-mono text-xs tracking-[0.2em] uppercase mb-2">Our Best Units</p>
              <h2 className="text-3xl md:text-4xl font-light tracking-tight text-white font-display">
                Kamar <span className="font-semibold text-[#C0C0C0]">Pilihan Terbaik.</span>
              </h2>
            </div>
            <button 
              onClick={onExploreClick}
              className="mt-4 sm:mt-0 flex items-center gap-2 text-sm text-[#9A9A9A] hover:text-white transition-colors cursor-pointer min-h-[48px]"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 lg:gap-6">
            {featuredKosts.map((kost) => (
              <KostCard key={kost.id} kost={kost} onSelect={onSelectKost} />
            ))}
          </div>
        </div>
      </div>
      
      <div id="faq-section">
        <FAQ />
      </div>
      
      <div id="download-section">
        <DownloadAPK />
      </div>
    </div>
  );
}
