import { motion } from 'motion/react';
import { Star, MapPin, Wifi, ArrowRight } from 'lucide-react';
import { Kost } from '../types';
import { optimizeImageUrl } from '../utils/image';

interface KostCardProps {
  kost: Kost;
  onSelect: (kost: Kost) => void;
}

export default function KostCard({ kost, onSelect }: KostCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getFacilityIcon = (facilityName: string) => {
    switch (facilityName.toLowerCase()) {
      case 'wifi':
        return <span title="WiFi Gratis"><Wifi className="w-3 h-3" /></span>;
      case 'ac':
        return <span className="text-[9px] font-mono font-bold" title="Pendingin Ruangan (AC)">AC</span>;
      case 'kamar mandi dalam':
        return <span className="text-[9px] font-mono leading-none font-bold" title="Kamar Mandi Dalam">KM</span>;
      case 'springbed':
        return <span className="text-[9px] font-mono leading-none font-semibold" title="Kasur Springbed">Bed</span>;
      default:
        return <span className="w-1 h-1 bg-[#808080] rounded-full"></span>;
    }
  };

  return (
    <motion.div
      id={`kost-card-${kost.id}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4 }}
      className="group bg-[#141414] rounded-xl border border-[#2A2A2A] hover:border-[#3A3A3A] overflow-hidden cursor-pointer transition-all duration-300 flex flex-col sm:flex-row h-auto sm:h-48 text-left"
    >
      {/* Image Section (Left/Top) */}
      <div className="relative w-full h-48 sm:w-1/3 sm:h-full shrink-0 overflow-hidden">
        <img
          src={optimizeImageUrl(kost.image, 400, 60)}
          alt={kost.name}
          referrerPolicy="no-referrer"
          loading="lazy"
          decoding="async"
          width={400}
          height={300}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-[#141414]/50 sm:from-transparent via-transparent to-black/30"></div>
        
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-wrap gap-1.5">
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-white/90 text-black shadow-sm">
            {kost.type}
          </span>
          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#0A0A0A]/70 backdrop-blur-md text-[#B0B0B0] border border-[#3A3A3A]">
            {kost.roomClass}
          </span>
        </div>
      </div>

      {/* Content Section (Right) */}
      <div className="p-3 sm:p-5 flex flex-col justify-between flex-1 min-w-0 bg-[#141414]">
        <div>
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-base font-semibold text-white tracking-tight leading-snug line-clamp-1">
              {kost.name}
            </h3>
            <div className="flex items-center gap-1 bg-white/5 px-1.5 py-0.5 rounded text-[#B0B0B0] shrink-0">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-xs font-semibold">{kost.rating.toFixed(1)}</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#808080] mb-3">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{kost.location} • {kost.address}</span>
          </div>

          {/* Facilities (max 4 to keep it clean) */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {kost.facilities.slice(0, 4).map((fac, idx) => (
              <span 
                key={idx} 
                className="inline-flex items-center justify-center p-1 min-w-[24px] h-[24px] bg-[#1C1C1C] border border-[#2A2A2A] text-[#949494] rounded hover:bg-[#2A2A2A] hover:text-[#B0B0B0] transition-colors"
              >
                {getFacilityIcon(fac)}
              </span>
            ))}
            {kost.facilities.length > 4 && (
              <span className="inline-flex items-center justify-center px-1.5 h-[24px] text-[10px] text-[#808080]">
                +{kost.facilities.length - 4}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between pt-2 sm:pt-3 border-t border-[#2A2A2A] gap-2 sm:gap-0">
          <div>
            <p className="text-[9px] sm:text-[10px] text-[#808080] mb-0.5">Mulai dari</p>
            <p className="text-sm sm:text-lg font-semibold text-white leading-none">
              {formatPrice(kost.price)}
              <span className="text-[10px] sm:text-xs font-normal text-[#808080]">/bln</span>
            </p>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(kost);
            }}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-[#B0B0B0] text-black px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-[10px] sm:text-xs font-medium transition-colors shrink-0"
          >
            Lihat Detail
            <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
