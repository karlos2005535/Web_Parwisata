import React from 'react';
import { useBaliNera } from '../context/BaliNeraContext';
import { LogOut, ShieldAlert, User as UserIcon, HelpCircle, Eye } from 'lucide-react';

interface NavbarProps {
  onScrollToSection?: (section: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  adminViewState?: 'admin' | 'user';
  setAdminViewState?: (val: 'admin' | 'user') => void;
}

export default function Navbar({ onScrollToSection, activeTab, setActiveTab, adminViewState, setAdminViewState }: NavbarProps) {
  const { currentUser, logout, siteInfo } = useBaliNera();

  // Dialog box confirmation on logout
  const handleLogoutClick = () => {
    const confirmation = window.confirm("Apakah Anda yakin ingin keluar dari akun BaliNera?");
    if (confirmation) {
      logout();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-bali-sand/90 border-b border-bali-green/15 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onScrollToSection?.('home')}>
            {siteInfo.logo && (siteInfo.logo.startsWith('http') || siteInfo.logo.startsWith('data:')) ? (
              <img 
                src={siteInfo.logo} 
                alt="Logo" 
                className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-full border-2 border-bali-gold p-0.5 shadow-sm shrink-0 aspect-square" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-2xl sm:text-3xl filter drop-shadow shrink-0">
                {siteInfo.logo && (siteInfo.logo.includes('🌴') || siteInfo.logo.includes('🌊') || siteInfo.logo.includes('🌋') || siteInfo.logo.includes('🌅') || siteInfo.logo.includes('🏖️') || siteInfo.logo.includes('🪁'))
                  ? siteInfo.logo.split(' ')[0] 
                  : '🌴'}
              </span>
            )}
            <div className="flex flex-col text-left">
              <span className="font-serif font-bold text-lg sm:text-2xl tracking-tight text-bali-green drop-shadow-sm leading-tight">
                {siteInfo.name}
              </span>
              <span className="text-[8px] sm:text-[9px] font-mono tracking-[0.18em] text-bali-accent uppercase font-bold leading-none mt-0.5">
                Exploring Sanctuary
              </span>
            </div>
          </div>

          {/* Quick Navigation - Only show if not admin, or if admin is currently in "user view" mode */}
          {currentUser && (currentUser.role !== 'admin' || adminViewState === 'user') && onScrollToSection && (
            <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
              <button 
                onClick={() => onScrollToSection('home')}
                className="text-bali-green/80 hover:text-bali-accent font-medium tracking-wide transition cursor-pointer text-sm"
              >
                Beranda
              </button>
              <button 
                onClick={() => onScrollToSection('wisata')}
                className="text-bali-green/80 hover:text-bali-accent font-medium tracking-wide transition cursor-pointer text-sm"
              >
                Destinasi Wisata
              </button>
              <button 
                onClick={() => onScrollToSection('transaksi')}
                className="text-bali-green/80 hover:text-bali-accent font-medium tracking-wide transition cursor-pointer text-sm"
              >
                Pemesanan Anda
              </button>
              <button 
                onClick={() => onScrollToSection('keluhan')}
                className="text-bali-green/80 hover:text-bali-accent font-medium tracking-wide transition cursor-pointer text-sm flex items-center gap-1.5"
              >
                <HelpCircle className="w-4 h-4 text-bali-accent" />
                Layanan Keluhan
              </button>
            </nav>
          )}

          {/* User Session Area */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* Admin View Switcher Toggle if currentUser is Admin */}
            {currentUser && currentUser.role === 'admin' && (
              <div className="flex items-center space-x-1.5">
                {adminViewState === 'user' ? (
                  <div className="flex items-center space-x-1 sm:space-x-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1">
                    <span className="text-[9px] font-black text-amber-800 uppercase tracking-widest animate-pulse font-mono block">
                      Preview Wisatawan
                    </span>
                    <button
                      onClick={() => setAdminViewState?.('admin')}
                      className="px-2 py-0.5 bg-bali-accent hover:bg-bali-accent/90 text-bali-sand text-[9px] font-bold rounded-full uppercase tracking-wider transition active:scale-95"
                      title="Kembali ke Konsol Admin"
                    >
                      Kembali ke Panel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setAdminViewState?.('user')}
                    className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 bg-bali-green/5 hover:bg-bali-green/10 text-bali-green hover:text-bali-accent text-[9px] font-extrabold rounded-full uppercase tracking-wider transition duration-200 border border-bali-green/15"
                    title="Pratinjau tampilan situs sebagai wisatawan"
                  >
                    <Eye className="w-3 h-3 text-bali-accent" />
                    <span>Lihat Web Wisata</span>
                  </button>
                )}
              </div>
            )}

            {currentUser ? (
              <div className="flex items-center space-x-2 bg-bali-green/5 px-3.5 py-1.5 rounded-full border border-bali-green/15">
                <div className={`p-1.5 rounded-full ${currentUser.role === 'admin' ? 'bg-bali-gold/25 text-bali-green' : 'bg-bali-accent/20 text-bali-accent'}`}>
                  {currentUser.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                </div>
                
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-bali-green leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-bali-green/60 uppercase tracking-widest leading-none mt-0.5">
                    {currentUser.role === 'admin' ? 'Admin BaliNera' : 'Wisatawan'}
                  </span>
                </div>

                <button
                  onClick={handleLogoutClick}
                  className="p-1 text-bali-green/50 hover:text-bali-accent hover:bg-bali-accent/10 rounded-full transition cursor-pointer ml-1"
                  title="Logout dari BaliNera"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-xs font-bold tracking-widest text-bali-accent bg-bali-accent/5 border border-bali-accent/20 px-4 py-1.5 rounded-full uppercase">
                Sesi Terkunci
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
