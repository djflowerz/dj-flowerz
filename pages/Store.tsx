
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate, useParams } from 'react-router-dom';
import { db } from '../services/insforge';
import { Product, CartItem, Order, User, ProductCategory, ProductType } from '../types';
import { PageHeader, Section, GlassCard, Button, Badge, Input, Label } from '../components/UI';
import { ShoppingCart, Trash2, CreditCard, Check, Monitor, ArrowLeft, Download, ShieldCheck, Info, Truck, Box, Plus, Minus, XCircle, Search, Filter, SlidersHorizontal, ShoppingBag, Share2, CheckCircle } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useAppUser } from '../App';

// Client-Side Cart Logic
const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
        window.dispatchEvent(new Event('cart-updated'));
    }, [cart]);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) return prev.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
            return [...prev, { ...product, quantity: 1 }];
        });
        alert(`${product.name} added to cart!`);
    };

    const updateQuantity = (id: string, delta: number) => {
        setCart(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantity + delta;
                return { ...item, quantity: Math.max(0, newQuantity) };
            }
            return item;
        }).filter(item => item.quantity > 0));
    };

    const removeFromCart = (id: string) => setCart(prev => prev.filter(p => p.id !== id));

    const clearCart = () => setCart([]);

    const total = cart.reduce((sum, item) => sum + ((item.discountPrice || item.price) * item.quantity), 0);

    return { cart, addToCart, updateQuantity, removeFromCart, clearCart, total };
};

