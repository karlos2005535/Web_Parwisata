export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  isBlocked: boolean;
  registeredAt: string;
  role: 'user' | 'admin';
}

export interface Destination {
  id: string;
  name: string;
  image: string;
  description: string;
  price: number;
  rating: number;
  location: string;
  category: string;
  facilities: string[];
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  complaintText: string;
  spotName: string;
  createdAt: string;
  status: 'Pending' | 'Selesai';
  adminReply?: string;
}

export interface SocialAccount {
  platform: string;
  url: string;
  icon: string;
}

export interface PaymentSetting {
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  qrisImageUrl: string;
  cashInstructions: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  userId: string;
  userName: string;
  text: string;
  timestamp: string;
}

export interface SiteInfo {
  name: string;
  logo: string;
  slogan: string;
}

export interface Booking {
  id: string;
  userId: string;
  userName: string;
  destinationId: string;
  destinationName: string;
  price: number;
  bookingDate: string;
  status: 'Pending' | 'Lunas';
  paymentMethod: 'Bank Transfer' | 'QRIS' | 'Cash';
}
