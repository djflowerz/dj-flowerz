
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { db, storage } from '../services/insforge';
import { Order, TelegramChannel, ADMIN_EMAIL } from '../types';
import { PageHeader, Section, GlassCard, Badge, Button, Input, Label } from '../components/UI';
import { Download, Package, ExternalLink, Send, Check, Key, Camera, Edit2, X, Save, User as UserIcon } from 'lucide-react';
import { useAppUser } from '../App';

export const Profile = () => {
    const { user, refreshUser, loading } = useAppUser();
    const [orders, setOrders] = useState<Order[]>([]);
    const [vipChannels, setVipChannels] = useState<TelegramChannel[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: '', phone: '', avatarUrl: '' });
    const [uploading, setUploading] = useState(false);

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderSuccess = searchParams.get('order_success');

    useEffect(() => {
        if (loading) return; // Wait for auth check
        if (!user) {
            navigate('/login');
            return;
        }

        setEditForm({ name: user.name, phone: user.phone || '', avatarUrl: user.avatarUrl || '' });

        // Fetch User's Orders
        db.getOrders().then(allOrders => {
            setOrders(allOrders.filter(o => o.userId === user.id));
        });

        // Check for Telegram access logic
        if (user.subscription) {
            db.getTelegramChannels().then(channels => {
                const plan = user.subscription?.plan;
                const isVip = plan === '6_MONTHS' || plan === '12_MONTHS';

                const accessibleChannels = channels.filter(c => {
                    if (c.accessLevel === 'FREE') return true;
                    if (c.accessLevel === 'ALL_SUBSCRIBERS') return true;
                    if (c.accessLevel === 'VIP_ONLY' && isVip) return true;
                    return false;
                });

                setVipChannels(accessibleChannels);
            });
        }
    }, [user, navigate]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const url = await storage.upload(file);
            setEditForm(prev => ({ ...prev, avatarUrl: url }));
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        try {
            await db.updateProfile(user.id, editForm);
            alert('Profile updated successfully!');
            refreshUser(); // Refresh the global context
            setIsEditing(false);
        } catch (e: any) {
            alert(e.message || 'Failed to update profile');
        }
    };

    if (loading) return <div className="pt-32 text-center text-gray-500">Loading your profile...</div>;
    if (!user) return null; // Will redirect via useEffect

    return (
        <div className="min-h-screen pt-20">
            <div className="bg-flowerz-card border-b border-white/5 py-12 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-gradient-to-br from-flowerz-purple to-flowerz-blue rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden border-2 border-white/20">
                                {user.avatarUrl ? (
                                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                                ) : (
                                    user.name.charAt(0)
                                )}
                            </div>
                            {isEditing && (
                                <label className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-6 h-6 text-white" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                </label>
                            )}
                        </div>

                        <div>
                            {isEditing ? (
                                <div className="space-y-2">
                                    <Input value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Full Name" className="py-2" />
                                    <Input value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone Number" className="py-2" />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-3xl font-bold">{user.name}</h1>
                                    <p className="text-gray-400">{user.email}</p>
                                    {user.phone && <p className="text-sm text-gray-500">{user.phone}</p>}
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 min-w-[200px]">
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-center">
                            <p className="text-sm text-gray-400 mb-1">Subscription Status</p>
                            {user.subscription ? (
                                <>
                                    <Badge color="green">Active</Badge>
                                    <p className="text-xs text-gray-500 mt-2">Expires: {new Date(user.subscription.expiresAt).toLocaleDateString()}</p>
                                </>
                            ) : (
                                <>
                                    <Badge color="red">Inactive</Badge>
                                    <Button variant="secondary" size="sm" className="mt-2 w-full text-xs" onClick={() => navigate('/music-pool')}>Upgrade to Premium</Button>
                                </>
                            )}
                        </div>

                        {!isEditing ? (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                            </Button>
                        ) : (
                            <div className="flex gap-2">
                                <Button variant="primary" size="sm" onClick={handleSaveProfile} disabled={uploading} className="flex-1">
                                    <Save className="w-4 h-4 mr-2" /> Save
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setEditForm({ name: user.name, phone: user.phone || '', avatarUrl: user.avatarUrl || '' }); }}>
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Section>
                {/* Success Banner */}
                {orderSuccess && (
                    <div className="mb-8 bg-green-500/10 border border-green-500/30 p-6 rounded-2xl flex items-start gap-4 animate-slide-up">
                        <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                            <Check className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-400">Order Successful!</h3>
                            <p className="text-gray-300">Thank you for your purchase. Your downloads and licenses are available below.</p>
                        </div>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Orders History */}
                    <GlassCard>
                        <div className="flex items-center mb-6">
                            <Package className="w-5 h-5 text-flowerz-purple mr-2" />
                            <h2 className="text-xl font-bold">Order History & Downloads</h2>
                        </div>
                        {orders.length === 0 ? (
                            <p className="text-gray-500">No purchases yet.</p>
                        ) : (
                            <div className="space-y-6">
                                {orders.map(order => (
                                    <div key={order.id} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                                        <div className="flex justify-between mb-3">
                                            <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
                                            <div className="flex gap-2 items-center">
                                                <span className="text-xs font-mono text-gray-500">#{order.paymentRef}</span>
                                                <Badge color="blue">KES {order.total.toLocaleString()}</Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {order.items.map((item, i) => (
                                                <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="font-bold text-sm">{item.name}</span>
                                                        {item.type === 'DIGITAL' && (
                                                            <a href={item.fileUrl} className="text-flowerz-blue hover:text-white transition-colors flex items-center text-xs bg-flowerz-blue/10 px-2 py-1 rounded">
                                                                <Download className="w-3 h-3 mr-1" /> Download
                                                            </a>
                                                        )}
                                                    </div>

                                                    {/* License / Password Display */}
                                                    {item.deliveryPassword && (
                                                        <div className="mt-2 text-xs bg-black/40 p-2 rounded flex items-center gap-2 border border-white/5">
                                                            <Key className="w-3 h-3 text-yellow-400" />
                                                            <span className="text-gray-400 uppercase font-bold text-[10px]">License Key:</span>
                                                            <code className="text-white font-mono select-all bg-white/10 px-1 rounded">{item.deliveryPassword}</code>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </GlassCard>

                    {/* Quick Stats or Recommendations */}
                    <div className="space-y-6">

                        {/* Telegram Access for Subscribers */}
                        {user.subscription ? (
                            <GlassCard className="bg-[#24A1DE]/10 border-[#24A1DE]/30">
                                <h2 className="text-xl font-bold mb-4 flex items-center text-[#24A1DE]"><Send className="w-5 h-5 mr-2" /> Telegram Access</h2>
                                <p className="text-sm text-gray-400 mb-4">You have access to exclusive subscriber-only channels.</p>
                                <div className="space-y-2">
                                    {vipChannels.length > 0 ? vipChannels.map(channel => (
                                        <div key={channel.id} className="flex justify-between items-center bg-white/5 p-3 rounded">
                                            <div>
                                                <span className="font-bold text-sm block">{channel.name}</span>
                                                {channel.accessLevel === 'VIP_ONLY' && <span className="text-[10px] text-orange-400 uppercase font-bold tracking-wider">VIP Exclusive</span>}
                                            </div>
                                            <a href={channel.inviteLink || `https://t.me/${channel.channelId}`} target="_blank" rel="noreferrer">
                                                <Button size="sm" className="text-xs">Join Channel</Button>
                                            </a>
                                        </div>
                                    )) : (
                                        <p className="text-xs text-gray-500">No channels available at the moment.</p>
                                    )}
                                </div>
                            </GlassCard>
                        ) : (
                            <GlassCard className="opacity-75">
                                <h2 className="text-xl font-bold mb-4 flex items-center text-gray-400"><Send className="w-5 h-5 mr-2" /> Telegram Channels Locked</h2>
                                <p className="text-sm text-gray-500 mb-4">Subscribe to the music pool to access our private telegram channels for instant updates and exclusive tracks.</p>
                                <Button variant="outline" className="w-full text-xs" onClick={() => navigate('/music-pool')}>Subscribe to Unlock</Button>
                            </GlassCard>
                        )}

                        <GlassCard>
                            <h2 className="text-xl font-bold mb-4">Account Settings</h2>
                            <Button variant="outline" className="w-full mb-2" onClick={() => alert('Please use the Insforge User Button to change password.')}>Manage Account</Button>
                        </GlassCard>

                        {/* Only Admin Link */}
                        {user.email === ADMIN_EMAIL && (
                            <GlassCard className="bg-red-500/10 border-red-500/30">
                                <h2 className="text-xl font-bold text-red-400 mb-2">Admin Access</h2>
                                <p className="text-sm text-gray-400 mb-4">Manage content and users.</p>
                                <Button onClick={() => navigate('/admin')} className="w-full bg-red-600 hover:bg-red-700 text-white border-0">
                                    Go to Dashboard
                                </Button>
                            </GlassCard>
                        )}
                    </div>
                </div>
            </Section>
        </div>
    );
};