export const Store = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);

    // Filters
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [selectedType, setSelectedType] = useState<'ALL' | 'DIGITAL' | 'PHYSICAL'>('ALL');

    useEffect(() => {
        db.getProducts().then(prods => {
            const published = prods.filter(p => p.status === 'PUBLISHED');
            setProducts(published);
            setFilteredProducts(published);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        let result = products;

        if (search) {
            result = result.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.tagline?.toLowerCase().includes(search.toLowerCase()));
        }

        if (selectedCategory !== 'All') {
            result = result.filter(p => p.category === selectedCategory);
        }

        if (selectedType !== 'ALL') {
            result = result.filter(p => p.type === selectedType);
        }

        setFilteredProducts(result);
    }, [search, selectedCategory, selectedType, products]);

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];

    return (
        <div className="min-h-screen pt-20">
            <PageHeader title="Digital Store" subtitle="Professional software, FX packs, and DJ tools." image="https://picsum.photos/1920/1080?blur=2" />

            {/* Filter Bar */}
            <div className="sticky top-20 z-40 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-3 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-flowerz-blue transition-all"
                        />
                    </div>

                    <div className="flex gap-4 overflow-x-auto pb-2 lg:pb-0">
                        {/* Category Dropdown */}
                        <div className="relative min-w-[200px]">
                            <Filter className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-8 py-2.5 text-white focus:outline-none focus:border-flowerz-blue appearance-none cursor-pointer"
                            >
                                {categories.map(c => <option key={c} value={c} className="bg-gray-900">{String(c).replace('_', ' ')}</option>)}
                            </select>
                        </div>

                        {/* Type Toggle */}
                        <div className="flex bg-white/5 rounded-xl p-1 border border-white/10">
                            <button
                                onClick={() => setSelectedType('ALL')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedType === 'ALL' ? 'bg-gray-700 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setSelectedType('DIGITAL')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedType === 'DIGITAL' ? 'bg-flowerz-blue text-black shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Digital
                            </button>
                            <button
                                onClick={() => setSelectedType('PHYSICAL')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${selectedType === 'PHYSICAL' ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'}`}
                            >
                                Physical
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <Section>
                {loading ? <div className="text-center py-20 text-gray-500">Loading products...</div> : filteredProducts.length === 0 ? (
                    <div className="text-center py-20">
                        <ShoppingBag className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                        <h3 className="text-xl font-bold text-gray-400">No products found</h3>
                        <p className="text-gray-500">Try changing your search or filters.</p>
                        <Button variant="ghost" className="mt-4" onClick={() => { setSearch(''); setSelectedCategory('All'); setSelectedType('ALL'); }}>Clear Filters</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map(product => (
                            <Link to={`/store/${product.id}`} key={product.id}>
                                <GlassCard className="flex flex-col h-full group hover:bg-white/10 transition-colors">
                                    <div className="aspect-square bg-gray-800 rounded-lg mb-4 overflow-hidden relative">
                                        <img src={product.coverUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        {product.discountPrice && (
                                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                SALE
                                            </div>
                                        )}
                                        {product.type === 'PHYSICAL' && (
                                            <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg">
                                                HARDWARE
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-col mb-2">
                                            <h3 className="font-bold text-lg leading-tight text-white group-hover:text-flowerz-blue transition-colors">{product.name}</h3>
                                            <p className="text-xs text-gray-400 mt-1">{product.tagline}</p>
                                        </div>
                                        <div className="flex items-center gap-2 mb-4">
                                            {product.discountPrice ? (
                                                <>
                                                    <span className="font-bold text-flowerz-blue">KES {product.discountPrice.toLocaleString()}</span>
                                                    <span className="text-xs text-gray-500 line-through">KES {product.price.toLocaleString()}</span>
                                                </>
                                            ) : (
                                                <span className="font-bold text-flowerz-blue">KES {product.price.toLocaleString()}</span>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        onClick={(e) => { e.preventDefault(); addToCart(product); }}
                                        className="w-full mt-auto"
                                        variant="secondary"
                                    >
                                        Add to Cart
                                    </Button>
                                </GlassCard>
                            </Link>
                        ))}
                    </div>
                )}
            </Section>
        </div>
    );
};

export const ProductSingle = () => {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            db.getProducts().then(prods => setProduct(prods.find(p => p.id === id) || null));
        }
    }, [id]);

    const handleShare = () => {
        if (!product) return;
        const url = `${window.location.origin}/#/store/${product.id}`;
        navigator.clipboard.writeText(url).then(() => {
            alert(`Link for "${product.name}" copied to clipboard!`);
        });
    };

    if (!product) return <div className="pt-40 text-center">Loading product...</div>;
    const activePrice = product.discountPrice || product.price;

    return (
        <div className="min-h-screen pt-24 px-4 max-w-7xl mx-auto">
            <button onClick={() => navigate('/store')} className="flex items-center text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Store
            </button>
            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-4">
                    <div className="aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
                        <img src={product.coverUrl} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                </div>
                <div className="space-y-8">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-2">{product.name}</h1>
                        <p className="text-xl text-gray-400">{product.tagline}</p>
                    </div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10 flex flex-col sm:flex-row justify-between items-center gap-6">
                        <div>
                            <div className="text-sm text-gray-400 mb-1">Price</div>
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-white">KES {activePrice.toLocaleString()}</span>
                            </div>
                        </div>
                        <Button size="lg" onClick={() => addToCart(product)} className="w-full sm:w-auto shadow-lg shadow-flowerz-purple/20">
                            Add to Cart
                        </Button>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-3 flex items-center"><Info className="w-5 h-5 mr-2 text-flowerz-blue" /> Description</h3>
                        <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    )
};

export const Cart = () => {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const navigate = useNavigate();
    return (
        <div className="min-h-screen pt-32 max-w-4xl mx-auto px-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Shopping Cart</h1>
                {cart.length > 0 && <Button variant="ghost" size="sm" onClick={() => { if (confirm('Clear?')) clearCart() }}>Clear Cart</Button>}
            </div>
            {cart.length === 0 ? <div className="text-center py-12"><p>Empty</p><Link to="/store"><Button>Shop</Button></Link></div> : (
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center bg-white/5 p-4 rounded-xl">
                                <img src={item.coverUrl} className="w-16 h-16 rounded" />
                                <div className="ml-4 flex-1">
                                    <div className="font-bold">{item.name}</div>
                                    <div className="text-flowerz-blue">KES {(item.discountPrice || item.price).toLocaleString()}</div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => updateQuantity(item.id, -1)}><Minus className="w-4 h-4" /></button>
                                    <span>{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)}><Plus className="w-4 h-4" /></button>
                                </div>
                                <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-400"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-4">Total: KES {total.toLocaleString()}</h3>
                            <Button onClick={() => navigate('/checkout')} className="w-full">Checkout</Button>
                        </GlassCard>
                    </div>
                </div>
            )}
        </div>
    )
};

export const Checkout = () => {
    const [searchParams] = useSearchParams();
    const planId = searchParams.get('plan');
    const { cart, clearCart, total } = useCart();
    const { user, loading: userLoading } = useAppUser();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Shipping State
    const [shippingForm, setShippingForm] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        region: ''
    });

    useEffect(() => {
        if (!userLoading && !user) navigate('/login?redirect=checkout');
    }, [user, userLoading, navigate]);

    // Check if we need shipping info
    const requiresShipping = cart.some(item => item.type === 'PHYSICAL');

    // Calculate checkout amount
    let amount = total;
    let description = "Store Purchase";

    // Check if we are buying a subscription instead
    const plans: Record<string, number> = {
        '1_WEEK': 200,
        '1_MONTH': 700,
        '3_MONTHS': 1800,
        '6_MONTHS': 3500,
        '12_MONTHS': 6000
    };

    if (planId && plans[planId]) {
        amount = plans[planId];
        description = `Music Pool - ${planId.replace('_', ' ')}`;
    }

    // Add shipping costs if applicable
    const shippingTotal = requiresShipping ? cart.reduce((sum, item) => sum + ((item.shipping?.cost || 0) * item.quantity), 0) : 0;
    const finalAmount = amount + shippingTotal;

    const handlePaymentSuccess = async (reference: any) => {
        setLoading(true);
        try {
            if (planId && user) {
                await db.updateUserSubscription(user.id, planId as any);
            } else if (user) {
                const order: Order = {
                    id: crypto.randomUUID(),
                    userId: user.id,
                    items: cart,
                    total: finalAmount,
                    status: 'COMPLETED',
                    createdAt: new Date().toISOString(),
                    paymentRef: reference.reference,
                    shippingAddress: requiresShipping ? shippingForm : undefined
                };
                await db.createOrder(order);
                clearCart();
            }
            navigate('/payment-success');
        } catch (error) {
            console.error(error);
            alert('Something went wrong recording your order. Please contact support with ref: ' + reference.reference);
        } finally {
            setLoading(false);
        }
    };

    if (userLoading || !user) return <div className="pt-32 text-center text-gray-500">Loading user data...</div>;

    // PAYSTACK CONFIG
    const paystackConfig = {
        reference: (new Date()).getTime().toString(),
        email: user.email,
        amount: Math.ceil(finalAmount * 100), // Kobo/Cents
        publicKey: 'pk_live_2ed6a5c46ebab203998efd1f5d9c22d2dcc05f71',
        currency: 'KES',
        metadata: {
            custom_fields: [
                { display_name: "Customer Name", variable_name: "name", value: shippingForm.fullName || user.name },
                { display_name: "Phone", variable_name: "phone", value: shippingForm.phone || user.phone || '' }
            ]
        }
    };

    const initializePayment = usePaystackPayment(paystackConfig);

    const triggerPayment = (e: React.FormEvent) => {
        e.preventDefault();
        initializePayment(handlePaymentSuccess, () => {
            console.log("Payment closed");
        });
    };

    return (
        <div className="min-h-screen pt-32 flex justify-center px-4 pb-20">
            <div className="w-full max-w-2xl">
                <h1 className="text-3xl font-bold mb-8 text-center">Checkout</h1>

                <form onSubmit={triggerPayment} className="grid md:grid-cols-2 gap-8">
                    {/* Shipping Info Form (Conditional) */}
                    {requiresShipping ? (
                        <div className="space-y-6">
                            <GlassCard>
                                <h3 className="text-xl font-bold mb-4 flex items-center"><Truck className="w-5 h-5 mr-2" /> Shipping Address</h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Full Name</Label>
                                        <Input required value={shippingForm.fullName} onChange={e => setShippingForm({ ...shippingForm, fullName: e.target.value })} placeholder="John Doe" />
                                    </div>
                                    <div>
                                        <Label>Phone Number</Label>
                                        <Input required type="tel" value={shippingForm.phone} onChange={e => setShippingForm({ ...shippingForm, phone: e.target.value })} placeholder="07..." />
                                    </div>
                                    <div>
                                        <Label>Street Address / Building</Label>
                                        <Input required value={shippingForm.street} onChange={e => setShippingForm({ ...shippingForm, street: e.target.value })} placeholder="Westlands, Mpaka Rd" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label>City</Label>
                                            <Input required value={shippingForm.city} onChange={e => setShippingForm({ ...shippingForm, city: e.target.value })} placeholder="Nairobi" />
                                        </div>
                                        <div>
                                            <Label>Region</Label>
                                            <Input required value={shippingForm.region} onChange={e => setShippingForm({ ...shippingForm, region: e.target.value })} placeholder="Nairobi County" />
                                        </div>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    ) : (
                        <div className="md:col-span-1">
                            <GlassCard className="h-full flex flex-col justify-center items-center text-center p-8">
                                <Download className="w-16 h-16 text-flowerz-blue mb-4 opacity-50" />
                                <h3 className="text-xl font-bold">Instant Digital Delivery</h3>
                                <p className="text-gray-400 mt-2">Your files will be available for download immediately after payment in your profile.</p>
                            </GlassCard>
                        </div>
                    )}

                    {/* Order Summary */}
                    <div>
                        <GlassCard className="sticky top-24">
                            <h3 className="text-xl font-bold mb-6">Order Summary</h3>

                            <div className="bg-white/5 p-4 rounded-lg mb-6">
                                <p className="text-sm text-gray-400 mb-1">Items</p>
                                <p className="font-bold text-lg">{description}</p>
                                {cart.length > 0 && !planId && <p className="text-xs text-gray-500 mt-1">{cart.length} items in cart</p>}
                            </div>

                            <div className="space-y-3 mb-6 border-b border-white/10 pb-4">
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>KES {amount.toLocaleString()}</span>
                                </div>
                                {requiresShipping && (
                                    <div className="flex justify-between text-gray-300">
                                        <span>Shipping</span>
                                        <span>KES {shippingTotal.toLocaleString()}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center mb-8">
                                <span className="text-gray-300 font-bold">Total to pay</span>
                                <span className="text-2xl font-bold text-flowerz-blue">KES {finalAmount.toLocaleString()}</span>
                            </div>

                            <Button type="submit" disabled={loading} className="w-full flex justify-center items-center py-4 text-lg">
                                <CreditCard className="mr-2 w-6 h-6" />
                                {loading ? 'Processing...' : 'Pay Now'}
                            </Button>

                            <p className="text-xs text-center text-gray-500 mt-4 flex items-center justify-center">
                                <ShieldCheck className="w-3 h-3 mr-1" /> Secured by Paystack
                            </p>
                        </GlassCard>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const PaymentSuccess = () => {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-4">
            <GlassCard className="text-center p-12 max-w-lg w-full border-green-500/30">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-400" />
                </div>
                <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
                <p className="text-gray-400 mb-8">Your transaction has been processed securely. Your items are now available in your dashboard.</p>
                <div className="flex gap-4 justify-center">
                    <Link to="/profile">
                        <Button>View Order & Downloads</Button>
                    </Link>
                    <Link to="/">
                        <Button variant="secondary">Back Home</Button>
                    </Link>
                </div>
            </GlassCard>
        </div>
    )
}
