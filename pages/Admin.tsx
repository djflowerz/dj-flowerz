
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, storage, TELEGRAM_BOT_TOKEN } from '../services/insforge';
import { User, Mixtape, Product, Order, MusicPoolTrack, ADMIN_EMAIL, TelegramBot, TelegramChannel, TelegramPost, ProductType, ProductCategory, TelegramAccessLevel, ContactMessage, BookingRequest } from '../types';
import { Button, Input, Label, GlassCard, Badge } from '../components/UI';
import { LayoutDashboard, Music, ShoppingBag, Users, Mail, Trash, Upload, DollarSign, Package, Loader2, Link as LinkIcon, Lock, Send, Settings, MessageSquare, AlertTriangle, CreditCard, FileText, UserCircle } from 'lucide-react';
import { useAppUser } from '../App';
import { UserManager } from '../components/admin/UserManager';
import { StockLevels } from '../components/admin/StockLevels';
import { InvoiceManager } from '../components/admin/InvoiceManager';
import { LipamdogoManager } from '../components/admin/LipamdogoManager';
import { BlogManager } from '../components/admin/BlogManager';

type AdminTab = 'dashboard' | 'users' | 'customers' | 'stock' | 'orders' | 'lipamdogo' | 'invoices' | 'products' | 'mixtapes' | 'music_pool' | 'telegram' | 'inbox' | 'newsletter' | 'blog' | 'links';

const TabButton: React.FC<{ active: boolean, onClick: () => void, icon: any, label: string }> = ({ active, onClick, icon: Icon, label }) => (
    <button
        onClick={onClick}
        className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-all duration-300 relative overflow-hidden group outline-none focus:ring-2 focus:ring-flowerz-purple/50 ${active
            ? 'bg-flowerz-purple text-white shadow-lg shadow-flowerz-purple/20'
            : 'text-gray-400 hover:bg-white/5 hover:text-white'
            }`}
    >
        <Icon className={`w-5 h-5 transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />
        <span className="font-medium tracking-wide">{label}</span>
    </button>
);

