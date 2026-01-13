
import { User, Mixtape, MusicPoolTrack, Product, Order, Tip, TelegramBot, TelegramChannel, TelegramPost, ContactMessage, BookingRequest } from '../types';

// --- CONFIGURATION ---
// Single source of truth for Project ID and Base URL
export const API_BASE_URL = 'https://3cfrtvt6.us-west.insforge.app';
export const PROJECT_ID = 'ik_bbd06f551be2c3e1ddd1cdff804eb445';
export const PAYSTACK_PUBLIC_KEY = 'pk_live_2ed6a5c46ebab203998efd1f5d9c22d2dcc05f71';
export const TELEGRAM_BOT_TOKEN = '8365916391:AAEwo4gilymOwkb_OaF2kD39OhyKVvnSGFU';

// --- CLIENT INITIALIZATION ---
import { createClient } from '@insforge/sdk';

export const client = createClient(PROJECT_ID, {
    baseUrl: API_BASE_URL,
    apiKey: PROJECT_ID
});

// --- AUTH STATE MANAGEMENT ---
export const setAuthToken = (token: string) => {
    // We can manually set the session on the client if needed, 
    // but typically the Provider handles this. 
    console.log('setAuthToken', token);
};

/**
 * Check if a user has admin access
 * @param userEmail - The email address to check
 * @returns boolean - true if email matches ADMIN_EMAIL
 */
export const checkAdminAccess = (userEmail: string | null | undefined): boolean => {
    const ADMIN_EMAIL = 'ianmuriithiflowerz@gmail.com';

    if (!userEmail) {
        console.log("No user email provided");
        return false;
    }

    if (userEmail === ADMIN_EMAIL) {
        console.log("✅ Admin access granted for:", userEmail);
        return true;
    } else {
        console.warn("⚠️ Access denied: User is not the authorized admin.");
        console.warn("   Current user:", userEmail);
        console.warn("   Required admin:", ADMIN_EMAIL);
        return false;
    }
};

// --- STORAGE SERVICE ---
export const storage = {
    async upload(file: File): Promise<string> {
        try {
            // Use the SDK's auto-upload with 'default' bucket
            const res = await client.storage.from('default').uploadAuto(file);
            if (res.error) throw res.error;

            if (res.data) {
                // @ts-ignore - assuming $id or key is present
                const fileId = res.data.key || res.data.$id || res.data.id;
                // @ts-ignore
                return client.storage.from('default').getPublicUrl(fileId);
            }
            throw new Error("Upload failed, no data");
        } catch (error) {
            console.error("SDK Upload Failed:", error);
            throw error;
        }
    }
};

/**
 * Upload a file to storage and return both the path and public URL
 * @param file - The file to upload
 * @param folder - The folder/prefix for organization (e.g., 'products', 'covers')
 * @returns Object with filePath and publicUrl
 */
export const uploadFile = async (file: File, folder: string): Promise<{ filePath: string; publicUrl: string }> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await client.storage
        .from('default')
        .upload(filePath, file);

    if (error) throw error;

    // Get the public URL for immediate preview
    const publicUrl = client.storage
        .from('default')
        .getPublicUrl(filePath);

    return {
        filePath,
        publicUrl: typeof publicUrl === 'string' ? publicUrl : String(publicUrl)
    };
};

/**
 * Delete a file from storage
 * @param path - The file path to delete
 */
export const deleteFile = async (path: string): Promise<void> => {
    const { error } = await client.storage
        .from('default')
        .remove(path);
    if (error) throw error;
};

// --- DATABASE OPERATIONS ---

// Helper to handle SDK response
const handleSDK = async <T>(promise: any, fallback: T | null = null): Promise<T> => {
    try {
        const { data, error } = await promise;
        if (error) {
            console.error("SDK Error:", error);
            throw new Error(error.message || "Database Error");
        }
        return (data as T) || (fallback as T)!;
    } catch (e) {
        console.error("SDK Request Failed:", e);
        if (fallback !== null) return fallback;
        throw e;
    }
};

