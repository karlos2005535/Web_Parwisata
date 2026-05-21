import React from 'react';
import { useBaliNera } from '../context/BaliNeraContext';
import * as Icons from 'lucide-react';

export default function Footer() {
  const { siteInfo, socialAccounts } = useBaliNera();

  // Helper to render Lucide icons dynamically from text references
  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'whatsapp':
        return <Icons.PhoneCall className="w-5 h-5 text-emerald-500" />;
      case 'instagram':
        return <Icons.Instagram className="w-5 h-5 text-pink-500" />;
      case 'tiktok':
        return <Icons.Video className="w-5 h-5 text-slate-800" />;
      case 'facebook':
        return <Icons.Facebook className="w-5 h-5 text-blue-600" />;
      default:
        return <Icons.Share2 className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <footer className="bg-bali-green text-bali-sand/90 border-t border-bali-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          
          {/* Logo & Slogan Column */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              {siteInfo.logo && (siteInfo.logo.startsWith('http') || siteInfo.logo.startsWith('data:')) ? (
                <img 
                  src={siteInfo.logo} 
                  alt="Logo" 
                  className="w-8 h-8 object-cover rounded-full border border-bali-gold" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-3xl">{siteInfo.logo.includes('🌴') || siteInfo.logo.includes('🌊') ? siteInfo.logo.split(' ')[0] : '🌴'}</span>
              )}
              <span className="font-serif font-bold text-2xl tracking-tight text-bali-sand">
                {siteInfo.name}
              </span>
            </div>
            <p className="text-sm text-bali-sand/85 max-w-sm font-sans leading-relaxed">
              {siteInfo.slogan || 'Sistem reservasi dan penjelajahan wisata Bali digital terlengkap.'}
            </p>
            <div className="text-xs text-bali-gold font-mono tracking-widest uppercase font-bold">
              © 2026 BaliNera • Surga Dewata
            </div>
          </div>

          {/* Quick Info & Support Column */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-bali-gold">Hubungi Layanan Reservasi</h3>
            <p className="text-sm text-bali-sand/80 leading-relaxed font-sans">
              Butuh konsultasi itinerary di Bali atau ingin menanyakan status pembayaran tiket Anda? Admin BaliNera siap melayani Anda melalui platform obrolan langsung dan media sosial terintegrasi.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-bali-sand bg-bali-sand/5 p-3 rounded-lg border border-bali-sand/15">
              <span className="text-bali-accent font-bold">Admin:</span>
              <a href="mailto:thomaskarlosbaco@gmail.com" className="hover:text-bali-gold underline transition">
                thomaskarlosbaco@gmail.com
              </a>
            </div>
          </div>

          {/* Connected Social Accounts Column */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold text-bali-gold">Media Sosial Kami</h3>
            <p className="text-xs text-bali-sand/80 mb-3 font-sans">
              Ubah rute liburan Anda dan hubungi media sosial yang dikonfigurasi mandiri oleh administrator di bawah ini:
            </p>
            <div className="flex flex-wrap gap-3">
              {socialAccounts.map((account) => (
                <a
                  key={account.platform}
                  href={account.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-bali-sand hover:bg-bali-gold hover:text-bali-green text-bali-green transition py-2 px-3.5 rounded-xl border border-bali-green/10 font-sans text-xs font-semibold shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                  title={`Hubungi kami di ${account.platform}`}
                >
                  {getSocialIcon(account.platform)}
                  <span>{account.platform}</span>
                </a>
              ))}
            </div>
            <p className="text-[10px] text-bali-gold/60 leading-tight">
              *Tautan media sosial di atas terhubung langsung dengan administrator yang sedang aktif bertugas.
            </p>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-bali-sand/10 flex flex-col sm:flex-row items-center justify-between text-xs text-bali-sand/55 font-mono">
          <div>Layanan Pariwisata Premium Terakreditasi</div>
          <div className="mt-2 sm:mt-0">Dikelola oleh Thomas Karlos Baco • 291205</div>
        </div>
      </div>
    </footer>
  );
}
