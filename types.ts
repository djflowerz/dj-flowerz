
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string; // Added for profile editing
  avatarUrl?: string; // Added for profile picture
  role: UserRole;
  subscription?: {
    plan: '1_WEEK' | '1_MONTH' | '3_MONTHS' | '6_MONTHS' | '12_MONTHS';
    expiresAt: string; // ISO Date
  };
  downloads: string[]; // List of IDs downloaded
}

export interface Mixtape {
  id: string;
  title: string;
  genre: string;
  year: string;
  coverUrl: string;
  audioUrl?: string; // For streaming
  videoUrl?: string; // For download
  downloadUrl?: string; // For MP3 download
  embedCode?: string;
  description: string;
  isPublic: boolean;
  createdAt: string;
}

export interface MusicPoolTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  bpm: number;
  key?: string; // e.g., '5A', 'Cm'
  duration?: string; // e.g. '3:45'
  coverUrl: string;
  previewUrl?: string; // For inline player
  downloadUrl: string;
  telegramUrl?: string; // Link to private channel post
  videoUrl?: string;
  createdAt: string;
}

export type ProductType = 'DIGITAL' | 'PHYSICAL';

export type ProductCategory = 
  | 'DJ_SOFTWARE' | 'AUDIO_TOOLS' | 'PRODUCTION_PLUGINS' | 'UTILITIES' 
  | 'DJ_HARDWARE' | 'MERCHANDISE' | 'ACCESSORIES' | 'CABLES';

export interface Product {
  id: string;
  name: string;
  tagline?: string;
  description: string;
  price: number;
  discountPrice?: number;
  
  type: ProductType; // New: Distinguish between Digital and Physical
  category: ProductCategory;
  
  // Media
  coverUrl: string;
  galleryUrls?: string[];
  isFeatured?: boolean;
  status: 'DRAFT' | 'PUBLISHED';
  createdAt: string;

  // Digital Specific
  platforms?: string[];
  fileUrl?: string;
  deliveryPassword?: string;
  requirements?: string;
  version?: string;
  releaseNotes?: string;

  // Physical Specific
  stock?: number;
  shipping?: {
    weight: number; // kg
    dimensions?: string; // LxWxH cm
    cost: number; // Flat rate shipping cost
  };
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'COMPLETED';
  createdAt: string;
  paymentRef: string;
  shippingAddress?: {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    region: string;
  };
}

export interface Tip {
  id: string;
  amount: number;
  message: string;
  senderName: string;
  createdAt: string;
}

// --- TELEGRAM INTEGRATION ---
export interface TelegramBot {
  apiKey: string;
  botName: string;
  status: 'CONNECTED' | 'DISCONNECTED';
  lastActive: string;
}

export type TelegramAccessLevel = 'FREE' | 'ALL_SUBSCRIBERS' | 'VIP_ONLY';

export interface TelegramChannel {
  id: string;
  name: string;
  channelId: string; // e.g., -100123456789
  type: 'PUBLIC' | 'PRIVATE';
  accessLevel: TelegramAccessLevel;
  inviteLink?: string;
}

export interface TelegramPost {
  id: string;
  content: string; // Text/Caption
  mediaUrl?: string;
  targetChannelId: string;
  status: 'SENT' | 'FAILED' | 'SCHEDULED';
  sentAt?: string;
}

// --- BOOKINGS & CONTACT ---
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface BookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  eventType: string; // Wedding, Club, Corporate, etc.
  eventDate: string;
  location: string;
  budget?: string;
  details: string;
  status: 'PENDING' | 'APPROVED' | 'DECLINED';
  createdAt: string;
}

export const ADMIN_EMAIL = 'ianmuriithiflowerz@gmail.com';
