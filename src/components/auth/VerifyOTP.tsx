import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

interface VerifyOTPProps {
  onNavigate: (view: 'login') => void;
}

export default function VerifyOTP({ onNavigate }: VerifyOTPProps) {
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) throw new Error('Gagal mengirim OTP');
      
      setMessage('Kode OTP 6-digit telah dikirim ke email Anda.');
      setStep('verify');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Gagal mereset password');

      setMessage('Password berhasil diubah!');
      setTimeout(() => {
        onNavigate('login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
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
            onClick={() => onNavigate('login')}
            className="text-sm font-semibold font-display tracking-[0.25em] text-white uppercase hover:text-[#B0B0B0] transition-colors cursor-pointer"
          >
            Di
          </button>
        </div>

        {/* Visual Copy */}
        <div className="relative z-10 max-w-lg text-left my-auto">
          <h1 className="text-4xl lg:text-6xl font-light tracking-tight leading-[1.05] mb-8 text-white uppercase">
            Keamanan <br />
            Akun <br />
            <span className="font-semibold text-[#B0B0B0]">Terjamin.</span>
          </h1>
          <p className="text-sm text-[#A3A3A3] leading-relaxed max-w-md font-light">
            Pulihkan akses ke akun Di Anda dengan aman menggunakan verifikasi OTP instan. Harap simpan informasi sandi baru Anda secara pribadi.
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
              onClick={() => onNavigate('login')}
              className="text-xs font-semibold font-display tracking-[0.25em] text-white uppercase hover:text-[#B0B0B0] transition-colors cursor-pointer"
            >
              Di
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-10">
            <h2 className="text-3xl font-light text-white tracking-tight mb-2 uppercase font-display">
              Pemulihan Akun
            </h2>
            <p className="text-xs text-[#A3A3A3] font-light">
              {step === 'request' 
                ? 'Masukkan email Anda untuk menerima kode verifikasi.' 
                : 'Masukkan OTP yang dikirim dan sandi baru Anda.'}
            </p>
          </div>

          {error && (
            <div className="bg-[#1C1C1C] border border-[#606060] text-[#B0B0B0] text-xs p-3.5 rounded-xl mb-6 text-center">
              {error}
            </div>
          )}
          
          {message && (
            <div className="bg-[#141414] border border-[#2A2A2A] text-white text-xs p-3.5 rounded-xl mb-6 text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A3A3A3]" /> {message}
            </div>
          )}

          {step === 'request' ? (
            <form onSubmit={handleRequestOTP} className="space-y-5">
              {/* Email Input */}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-white hover:bg-[#B0B0B0] text-black font-bold font-mono text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Kirim Kode OTP <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-5">
              {/* OTP Input */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').slice(0, 6))}
                  required
                  placeholder="KODE OTP (6-DIGIT)"
                  className="w-full bg-[#141414] border border-[#2A2A2A] rounded-xl py-4 px-4 text-center text-xl tracking-[0.5em] text-white placeholder:text-[#606060] focus:outline-none focus:border-[#808080] outline-none font-light"
                />
              </div>
              
              {/* New Password Input */}
              <div className="space-y-2">
                <div className="flex items-center bg-[#141414] border border-[#2A2A2A] rounded-xl px-4 focus-within:border-[#808080] transition-colors">
                  <Lock className="w-4 h-4 text-[#808080] shrink-0" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    placeholder="Password Baru (Min. 6 karakter)"
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
                disabled={loading || otp.length !== 6 || !newPassword}
                className="w-full bg-white hover:bg-[#B0B0B0] text-black font-bold font-mono text-xs uppercase tracking-wider py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-6 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <>
                    Ganti Password <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer Navigation */}
          <div className="mt-8 text-center border-t border-[#2A2A2A] pt-6">
            <p className="text-xs text-[#808080] font-mono tracking-wider uppercase">
              Ingat password Anda?{' '}
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
