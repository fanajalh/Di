import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Users, 
  Home, 
  DollarSign, 
  Check, 
  X, 
  FileText, 
  ShieldCheck, 
  PlusCircle, 
  MapPin, 
  Building,
  Edit2,
  ListFilter,
  Clock,
  Calendar,
  Layers,
  Sparkles,
  UploadCloud,
  ImagePlus,
  Trash2
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Kost, Booking, HeroBanner } from '../types';
import { api } from '../api';
import { toast } from './Toast';

interface DashboardOwnerProps {
  kostList: Kost[];
  bookings: Booking[];
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string) => void;
  onAddKost: (newKost: Kost) => void;
  onEditKost: (updatedKost: Kost) => void;
  onDeleteKost: (id: string) => void;
  banners: HeroBanner[];
  onAddBanner: (newBanner: Omit<HeroBanner, 'id'>) => Promise<void>;
  onEditBanner: (id: number, updatedBanner: Partial<HeroBanner>) => Promise<void>;
  onDeleteBanner: (id: number) => Promise<void>;
}

const ALL_FACILITIES_OPTIONS = [
  'WiFi', 
  'AC', 
  'Springbed', 
  'Kamar Mandi Dalam', 
  'Meja', 
  'Lemari', 
  'TV Flat 4K', 
  'Dapur Bersama'
];

