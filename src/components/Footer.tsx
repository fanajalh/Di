import { Building, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-[#2A2A2A] pt-12 pb-8 text-[#6B6B6B] mt-20">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          
          {/* Logo brand & tagline */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white rounded-lg text-black">
                <Building className="w-4 h-4" />
              </div>
              <span className="text-lg font-display font-extrabold text-white">
                Di
              </span>
            </div>
            
            <p className="text-xs text-[#5A5A5A] font-sans max-w-sm leading-relaxed">
              Di adalah platform pemesanan kamar kost premium paling inovatif di Indonesia. Mengintegrasikan kemudahan visualisasi kamar dengan penawaran sewa mingguan, bulanan, dan tahunan yang didukung penuh garansi ketersediaan.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="font-display font-semibold text-white tracking-widest uppercase">Layanan Kota</h4>
            <ul className="space-y-2">
              <li className="hover:text-white transition-colors cursor-pointer">Kost Jakarta Pusat & Barat</li>
              <li className="hover:text-white transition-colors cursor-pointer">Kost Bandung Dago</li>
              <li className="hover:text-white transition-colors cursor-pointer">Kost Depok UI & Salemba</li>
              <li className="hover:text-white transition-colors cursor-pointer">Kost Yogyakarta Kaliurang</li>
            </ul>
          </div>

          {/* Contacts info */}
          <div className="md:col-span-4 space-y-3 text-xs">
            <h4 className="font-display font-semibold text-white tracking-widest uppercase">Hubungi Di</h4>
            <ul className="space-y-2.5">
              <li className="flex items-center gap-2 text-[#5A5A5A]">
                <MapPin className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                <span>Menara Thamrin, Lantai 12, Jakarta</span>
              </li>
              <li className="flex items-center gap-2 text-[#5A5A5A]">
                <Phone className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                <span>+62 821-3456-7890</span>
              </li>
              <li className="flex items-center gap-2 text-[#5A5A5A]">
                <Mail className="w-4 h-4 text-[#6B6B6B] shrink-0" />
                <span>support@di.id</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright alignment */}
        <div className="border-t border-[#2A2A2A] pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#3A3A3A] font-mono gap-3">
          <p>© {new Date().getFullYear()} Di. Seluruh hak cipta dilindungi.</p>
          <p>Dibuat dengan standard kenyamanan premium.</p>
        </div>
      </div>
    </footer>
  );
}
