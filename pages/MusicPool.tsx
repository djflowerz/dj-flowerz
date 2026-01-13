
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../services/insforge';
import { User, MusicPoolTrack } from '../types';
import { PageHeader, Section, Button, GlassCard, Badge, Input } from '../components/UI';
import { Lock, Download, Check, ExternalLink, Play, Pause, SkipBack, SkipForward, Search, Heart, Music, List, Grid, Volume2 } from 'lucide-react';
import { useAppUser } from '../App';

// --- Sub-Component: Inline Player ---
const AudioPlayer = ({ 
    track, 
    isPlaying, 
    onTogglePlay, 
    onNext, 
    onPrev, 
    onEnded 
}: { 
    track: MusicPoolTrack | null, 
    isPlaying: boolean, 
    onTogglePlay: () => void, 
    onNext: () => void, 
    onPrev: () => void,
    onEnded: () => void
}) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (track && audioRef.current) {
            audioRef.current.src = track.previewUrl || track.downloadUrl; // Use preview if avail, else download
            if (isPlaying) audioRef.current.play();
        }
    }, [track]);

    useEffect(() => {
        if (audioRef.current) {
            isPlaying ? audioRef.current.play() : audioRef.current.pause();
        }
    }, [isPlaying]);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setProgress(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            audioRef.current.currentTime = Number(e.target.value);
            setProgress(Number(e.target.value));
        }
    };

    if (!track) return null;

    const formatTime = (time: number) => {
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    };

    return (
        <div className="fixed bottom-0 left-0 right-0 glass border-t border-white/10 p-4 z-50 animate-slide-up">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                {/* Track Info */}
                <div className="flex items-center gap-3 w-1/4">
                    <img src={track.coverUrl} className="w-12 h-12 rounded object-cover animate-spin-slow" style={{ animationPlayState: isPlaying ? 'running' : 'paused' }} alt="cover" />
                    <div className="hidden sm:block overflow-hidden">
                        <h4 className="font-bold text-sm truncate text-white">{track.title}</h4>
                        <p className="text-xs text-gray-400 truncate">{track.artist}</p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex-1 flex flex-col items-center max-w-lg">
                    <div className="flex items-center gap-6 mb-2">
                        <button onClick={onPrev} className="text-gray-400 hover:text-white"><SkipBack className="w-5 h-5"/></button>
                        <button onClick={onTogglePlay} className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform">
                            {isPlaying ? <Pause className="w-5 h-5 fill-current"/> : <Play className="w-5 h-5 fill-current ml-1"/>}
                        </button>
                        <button onClick={onNext} className="text-gray-400 hover:text-white"><SkipForward className="w-5 h-5"/></button>
                    </div>
                    <div className="w-full flex items-center gap-3 text-xs text-gray-400">
                        <span>{formatTime(progress)}</span>
                        <input 
                            type="range" 
                            min="0" 
                            max={duration || 100} 
                            value={progress} 
                            onChange={handleSeek}
                            className="flex-1 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-flowerz-blue [&::-webkit-slider-thumb]:rounded-full"
                        />
                        <span>{formatTime(duration)}</span>
                    </div>
                </div>

                {/* Extra Actions */}
                <div className="w-1/4 flex justify-end items-center gap-3">
                    <Volume2 className="w-5 h-5 text-gray-400 hidden sm:block"/>
                    <a href={track.downloadUrl} download target="_blank" className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-white">
                        <Download className="w-5 h-5"/>
                    </a>
                </div>
                
                <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={onEnded} />
            </div>
        </div>
    );
};

