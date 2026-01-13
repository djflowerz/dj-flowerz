import React, { useState } from 'react';
import { PageHeader, Section, GlassCard, Button, Input, Label } from '../components/UI';
import { db, PAYSTACK_PUBLIC_KEY } from '../services/insforge';
import { verifyTransaction } from '../services/paystack';
import { CreditCard, Heart, ShieldCheck } from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import { useAppUser } from '../App';
import { useNavigate } from 'react-router-dom';

export const TipJar = () => {
    const { user } = useAppUser();
    const navigate = useNavigate();
    const [amount, setAmount] = useState<number>(100);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    // Default email if user is not logged in (anonymous tip)
    const email = user?.email || 'guest@djflowerz.com';

    const config = {
        reference: (new Date()).getTime().toString(),
        email: email,
        amount: amount * 100, // Paystack uses cents/kobo
        currency: 'KES',
        publicKey: PAYSTACK_PUBLIC_KEY,
        metadata: {
            product_type: 'tip',
            custom_fields: [
                { display_name: "Tipper Name", variable_name: "name", value: name || user?.name || "Anonymous" },
                { display_name: "Message", variable_name: "message", value: message }
            ]
        }
    };

    const initializePayment = usePaystackPayment(config);

    const onSuccess = async (reference: any) => {
        setLoading(true);
        try {
            // Securely verify payment on backend
            const isValid = await verifyTransaction(reference.reference);
            if (!isValid) throw new Error("Payment verification failed");

            await db.sendTip({
                id: reference.reference,
                senderName: name || user?.name || 'Anonymous',
                amount,
                message,
                createdAt: new Date().toISOString()
            });
            alert('Thank you for your support! ❤️');
            setMessage('');
            setAmount(100);
            navigate('/');
        } catch (error) {
            console.error("Tip record error", error);
            alert('Tip received but failed to record. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    const onClose = () => {
        setLoading(false);
        alert('Payment cancelled');
    };

    const handleTip = (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || amount < 10) {
            alert('Minimum tip amount is KES 10');
            return;
        }
        setLoading(true);
        (initializePayment as any)(onSuccess, onClose);
    };

    return (
        <div className="min-h-screen pt-20">
            <PageHeader title="Tip Jar" subtitle="Support DJ Flowerz content creation." image="https://picsum.photos/1920/1080?grayscale&blur=2" />

            <Section className="flex justify-center -mt-20 relative z-10">
                <GlassCard className="w-full max-w-lg p-8">
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 bg-pink-500/20 rounded-full flex items-center justify-center animate-pulse">
                            <Heart className="w-8 h-8 text-pink-500 fill-pink-500" />
                        </div>
                    </div>

                    <h2 className="text-2xl font-bold text-center mb-6">Show Some Love</h2>

                    <form onSubmit={handleTip} className="space-y-4">
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {[100, 500, 1000, 2000].map(val => (
                                <button
                                    key={val}
                                    type="button"
                                    onClick={() => setAmount(val)}
                                    className={`py-2 rounded-lg border transition-colors text-sm ${amount === val ? 'bg-flowerz-purple border-flowerz-purple text-white' : 'border-white/10 hover:bg-white/5'}`}
                                >
                                    KES {val}
                                </button>
                            ))}
                        </div>

                        <div>
                            <Label>Custom Amount (KES)</Label>
                            <Input type="number" min="1" value={amount} onChange={e => setAmount(Number(e.target.value))} />
                        </div>

                        <div>
                            <Label>Your Name (Optional)</Label>
                            <Input value={name} onChange={e => setName(e.target.value)} placeholder={user?.name || "Fan #1"} />
                        </div>

                        <div>
                            <Label>Message (Optional)</Label>
                            <textarea
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-flowerz-blue"
                                rows={3}
                                value={message}
                                onChange={e => setMessage(e.target.value)}
                                placeholder="Keep the mixes coming!"
                            ></textarea>
                        </div>

                        <Button type="submit" disabled={loading} className="w-full flex justify-center items-center gap-2">
                            <CreditCard className="w-5 h-5" /> {loading ? 'Processing...' : `Tip KES ${amount.toLocaleString()}`}
                        </Button>

                        <p className="text-xs text-center text-gray-500 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Secured by Paystack
                        </p>
                    </form>
                </GlassCard>
            </Section>
        </div>
    );
};