export const db = {
    // User Data
    async getMe(): Promise<User> {
        // SDK update: use getSession() via cast to bypass strict typing if definitions are outdated
        // As per 2026 SDK update instructions
        const { data } = await (client.auth as any).getSession();
        const user = data?.session?.user || data?.user;
        if (!user) throw new Error('Not authenticated');

        // Fetch extended profile if needed
        let profile = {};
        try {
            const { data: profileData } = await client.database.from('users').select('*').eq('id', user.id).single();
            if (profileData) profile = profileData;
        } catch (e) {
            // User might be new and not have a row yet
        }

        return {
            id: user.id,
            email: user.email || '',
            name: user.name || '',
            // @ts-ignore - checking prefs/metadata from the user object if available
            role: (user as any).prefs?.role || 'USER',
            // @ts-ignore
            avatarUrl: (user as any).prefs?.avatarUrl,
            // @ts-ignore
            subscription: (user as any).prefs?.subscription,
            ...profile // Merge with database profile
        } as unknown as User;
    },

    async updateProfile(userId: string, updates: { name?: string, phone?: string, avatarUrl?: string }) {
        // Update auth user state
        const { data, error } = await client.auth.setProfile(updates);
        if (error) throw error;

        // Also update users table for persistence if needed
        try {
            const { error: dbError } = await client.database.from('users').update(updates).eq('id', userId);
            // If update fails (e.g. row doesn't exist), try insert
            if (dbError) {
                await client.database.from('users').insert({ id: userId, ...updates });
            }
        } catch (e) {
            console.warn("DB profile sync warning", e);
        }
        return data as any;
    },

    async updateUserSubscription(userId: string, plan: User['subscription']['plan']) {
        const subscriptionData = {
            subscription_plan: plan,
            subscription_status: 'ACTIVE',
            subscription_valid_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
        return client.database.from('users').update(subscriptionData).eq('id', userId);
    },

    async updateUserSubscriptionByEmail(email: string, subscriptionData: {
        subscription_status?: string;
        subscription_code?: string;
        plan_code?: string;
        subscription_valid_until?: string;
        last_payment_date?: string;
        will_renew?: boolean;
    }) {
        return client.database.from('users').update(subscriptionData).eq('email', email);
    },

    async checkSubscriptionAccess(userId: string): Promise<boolean> {
        try {
            const { data } = await client.database.from('users').select('subscription_status, subscription_valid_until').eq('id', userId).single();
            if (!data) return false;

            const isActive = data.subscription_status === 'active';
            const validUntil = data.subscription_valid_until ? new Date(data.subscription_valid_until) : null;
            const isValid = validUntil ? validUntil > new Date() : false;

            return isActive && isValid;
        } catch (error) {
            console.error('Failed to check subscription access:', error);
            return false;
        }
    },

    // Mixtapes
    async getMixtapes(): Promise<Mixtape[]> {
        return handleSDK(client.database.from('mixtapes').select('*').order('createdAt', { ascending: false }), []);
    },
    async saveMixtape(mixtape: Mixtape) {
        if (mixtape.id) {
            const exists = await client.database.from('mixtapes').select('id').eq('id', mixtape.id).single();
            if (exists.data) return client.database.from('mixtapes').update(mixtape).eq('id', mixtape.id);
        }
        return client.database.from('mixtapes').insert(mixtape);
    },
    async deleteMixtape(id: string) { return client.database.from('mixtapes').delete().eq('id', id); },

    // Music Pool
    async getPoolTracks(): Promise<MusicPoolTrack[]> {
        return handleSDK(client.database.from('pool_tracks').select('*').order('createdAt', { ascending: false }), []);
    },
    async savePoolTrack(track: MusicPoolTrack) {
        if (track.id) {
            const exists = await client.database.from('pool_tracks').select('id').eq('id', track.id).single();
            if (exists.data) return client.database.from('pool_tracks').update(track).eq('id', track.id);
        }
        return client.database.from('pool_tracks').insert(track);
    },
    async deletePoolTrack(id: string) { return client.database.from('pool_tracks').delete().eq('id', id); },

    // Products
    async getProducts(): Promise<Product[]> {
        return handleSDK(client.database.from('products').select('*').order('createdAt', { ascending: false }), []);
    },
    async saveProduct(product: Product) {
        if (product.id) {
            const exists = await client.database.from('products').select('id').eq('id', product.id).single();
            if (exists.data) return client.database.from('products').update(product).eq('id', product.id);
        }
        return client.database.from('products').insert(product);
    },
    async deleteProduct(id: string) { return client.database.from('products').delete().eq('id', id); },

    // Orders
    async createOrder(order: Partial<Order> & { productId?: string; customerEmail?: string; planCode?: string }) {
        const orderData = {
            ...order,
            product_id: order.productId,
            customer_email: order.customerEmail,
            plan_code: order.planCode,
            createdAt: new Date().toISOString()
        };
        return client.database.from('orders').insert(orderData);
    },
    async getOrders(): Promise<Order[]> {
        return handleSDK(client.database.from('orders').select('*').order('createdAt', { ascending: false }), []);
    },
    async updateOrderStatus(reference: string, status: string) {
        return client.database.from('orders').update({ status }).eq('reference', reference);
    },

    // Tips
    async sendTip(tip: Tip) { return client.database.from('tips').insert(tip); },
    async getTips(): Promise<Tip[]> { return handleSDK(client.database.from('tips').select('*'), []); },

    // Newsletter
    async subscribeNewsletter(email: string) { return client.database.from('newsletter').insert({ email, createdAt: new Date().toISOString() }); },
    async getNewsletterEmails(): Promise<string[]> {
        const { data } = await client.database.from('newsletter').select('email');
        return data?.map((s: any) => s.email) || [];
    },
    async sendNewsletterBroadcast(subject: string, content: string): Promise<number> {
        await client.database.from('broadcasts').insert({ subject, content, status: 'PENDING' });
        return 1;
    },

    // Users (Admin)
    async getUsers(): Promise<User[]> {
        return handleSDK(client.database.from('users').select('*'), []);
    },
    async saveUser(user: User) {
        if (user.id) {
            const check = await client.database.from('users').select('id').eq('id', user.id).single();
            if (check.data) return client.database.from('users').update(user).eq('id', user.id);
        }
        return client.database.from('users').insert(user);
    },
    async deleteUser(id: string) { return client.database.from('users').delete().eq('id', id); },

    // Telegram
    async getTelegramBot(): Promise<TelegramBot | null> {
        const { data } = await client.database.from('telegram_bot').select('*').single();
        return data as TelegramBot | null;
    },
    async saveTelegramBot(bot: TelegramBot) {
        const { data } = await client.database.from('telegram_bot').select('id').single();
        if (data) {
            return client.database.from('telegram_bot').update(bot).eq('id', data.id);
        }
        return client.database.from('telegram_bot').insert(bot);
    },
    async getTelegramChannels(): Promise<TelegramChannel[]> { return handleSDK(client.database.from('telegram_channels').select('*'), []); },
    async saveTelegramChannel(channel: TelegramChannel) {
        if (channel.id) {
            const check = await client.database.from('telegram_channels').select('id').eq('id', channel.id).single();
            if (check.data) return client.database.from('telegram_channels').update(channel).eq('id', channel.id);
        }
        return client.database.from('telegram_channels').insert(channel);
    },
    async deleteTelegramChannel(id: string) { return client.database.from('telegram_channels').delete().eq('id', id); },
    async getTelegramPosts(): Promise<TelegramPost[]> { return handleSDK(client.database.from('telegram_posts').select('*'), []); },
    async sendTelegramPost(post: TelegramPost) { return client.database.from('telegram_posts').insert(post); },
    async generateTelegramInviteLink(channelId: string): Promise<string> {
        throw new Error("Backend function required for link generation");
    },

    // Contact & Bookings
    async sendContactMessage(msg: ContactMessage) { return client.database.from('messages').insert(msg); },
    async getContactMessages(): Promise<ContactMessage[]> { return handleSDK(client.database.from('messages').select('*').order('createdAt', { ascending: false }), []); },
    async markMessageRead(id: string) { return client.database.from('messages').update({ read: true }).eq('id', id); },

    async sendBookingRequest(req: BookingRequest) { return client.database.from('bookings').insert(req); },
    async getBookingRequests(): Promise<BookingRequest[]> { return handleSDK(client.database.from('bookings').select('*').order('createdAt', { ascending: false }), []); },
    async updateBookingStatus(id: string, status: BookingRequest['status']) {
        return client.database.from('bookings').update({ status }).eq('id', id);
    }
};
