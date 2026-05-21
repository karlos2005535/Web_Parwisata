import React, { useState, useRef, useEffect } from 'react';
import { useBaliNera } from '../context/BaliNeraContext';
import { Destination } from '../types';
import { 
  Compass, MapPin, Star, Sparkles, Receipt, AlertTriangle, 
  MessageSquare, Send, X, Landmark, QrCode, CreditCard, CheckCircle2
} from 'lucide-react';

export default function UserExplorer() {
  const {
    currentUser,
    destinations,
    complaints,
    paymentSetting,
    chats,
    bookings,
    siteInfo,
    submitComplaint,
    sendChatMessage,
    bookDestination
  } = useBaliNera();

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Booking states
  const [selectedDestForBooking, setSelectedDestForBooking] = useState<Destination | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Bank Transfer' | 'QRIS' | 'Cash'>('Bank Transfer');
  const [bookingFinished, setBookingFinished] = useState(false);
  const [currentBookingId, setCurrentBookingId] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  // Sync selected bank with dynamic payment settings on load
  useEffect(() => {
    if (paymentSetting?.bankName) {
      setSelectedBank(paymentSetting.bankName);
    }
  }, [paymentSetting?.bankName]);

  // Complaint states
  const [complaintSpot, setComplaintSpot] = useState('');
  const [complaintText, setComplaintText] = useState('');
  const [complaintSuccess, setComplaintSuccess] = useState('');

  // Live Chat Floating Widget Toggle
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new chat is sent or opened
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chats, isChatOpen]);

  // Handle book confirm
  const handleConfirmReservation = () => {
    if (!selectedDestForBooking) return;
    
    bookDestination(selectedDestForBooking.id, selectedPaymentMethod);
    const mockId = `BN-${Math.floor(100000 + Math.random() * 900000)}`;
    setCurrentBookingId(mockId);
    setBookingFinished(true);
  };

  const handleCloseBookingModal = () => {
    setSelectedDestForBooking(null);
    setBookingFinished(false);
    setCurrentBookingId('');
  };

  // Handle complaint submission
  const handleComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setComplaintSuccess('');

    if (!complaintText.trim()) return;

    const res = submitComplaint(complaintSpot, complaintText);
    if (res.success) {
      setComplaintSuccess(res.message);
      setComplaintText('');
      setComplaintSpot('');
    }
  };

  // Handle client sending direct chat message
  const handleClientSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    sendChatMessage(chatInputText);
    setChatInputText('');
  };

  // Categories extraction
  const categories = ['Semua', ...Array.from(new Set(destinations.map(d => d.category)))];

  // Filtering spots
  const filteredDestinations = destinations.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          dest.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'Semua' || dest.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // User historical bookings & complaints
  const userBookings = bookings.filter(b => b.userId === currentUser?.id);
  const userComplaints = complaints.filter(c => c.userId === currentUser?.id);
  const userChats = chats.filter(m => m.userId === currentUser?.id);

  return (
    <div className="space-y-20 pb-28 bg-bali-sand min-h-screen bg-mandala">
      
      {/* 1. HERO BANNER LANDING */}
      <section id="home" className="relative min-h-[550px] flex items-center justify-center p-6 text-center text-bali-sand overflow-hidden bg-bali-green">
        
        {/* Dynamic Landscape Photo Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center mix-blend-multiply opacity-50 scale-100 transition-all duration-[20s] animate-pulse-slow"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1518548419070-2c511696d69e?auto=format&fit=crop&w=1800&q=80')" }}
        ></div>

        {/* Floating Ambient Rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-bali-gold/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6 px-4">
          <div className="inline-flex items-center space-x-2 bg-bali-sand/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-bali-sand/20 text-xs sm:text-sm font-semibold tracking-wider text-bali-gold">
            <Sparkles className="w-4 h-4 text-bali-gold shrink-0" />
            <span>PINTU GERBANG PETUALANGAN PULAU DEWATA</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-7xl font-bold leading-[1.1] tracking-tight drop-shadow-md text-bali-sand">
            Eksplorasi Keindahan <br className="hidden sm:inline" />
            <span className="text-bali-gold italic underline underline-offset-8 decoration-bali-accent decoration-wavy font-bold">{siteInfo.name}</span>
          </h1>

          <p className="text-sm sm:text-lg text-bali-sand/90 font-sans leading-relaxed max-w-2xl mx-auto font-light drop-shadow">
            {siteInfo.slogan || 'Pesan tiket wisata religi di Tanah Lot, kelola transaksi amfiteater Tari Kecak Uluwatu, dan terhubung instan dengan local guide.'}
          </p>

          {/* Sapaan Pelanggan & Search Box */}
          <div className="pt-6 max-w-xl mx-auto">
            <div className="bg-bali-sand p-2 rounded-xl shadow-2xl border border-bali-green/10 flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Cari wisata... (e.g., Tanah Lot, Ubud, Badung)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 px-4 py-3 text-sm text-bali-green rounded-lg focus:outline-none bg-bali-green/5"
              />
              <button 
                onClick={() => {
                  const el = document.getElementById('wisata');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-bali-green hover:bg-bali-green/90 text-bali-sand font-bold text-xs uppercase py-3 px-6 rounded-lg transition-all tracking-widest cursor-pointer shrink-0"
              >
                Cari Sekarang
              </button>
            </div>
            <p className="text-[10px] text-bali-gold/80 mt-3 font-mono tracking-wider">Tersedia {destinations.length} referensi wisata utama yang diverifikasi staf ahli</p>
          </div>
        </div>
      </section>


      {/* 2. TOURIST DESTINATIONS LIST */}
      <section id="wisata" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 scroll-mt-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-bali-green/10 pb-6">
          <div className="space-y-1.5 text-left">
            <span className="text-[10px] font-bold text-bali-accent uppercase tracking-[0.25em] font-sans">PILIHAN TERSEDIA</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-bali-green flex items-center gap-2">
              <Compass className="text-bali-accent w-8 h-8 animate-spin-slow" />
              <span>Objek Destinasi BaliNera</span>
            </h2>
            <p className="text-xs text-bali-green/65 max-w-md">Pilihlah tempat wisata religi, alam, atau seni budaya pulau Dewata yang eksotis.</p>
          </div>

          {/* Filtering Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`py-2 px-4 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer transition-all border ${selectedCategory === cat ? 'bg-bali-green text-bali-sand border-bali-green shadow-md' : 'bg-bali-sand text-bali-green/75 border-bali-green/15 hover:bg-bali-green/5 hover:text-bali-green'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid List */}
        {filteredDestinations.length === 0 ? (
          <div className="text-center py-24 text-bali-green/50 font-mono text-xs bg-bali-sand rounded-xl border-2 border-dashed border-bali-green/10">
            Mohon maaf, destinasi "{searchQuery}" tidak ditemukan di sistem BaliNera.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10">
            {filteredDestinations.map(dest => (
              <article key={dest.id} className="bg-bali-sand rounded-xl border border-bali-green/15 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group relative">
                
                {/* Image Section */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <span className="absolute top-3 left-3 z-10 bg-bali-sand/95 backdrop-blur shadow-sm px-3.5 py-1 rounded text-[9px] font-bold text-bali-green uppercase tracking-widest border border-bali-green/10">
                    {dest.category}
                  </span>
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover transition duration-1000 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Rating Badge */}
                  <div className="absolute bottom-3 right-3 bg-bali-green/85 backdrop-blur text-bali-sand py-1 px-2.5 rounded-md text-xs font-bold flex items-center gap-1 border border-bali-sand/10">
                    <Star className="w-3.5 h-3.5 fill-bali-gold text-bali-gold" />
                    <span className="font-bold">{dest.rating.toFixed(1)}</span>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-6 shrink-0 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-bali-green/60 gap-1">
                      <MapPin className="w-3.5 h-3.5 text-bali-accent shrink-0" />
                      <span className="truncate tracking-wide">{dest.location}</span>
                    </div>

                    <h3 className="font-serif text-xl font-bold text-bali-green leading-tight group-hover:text-bali-accent transition-colors">
                      {dest.name}
                    </h3>

                    <p className="text-xs text-bali-green/75 leading-relaxed line-clamp-3">
                      {dest.description}
                    </p>
                  </div>

                  {/* Facilities Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {dest.facilities.slice(0, 3).map((fac, idx) => (
                      <span key={idx} className="bg-bali-gold/10 text-bali-green font-bold text-[9px] uppercase tracking-wide px-2 py-0.5 rounded border border-bali-gold/25">
                        {fac}
                      </span>
                    ))}
                    {dest.facilities.length > 3 && (
                      <span className="text-[9px] text-bali-green/55 font-bold self-center">+{dest.facilities.length - 3}</span>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="flex items-center justify-between pt-4 border-t border-bali-green/10 mt-2">
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] font-bold text-bali-green/50 uppercase tracking-widest">Tiket Masuk</span>
                      <span className="text-base font-extrabold text-bali-green">
                        Rp {dest.price.toLocaleString('id-ID')}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedDestForBooking(dest)}
                      className="py-2.5 px-4 bg-bali-green hover:bg-bali-accent text-bali-sand font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 cursor-pointer flex items-center gap-1.5 shadow-sm"
                    >
                      <Receipt className="w-3.5 h-3.5" />
                      <span>Pesan Tiket</span>
                    </button>
                  </div>
                </div>

              </article>
            ))}
          </div>
        )}
      </section>


      {/* 3. BOOKING BILLING TRANSACTIONS MODULE (No Rekening, QRIS, and Cash) */}
      <section id="transaksi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        
        <div className="border-t border-bali-green/10 pt-16 space-y-6">
          <div className="space-y-1 text-left">
            <span className="text-[10px] font-bold text-bali-accent uppercase tracking-[0.25em]">TRANSAKSI ANDA</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bali-green flex items-center gap-2">
              <Receipt className="text-bali-accent w-7 h-7" />
              <span>Daftar Invoice Pemesanan Tiket</span>
            </h2>
            <p className="text-xs text-bali-green/65">Log transaksi historis pembayaran digital Anda untuk tiket pariwisata Bali.</p>
          </div>

          {userBookings.length === 0 ? (
            <div className="text-center py-12 text-bali-green/50 font-mono text-xs bg-bali-sand rounded-xl border border-dashed border-bali-green/15">
              Anda belum melakukan booking destinasi apapun. Jelajahi spot di atas dan klik "Pesan Tiket".
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userBookings.map(book => (
                <div key={book.id} className="bg-bali-sand border border-bali-green/15 rounded-xl p-5 sm:p-6 flex flex-col justify-between gap-5 shadow-sm hover:shadow-md transition-all relative overflow-hidden text-left">
                  
                  {/* Side ribbon token */}
                  <div className={`absolute top-0 right-0 w-2 h-full ${book.status === 'Lunas' ? 'bg-bali-green' : 'bg-bali-accent'}`}></div>

                  <div className="flex items-start justify-between border-b border-bali-green/10 pb-3">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-bali-green/50">INVOICE ID: {book.id}</span>
                      <h4 className="font-serif font-bold text-base text-bali-green mt-1">{book.destinationName}</h4>
                    </div>
                    
                    <span className={`px-3 py-0.5 rounded font-mono font-bold text-[9px] uppercase tracking-wider border ${book.status === 'Lunas' ? 'bg-bali-green/5 text-bali-green border-bali-green/20' : 'bg-bali-accent/5 text-bali-accent border-bali-accent/20'}`}>
                      {book.status === 'Lunas' ? 'Lunas' : 'Menunggu Bayar'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-bali-green/75">
                    <div>
                      <p className="text-bali-green/45 uppercase text-[9px] font-bold">Wisatawan</p>
                      <p className="font-bold text-bali-green">{book.userName}</p>
                    </div>
                    <div>
                      <p className="text-bali-green/45 uppercase text-[9px] font-bold">Metode</p>
                      <p className="font-bold text-bali-green">{book.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-bali-green/45 uppercase text-[9px] font-bold">Total Biaya</p>
                      <p className="font-extrabold text-bali-accent">Rp {book.price.toLocaleString('id-ID')}</p>
                    </div>
                  </div>

                  <div className="text-[9px] text-bali-green/50 font-mono border-t border-bali-green/5 pt-2">
                    *Tunjukkan lembaran invoice digital ini kepada petugas loket setibanya di area masuk wisata.
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* 4. USER COMPLAINTS SYSTEM */}
      <section id="keluhan" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 scroll-mt-24">
        
        <div className="border-t border-bali-green/10 pt-16 grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-1 space-y-4 text-left">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-bali-accent uppercase tracking-[0.25em]">LAYANAN KENDALA</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-bali-green flex items-center gap-2">
                <AlertTriangle className="text-bali-accent w-7 h-7" />
                <span>Pelayanan Kritik & Keluhan</span>
              </h2>
              <p className="text-xs text-bali-green/65 leading-relaxed">Punya pengalaman kurang prima atau kendala aksesibilitas fasilitas di tempat liburan? Sampaikan aduan Anda langsung ke Thomas (Admin BaliNera).</p>
            </div>

            <div className="bg-bali-green/5 p-5 rounded-lg border border-bali-green/15 text-xs text-bali-green font-sans space-y-2">
              <p className="font-bold uppercase tracking-wider text-bali-green">Respon Aduan Cepat:</p>
              <p className="leading-relaxed">Setiap surat keluhan yang masuk akan langsung dikirimkan ke dasbor administrator utama Thomas Karlos Baco. Respon dan solusi resmi akan kami lampirkan secara real-time pada riwayat keluhan di samping.</p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            
            {/* Complaint submission form */}
            <form onSubmit={handleComplaintSubmit} className="bg-bali-sand border border-bali-green/15 p-6 rounded-xl shadow-sm space-y-4 text-left">
              {complaintSuccess && (
                <div className="bg-bali-green/5 text-bali-green border border-bali-green/20 rounded p-3 text-xs font-semibold">
                  {complaintSuccess}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-bali-green/60 uppercase tracking-wider block">Objek Wisata / Layanan Terkait</label>
                  <select
                    value={complaintSpot}
                    onChange={e => setComplaintSpot(e.target.value)}
                    className="w-full px-3 py-2 bg-transparent border-b border-gray-300 focus:border-bali-green focus:outline-none text-xs text-bali-green"
                    required
                  >
                    <option value="" className="bg-bali-sand">-- Pilih Destinasi Kendala --</option>
                    <option value="Layanan Tiketing Umum" className="bg-bali-sand">Layanan Tiketing Umum BaliNera</option>
                    {destinations.map(d => (
                      <option key={d.id} value={d.name} className="bg-bali-sand">{d.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-bali-green/60 uppercase tracking-wider block">Pengirim Aduan</label>
                  <input
                    type="text"
                    value={`${currentUser?.name} (${currentUser?.email})`}
                    className="w-full px-3 py-2 bg-transparent border-b border-transparent text-xs font-mono text-bali-green/50"
                    disabled
                  />
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="font-bold text-bali-green/60 uppercase tracking-wider block">Kronologi & Deskripsi Keluhan</label>
                <textarea
                  rows={4}
                  placeholder="Tuliskan secara jelas kendala seperti kerusakan fasilitas toilet, kekurangan air bersih, parkir rasis, atau kendala pendaftaran..."
                  value={complaintText}
                  onChange={e => setComplaintText(e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border-b border-gray-300 focus:border-bali-green focus:outline-none text-xs text-bali-green leading-relaxed"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto py-2.5 px-6 bg-bali-green hover:bg-bali-accent text-bali-sand font-bold text-xs uppercase tracking-widest rounded-lg cursor-pointer transition shadow"
              >
                Kirim Aduan Resmi ke Thomas
              </button>
            </form>

            {/* Historical tracking complaints */}
            <div className="space-y-4 text-left">
              <h3 className="text-xs font-bold text-bali-green uppercase tracking-widest border-b border-bali-green/10 pb-2">Riwayat Keluhan Anda ({userComplaints.length})</h3>
              {userComplaints.length === 0 ? (
                <div className="text-center py-8 text-bali-green/40 font-mono text-[11px] bg-bali-sand rounded-lg border border-dashed border-bali-green/15">
                  Belum ada riwayat keluhan yang Anda ajukan.
                </div>
              ) : (
                <div className="space-y-4">
                  {userComplaints.map(comp => (
                    <div key={comp.id} className="border border-bali-green/15 p-5 rounded-lg bg-bali-sand space-y-4">
                      <div className="flex justify-between items-center border-b border-bali-green/5 pb-2">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-0.5 rounded font-mono text-[8px] font-bold uppercase tracking-wider border ${comp.status === 'Pending' ? 'bg-bali-gold/10 text-bali-green border-bali-gold/20' : 'bg-bali-green/10 text-bali-green border-bali-green/20'}`}>
                            {comp.status === 'Pending' ? 'Diproses Admin' : 'Selesai'}
                          </span>
                          <span className="text-xs font-serif font-bold text-bali-green">{comp.spotName}</span>
                        </div>
                        <span className="text-[9px] text-bali-green/50 font-mono">{new Date(comp.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                      
                      <p className="text-xs text-bali-green/80 italic leading-relaxed">"{comp.complaintText}"</p>

                      {comp.adminReply && (
                        <div className="bg-bali-sand/50 p-4 rounded border border-bali-gold/20 text-xs">
                          <span className="font-bold text-[9px] uppercase font-mono text-bali-accent tracking-widest flex items-center gap-1 mb-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-bali-accent" />
                            <span>Respon Thomas Baco (Admin BaliNera)</span>
                          </span>
                          <p className="text-bali-green leading-relaxed">{comp.adminReply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </section>


      {/* 5. INDIVIDUAL INTERACTIVE BOOKING MODAL */}
      {selectedDestForBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bali-green/60 backdrop-blur-sm">
          <div className="bg-bali-sand rounded-xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative border border-bali-green/15 max-h-[90vh] overflow-y-auto">
            
            {/* Close button */}
            <button 
              onClick={handleCloseBookingModal}
              className="absolute top-4 right-4 p-1.5 text-bali-green/40 hover:text-bali-accent hover:bg-bali-green/5 rounded-full cursor-pointer transition"
            >
              <X className="w-4 h-4" />
            </button>

            {!bookingFinished ? (
              <div className="text-left space-y-5">
                <div className="space-y-1">
                  <span className="text-[9px] font-mono font-bold text-bali-accent uppercase tracking-widest block">{selectedDestForBooking.category}</span>
                  <h3 className="font-serif text-2xl font-bold text-bali-green leading-tight">{selectedDestForBooking.name}</h3>
                  <p className="text-xs text-bali-green/60 font-sans">{selectedDestForBooking.location}</p>
                </div>

                <div className="bg-bali-green/5 p-4 rounded-lg border border-bali-green/10 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-bali-green/70">Harga Tiket Masuk</span>
                  <span className="text-lg font-bold text-bali-green">Rp {selectedDestForBooking.price.toLocaleString('id-ID')}</span>
                </div>

                {/* Choose transaction mode */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-bali-green/60 uppercase tracking-widest block">Metode Pembayaran</label>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('Bank Transfer')}
                      className={`py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${selectedPaymentMethod === 'Bank Transfer' ? 'bg-bali-green text-bali-sand border-bali-green shadow' : 'bg-bali-sand text-bali-green/60 border-bali-green/15 hover:bg-bali-green/5'}`}
                    >
                      <Landmark className="w-4 h-4" />
                      <span className="text-[10px]">Transfer</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('QRIS')}
                      className={`py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${selectedPaymentMethod === 'QRIS' ? 'bg-bali-green text-bali-sand border-bali-green shadow' : 'bg-bali-sand text-bali-green/60 border-bali-green/15 hover:bg-bali-green/5'}`}
                    >
                      <QrCode className="w-4 h-4" />
                      <span className="text-[10px]">QRIS Scan</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedPaymentMethod('Cash')}
                      className={`py-3 px-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer border transition-all flex flex-col items-center justify-center gap-1.5 ${selectedPaymentMethod === 'Cash' ? 'bg-bali-green text-bali-sand border-bali-green shadow' : 'bg-bali-sand text-bali-green/60 border-bali-green/15 hover:bg-bali-green/5'}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[10px]">Cash Loket</span>
                    </button>
                  </div>
                </div>

                {/* Payment Detail Presentation - Live configured by Thomas */}
                <div className="bg-bali-gold/5 p-4 rounded-lg border border-bali-gold/30 space-y-3 font-sans text-xs">
                  
                  {selectedPaymentMethod === 'Bank Transfer' && (
                    <div className="space-y-3.5">
                      <p className="font-serif font-bold text-bali-green flex items-center gap-1.5 border-b border-bali-green/5 pb-1">
                        <Landmark className="w-4 h-4 text-bali-accent" />
                        <span>Kanal Transfer Bank Mandiri & Swasta</span>
                      </p>
                      
                      {/* Bank Select Dropdown */}
                      <div className="space-y-1 text-left">
                        <label className="text-[9px] font-bold text-bali-green/50 uppercase tracking-wider block font-sans">
                          Pilih Bank Rekening Penerima:
                        </label>
                        <select 
                          value={selectedBank || paymentSetting.bankName}
                          onChange={(e) => setSelectedBank(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-bali-green/15 focus:border-bali-accent rounded-xl text-xs font-semibold text-bali-green focus:outline-none transition"
                        >
                          <option value={paymentSetting.bankName}>{paymentSetting.bankName} (Sesuai Konfigurasi Default)</option>
                          {paymentSetting.bankName !== 'Bank BCA' && <option value="Bank BCA">Bank BCA (Transfer Instan)</option>}
                          {paymentSetting.bankName !== 'Bank Mandiri' && <option value="Bank Mandiri">Bank Mandiri (Persero)</option>}
                          {paymentSetting.bankName !== 'Bank BNI' && <option value="Bank BNI">Bank BNI (Negara Indonesia)</option>}
                          {paymentSetting.bankName !== 'Bank BRI' && <option value="Bank BRI">Bank BRI (Rakyat Indonesia)</option>}
                          {paymentSetting.bankName !== 'Bank CIMB Niaga' && <option value="Bank CIMB Niaga">Bank CIMB Niaga</option>}
                        </select>
                      </div>

                      {/* Display Selected Bank Details */}
                      <div className="bg-white p-3.5 rounded-xl border border-bali-gold/20 space-y-2 text-[11px] font-mono leading-relaxed">
                        <div className="flex justify-between items-center">
                          <span className="text-bali-green/55">Nama Bank:</span>
                          <span className="font-extrabold text-bali-green">{selectedBank || paymentSetting.bankName}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-bali-green/55">Nomor Rekening:</span>
                          <span className="font-extrabold text-bali-green select-all text-xs tracking-wider">
                            {(() => {
                              const activeB = selectedBank || paymentSetting.bankName;
                              if (activeB === paymentSetting.bankName) {
                                return paymentSetting.accountNumber;
                              }
                              const presets: Record<string, string> = {
                                'Bank BCA': '812-3456-7890',
                                'Bank BNI': '098-765-4321',
                                'Bank BRI': '0012-01-000456-501',
                                'Bank Mandiri': '142-00-19205-291',
                                'Bank CIMB Niaga': '702-89-12345-00'
                              };
                              return presets[activeB] || paymentSetting.accountNumber;
                            })()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-bali-green/55">Atas Nama (A.N):</span>
                          <span className="font-bold text-bali-green text-right">
                            {(() => {
                              const activeB = selectedBank || paymentSetting.bankName;
                              if (activeB === paymentSetting.bankName) {
                                return paymentSetting.accountHolder;
                              }
                              const presetsItems: Record<string, string> = {
                                'Bank BCA': 'Thomas Karlos Baco (PT BaliNera)',
                                'Bank BNI': 'PT BaliNera Dewata Wisata',
                                'Bank BRI': 'Thomas Karlos Baco (PT BaliNera)',
                                'Bank Mandiri': 'Thomas Karlos Baco (PT BaliNera)',
                                'Bank CIMB Niaga': 'PT BaliNera Pariwisata'
                              };
                              return presetsItems[activeB] || paymentSetting.accountHolder;
                            })()}
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-bali-green/65 leading-relaxed italic">*Silakan transfer nominal tiket penuh dan simpan bukti transaksi Anda.</p>
                    </div>
                  )}

                  {selectedPaymentMethod === 'QRIS' && (
                    <div className="space-y-3 text-center flex flex-col items-center">
                      <p className="font-serif font-bold text-bali-green flex items-center gap-1.5 text-left self-start">
                        <QrCode className="w-4 h-4 text-bali-accent" />
                        <span>Pindai Barcode QRIS Resmi BaliNera</span>
                      </p>
                      <img 
                        src={paymentSetting.qrisImageUrl} 
                        alt="QRIS Barcode" 
                        className="w-40 h-40 object-cover rounded mt-1 border border-bali-gold p-1.5 bg-white"
                        referrerPolicy="no-referrer"
                      />
                      <p className="text-[10px] text-bali-green/65 leading-relaxed italic mt-1">*Buka aplikasi perbankan atau dompet digital GoPay/OVO/Dana Anda untuk Scan.</p>
                    </div>
                  )}

                  {selectedPaymentMethod === 'Cash' && (
                    <div className="space-y-2">
                      <p className="font-serif font-bold text-bali-green flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-bali-accent" />
                        <span>Prosedur Bayar Tunai Loket</span>
                      </p>
                      <p className="text-xs text-bali-green/80 leading-relaxed font-sans mt-1">
                        {paymentSetting.cashInstructions}
                      </p>
                    </div>
                  )}

                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConfirmReservation}
                    className="w-full py-4 bg-bali-green hover:bg-bali-accent text-bali-sand font-bold text-xs uppercase tracking-[0.2em] rounded-lg cursor-pointer transition shadow hover:shadow-lg"
                  >
                    Konfirmasi & Amankan Tiket Wisata
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 space-y-5 text-left">
                <div className="w-16 h-16 bg-bali-green/10 rounded-full flex items-center justify-center mx-auto text-bali-green">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <div className="space-y-1 text-center">
                  <h4 className="font-serif text-2xl font-bold text-bali-green">Transaksi Berhasil Direkam!</h4>
                  <p className="text-xs text-bali-green/60">Tiket masuk {selectedDestForBooking.name} aman di tangan Anda.</p>
                </div>

                <div className="bg-bali-green/5 p-5 rounded-lg text-xs font-mono border border-bali-green/10 space-y-2">
                  <div className="flex justify-between border-b border-bali-green/5 pb-1">
                    <span>Kode Registrasi:</span>
                    <span className="font-bold text-bali-green">{currentBookingId}</span>
                  </div>
                  <div className="flex justify-between border-b border-bali-green/5 pb-1">
                    <span>Wisata:</span>
                    <span className="font-bold text-bali-green truncate max-w-[150px]">{selectedDestForBooking.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-bali-green/5 pb-1">
                    <span>Pembayaran:</span>
                    <span className="font-bold text-bali-green">{selectedPaymentMethod}</span>
                  </div>
                  <div className="flex justify-between pt-1 mt-1 font-bold">
                    <span>Status Invoice:</span>
                    <span className="text-bali-accent font-black tracking-wider uppercase">{selectedPaymentMethod === 'Cash' ? 'PENDING' : 'LUNAS'}</span>
                  </div>
                </div>

                <p className="text-[10px] text-bali-green/50 font-mono leading-relaxed max-w-sm mx-auto text-center">
                  Invoice di atas tercatat otomatis di tab "Pemesanan Anda". Tunjukkan nomor registrasi di loket pintu gerbang masuk Bali.
                </p>

                <button
                  type="button"
                  onClick={handleCloseBookingModal}
                  className="w-full py-3 bg-bali-green hover:bg-bali-accent text-bali-sand text-xs font-bold uppercase tracking-widest rounded-lg cursor-pointer"
                >
                  Selesai & Tutup
                </button>
              </div>
            )}

          </div>
        </div>
      )}


      {/* 6. FLOATING LIVE CHAT BOX COMPONENT */}
      <div className="fixed bottom-6 right-6 z-40 font-sans">
        
        {isChatOpen ? (
          /* Real-time live conversation float card */
          <div className="bg-bali-sand rounded-xl w-80 sm:w-96 h-[480px] shadow-2xl border border-bali-green/15 flex flex-col justify-between overflow-hidden animate-scale-up text-left">
            
            {/* Thread header */}
            <div className="bg-bali-green p-4 text-bali-sand flex justify-between items-center relative overflow-hidden shrink-0">
              <div className="absolute top-0 right-0 w-16 h-16 bg-bali-gold/15 rounded-bl-full pointer-events-none"></div>
              <div className="flex items-center space-x-3 relative z-10">
                <span className="text-xl">🌴</span>
                <div className="text-left">
                  <h4 className="font-bold text-xs sm:text-sm"> Thomas Karlos Baco (Admin)</h4>
                  <p className="text-[9px] text-bali-gold tracking-wider flex items-center gap-1 uppercase font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-bali-accent animate-ping"></span>
                    <span>Aktif Melayani Obrolan</span>
                  </p>
                </div>
              </div>

              {/* Close window */}
              <button 
                onClick={() => setIsChatOpen(false)}
                className="p-1 hover:bg-bali-sand/10 rounded-full cursor-pointer text-bali-sand"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Bubble logs scrolling container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-bali-sand">
              <div className="text-center py-1">
                <span className="bg-bali-green/5 text-[9px] text-bali-green/50 font-mono px-2.5 py-1 rounded border border-bali-green/10">Konsultasi Utama BaliNera</span>
              </div>

              {userChats.length === 0 ? (
                <div className="text-center text-[11px] text-bali-green/40 italic py-24 font-mono">
                  Belum ada pesan obrolan. Mari sapa Admin Thomas sekarang.
                </div>
              ) : (
                userChats.map(msg => (
                  <div 
                    key={msg.id} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === 'admin' ? 'mr-auto items-start' : 'ml-auto items-end'}`}
                  >
                    <div className={`p-3 rounded-xl text-xs leading-relaxed shadow-sm ${msg.sender === 'admin' ? 'bg-bali-sand text-bali-green border hover:border-bali-gold/40 border-bali-green/10 rounded-tl-none border-l-4 border-l-bali-gold' : 'bg-bali-green text-bali-sand rounded-tr-none'}`}>
                      {msg.text}
                    </div>
                    
                    <span className="text-[9px] text-bali-green/45 font-mono mt-1">
                      {msg.sender === 'admin' ? 'Thomas (Admin)' : 'Anda'} • {new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
              <div ref={chatBottomRef}></div>
            </div>

            {/* Typing input form */}
            <form onSubmit={handleClientSendChat} className="p-3 border-t border-bali-green/10 bg-bali-sand flex gap-2 shrink-0">
              <input
                type="text"
                placeholder="Ada kendala pariwisata? Tulis..."
                value={chatInputText}
                onChange={e => setChatInputText(e.target.value)}
                className="flex-1 px-3.5 py-2.5 text-xs bg-transparent border-b border-gray-300 focus:border-bali-green focus:outline-none text-bali-green"
                required
              />
              <button
                type="submit"
                className="p-2.5 bg-bali-green hover:bg-bali-accent text-bali-sand rounded-lg cursor-pointer transition flex items-center justify-center self-center shrink-0"
                title="Kirim pesan"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </div>
        ) : (
          /* Floating button */
          <button
            onClick={() => setIsChatOpen(true)}
            className="p-4 bg-bali-green hover:bg-bali-accent text-bali-sand rounded-full shadow-2xl cursor-pointer hover:scale-105 active:scale-95 transition flex items-center justify-center gap-2 group border border-bali-green/20 relative"
            title="Buka Chat Layanan Wisata"
          >
            {/* Micro notification ping */}
            <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-bali-gold rounded-full border-2 border-bali-sand flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-bali-accent rounded-full block animate-ping"></span>
            </span>

            <MessageSquare className="w-6 h-6 animate-pulse-slow" />
            <span className="text-xs font-bold font-sans tracking-wide pr-1 hidden sm:inline uppercase">Tanya Thomas (Admin)</span>
          </button>
        )}

      </div>

    </div>
  );
}
