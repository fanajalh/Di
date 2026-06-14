import { useState, useRef, useEffect } from 'react';
import { 
  Building, 
  Search, 
  UserCheck, 
  Grid, 
  Bell, 
  User, 
  Shield, 
  LogOut,
  Sparkles,
  MessageSquare,
  CreditCard,
  CheckCircle2,
  Trash2,
  CheckCheck,
  ChevronDown
} from 'lucide-react';
import { useSession } from './AuthContext';

interface NavbarProps {
  currentView: 'landing' | 'catalog' | 'dashboard' | 'buyer-dashboard' | 'my-bookings' | 'profile' | 'login' | 'register' | 'forgot-password' | 'verify-otp';
  onNavigate: (view: 'landing' | 'catalog' | 'dashboard' | 'buyer-dashboard' | 'my-bookings' | 'profile' | 'login' | 'register' | 'forgot-password' | 'verify-otp') => void;
  pendingCount: number;
}

export default function Navbar({ currentView, onNavigate, pendingCount }: NavbarProps) {
  const { session, signOut, signIn } = useSession();
  
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside clicks
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-md border-b border-[#2A2A2A] font-sans">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <button 
            onClick={() => onNavigate('landing')} 
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer group"
          >
            <div className="p-2 bg-white rounded-lg flex items-center justify-center group-hover:scale-105 duration-300">
              <Building className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-display font-black tracking-widest text-white font-display">
                Di
              </span>
              <span className="hidden sm:block text-[9px] font-mono text-[#5A5A5A] uppercase tracking-widest">Premium Living</span>
            </div>
          </button>

          {/* Navigation Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Find rooms */}
            <button
              id="nav-search"
              onClick={() => onNavigate('catalog')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                currentView === 'catalog' 
                  ? 'bg-white/10 text-white border-[#3A3A3A]' 
                  : 'text-[#6B6B6B] hover:text-white border-transparent hover:bg-white/5'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Cari Kost</span>
            </button>

            {/* My Booking Status / Buyer Dashboard */}
            {session && session.user.role === 'User' && (
              <button
                id="nav-buyer-dashboard"
                onClick={() => onNavigate('buyer-dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative border ${
                  currentView === 'buyer-dashboard'
                    ? 'bg-white/10 text-white border-[#3A3A3A]'
                    : 'text-[#6B6B6B] hover:text-white border-transparent hover:bg-white/5'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </button>
            )}

            {/* Dashboard Owner tab - only visible or customized based on account role */}
            {session?.user?.role === 'Owner' && (
              <button
                id="nav-dashboard"
                onClick={() => onNavigate('dashboard')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer relative border ${
                  currentView === 'dashboard'
                    ? 'bg-white text-black border-white shadow-md'
                    : 'bg-[#1C1C1C] border border-[#2A2A2A] text-[#8A8A8A] hover:bg-[#2A2A2A] hover:text-white'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Owner Panel</span>
                {pendingCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-white text-[9px] text-black font-mono font-bold flex items-center justify-center rounded-full">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}

            {/* Divider */}
            <div className="w-px h-6 bg-[#2A2A2A] mx-1 hidden sm:block"></div>

            {/* Profile Avatar session check dropdown */}
            <div className="relative" ref={profileRef}>
              {session ? (
                <button
                  id="nav-profile-menu-trigger"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-1.5 p-1.5 rounded-xl hover:bg-white/5 transition-all text-left cursor-pointer align-middle"
                >
                  <img 
                    src={session.user.image} 
                    alt={session.user.name} 
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 object-cover rounded-lg border border-[#2A2A2A] shadow"
                  />
                  <ChevronDown className={`w-3.5 h-3.5 text-[#5A5A5A] transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                </button>
              ) : (
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 bg-white hover:bg-[#B0B0B0] rounded-xl text-xs font-bold text-black cursor-pointer transition-all"
                >
                  Masuk Akun
                </button>
              )}

              {showProfileMenu && session && (
                <div className="absolute right-0 mt-2 w-52 bg-[#141414] border border-[#2A2A2A] rounded-xl shadow-2xl overflow-hidden z-50 text-left animate-slide-in">
                  <div className="px-4 py-3 bg-[#0A0A0A] border-b border-[#2A2A2A]">
                    <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
                    <p className="text-[10px] font-mono text-[#5A5A5A] truncate mt-0.5">{session.user.email}</p>
                  </div>
                  
                  <div className="p-1.5 space-y-0.5 text-xs text-[#8A8A8A]">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-[#6B6B6B]" />
                      <span>Profil Saya</span>
                    </button>
                    
                    {/* Switch role demo helper */}
                    <button
                      onClick={() => {
                        // toggle between role simulated in google vs github provider login
                        if (session.user.role === 'User') {
                          signIn('ahmad.gede@owner.id', '', 'credentials');
                        } else {
                          signIn('arfan.7ovo@gmail.com', '', 'credentials');
                        }
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 rounded-lg flex items-center justify-between cursor-pointer text-[#6B6B6B] group"
                    >
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#5A5A5A]" />
                        <span className="text-[11px]">Ganti Akun Demo</span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 bg-white/5 rounded text-[#8A8A8A]">{session.user.role === 'User' ? 'Owner' : 'Tenant'}</span>
                    </button>
                    
                    <div className="w-full h-px bg-[#2A2A2A] my-1"></div>

                    <button
                      onClick={() => {
                        signOut();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-white/5 text-[#8A8A8A] hover:text-white rounded-lg flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout Sesi</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}
