import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../services/insforge';
import { Mixtape } from '../types';
import { PageHeader, GlassCard, Button, Section, Badge } from '../components/UI';
import { Play, Download, Share2, Calendar, Music, Video, Search, Filter } from 'lucide-react';

const handleShare = (id: string, title: string) => {
    const url = `${window.location.origin}/#/mixtapes/${id}`;
    navigator.clipboard.writeText(url).then(() => {
        alert(`Link for "${title}" copied to clipboard!`);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};

export const MixtapesList = () => {
    const [mixtapes, setMixtapes] = useState<Mixtape[]>([]);
    const [filteredMixtapes, setFilteredMixtapes] = useState<Mixtape[]>([]);
    
    // Filters
    const [search, setSearch] = useState('');
    const [genreFilter, setGenreFilter] = useState('All');

    useEffect(() => {
        db.getMixtapes().then(data => {
            setMixtapes(data);
            setFilteredMixtapes(data);
        });
    }, []);

    useEffect(() => {
        let result = mixtapes;

        // Search Filter
        if (search) {
            result = result.filter(m => m.title.toLowerCase().includes(search.toLowerCase()) || m.genre.toLowerCase().includes(search.toLowerCase()));
        }

        // Genre Filter
        if (genreFilter !== 'All') {
            result = result.filter(m => m.genre === genreFilter);
        }

        setFilteredMixtapes(result);
    }, [search, genreFilter, mixtapes]);

    // Unique Genres
    const genres = ['All', ...Array.from(new Set(mixtapes.map(m => m.genre)))];

    return (
        <div className="min-h-screen pt-20">
            <PageHeader title="Mixtapes" subtitle="Stream and download the latest mixes." image="https://picsum.photos/1920/1080?grayscale" />
            
            {/* Search & Filters */}
            <div className="sticky top-20 z-40 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500"/>
                        <input 
                            type="text" 
                            placeholder="Search mixes by title or genre..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-flowerz-purple transition-all"
                        />
                    </div>
                    <div className="relative">
                        <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-500"/>
                        <select 
                            value={genreFilter}
                            onChange={(e) => setGenreFilter(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-white focus:outline-none focus:border-flowerz-purple appearance-none min-w-[150px] cursor-pointer"
                        >
                            {genres.map(g => <option key={g} value={g} className="bg-gray-900">{g}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <Section>
                {filteredMixtapes.length === 0 ? (
                    <div className="text-center py-20">
                        <Music className="w-16 h-16 mx-auto text-gray-600 mb-4"/>
                        <h3 className="text-xl font-bold text-gray-400">No mixtapes found</h3>
                        <p className="text-gray-500">Try adjusting your filters.</p>
                        <Button variant="ghost" className="mt-4" onClick={() => { setSearch(''); setGenreFilter('All'); }}>Clear Filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMixtapes.map(mix => (
                            <GlassCard key={mix.id} className="h-full flex flex-col group hover:bg-white/10 transition-colors">
                                <Link to={`/mixtapes/${mix.id}`} className="block">
                                    <div className="aspect-square rounded-xl overflow-hidden mb-6 relative shadow-2xl">
                                        <img src={mix.coverUrl} alt={mix.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-16 h-16 text-white drop-shadow-lg" />
                                        </div>
                                    </div>
                                </Link>
                                <div className="space-y-2 flex-1">
                                    <div className="flex justify-between items-start">
                                        <Badge color="blue">{mix.genre}</Badge>
                                        <span className="text-gray-500 text-sm flex items-center"><Calendar className="w-3 h-3 mr-1"/> {mix.year}</span>
                                    </div>
                                    <Link to={`/mixtapes/${mix.id}`}>
                                        <h3 className="text-2xl font-bold text-white group-hover:text-flowerz-purple transition-colors">{mix.title}</h3>
                                    </Link>
                                    <p className="text-gray-400 line-clamp-2">{mix.description}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                                     <Link to={`/mixtapes/${mix.id}`} className="flex-1">
                                        <Button variant="secondary" size="sm" className="w-full">Listen</Button>
                                     </Link>
                                     <button onClick={() => handleShare(mix.id, mix.title)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                                        <Share2 className="w-5 h-5"/>
                                     </button>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                )}
            </Section>
        </div>
    );
};

export const MixtapeSingle = () => {
    const { id } = useParams<{id: string}>();
    const [mixtape, setMixtape] = useState<Mixtape | null>(null);

    useEffect(() => {
        if (id) {
            db.getMixtapes().then(mixes => {
                const found = mixes.find(m => m.id === id);
                if (found) setMixtape(found);
            });
        }
    }, [id]);

    if (!mixtape) return <div className="pt-32 text-center">Loading...</div>;

    return (
        <div className="min-h-screen pt-20">
             <div className="relative">
                {/* Background Blur */}
                <div className="absolute inset-0 overflow-hidden h-[60vh] z-0">
                    <img src={mixtape.coverUrl} className="w-full h-full object-cover blur-3xl opacity-20" alt="bg"/>
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0B0B0F]/50 to-[#0B0B0F]"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 pt-12 pb-20">
                    <div className="grid md:grid-cols-12 gap-12">
                        {/* Left Column: Cover & Actions */}
                        <div className="md:col-span-4 space-y-6">
                            <div className="aspect-square rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10">
                                <img src={mixtape.coverUrl} alt={mixtape.title} className="w-full h-full object-cover" />
                            </div>
                            
                            <div className="space-y-4">
                                {mixtape.videoUrl ? (
                                    <a href={mixtape.videoUrl} download className="block">
                                        <Button className="w-full py-4 text-base shadow-xl shadow-flowerz-purple/20 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 border-0">
                                            <Video className="w-5 h-5 mr-2 fill-white" /> Download Video Mix
                                        </Button>
                                    </a>
                                ) : (
                                    <div className="text-center p-3 bg-white/5 rounded-lg border border-white/5 text-gray-500 text-sm">
                                        Video download unavailable
                                    </div>
                                )}

                                {mixtape.audioUrl && (
                                    <a href={mixtape.audioUrl} download className="block">
                                        <Button variant="secondary" className="w-full">
                                            <Download className="w-4 h-4 mr-2" /> Download Audio MP3
                                        </Button>
                                    </a>
                                )}
                            </div>
                            
                             <Button variant="ghost" className="w-full text-sm text-gray-400" onClick={() => handleShare(mixtape.id, mixtape.title)}>
                                <Share2 className="w-4 h-4 mr-2" /> Share Mixtape
                            </Button>
                        </div>

                        {/* Right Column: Info & Player */}
                        <div className="md:col-span-8 space-y-8">
                            <div>
                                <div className="flex items-center gap-4 mb-4">
                                    <Badge color="purple">{mixtape.genre}</Badge>
                                    <span className="text-gray-400 text-sm">{mixtape.year}</span>
                                </div>
                                <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">{mixtape.title}</h1>
                                <p className="text-xl text-gray-300 leading-relaxed">{mixtape.description}</p>
                            </div>

                            {/* Audio Player Embed */}
                            {mixtape.embedCode ? (
                                <div className="bg-black/30 rounded-xl p-4 border border-white/10" dangerouslySetInnerHTML={{ __html: mixtape.embedCode }} />
                            ) : mixtape.audioUrl ? (
                                <div className="glass-card p-6 rounded-xl">
                                    <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-widest">Now Playing</h3>
                                    <audio controls className="w-full h-12 rounded-lg" src={mixtape.audioUrl}>
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            ) : null}

                             {/* Embed Code for Bloggers */}
                             <div className="bg-black/40 rounded-xl p-6 border border-white/5">
                                <h4 className="text-sm font-bold text-gray-400 mb-2">Embed This Mix</h4>
                                <code className="block bg-black/50 p-4 rounded text-xs text-gray-500 font-mono break-all">
                                    {`<iframe src="https://djflowerz.com/embed/${mixtape.id}" width="100%" height="200" frameborder="0"></iframe>`}
                                </code>
                            </div>
                        </div>
                    </div>
                </div>
             </div>
        </div>
    );
};