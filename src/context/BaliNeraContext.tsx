import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Destination, Complaint, SocialAccount, PaymentSetting, ChatMessage, SiteInfo, Booking } from '../types';

interface BaliNeraContextType {
  currentUser: User | null;
  users: User[];
  destinations: Destination[];
  complaints: Complaint[];
  socialAccounts: SocialAccount[];
  paymentSetting: PaymentSetting;
  chats: ChatMessage[];
  siteInfo: SiteInfo;
  bookings: Booking[];
  login: (email: string, password: string) => { success: boolean; message: string };
  register: (name: string, email: string, checkPassword: string) => { success: boolean; message: string };
  logout: () => void;
  addDestination: (dest: Omit<Destination, 'id'>) => void;
  updateDestination: (id: string, dest: Partial<Destination>) => void;
  deleteDestination: (id: string) => void;
  updateSiteInfo: (name: string, logo: string, slogan: string) => void;
  toggleUserBlock: (userId: string) => void;
  deleteUser: (userId: string) => void;
  updatePaymentSetting: (settings: PaymentSetting) => void;
  updateSocialAccounts: (accounts: SocialAccount[]) => void;
  submitComplaint: (spotName: string, text: string) => { success: boolean; message: string };
  resolveComplaint: (id: string, reply: string) => void;
  sendChatMessage: (text: string, userIdForAdmin?: string) => void;
  bookDestination: (destId: string, method: Booking['paymentMethod']) => void;
}

const BaliNeraContext = createContext<BaliNeraContextType | undefined>(undefined);

const defaultDestinations: Destination[] = [
  {
    id: 'dest-1',
    name: 'Tanah Lot Temple',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    description: 'Pura Tanah Lot adalah salah satu ikon pariwisata Bali yang terkenal dengan pemandangan pura suci di atas batu karang besar di tengah laut, menawarkan panorama matahari terbenam (sunset) yang spektakuler dan mistis.',
    price: 75000,
    rating: 4.8,
    location: 'Tabanan, Bali',
    category: 'Religi & Budaya',
    facilities: ['Kamera Spot', 'Restoran Tradisional', 'Toko Suvenir', 'Toilet', 'Area Parkir']
  },
  {
    id: 'dest-2',
    name: 'Ubud Sacred Monkey Forest',
    image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=800&q=80',
    description: 'Sebuah cagar alam dan kompleks candi hutan di Ubud yang dihuni oleh ratusan kera ekor panjang (monyet abu-bali). Suasana asri, pepohonan beringin kuno raksasa, dan jembatan naga suci yang menakjubkan.',
    price: 60000,
    rating: 4.7,
    location: 'Gianyar, Ubud',
    category: 'Alam & Hewan',
    facilities: ['Pemandu Lokal', 'Kedai Minuman', 'Art Shop', 'Peta Informasi']
  },
  {
    id: 'dest-3',
    name: 'Uluwatu Cliff Temple & Tari Kecak',
    image: 'https://images.unsplash.com/photo-1518548419070-2c511696d69e?auto=format&fit=crop&w=800&q=80',
    description: 'Pura megah yang bertengger di ujung tebing curam setinggi 70 meter di atas Samudra Hindia. Di tempat ini Anda dapat menyaksikan pertunjukan tari tradisional legendaris Tari Kecak di amfiteater terbuka berlatar belakang matahari tenggelam.',
    price: 120000,
    rating: 4.9,
    location: 'Badung, Kuta Selatan',
    category: 'Seni Budaya',
    facilities: ['Amfiteater Terbuka', 'Pagar Keamanan', 'Kain Kebaya Khas', 'Warung Lokal']
  },
  {
    id: 'dest-4',
    name: 'Tegalalang Rice Terrace',
    image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?auto=format&fit=crop&w=800&q=80',
    description: 'Sawah terasering subak yang sangat indah dengan lanskap hijau menyegarkan mata, ayunan tali raksasa (Bali Swing), kafe pemandangan tebing tepi sawah, dan jalur berjalan kaki yang instagramable.',
    price: 45000,
    rating: 4.6,
    location: 'Tegallalang, Ubud',
    category: 'Alam & Lanskap',
    facilities: ['Bali Swing', 'Kafe Instagramable', 'Pondok Selfie', 'Pemandu Sawah']
  }
];

const defaultSocials: SocialAccount[] = [
  { platform: 'WhatsApp', url: 'https://wa.me/628123456789', icon: 'Phone' },
  { platform: 'Instagram', url: 'https://instagram.com/balinera_travel', icon: 'Instagram' },
  { platform: 'TikTok', url: 'https://tiktok.com/@balinera', icon: 'Video' },
  { platform: 'Facebook', url: 'https://facebook.com/balinera.pariwisata', icon: 'Facebook' }
];