export default function DashboardOwner({ 
  kostList, 
  bookings, 
  onApproveBooking, 
  onRejectBooking, 
  onAddKost,
  onEditKost,
  onDeleteKost,
  banners,
  onAddBanner,
  onEditBanner,
  onDeleteBanner
}: DashboardOwnerProps) {
  // Modal toggle states
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingKost, setEditingKost] = useState<Kost | null>(null);

  
  // Tab view state of bookings list
  // Tab option filter types:
  // 'all': semua pengajuan
  // 'current': status disetujui, tanggal sewa sudah masuk (sebelum/setara hari ini 2026-06-13)
  // 'upcoming': status disetujui, tanggal sewa di masa depan (setelah 2026-06-13)
  // 'pending': status pending
  const [bookingTab, setBookingTab] = useState<'all' | 'current' | 'upcoming' | 'pending'>('all');

  // Form states of Registering New Kost
  const [newName, setNewName] = useState('');
  const [newPrice, setNewPrice] = useState(1500000);
  const [newLocation, setNewLocation] = useState('Jakarta');
  const [newClass, setNewClass] = useState<'Standar' | 'VIP' | 'Eksklusif'>('Standar');
  const [newType, setNewType] = useState<'Putra' | 'Putri' | 'Campur'>('Campur');
  const [newAddress, setNewAddress] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newTotalRooms, setNewTotalRooms] = useState(10);
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80');
  const [newAdditionalImages, setNewAdditionalImages] = useState<string[]>([]);
  const [newFacilities, setNewFacilities] = useState<string[]>(['WiFi', 'AC', 'Springbed']);

  // Form states of Editing Existing Kost
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(1500000);
  const [editLocation, setEditLocation] = useState('Jakarta');
  const [editClass, setEditClass] = useState<'Standar' | 'VIP' | 'Eksklusif'>('Standar');
  const [editType, setEditType] = useState<'Putra' | 'Putri' | 'Campur'>('Campur');
  const [editAddress, setEditAddress] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editTotalRooms, setEditTotalRooms] = useState(10);
  const [editAvailableRooms, setEditAvailableRooms] = useState(5);
  const [editImage, setEditImage] = useState('');
  const [editAdditionalImages, setEditAdditionalImages] = useState<string[]>([]);
  const [editFacilities, setEditFacilities] = useState<string[]>([]);

  // Tab view state of overall dashboard
  const [activeTab, setActiveTab] = useState<'dashboard' | 'banners'>('dashboard');

  // Form states of Hero Banners
  const [showAddBannerForm, setShowAddBannerForm] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerOrder, setBannerOrder] = useState(0);

  const handleStartAddBanner = () => {
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImage('');
    setBannerOrder(banners.length);
    setShowAddBannerForm(true);
    setEditingBanner(null);
  };

  const handleStartEditBanner = (banner: HeroBanner) => {
    setBannerTitle(banner.title);
    setBannerSubtitle(banner.subtitle);
    setBannerImage(banner.image);
    setBannerOrder(banner.order);
    setEditingBanner(banner);
    setShowAddBannerForm(false);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerTitle.trim() || !bannerImage.trim()) return;

    if (editingBanner) {
      await onEditBanner(editingBanner.id, {
        title: bannerTitle,
        subtitle: bannerSubtitle,
        image: bannerImage,
        order: Number(bannerOrder)
      });
      setEditingBanner(null);
    } else {
      await onAddBanner({
        title: bannerTitle,
        subtitle: bannerSubtitle,
        image: bannerImage,
        order: Number(bannerOrder)
      });
      setShowAddBannerForm(false);
    }

    // Reset states
    setBannerTitle('');
    setBannerSubtitle('');
    setBannerImage('');
    setBannerOrder(0);
  };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setBannerImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };


  // 1. Chart Data - Monthly revenue progression
  const revenueData = [
    { month: 'Jan', Pendapatan: 38000000 },
    { month: 'Feb', Pendapatan: 42000000 },
    { month: 'Mar', Pendapatan: 49000000 },
    { month: 'Apr', Pendapatan: 54000000 },
    { month: 'Mei', Pendapatan: 68000000 },
    { month: 'Jun', Pendapatan: 75000000 },
  ];

  // Calculate actual dynamic properties metrics
  const totalProperties = kostList.length;
  const totalAvailableRooms = kostList.reduce((sum, k) => sum + k.availableRooms, 0);
  const totalCapacity = kostList.reduce((sum, k) => sum + k.totalRooms, 0);
  const occupiedRooms = totalCapacity - totalAvailableRooms;
  const occupancyPercentage = totalCapacity > 0 ? Math.round((occupiedRooms / totalCapacity) * 100) : 0;

  // 2. Occupancy Rate Donut Chart Data
  const occupancyData = [
    { name: 'Kamar Terisi', value: occupiedRooms, color: '#B0B0B0' },
    { name: 'Kamar Kosong', value: totalAvailableRooms, color: '#1C1C1C' },
  ];

  // Date anchor to determine upcoming vs current bookings
  const todayDateStr = '2026-06-13';

  // Filter chronologies
  const filteredBookings = bookings.filter((booking) => {
    if (bookingTab === 'all') return true;
    if (bookingTab === 'pending') return booking.status === 'Pending';
    if (bookingTab === 'current') {
      return booking.status === 'Disetujui' && booking.startDate <= todayDateStr;
    }
    if (bookingTab === 'upcoming') {
      return booking.status === 'Disetujui' && booking.startDate > todayDateStr;
    }
    return true;
  });

  const formatRupiah = (num: number) => {
    return 'Rp ' + num.toLocaleString('id-ID');
  };

  // Toggle facilities checklist
  const handleToggleFacilityNew = (fac: string) => {
    setNewFacilities(prev => 
      prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
    );
  };

  const handleToggleFacilityEdit = (fac: string) => {
    setEditFacilities(prev => 
      prev.includes(fac) ? prev.filter(f => f !== fac) : [...prev, fac]
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const files = e.target.files;
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (isEdit) {
          setEditAdditionalImages(prev => [...prev, base64String]);
        } else {
          setNewAdditionalImages(prev => [...prev, base64String]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number, isEdit: boolean) => {
    if (isEdit) {
      setEditAdditionalImages(prev => prev.filter((_, i) => i !== index));
    } else {
      setNewAdditionalImages(prev => prev.filter((_, i) => i !== index));
    }
  };

  // Create new kost
  const handleCreateKost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const createdKost: Kost = {
      id: `kost-${Date.now()}`,
      name: newName,
      price: Number(newPrice),
      location: newLocation,
      roomClass: newClass,
      type: newType,
      address: newAddress || 'Jl. Raya Pendidikan No. 7',
      rating: 5.0,
      reviewsCount: 1,
      image: newImage || 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80',
      additionalImages: newAdditionalImages,
      facilities: newFacilities,
      availableRooms: Number(newTotalRooms),
      totalRooms: Number(newTotalRooms),
      description: newDescription || 'Kost modern eksklusif dengan fasilitas penunjang istirahat terlengkap dari Di.',
      author: 'Ahmad Gede',
    };

    onAddKost(createdKost);

    // Reset inputs
    setNewName('');
    setNewPrice(1500000);
    setNewAddress('');
    setNewDescription('');
    setNewTotalRooms(10);
    setNewAdditionalImages([]);
    setNewFacilities(['WiFi', 'AC', 'Springbed']);
    setShowAddModal(false);
  };

  // Trigger editing modal (loads full details asynchronously)
  const handleStartEdit = async (kost: Kost) => {
    const tid = toast.loading('Memuat detail properti...');
    try {
      const fullKost = await api.getKostById(kost.id);
      setEditingKost(fullKost);
      setEditName(fullKost.name);
      setEditPrice(fullKost.price);
      setEditLocation(fullKost.location);
      setEditClass(fullKost.roomClass);
      setEditType(fullKost.type);
      setEditAddress(fullKost.address || '');
      setEditDescription(fullKost.description || '');
      setEditTotalRooms(fullKost.totalRooms);
      setEditAvailableRooms(fullKost.availableRooms);
      setEditImage(fullKost.image);
      setEditAdditionalImages(fullKost.additionalImages || []);
      setEditFacilities(fullKost.facilities || []);
      toast.dismiss(tid);
    } catch (err) {
      console.error(err);
      toast.update(tid, { type: 'error', message: 'Gagal memuat data detail properti.' });
    }
  };

  // Save edited listing
  const handleSaveEditKost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKost) return;

    const updated: Kost = {
      ...editingKost,
      name: editName,
      price: Number(editPrice),
      location: editLocation,
      roomClass: editClass,
      type: editType,
      address: editAddress,
      description: editDescription,
      totalRooms: Number(editTotalRooms),
      availableRooms: Number(editAvailableRooms),
      image: editImage,
      additionalImages: editAdditionalImages,
      facilities: editFacilities
    };

    onEditKost(updated);
    setEditingKost(null);
  };


  if (showAddModal || editingKost) {
    const isEdit = !!editingKost;
    const title = isEdit ? 'Edit Informasi Properti' : 'Registrasi Properti Baru';
    const subtitle = isEdit ? 'Perbarui detail data properti kost Anda.' : 'Tambahkan unit kost baru ke dalam katalog.';
    
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-white p-6 md:p-12 lg:p-20 font-sans animate-in fade-in duration-300">
        <div className="max-w-6xl mx-auto">
          <button 
            onClick={() => { setShowAddModal(false); setEditingKost(null); }}
            className="flex items-center gap-2 text-[#949494] hover:text-white mb-10 text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" /> Batal & Kembali ke Dashboard
          </button>
          
          <div className="mb-12 border-b border-[#1C1C1C] pb-6">
            <h2 className="text-3xl md:text-4xl font-black flex items-center gap-4 tracking-tight">
              {isEdit ? <Edit2 className="w-8 h-8 text-[#808080]" /> : <PlusCircle className="w-8 h-8 text-[#808080]" />}
              {title}
            </h2>
            <p className="text-[#949494] mt-4 text-sm font-mono uppercase tracking-widest">{subtitle}</p>
          </div>

          <form onSubmit={isEdit ? handleSaveEditKost : handleCreateKost} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            {/* Left Column (Main Info) */}
            <div className="lg:col-span-7 space-y-10">
               <div className="space-y-6">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#B0B0B0] border-b border-[#1C1C1C] pb-3">1. Informasi Dasar</h3>
                 
                 <div>
                   <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Nama Unit Kost</label>
                   <input type="text" required value={isEdit ? editName : newName} onChange={(e) => isEdit ? setEditName(e.target.value) : setNewName(e.target.value)} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors" placeholder="Contoh: Kost Executive Elite Menteng" />
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Harga Sewa Bulanan (Rp)</label>
                     <input type="number" required value={isEdit ? editPrice : newPrice} onChange={(e) => isEdit ? setEditPrice(Number(e.target.value)) : setNewPrice(Number(e.target.value))} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors" />
                   </div>
                   <div>
                     <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Pilih Kota Utama</label>
                     <select value={isEdit ? editLocation : newLocation} onChange={(e) => isEdit ? setEditLocation(e.target.value) : setNewLocation(e.target.value)} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-[#A3A3A3] focus:text-white focus:outline-none transition-colors">
                       <option value="Jakarta" className="bg-[#141414]">Jakarta</option>
                       <option value="Bandung" className="bg-[#141414]">Bandung</option>
                       <option value="Yogyakarta" className="bg-[#141414]">Yogyakarta</option>
                       <option value="Surabaya" className="bg-[#141414]">Surabaya</option>
                       <option value="Semarang" className="bg-[#141414]">Semarang</option>
                     </select>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Target Gender</label>
                     <select value={isEdit ? editType : newType} onChange={(e) => isEdit ? setEditType(e.target.value as any) : setNewType(e.target.value as any)} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-[#A3A3A3] focus:text-white focus:outline-none transition-colors">
                       <option value="Campur" className="bg-[#141414]">Campur</option>
                       <option value="Putra" className="bg-[#141414]">Khusus Putra</option>
                       <option value="Putri" className="bg-[#141414]">Khusus Putri</option>
                     </select>
                   </div>
                   <div>
                     <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Kategori Kelas</label>
                     <select value={isEdit ? editClass : newClass} onChange={(e) => isEdit ? setEditClass(e.target.value as any) : setNewClass(e.target.value as any)} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-[#A3A3A3] focus:text-white focus:outline-none transition-colors">
                       <option value="Standar" className="bg-[#141414]">Standar</option>
                       <option value="VIP" className="bg-[#141414]">VIP</option>
                       <option value="Eksklusif" className="bg-[#141414]">Eksklusif</option>
                     </select>
                   </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                   <div>
                     <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Jumlah Total Kamar</label>
                     <input type="number" required value={isEdit ? editTotalRooms : newTotalRooms} onChange={(e) => isEdit ? setEditTotalRooms(Number(e.target.value)) : setNewTotalRooms(Number(e.target.value))} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors" />
                   </div>
                   {isEdit && (
                     <div>
                       <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Kamar Kosong Tersedia</label>
                       <input type="number" required value={editAvailableRooms} onChange={(e) => setEditAvailableRooms(Number(e.target.value))} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors" />
                     </div>
                   )}
                 </div>
               </div>
               
               <div className="space-y-6">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#B0B0B0] border-b border-[#1C1C1C] pb-3">2. Lokasi & Deskripsi</h3>
                 <div>
                   <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Alamat Lengkap</label>
                   <input type="text" required value={isEdit ? editAddress : newAddress} onChange={(e) => isEdit ? setEditAddress(e.target.value) : setNewAddress(e.target.value)} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors" placeholder="Jl. Merdeka No 15B, Menteng" />
                 </div>
                 <div>
                   <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Deskripsi Properti</label>
                   <textarea rows={4} value={isEdit ? editDescription : newDescription} onChange={(e) => isEdit ? setEditDescription(e.target.value) : setNewDescription(e.target.value)} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors resize-none" placeholder="Ceritakan kelebihan unik kos Anda..." />
                 </div>
               </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-5 space-y-10">
               <div className="space-y-6">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#B0B0B0] border-b border-[#1C1C1C] pb-3 flex items-center justify-between">
                   <span>3. Media Visual</span>
                   <span className="text-[#808080] font-normal text-[10px] bg-[#141414] px-2 py-0.5 rounded border border-[#1C1C1C]">Cover + {(isEdit ? editAdditionalImages : newAdditionalImages).length} Extra</span>
                 </h3>
                 
                 <div className="space-y-4">
                   <div>
                     <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Foto Utama (URL Cover)</label>
                     <input type="text" value={isEdit ? editImage : newImage} onChange={(e) => isEdit ? setEditImage(e.target.value) : setNewImage(e.target.value)} className="w-full bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors" placeholder="https://..." />
                   </div>
                   
                   <div className="flex items-center justify-between pt-2">
                     <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest">Tambah Galeri Ekstra</label>
                   </div>
                   
                   <div className="flex gap-3">
                     <div className="flex-1 relative">
                       <input 
                         type="file" 
                         accept="image/*" 
                         multiple
                         onChange={(e) => handleFileUpload(e, isEdit)}
                         className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                       />
                       <div className="w-full h-12 bg-[#141414] border border-[#2A2A2A] rounded-xl flex items-center justify-center gap-2 text-sm text-[#A3A3A3] transition-colors group-hover:bg-[#1C1C1C]">
                         <UploadCloud className="w-4 h-4" />
                         <span>Upload Lokal (.png, .jpg)</span>
                       </div>
                     </div>
                     <button type="button" onClick={() => {
                        const url = prompt("Masukkan URL gambar tambahan:");
                        if (url) {
                          if (isEdit) setEditAdditionalImages(prev => [...prev, url]);
                          else setNewAdditionalImages(prev => [...prev, url]);
                        }
                     }} className="h-12 px-4 bg-[#141414] border border-[#2A2A2A] rounded-xl flex items-center justify-center text-white hover:bg-[#1C1C1C] transition-colors cursor-pointer" title="Tambah via URL">
                       <ImagePlus className="w-4 h-4" />
                     </button>
                   </div>
                 </div>

                 {/* Gallery Preview Grid */}
                 <div className="grid grid-cols-3 gap-3 mt-6">
                   <div className="col-span-3 h-48 bg-[#141414] border border-[#1A1A1C] rounded-2xl overflow-hidden relative group">
                     <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[9px] font-mono uppercase tracking-widest text-white border border-white/10 z-10">Cover</div>
                     {(isEdit ? editImage : newImage) ? (
                       <img src={isEdit ? editImage : newImage} alt="Cover Preview" className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-[#3A3A3A] font-mono text-xs">[Preview Cover]</div>
                     )}
                   </div>
                   
                   {(isEdit ? editAdditionalImages : newAdditionalImages).map((img, idx) => (
                     <div key={idx} className="aspect-square bg-[#141414] border border-[#1A1A1C] rounded-xl overflow-hidden relative group">
                       <img src={img} alt={`Preview ${idx+1}`} className="w-full h-full object-cover opacity-80" referrerPolicy="no-referrer" />
                       <button type="button" onClick={() => removeImage(idx, isEdit)} className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-md">
                         <Trash2 className="w-3 h-3" />
                       </button>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="space-y-6">
                 <h3 className="text-xs font-bold uppercase tracking-widest text-[#B0B0B0] border-b border-[#1C1C1C] pb-3">4. Fasilitas Bawaan</h3>
                 <div className="grid grid-cols-2 gap-3">
                   {ALL_FACILITIES_OPTIONS.map((fac) => {
                     const isChecked = isEdit ? editFacilities.includes(fac) : newFacilities.includes(fac);
                     return (
                       <button
                         key={fac}
                         type="button"
                         onClick={() => isEdit ? handleToggleFacilityEdit(fac) : handleToggleFacilityNew(fac)}
                         className={`py-3 px-4 rounded-xl border text-left font-medium text-xs flex items-center justify-between cursor-pointer transition-colors ${
                           isChecked 
                             ? 'bg-[#1C1C1C] text-white border-[#5A5A5A]' 
                             : 'bg-transparent border-[#1C1C1C] text-[#808080] hover:border-[#2A2A2A]'
                         }`}
                       >
                         <span>{fac}</span>
                         {isChecked && <Check className="w-3.5 h-3.5 text-white" />}
                       </button>
                     );
                   })}
                 </div>
               </div>
               
               <div className="pt-8 border-t border-[#1C1C1C]">
                  <button type="submit" className="w-full py-4 bg-white hover:bg-[#B0B0B0] text-black font-bold uppercase tracking-widest text-xs rounded-xl cursor-pointer transition-colors">
                     {isEdit ? 'Simpan Perubahan' : 'Iklankan Secara Instan'}
                  </button>
               </div>
            </div>

          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-[#0A0A0A] text-white min-h-screen p-4 md:p-8">
      {/* Header Profile Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#2A2A2A] pb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-sans font-black text-white flex items-center gap-2.5">
            <Building className="w-8 h-8 text-[#A3A3A3]" />
            CONTROL CENTER OWNER
          </h1>
          <p className="text-xs text-[#808080] mt-1 font-sans">
            Kelola statistik hunian kost, pantau konfirmasi pembayaran, edit fasilitas kamar, dan pasang iklan properti baru dalam real-time.
          </p>
        </div>
        
        <button
          id="btn-add-kost-modal"
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 bg-white hover:bg-[#B0B0B0] text-black font-bold rounded-xl text-xs flex items-center gap-2 self-start md:self-auto cursor-pointer transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          Registrasi Kost Baru
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-[#1C1C1C] pb-4">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all rounded-lg cursor-pointer ${
            activeTab === 'dashboard'
              ? 'bg-white text-black'
              : 'text-[#808080] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Statistik & Properti
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all rounded-lg cursor-pointer ${
            activeTab === 'banners'
              ? 'bg-white text-black'
              : 'text-[#808080] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Pengaturan Slider Hero
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <>
          {/* Grid STATS Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Revenue Month */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] text-[#A3A3A3]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#808080] font-mono uppercase tracking-wider">Pendapatan (Jun)</p>
            <p className="text-xl font-sans font-black text-white mt-1">Rp 75.000.000</p>
            <div className="text-[11px] text-[#A3A3A3] flex items-center gap-1 mt-0.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 inline" />
              <span>+10.3% bln lalu</span>
            </div>
          </div>
        </div>

        {/* Card 2: Occupancy Percentage */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] text-[#A3A3A3]">
            <Home className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#808080] font-mono uppercase tracking-wider">Rasio Hunian</p>
            <p className="text-xl font-sans font-black text-white mt-1">{occupancyPercentage}%</p>
            <p className="text-[11px] text-[#808080] mt-0.5 font-sans">
              {occupiedRooms} dari {totalCapacity} kamar terisi
            </p>
          </div>
        </div>

        {/* Card 3: Total properties listed */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] text-[#A3A3A3]">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#808080] font-mono uppercase tracking-wider">Total Properti</p>
            <p className="text-xl font-sans font-black text-white mt-1">{totalProperties} Kost</p>
            <p className="text-[11px] text-[#808080] mt-0.5 font-sans">
              {totalAvailableRooms} kamar kosong sisa
            </p>
          </div>
        </div>

        {/* Card 4: Active Bookings */}
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A] text-[#A3A3A3]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-[#808080] font-mono uppercase tracking-wider">Booking Pending</p>
            <p className="text-xl font-sans font-black text-white mt-1">
              {bookings.filter(b => b.status === 'Pending').length} Pengajuan
            </p>
            <p className="text-[11px] text-[#A3A3A3] mt-0.5 animate-pulse font-mono tracking-wide">
              BUTUH PERSETUJUAN
            </p>
          </div>
        </div>
      </div>

      {/* Grid Charts Section using Recharts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Revenue Progression Line chart - 7 Columns */}
        <div className="lg:col-span-8 bg-[#141414] border border-[#2A2A2A] p-5 md:p-6 rounded-2xl">
          <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#808080] mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8A8A8A] animate-pulse"></span>
            Laporan Grafik Pendapatan Bulanan (IDR)
          </h3>
          <div className="h-64 sm:h-72 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#B0B0B0" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#B0B0B0" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1C1C1C" vertical={false} />
                <XAxis dataKey="month" stroke="#5A5A5A" tickLine={false} />
                <YAxis 
                  stroke="#5A5A5A" 
                  tickLine={false} 
                  axisLine={false}
                  tickFormatter={(val) => `${val / 1000000} Jt`} 
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#141414', borderColor: '#2A2A2A', borderRadius: '8px' }}
                  formatter={(val) => [formatRupiah(Number(val)), 'Pendapatan']}
                />
                <Line 
                  type="monotone" 
                  dataKey="Pendapatan" 
                  stroke="#B0B0B0" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#B0B0B0', strokeWidth: 1 }} 
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Donut chart sharing Occupancy metrics - 4 Columns */}
        <div className="lg:col-span-4 bg-[#141414] border border-[#2A2A2A] p-5 md:p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <h3 className="font-sans font-bold text-xs uppercase tracking-wider text-[#808080] mb-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#8A8A8A]"></span>
              Metrik Ketersediaan Unit
            </h3>
            
            <div className="h-44 w-full relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {occupancyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} Kamar`]} />
                </PieChart>
              </ResponsiveContainer>

              {/* Dynamic center indicator text absolute of Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-sans font-black text-white">{occupancyPercentage}%</span>
                <span className="text-[10px] text-gray-500 font-mono tracking-wide uppercase">Terisi</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-[#2A2A2A] space-y-2.5">
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B0B0B0]"></span>
                <span>Hunian Terisi (Rent)</span>
              </div>
              <span className="font-mono font-semibold text-white">{occupiedRooms} Kamar</span>
            </div>
            
            <div className="flex items-center justify-between text-xs text-[#A3A3A3]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1C1C1C]"></span>
                <span>Kosong & Siap Sewa</span>
              </div>
              <span className="font-mono text-[#808080]">{totalAvailableRooms} Kamar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Inbound Requests Area with Differentiated Tabs */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#949494]" />
            Agenda & Daftar Reservasi Kost
          </h2>

          <div className="flex flex-wrap items-center gap-1.5 bg-[#0A0A0A] p-1.5 rounded-xl border border-[#2A2A2A]">
            <button
              onClick={() => setBookingTab('all')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                bookingTab === 'all' 
                  ? 'bg-white text-black' 
                  : 'text-[#808080] hover:text-white hover:bg-white/5'
              }`}
            >
              Semua ({bookings.length})
            </button>
            <button
              onClick={() => setBookingTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                bookingTab === 'pending' 
                  ? 'bg-white text-black' 
                  : 'text-[#808080] hover:text-white hover:bg-white/5'
              }`}
            >
              Pending ({bookings.filter(b => b.status === 'Pending').length})
            </button>
            <button
              onClick={() => setBookingTab('current')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                bookingTab === 'current' 
                  ? 'bg-white text-black' 
                  : 'text-[#808080] hover:text-white hover:bg-white/5'
              }`}
              title="Sewa aktif terkonfirmasi dengan tanggal mulai <= hari ini"
            >
              Sewa Aktif ({bookings.filter(b => b.status === 'Disetujui' && b.startDate <= todayDateStr).length})
            </button>
            <button
              onClick={() => setBookingTab('upcoming')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-mono uppercase tracking-wider font-bold transition-all cursor-pointer ${
                bookingTab === 'upcoming' 
                  ? 'bg-white text-black' 
                  : 'text-[#808080] hover:text-white hover:bg-white/5'
              }`}
              title="Sewa disetujui untuk waktu di masa depan"
            >
              Upcoming ({bookings.filter(b => b.status === 'Disetujui' && b.startDate > todayDateStr).length})
            </button>
          </div>
        </div>

        <div className="divide-y divide-[#2A2A2A] custom-scrollbar overflow-x-auto">
          {filteredBookings.length === 0 ? (
            <div className="p-12 text-center text-[#808080] text-xs flex flex-col items-center justify-center gap-2">
              <Clock className="w-6 h-6 text-[#3A3A3A]" />
              <span>Belum ada reservasi dalam kategori ini.</span>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr className="bg-[#0A0A0A] text-[#808080] text-[11px] font-mono uppercase tracking-wider border-b border-[#2A2A2A]">
                  <th className="p-4">Calon Penyewa</th>
                  <th className="p-4">Properti Kost</th>
                  <th className="p-4">Tanggal Mulai</th>
                  <th className="p-4">Durasi Kontrak</th>
                  <th className="p-4">Total Biaya</th>
                  <th className="p-4 text-center">Tipe Jadwal</th>
                  <th className="p-4 text-right">Opsi Tindakan</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-[#2A2A2A]">
                {filteredBookings.map((booking) => {
                  const isUpcoming = booking.status === 'Disetujui' && booking.startDate > todayDateStr;
                  const isCurrent = booking.status === 'Disetujui' && booking.startDate <= todayDateStr;

                  return (
                    <tr key={booking.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div>
                          <p className="font-semibold text-white font-sans">{booking.userName}</p>
                          <p className="text-[10px] text-[#808080] font-mono mt-0.5">{booking.userPhone}</p>
                        </div>
                      </td>
                      <td className="p-4 text-[#B0B0B0]">
                        <p className="font-medium">{booking.kostName}</p>
                        <p className="text-[10px] text-[#808080] font-mono mt-0.5">Metode: {booking.paymentMethod}</p>
                      </td>
                      <td className="p-4 text-[#B0B0B0] font-mono font-semibold">
                        {booking.startDate}
                      </td>
                      <td className="p-4 font-semibold font-mono text-[#949494]">
                        {booking.duration} Bulan
                      </td>
                      <td className="p-4 text-white font-bold font-mono">
                        {formatRupiah(booking.totalPrice)}
                      </td>
                      <td className="p-4 text-center">
                        {booking.status === 'Pending' ? (
                          <span className="text-[9px] font-mono bg-[#1C1C1C] border border-[#3A3A3A] px-2.5 py-1 rounded text-[#A3A3A3]">
                            VERIFIKASI
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[9px] font-mono bg-[#1C1C1C] border border-[#3A3A3A] px-2.5 py-1 rounded text-white font-bold uppercase">
                            CURRENT (AKTIF)
                          </span>
                        ) : isUpcoming ? (
                          <span className="text-[9px] font-mono bg-[#1C1C1C] border border-[#3A3A3A] px-2.5 py-1 rounded text-[#B0B0B0] font-bold uppercase">
                            UPCOMING (FUTUR)
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono bg-[#1C1C1C] border border-[#2A2A2A] px-2.5 py-1 rounded text-[#808080]">
                            REJECTED
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        {booking.status === 'Pending' ? (
                          <div className="flex items-center gap-2 justify-end">
                             <button
                               id={`btn-approve-${booking.id}`}
                               onClick={() => onApproveBooking(booking.id)}
                               className="bg-white hover:bg-[#B0B0B0] p-1.5 rounded-lg text-black font-bold cursor-pointer transition-transform duration-200"
                               title="Setujui Penyewaan"
                             >
                               <Check className="w-4 h-4" />
                             </button>
                             <button
                               id={`btn-reject-${booking.id}`}
                               onClick={() => onRejectBooking(booking.id)}
                               className="bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] p-1.5 rounded-lg text-white font-bold cursor-pointer transition-transform duration-200"
                               title="Tolak Penyewaan"
                             >
                               <X className="w-4 h-4" />
                             </button>
                          </div>
                        ) : (
                          <span className="text-[10px] text-[#808080] font-mono flex items-center justify-end gap-1 font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#A3A3A3]" />
                            Tercatat
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Active Listings Grid with Edit capabilities */}
      <div className="space-y-4">
        <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#808080] flex items-center gap-2">
          <span>Daftar Unit Kost Pemilik Ahmad Gede</span>
          <span className="text-xs bg-white/5 text-[#A3A3A3] px-2 py-0.5 rounded-full border border-[#2A2A2A] font-mono">
            {kostList.length} Iklan Aktif
          </span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {kostList.map((kost) => (
            <div key={kost.id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between group transition-all duration-300 hover:border-[#3A3A3A]">
              <div>
                <div className="relative h-40 rounded-xl overflow-hidden mb-4">
                  <img 
                    src={kost.image} 
                    alt={kost.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 duration-500"
                  />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-black/60 rounded text-[#B0B0B0] font-black uppercase">
                      {kost.type}
                    </span>
                    <span className="text-[9px] font-mono px-2 py-0.5 bg-black/60 rounded text-white font-semibold uppercase">
                      {kost.roomClass}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-1.5 align-middle">
                  <h4 className="text-sm font-bold text-white truncate max-w-[180px]">{kost.name}</h4>
                  <span className="text-xs font-bold text-white font-mono shrink-0">
                    {formatRupiah(kost.price)}<span className="text-[9px] font-normal text-[#808080]">/bln</span>
                  </span>
                </div>
                
                <p className="text-[11px] text-[#808080] mt-1 flex items-center gap-1 font-sans">
                  <MapPin className="w-3.5 h-3.5 text-[#949494]" />
                  {kost.location}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#2A2A2A]">
                <div className="flex items-center justify-between text-[11px] text-[#949494] font-mono font-medium mb-3">
                  <span>Kapasitas: {kost.totalRooms} Kamar</span>
                  <span>Sisa Kosong: <strong className="text-white">{kost.availableRooms}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(kost)}
                    className="flex-1 py-2 bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#2A2A2A] rounded-xl text-xs font-semibold hover:text-white text-[#949494] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    Edit Properti
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Yakin ingin menghapus properti ini beserta semua riwayat pemesanannya?')) {
                        onDeleteKost(kost.id);
                      }
                    }}
                    className="p-2 bg-red-950/20 border border-red-900/30 hover:bg-red-900/40 rounded-xl text-red-500 hover:text-red-400 transition-all flex items-center justify-center cursor-pointer"
                    title="Hapus Properti"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </>
      ) : (
        /* HERO BANNERS MANAGEMENT SECTION */
        <div className="space-y-8 animate-in fade-in duration-300">
          {showAddBannerForm || editingBanner ? (
            <div className="max-w-3xl bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 md:p-8 animate-in slide-in-from-bottom duration-300">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
                <h3 className="text-base font-bold font-display uppercase tracking-wide flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#A3A3A3]" />
                  {editingBanner ? 'Edit Banner Slider' : 'Tambah Banner Baru'}
                </h3>
                <button 
                  onClick={() => { setShowAddBannerForm(false); setEditingBanner(null); }}
                  className="text-xs text-[#808080] hover:text-white font-mono uppercase tracking-widest cursor-pointer"
                >
                  Kembali
                </button>
              </div>

              <form onSubmit={handleSaveBanner} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Judul Banner</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Premium Living Experience"
                    value={bannerTitle}
                    onChange={(e) => setBannerTitle(e.target.value)}
                    className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#3A3A3A] focus:border-[#5A5A5A] outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Sub-Judul / Deskripsi Pendek</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rasakan hunian berkelas di pusat kota."
                    value={bannerSubtitle}
                    onChange={(e) => setBannerSubtitle(e.target.value)}
                    className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#3A3A3A] focus:border-[#5A5A5A] outline-none transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Urutan Tampil (Order)</label>
                    <input
                      type="number"
                      required
                      min="0"
                      placeholder="Contoh: 0"
                      value={bannerOrder}
                      onChange={(e) => setBannerOrder(Number(e.target.value))}
                      className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#3A3A3A] focus:border-[#5A5A5A] outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">File Gambar (Unggah)</label>
                    <div className="flex items-center gap-3">
                      <label className="flex-1 h-12 border border-[#2A2A2A] border-dashed rounded-xl flex items-center justify-center gap-2 text-[#808080] hover:text-white hover:border-[#5A5A5A] transition-colors cursor-pointer bg-[#0A0A0A] text-xs font-semibold">
                        <UploadCloud className="w-4 h-4" />
                        <span>Pilih File PNG/JPG</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleBannerImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">ATAU Link URL Gambar</label>
                  <input
                    type="text"
                    placeholder="https://images.unsplash.com/..."
                    value={bannerImage.startsWith('data:') ? '' : bannerImage}
                    onChange={(e) => setBannerImage(e.target.value)}
                    disabled={bannerImage.startsWith('data:')}
                    className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white placeholder:text-[#3A3A3A] focus:border-[#5A5A5A] outline-none transition-colors disabled:opacity-50"
                  />
                  {bannerImage.startsWith('data:') && (
                    <p className="text-[10px] text-[#A3A3A3] font-mono mt-1">
                      * Gambar saat ini diunggah via file. Klik "Reset Gambar" untuk memasukkan URL.
                    </p>
                  )}
                </div>

                {bannerImage && (
                  <div className="space-y-2">
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest">Pratinjau Gambar</label>
                    <div className="relative w-full max-w-sm aspect-[16/9] bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl overflow-hidden">
                      <img src={bannerImage} alt="Banner Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setBannerImage('')}
                        className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-md cursor-pointer text-xs font-bold font-mono uppercase"
                      >
                        Reset Gambar
                      </button>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-[#2A2A2A] flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={!bannerTitle.trim() || !bannerImage.trim()}
                    className="flex-1 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#B0B0B0] transition-colors cursor-pointer disabled:opacity-50 disabled:hover:bg-white"
                  >
                    Simpan Banner
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowAddBannerForm(false); setEditingBanner(null); }}
                    className="px-6 py-3 bg-[#1C1C1C] text-white border border-[#2A2A2A] font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#2A2A2A] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
                <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-[#808080] flex items-center gap-2">
                  <span>Daftar Banner Slider Hero</span>
                  <span className="text-xs bg-white/5 text-[#A3A3A3] px-2 py-0.5 rounded-full border border-[#2A2A2A] font-mono">
                    {banners.length} Aktif
                  </span>
                </h3>
                <button
                  onClick={handleStartAddBanner}
                  className="px-4 py-2 bg-white hover:bg-[#B0B0B0] text-black font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <PlusCircle className="w-4 h-4" />
                  Tambah Banner
                </button>
              </div>

              {banners.length === 0 ? (
                <div className="p-16 border border-dashed border-[#2A2A2A] text-center rounded-2xl text-[#808080] text-xs">
                  <span>Belum ada banner slider terpasang. Klik "Tambah Banner" di atas untuk menambahkan.</span>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {banners.map((banner) => (
                    <div key={banner.id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-4 flex flex-col justify-between group transition-all duration-300 hover:border-[#3A3A3A]">
                      <div>
                        <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-4 bg-[#0A0A0A] border border-[#2A2A2A]">
                          <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                          <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[9px] font-mono text-white border border-white/10">
                            Urutan: {banner.order}
                          </div>
                        </div>
                        <h4 className="text-sm font-bold text-white tracking-wide truncate mb-1">{banner.title}</h4>
                        <p className="text-xs text-[#808080] leading-relaxed line-clamp-2">{banner.subtitle}</p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex items-center gap-2">
                        <button
                          onClick={() => handleStartEditBanner(banner)}
                          className="flex-1 py-2 bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#2A2A2A] rounded-xl text-xs font-semibold hover:text-white text-[#949494] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (window.confirm('Yakin ingin menghapus banner slider ini?')) {
                              await onDeleteBanner(banner.id);
                            }
                          }}
                          className="p-2 bg-red-950/20 border border-red-900/30 hover:bg-red-900/40 rounded-xl text-red-500 hover:text-red-400 transition-all flex items-center justify-center cursor-pointer"
                          title="Hapus Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
}