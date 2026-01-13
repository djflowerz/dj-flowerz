import React, { useState, useEffect } from 'react';
import { db } from '../services/insforge';
import { Lock, Download, Music } from 'lucide-react';

interface ProtectedMusicPoolProps {
    userEmail: string;
}

export const ProtectedMusicPool: React.FC<ProtectedMusicPoolProps> = ({ userEmail }) => {
    const [hasAccess, setHasAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [subscriptionInfo, setSubscriptionInfo] = useState<any>(null);

    useEffect(() => {
        checkAccess();
    }, [userEmail]);

    const checkAccess = async () => {
        try {
            // Check if user has active subscription
            const users = await db.getUsers();
            const user = users.find(u => u.email === userEmail);

            if (user) {
                const isActive = user.subscription?.status === 'ACTIVE';
                const validUntil = user.subscription?.validUntil ? new Date(user.subscription.validUntil) : null;
                const isValid = validUntil ? validUntil > new Date() : false;

                setHasAccess(isActive && isValid);
                setSubscriptionInfo({
                    status: user.subscription?.status,
                    plan: user.subscription?.plan,
                    validUntil: validUntil
                });
            }
        } catch (error) {
            console.error('Failed to check access:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p className="text-gray-400">Checking your subscription...</p>
                </div>
            </div>
        );
    }

    if (!hasAccess) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="max-w-md w-full text-center">
                    <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                        <Lock className="w-12 h-12 text-purple-400" />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">Music Pool Access Required</h2>
                    <p className="text-gray-400 mb-8">
                        Subscribe to get unlimited access to premium DJ tracks, exclusive mixes, and weekly updates.
                    </p>
                    <button
                        onClick={() => window.location.href = '/subscription'}
                        className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-full text-white font-bold transition-all transform hover:scale-105"
                    >
                        View Subscription Plans
                    </button>
                    <p className="mt-4 text-sm text-gray-500">
                        Plans starting from KES 200/week
                    </p>
                </div>
            </div>
        );
    }

    // User has access - Show Music Pool
    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Subscription Status Banner */}
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                                <Music className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-green-400">Active Subscription</p>
                                <p className="text-sm text-gray-400">
                                    {subscriptionInfo?.plan || 'Premium'} • Valid until {subscriptionInfo?.validUntil?.toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => window.location.href = '/account'}
                            className="text-sm text-purple-400 hover:text-purple-300"
                        >
                            Manage Subscription
                        </button>
                    </div>
                </div>

                {/* Music Pool Content */}
                <h1 className="text-4xl font-bold mb-8">Music Pool</h1>

                <MusicPoolContent />
            </div>
        </div>
    );
};

// Music Pool Content Component
const MusicPoolContent: React.FC = () => {
    const [tracks, setTracks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTracks();
    }, []);

    const loadTracks = async () => {
        try {
            const poolTracks = await db.getPoolTracks();
            setTracks(poolTracks);
        } catch (error) {
            console.error('Failed to load tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = (track: any) => {
        // Implement download logic
        console.log('Downloading:', track.title);
        // In production, this would generate a signed download URL
    };

    if (loading) {
        return <div className="text-center py-12">Loading tracks...</div>;
    }

    if (tracks.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-400">No tracks available yet. Check back soon!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tracks.map((track) => (
                <div
                    key={track.id}
                    className="bg-white/5 border border-white/10 rounded-lg p-4 hover:border-purple-500/50 transition-all"
                >
                    {track.cover_image && (
                        <img
                            src={track.cover_image}
                            alt={track.title}
                            className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                    )}
                    <h3 className="font-bold text-lg mb-2">{track.title}</h3>
                    {track.artist && (
                        <p className="text-sm text-gray-400 mb-4">{track.artist}</p>
                    )}
                    <button
                        onClick={() => handleDownload(track)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4" />
                        Download
                    </button>
                </div>
            ))}
        </div>
    );
};
