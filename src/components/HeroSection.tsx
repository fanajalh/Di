import { motion } from 'motion/react';
import IsometricRoom from './3d/IsometricRoom';
import { Search, MapPin, Shield, Star } from 'lucide-react';

interface HeroSectionProps {
  onSearchClick: () => void;
  onExploreClick: () => void;
  onDashboardClick: () => void;
}

export default function HeroSection({ onSearchClick, onExploreClick, onDashboardClick }: HeroSectionProps) {
  // Framer Motion staggered variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring' as const, damping: 25, stiffness: 100 },
    },
  };

  return (
    <section className="relative min-h-[85vh] flex items-center pt-8 pb-16 overflow-hidden bg-[#0A0A0B]">
      {/* Dynamic dark abstract mesh gradient background with subtle red/purple hues */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[30rem] h-[30rem] bg-red-600/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-[25rem] h-[25rem] bg-indigo-950/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10 w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Staggered Content Area */}
          <motion.div 
            className="lg:col-span-7 flex flex-col justify-center text-left text-white"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Minimal Brand Tagline */}
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center px-4 py-1.5 rounded-full bg-red-600/10 border border-red-600/20 text-red-500 text-xs font-semibold mb-6 w-fit uppercase tracking-widest font-sans"
            >
              Sewa Kost Modern & Terpercaya
            </motion.div>

            {/* Giant Display Headline */}
            <motion.h1 
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-sans font-black leading-[0.95] mb-6 uppercase tracking-tight"
            >
              TEMUKAN KOST<br/>
              <span className="text-red-600 italic font-black">IMPIANMU</span>
            </motion.h1>

            {/* Description Text */}
            <motion.p 
              variants={itemVariants}
              className="text-gray-400 text-base md:text-lg font-sans leading-relaxed max-w-xl mb-8"
            >
              Platform pencarian kost nomor satu dengan visualisasi 3D isometric untuk memastikan kenyamanan hunian masa depan Anda. Bebas tebak-tebakan, kelilingi seluruh sudut kamar, dan sewa dalam satu klik.
            </motion.p>

            {/* Scale-up CTA Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap gap-4 items-center mb-10"
            >
              <motion.button
                id="cta-explore"
                onClick={onExploreClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm flex items-center gap-3 transition-all duration-200 cursor-pointer shadow-lg shadow-red-600/20"
              >
                <Search className="w-4 h-4" />
                Mulai Cari Kost
              </motion.button>

              <motion.button
                id="cta-dashboard"
                onClick={onDashboardClick}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 text-sm flex items-center gap-2 transition-all duration-200 cursor-pointer"
              >
                Owner Dashboard
              </motion.button>
            </motion.div>

            {/* Trust Badges Bar */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/5 max-w-lg"
            >
              <div>
                <p className="text-2xl md:text-3xl font-sans font-bold text-white mb-1">
                  120+
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                  Properti Aktif
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-sans font-bold text-white mb-1">
                  92.4%
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                  Okupansi Rata-rata
                </p>
              </div>
              <div>
                <p className="text-2xl md:text-3xl font-sans font-bold text-white mb-1 flex items-center gap-1">
                  4.9 <Star className="w-4 h-4 text-amber-500 fill-amber-500 inline" />
                </p>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-mono">
                  Review Bintang 5
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Interactive Isometric Room Canvas */}
          <div className="lg:col-span-5 h-[340px] md:h-[450px] lg:h-[500px] w-full relative">
            {/* Decorative background visual circles */}
            <div className="absolute inset-0 bg-red-600/5 rounded-full blur-2xl top-12 left-12 animate-pulse duration-[8000ms]"></div>
            
            {/* The actual isometric R3F canvas view */}
            <IsometricRoom />

            {/* Glowing mini info box overlay */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute -bottom-4 -left-3 bg-[#121214] border border-white/10 px-4 py-3 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-2xl z-20 pointer-events-auto"
            >
              <div className="p-2.5 bg-red-600/10 rounded-xl border border-red-600/20">
                <Shield className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-xs font-mono text-red-500 font-bold uppercase tracking-wider">Garansi Keamanan</p>
                <p className="text-[11px] text-gray-400 font-sans mt-0.5">Sistem verifikasi unit real-time 3D</p>
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
