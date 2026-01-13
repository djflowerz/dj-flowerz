import React, { useState } from 'react';
import { Package, Download, ShoppingCart } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

interface Product {
    id: string;
    name: string;
    price: number;
    type: 'physical' | 'digital';
    description?: string;
    images?: string[];
    weight_kg?: number;
    digital_file_path?: string;
}

interface ProductCheckoutProps {
    product: Product;
    userEmail: string;
}

interface ShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    county: string;
    postalCode?: string;
}

export const ProductCheckout: React.FC<ProductCheckoutProps> = ({ product, userEmail }) => {
    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        fullName: '',
        phone: '',
        address: '',
        city: '',
        county: '',
        postalCode: ''
    });
    const [processing, setProcessing] = useState(false);

    const handleCheckout = async () => {
        // Validate shipping address for physical products
        if (product.type === 'physical') {
            if (!shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.address || !shippingAddress.city) {
                alert('Please fill in all required shipping details');
                return;
            }
        }

        setProcessing(true);

        try {
            const payload = {
                email: userEmail,
                amount: product.price,
                currency: 'KES', // Explicitly set currency to KES
                productId: product.id,
                productType: product.type,
                productName: product.name,
                address: product.type === 'physical' ? shippingAddress : null
            };

            const response = await fetch(API_ENDPOINTS.STORE_CHECKOUT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.status && data.data.authorization_url) {
                // Redirect to Paystack payment page
                window.location.href = data.data.authorization_url;
            } else {
                throw new Error(data.error || 'Checkout failed');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            alert('Checkout failed. Please try again.');
            setProcessing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            {/* Product Summary */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                <div className="flex items-start gap-4">
                    {product.images && product.images[0] && (
                        <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-24 h-24 object-cover rounded-lg"
                        />
                    )}
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            {product.type === 'digital' ? (
                                <Download className="w-5 h-5 text-purple-400" />
                            ) : (
                                <Package className="w-5 h-5 text-blue-400" />
                            )}
                            <span className="text-sm text-gray-400 uppercase">
                                {product.type === 'digital' ? 'Digital Download' : 'Physical Product'}
                            </span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                        {product.description && (
                            <p className="text-gray-400 mb-4">{product.description}</p>
                        )}
                        <div className="text-3xl font-bold text-purple-400">
                            KES {product.price.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {/* Shipping Form (Physical Products Only) */}
            {product.type === 'physical' && (
                <div className="bg-white/5 border border-white/10 rounded-lg p-6 mb-6">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Shipping Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Full Name *</label>
                            <input
                                type="text"
                                value={shippingAddress.fullName}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, fullName: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                placeholder="John Doe"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Phone Number *</label>
                            <input
                                type="tel"
                                value={shippingAddress.phone}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, phone: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                placeholder="+254 700 000 000"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">City *</label>
                            <input
                                type="text"
                                value={shippingAddress.city}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                placeholder="Nairobi"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium mb-2">Street Address *</label>
                            <input
                                type="text"
                                value={shippingAddress.address}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, address: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                placeholder="123 Main Street, Apartment 4B"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">County *</label>
                            <input
                                type="text"
                                value={shippingAddress.county}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, county: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                placeholder="Nairobi County"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Postal Code</label>
                            <input
                                type="text"
                                value={shippingAddress.postalCode}
                                onChange={(e) => setShippingAddress({ ...shippingAddress, postalCode: e.target.value })}
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:border-purple-500 outline-none"
                                placeholder="00100"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Digital Product Info */}
            {product.type === 'digital' && (
                <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-300">
                        ✓ Instant delivery via email after payment<br />
                        ✓ Download link valid for 30 days<br />
                        ✓ Secure and encrypted download
                    </p>
                </div>
            )}

            {/* Checkout Button */}
            <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-bold text-lg transition-all transform hover:scale-105"
            >
                <ShoppingCart className="w-5 h-5" />
                {processing ? 'Processing...' : `Pay KES ${product.price.toLocaleString()}`}
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
                Secure payment via Paystack • M-Pesa & Card accepted
            </p>
        </div>
    );
};