const defaultPayment: PaymentSetting = {
  bankName: 'Bank Mandiri',
  accountNumber: '142-00-19205-291',
  accountHolder: 'Thomas Karlos Baco (PT BaliNera Bali)',
  qrisImageUrl: 'https://picsum.photos/seed/qrisbalinera/300/300',
  cashInstructions: 'Pembayaran tunai dapat dilakukan langsung di pusat informasi pariwisata kantor BaliNera di Jl. Sunset Road No. 99, Kuta, Bali dengan menunjukkan kode transaksi pemesanan Anda.'
};

const defaultComplaints: Complaint[] = [
  {
    id: 'comp-1',
    userId: 'user-2',
    userName: 'Kadek Sastrawan',
    userEmail: 'kadek@gmail.com',
    complaintText: 'Pagar pengaman di area tebing Uluwatu dekat teater Kecak agak bergoyang, mohon dilakukan perbaikan demi keselamatan pengunjung menjelang malam hari.',
    spotName: 'Uluwatu Cliff Temple & Tari Kecak',
    createdAt: '2026-05-20T10:00:00Z',
    status: 'Pending'
  },
  {
    id: 'comp-2',
    userId: 'user-3',
    userName: 'Luh Putu Astuti',
    userEmail: 'putu@gmail.com',
    complaintText: 'Air bersih di toilet Pura Tanah Lot bagian bawah sempat mati sekitar pukul 3 sore kemarin. Terpaksa antre cukup lama.',
    spotName: 'Tanah Lot Temple',
    createdAt: '2026-05-19T14:20:00Z',
    status: 'Selesai',
    adminReply: 'Terima kasih atas masukannya Luh Putu Astuti. Tim lapangan kami telah berkoordinasi dengan pengelola kawasan suci Tanah Lot, mesin pompa air cadangan sudah selesai diinstal mandiri untuk mencegah kendala terulang kembali.'
  }
];

const defaultChats: ChatMessage[] = [
  {
    id: 'chat-1',
    sender: 'admin',
    userId: 'user-2',
    userName: 'Kadek Sastrawan',
    text: 'Halo Kadek! Selamat datang di layanan Live Chat BaliNera. Ada yang bisa kami bantu seputar destinasi pariwisata Bali hari ini?',
    timestamp: '2026-05-20T09:45:00Z'
  },
  {
    id: 'chat-2',
    sender: 'user',
    userId: 'user-2',
    userName: 'Kadek Sastrawan',
    text: 'Saya ingin bertanya tentang tiket masuk Uluwatu, apakah anak berusia dibawah 3 tahun dikenakan biaya tiket penuh?',
    timestamp: '2026-05-20T09:47:00Z'
  },
  {
    id: 'chat-3',
    sender: 'admin',
    userId: 'user-2',
    userName: 'Kadek Sastrawan',
    text: 'Untuk anak di bawah usia 3 tahun gratis, Kadek! Cukup membayar tiket untuk orang dewasa saja.',
    timestamp: '2026-05-20T09:49:00Z'
  }
];

