import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  QrCode,
  Ticket,
  FileClock
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
  Cell,
  Legend
} from 'recharts';
import { Kost, Booking, HeroBanner, FinancialTransaction, Promo, TenantRequest } from '../types';
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
  onRefreshData?: () => Promise<void>;
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
  onDeleteBanner,
  onRefreshData
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'finance' | 'banners' | 'promos' | 'requests'>('dashboard');

  // Promos State
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(false);
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promo | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoDiscount, setPromoDiscount] = useState<number>(10);
  const [promoTitle, setPromoTitle] = useState('');
  const [promoDesc, setPromoDesc] = useState('');
  const [promoExpires, setPromoExpires] = useState<string>(
    new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]
  );

  // Tenant Requests State
  const [tenantRequests, setTenantRequests] = useState<TenantRequest[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Barcode Scanner Simulation State
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannedBarcodeId, setScannedBarcodeId] = useState('');
  const [scannedBooking, setScannedBooking] = useState<Booking | null>(null);

  // Finance Transactions State
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([]);
  const [loadingTx, setLoadingTx] = useState(true);

  // Form states of Transaction
  const [showAddTxModal, setShowAddTxModal] = useState(false);
  const [editingTx, setEditingTx] = useState<FinancialTransaction | null>(null);
  
  const [txType, setTxType] = useState<'Income' | 'Expense'>('Income');
  const [txAmount, setTxAmount] = useState<number>(0);
  const [txCategory, setTxCategory] = useState<string>('Sewa Kamar');
  const [txDescription, setTxDescription] = useState<string>('');
  const [txDate, setTxDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [txKostId, setTxKostId] = useState<string>('');

  // Fetch transactions on mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (activeTab === 'promos') {
      fetchPromos();
    } else if (activeTab === 'requests') {
      fetchTenantRequests();
    }
  }, [activeTab]);

  const fetchTransactions = async () => {
    try {
      setLoadingTx(true);
      const data = await api.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Failed to load transactions:', err);
    } finally {
      setLoadingTx(false);
    }
  };

  const fetchPromos = async () => {
    try {
      setLoadingPromos(true);
      const data = await api.getPromos();
      setPromos(data);
    } catch (err) {
      console.error('Failed to load promos:', err);
    } finally {
      setLoadingPromos(false);
    }
  };

  const fetchTenantRequests = async () => {
    try {
      setLoadingRequests(true);
      const data = await api.getTenantRequests();
      setTenantRequests(data);
    } catch (err) {
      console.error('Failed to load tenant requests:', err);
    } finally {
      setLoadingRequests(false);
    }
  };

  const handleCreateOrUpdatePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoCode || promoDiscount <= 0 || !promoTitle) {
      toast.error('Harap isi data kode, diskon, dan judul dengan benar.');
      return;
    }
    const toastId = toast.loading(editingPromo ? 'Memperbarui voucher...' : 'Menyimpan voucher...');
    try {
      const payload: Partial<Promo> = {
        code: promoCode.toUpperCase().trim(),
        discountPercent: Number(promoDiscount),
        title: promoTitle,
        description: promoDesc,
        expiresAt: new Date(promoExpires).getTime()
      };
      if (editingPromo) {
        await api.editPromo(editingPromo.id, payload);
        toast.update(toastId, { type: 'success', message: 'Voucher berhasil diperbarui!' });
      } else {
        await api.addPromo(payload);
        toast.update(toastId, { type: 'success', message: 'Voucher baru berhasil dibuat!' });
      }
      resetPromoForm();
      setShowAddPromoModal(false);
      fetchPromos();
    } catch (err: any) {
      console.error(err);
      toast.update(toastId, { type: 'error', message: err.message || 'Gagal menyimpan voucher.' });
    }
  };

  const handleDeletePromo = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus voucher promo ini?')) return;
    const toastId = toast.loading('Menghapus voucher...');
    try {
      await api.deletePromo(id);
      toast.update(toastId, { type: 'success', message: 'Voucher berhasil dihapus!' });
      fetchPromos();
    } catch (err: any) {
      console.error(err);
      toast.update(toastId, { type: 'error', message: err.message || 'Gagal menghapus voucher.' });
    }
  };

  const handleStartEditPromo = (promo: Promo) => {
    setEditingPromo(promo);
    setPromoCode(promo.code);
    setPromoDiscount(promo.discountPercent);
    setPromoTitle(promo.title);
    setPromoDesc(promo.description || '');
    setPromoExpires(new Date(promo.expiresAt).toISOString().split('T')[0]);
    setShowAddPromoModal(true);
  };

  const resetPromoForm = () => {
    setEditingPromo(null);
    setPromoCode('');
    setPromoDiscount(10);
    setPromoTitle('');
    setPromoDesc('');
    setPromoExpires(new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString().split('T')[0]);
  };

  const handleTenantRequestStatus = async (id: number, status: 'Approved' | 'Rejected') => {
    const actionText = status === 'Approved' ? 'menyetujui' : 'menolak';
    const toastId = toast.loading(`Sedang ${actionText} pengajuan...`);
    try {
      await api.updateTenantRequestStatus(id, status);
      toast.update(toastId, { type: 'success', message: `Pengajuan berhasil di${status === 'Approved' ? 'setujui' : 'tolak'}!` });
      fetchTenantRequests();
      if (onRefreshData) {
        await onRefreshData();
      }
    } catch (err: any) {
      console.error(err);
      toast.update(toastId, { type: 'error', message: err.message || 'Gagal memperbarui status pengajuan.' });
    }
  };

  const handleCreateOrUpdateTx = async (e: React.FormEvent) => {
    e.preventDefault();
    if (txAmount <= 0 || !txCategory || !txDate) {
      toast.error('Harap isi data nominal, kategori, dan tanggal dengan benar.');
      return;
    }

    const toastId = toast.loading(editingTx ? 'Memperbarui transaksi...' : 'Menyimpan transaksi...');
    try {
      const payload: Partial<FinancialTransaction> = {
        type: txType,
        amount: Number(txAmount),
        category: txCategory,
        description: txDescription,
        date: txDate,
        kostId: txKostId || null
      };

      if (editingTx) {
        const updated = await api.editTransaction(editingTx.id, payload);
        setTransactions(prev => prev.map(t => t.id === updated.id ? updated : t));
        toast.update(toastId, { type: 'success', message: 'Transaksi berhasil diperbarui!' });
      } else {
        const created = await api.addTransaction(payload);
        setTransactions(prev => [created, ...prev]);
        toast.update(toastId, { type: 'success', message: 'Transaksi baru berhasil dicatat!' });
      }

      // Reset & Close Modal
      resetTxForm();
      setShowAddTxModal(false);
    } catch (err: any) {
      console.error(err);
      toast.update(toastId, { type: 'error', message: err.message || 'Gagal menyimpan transaksi.' });
    }
  };

  const handleStartEditTx = (tx: FinancialTransaction) => {
    setEditingTx(tx);
    setTxType(tx.type);
    setTxAmount(tx.amount);
    setTxCategory(tx.category);
    setTxDescription(tx.description || '');
    setTxDate(tx.date);
    setTxKostId(tx.kostId || '');
    setShowAddTxModal(true);
  };

  const handleDeleteTx = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan transaksi ini?')) return;

    const toastId = toast.loading('Menghapus catatan transaksi...');
    try {
      await api.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
      toast.update(toastId, { type: 'success', message: 'Catatan transaksi berhasil dihapus!' });
    } catch (err: any) {
      console.error(err);
      toast.update(toastId, { type: 'error', message: err.message || 'Gagal menghapus transaksi.' });
    }
  };

  const resetTxForm = () => {
    setEditingTx(null);
    setTxType('Income');
    setTxAmount(0);
    setTxCategory('Sewa Kamar');
    setTxDescription('');
    setTxDate(new Date().toISOString().split('T')[0]);
    setTxKostId('');
  };

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


  // Generate monthly financial data dynamically for charts
  const getChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    
    // Initialize an array of 12 months for 2026
    const monthlyDataMap: Record<number, { month: string; Pemasukan: number; Pengeluaran: number }> = {};
    for (let i = 0; i < 12; i++) {
      monthlyDataMap[i] = {
        month: months[i],
        Pemasukan: 0,
        Pengeluaran: 0
      };
    }

    // Populate data from actual transactions
    transactions.forEach(tx => {
      if (!tx.date) return;
      const dateParts = tx.date.split('-');
      if (dateParts.length < 2) return;
      
      const monthIdx = parseInt(dateParts[1], 10) - 1; // 0-indexed
      if (monthIdx >= 0 && monthIdx < 12) {
        const amt = Number(tx.amount);
        if (tx.type === 'Income') {
          monthlyDataMap[monthIdx].Pemasukan += amt;
        } else {
          monthlyDataMap[monthIdx].Pengeluaran += amt;
        }
      }
    });

    // Return the first 6 months (Jan-Jun) as standard view
    return Object.values(monthlyDataMap).slice(0, 6).map(d => ({
      ...d,
      Pendapatan: d.Pemasukan, // for backwards compatibility with the original line chart
      Pengeluaran: d.Pengeluaran
    }));
  };

  const revenueData = getChartData();

  // Dynamic calculations for overall stats card
  const currentMonthNum = '06'; // June
  const currentMonthTransactions = transactions.filter(tx => tx.date && tx.date.split('-')[1] === currentMonthNum);
  
  const currentMonthIncome = currentMonthTransactions
    .filter(tx => tx.type === 'Income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const prevMonthNum = '05'; // May
  const prevMonthIncome = transactions
    .filter(tx => tx.date && tx.date.split('-')[1] === prevMonthNum && tx.type === 'Income')
    .reduce((sum, tx) => sum + Number(tx.amount), 0);

  const incomeChangePercent = prevMonthIncome > 0 
    ? (((currentMonthIncome - prevMonthIncome) / prevMonthIncome) * 100).toFixed(1)
    : '0.0';

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
                      <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Foto Utama (URL Cover / Upload File)</label>
                      <div className="flex gap-3">
                        <input type="text" value={isEdit ? editImage : newImage} onChange={(e) => isEdit ? setEditImage(e.target.value) : setNewImage(e.target.value)} className="flex-1 bg-transparent border-b border-[#2A2A2A] focus:border-white px-0 py-3 text-sm text-white focus:outline-none transition-colors" placeholder="https://..." />
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (isEdit) setEditImage(reader.result as string);
                                  else setNewImage(reader.result as string);
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                          />
                          <button type="button" className="h-12 px-4 bg-[#141414] border border-[#2A2A2A] rounded-xl flex items-center justify-center text-white hover:bg-[#1C1C1C] transition-colors cursor-pointer" title="Upload Cover Lokal">
                            <UploadCloud className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
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
        
        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => {
              setScannedBarcodeId('');
              setScannedBooking(null);
              setShowScannerModal(true);
            }}
            className="px-5 py-2.5 bg-[#FFB800] hover:bg-[#E6A600] text-black font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors shadow-[0_0_15px_rgba(255,184,0,0.3)]"
          >
            <QrCode className="w-4 h-4" />
            Scan Barcode Survey
          </button>
          <button
            id="btn-add-kost-modal"
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-white hover:bg-[#B0B0B0] text-black font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Registrasi Kost Baru
          </button>
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center gap-2 border-b border-[#1C1C1C] pb-4">
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
          onClick={() => setActiveTab('finance')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all rounded-lg cursor-pointer ${
            activeTab === 'finance'
              ? 'bg-white text-black'
              : 'text-[#808080] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          Pencatatan Keuangan
        </button>
        <button
          onClick={() => setActiveTab('promos')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all rounded-lg cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'promos'
              ? 'bg-white text-black'
              : 'text-[#808080] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <Ticket className="w-3.5 h-3.5" />
          Kelola Voucher Promo
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 text-xs font-mono uppercase tracking-widest font-bold transition-all rounded-lg cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'requests'
              ? 'bg-white text-black'
              : 'text-[#808080] hover:text-white hover:bg-white/5 border border-transparent'
          }`}
        >
          <FileClock className="w-3.5 h-3.5" />
          Pengajuan Penghuni
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

      {activeTab === 'dashboard' && (
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
            <p className="text-xl font-sans font-black text-white mt-1">{formatRupiah(currentMonthIncome)}</p>
            <div className="text-[11px] text-[#A3A3A3] flex items-center gap-1 mt-0.5 font-medium">
              <TrendingUp className="w-3.5 h-3.5 inline" />
              <span>{Number(incomeChangePercent) >= 0 ? '+' : ''}{incomeChangePercent}% bln lalu</span>
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
                  <linearGradient id="expenseGlow" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0}/>
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
                  formatter={(val, name) => [formatRupiah(Number(val)), name]}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                <Line 
                  name="Pemasukan"
                  type="monotone" 
                  dataKey="Pendapatan" 
                  stroke="#B0B0B0" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#B0B0B0', strokeWidth: 1 }} 
                  activeDot={{ r: 6 }}
                />
                <Line 
                  name="Pengeluaran"
                  type="monotone" 
                  dataKey="Pengeluaran" 
                  stroke="#EF4444" 
                  strokeWidth={3} 
                  dot={{ r: 4, stroke: '#EF4444', strokeWidth: 1 }} 
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
                  <th className="p-4">Tanggal Survey</th>
                  <th className="p-4">Jam Survey</th>
                  <th className="p-4">Biaya Survey</th>
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
                          {booking.userEmail && <p className="text-[10px] text-[#606060] font-mono">{booking.userEmail}</p>}
                        </div>
                      </td>
                      <td className="p-4 text-[#B0B0B0]">
                        <p className="font-medium">{booking.kostName}</p>
                        <p className="text-[10px] text-[#808080] font-mono mt-0.5">{booking.paymentMethod}</p>
                      </td>
                      <td className="p-4 text-[#B0B0B0] font-mono font-semibold">
                        {booking.startDate}
                      </td>
                      <td className="p-4 font-semibold font-mono text-white">
                        {booking.surveyTime || '—'}
                      </td>
                      <td className="p-4 text-emerald-400 font-bold font-mono">
                        Gratis
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
      )}

      {activeTab === 'finance' && (
        <div className="space-y-8 animate-in fade-in duration-300 text-left">
          {/* Top Finance Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Inflow */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 flex items-center gap-4">
              <div className="p-3 bg-emerald-950/20 rounded-xl border border-emerald-900/30 text-emerald-400">
                <ArrowUpRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-[#808080] font-mono uppercase tracking-wider">Total Uang Masuk</p>
                <p className="text-2xl font-sans font-black text-white mt-1">
                  {formatRupiah(transactions.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0))}
                </p>
                <p className="text-[10px] text-emerald-400/80 font-mono mt-1 uppercase tracking-widest font-semibold">Semua waktu</p>
              </div>
            </div>

            {/* Total Outflow */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 flex items-center gap-4">
              <div className="p-3 bg-red-950/20 rounded-xl border border-red-900/30 text-red-400">
                <ArrowDownRight className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-[#808080] font-mono uppercase tracking-wider">Total Uang Keluar</p>
                <p className="text-2xl font-sans font-black text-white mt-1">
                  {formatRupiah(transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0))}
                </p>
                <p className="text-[10px] text-red-400/80 font-mono mt-1 uppercase tracking-widest font-semibold">Semua waktu</p>
              </div>
            </div>

            {/* Net Balance */}
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-6 flex items-center gap-4">
              {(() => {
                const totalIn = transactions.filter(t => t.type === 'Income').reduce((s, t) => s + Number(t.amount), 0);
                const totalOut = transactions.filter(t => t.type === 'Expense').reduce((s, t) => s + Number(t.amount), 0);
                const net = totalIn - totalOut;
                return (
                  <>
                    <div className={`p-3 rounded-xl border ${net >= 0 ? 'bg-white/5 border-[#2A2A2A] text-white' : 'bg-orange-950/20 border-orange-900/30 text-orange-400'}`}>
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-[#808080] font-mono uppercase tracking-wider">Keuntungan Bersih</p>
                      <p className={`text-2xl font-sans font-black mt-1 ${net >= 0 ? 'text-white' : 'text-orange-400'}`}>
                        {formatRupiah(net)}
                      </p>
                      <p className="text-[10px] text-[#A3A3A3] font-mono mt-1 uppercase tracking-widest font-semibold">Sisa Saldo Kas</p>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Cashflow Ledger list */}
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl">
            <div className="px-6 py-5 border-b border-[#2A2A2A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#949494]" />
                  Buku Kas & Riwayat Keuangan
                </h2>
                <p className="text-[10px] text-[#808080] font-sans mt-0.5">Catatan pengeluaran operasional dan penerimaan sewa.</p>
              </div>

              <button
                onClick={() => { resetTxForm(); setShowAddTxModal(true); }}
                className="px-4 py-2 bg-white hover:bg-[#B0B0B0] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                Catat Transaksi Kas
              </button>
            </div>

            <div className="divide-y divide-[#2A2A2A] custom-scrollbar overflow-x-auto">
              {loadingTx ? (
                <div className="p-12 text-center text-xs text-[#808080]">Memuat data kas...</div>
              ) : transactions.length === 0 ? (
                <div className="p-12 text-center text-[#808080] text-xs flex flex-col items-center justify-center gap-2">
                  <AlertCircle className="w-6 h-6 text-[#3A3A3A]" />
                  <span>Belum ada riwayat transaksi keuangan.</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-[#0A0A0A] text-[#808080] text-[11px] font-mono uppercase tracking-wider border-b border-[#2A2A2A]">
                      <th className="p-4">Tanggal</th>
                      <th className="p-4 text-center">Tipe</th>
                      <th className="p-4">Kategori</th>
                      <th className="p-4">Deskripsi / Rincian</th>
                      <th className="p-4">Properti Terkait</th>
                      <th className="p-4 text-right">Nominal</th>
                      <th className="p-4 text-right">Opsi</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-[#2A2A2A]">
                    {transactions.map((tx) => {
                      const associatedKost = kostList.find(k => k.id === tx.kostId);
                      return (
                        <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono text-[#B0B0B0]">{tx.date}</td>
                          <td className="p-4 text-center">
                            {tx.type === 'Income' ? (
                              <span className="text-[9px] font-mono font-bold bg-emerald-950/30 text-emerald-400 border border-emerald-900/30 px-2 py-0.5 rounded">
                                MASUK
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold bg-red-950/30 text-red-400 border border-red-900/30 px-2 py-0.5 rounded">
                                KELUAR
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-white font-medium">{tx.category}</td>
                          <td className="p-4 text-[#A3A3A3] max-w-xs truncate" title={tx.description || ''}>
                            {tx.description || '—'}
                          </td>
                          <td className="p-4 text-[#808080]">
                            {associatedKost ? associatedKost.name : 'Semua Kost (Global)'}
                          </td>
                          <td className={`p-4 text-right font-mono font-bold ${tx.type === 'Income' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {tx.type === 'Income' ? '+' : '-'} {formatRupiah(tx.amount)}
                          </td>
                          <td className="p-4 text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <button
                                onClick={() => handleStartEditTx(tx)}
                                className="bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#2A2A2A] text-[#A3A3A3] hover:text-white p-1.5 rounded-lg cursor-pointer transition-colors"
                                title="Edit Catatan"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTx(tx.id)}
                                className="bg-red-950/20 border border-red-900/30 text-red-500 hover:bg-red-900/40 hover:text-red-400 p-1.5 rounded-lg cursor-pointer transition-colors"
                                title="Hapus Catatan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Add/Edit Transaction Form Modal */}
          {showAddTxModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#141414] border border-[#2A2A2A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
              >
                <div className="px-6 py-5 border-b border-[#2A2A2A] flex items-center justify-between">
                  <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-[#808080]" />
                    {editingTx ? 'Edit Catatan Transaksi' : 'Catat Transaksi Keuangan'}
                  </h3>
                  <button onClick={() => { resetTxForm(); setShowAddTxModal(false); }} className="text-[#808080] hover:text-white transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateOrUpdateTx} className="p-6 space-y-6">
                  {/* Transaction Type Selection */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Tipe Transaksi</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setTxType('Income')}
                        className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                          txType === 'Income'
                            ? 'bg-emerald-950/30 text-emerald-400 border-emerald-500/50'
                            : 'bg-transparent border-[#2A2A2A] text-[#808080] hover:border-[#3A3A3A]'
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        Pemasukan (Uang Masuk)
                      </button>
                      <button
                        type="button"
                        onClick={() => setTxType('Expense')}
                        className={`py-3 px-4 rounded-xl border font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                          txType === 'Expense'
                            ? 'bg-red-950/30 text-red-400 border-red-500/50'
                            : 'bg-transparent border-[#2A2A2A] text-[#808080] hover:border-[#3A3A3A]'
                        }`}
                      >
                        <ArrowDownRight className="w-4 h-4" />
                        Pengeluaran (Uang Keluar)
                      </button>
                    </div>
                  </div>

                  {/* Nominal Amount */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Nominal Jumlah (Rupiah)</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={txAmount}
                      onChange={(e) => setTxAmount(Number(e.target.value))}
                      className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#5A5A5A] outline-none transition-colors font-mono font-bold"
                      placeholder="Contoh: 1500000"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Category Selection */}
                    <div>
                      <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Kategori</label>
                      <select
                        value={txCategory}
                        onChange={(e) => setTxCategory(e.target.value)}
                        className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-[#A3A3A3] focus:text-white focus:border-[#5A5A5A] outline-none transition-colors"
                      >
                        {txType === 'Income' ? (
                          <>
                            <option value="Sewa Kamar" className="bg-[#141414]">Sewa Kamar</option>
                            <option value="Deposit" className="bg-[#141414]">Uang Jaminan / Deposit</option>
                            <option value="Lain-lain" className="bg-[#141414]">Lain-lain</option>
                          </>
                        ) : (
                          <>
                            <option value="Listrik & Air" className="bg-[#141414]">Listrik & Air</option>
                            <option value="Gaji Karyawan" className="bg-[#141414]">Gaji Karyawan</option>
                            <option value="Maintenance" className="bg-[#141414]">Maintenance / Perbaikan</option>
                            <option value="Internet" className="bg-[#141414]">Internet / Wifi</option>
                            <option value="Lain-lain" className="bg-[#141414]">Lain-lain</option>
                          </>
                        )}
                      </select>
                    </div>

                    {/* Transaction Date */}
                    <div>
                      <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Tanggal Transaksi</label>
                      <input
                        type="date"
                        required
                        value={txDate}
                        onChange={(e) => setTxDate(e.target.value)}
                        className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#5A5A5A] outline-none transition-colors font-mono"
                      />
                    </div>
                  </div>

                  {/* Associated Property (Optional) */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Tautkan ke Unit Kost (Opsional)</label>
                    <select
                      value={txKostId}
                      onChange={(e) => setTxKostId(e.target.value)}
                      className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-[#A3A3A3] focus:text-white focus:border-[#5A5A5A] outline-none transition-colors"
                    >
                      <option value="" className="bg-[#141414]">Global / Tidak Terikat Unit Spesifik</option>
                      {kostList.map(kost => (
                        <option key={kost.id} value={kost.id} className="bg-[#141414]">{kost.name}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Deskripsi / Keterangan Tambahan</label>
                    <textarea
                      rows={3}
                      value={txDescription}
                      onChange={(e) => setTxDescription(e.target.value)}
                      className="w-full p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#5A5A5A] outline-none transition-colors resize-none placeholder:text-[#3A3A3A]"
                      placeholder="Contoh: Pembayaran internet wifi Biznet bulan Juni."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-[#2A2A2A] flex gap-3">
                    <button
                      type="button"
                      onClick={() => { resetTxForm(); setShowAddTxModal(false); }}
                      className="flex-1 py-3 border border-[#2A2A2A] hover:bg-[#1C1C1C] rounded-xl text-xs font-bold uppercase tracking-widest text-[#808080] hover:text-white transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-white hover:bg-[#B0B0B0] text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Simpan Catatan
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'banners' && (
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

      {/* ======================= */}
      {/* 4. KELOLA VOUCHER PROMO TAB */}
      {/* ======================= */}
      {activeTab === 'promos' && (
        <div className="space-y-6 animate-in fade-in duration-300 text-left">
          <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4">
            <div>
              <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
                <Ticket className="w-4 h-4 text-[#FFB800]" />
                Manajemen Voucher & Kode Promo
              </h3>
              <p className="text-[10px] text-[#808080] font-sans mt-0.5">Buat dan kelola voucher diskon untuk menarik penyewa baru.</p>
            </div>
            <button
              onClick={() => { resetPromoForm(); setShowAddPromoModal(true); }}
              className="px-4 py-2 bg-[#FFB800] hover:bg-[#E6A600] text-black font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              Buat Voucher Baru
            </button>
          </div>

          {loadingPromos ? (
            <div className="p-12 text-center text-xs text-[#808080]">Memuat daftar voucher promo...</div>
          ) : promos.length === 0 ? (
            <div className="p-16 border border-dashed border-[#2A2A2A] text-center rounded-2xl text-[#808080] text-xs">
              <span>Belum ada voucher promo aktif. Klik "Buat Voucher Baru" untuk membuat.</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {promos.map((promo) => {
                const isExpired = promo.expiresAt < Date.now();
                return (
                  <div key={promo.id} className="bg-[#141414] border border-[#2A2A2A] rounded-2xl p-5 flex flex-col justify-between group transition-all duration-300 hover:border-[#3A3A3A] relative overflow-hidden">
                    {/* Golden accent card top indicator */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-[#FFB800]"></div>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-mono font-bold bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20 px-2.5 py-1 rounded">
                          CODE: {promo.code}
                        </span>
                        <span className="text-xl font-black text-white font-mono">{promo.discountPercent}% OFF</span>
                      </div>
                      <h4 className="text-sm font-bold text-white tracking-wide truncate mb-1">{promo.title}</h4>
                      <p className="text-xs text-[#808080] leading-relaxed line-clamp-2 mb-4">{promo.description || 'Tidak ada deskripsi.'}</p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-[#2A2A2A] flex items-center justify-between">
                      <span className={`text-[10px] font-mono ${isExpired ? 'text-red-500' : 'text-[#808080]'}`}>
                        Berlaku s.d: {new Date(promo.expiresAt).toLocaleDateString('id-ID')} {isExpired ? '(Expired)' : ''}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleStartEditPromo(promo)}
                          className="p-1.5 bg-[#1C1C1C] border border-[#2A2A2A] hover:bg-[#2A2A2A] text-[#A3A3A3] hover:text-white rounded-lg cursor-pointer transition-colors"
                          title="Edit Voucher"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeletePromo(promo.id)}
                          className="p-1.5 bg-red-950/20 border border-red-900/30 text-red-500 hover:bg-red-900/40 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
                          title="Hapus Voucher"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add/Edit Promo Modal */}
          {showAddPromoModal && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#141414] border border-[#2A2A2A] rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
              >
                <div className="px-6 py-5 border-b border-[#2A2A2A] flex items-center justify-between">
                  <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Ticket className="w-4 h-4 text-[#FFB800]" />
                    {editingPromo ? 'Edit Voucher Promo' : 'Buat Voucher Promo Baru'}
                  </h3>
                  <button onClick={() => { resetPromoForm(); setShowAddPromoModal(false); }} className="text-[#808080] hover:text-white transition-colors cursor-pointer">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleCreateOrUpdatePromo} className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Promo Code */}
                    <div>
                      <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Kode Voucher</label>
                      <input
                        type="text"
                        required
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#FFB800] outline-none transition-colors font-mono font-bold uppercase"
                        placeholder="Contoh: DIHEMAT35"
                      />
                    </div>
                    {/* Discount */}
                    <div>
                      <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Potongan Harga (%)</label>
                      <input
                        type="number"
                        required
                        min="1"
                        max="100"
                        value={promoDiscount}
                        onChange={(e) => setPromoDiscount(Number(e.target.value))}
                        className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#FFB800] outline-none transition-colors font-mono font-bold"
                        placeholder="Contoh: 35"
                      />
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Judul Voucher</label>
                    <input
                      type="text"
                      required
                      value={promoTitle}
                      onChange={(e) => setPromoTitle(e.target.value)}
                      className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#FFB800] outline-none transition-colors"
                      placeholder="Contoh: Diskon Launching Pertama"
                    />
                  </div>

                  {/* Expiry Date */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Tanggal Kedaluwarsa</label>
                    <input
                      type="date"
                      required
                      value={promoExpires}
                      onChange={(e) => setPromoExpires(e.target.value)}
                      className="w-full h-12 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#FFB800] outline-none transition-colors font-mono"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Rincian Deskripsi</label>
                    <textarea
                      rows={3}
                      value={promoDesc}
                      onChange={(e) => setPromoDesc(e.target.value)}
                      className="w-full p-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#FFB800] outline-none transition-colors resize-none placeholder:text-[#3A3A3A]"
                      placeholder="Contoh: Voucher diskon 35% berlaku bagi penyewa kamar baru kost Di."
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4 border-t border-[#2A2A2A] flex gap-3">
                    <button
                      type="button"
                      onClick={() => { resetPromoForm(); setShowAddPromoModal(false); }}
                      className="flex-1 py-3 border border-[#2A2A2A] hover:bg-[#1C1C1C] rounded-xl text-xs font-bold uppercase tracking-widest text-[#808080] hover:text-white transition-colors cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-[#FFB800] hover:bg-[#E6A600] text-black rounded-xl text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer"
                    >
                      Simpan Voucher
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </div>
      )}

      {/* ======================= */}
      {/* 5. PENGAJUAN PENGHUNI TAB */}
      {/* ======================= */}
      {activeTab === 'requests' && (
        <div className="space-y-6 animate-in fade-in duration-300 text-left">
          <div>
            <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-white flex items-center gap-2">
              <FileClock className="w-4 h-4 text-[#FFB800]" />
              Daftar Pengajuan Penghuni Kos
            </h3>
            <p className="text-[10px] text-[#808080] font-sans mt-0.5">Kelola pengajuan check-out, perpanjangan sewa, dan pindah kamar dari penghuni.</p>
          </div>

          <div className="bg-[#141414] border border-[#2A2A2A] rounded-2xl overflow-hidden shadow-2xl">
            <div className="divide-y divide-[#2A2A2A] custom-scrollbar overflow-x-auto">
              {loadingRequests ? (
                <div className="p-12 text-center text-xs text-[#808080]">Memuat daftar pengajuan...</div>
              ) : tenantRequests.length === 0 ? (
                <div className="p-12 text-center text-[#808080] text-xs flex flex-col items-center justify-center gap-2">
                  <FileClock className="w-6 h-6 text-[#3A3A3A]" />
                  <span>Belum ada pengajuan masuk dari penghuni.</span>
                </div>
              ) : (
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-[#0A0A0A] text-[#808080] text-[11px] font-mono uppercase tracking-wider border-b border-[#2A2A2A]">
                      <th className="p-4">Penghuni</th>
                      <th className="p-4">Tipe Pengajuan</th>
                      <th className="p-4">Properti Kost</th>
                      <th className="p-4">Rincian Pengajuan</th>
                      <th className="p-4">Tanggal Pengajuan</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs divide-y divide-[#2A2A2A]">
                    {tenantRequests.map((req) => {
                      const requestDetails = typeof req.details === 'string' ? JSON.parse(req.details) : req.details;
                      return (
                        <tr key={req.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div>
                              <p className="font-semibold text-white font-sans">{req.userName || `User ID: ${req.userId}`}</p>
                              <p className="text-[10px] text-[#808080] font-mono mt-0.5">{req.userPhone || '—'}</p>
                            </div>
                          </td>
                          <td className="p-4">
                            {req.type === 'Checkout' ? (
                              <span className="text-[9px] font-mono font-bold bg-red-950/30 text-red-400 border border-red-900/30 px-2 py-0.5 rounded">
                                CHECK-OUT
                              </span>
                            ) : req.type === 'Extension' ? (
                              <span className="text-[9px] font-mono font-bold bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20 px-2 py-0.5 rounded">
                                PERPANJANG SEWA
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold bg-blue-950/30 text-blue-400 border border-blue-900/30 px-2 py-0.5 rounded">
                                PINDAH KAMAR
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-[#B0B0B0] font-medium">
                            {req.kostName || `Kost ID: ${req.kostId}`}
                          </td>
                          <td className="p-4 text-white">
                            {req.type === 'Checkout' && (
                              <p className="font-mono text-[#A3A3A3]">Tgl Keluar: <strong className="text-white">{requestDetails.checkoutDate || '—'}</strong></p>
                            )}
                            {req.type === 'Extension' && (
                              <p className="font-mono text-[#A3A3A3]">Durasi: <strong className="text-white">+{requestDetails.months || 1} Bulan</strong></p>
                            )}
                            {req.type === 'RoomChange' && (
                              <p className="font-mono text-[#A3A3A3]">Kamar Tujuan: <strong className="text-white">{requestDetails.targetRoom || '—'}</strong></p>
                            )}
                            {requestDetails.reason && (
                              <p className="text-[10px] text-[#808080] mt-0.5 italic">" {requestDetails.reason} "</p>
                            )}
                          </td>
                          <td className="p-4 text-[#808080] font-mono">
                            {new Date(req.createdAt).toLocaleDateString('id-ID')}
                          </td>
                          <td className="p-4">
                            {req.status === 'Pending' ? (
                              <span className="text-[9px] font-mono bg-[#1C1C1C] border border-[#3A3A3A] px-2 py-1 rounded text-[#A3A3A3]">
                                MENUNGGU
                              </span>
                            ) : req.status === 'Approved' ? (
                              <span className="text-[9px] font-mono bg-emerald-950/30 border border-emerald-900/30 px-2 py-1 rounded text-emerald-400 font-bold uppercase">
                                DISETUJUI
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono bg-red-950/30 border border-red-900/30 px-2 py-1 rounded text-red-400 font-bold uppercase">
                                DITOLAK
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-right">
                            {req.status === 'Pending' ? (
                              <div className="flex items-center gap-2 justify-end">
                                <button
                                  onClick={() => handleTenantRequestStatus(req.id, 'Approved')}
                                  className="bg-white hover:bg-[#B0B0B0] p-1.5 rounded-lg text-black font-bold cursor-pointer transition-transform duration-200"
                                  title="Setujui Pengajuan"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleTenantRequestStatus(req.id, 'Rejected')}
                                  className="bg-[#1C1C1C] hover:bg-[#2A2A2A] border border-[#2A2A2A] p-1.5 rounded-lg text-white font-bold cursor-pointer transition-transform duration-200"
                                  title="Tolak Pengajuan"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[10px] text-[#808080] font-mono flex items-center justify-end gap-1">
                                <ShieldCheck className="w-3.5 h-3.5 text-[#A3A3A3]" />
                                Selesai
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
        </div>
      )}

      {/* ======================= */}
      {/* 6. SIMULATED BARCODE SCANNER MODAL */}
      {/* ======================= */}
      <AnimatePresence>
        {showScannerModal && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-[#141414] border border-[#FFB800]/20 rounded-3xl w-full max-w-4xl overflow-hidden shadow-[0_0_50px_rgba(255,184,0,0.15)] flex flex-col md:flex-row"
            >
              {/* Left Column: Simulated Camera Viewport */}
              <div className="md:w-1/2 bg-[#0A0A0A] p-8 flex flex-col items-center justify-center relative min-h-[350px] border-r border-[#2A2A2A]">
                {/* Scanner Target Frame */}
                <div className="w-64 h-64 border-2 border-dashed border-[#FFB800]/50 rounded-2xl relative flex items-center justify-center overflow-hidden">
                  <QrCode className="w-24 h-24 text-[#3A3A3A]" />
                  {/* Glowing Laser Scan Line */}
                  <div className="absolute left-0 right-0 h-1 bg-[#FFB800] shadow-[0_0_12px_#FFB800] animate-[pulse_1.5s_infinite] top-[10%]"></div>
                  
                  {scannedBooking && (
                    <motion.div 
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-center p-4 border border-[#FFB800]"
                    >
                      <Check className="w-12 h-12 text-[#FFB800] mb-2 animate-bounce" />
                      <p className="text-xs font-mono font-bold uppercase tracking-wider text-white">Verifikasi Sukses</p>
                      <p className="text-[10px] text-[#A3A3A3] mt-1 font-mono">{scannedBooking.id.toUpperCase()}</p>
                    </motion.div>
                  )}
                </div>
                
                <p className="text-[10px] font-mono text-[#808080] uppercase tracking-widest mt-6">
                  {scannedBooking ? 'Scan Berhasil' : 'Arahkan kamera ke barcode / Pilih reservasi'}
                </p>
              </div>

              {/* Right Column: Information & Details Panel */}
              <div className="md:w-1/2 p-6 md:p-8 flex flex-col justify-between text-left">
                <div>
                  <div className="flex items-center justify-between border-b border-[#2A2A2A] pb-4 mb-6">
                    <h3 className="text-sm font-sans font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#FFB800]" />
                      Scan Barcode Survey Kost
                    </h3>
                    <button 
                      onClick={() => setShowScannerModal(false)}
                      className="text-[#808080] hover:text-white transition-colors cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Manual Code Input */}
                  <div className="mb-6">
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Input ID Barcode Manual (Booking ID)</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={scannedBarcodeId}
                        onChange={(e) => {
                          const val = e.target.value;
                          setScannedBarcodeId(val);
                          const matched = bookings.find(b => b.id.toLowerCase() === val.toLowerCase() && b.status === 'Disetujui');
                          setScannedBooking(matched || null);
                        }}
                        className="flex-1 h-11 px-4 bg-[#0A0A0A] border border-[#2A2A2A] rounded-xl text-sm text-white focus:border-[#FFB800] outline-none transition-colors font-mono uppercase"
                        placeholder="Contoh: booking-178..."
                      />
                    </div>
                  </div>

                  {/* Eligible Bookings to Simulate Scan */}
                  <div className="mb-6">
                    <label className="block text-[10px] font-mono text-[#808080] uppercase tracking-widest mb-2">Pilih Booking Disetujui (Simulasi Scan)</label>
                    {bookings.filter(b => b.status === 'Disetujui').length === 0 ? (
                      <p className="text-[10px] text-[#5A5A5A] italic">Tidak ada sewa berstatus 'Disetujui' (Survey) untuk disimulasikan.</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                        {bookings.filter(b => b.status === 'Disetujui').map(b => (
                          <button
                            key={b.id}
                            onClick={() => {
                              setScannedBarcodeId(b.id);
                              setScannedBooking(b);
                            }}
                            className={`px-3 py-1.5 border rounded-lg text-[10px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
                              scannedBarcodeId === b.id
                                ? 'bg-[#FFB800]/10 border-[#FFB800] text-[#FFB800]'
                                : 'bg-[#0A0A0A] border-[#2A2A2A] text-[#808080] hover:border-[#3A3A3A] hover:text-white'
                            }`}
                          >
                            {b.userName} ({b.id.substring(0, 8)}...)
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Scanned Details View */}
                  {scannedBooking ? (
                    <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-2xl p-4 space-y-3 animate-in fade-in duration-300">
                      <div className="flex justify-between items-start border-b border-[#1C1C1C] pb-2">
                        <div>
                          <p className="text-[10px] font-mono text-[#808080] uppercase tracking-widest">Calon Penyewa</p>
                          <p className="text-sm font-bold text-white mt-0.5">{scannedBooking.userName}</p>
                          <p className="text-[10px] text-[#A3A3A3] font-mono">{scannedBooking.userPhone}</p>
                        </div>
                        <span className="text-[9px] font-mono bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20 px-2 py-0.5 rounded font-black uppercase">
                          STATUS: {scannedBooking.status}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-[10px] font-mono text-[#808080] uppercase">Unit Kost</p>
                          <p className="font-semibold text-white mt-0.5 truncate">{scannedBooking.kostName}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-[#808080] uppercase">Durasi Sewa</p>
                          <p className="font-semibold text-white mt-0.5">{scannedBooking.duration} Bulan</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-[#808080] uppercase">Mulai Tanggal</p>
                          <p className="font-semibold text-white mt-0.5 font-mono">{scannedBooking.startDate}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-mono text-[#808080] uppercase">Total Harga</p>
                          <p className="font-bold text-[#FFB800] mt-0.5 font-mono">{formatRupiah(scannedBooking.totalPrice)}</p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="h-28 bg-[#0A0A0A] border border-[#2A2A2A] border-dashed rounded-2xl flex items-center justify-center text-center text-[#808080] text-xs">
                      <span>Pilih salah satu booking di atas atau input ID manual untuk memverifikasi detail.</span>
                    </div>
                  )}
                </div>

                {/* Confirmation Action Button */}
                <div className="pt-6 mt-6 border-t border-[#2A2A2A]">
                  <button
                    disabled={!scannedBooking}
                    onClick={async () => {
                      if (!scannedBooking) return;
                      const toastId = toast.loading('Sedang mengonfirmasi check-in...');
                      try {
                        await api.updateBookingStatus(scannedBooking.id, 'Penyewa');
                        toast.update(toastId, { type: 'success', message: 'Verifikasi barcode sukses! Calon penyewa resmi dirubah menjadi Penyewa aktif.' });
                        setShowScannerModal(false);
                        if (onRefreshData) {
                          await onRefreshData();
                        }
                      } catch (err: any) {
                        console.error(err);
                        toast.update(toastId, { type: 'error', message: err.message || 'Gagal merubah status sewa.' });
                      }
                    }}
                    className="w-full py-3.5 bg-[#FFB800] hover:bg-[#E6A600] disabled:bg-[#3A3A3A] disabled:text-[#808080] text-black font-black uppercase tracking-widest text-xs rounded-xl cursor-pointer transition-all shadow-[0_0_15px_rgba(255,184,0,0.2)] disabled:shadow-none flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Konfirmasi Check-in (Ubah ke Penyewa)
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}