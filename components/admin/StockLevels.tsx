import React, { useState, useEffect } from 'react';
import { db } from '../../services/insforge';
import { Product } from '../../types';
import { GlassCard, Badge } from '../UI';
import { AlertTriangle, Package } from 'lucide-react';

export const StockLevels = () => {
    const [lowStockProducts, setLowStockProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const products = await db.getProducts();
                // "Stock Levels Below 5 Units" as per kilakitu Setup
                const low = products.filter(p => p.type === 'PHYSICAL' && p.stock !== undefined && p.stock < 5);
                setLowStockProducts(low);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="space-y-6 animate-slide-up">
            <GlassCard>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-500" /> Stock Alerts
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                    Showing physical products with stock levels below 5 units.
                </p>

                {loading ? (
                    <div className="text-center p-8">Loading...</div>
                ) : lowStockProducts.length === 0 ? (
                    <div className="text-center p-8 text-green-400 border border-green-500/20 rounded-lg bg-green-500/5">
                        <Package className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No low stock alerts. All inventory levels are healthy.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm text-gray-400">
                            <thead className="text-xs uppercase bg-white/5 text-gray-300">
                                <tr>
                                    <th className="p-3">Product Name</th>
                                    <th className="p-3">Category</th>
                                    <th className="p-3">Price</th>
                                    <th className="p-3">Stock Left</th>
                                    <th className="p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lowStockProducts.map(p => (
                                    <tr key={p.id} className="border-b border-white/5 bg-red-500/5">
                                        <td className="p-3 font-medium text-white flex items-center gap-3">
                                            <img src={p.coverUrl} className="w-8 h-8 rounded bg-black" alt="" />
                                            {p.name}
                                        </td>
                                        <td className="p-3">{p.category}</td>
                                        <td className="p-3">KES {p.price}</td>
                                        <td className="p-3 font-bold text-red-400">{p.stock}</td>
                                        <td className="p-3"><Badge color="red">LOW STOCK</Badge></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </GlassCard>
        </div>
    );
};