export const MusicPool = () => {
    const { user, loading } = useAppUser();
    const [tracks, setTracks] = useState<MusicPoolTrack[]>([]);
    const [filteredTracks, setFilteredTracks] = useState<MusicPoolTrack[]>([]);
    const [hasAccess, setHasAccess] = useState(false);
    
    // Playback State
    const [currentTrack, setCurrentTrack] = useState<MusicPoolTrack | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    // Filter State
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState('All');
    const [bpmSort, setBpmSort] = useState<'asc' | 'desc' | null>(null);

    useEffect(() => {
        // Check Access
        if (user?.subscription) {
            const expiry = new Date(user.subscription.expiresAt);
            if (expiry > new Date()) {
                setHasAccess(true);
                db.getPoolTracks().then(data => {
                    setTracks(data);
                    setFilteredTracks(data);
                });
            }
        } else {
            setHasAccess(false);
        }
    }, [user]);

    // Filter Logic
    useEffect(() => {
        let res = tracks.filter(t => 
            (t.title.toLowerCase().includes(search.toLowerCase()) || t.artist.toLowerCase().includes(search.toLowerCase())) &&
            (genreFilter === 'All' || t.genre === genreFilter)
        );

        if (bpmSort) {
            res.sort((a, b) => bpmSort === 'asc' ? a.bpm - b.bpm : b.bpm - a.bpm);
        }

        setFilteredTracks(res);
    }, [search, genreFilter, bpmSort, tracks]);

    const handlePlay = (track: MusicPoolTrack) => {
        if (currentTrack?.id === track.id) {
            setIsPlaying(!isPlaying);
        } else {
            setCurrentTrack(track);
            setIsPlaying(true);
        }
    };

    const handleNext = () => {
        if (!currentTrack) return;
        const idx = filteredTracks.findIndex(t => t.id === currentTrack.id);
        if (idx < filteredTracks.length - 1) setCurrentTrack(filteredTracks[idx + 1]);
    };

    const handlePrev = () => {
        if (!currentTrack) return;
        const idx = filteredTracks.findIndex(t => t.id === currentTrack.id);
        if (idx > 0) setCurrentTrack(filteredTracks[idx - 1]);
    };

    if (loading) return <div className="pt-20 text-center text-gray-500">Loading...</div>;

    // --- LOCKED VIEW (Non-Subscribers) ---
    if (!hasAccess) {
        const plans = [
            { id: '1_WEEK', name: '1 Week', price: 200, features: ['Unlimited Downloads', '7 Days Access', 'Telegram Access', 'High Quality MP3'] },
            { id: '1_MONTH', name: '1 Month', price: 700, features: ['Unlimited Downloads', '30 Days Access', 'Telegram Access', 'Priority Support'] },
            { id: '3_MONTHS', name: '3 Months', price: 1800, features: ['Save KES 300', '90 Days Access', 'Telegram Access', 'Priority Requests'] },
            { id: '6_MONTHS', name: '6 Months', price: 3500, features: ['Save KES 700', '180 Days Access', 'VIP Telegram', 'Exclusive Edits'] },
            { id: '12_MONTHS', name: '1 Year', price: 6000, features: ['Best Value', 'Full Year Access', 'VIP Telegram', 'All Future Updates'] },
        ];

        return (
            <div className="min-h-screen pt-20">
                <PageHeader title="Music Pool" subtitle="Exclusive edits, extended mixes, and high-quality audio for pros." image="https://picsum.photos/1920/1080?random=5" />
                
                <Section className="relative -mt-20 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {plans.map(plan => (
                            <GlassCard key={plan.id} className="text-center relative overflow-hidden border-t-4 border-t-flowerz-blue flex flex-col transition-transform hover:-translate-y-2">
                                <h3 className="text-lg font-bold mb-2">{plan.name}</h3>
                                <div className="text-2xl font-display font-bold mb-4 text-flowerz-blue">KES {plan.price.toLocaleString()}</div>
                                <ul className="text-xs text-gray-400 space-y-2 mb-6 text-left pl-2 flex-grow">
                                    {plan.features.map((f, i) => (
                                        <li key={i} className="flex items-start"><Check className="w-3 h-3 text-green-400 mr-2 mt-0.5 flex-shrink-0" /> {f}</li>
                                    ))}
                                </ul>
                                <Link to={user ? `/checkout?plan=${plan.id}` : '/login?redirect=music-pool'}>
                                    <Button className="w-full text-sm">Subscribe</Button>
                                </Link>
                            </GlassCard>
                        ))}
                    </div>

                    <div className="mt-20 text-center bg-white/5 p-12 rounded-3xl border border-white/5">
                        <Lock className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">Content Locked</h2>
                        <p className="text-gray-400">Join the DJ Flowerz pool to access the full library of tracks.</p>
                    </div>
                </Section>
            </div>
        );
    }

    // --- UNLOCKED VIEW (Subscribers) ---
    const genres = ['All', ...Array.from(new Set(tracks.map(t => t.genre)))];

    return (
        <div className="min-h-screen pt-20 pb-32">
            {/* Header & Stats */}
            <div className="bg-flowerz-card border-b border-white/5 py-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold flex items-center">
                                Music Pool Library <span className="ml-3 text-xs bg-flowerz-blue/20 text-flowerz-blue px-2 py-1 rounded border border-flowerz-blue/30">PRO ACCESS</span>
                            </h1>
                            <p className="text-gray-400 text-sm mt-1">
                                {tracks.length} DJ-ready tracks available. Updated weekly.
                            </p>
                        </div>
                        <div className="flex gap-3">
                             <a href="https://t.me/djflowerz_vip" target="_blank" rel="noreferrer">
                                <Button variant="outline" size="sm" className="text-xs">
                                    <ExternalLink className="w-4 h-4 mr-2" /> Telegram Channel
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="sticky top-20 z-40 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500"/>
                        <input 
                            type="text" 
                            placeholder="Search artist, title..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-flowerz-blue"
                        />
                    </div>
                    <select 
                        value={genreFilter}
                        onChange={(e) => setGenreFilter(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-flowerz-blue min-w-[150px]"
                    >
                        {genres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                    <select 
                        onChange={(e) => setBpmSort(e.target.value as any)}
                        className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-flowerz-blue min-w-[150px]"
                    >
                        <option value="">Sort by BPM</option>
                        <option value="asc">Low to High</option>
                        <option value="desc">High to Low</option>
                    </select>
                </div>
            </div>

            {/* Track List */}
            <Section className="py-8">
                <div className="bg-white/5 rounded-2xl border border-white/5 overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 gap-4 p-4 bg-white/5 border-b border-white/5 text-xs uppercase font-bold text-gray-400">
                        <div className="col-span-6 md:col-span-5 pl-12">Title / Artist</div>
                        <div className="col-span-2 hidden md:block">Genre</div>
                        <div className="col-span-2 hidden md:block">BPM / Key</div>
                        <div className="col-span-3 md:col-span-3 text-right">Actions</div>
                    </div>

                    {/* Filter Empty State */}
                    {filteredTracks.length === 0 && (
                        <div className="p-12 text-center text-gray-500">
                            <Music className="w-12 h-12 mx-auto mb-4 opacity-50"/>
                            <p>No tracks found matching your filters.</p>
                        </div>
                    )}

                    {/* Rows */}
                    <div className="divide-y divide-white/5">
                        {filteredTracks.map(track => (
                            <div 
                                key={track.id} 
                                className={`grid grid-cols-12 gap-4 p-4 items-center group hover:bg-white/5 transition-colors ${currentTrack?.id === track.id ? 'bg-white/5' : ''}`}
                            >
                                {/* Cover & Title */}
                                <div className="col-span-6 md:col-span-5 flex items-center gap-4">
                                    <div className="relative w-12 h-12 flex-shrink-0 group-hover:scale-105 transition-transform">
                                        <img src={track.coverUrl} className="w-full h-full rounded object-cover" alt="cover"/>
                                        <button 
                                            onClick={() => handlePlay(track)}
                                            className={`absolute inset-0 bg-black/50 flex items-center justify-center ${currentTrack?.id === track.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity`}
                                        >
                                            {currentTrack?.id === track.id && isPlaying ? (
                                                <Pause className="w-5 h-5 text-white fill-white"/>
                                            ) : (
                                                <Play className="w-5 h-5 text-white fill-white ml-1"/>
                                            )}
                                        </button>
                                    </div>
                                    <div className="min-w-0">
                                        <div className={`font-bold truncate ${currentTrack?.id === track.id ? 'text-flowerz-blue' : 'text-white'}`}>{track.title}</div>
                                        <div className="text-sm text-gray-400 truncate">{track.artist}</div>
                                    </div>
                                </div>

                                {/* Genre */}
                                <div className="col-span-2 hidden md:flex items-center">
                                    <Badge color="blue">{track.genre}</Badge>
                                </div>

                                {/* BPM / Key */}
                                <div className="col-span-2 hidden md:block text-sm text-gray-300 font-mono">
                                    <div>{track.bpm} BPM</div>
                                    {track.key && <div className="text-gray-500">{track.key}</div>}
                                </div>

                                {/* Actions */}
                                <div className="col-span-6 md:col-span-3 flex items-center justify-end gap-2">
                                    <button className="p-2 text-gray-500 hover:text-pink-500 transition-colors">
                                        <Heart className="w-5 h-5"/>
                                    </button>
                                    <a href={track.downloadUrl} download target="_blank" className="flex items-center bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-sm transition-colors border border-white/10">
                                        <Download className="w-4 h-4 mr-2"/> <span className="hidden sm:inline">Download</span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Sticky Player */}
            {currentTrack && (
                <AudioPlayer 
                    track={currentTrack} 
                    isPlaying={isPlaying} 
                    onTogglePlay={() => setIsPlaying(!isPlaying)}
                    onNext={handleNext}
                    onPrev={handlePrev}
                    onEnded={handleNext}
                />
            )}
        </div>
    );
};
