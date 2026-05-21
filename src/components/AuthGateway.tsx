import React, { useState } from 'react';
import { useBaliNera } from '../context/BaliNeraContext';
import { LogIn, UserPlus, Eye, EyeOff, AlertCircle, Compass } from 'lucide-react';

export default function AuthGateway() {
  const { login, register, siteInfo } = useBaliNera();
  const [isLoginView, setIsLoginView] = useState(true);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (isLoginView) {
      if (!email || !password) {
        setErrorMsg('Silakan lengkapi seluruh kolom surel dan kata sandi Anda.');
        return;
      }
      const res = login(email, password);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    } else {
      if (!name || !email || !password) {
        setErrorMsg('Harap lengkapi Nama Lengkap, Email, dan Kata Sandi baru Anda.');
        return;
      }
      if (password.length < 5) {
        setErrorMsg('Kata sandi keamanan minimal memerlukan 5 karakter.');
        return;
      }
      const res = register(name, email, password);
      if (res.success) {
        setSuccessMsg(res.message);
      } else {
        setErrorMsg(res.message);
      }
    }
  };

  const handleQuickAdminLogin = () => {
    setEmail('thomaskarlosbaco@gmail.com');
    setPassword('291205');
    setIsLoginView(true);
    setErrorMsg('');
    setSuccessMsg('');
  };

  return (
    <div className="min-h-screen bg-bali-sand flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden bg-mandala">
      
      {/* Soft Elegant Blur Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-bali-gold/10 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-bali-accent/5 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-bali-green/5 p-6 sm:p-10 z-10 space-y-8">
        
        {/* Soft centered Branding Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-bali-green/5 border border-bali-green/10 text-bali-green text-3xl font-bold">
            🌴
          </div>
          <div className="space-y-1">
            <h1 className="font-serif text-3xl font-extrabold text-bali-green tracking-tight">
              {siteInfo.name}
            </h1>
            <p className="font-serif italic text-xs text-bali-accent font-medium">
              Exploring the Sanctuary of Gods
            </p>
          </div>
          <p className="text-[11px] text-gray-500 max-w-xs mx-auto leading-relaxed">
            {isLoginView 
              ? 'Selamat datang kembali! Silakan masuk untuk merencanakan perjalanan religi Anda di Bali.' 
              : 'Daftarkan akun di BaliNera untuk kemudahan reservasi tiket, pelaporan khalayak, dan layanan live chat.'}
          </p>
        </div>

        {/* Segmented Controller (Tabs) */}
        <div className="flex border-b border-gray-100 pb-1">
          <button
            type="button"
            onClick={() => { setIsLoginView(true); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-2.5 text-center text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${isLoginView ? 'text-bali-green border-b-2 border-bali-green' : 'text-gray-400 hover:text-bali-green/75'}`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginView(false); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 pb-2.5 text-center text-xs font-bold uppercase tracking-wider transition-all cursor-pointer relative ${!isLoginView ? 'text-bali-green border-b-2 border-bali-green' : 'text-gray-400 hover:text-bali-green/75'}`}
          >
            Registrasi Baru
          </button>
        </div>

        {/* Status notifications */}
        {errorMsg && (
          <div className="bg-rose-50 text-rose-700 text-xs py-3 px-4 rounded-xl border border-rose-100 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="font-semibold leading-normal">{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="bg-emerald-50 text-emerald-800 text-xs py-3 px-4 rounded-xl border border-emerald-100 flex items-start space-x-2.5">
            <Compass className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-spin-slow" />
            <span className="font-semibold leading-normal">{successMsg}</span>
          </div>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div className="space-y-1 text-left">
              <label className="text-[10px] font-bold text-bali-green/70 uppercase tracking-widest block">
                Nama Lengkap Anda
              </label>
              <input
                type="text"
                placeholder="Contoh: Kadek Satria"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-bali-green focus:outline-none focus:bg-white focus:border-bali-green transition placeholder:text-gray-400"
                required
              />
            </div>
          )}

          <div className="space-y-1 text-left">
            <label className="text-[10px] font-bold text-bali-green/70 uppercase tracking-widest block">
              Alamat Surel (Email)
            </label>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-bali-green focus:outline-none focus:bg-white focus:border-bali-green transition placeholder:text-gray-400"
              required
            />
          </div>

          <div className="space-y-1 text-left">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold text-bali-green/70 uppercase tracking-widest block">
                Kata Sandi (Password)
              </label>
              {!isLoginView && (
                <span className="text-[9px] text-gray-400 font-medium">min. 5 karakter</span>
              )}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-sm text-bali-green focus:outline-none focus:bg-white focus:border-bali-green transition placeholder:text-gray-400 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bali-green cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-bali-green hover:bg-bali-green/90 text-bali-sand text-xs font-bold uppercase tracking-[0.15em] rounded-xl shadow-md transition-all active:scale-[0.985] flex items-center justify-center gap-2 cursor-pointer mt-5"
          >
            {isLoginView ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            <span>{isLoginView ? 'Masuk Sekarang' : 'Daftar Sebagai Wisatawan'}</span>
          </button>
        </form>

        {/* Demo Quick Admin section */}
        {isLoginView && (
          <div className="pt-4 border-t border-gray-50 text-center">
            <button
              type="button"
              onClick={handleQuickAdminLogin}
              className="text-[11px] font-bold text-bali-accent hover:text-bali-accent/80 hover:underline transition duration-200 cursor-pointer inline-flex items-center gap-1"
            >
              🔐 Gunakan Akun Demo Admin Thomas (thomaskarlosbaco@gmail.com)
            </button>
          </div>
        )}

      </div>

      {/* Humble Elegant Footer Signature */}
      <div className="mt-8 text-center text-[10px] text-bali-green/40 font-mono tracking-wider z-10">
        <div>Sistem Akses Autentikasi BaliNera</div>
        <div className="mt-1">Thomas Baco © 2026</div>
      </div>
    </div>
  );
}
