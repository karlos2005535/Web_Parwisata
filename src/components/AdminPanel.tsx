import React, { useState } from 'react';
import { useBaliNera } from '../context/BaliNeraContext';
import { Destination, SocialAccount, PaymentSetting } from '../types';
import { 
  Plus, Edit3, Trash2, CheckCircle2, ShieldCheck, Mail, Calendar, 
  MapPin, DollarSign, Image as ImageIcon, MessageSquare, AlertOctagon, 
  Settings2, Banknote, QrCode, Phone, Users, Globe, ChevronRight, Send
} from 'lucide-react';

const PRESET_BALI_IMAGES = [
  {
    name: 'Pura Tanah Lot (Sunset)',
    url: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Ubud Sacred Monkey Forest',
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Teater Kecak Uluwatu',
    url: 'https://images.unsplash.com/photo-1518548419070-2c511696d69e?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Tegalalang Sawah Terasering',
    url: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Pura Ulun Danu Beratan Bedugul',
    url: 'https://images.unsplash.com/photo-1539367628448-4bc5c9d171c8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Kelingking Beach Nusa Penida',
    url: 'https://images.unsplash.com/photo-1501179691627-eebe1c7b04d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Kecantikan Pantai Seminyak',
    url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Pura Lempuyang Penataran Agung',
    url: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Keindahan Air Terjun Sekumpul',
    url: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Pantai Sanur Sunrise',
    url: 'https://images.unsplash.com/photo-1558005530-a7958876ef11?auto=format&fit=crop&w=800&q=80'
  }
];

const PRESET_BALI_LOGOS = [
  { name: '🌴 Palm Kuning BaliNera', url: '🌴 BaliNera' },
  { name: '🌊 Ombak Biru Samudra', url: '🌊 BaliNera' },
  { name: '🌋 Gunung Dewata Vulkanik', url: '🌋 BaliNera' },
  { name: '🌅 Matahari Senja Kuta', url: '🌅 BaliNera' },
  { name: '🏖️ Pantai Bersantai Hijau', url: '🏖️ BaliNera' },
  { name: '🪁 Layangan Tradisional', url: '🪁 BaliNera' },
  { 
    name: 'Branding Padma (Merah Klasik)', 
    url: 'https://images.unsplash.com/photo-1627163430580-bfae94e5a953?w=150&h=150&fit=crop&q=80' 
  },
  { 
    name: 'Tropical Palms (Logo Minimalist)', 
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=150&h=150&fit=crop&q=80' 
  },
  { 
    name: 'Pura Siluet (Monokrom)', 
    url: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=150&h=150&fit=crop&q=80' 
  }
];

