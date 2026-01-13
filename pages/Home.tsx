
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Section, GlassCard, Badge } from '../components/UI';
import { Play, ShoppingBag, Music, Star, ArrowRight, Mail, Lock } from 'lucide-react';
import { db } from '../services/insforge';
import { Mixtape, Product } from '../types';

const NewsletterSection = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await db.subscribeNewsletter(email);
            setSubscribed(true);
            setEmail('');
        } catch (error) {
            console.error(error);
            alert('Failed to subscribe. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Section>
            <div className="relative rounded-3xl overflow-hidden p-8 md:p-16 text-center border border-white/10 bg-gradient-to-br from-black to-[#15151A]">
                 <div className="relative z-10 max-w-2xl mx-auto">
                    <div className="inline-flex p-4 rounded-full bg-white/5 mb-6">
                        <Mail className="w-8 h-8 text-flowerz-blue" />
                    </div>
                    <h2 className="text-3xl md:text-5xl font-display font-bold mb-4">Stay In The Loop</h2>
                    <p className="text-gray-400 text-lg mb-8">
                        Join our exclusive mailing list. Get early access to new mixes, edits, and discount codes for the store.
                    </p>
                    
                    {subscribed ? (
                        <div className="bg-green-500/20 text-green-400 p-4 rounded-xl font-bold animate-pulse border border-green-500/30">
                            Welcome to the family! Check your inbox.
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email address"
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white focus:outline-none focus:border-flowerz-blue transition-colors text-lg"
                            />
                            <Button size="lg" type="submit" disabled={loading} className="sm:w-auto">
                                {loading ? 'Joining...' : 'Subscribe Now'}
                            </Button>
                        </form>
                    )}
                 </div>
                 {/* Decorative background glow */}
                 <div className="absolute -top-[50%] -right-[10%] w-[500px] h-[500px] bg-flowerz-purple/10 rounded-full blur-[100px]"></div>
                 <div className="absolute -bottom-[50%] -left-[10%] w-[500px] h-[500px] bg-flowerz-blue/10 rounded-full blur-[100px]"></div>
            </div>
        </Section>
    )
}

