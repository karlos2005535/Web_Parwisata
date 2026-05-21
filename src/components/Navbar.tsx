import React from 'react';
import { useBaliNera } from '../context/BaliNeraContext';
import { LogOut, ShieldAlert, User as UserIcon, HelpCircle, MessageSquare } from 'lucide-react';

interface NavbarProps {
  onScrollToSection?: (section: string) => void;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export default function Navbar({ onScrollToSection, activeTab, setActiveTab }: NavbarProps) {
  const { currentUser, logout, siteInfo } = useBaliNera();

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
                className="w-8 h-8 sm:w-10 sm:h-10 object-cover rounded-full border border-bali-gold" 
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="text-2xl sm:text-3xl filter drop-shadow">
                {siteInfo.logo.includes('🌴') || siteInfo.logo.includes('🌊') || siteInfo.logo.includes('🌋') 
                  ? siteInfo.logo.split(' ')[0] 
                  : '🌴'}
              </span>
            )}
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl sm:text-2xl tracking-tight text-bali-green drop-shadow-sm">
                {siteInfo.name}
              </span>
              <span className="text-[9px] font-mono tracking-[0.2em] text-bali-accent uppercase font-bold">
                Exploring Sanctuary
              </span>
            </div>
          </div>

          {/* Quick Navigation - Only show if user is not Admin, since Admin has dashboard tabs */}
          {currentUser && currentUser.role !== 'admin' && onScrollToSection && (
            <nav className="hidden md:flex items-center space-x-8">
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
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-bali-green/5 px-3.5 py-1.5 rounded-full border border-bali-green/15">
                <div className={`p-1.5 rounded-full ${currentUser.role === 'admin' ? 'bg-bali-gold/25 text-bali-green' : 'bg-bali-accent/20 text-bali-accent'}`}>
                  {currentUser.role === 'admin' ? <ShieldAlert className="w-4 h-4" /> : <UserIcon className="w-4 h-4" />}
                </div>
                
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-bali-green leading-tight truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[8px] font-mono font-bold text-bali-green/60 uppercase tracking-widest">
                    {currentUser.role === 'admin' ? 'Admin BaliNera' : 'Wisatawan'}
                  </span>
                </div>

                <button
                  onClick={logout}
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