export default function AdminPanel() {
  const {
    users,
    destinations,
    complaints,
    socialAccounts,
    paymentSetting,
    chats,
    siteInfo,
    bookings,
    addDestination,
    updateDestination,
    deleteDestination,
    updateSiteInfo,
    toggleUserBlock,
    deleteUser,
    updatePaymentSetting,
    updateSocialAccounts,
    resolveComplaint,
    sendChatMessage
  } = useBaliNera();

  // Active Admin Tabs
  const [activeTab, setActiveTab] = useState<'spots' | 'identity' | 'users' | 'payments' | 'socials' | 'complaints' | 'chats'>('spots');

  // Custom persistent local storage gallery states
  const [customGallery, setCustomGallery] = useState<string[]>(() => {
    const stored = localStorage.getItem('balinera_custom_gallery');
    return stored ? JSON.parse(stored) : [];
  });
  const [showSpotGallery, setShowSpotGallery] = useState(false);
  const [showLogoGallery, setShowLogoGallery] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'spot' | 'logo') => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 1.5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Silakan pilih gambar yang berukuran di bawah 1.5MB agar penyimpanan bekerja lancar.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Value = reader.result as string;
      if (target === 'spot') {
        setSpotImage(base64Value);
      } else {
        setSiteLogo(base64Value);
      }
      
      setCustomGallery(prev => {
        if (!prev.includes(base64Value)) {
          const updated = [base64Value, ...prev];
          localStorage.setItem('balinera_custom_gallery', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });
      alert('Gambar berhasil diunggah lokal dan ditambahkan ke galeri pribadi admin!');
    };
    reader.readAsDataURL(file);
  };

  // Spot Form States
  const [isEditingSpot, setIsEditingSpot] = useState(false);
  const [editingSpotId, setEditingSpotId] = useState('');
  const [spotName, setSpotName] = useState('');
  const [spotImage, setSpotImage] = useState('');
  const [spotDescription, setSpotDescription] = useState('');
  const [spotPrice, setSpotPrice] = useState(0);
  const [spotLocation, setSpotLocation] = useState('');
  const [spotCategory, setSpotCategory] = useState('');
  const [spotFacilities, setSpotFacilities] = useState<string>('');

  // Website Settings Form States
  const [siteName, setSiteName] = useState(siteInfo.name);
  const [siteLogo, setSiteLogo] = useState(siteInfo.logo);
  const [siteSlogan, setSiteSlogan] = useState(siteInfo.slogan);

  // Payments Form States
  const [pBankName, setPBankName] = useState(paymentSetting.bankName);
  const [pAccountNumber, setPAccountNumber] = useState(paymentSetting.accountNumber);
  const [pAccountHolder, setPAccountHolder] = useState(paymentSetting.accountHolder);
  const [pQrisUrl, setPQrisUrl] = useState(paymentSetting.qrisImageUrl);
  const [pCashInstructions, setPCashInstructions] = useState(paymentSetting.cashInstructions);

  // Social Account Form States
  const [whatsappUrl, setWhatsappUrl] = useState(socialAccounts.find(s => s.platform === 'WhatsApp')?.url || '');
  const [instagramUrl, setInstagramUrl] = useState(socialAccounts.find(s => s.platform === 'Instagram')?.url || '');
  const [tiktokUrl, setTiktokUrl] = useState(socialAccounts.find(s => s.platform === 'TikTok')?.url || '');
  const [facebookUrl, setFacebookUrl] = useState(socialAccounts.find(s => s.platform === 'Facebook')?.url || '');

  // Live Chat States
  const [selectedUserChatId, setSelectedUserChatId] = useState<string>('');
  const [adminReplyText, setAdminReplyText] = useState('');

  // Complaint reply message state
  const [activeComplaintReplyId, setActiveComplaintReplyId] = useState('');
  const [complaintReplyText, setComplaintReplyText] = useState('');

  // Handle Spot submission
  const handleSpotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const facilitiesList = spotFacilities.split(',').map(f => f.trim()).filter(f => f.length > 0);

    const data = {
      name: spotName,
      image: spotImage || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&q=80',
      description: spotDescription,
      price: Number(spotPrice),
      rating: 4.8,
      location: spotLocation,
      category: spotCategory || 'Umum',
      facilities: facilitiesList.length > 0 ? facilitiesList : ['Pemandu Tradisional', 'Area Istirahat']
    };

    if (isEditingSpot) {
      updateDestination(editingSpotId, data);
      alert('Informasi Tempat Wisata Berhasil Diperbarui!');
    } else {
      addDestination(data);
      alert('Wisata Baru Berhasil Ditambahkan ke BaliNera!');
    }

    // Reset Spot Form
    resetSpotForm();
  };

  const resetSpotForm = () => {
    setIsEditingSpot(false);
    setEditingSpotId('');
    setSpotName('');
    setSpotImage('');
    setSpotDescription('');
    setSpotPrice(0);
    setSpotLocation('');
    setSpotCategory('');
    setSpotFacilities('');
  };

  const handleEditSpotSelect = (dest: Destination) => {
    setIsEditingSpot(true);
    setEditingSpotId(dest.id);
    setSpotName(dest.name);
    setSpotImage(dest.image);
    setSpotDescription(dest.description);
    setSpotPrice(dest.price);
    setSpotLocation(dest.location);
    setSpotCategory(dest.category);
    setSpotFacilities(dest.facilities.join(', '));
  };

  // Handle identity update
  const handleIdentitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteInfo(siteName, siteLogo, siteSlogan);
    alert('Identitas & Logo Website berhasil disinkronisasikan!');
  };

  // Handle payment settings update
  const handlePaymentsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePaymentSetting({
      bankName: pBankName,
      accountNumber: pAccountNumber,
      accountHolder: pAccountHolder,
      qrisImageUrl: pQrisUrl || 'https://picsum.photos/seed/qrisbalinera/300/300',
      cashInstructions: pCashInstructions
    });
    alert('Regulasi Pembayaran BaliNera (No Rekening, QRIS, & Tunai) Berhasil Diperbarui!');
  };

  // Handle social media updating
  const handleSocialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const list: SocialAccount[] = [
      { platform: 'WhatsApp', url: whatsappUrl || 'https://wa.me/628123456789', icon: 'Phone' },
      { platform: 'Instagram', url: instagramUrl || 'https://instagram.com/balinera_travel', icon: 'Instagram' },
      { platform: 'TikTok', url: tiktokUrl || 'https://tiktok.com/@balinera', icon: 'Video' },
      { platform: 'Facebook', url: facebookUrl || 'https://facebook.com/balinera.pariwisata', icon: 'Facebook' }
    ];
    updateSocialAccounts(list);
    alert('Tautan Kontak Media Sosial berhasil diperbarui!');
  };

  // Handle Complaint Reply
  const handleComplaintReplySubmit = (id: string) => {
    if (!complaintReplyText.trim()) {
      alert('Konfirmasi balasan tidak boleh kosong.');
      return;
    }
    resolveComplaint(id, complaintReplyText);
    alert('Balasan aduan keluhan berhasil terkirim ke email user yang bersangkutan!');
    setActiveComplaintReplyId('');
    setComplaintReplyText('');
  };

  // Handle Admin Sending Chat Message
  const handleSendAdminChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminReplyText.trim() || !selectedUserChatId) return;

    sendChatMessage(adminReplyText, selectedUserChatId);
    setAdminReplyText('');
  };

  // Extract unique users with chat messages
  const userChatThreads = Array.from(new Set(chats.map(msg => msg.userId)))
    .map(uid => {
      const u = users.find(user => user.id === uid);
      const userMsgs = chats.filter(m => m.userId === uid);
      const lastMsg = userMsgs[userMsgs.length - 1];
      return {
        id: uid,
        name: u?.name || 'Wisatawan BaliNera',
        email: u?.email || 'klien@gmail.com',
        lastMessage: lastMsg?.text || '',
        lastTimestamp: lastMsg?.timestamp || '',
        messagesCount: userMsgs.length
      };
    })
    .filter(thread => thread.id !== '');

  const activeThreadMessages = chats.filter(m => m.userId === selectedUserChatId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Admin Title Heading Info */}
      <div className="bg-bali-green rounded-xl p-6 sm:p-8 text-bali-sand shadow-xl mb-8 relative overflow-hidden border border-bali-green/10">
        <div className="absolute top-0 right-0 w-32 h-32 bg-bali-gold/10 rounded-bl-full pointer-events-none"></div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative text-left">
          <div className="space-y-1">
            <span className="text-[10px] font-mono bg-bali-gold text-bali-green px-2.5 py-1 rounded font-bold uppercase tracking-widest">
              Konsol Administrator
            </span>
            <h1 className="text-2xl sm:text-3.5xl font-serif font-bold tracking-tight mt-2 flex items-center gap-2 text-bali-sand">
              <span>Kelola Portal</span>
              <span className="text-bali-gold italic underline underline-offset-4 decoration-bali-accent decoration-wavy">
                {siteInfo.name}
              </span>
            </h1>
            <p className="text-xs text-bali-sand/80 max-w-xl">
              Selamat bertugas, Thomas! Anda memiliki akses penuh mengubah logo, menambah objek wisata, menangani keluhan, dan live chat.
            </p>
          </div>
          
          <div className="flex items-center space-x-4 bg-bali-sand/5 p-3.5 rounded-lg border border-bali-sand/10 text-xs text-bali-sand">
            <ShieldCheck className="w-9 h-9 text-bali-gold shrink-0" />
            <div>
              <p className="font-bold">thomaskarlosbaco@gmail.com</p>
              <p className="text-bali-gold opacity-80 mt-0.5 font-semibold">Password Keamanan: 291205</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Hand: Dashboard Quick-Menu Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 bg-bali-sand rounded-xl p-4 border border-bali-green/15 shadow-sm space-y-1.5 text-left">
            <p className="text-[9px] font-bold text-bali-green/50 uppercase tracking-widest px-3 mb-2.5">Fungsi & Kontrol Utama</p>
            
            <button
              onClick={() => setActiveTab('spots')}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-3 transition ${activeTab === 'spots' ? 'bg-bali-green text-bali-sand shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
            >
              <MapPin className="w-4 h-4 text-bali-accent" />
              <span>Kelola Tempat Wisata</span>
            </button>

            <button
              onClick={() => setActiveTab('identity')}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-3 transition ${activeTab === 'identity' ? 'bg-bali-green text-bali-sand shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
            >
              <Globe className="w-4 h-4 text-bali-accent" />
              <span>Sesuaikan Logo & Nama</span>
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-3 transition ${activeTab === 'users' ? 'bg-bali-green text-bali-sand shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
            >
              <Users className="w-4 h-4 text-bali-accent" />
              <span>Kelola User Akun ({users.filter(u => u.role !== 'admin').length})</span>
            </button>

            <button
              onClick={() => setActiveTab('payments')}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-3 transition ${activeTab === 'payments' ? 'bg-bali-green text-bali-sand shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
            >
              <Banknote className="w-4 h-4 text-bali-accent" />
              <span>Sistem Pembayaran</span>
            </button>

            <button
              onClick={() => setActiveTab('socials')}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-3 transition ${activeTab === 'socials' ? 'bg-bali-green text-bali-sand shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
            >
              <Phone className="w-4 h-4 text-bali-accent" />
              <span>Tautan Media Sosial</span>
            </button>

            <button
              onClick={() => setActiveTab('complaints')}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-3 transition ${activeTab === 'complaints' ? 'bg-bali-green text-bali-sand shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
            >
              <AlertOctagon className="w-4 h-4 text-bali-accent" />
              <span>Kotak Keluhan ({complaints.filter(c => c.status === 'Pending').length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('chats');
                if (userChatThreads.length > 0 && !selectedUserChatId) {
                  setSelectedUserChatId(userChatThreads[0].id);
                }
              }}
              className={`w-full text-left py-3 px-4 rounded-xl text-sm font-semibold cursor-pointer flex items-center gap-3 transition ${activeTab === 'chats' ? 'bg-bali-green text-bali-sand shadow' : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-900'}`}
            >
              <MessageSquare className="w-4 h-4 text-bali-accent" />
              <span>Live Chat Konsultasi</span>
            </button>

          </div>
        </aside>

        {/* Right Hand: Action Workspace Panel */}
        <main className="flex-1 min-w-0">
          <div className="bg-bali-sand rounded-xl p-6 sm:p-8 border border-bali-green/15 shadow-sm min-h-[500px]">
            
            {/* TAB IMPLEMENTATION: 1. TEMPAT WISATA */}
            {activeTab === 'spots' && (
              <div className="space-y-8 text-left">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-bali-green flex items-center gap-2">
                    <MapPin className="text-bali-accent w-6 h-6" />
                    <span>Tambahkan & Kelola Objek Wisata</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Ubah atau masukkan daftar pariwisata Bali terbaru ke database utama.</p>
                </div>

                {/* Insertion/Update Form */}
                <form onSubmit={handleSpotSubmit} className="bg-emerald-50/50 p-5 sm:p-6 rounded-2xl border border-emerald-100/50 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-100 pb-3 mb-2">
                    <span className="text-xs font-bold text-emerald-900 uppercase">
                      {isEditingSpot ? 'Mode Edit Wisata' : 'Wisata Baru'}
                    </span>
                    {isEditingSpot && (
                      <button 
                        type="button" 
                        onClick={resetSpotForm}
                        className="text-xs font-semibold text-rose-600 hover:underline cursor-pointer"
                      >
                        Batalkan Edit
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Nama Destinasi</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Pura Ulun Danu Bratan"
                        value={spotName}
                        onChange={e => setSpotName(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700 uppercase font-mono">Tautan / Berkas Foto Objek</label>
                        <span className="text-[10px] text-emerald-800 font-semibold italic">Mendukung galeri & upload files</span>
                      </div>
                      <div className="flex gap-1.5">
                        <input 
                          type="text" 
                          placeholder="Atau pilih/unggah di samping..."
                          value={spotImage}
                          onChange={e => setSpotImage(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => { setShowSpotGallery(!showSpotGallery); setShowLogoGallery(false); }}
                          className="px-3 py-2 bg-bali-green text-bali-sand hover:bg-bali-green/90 text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shrink-0"
                          title="Pilih gambar dari galeri preset"
                        >
                          <ImageIcon className="w-3.5 h-3.5 text-bali-accent" />
                          <span>Galeri</span>
                        </button>
                        <label className="px-3 py-2 bg-bali-accent hover:bg-bali-accent/90 text-bali-sand text-[11px] font-bold rounded-lg flex items-center gap-1 cursor-pointer transition shrink-0">
                          <Plus className="w-3.5 h-3.5" />
                          <span>Unggah</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleFileUpload(e, 'spot')} 
                            className="hidden" 
                          />
                        </label>
                      </div>

                      {/* Photo Spot Preview */}
                      {spotImage && (
                        <div className="mt-2 relative inline-block">
                          <img 
                            src={spotImage} 
                            alt="Pre-visualisasi wisata" 
                            className="w-36 h-20 object-cover rounded-lg border border-bali-green/20 shadow-sm" 
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            type="button" 
                            onClick={() => setSpotImage('')}
                            className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white rounded-full p-0.5 hover:bg-rose-700 cursor-pointer shadow"
                            title="Hapus foto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}

                      {/* ACTIVE SELECTABLE BALI TRAVEL GALLERY */}
                      {showSpotGallery && (
                        <div className="mt-3 p-4 bg-white border border-bali-green/15 rounded-xl space-y-3.5 shadow-md">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <h4 className="text-[10px] font-bold text-bali-green uppercase tracking-wider">Pustaka Galeri Pariwisata BaliNera</h4>
                            <button 
                              type="button" 
                              onClick={() => setShowSpotGallery(false)}
                              className="text-[10px] text-rose-600 font-bold hover:underline"
                            >
                              Tutup Galeri
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <h5 className="text-[9px] font-bold text-bali-gold uppercase tracking-widest">Koleksi Alam & Budaya ({PRESET_BALI_IMAGES.length})</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {PRESET_BALI_IMAGES.map((preset, i) => (
                                <div 
                                  key={i}
                                  onClick={() => { setSpotImage(preset.url); setShowSpotGallery(false); }}
                                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 hover:border-bali-gold transition"
                                >
                                  <img 
                                    src={preset.url} 
                                    alt={preset.name} 
                                    className="w-full h-14 object-cover group-hover:scale-105 transition duration-300"
                                    referrerPolicy="no-referrer"
                                  />
                                  <div className="absolute inset-0 bg-bali-green/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center p-1">
                                    <span className="text-[8px] text-white font-bold text-center leading-tight">{preset.name}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {customGallery.length > 0 && (
                            <div className="space-y-1.5 pt-2.5 border-t border-gray-150">
                              <div className="flex items-center justify-between">
                                <h5 className="text-[9px] font-bold text-bali-gold uppercase tracking-widest">Unggahan Pribadi Anda ({customGallery.length})</h5>
                                <button
                                  type="button"
                                  onClick={() => { if (confirm('Bilas riwayat unggahan Anda?')) { setCustomGallery([]); localStorage.removeItem('balinera_custom_gallery'); } }}
                                  className="text-[8px] text-rose-600 hover:underline"
                                >
                                  Hapus Riwayat
                                </button>
                              </div>
                              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                                {customGallery.map((img, i) => (
                                  <div 
                                    key={i}
                                    onClick={() => { setSpotImage(img); setShowSpotGallery(false); }}
                                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 hover:border-bali-gold transition"
                                  >
                                    <img 
                                      src={img} 
                                      alt="Unggahan" 
                                      className="w-full h-10 object-cover"
                                      referrerPolicy="no-referrer"
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                                      <span className="text-[8px] text-white font-bold">Gunakan</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Harga Tiket Masuk (IDR)</label>
                      <input 
                        type="number" 
                        placeholder="Contoh: 50000"
                        value={spotPrice || ''}
                        onChange={e => setSpotPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Lokasi Administratif</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Bedugul, Tabanan"
                        value={spotLocation}
                        onChange={e => setSpotLocation(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Kategori Objek Wisata</label>
                      <input 
                        type="text" 
                        placeholder="Contoh: Alam Danau, Seni Religi, Pantai"
                        value={spotCategory}
                        onChange={e => setSpotCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700 uppercase">Fasilitas (pisahkan dengan koma)</label>
                      <input 
                        type="text" 
                        placeholder="Sewa Kuda, Kafe, Toilet, Area Foto"
                        value={spotFacilities}
                        onChange={e => setSpotFacilities(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700 uppercase">Deskripsi Sejarah & Keindahan Wisata</label>
                    <textarea 
                      rows={3}
                      placeholder="Tuliskan naskah promosi teaterial atau penjelasan rincinya..."
                      value={spotDescription}
                      onChange={e => setSpotDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-800"
                      required
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full sm:w-auto py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    {isEditingSpot ? <Edit3 className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    <span>{isEditingSpot ? 'Simpan Pembaruan Objek' : 'Publish Objek Wisata Bali'}</span>
                  </button>
                </form>

                {/* Destinations List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-950 uppercase tracking-wide">Daftar Destinasi Ditampilkan ({destinations.length})</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {destinations.map(dest => (
                      <div key={dest.id} className="border border-gray-100 rounded-2xl p-4 flex gap-4 bg-white shadow-sm hover:shadow transition">
                        <img 
                          src={dest.image} 
                          alt={dest.name} 
                          className="w-20 h-20 rounded-xl object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full font-semibold">{dest.category}</span>
                            <h4 className="font-bold text-sm text-emerald-950 truncate mt-1">{dest.name}</h4>
                            <p className="text-xs text-gray-500 truncate mt-0.5">{dest.location}</p>
                          </div>
                          <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                            <span className="text-xs font-bold text-emerald-800">Rp {dest.price.toLocaleString('id-ID')}</span>
                            <div className="flex items-center space-x-2">
                              <button 
                                onClick={() => handleEditSpotSelect(dest)}
                                className="p-1 px-2.5 text-xs text-emerald-700 hover:bg-emerald-50 rounded-md cursor-pointer font-bold inline-flex items-center gap-1"
                              >
                                Edit
                              </button>
                              <button 
                                onClick={() => { if (confirm('Apakah anda yakin ingin menghapus spot ini?')) deleteDestination(dest.id); }}
                                className="p-1 text-rose-600 hover:bg-rose-50 rounded-md cursor-pointer"
                                title="Hapus objek"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}


            {/* TAB IMPLEMENTATION: 2. IDENTITY (LOGO & NAMA WEBSITE) */}
            {activeTab === 'identity' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                    <Globe className="text-emerald-600 w-6 h-6" />
                    <span>Identitas Utama & Logo Website</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Gantilah nama dan logo utama BaliNera sesuai kebutuhan branding Anda di sini.</p>
                </div>

                <form onSubmit={handleIdentitySubmit} className="bg-emerald-50/40 p-5 sm:p-6 rounded-2xl border border-emerald-100/50 space-y-4 max-w-xl">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase block">Nama Website Pariwisata</label>
                    <input 
                      type="text" 
                      value={siteName}
                      onChange={e => setSiteName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                      required
                    />
                  </div>

                  <div className="space-y-1.5 text-left">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700 uppercase block">Logo Maskot / Gambar Brand</label>
                      <span className="text-[10px] text-emerald-800 font-semibold italic">Bisa emoji, tulisan, atau file logo</span>
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={siteLogo}
                          onChange={e => setSiteLogo(e.target.value)}
                          placeholder="Contoh: 🌴 BaliNera atau link gambar..."
                          className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => { setShowLogoGallery(!showLogoGallery); setShowSpotGallery(false); }}
                          className="px-3 py-2.5 bg-bali-green text-bali-sand hover:bg-bali-green/90 text-xs font-semibold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shrink-0"
                        >
                          <ImageIcon className="w-4 h-4" />
                          <span>Pilih Logo</span>
                        </button>
                        <label className="px-3 py-2.5 bg-bali-accent hover:bg-bali-accent/90 text-bali-sand text-xs font-semibold rounded-xl flex items-center justify-center gap-1 cursor-pointer transition shrink-0">
                          <Plus className="w-4 h-4" />
                          <span>Unggah</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => handleFileUpload(e, 'logo')} 
                            className="hidden" 
                          />
                        </label>
                      </div>

                      {/* Display live preview of site logo */}
                      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-150">
                        <span className="text-[11px] font-bold text-gray-500 font-mono uppercase">Preview Maskot Logo Aktif (Navbar):</span>
                        {siteLogo && (siteLogo.startsWith('http') || siteLogo.startsWith('data:')) ? (
                          <img 
                            src={siteLogo} 
                            alt="Logo Brand" 
                            className="w-10 h-10 object-cover rounded-full border border-bali-gold" 
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-2xl">{siteLogo.split(' ')[0]}</span>
                        )}
                        <span className="font-serif font-bold text-lg text-bali-green">{siteName}</span>
                      </div>

                      {/* EXPANDABLE LOGO SELECTION PANEL */}
                      {showLogoGallery && (
                        <div className="p-4 bg-white border border-bali-green/15 rounded-xl space-y-4 shadow-md max-h-96 overflow-y-auto">
                          <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                            <h4 className="text-xs font-bold text-bali-green uppercase">Koleksi Logo Kreatif & Badges</h4>
                            <button 
                              type="button" 
                              onClick={() => setShowLogoGallery(false)}
                              className="text-[10px] text-rose-600 font-bold hover:underline"
                            >
                              Tutup Panel
                            </button>
                          </div>

                          <div className="space-y-1.5">
                            <h5 className="text-[10px] font-bold text-bali-gold uppercase tracking-wider">Badge Preset / Ikon Dewata ({PRESET_BALI_LOGOS.length})</h5>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {PRESET_BALI_LOGOS.map((item, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => { 
                                    setSiteLogo(item.url); 
                                    setShowLogoGallery(false); 
                                  }}
                                  className="p-2 border border-gray-100 hover:border-bali-gold rounded-xl flex flex-col items-center justify-center gap-1.5 transition text-left cursor-pointer bg-slate-50/50"
                                >
                                  {item.url.startsWith('http') ? (
                                    <img 
                                      src={item.url} 
                                      alt={item.name} 
                                      className="w-8 h-8 rounded-full object-cover" 
                                      referrerPolicy="no-referrer"
                                    />
                                  ) : (
                                    <span className="text-xl">{item.url.split(' ')[0]}</span>
                                  )}
                                  <span className="text-[8px] text-gray-600 font-bold text-center w-full truncate leading-tight">{item.name}</span>
                                </button>
                              ))}
                            </div>
                          </div>

                          {customGallery.length > 0 && (
                            <div className="space-y-1.5 pt-2.5 border-t border-gray-150">
                              <h5 className="text-[10px] font-bold text-bali-gold uppercase tracking-wider">Unggahan Logo Pribadi ({customGallery.length})</h5>
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {customGallery.map((img, i) => (
                                  <div 
                                    key={i}
                                    onClick={() => { setSiteLogo(img); setShowLogoGallery(false); }}
                                    className="group relative cursor-pointer overflow-hidden rounded-lg border border-gray-100 hover:border-bali-gold transition"
                                  >
                                    <img 
                                      src={img} 
                                      alt="Kandidat Logo" 
                                      className="w-full h-10 object-cover rounded" 
                                      referrerPolicy="no-referrer"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase block">Slogan Penjelas (Slogan)</label>
                    <input 
                      type="text" 
                      value={siteSlogan}
                      onChange={e => setSiteSlogan(e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
                      required
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition shadow"
                  >
                    Simpan Identitas Website
                  </button>
                </form>
              </div>
            )}


            {/* TAB IMPLEMENTATION: 3. MANAGE USERS */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                    <Users className="text-emerald-600 w-6 h-6" />
                    <span>Kelola Pengguna & Hak Akses</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Lihat pengunjung yang terdaftar, berikan tindakan blokir jika ada sabotase, atau hapus database akun.</p>
                </div>

                <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-emerald-50 text-emerald-900 border-b border-emerald-100 text-xs font-bold uppercase">
                          <th className="p-4">Nama Pengamat</th>
                          <th className="p-4">Surat Elektronik (Email)</th>
                          <th className="p-4 font-mono">Tanggal Terdaftar</th>
                          <th className="p-4 text-center">Status Akses / Peran</th>
                          <th className="p-4 text-center">Tindakan Khusus</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 text-xs">
                        {users.map(u => (
                          <tr key={u.id} className="hover:bg-amber-50/20 transition">
                            <td className="p-4 font-semibold text-gray-800">{u.name}</td>
                            <td className="p-4 font-mono text-gray-600">{u.email}</td>
                            <td className="p-4 font-mono text-gray-500">{new Date(u.registeredAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                            <td className="p-4 text-center">
                              {u.role === 'admin' ? (
                                <span className="bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded-full text-[10px] uppercase font-mono tracking-wide">Administrator</span>
                              ) : u.isBlocked ? (
                                <span className="bg-rose-100 text-rose-900 font-bold px-2 py-1 rounded-full text-[10px] uppercase font-mono tracking-wide">Dideaktivasi</span>
                              ) : (
                                <span className="bg-emerald-100 text-emerald-900 font-semibold px-2 py-1 rounded-full text-[10px] uppercase font-mono tracking-wide">Aktif Normal</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {u.role === 'admin' ? (
                                <span className="text-gray-400 font-mono italic text-[10px]">Utama (Kebal)</span>
                              ) : (
                                <div className="flex items-center justify-center space-x-2">
                                  <button
                                    onClick={() => toggleUserBlock(u.id)}
                                    className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer transition ${u.isBlocked ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-amber-100 text-amber-800 hover:bg-amber-200'}`}
                                  >
                                    {u.isBlocked ? 'Aktifkan' : 'Blokir'}
                                  </button>
                                  <button
                                    onClick={() => { if (confirm('Keluarkan user dari database secara permanen?')) deleteUser(u.id); }}
                                    className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                                    title="Hapus permanen"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}


            {/* TAB IMPLEMENTATION: 4. TRANSACTIONS & PAYMENTS REGULATION */}
            {activeTab === 'payments' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                    <Banknote className="text-emerald-600 w-6 h-6" />
                    <span>Atur Regulasi & Pembayaran Transaksi</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Konfigurasikan detail rekening bank untuk transfer, QRIS digital, serta ketentuan tunai (cash) bagi user.</p>
                </div>

                <form onSubmit={handlePaymentsSubmit} className="bg-emerald-50/40 p-5 sm:p-6 rounded-2xl border border-emerald-100/50 space-y-4">
                  
                  {/* Bank detail */}
                  <div className="border-b border-emerald-100/50 pb-4 space-y-4">
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                      <Settings2 className="w-4 h-4 text-emerald-700" />
                      <span>1. Transfer Rekening Bank</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Nama Bank Penerima</label>
                        <input 
                          type="text" 
                          value={pBankName}
                          onChange={e => setPBankName(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Nomor Rekening</label>
                        <input 
                          type="text" 
                          value={pAccountNumber}
                          onChange={e => setPAccountNumber(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-gray-600 uppercase">Nama Pemilik Rekening (A.N.)</label>
                        <input 
                          type="text" 
                          value={pAccountHolder}
                          onChange={e => setPAccountHolder(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* QRIS setup */}
                  <div className="border-b border-emerald-100/50 pb-4 space-y-4">
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-emerald-700" />
                      <span>2. Tautan Barcode QRIS</span>
                    </h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">URL Gambar / Berkas Barcode QRIS</label>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={pQrisUrl}
                          onChange={e => setPQrisUrl(e.target.value)}
                          placeholder="https://picsum.photos/seed/qrisbalinera/300/300"
                          className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs text-gray-800"
                          required
                        />
                        <label className="px-3 py-2 bg-bali-accent hover:bg-bali-accent/90 text-bali-sand text-[11px] font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer transition shrink-0">
                          <Plus className="w-4.5 h-4.5" />
                          <span>Unggah QRIS</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={e => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  setPQrisUrl(reader.result as string);
                                  alert('Barcode QRIS berhasil diunggah lokal!');
                                };
                                reader.readAsDataURL(file);
                              }
                            }} 
                            className="hidden" 
                          />
                        </label>
                      </div>

                      {pQrisUrl && (
                        <div className="mt-2 bg-white inline-block p-1.5 border rounded-lg shadow-sm">
                          <img 
                            src={pQrisUrl} 
                            alt="QRIS Barcode" 
                            className="w-24 h-24 object-contain" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cash instructions */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-widest flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span>3. Ketentuan Bayar Tunai (Cash)</span>
                    </h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600 uppercase">Instruksi Pembayaran Tunai Wisatawan</label>
                      <textarea 
                        rows={3}
                        value={pCashInstructions}
                        onChange={e => setPCashInstructions(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
                        required
                      ></textarea>
                    </div>
                  </div>

                  <button 
                    type="submit"
                    className="w-full sm:w-auto py-2.5 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow cursor-pointer transition"
                  >
                    Simpan Regulasi Transaksi
                  </button>
                </form>
              </div>
            )}


            {/* TAB IMPLEMENTATION: 5. CONNECTED SOCIAL MEDIA CONFIG */}
            {activeTab === 'socials' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                    <Phone className="text-emerald-600 w-6 h-6" />
                    <span>Layanan Kontak Media Sosial</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Masukkan link atau akun sosmed resmi agar pengunjung dapat mengontak Admin dengan sekali klik di footer halaman.</p>
                </div>

                <form onSubmit={handleSocialsSubmit} className="bg-emerald-50/40 p-5 sm:p-6 rounded-2xl border border-emerald-100/50 space-y-4 max-w-xl">
                  
                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-gray-700 uppercase block">WhatsApp Link</label>
                    <input 
                      type="text" 
                      value={whatsappUrl}
                      onChange={e => setWhatsappUrl(e.target.value)}
                      placeholder="https://wa.me/628123456789"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-gray-700 uppercase block">Instagram Profile Link</label>
                    <input 
                      type="text" 
                      value={instagramUrl}
                      onChange={e => setInstagramUrl(e.target.value)}
                      placeholder="https://instagram.com/balinera_travel"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-gray-700 uppercase block">TikTok Profile Link</label>
                    <input 
                      type="text" 
                      value={tiktokUrl}
                      onChange={e => setTiktokUrl(e.target.value)}
                      placeholder="https://tiktok.com/@balinera"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="font-bold text-gray-700 uppercase block">Facebook Page Link</label>
                    <input 
                      type="text" 
                      value={facebookUrl}
                      onChange={e => setFacebookUrl(e.target.value)}
                      placeholder="https://facebook.com/balinera.pariwisata"
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-xl"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition shadow"
                  >
                    Simpan Sosial Media Admin
                  </button>
                </form>
              </div>
            )}


            {/* TAB IMPLEMENTATION: 6. COMPLAINTS INBOX */}
            {activeTab === 'complaints' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                    <AlertOctagon className="text-emerald-600 w-6 h-6" />
                    <span>Halaman Respon Surat Aduan Keluhan</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Daftar laporan kritis kendala lapangan yang dialami oleh para wisatawan selama liburan.</p>
                </div>

                <div className="space-y-4">
                  {complaints.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 font-mono text-xs bg-gray-50 rounded-2xl border border-dashed">
                      Belum ada aduan keluhan yang terekam masuk.
                    </div>
                  ) : (
                    complaints.map(comp => (
                      <div 
                        key={comp.id} 
                        className={`p-5 rounded-2xl border transition ${comp.status === 'Pending' ? 'bg-amber-50/50 border-amber-200' : 'bg-white border-zinc-100'}`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3 mb-3">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-0.5 rounded-full font-mono font-bold text-[9px] uppercase ${comp.status === 'Pending' ? 'bg-amber-200 text-amber-900' : 'bg-emerald-100 text-emerald-900'}`}>
                              {comp.status === 'Pending' ? 'Perlu Respon' : 'Selesai Terjawab'}
                            </span>
                            <span className="text-xs font-bold text-emerald-950 truncate max-w-[200px]">{comp.spotName}</span>
                          </div>
                          
                          <span className="text-[10px] text-gray-400 font-mono">
                            {new Date(comp.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        <p className="text-xs text-slate-800 leading-relaxed font-sans">{comp.complaintText}</p>

                        <div className="mt-3 pt-3 border-t border-gray-50 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                          <div>Pelapor: <span className="font-bold text-emerald-900">{comp.userName}</span> ({comp.userEmail})</div>
                          <div>ID Aduan: {comp.id}</div>
                        </div>

                        {/* Reply block */}
                        {comp.status === 'Pending' ? (
                          <div className="mt-4 bg-white p-3.5 rounded-xl border border-amber-200/60 shadow-inner">
                            {activeComplaintReplyId === comp.id ? (
                              <div className="space-y-2">
                                <textarea
                                  rows={2}
                                  placeholder="Tulis balas pesan resmi anda selaku administrator..."
                                  value={complaintReplyText}
                                  onChange={e => setComplaintReplyText(e.target.value)}
                                  className="w-full p-2.5 text-xs border rounded-lg focus:ring-1 focus:ring-emerald-500 font-sans text-gray-800"
                                />
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    onClick={() => setActiveComplaintReplyId('')}
                                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-600 rounded-md text-xs font-semibold cursor-pointer"
                                  >
                                    Batal
                                  </button>
                                  <button
                                    onClick={() => handleComplaintReplySubmit(comp.id)}
                                    className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md text-xs font-bold cursor-pointer flex items-center gap-1"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Kirim Balasan Resmi</span>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setActiveComplaintReplyId(comp.id); setComplaintReplyText(''); }}
                                className="w-full text-center py-2 bg-emerald-700/5 hover:bg-emerald-700/10 text-emerald-800 border border-emerald-800/10 text-xs font-bold rounded-lg cursor-pointer transition.transform"
                              >
                                Tulis Solusi & Selesaikan Aduan Ini
                              </button>
                            )}
                          </div>
                        ) : (
                          <div className="mt-4 bg-emerald-50 text-emerald-900 p-3.5 rounded-xl border border-emerald-100 text-xs">
                            <span className="font-bold font-mono text-[9px] uppercase text-emerald-800 tracking-wider flex items-center gap-1 mb-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Balasan Thomas (Admin BaliNera)</span>
                            </span>
                            <p className="italic font-sans">"{comp.adminReply}"</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}


            {/* TAB IMPLEMENTATION: 7. LIVE ACTIVE CHATS */}
            {activeTab === 'chats' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-serif text-2xl font-extrabold text-emerald-950 flex items-center gap-2">
                    <MessageSquare className="text-emerald-600 w-6 h-6" />
                    <span>Layanan Obrolan Langsung (Live Chat)</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">Interaksi real-time konsultasi wisata bersama audiens Anda secara interaktif.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-zinc-100 rounded-3xl overflow-hidden shadow-inner h-[450px]">
                  
                  {/* Left Side: Threads List */}
                  <div className="md:col-span-1 border-r border-zinc-100 bg-zinc-50 overflow-y-auto">
                    <div className="p-3 border-b text-[10px] font-bold text-gray-500 uppercase font-mono bg-white">Hubungan Pelanggan</div>
                    
                    {userChatThreads.length === 0 ? (
                      <div className="p-6 text-center text-xs text-gray-400 font-mono italic">
                        Belum ada wisatawan membuka chat.
                      </div>
                    ) : (
                      userChatThreads.map(thread => (
                        <button
                          key={thread.id}
                          onClick={() => setSelectedUserChatId(thread.id)}
                          className={`w-full text-left p-3.5 border-b border-zinc-100 flex flex-col space-y-1 hover:bg-emerald-50/45 cursor-pointer transition ${selectedUserChatId === thread.id ? 'bg-emerald-50 border-r-4 border-r-emerald-700' : 'bg-white'}`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-emerald-950 truncate max-w-[120px]">{thread.name}</span>
                            <span className="text-[9px] font-mono text-amber-600">Aktif</span>
                          </div>
                          <p className="text-[10px] text-gray-500 truncate">{thread.lastMessage || 'Menunggu sapaan...'}</p>
                        </button>
                      ))
                    )}
                  </div>

                  {/* Right Side: Conversation Area */}
                  <div className="md:col-span-2 flex flex-col justify-between bg-white h-full relative">
                    {selectedUserChatId ? (
                      <>
                        {/* Selected Thread Header */}
                        <div className="p-3 px-4 border-b border-zinc-50 bg-emerald-50/20 flex justify-between items-center shrink-0">
                          <div>
                            <h4 className="text-xs font-extrabold text-emerald-950">
                              {users.find(u => u.id === selectedUserChatId)?.name || 'Wisatawan'}
                            </h4>
                            <p className="text-[9px] font-mono text-gray-400">
                              {users.find(u => u.id === selectedUserChatId)?.email || 'klien@gmail.com'}
                            </p>
                          </div>
                          <span className="text-[9px] font-mono bg-emerald-100 text-emerald-950 px-2 py-0.5 rounded-full font-bold">LIVE CHATING</span>
                        </div>

                        {/* Conversational Screen */}
                        <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans">
                          {activeThreadMessages.map(msg => (
                            <div 
                              key={msg.id} 
                              className={`flex flex-col max-w-[85%] ${msg.sender === 'admin' ? 'ml-auto items-end' : 'mr-auto items-start'}`}
                            >
                              <div className={`p-3 rounded-2xl text-xs leading-normal shadow-sm ${msg.sender === 'admin' ? 'bg-emerald-700 text-white rounded-tr-none' : 'bg-amber-50 text-gray-800 border border-amber-100 rounded-tl-none'}`}>
                                {msg.text}
                              </div>
                              <span className="text-[9px] text-gray-400 font-mono mt-1">
                                {msg.sender === 'admin' ? 'Thomas (Anda)' : msg.userName} • {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Send form */}
                        <form onSubmit={handleSendAdminChat} className="p-3 border-t bg-gray-50 flex gap-2 shrink-0">
                          <input
                            type="text"
                            placeholder="Ketik balasan untuk wisatawan..."
                            value={adminReplyText}
                            onChange={e => setAdminReplyText(e.target.value)}
                            className="flex-1 px-3 py-2 text-xs border rounded-xl focus:outline-none focus:ring-1 focus:ring-emerald-500 bg-white"
                            required
                          />
                          <button
                            type="submit"
                            className="p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl cursor-pointer transition flex items-center justify-center shrink-0"
                            title="Kirim Pesan"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 p-8 space-y-2">
                        <MessageSquare className="w-12 h-12 text-zinc-300" />
                        <h4 className="font-bold text-sm text-gray-500">Pilih Wisatawan Pengirim</h4>
                        <p className="text-xs max-w-sm">Daftar obrolan wisatawan yang mengajukan pertanyaan seputar destinasi Bali akan muncul di panel kiri.</p>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>
        </main>
      </div>

    </div>
  );
}