export const Home = () => {
  const [featuredMixtapes, setFeaturedMixtapes] = useState<Mixtape[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Parallel fetching for better performance
    Promise.all([
        db.getMixtapes().catch(() => []),
        db.getProducts().catch(() => [])
    ]).then(([mixes, products]) => {
        setFeaturedMixtapes(mixes.slice(0, 3));
        setFeaturedProducts(products.slice(0, 4));
    });
  }, []);

  return (
    <div className="overflow-x-hidden">
      {/* 1. Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-flowerz-purple/20 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-flowerz-blue/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left space-y-8">
                <Badge color="purple">OFFICIAL PLATFORM</Badge>
                
                {/* Reverted to Text Headline */}
                <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight animate-fade-in-up">
                    NEXT LEVEL <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-flowerz-blue to-flowerz-purple text-glow">
                        DJ EXPERIENCE
                    </span>
                </h1>
                
                <p className="text-gray-400 text-lg md:text-xl max-w-lg mx-auto md:mx-0 animate-fade-in-up delay-100">
                    The home of DJ Flowerz. Stream exclusive mixtapes, access the pro music pool, and grab essential DJ tools.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-2 animate-fade-in-up delay-200">
                    {/* Primary Button: Join Music Pool */}
                    <Link to="/music-pool">
                        <Button size="lg" className="w-full sm:w-auto shadow-xl shadow-flowerz-purple/30">
                            <Lock className="w-5 h-5 mr-2" /> Join Music Pool
                        </Button>
                    </Link>
                    {/* Secondary Button: Listen to Mixtapes */}
                    <Link to="/mixtapes">
                        <Button variant="secondary" size="lg" className="w-full sm:w-auto">
                            <Play className="w-5 h-5 fill-current" /> Listen to Mixtapes
                        </Button>
                    </Link>
                </div>
            </div>
            
            {/* Reverted Right Side to Floating Logo */}
            <div className="relative hidden md:flex items-center justify-center">
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-flowerz-purple/30 to-flowerz-blue/30 blur-[60px] rounded-full animate-pulse"></div>
                
                {/* Logo Image */}
                <img 
                    src="/logo.png" 
                    alt="DJ Flowerz Official Logo"
                    className="relative z-10 w-full max-w-[450px] object-contain drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-float transform hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        // Fallback placeholder if image fails to load
                        e.currentTarget.src = "https://placehold.co/600x600/transparent/white?text=DJ+FLOWERZ+LOGO";
                    }}
                />
            </div>
        </div>
      </div>

      {/* 2. Unlock Music Pool Section */}
      <Section className="relative z-10">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-white/10 p-8 md:p-16 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <div className="inline-block p-3 rounded-full bg-white/5 mb-4">
                    <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                </div>
                <h2 className="text-4xl md:text-5xl font-display font-bold">Unlock The Music Pool</h2>
                <p className="text-xl text-gray-300">
                    Get unlimited access to high-quality MP3s, extended edits, and exclusive tracks. Starting at just KES 200/week.
                </p>
                <div className="pt-4">
                    <Link to="/music-pool">
                        <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-purple-500/20">
                            View Subscription Plans
                        </Button>
                    </Link>
                </div>
            </div>
            {/* Decorative BG */}
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://picsum.photos/1920/600?blur=10')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        </div>
      </Section>

      {/* 3. Digital Store Section */}
      <Section>
        <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Digital Store</h2>
            <p className="text-gray-400">Software, FX packs, and DJ tools.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
                <Link to={`/store/${product.id}`} key={product.id}>
                    <div className="group">
                        <div className="bg-white/5 rounded-xl aspect-square overflow-hidden mb-4 relative">
                            <img src={product.coverUrl} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div className="absolute top-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                                KES {product.price.toLocaleString()}
                            </div>
                        </div>
                        <h3 className="font-bold text-lg group-hover:text-flowerz-blue transition-colors">{product.name}</h3>
                        <p className="text-sm text-gray-500">{product.category.replace('_', ' ')}</p>
                    </div>
                </Link>
            ))}
        </div>
        <div className="mt-8 text-center">
            <Link to="/store">
                <Button variant="outline">Browse Store</Button>
            </Link>
        </div>
      </Section>

      {/* 4. Mixtapes Section */}
      <Section className="bg-white/2">
        <div className="flex justify-between items-end mb-12">
            <div>
                <h2 className="text-3xl font-bold mb-2">Fresh Mixtapes</h2>
                <p className="text-gray-400">Curated mixes for every mood.</p>
            </div>
            <Link to="/mixtapes" className="hidden md:flex items-center text-flowerz-purple hover:text-white transition-colors">
                View All <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredMixtapes.map(mix => (
                <Link to={`/mixtapes/${mix.id}`} key={mix.id}>
                    <GlassCard className="h-full group">
                        <div className="relative aspect-square overflow-hidden rounded-lg mb-4">
                            <img src={mix.coverUrl} alt={mix.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-12 h-12 bg-flowerz-purple rounded-full flex items-center justify-center">
                                    <Play className="w-6 h-6 fill-white text-white ml-1" />
                                </div>
                            </div>
                        </div>
                        <h3 className="text-xl font-bold mb-1 truncate">{mix.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{mix.genre} • {mix.year}</p>
                    </GlassCard>
                </Link>
            ))}
        </div>
        <div className="mt-8 text-center md:hidden">
            <Link to="/mixtapes"><Button variant="outline" className="w-full">View All Mixtapes</Button></Link>
        </div>
      </Section>

      {/* 5. YouTube Section */}
      <Section className="relative z-10">
        <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest on YouTube</h2>
            <p className="text-gray-400">Catch the vibe visually. Subscribe for weekly updates.</p>
        </div>
        <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl border border-white/10">
            <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG" 
                title="DJ Flowerz YouTube" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
            ></iframe>
        </div>
        <div className="text-center mt-8">
            <a href="https://youtube.com" target="_blank" rel="noreferrer">
                <Button variant="outline" className="mx-auto">Subscribe to Channel</Button>
            </a>
        </div>
      </Section>
      
      {/* 6. Newsletter Dedicated Section */}
      <NewsletterSection />
    </div>
  );
};
