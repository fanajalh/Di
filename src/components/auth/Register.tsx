import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, ArrowRight, ShieldCheck, Eye, EyeOff } from 'lucide-react';

interface RegisterProps {
  onNavigate: (view: 'login' | 'landing') => void;
}

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
    <path
      fill="#EA4335"
      d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.48 14.99 1 12 1 7.35 1 3.37 3.67 1.39 7.56l3.85 2.99c.9-2.7 3.42-4.51 6.76-4.51z"
    />
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.42 3.57l3.77 2.92c2.2-2.03 3.48-5.01 3.48-8.64z"
    />
    <path
      fill="#FBBC05"
      d="M5.24 14.45A7.16 7.16 0 0 1 4.8 12c0-.85.15-1.67.44-2.45L1.39 6.56C.5 8.2.02 10.05.02 12c0 1.95.48 3.8 1.37 5.44l3.85-2.99z"
    />
    <path
      fill="#34A853"
      d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.77-2.92c-1.12.75-2.55 1.19-4.19 1.19-3.34 0-5.86-1.81-6.76-4.51l-3.85 2.99C3.37 20.33 7.35 23 12 23z"
    />
  </svg>
);

export default function Register({ onNavigate }: RegisterProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role: 'User' }), // Default to 'User'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      // Mock Google login
      const mockUser = {
        name: 'Google User',
        email: 'user.google@gmail.com',
        image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        role: 'User' as const,
        joinedDate: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long' })
      };
      localStorage.setItem('di_token', 'mock_google_token');
      localStorage.setItem('di_user', JSON.stringify(mockUser));
      window.location.reload();
    } catch (err) {
      setError('Google Sign-In failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0A0A0A] flex flex-col md:flex-row text-white font-sans selection:bg-white/20 selection:text-white">
      {/* Left Panel: Brand Showcase (Visible on md and up) */}
      <div className="hidden md:flex md:w-1/2 flex-col justify-between p-12 lg:p-20 bg-[#141414] border-r border-[#2A2A2A] relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{
              backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
              backgroundSize: '40px 40px'
            }}
          />
          {/* Geometric Circles */}
          <svg className="absolute -bottom-20 -left-20 w-[600px] h-[600px] text-[#2A2A2A]" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.1" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="currentColor" strokeWidth="0.1" strokeDasharray="1 1" />
          </svg>
        </div>

        {/* Brand Logo */}
        <div className="relative z-10 text-left">
          <button 
            onClick={() => onNavigate('landing')}
            className="text-sm font-semibold font-display tracking-[0.25em] text-white uppercase hover:text-[#B0B0B0] transition-colors cursor-pointer"
          >
            Di
          </button>
        </div>

        {/* Visual Copy */}
        <div className="relative z-10 max-w-lg text-left my-auto">
          <h1 className="text-4xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-8 text-white uppercase">
            Mulai <br />
            Langkah <br />
            <span className="font-semibold text-[#B0B0B0]">Baru Anda.</span>
          </h1>
          <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-md font-light">
            Buat akun Di sekarang untuk mendapatkan akses ke ratusan unit kost eksklusif, memantau pembayaran, dan melakukan survei langsung.
          </p>
        </div>

        {/* Empty footer space on left side for balancing split layout */}
        <div className="relative z-10">
          <p className="text-[10px] font-mono text-[#808080] uppercase tracking-widest">© 2026 Di INC.</p>
        </div>
      </div>

      {/* Right Panel: Form Area */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-[#0A0A0A] relative">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10 text-left"
        >
          {/* Logo on mobile only */}
          <div className="md:hidden mb-12 text-left">
            <button 
              onClick={() => onNavigate('landing')}
              className="text-xs font-semibold font-display tracking-[0.25em] text-white uppercase hover:text-[#B0B0B0] transition-colors cursor-pointer"
            >
              Di
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-light text-white tracking-tight mb-2 uppercase font-display">
              Buat Akun Baru
            </h2>
            <p className="text-xs text-[#A3A3A3] font-light">
              Bergabunglah dengan ekosistem Di hari ini.
            </p>
          </div>

          {error && (
            <div className="bg-[#1C1C1C] border border-[#606060] text-[#B0B0B0] text-xs p-3.5 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}

          {success ? (
            <div className="bg-[#141414] border border-[#2A2A2A] p-8 rounded-xl text-center">
              <ShieldCheck className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2 uppercase font-display">Registrasi Berhasil!</h3>
              <p className="text-xs text-[#A3A3A3]">Mengarahkan ke halaman login...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name Field */}
              <div className="space-y-2">
                <div className="flex items-center bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 focus-within:border-[#808080] transition-colors">
                  <User className="w-4 h-4 text-[#808080] shrink-0" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Full Name"
                    className="flex-1 bg-transparent py-4 px-4 text-sm text-white placeholder:text-[#606060] outline-none font-light"
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <div className="flex items-center bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 focus-within:border-[#808080] transition-colors">
                  <Mail className="w-4 h-4 text-[#808080] shrink-0" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Email Address"
                    className="flex-1 bg-transparent py-4 px-4 text-sm text-white placeholder:text-[#606060] outline-none font-light"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 focus-within:border-[#808080] transition-colors">
                  <Lock className="w-4 h-4 text-[#808080] shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Password (Min. 6 characters)"
                    className="flex-1 bg-transparent py-4 px-4 text-sm text-white placeholder:text-[#606060] outline-none font-light"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#808080] hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white hover:bg-[#B0B0B0] text-black font-bold font-mono text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Daftar Sekarang <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="relative flex py-6 items-center justify-center">
            <div className="flex-grow border-t border-[#2A2A2A]"></div>
            <span className="flex-shrink mx-4 text-[9px] font-mono text-[#808080] tracking-[0.25em] uppercase">
              ATAU
            </span>
            <div className="flex-grow border-t border-[#2A2A2A]"></div>
          </div>

          {/* Google Button */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="w-full bg-transparent hover:bg-white/5 border border-[#2A2A2A] text-white font-bold font-mono text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-200 flex items-center justify-center cursor-pointer"
          >
            <GoogleIcon />
            Daftar Dengan Google
          </button>

          {/* Footer Navigation */}
          <div className="mt-8 text-center border-t border-[#2A2A2A] pt-6">
            <p className="text-xs text-[#808080] font-mono tracking-wider uppercase">
              Sudah memiliki akun?{' '}
              <button 
                type="button"
                onClick={() => onNavigate('login')}
                className="text-white font-bold hover:text-[#B0B0B0] underline transition-colors cursor-pointer"
              >
                Masuk Sekarang
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
