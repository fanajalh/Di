import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  SlidersHorizontal, 
  Check, 
  RefreshCcw,
  MapPin,
  User,
  Layers,
  DollarSign,
  Grid
} from 'lucide-react';
import { FilterState } from '../types';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  availableLocations: string[];
}

export default function FilterSidebar({ filters, onFilterChange, availableLocations }: FilterSidebarProps) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const roomTypes = ['All', 'Putra', 'Putri', 'Campur'];
  const roomClasses = ['All', 'Standar', 'VIP', 'Eksklusif'];
  const facilityOptions = ['WiFi', 'AC', 'Kamar Mandi Dalam', 'Springbed', 'Lemari', 'Meja'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const updateFilter = (updatedFields: Partial<FilterState>) => {
    onFilterChange({
      ...filters,
      ...updatedFields,
    });
  };

  const toggleFacility = (facility: string) => {
    const isSelected = filters.facilities.includes(facility);
    const updated = isSelected 
      ? filters.facilities.filter(f => f !== facility) 
      : [...filters.facilities, facility];
    updateFilter({ facilities: updated });
  };

  const handleReset = () => {
    onFilterChange({
      search: '',
      location: 'All',
      type: 'All',
      roomClass: 'All',
      minPrice: 500000,
      maxPrice: 6000000,
      facilities: [],
    });
    setOpenDropdown(null);
  };

  const formatRupiahShort = (amount: number) => {
    if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)} Juta`;
    return `${(amount / 1000).toFixed(0)} Ribu`;
  };

  const getDropdownButtonClass = (isActive: boolean) => 
    `flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm transition-all border cursor-pointer ${
      isActive
        ? 'bg-white/10 text-white border-[#3A3A3A]'
        : 'bg-[#1C1C1C] text-[#8A8A8A] border-[#2A2A2A] hover:bg-[#2A2A2A] hover:text-white'
    }`;

  return (
    <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 relative z-40" ref={containerRef}>
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <div className="flex items-center gap-2 pr-4 border-r border-[#2A2A2A] hidden sm:flex">
          <SlidersHorizontal className="w-5 h-5 text-white" />
          <span className="text-xs uppercase tracking-widest font-mono text-[#5A5A5A] font-bold">Filters</span>
        </div>

        {/* Location Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
            className={`${getDropdownButtonClass(filters.location !== 'All')} w-full sm:w-auto justify-between sm:justify-start`}
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              <span className="hidden sm:block">{filters.location === 'All' ? 'Lokasi' : filters.location}</span>
            </div>
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'location' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-3 w-56 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex flex-col gap-1.5">
                  <button onClick={() => { updateFilter({ location: 'All' }); setOpenDropdown(null); }} className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer border ${filters.location === 'All' ? 'bg-white/10 text-white border-[#3A3A3A]' : 'text-[#6B6B6B] hover:text-white border-transparent hover:bg-white/5'}`}>Semua Area</button>
                  {availableLocations.map((loc) => (
                    <button key={loc} onClick={() => { updateFilter({ location: loc }); setOpenDropdown(null); }} className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer border ${filters.location === loc ? 'bg-white/10 text-white border-[#3A3A3A]' : 'text-[#6B6B6B] hover:text-white border-transparent hover:bg-white/5'}`}>{loc}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Type Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'type' ? null : 'type')}
            className={`${getDropdownButtonClass(filters.type !== 'All')} w-full sm:w-auto justify-between sm:justify-start`}
          >
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:block">{filters.type === 'All' ? 'Hunian' : filters.type}</span>
            </div>
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'type' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'type' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-3 w-48 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex flex-col gap-1.5">
                  {roomTypes.map((type) => (
                    <button key={type} onClick={() => { updateFilter({ type }); setOpenDropdown(null); }} className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer border ${filters.type === type ? 'bg-white/10 text-white border-[#3A3A3A]' : 'text-[#6B6B6B] hover:text-white border-transparent hover:bg-white/5'}`}>{type === 'All' ? 'Semua Tipe' : type}</button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Class Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'class' ? null : 'class')}
            className={`${getDropdownButtonClass(filters.roomClass !== 'All')} w-full sm:w-auto justify-between sm:justify-start`}
          >
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              <span className="hidden sm:block">{filters.roomClass === 'All' ? 'Kelas' : filters.roomClass}</span>
            </div>
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'class' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'class' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 mt-3 w-56 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-3 z-50">
                <div className="flex flex-col gap-1.5">
                  {roomClasses.map((cl) => (
                    <button key={cl} onClick={() => { updateFilter({ roomClass: cl }); setOpenDropdown(null); }} className={`text-left text-sm px-4 py-2.5 rounded-xl transition-all flex items-center justify-between cursor-pointer border ${filters.roomClass === cl ? 'bg-white/10 text-white border-[#3A3A3A]' : 'text-[#6B6B6B] hover:text-white border-transparent hover:bg-white/5'}`}>
                      <span>{cl === 'All' ? 'Semua Kelas' : cl}</span>
                      {filters.roomClass === cl && <Check className="w-4 h-4 text-white" />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Price Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'price' ? null : 'price')}
            className={`${getDropdownButtonClass(filters.maxPrice < 6000000)} w-full sm:w-auto justify-between sm:justify-start`}
          >
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:block">{filters.maxPrice < 6000000 ? `< ${formatRupiahShort(filters.maxPrice)}` : 'Budget'}</span>
            </div>
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'price' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'price' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 sm:-translate-x-1/2 sm:ml-16 mt-3 w-72 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-6 z-50">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-[#5A5A5A] font-mono">
                    <span>{formatRupiahShort(filters.minPrice)}</span>
                    <span>{formatRupiahShort(6000000)}</span>
                  </div>
                  <input
                    type="range"
                    min="500000"
                    max="6000000"
                    step="250000"
                    value={filters.maxPrice}
                    onChange={(e) => updateFilter({ maxPrice: Number(e.target.value) })}
                    className="w-full h-1.5 rounded-lg cursor-pointer"
                  />
                  <div className="text-center text-sm text-[#6B6B6B] font-light mt-2">
                    Maks. <strong className="text-white font-medium">Rp {filters.maxPrice.toLocaleString('id-ID')} / bln</strong>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Facilities Dropdown */}
        <div className="relative flex-1 sm:flex-none">
          <button 
            onClick={() => setOpenDropdown(openDropdown === 'facilities' ? null : 'facilities')}
            className={`${getDropdownButtonClass(filters.facilities.length > 0)} w-full sm:w-auto justify-between sm:justify-start`}
          >
            <div className="flex items-center gap-2">
              <Grid className="w-4 h-4" />
              <span className="hidden sm:block">Fasilitas {filters.facilities.length > 0 && `(${filters.facilities.length})`}</span>
            </div>
            <ChevronDown className={`w-3 h-3 transition-transform ${openDropdown === 'facilities' ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {openDropdown === 'facilities' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full right-0 sm:left-auto mt-3 w-64 bg-[#141414] border border-[#2A2A2A] rounded-2xl shadow-2xl p-4 z-50">
                <div className="grid grid-cols-1 gap-1.5">
                  {facilityOptions.map((fac) => {
                    const isSelected = filters.facilities.includes(fac);
                    return (
                      <label key={fac} onClick={() => toggleFacility(fac)} className={`text-sm px-4 py-2.5 rounded-xl cursor-pointer border flex items-center gap-3 transition-all ${isSelected ? 'bg-white/10 text-white border-[#3A3A3A]' : 'bg-transparent text-[#6B6B6B] border-transparent hover:bg-white/5 hover:text-white'}`}>
                        <div className={`w-4 h-4 rounded-md flex items-center justify-center border transition-all ${isSelected ? 'bg-white border-white text-black' : 'border-[#3A3A3A] bg-transparent'}`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        {fac}
                      </label>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={handleReset}
        className="text-xs text-[#5A5A5A] hover:text-white font-mono flex items-center justify-center gap-1.5 transition-colors bg-[#1C1C1C] hover:bg-[#2A2A2A] px-4 py-2.5 rounded-xl border border-[#2A2A2A] cursor-pointer w-full sm:w-auto mt-2 sm:mt-0"
      >
        <RefreshCcw className="w-3.5 h-3.5" />
        <span>Reset</span>
      </button>
    </div>
  );
}
