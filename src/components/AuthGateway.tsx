import React, { useState } from 'react';
import { useBaliNera } from '../context/BaliNeraContext';
import { ShieldAlert, LogIn, UserPlus, Eye, EyeOff, AlertCircle, Compass, Sun, MapPin } from 'lucide-react';

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
  };

  return (
    <div className="min-h-screen bg-bali-sand flex flex-col justify-center items-center p-4 md:p-8 relative overflow-hidden bg-mandala">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full bg-bali-gold/10 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-16 -right-16 w-96 h-96 rounded-full bg-bali-accent/10 blur-3xl pointer-events-none"></div>

      {/* Main Split Portal Container */}
      <div className="w-full max-w-5xl bg-bali-sand rounded-2xl shadow-2xl overflow-hidden border border-bali-green/10 flex flex-col md:flex-row min-h-[620px] z-10">
        
        {/* Left Hand: Artistic Sanctuary Cover */}
        <div className="md:w-5/12 bg-bali-green relative p-8 sm:p-12 text-bali-sand flex flex-col justify-between overflow-hidden">
          {/* Subtle light overlay */}
          <div className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-40 transition-transform duration-1000 hover:scale-105" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80')" }}></div>
          <div className="absolute inset-0 bg-gradient-to-b from-bali-green/30 via-transparent to-bali-green/90 pointer-events-none"></div>
          
          {/* Top Info */}
          <div className="relative z-10">
            <div className="text-[10px] tracking-[0.25em] font-mono text-bali-gold uppercase font-bold">
              V.1.0 PORTAL SANCTUARY
            </div>
          </div>

          {/* Core Brand Display */}
          <div className="relative z-10 my-10 md:my-0 space-y-4">
            <h1 className="font-serif text-6xl sm:text-7xl font-bold tracking-tight text-bali-gold leading-none">
              Bali<br />Nera
            </h1>
            <p className="font-serif italic text-base sm:text-lg text-bali-sand/90 font-light tracking-wide border-l-2 border-bali-accent pl-4">
              Exploring the Unseen Sanctuary
            </p>
            <p className="text-xs text-bali-sand/70 font-sans leading-relaxed pt-2">
              Website pariwisata digital terlengkap untuk menjadwalkan kunjungan religi, mengamankan tiket Tari Kecak Uluwatu, dan berinteraksi langsung dengan administrator lokal.
            </p>
          </div>

          {/* System Footer Metadata */}
          <div className="relative z-10 pt-6 border-t border-bali-sand/20 text-[10px] text-bali-sand/60 font-mono tracking-wider space-y-1">
            <p className="text-bali-gold uppercase font-semibold">ENCRYPTED ACCESS GATEWAY</p>
            <p>EST. 2026 • SYSTEM ADMIN DIRECT PORTAL</p>
          </div>
        </div>

        {/* Right Hand: Elegant Plaster Form Area */}
        <div className="md:w-7/12 p-8 sm:p-14 flex flex-col justify-between relative bg-bali-sand">
          
          {/* Decorative geometric token in bottom corner */}
          <div className="absolute bottom-6 right-6 w-28 h-28 opacity-10 text-bali-accent pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor" />
              <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" stroke-width="2" />
            </svg>
          </div>

          <div className="w-full">
            {/* Elegant Header & Tabs */}
            <div className="flex gap-8 mb-8 border-b border-gray-200">
              <button
                type="button"
                onClick={() => { setIsLoginView(true); setErrorMsg(''); setSuccessMsg(''); }}
                className={`pb-3 text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer relative ${isLoginView ? 'text-bali-accent border-b-2 border-bali-accent font-extrabold' : 'text-bali-green/55 hover:text-bali-green'}`}
              >
                Gerbang Masuk
              </button>
              <button
                type="button"
                onClick={() => { setIsLoginView(false); setErrorMsg(''); setSuccessMsg(''); }}
                className={`pb-3 text-xs font-bold uppercase tracking-[0.15em] transition-all cursor-pointer relative ${!isLoginView ? 'text-bali-accent border-b-2 border-bali-accent font-extrabold' : 'text-bali-green/55 hover:text-bali-green'}`}
              >
                Registrasi User
              </button>
            </div>

            <div className="space-y-1.5 mb-8">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bali-green tracking-tight">
                {isLoginView ? 'Memasuki Sanctuary' : 'Langkah Awal Penjelajahan'}
              </h2>
              <p className="text-xs text-bali-green/60">
                {isLoginView ? 'Masukkan kredensial keamanan Anda untuk mengakses portal pariwisata BaliNera.' : 'Buat akun Anda secara instan untuk reservasi tiket, pelaporan keluhan, dan live chat.'}
              </p>
            </div>

            {/* Error and Success notifications */}
            {errorMsg && (
              <div className="bg-bali-accent/5 text-bali-accent text-xs py-3 px-4 rounded-lg border border-bali-accent/20 flex items-start space-x-2.5 mb-6">
                <AlertCircle className="w-4 h-4 text-bali-accent shrink-0 mt-0.5" />
                <span className="font-medium">{errorMsg}</span>
              </div>
            )}
            {successMsg && (
              <div className="bg-bali-green/5 text-bali-green text-xs py-3 px-4 rounded-lg border border-bali-green/20 flex items-start space-x-2.5 mb-6">
                <Compass className="w-4 h-4 text-bali-green shrink-0 mt-0.5 animate-spin-slow" />
                <span className="font-medium">{successMsg}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLoginView && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-bali-green/60 uppercase tracking-widest block">
                    Nama Lengkap Anda
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: I Putu Mahendra"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-gray-300 focus:border-bali-green focus:outline-none text-sm text-bali-green transition-colors placeholder:text-gray-400 font-sans"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-bali-green/60 uppercase tracking-widest block">
                  Alamat Surat Elektronik (Email)
                </label>
                <input
                  type="email"
                  placeholder="thomas@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full py-3 bg-transparent border-b border-gray-300 focus:border-bali-green focus:outline-none text-sm text-bali-green transition-colors placeholder:text-gray-400 font-sans"
                  required
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-bold text-bali-green/60 uppercase tracking-widest block">
                    Kata Sandi (Password)
                  </label>
                  {isLoginView && (
                    <span className="text-[9px] text-gray-400 font-mono text-right">minimal 5 karakter</span>
                  )}
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 bg-transparent border-b border-gray-300 focus:border-bali-green focus:outline-none text-sm text-bali-green transition-colors placeholder:text-gray-400 font-sans"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-bali-green/45 hover:text-bali-green cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-bali-green hover:bg-bali-green/90 text-bali-sand text-xs font-bold uppercase tracking-[0.2em] shadow-lg hover:shadow-bali-green/10 transition-all cursor-pointer transform active:scale-[0.99] flex items-center justify-center gap-2 mt-4"
              >
                {isLoginView ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{isLoginView ? 'Masuk ke Portal BaliNera' : 'Daftarkan & Jelajah'}</span>
              </button>
            </form>
          </div>

          {/* Bottom Capabilities list & Quick Login */}
          <div className="mt-8 z-10">
            {isLoginView && (
              <div className="mb-6 p-3 rounded-lg border border-bali-gold/30 bg-bali-gold/5 flex gap-3 text-left items-start max-w-lg">
                <div className="p-1.5 bg-bali-gold/15 rounded-md text-bali-gold shrink-0 mt-0.5">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <p className="font-bold text-bali-green">Uji Coba Admin Thomas</p>
                  <p className="text-bali-green/75 mt-0.5">Masuk instan menggunakan kredensial admin default.</p>
                  <button
                    type="button"
                    onClick={handleQuickAdminLogin}
                    className="mt-1.5 text-[11px] font-bold text-bali-accent hover:text-bali-accent/80 hover:underline flex items-center gap-1 cursor-pointer transition"
                  >
                    <span>Klik Untuk Input Kredensial Otomatis</span>
                    <span>→</span>
                  </button>
                </div>
              </div>
            )}

            {/* Artistic Flair Capabilities Grid */}
            <div className="capabilities-grid grid grid-cols-2 gap-y-3 gap-x-6 text-[10px] uppercase tracking-widest text-bali-green/40 font-bold font-sans border-t border-gray-200/80 pt-6">
              <div className="cap-item flex items-center gap-2">
                <span className="cap-dot w-1.5 h-1.5 rounded-full bg-bali-accent"></span>
                Tourism Management
              </div>
              <div className="cap-item flex items-center gap-2">
                <span className="cap-dot w-1.5 h-1.5 rounded-full bg-bali-accent"></span>
                User Analytics
              </div>
              <div className="cap-item flex items-center gap-2">
                <span className="cap-dot w-1.5 h-1.5 rounded-full bg-bali-accent"></span>
                Multi-Pay Matrix
              </div>
              <div className="cap-item flex items-center gap-2">
                <span className="cap-dot w-1.5 h-1.5 rounded-full bg-bali-accent"></span>
                Live Concierge
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Trust Signatures */}
      <div className="mt-8 text-center text-xs text-bali-green/50 font-mono tracking-wider z-10 flex flex-col sm:flex-row items-center gap-2">
        <span>Sistem Autentikasi Terenkripsi BaliNera</span>
        <span className="hidden sm:inline">•</span>
        <span>Thomas Karlos Baco (thomaskarlosbaco@gmail.com)</span>
      </div>
    </div>
  );
}