export const BaliNeraProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load initial data from localStorage or use defaults
  const [users, setUsers] = useState<User[]>(() => {
    const stored = localStorage.getItem('balinera_users');
    if (stored) return JSON.parse(stored);
    
    // Default administrators and preliminary mock users
    return [
      {
        id: 'admin-1',
        name: 'Thomas Karlos Baco',
        email: 'thomaskarlosbaco@gmail.com',
        password: '291205', // Admin password
        isBlocked: false,
        registeredAt: '2026-05-15T08:00:00Z',
        role: 'admin'
      },
      {
        id: 'user-2',
        name: 'Kadek Sastrawan',
        email: 'kadek@gmail.com',
        password: 'user123',
        isBlocked: false,
        registeredAt: '2026-05-17T09:12:00Z',
        role: 'user'
      },
      {
        id: 'user-3',
        name: 'Luh Putu Astuti',
        email: 'putu@gmail.com',
        password: 'user123',
        isBlocked: false,
        registeredAt: '2026-05-18T14:45:00Z',
        role: 'user'
      }
    ];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('balinera_current_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [destinations, setDestinations] = useState<Destination[]>(() => {
    const stored = localStorage.getItem('balinera_destinations');
    return stored ? JSON.parse(stored) : defaultDestinations;
  });

  const [siteInfo, setSiteInfo] = useState<SiteInfo>(() => {
    const stored = localStorage.getItem('balinera_site_info');
    return stored ? JSON.parse(stored) : {
      name: 'BaliNera',
      logo: '🌴 BaliNera',
      slogan: 'Layanan Eksplorasi & Reservasi Surga Wisata Dewata'
    };
  });

  const [paymentSetting, setPaymentSetting] = useState<PaymentSetting>(() => {
    const stored = localStorage.getItem('balinera_payment_setting');
    return stored ? JSON.parse(stored) : defaultPayment;
  });

  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>(() => {
    const stored = localStorage.getItem('balinera_social_accounts');
    return stored ? JSON.parse(stored) : defaultSocials;
  });

  const [complaints, setComplaints] = useState<Complaint[]>(() => {
    const stored = localStorage.getItem('balinera_complaints');
    return stored ? JSON.parse(stored) : defaultComplaints;
  });

  const [chats, setChats] = useState<ChatMessage[]>(() => {
    const stored = localStorage.getItem('balinera_chats');
    return stored ? JSON.parse(stored) : defaultChats;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const stored = localStorage.getItem('balinera_bookings');
    return stored ? JSON.parse(stored) : [
      {
        id: 'book-1',
        userId: 'user-2',
        userName: 'Kadek Sastrawan',
        destinationId: 'dest-3',
        destinationName: 'Uluwatu Cliff Temple & Tari Kecak',
        price: 120000,
        bookingDate: '2026-05-20',
        status: 'Lunas',
        paymentMethod: 'QRIS'
      }
    ];
  });

  // Sync back to localStorage
  useEffect(() => {
    localStorage.setItem('balinera_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('balinera_current_user', currentUser ? JSON.stringify(currentUser) : '');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('balinera_destinations', JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem('balinera_site_info', JSON.stringify(siteInfo));
  }, [siteInfo]);

  useEffect(() => {
    localStorage.setItem('balinera_payment_setting', JSON.stringify(paymentSetting));
  }, [paymentSetting]);

  useEffect(() => {
    localStorage.setItem('balinera_social_accounts', JSON.stringify(socialAccounts));
  }, [socialAccounts]);

  useEffect(() => {
    localStorage.setItem('balinera_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('balinera_chats', JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem('balinera_bookings', JSON.stringify(bookings));
  }, [bookings]);


  // Actions
  const login = (email: string, password: string) => {
    const userMatched = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!userMatched) {
      return { success: false, message: 'Alamat Email tidak terdaftar dalam sistem BaliNera.' };
    }

    if (userMatched.password !== password) {
      return { success: false, message: 'Kata Sandi yang Anda masukkan salah.' };
    }

    if (userMatched.isBlocked) {
      return { success: false, message: 'Akun Anda dideaktivasi/diblokir oleh Administrator. Hubungi thomaskarlosbaco@gmail.com.' };
    }

    setCurrentUser(userMatched);
    return { success: true, message: `Selamat datang kembali, ${userMatched.name}!` };
  };

  const register = (name: string, email: string, psw: string) => {
    const trimmedEmail = email.trim().toLowerCase();
    
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'Email sudah terdaftar. Silakan gunakan kredensial lain atau login.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email: trimmedEmail,
      password: psw,
      isBlocked: false,
      registeredAt: new Date().toISOString(),
      role: 'user'
    };

    setUsers(prev => [...prev, newUser]);
    // Auto-login new user
    setCurrentUser(newUser);
    return { success: true, message: 'Pendaftaran Akun BaliNera Berhasil!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // 1. Wisata
  const addDestination = (newDest: Omit<Destination, 'id'>) => {
    const dest: Destination = {
      ...newDest,
      id: `dest-${Date.now()}`
    };
    setDestinations(prev => [...prev, dest]);
  };

  const updateDestination = (id: string, updated: Partial<Destination>) => {
    setDestinations(prev => prev.map(d => d.id === id ? { ...d, ...updated } : d));
  };

  const deleteDestination = (id: string) => {
    setDestinations(prev => prev.filter(d => d.id !== id));
  };

  // 2. Logo & Name
  const updateSiteInfo = (name: string, logo: string, slogan: string) => {
    setSiteInfo({ name, logo, slogan });
  };

  // 3. Manage Users
  const toggleUserBlock = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        // Prevent blocking admin
        if (u.role === 'admin') return u;
        const newStatus = !u.isBlocked;
        
        // If the user being blocked is currently logged in, force logout if we block them
        if (newStatus && currentUser?.id === userId) {
          setTimeout(() => setCurrentUser(null), 100);
        }
        
        return { ...u, isBlocked: newStatus };
      }
      return u;
    }));
  };

  const deleteUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target?.role === 'admin') return; // Cannot delete admin

    setUsers(prev => prev.filter(u => u.id !== userId));
    if (currentUser?.id === userId) {
      setCurrentUser(null);
    }
  };

  // 4. Manage Payments (No Rekening, QRIS, Cash)
  const updatePaymentSetting = (newSettings: PaymentSetting) => {
    setPaymentSetting(newSettings);
  };

  // 5. Social Media accounts
  const updateSocialAccounts = (newAccounts: SocialAccount[]) => {
    setSocialAccounts(newAccounts);
  };

  // 6. User complaints
  const submitComplaint = (spotName: string, text: string) => {
    if (!currentUser) {
      return { success: false, message: 'Anda harus masuk untuk mengirimkan keluhan.' };
    }

    const newComplaint: Complaint = {
      id: `comp-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      complaintText: text,
      spotName: spotName || 'Layanan Umum Wisata Bali',
      createdAt: new Date().toISOString(),
      status: 'Pending'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    return { success: true, message: 'Aduan keluhan berhasil terekam di sistem kami. Tim BaliNera akan segera merespon!' };
  };

  const resolveComplaint = (id: string, reply: string) => {
    setComplaints(prev => prev.map(c => 
      c.id === id ? { ...c, status: 'Selesai', adminReply: reply } : c
    ));
  };

  // 7. Live chat with user
  const sendChatMessage = (text: string, userIdForAdmin?: string) => {
    if (!currentUser) return;

    // If sender is user, the conversation is between them and the admin.
    // If sender is admin, they specify who they are replying to in 'userIdForAdmin'.
    const isSenderAdmin = currentUser.role === 'admin';
    const activeUserId = isSenderAdmin ? (userIdForAdmin || '') : currentUser.id;
    const activeUserName = isSenderAdmin 
      ? (users.find(u => u.id === activeUserId)?.name || 'Pelanggan')
      : currentUser.name;

    if (!activeUserId) return;

    const newMessage: ChatMessage = {
      id: `chat-${Date.now()}`,
      sender: isSenderAdmin ? 'admin' : 'user',
      userId: activeUserId,
      userName: activeUserName,
      text,
      timestamp: new Date().toISOString()
    };

    setChats(prev => [...prev, newMessage]);

    // Fast simulation: if user sends message, after 1.5 seconds, let admin send a quick autoacknowledgement if the admin offline reply simulation runs.
    if (!isSenderAdmin) {
      setTimeout(() => {
        setChats(prev => {
          // Check if there's already an admin response or just send automated premium greeting
          const systemGreetings = [
            `Terima kasih sudah menghubungi kami! Thomas (Admin BaliNera) sedang membaca pesan anda. Harap ditunggu sebentar.`,
            `Layanan BaliNera bersedia membantu Anda 24 jam. Kami telah meneruskan chat Anda ke Admin.`,
            `Pertanyaan Anda terkait pariwisata Bali sangat berharga bagi kami. Admin akan segera membalas di sini.`
          ];
          const randomGreet = systemGreetings[Math.floor(Math.random() * systemGreetings.length)];
          
          const autoReply: ChatMessage = {
            id: `chat-auto-${Date.now()}`,
            sender: 'admin',
            userId: activeUserId,
            userName: activeUserName,
            text: randomGreet,
            timestamp: new Date().toISOString()
          };
          return [...prev, autoReply];
        });
      }, 1500);
    }
  };

  // Book spot
  const bookDestination = (destId: string, method: Booking['paymentMethod']) => {
    if (!currentUser) return;
    const dest = destinations.find(d => d.id === destId);
    if (!dest) return;

    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      destinationId: destId,
      destinationName: dest.name,
      price: dest.price,
      bookingDate: new Date().toLocaleDateString('id-ID'),
      status: method === 'Cash' ? 'Pending' : 'Lunas', // Cash needs local verification, others count as immediate payment in simulation
      paymentMethod: method
    };

    setBookings(prev => [newBooking, ...prev]);
  };

  return (
    <BaliNeraContext.Provider value={{
      currentUser,
      users,
      destinations,
      complaints,
      socialAccounts,
      paymentSetting,
      chats,
      siteInfo,
      bookings,
      login,
      register,
      logout,
      addDestination,
      updateDestination,
      deleteDestination,
      updateSiteInfo,
      toggleUserBlock,
      deleteUser,
      updatePaymentSetting,
      updateSocialAccounts,
      submitComplaint,
      resolveComplaint,
      sendChatMessage,
      bookDestination
    }}>
      {children}
    </BaliNeraContext.Provider>
  );
};

export const useBaliNera = () => {
  const context = useContext(BaliNeraContext);
  if (context === undefined) {
    throw new Error('useBaliNera must be used within a BaliNeraProvider');
  }
  return context;
};
