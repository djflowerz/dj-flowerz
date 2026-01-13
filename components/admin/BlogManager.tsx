import React, { useState } from 'react';
import { Button, Input, Label, GlassCard } from '../UI';
import { FileText, Save, Trash, Image as ImageIcon } from 'lucide-react';

// Local interface until integrated into main types
interface BlogPost {
    id: string;
    title: string;
    subtitle?: string;
    content: string;
    coverUrl?: string;
    author: string;
    status: 'DRAFT' | 'PUBLISHED';
    createdAt: string;
}

export const BlogManager = () => {
    // Placeholder Data - Connect to db.getBlogs() when backend ready
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [form, setForm] = useState<Partial<BlogPost>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newPost: BlogPost = {
            id: crypto.randomUUID(),
            title: form.title || '',
            subtitle: form.subtitle,
            content: form.content || '',
            coverUrl: form.coverUrl || 'https://picsum.photos/800/400',
            author: 'Admin',
            status: 'PUBLISHED',
            createdAt: new Date().toISOString()
        };
        setPosts([...posts, newPost]);
        setForm({});
        alert('Article Published (Simulation)');
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <GlassCard>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <FileText className="w-5 h-5" /> Blog / CMS
                </h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label>Title</Label>
                        <Input value={form.title || ''} onChange={e => setForm({ ...form, title: e.target.value })} required placeholder="Article Headline" />
                    </div>
                    <div>
                        <Label>Subtitle</Label>
                        <Input value={form.subtitle || ''} onChange={e => setForm({ ...form, subtitle: e.target.value })} placeholder="Short summary..." />
                    </div>
                    <div>
                        <Label>Content (Markdown)</Label>
                        <textarea
                            className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-white min-h-[200px]"
                            value={form.content || ''}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            placeholder="# Heading&#10;Write your article here..."
                        ></textarea>
                    </div>
                    <Button type="submit" className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Publish Article
                    </Button>
                </form>
            </GlassCard>

            <div className="grid gap-4">
                {posts.length === 0 && <div className="text-gray-500 text-center py-8">No articles yet.</div>}
                {posts.map(p => (
                    <div key={p.id} className="bg-white/5 p-4 rounded-xl flex justify-between items-center">
                        <div>
                            <h4 className="font-bold">{p.title}</h4>
                            <p className="text-sm text-gray-400">{p.subtitle}</p>
                            <div className="text-xs text-gray-500 mt-1">{new Date(p.createdAt).toLocaleDateString()}</div>
                        </div>
                        <Button variant="ghost" className="text-red-400" onClick={() => setPosts(posts.filter(x => x.id !== p.id))}>
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
};
