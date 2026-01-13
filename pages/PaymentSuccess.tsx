import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GlassCard, Button } from '../components/UI';
import { CheckCircle, XCircle, Loader2, Download } from 'lucide-react';
import { verifyTransaction } from '../services/paystack';

export const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const reference = searchParams.get('reference'); // Paystack standard return param (often 'reference' or 'trxref')
    const trxref = searchParams.get('trxref');

    const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');

    useEffect(() => {
        const check = async () => {
            const ref = reference || trxref;
            if (!ref) {
                setStatus('failed');
                return;
            }

            try {
                const isValid = await verifyTransaction(ref);
                if (isValid) {
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch (e) {
                setStatus('failed');
            }
        };

        check();
    }, [reference, trxref]);

    if (status === 'verifying') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <GlassCard className="text-center max-w-md p-8">
                    <Loader2 className="w-16 h-16 text-flowerz-purple animate-spin mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold mb-2">Verifying Payment</h2>
                    <p className="text-gray-400">Please wait while we confirm your transaction...</p>
                </GlassCard>
            </div>
        );
    }

    if (status === 'failed') {
        return (
            <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
                <GlassCard className="text-center max-w-md p-8 border-red-500/30">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-display font-bold mb-2">Verification Failed</h2>
                    <p className="text-gray-400 mb-6">We couldn't confirm your payment. If you were charged, please contact support.</p>
                    <div className="flex gap-4 justify-center">
                        <Button variant="outline" onClick={() => navigate('/contact')}>Contact Support</Button>
                        <Button onClick={() => navigate('/')}>Back Home</Button>
                    </div>
                </GlassCard>
            </div>
        );
    }

    // SUCCESS
    return (
        <div className="min-h-screen pt-24 px-4 flex items-center justify-center">
            <GlassCard className="text-center max-w-md p-8 border-green-500/30 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-flowerz-purple to-flowerz-blue animate-pulse" />
                <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                <h2 className="text-2xl font-display font-bold mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-6">Thank you for your purchase. Your digital downloads have been sent to your email.</p>

                <div className="flex flex-col gap-3">
                    <Button onClick={() => navigate('/profile')} className="w-full">
                        Go to My Profile
                    </Button>
                    <Button variant="ghost" onClick={() => navigate('/')}>
                        Continue Shopping
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
};