const TelegramManager = () => {
    const [bot, setBot] = useState<TelegramBot | null>(null);
    const [channels, setChannels] = useState<TelegramChannel[]>([]);
    const [posts, setPosts] = useState<TelegramPost[]>([]);
    const [users, setUsers] = useState<User[]>([]);

    // Pre-fill with the real token provided
    const [botKey, setBotKey] = useState(TELEGRAM_BOT_TOKEN);
    const [channelForm, setChannelForm] = useState<Partial<TelegramChannel>>({ type: 'PUBLIC', accessLevel: 'FREE' });
    const [broadcastForm, setBroadcastForm] = useState<Partial<TelegramPost>>({});
    const [broadcastLoading, setBroadcastLoading] = useState(false);

    useEffect(() => { loadData(); }, []);

    const loadData = () => {
        db.getTelegramBot().then(setBot);
        db.getTelegramChannels().then(setChannels);
        db.getTelegramPosts().then(setPosts);
        db.getUsers().then(u => setUsers(u.filter(x => x.subscription)));
    };

    const connectBot = async (e: React.FormEvent) => {
        e.preventDefault();
        const newBot: TelegramBot = {
            apiKey: botKey,
            botName: 'DJFlowerz_Bot',
            status: 'CONNECTED',
            lastActive: new Date().toISOString()
        };
        await db.saveTelegramBot(newBot);
        setBot(newBot);
        alert('Bot Connected Successfully!');
    };

    const disconnectBot = async () => {
        if (bot) {
            await db.saveTelegramBot({ ...bot, status: 'DISCONNECTED' });
            loadData();
        }
    }

    const saveChannel = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newChannel: TelegramChannel = {
                id: channelForm.id || crypto.randomUUID(),
                name: channelForm.name || '',
                channelId: channelForm.channelId || '',
                type: channelForm.type || 'PUBLIC',
                accessLevel: channelForm.accessLevel || 'FREE',
                inviteLink: channelForm.inviteLink
            };
            await db.saveTelegramChannel(newChannel);
            setChannelForm({ type: 'PUBLIC', accessLevel: 'FREE' });
            loadData();
            alert('Channel saved.');
        } catch (e) { alert('Failed to save channel'); }
    };

    const deleteChannel = async (id: string) => {
        if (confirm('Remove this channel?')) {
            await db.deleteTelegramChannel(id);
            loadData();
        }
    };

    const generateLink = async (channel: TelegramChannel) => {
        try {
            const link = await db.generateTelegramInviteLink(channel.channelId);
            prompt(`Single-use Invite Link generated for ${channel.name}:`, link);
        } catch (error) {
            alert('Failed to generate link. Ensure bot is admin in channel.');
        }
    };

    const handleBroadcastMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setBroadcastLoading(true);
            try {
                const url = await storage.upload(e.target.files[0]);
                setBroadcastForm(prev => ({ ...prev, mediaUrl: url }));
            } catch (e) { alert('Upload failed'); }
            setBroadcastLoading(false);
        }
    };

    const sendBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!broadcastForm.targetChannelId || !broadcastForm.content) {
            alert('Please select a channel and enter a message.');
            return;
        }

        setBroadcastLoading(true);
        try {
            const post: TelegramPost = {
                id: crypto.randomUUID(),
                content: broadcastForm.content,
                mediaUrl: broadcastForm.mediaUrl,
                targetChannelId: broadcastForm.targetChannelId,
                status: 'SCHEDULED'
            };
            await db.sendTelegramPost(post);
            alert('Message Sent!');
            setBroadcastForm({});
            loadData();
        } catch (err) {
            alert('Failed to send message. Check bot logs.');
        } finally {
            setBroadcastLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <GlassCard>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold flex items-center gap-2"><Settings className="w-5 h-5" /> Bot Configuration</h3>
                    {bot?.status === 'CONNECTED' ? (<Badge color="green">Connected</Badge>) : (<Badge color="red">Disconnected</Badge>)}
                </div>

                {bot?.status === 'CONNECTED' ? (
                    <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                        <div>
                            <p className="font-bold text-lg">{bot.botName}</p>
                            <p className="text-xs text-gray-400 font-mono">API: •••••••••••••</p>
                            <p className="text-xs text-gray-400">Last Active: {new Date(bot.lastActive).toLocaleString()}</p>
                        </div>
                        <Button variant="outline" size="sm" onClick={disconnectBot} className="text-red-400 border-red-500/30 hover:bg-red-500/10">Disconnect</Button>
                    </div>
                ) : (
                    <form onSubmit={connectBot} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <Label>Bot API Key</Label>
                            <Input value={botKey} onChange={e => setBotKey(e.target.value)} placeholder="123456:ABC-DEF..." required />
                        </div>
                        <Button type="submit">Connect Bot</Button>
                    </form>
                )}
            </GlassCard>
            <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                    <GlassCard>
                        <h3 className="text-xl font-bold mb-4">Channels</h3>
                        <form onSubmit={saveChannel} className="space-y-4 mb-6 border-b border-white/10 pb-6">
                            <Input placeholder="Channel Name" value={channelForm.name || ''} onChange={e => setChannelForm({ ...channelForm, name: e.target.value })} required />
                            <Input placeholder="Channel ID (e.g. -100...)" value={channelForm.channelId || ''} onChange={e => setChannelForm({ ...channelForm, channelId: e.target.value })} required />
                            <div className="flex gap-2">
                                <select className="bg-black/40 border border-white/10 rounded px-3 py-2 text-white" value={channelForm.accessLevel} onChange={e => setChannelForm({ ...channelForm, accessLevel: e.target.value as any })}>
                                    <option value="FREE">Free</option>
                                    <option value="ALL_SUBSCRIBERS">All Subscribers</option>
                                    <option value="VIP_ONLY">VIP Only</option>
                                </select>
                                <Button type="submit" size="sm">Add Channel</Button>
                            </div>
                        </form>
                        <div className="space-y-2">
                            {channels.map(c => (
                                <div key={c.id} className="bg-white/5 p-3 rounded flex justify-between items-center">
                                    <div>
                                        <div className="font-bold">{c.name}</div>
                                        <div className="text-xs text-gray-500">{c.accessLevel}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => generateLink(c)}><LinkIcon className="w-4 h-4" /></Button>
                                        <Button size="sm" variant="ghost" onClick={() => deleteChannel(c.id)} className="text-red-400"><Trash className="w-4 h-4" /></Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>

                <div className="space-y-8">
                    <GlassCard>
                        <h3 className="text-xl font-bold mb-4">Broadcast</h3>
                        <form onSubmit={sendBroadcast} className="space-y-4">
                            <div>
                                <Label>Target Channel</Label>
                                <select className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white" value={broadcastForm.targetChannelId || ''} onChange={e => setBroadcastForm({ ...broadcastForm, targetChannelId: e.target.value })}>
                                    <option value="">Select Channel...</option>
                                    {channels.map(c => <option key={c.id} value={c.channelId}>{c.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <Label>Message</Label>
                                <textarea className="w-full bg-black/40 border border-white/10 rounded px-4 py-2 text-white min-h-[100px]" value={broadcastForm.content || ''} onChange={e => setBroadcastForm({ ...broadcastForm, content: e.target.value })} />
                            </div>
                            <div>
                                <Label>Media (Optional)</Label>
                                <Input type="file" onChange={handleBroadcastMedia} />
                            </div>
                            <Button type="submit" disabled={broadcastLoading} className="w-full">
                                {broadcastLoading ? 'Sending...' : 'Send Broadcast'}
                            </Button>
                        </form>
                    </GlassCard>
                </div>
            </div>
        </div>
    );
};

const MixtapeManager = () => {
    const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
    const [form, setForm] = useState<Partial<Mixtape>>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => { load(); }, []);

    const load = () => db.getMixtapes().then(setMixtapes);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverUrl' | 'audioUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await storage.upload(file);
            setForm(prev => ({ ...prev, [field]: url }));
        } catch (error) {
            alert('Upload failed. Try a smaller file.');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newMix: Mixtape = {
                id: form.id || crypto.randomUUID(),
                title: form.title || '',
                genre: form.genre || '',
                year: form.year || new Date().getFullYear().toString(),
                coverUrl: form.coverUrl || 'https://picsum.photos/400/400',
                description: form.description || '',
                isPublic: true,
                createdAt: form.createdAt || new Date().toISOString(),
                audioUrl: form.audioUrl,
                videoUrl: form.videoUrl,
                embedCode: form.embedCode
            };
            await db.saveMixtape(newMix);
            setForm({});
            load();
            alert('Mixtape Saved Successfully!');
        } catch (e) {
            alert('Error saving mixtape.');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete this mixtape?')) {
            await db.deleteMixtape(id);
            load();
        }
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <GlassCard>
                <h3 className="text-xl font-bold mb-4">Add / Edit Mixtape</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Title</Label><Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                    <div><Label>Genre</Label><Input value={form.genre || ''} onChange={e => setForm({ ...form, genre: e.target.value })} required /></div>
                    <div><Label>Year</Label><Input value={form.year || ''} onChange={e => setForm({ ...form, year: e.target.value })} /></div>

                    <div>
                        <Label>Cover Image</Label>
                        <div className="flex gap-2">
                            <Input type="text" placeholder="Or enter URL..." value={form.coverUrl || ''} onChange={e => setForm({ ...form, coverUrl: e.target.value })} />
                            <label className={`cursor-pointer bg-white/10 hover:bg-white/20 p-3 rounded-lg border border-white/10 flex items-center justify-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleFileUpload(e, 'coverUrl')} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <Label>Audio File / Stream URL</Label>
                        <div className="flex gap-2">
                            <Input type="text" placeholder="Direct MP3 Link..." value={form.audioUrl || ''} onChange={e => setForm({ ...form, audioUrl: e.target.value })} />
                            <label className={`cursor-pointer bg-white/10 hover:bg-white/20 p-3 rounded-lg border border-white/10 flex items-center justify-center ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                <input type="file" accept="audio/*" className="hidden" disabled={uploading} onChange={(e) => handleFileUpload(e, 'audioUrl')} />
                            </label>
                        </div>
                    </div>

                    <div>
                        <Label>Video Download URL</Label>
                        <Input type="text" placeholder="Direct Video Link (MP4/MKV)..." value={form.videoUrl || ''} onChange={e => setForm({ ...form, videoUrl: e.target.value })} />
                    </div>

                    <div className="md:col-span-2">
                        <Label>Embed Code (SoundCloud/Mixcloud)</Label>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-flowerz-blue"
                            rows={3}
                            placeholder="<iframe src='...'></iframe>"
                            value={form.embedCode || ''}
                            onChange={e => setForm({ ...form, embedCode: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="md:col-span-2"><Label>Description</Label><Input value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                    <Button type="submit" className="md:col-span-2" disabled={uploading}>
                        {uploading ? 'Uploading Files...' : 'Save Mixtape'}
                    </Button>
                </form>
            </GlassCard>

            <div className="grid gap-4">
                {mixtapes.map(m => (
                    <div key={m.id} className="flex items-center justify-between bg-white/5 p-4 rounded-lg">
                        <div className="flex items-center gap-4">
                            <img src={m.coverUrl} className="w-12 h-12 rounded object-cover" alt={m.title} />
                            <div><div className="font-bold">{m.title}</div><div className="text-sm text-gray-400">{m.genre}</div></div>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => setForm(m)}>Edit</Button>
                            <Button size="sm" className="bg-red-500/20 text-red-400 hover:bg-red-500/40" onClick={() => handleDelete(m.id)}><Trash className="w-4 h-4" /></Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const MusicPoolManager = () => {
    const [tracks, setTracks] = useState<MusicPoolTrack[]>([]);
    const [form, setForm] = useState<Partial<MusicPoolTrack>>({});
    const [uploading, setUploading] = useState(false);

    useEffect(() => { load(); }, []);
    const load = () => db.getPoolTracks().then(setTracks);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverUrl') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await storage.upload(file);
            setForm(prev => ({ ...prev, [field]: url }));
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newTrack: MusicPoolTrack = {
                id: form.id || crypto.randomUUID(),
                title: form.title || '',
                artist: form.artist || '',
                genre: form.genre || '',
                bpm: Number(form.bpm) || 0,
                coverUrl: form.coverUrl || 'https://picsum.photos/400/400',
                downloadUrl: form.downloadUrl || '#',
                telegramUrl: form.telegramUrl || '',
                createdAt: form.createdAt || new Date().toISOString(),
            };
            await db.savePoolTrack(newTrack);
            setForm({});
            load();
            alert('Track saved!');
        } catch (e) { alert('Save failed'); }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete track?')) {
            await db.deletePoolTrack(id);
            load();
        }
    }

    return (
        <div className="space-y-8 animate-slide-up">
            <GlassCard>
                <h3 className="text-xl font-bold mb-4">Add / Edit Pool Track</h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><Label>Artist</Label><Input value={form.artist || ''} onChange={e => setForm({ ...form, artist: e.target.value })} required /></div>
                    <div><Label>Title</Label><Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
                    <div><Label>Genre</Label><Input value={form.genre || ''} onChange={e => setForm({ ...form, genre: e.target.value })} required /></div>
                    <div><Label>BPM</Label><Input type="number" value={form.bpm || ''} onChange={e => setForm({ ...form, bpm: Number(e.target.value) })} /></div>

                    <div>
                        <Label>Cover Image</Label>
                        <div className="flex gap-2">
                            <Input type="text" placeholder="Image URL..." value={form.coverUrl || ''} onChange={e => setForm({ ...form, coverUrl: e.target.value })} />
                            <label className={`cursor-pointer bg-white/10 hover:bg-white/20 p-3 rounded-lg border border-white/10 flex items-center justify-center ${uploading ? 'opacity-50' : ''}`}>
                                {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                                <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleFileUpload(e, 'coverUrl')} />
                            </label>
                        </div>
                    </div>

                    <div><Label>Download URL (Direct/Cloud)</Label><Input value={form.downloadUrl || ''} onChange={e => setForm({ ...form, downloadUrl: e.target.value })} required /></div>

                    <div className="md:col-span-2">
                        <Label>Telegram Private Link</Label>
                        <div className="relative">
                            <Input className="pl-10" placeholder="https://t.me/c/..." value={form.telegramUrl || ''} onChange={e => setForm({ ...form, telegramUrl: e.target.value })} />
                            <Lock className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Users must be subscribed to see this link.</p>
                    </div>

                    <Button type="submit" className="md:col-span-2" disabled={uploading}>{uploading ? 'Uploading...' : 'Save Track'}</Button>
                </form>
            </GlassCard>
            <div className="grid gap-2">
                {tracks.map(t => (
                    <div key={t.id} className="bg-white/5 p-3 rounded flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={t.coverUrl} className="w-10 h-10 rounded" alt="cover" />
                            <div><div className="font-bold">{t.title}</div><div className="text-xs text-gray-500">{t.artist}</div></div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(t.id)} className="text-red-400"><Trash className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ProductManager = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [form, setForm] = useState<Partial<Product>>({ status: 'PUBLISHED', type: 'DIGITAL', category: 'DJ_SOFTWARE' });
    const [uploading, setUploading] = useState(false);

    useEffect(() => { load(); }, []);
    const load = () => db.getProducts().then(setProducts);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'coverUrl' | 'fileUrl' | 'galleryUrls') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        try {
            if (field === 'galleryUrls') {
                const urls = [];
                for (let i = 0; i < files.length; i++) {
                    const url = await storage.upload(files[i]);
                    urls.push(url);
                }
                setForm(prev => ({ ...prev, galleryUrls: [...(prev.galleryUrls || []), ...urls] }));
            } else {
                const url = await storage.upload(files[0]);
                setForm(prev => ({ ...prev, [field]: url }));
            }
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const togglePlatform = (platform: string) => {
        const current = form.platforms || [];
        if (current.includes(platform)) {
            setForm({ ...form, platforms: current.filter(p => p !== platform) });
        } else {
            setForm({ ...form, platforms: [...current, platform] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newItem: Product = {
                id: form.id || crypto.randomUUID(),
                name: form.name || '',
                tagline: form.tagline || '',
                description: form.description || '',
                price: Number(form.price) || 0,
                discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
                type: form.type || 'DIGITAL',
                category: (form.category as ProductCategory) || 'DJ_SOFTWARE',
                platforms: form.platforms || [],
                coverUrl: form.coverUrl || 'https://picsum.photos/400/400',
                galleryUrls: form.galleryUrls || [],
                fileUrl: form.fileUrl || '#',
                deliveryPassword: form.deliveryPassword || '',
                requirements: form.requirements || '',
                version: form.version || '1.0.0',
                releaseNotes: form.releaseNotes || '',
                stock: form.stock !== undefined ? Number(form.stock) : undefined,
                shipping: form.shipping ? {
                    weight: Number(form.shipping.weight),
                    cost: Number(form.shipping.cost),
                    dimensions: form.shipping.dimensions
                } : undefined,
                isFeatured: form.isFeatured || false,
                status: form.status || 'DRAFT',
                createdAt: form.createdAt || new Date().toISOString(),
            };
            await db.saveProduct(newItem);
            setForm({ status: 'PUBLISHED', type: 'DIGITAL', category: 'DJ_SOFTWARE' });
            load();
            alert('Product Saved!');
        } catch (e) { alert('Save failed'); }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Delete product?')) {
            await db.deleteProduct(id);
            load();
        }
    }

    return (
        <div className="space-y-8 animate-slide-up">
            <GlassCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Add / Edit Product</h3>
                    <div className="flex bg-white/5 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, type: 'DIGITAL' })}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${form.type === 'DIGITAL' ? 'bg-flowerz-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Digital Software
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, type: 'PHYSICAL' })}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-all ${form.type === 'PHYSICAL' ? 'bg-flowerz-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Hardware & Merch
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <Label>Product Name <span className="text-red-400">*</span></Label>
                            <Input value={form.name || ''} onChange={e => setForm({ ...form, name: e.target.value })} required />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Tagline / Short Desc</Label>
                            <Input value={form.tagline || ''} onChange={e => setForm({ ...form, tagline: e.target.value })} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <textarea className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" rows={4} value={form.description || ''} onChange={e => setForm({ ...form, description: e.target.value })} />
                        </div>

                        {/* Pricing */}
                        <div>
                            <Label>Price (KES)</Label>
                            <Input type="number" value={form.price || ''} onChange={e => setForm({ ...form, price: Number(e.target.value) })} required />
                        </div>
                        <div>
                            <Label>Discount Price (Optional)</Label>
                            <Input type="number" value={form.discountPrice || ''} onChange={e => setForm({ ...form, discountPrice: Number(e.target.value) })} />
                        </div>

                        <div>
                            <Label>Category</Label>
                            <select className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as any })}>
                                <option value="DJ_SOFTWARE">DJ Software</option>
                                <option value="AUDIO_TOOLS">Audio Tools</option>
                                <option value="DJ_HARDWARE">Hardware</option>
                                <option value="MERCHANDISE">Merchandise</option>
                            </select>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <Label>Cover Image</Label>
                            <div className="flex gap-2">
                                <label className={`flex-1 cursor-pointer bg-white/5 hover:bg-white/10 p-4 rounded-lg border border-dashed border-white/20 flex flex-col items-center justify-center text-center transition-colors ${uploading ? 'opacity-50' : ''}`}>
                                    {uploading ? <Loader2 className="w-8 h-8 animate-spin text-flowerz-blue" /> : <Upload className="w-8 h-8 text-gray-400 mb-2" />}
                                    <span className="text-sm text-gray-400">{form.coverUrl ? 'Change Image' : 'Upload Cover'}</span>
                                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={(e) => handleFileUpload(e, 'coverUrl')} />
                                </label>
                                {form.coverUrl && <img src={form.coverUrl} className="w-24 h-24 rounded-lg object-cover bg-black/50" alt="Preview" />}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full md:w-auto md:px-12" disabled={uploading}>
                        {uploading ? 'Uploading Assets...' : 'Save Product'}
                    </Button>
                </form>
            </GlassCard>
            <div className="grid gap-2">
                {products.map(p => (
                    <div key={p.id} className="bg-white/5 p-3 rounded flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <img src={p.coverUrl} className="w-10 h-10 rounded" alt="cover" />
                            <div><div className="font-bold">{p.name}</div><div className="text-xs text-gray-500">{p.price} KES</div></div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(p.id)} className="text-red-400"><Trash className="w-4 h-4" /></Button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const DashboardHome = () => {
    const [stats, setStats] = useState({ orders: 0, revenue: 0, users: 0, tracks: 0 });
    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Use individual catches or allow failures for resilience
                const [orders, users, tracks] = await Promise.all([
                    db.getOrders().catch(() => [] as Order[]),
                    db.getUsers().catch(() => [] as User[]),
                    db.getPoolTracks().catch(() => [] as MusicPoolTrack[])
                ]);
                const revenue = (orders as Order[]).reduce((sum: number, o: Order) => sum + (o.total || 0), 0);
                setStats({ orders: orders.length, revenue, users: users.length, tracks: tracks.length });
            } catch (e) {
                console.error("Failed to load dashboard stats", e);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up">
            <GlassCard>
                <div className="text-gray-400 text-sm font-bold uppercase mb-2">Total Revenue</div>
                <div className="text-3xl font-display font-bold text-green-400">KES {stats.revenue.toLocaleString()}</div>
            </GlassCard>
            <GlassCard>
                <div className="text-gray-400 text-sm font-bold uppercase mb-2">Total Orders</div>
                <div className="text-3xl font-display font-bold text-white">{stats.orders}</div>
            </GlassCard>
            <GlassCard>
                <div className="text-gray-400 text-sm font-bold uppercase mb-2">Users</div>
                <div className="text-3xl font-display font-bold text-flowerz-blue">{stats.users}</div>
            </GlassCard>
            <GlassCard>
                <div className="text-gray-400 text-sm font-bold uppercase mb-2">Music Pool Tracks</div>
                <div className="text-3xl font-display font-bold text-purple-400">{stats.tracks}</div>
            </GlassCard>
        </div>
    );
};

const InboxManager = () => {
    const [tab, setTab] = useState<'messages' | 'bookings'>('messages');
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [bookings, setBookings] = useState<BookingRequest[]>([]);

    useEffect(() => {
        db.getContactMessages().then(setMessages);
        db.getBookingRequests().then(setBookings);
    }, []);

    return (
        <div className="space-y-4 animate-slide-up">
            <div className="flex gap-6 border-b border-white/10 pb-4 mb-4">
                <button onClick={() => setTab('messages')} className={`transition-colors ${tab === 'messages' ? 'text-white font-bold border-b-2 border-flowerz-purple pb-1' : 'text-gray-400 hover:text-white'}`}>Messages</button>
                <button onClick={() => setTab('bookings')} className={`transition-colors ${tab === 'bookings' ? 'text-white font-bold border-b-2 border-flowerz-purple pb-1' : 'text-gray-400 hover:text-white'}`}>Booking Requests</button>
            </div>

            {tab === 'messages' && (
                messages.length === 0 ? <div className="text-center text-gray-500 py-12">No messages found.</div> :
                    <div className="space-y-4">
                        {messages.map(m => (
                            <div key={m.id} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className="font-bold text-lg">{m.subject}</h4>
                                    <span className="text-xs text-gray-400">{new Date(m.createdAt).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-300 text-sm mb-2">{m.message}</p>
                                <div className="text-xs text-gray-500">From: {m.name} ({m.email})</div>
                            </div>
                        ))}
                    </div>
            )}

            {tab === 'bookings' && (
                bookings.length === 0 ? <div className="text-center text-gray-500 py-12">No booking requests found.</div> :
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-white/5 text-gray-300">
                                <tr>
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Event</th>
                                    <th className="p-3">Budget</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map(b => (
                                    <tr key={b.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="p-3">{new Date(b.createdAt).toLocaleDateString()}</td>
                                        <td className="p-3">
                                            <div className="font-bold text-white">{b.name}</div>
                                            <div className="text-xs">{b.email}</div>
                                            <div className="text-xs">{b.phone}</div>
                                        </td>
                                        <td className="p-3">
                                            <div className="font-bold text-white">{b.eventType}</div>
                                            <div className="text-xs">{b.eventDate}</div>
                                            <div className="text-xs truncate max-w-[200px]">{b.location}</div>
                                        </td>
                                        <td className="p-3">KES {b.budget}</td>
                                        <td className="p-3"><Badge color={b.status === 'PENDING' ? 'orange' : 'green'}>{b.status}</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
            )}
        </div>
    )
};

const OrdersManager = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    useEffect(() => { db.getOrders().then(setOrders) }, []);
    return (
        <div className="space-y-4 animate-slide-up">
            <h3 className="text-xl font-bold mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="text-xs uppercase bg-white/5 text-gray-300">
                        <tr>
                            <th className="p-3">ID</th>
                            <th className="p-3">User</th>
                            <th className="p-3">Total</th>
                            <th className="p-3">Status</th>
                            <th className="p-3">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => (
                            <tr key={o.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-3 font-mono">{o.paymentRef}</td>
                                <td className="p-3">{o.userId}</td>
                                <td className="p-3">KES {o.total}</td>
                                <td className="p-3"><Badge color="green">{o.status}</Badge></td>
                                <td className="p-3">{new Date(o.createdAt).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
};

const NewsletterManager = () => {
    const [emails, setEmails] = useState<string[]>([]);
    useEffect(() => { db.getNewsletterEmails().then(setEmails) }, []);
    return (
        <div className="animate-slide-up">
            <h3 className="text-xl font-bold mb-4">Subscribers ({emails.length})</h3>
            <GlassCard>
                <textarea className="w-full bg-black/40 border border-white/10 p-2 text-xs font-mono h-64" readOnly value={emails.join('\n')} />
                <Button className="mt-4" onClick={() => { navigator.clipboard.writeText(emails.join(', ')); alert('Copied!'); }}>Copy All Emails</Button>
            </GlassCard>
        </div>
    )
};

const LinkMonitor = () => <div className="p-8 text-center text-gray-500">No active link monitoring data.</div>;

export const Admin = () => {
    const navigate = useNavigate();
    const { user, loading } = useAppUser();
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

    useEffect(() => {
        // Wait for user data to load
        if (loading) return;

        // If no user is logged in, redirect to login
        if (!user) {
            console.log("No user logged in, redirecting to login");
            navigate('/login');
            return;
        }

        // If user is logged in but not the admin, redirect to home
        if (user.email !== ADMIN_EMAIL) {
            console.warn("⚠️ Access denied: User is not the authorized admin.");
            console.warn("   Current user:", user.email);
            console.warn("   Required admin:", ADMIN_EMAIL);
            navigate('/');
            return;
        }

        // User is the admin
        console.log("✅ Admin access granted for:", user.email);
    }, [user, loading, navigate]);

    // Show loading state while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-flowerz-purple mx-auto mb-4"></div>
                    <p className="text-gray-400">Checking permissions...</p>
                </div>
            </div>
        );
    }

    // If not logged in or not admin, return null (will redirect in useEffect)
    if (!user || user.email !== ADMIN_EMAIL) return null;

    const tabs: { id: AdminTab; label: string; icon: any; component: React.ReactNode }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, component: <DashboardHome /> },
        { id: 'users', label: 'System Users', icon: Users, component: <UserManager type="admin" /> },
        { id: 'customers', label: 'Customers', icon: UserCircle, component: <UserManager type="customer" /> },
        { id: 'stock', label: 'Stock Levels', icon: AlertTriangle, component: <StockLevels /> },
        { id: 'orders', label: 'Orders', icon: Package, component: <OrdersManager /> },
        { id: 'lipamdogo', label: 'Lipa Mdogo Mdogo', icon: CreditCard, component: <LipamdogoManager /> },
        { id: 'invoices', label: 'Invoices', icon: FileText, component: <InvoiceManager /> },
        { id: 'products', label: 'Products', icon: ShoppingBag, component: <ProductManager /> },
        { id: 'blog', label: 'Blog / CMS', icon: FileText, component: <BlogManager /> },
        { id: 'mixtapes', label: 'Mixtapes', icon: Music, component: <MixtapeManager /> },
        { id: 'music_pool', label: 'Music Pool', icon: Music, component: <MusicPoolManager /> },
        { id: 'telegram', label: 'Telegram Bot', icon: Send, component: <TelegramManager /> },
        { id: 'inbox', label: 'Inbox', icon: MessageSquare, component: <InboxManager /> },
        { id: 'newsletter', label: 'Newsletter', icon: Mail, component: <NewsletterManager /> },
        { id: 'links', label: 'Link Monitor', icon: LinkIcon, component: <LinkMonitor /> },
    ];

    const ActiveComponent = tabs.find(t => t.id === activeTab)?.component;

    return (
        <div className="min-h-screen pt-20 px-4 max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
            <style>{`
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slide-up {
                    animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
            <div className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-24">
                    <h2 className="text-xs font-bold text-gray-500 uppercase px-4 mb-4 tracking-wider">Admin Control</h2>
                    <nav className="space-y-2" role="tablist">
                        {tabs.map((tab) => (
                            <TabButton
                                key={tab.id}
                                active={activeTab === tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                icon={tab.icon}
                                label={tab.label}
                            />
                        ))}
                    </nav>
                </div>
            </div>
            <div className="flex-1 py-8">
                <div className="mb-8 border-b border-white/10 pb-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold font-display capitalize flex items-center gap-3">
                        {tabs.find(t => t.id === activeTab)?.icon && React.createElement(tabs.find(t => t.id === activeTab)!.icon, { className: "w-8 h-8 text-flowerz-purple" })}
                        {tabs.find(t => t.id === activeTab)?.label}
                    </h1>
                </div>
                <div key={activeTab}>
                    {ActiveComponent}
                </div>
            </div>
        </div>
    );
};
