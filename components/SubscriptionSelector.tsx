import React, { useState } from 'react';
import { SUBSCRIPTION_PLANS, formatKES, SubscriptionPlan } from '../../config/subscriptionPlans';
import { payWithPaystack } from '../../services/paystack';
import { CheckCircle, Zap } from 'lucide-react';

interface SubscriptionSelectorProps {
    userEmail: string;
    onSubscriptionSuccess?: (reference: string) => void;
}

export const SubscriptionSelector: React.FC<SubscriptionSelectorProps> = ({
    userEmail,
    onSubscriptionSuccess
}) => {
    const [selectedPlan, setSelectedPlan] = useState<string>('monthly');
    const [processing, setProcessing] = useState(false);

    const handleSubscribe = (plan: SubscriptionPlan) => {
        if (!userEmail) {
            alert('Please log in to subscribe');
            return;
        }

        setProcessing(true);

        payWithPaystack(
            userEmail,
            plan.amount,
            true, // Is subscription
            plan.planCode,
            '', // No specific product
            (reference) => {
                console.log('Subscription successful:', reference);
                setProcessing(false);
                if (onSubscriptionSuccess) {
                    onSubscriptionSuccess(reference);
                } else {
                    window.location.href = `/payment-success?reference=${reference}&type=subscription`;
                }
            },
            () => {
                console.log('Subscription cancelled');
                setProcessing(false);
            }
        );
    };

    return (
        <div className="py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold mb-4">Choose Your Plan</h2>
                    <p className="text-xl text-gray-400">
                        Get unlimited access to the DJ Flowerz Music Pool
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                    {SUBSCRIPTION_PLANS.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative rounded-2xl p-6 border-2 transition-all cursor-pointer ${selectedPlan === plan.id
                                    ? 'border-purple-500 bg-purple-500/10'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                } ${plan.popular ? 'ring-2 ring-purple-500' : ''}`}
                            onClick={() => setSelectedPlan(plan.id)}
                        >
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        POPULAR
                                    </div>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-xl font-bold mb-2">{plan.name}</h3>

                            {/* Price */}
                            <div className="mb-4">
                                <div className="text-3xl font-bold text-purple-400">
                                    {formatKES(plan.amount)}
                                </div>
                                <div className="text-sm text-gray-400">{plan.intervalLabel}</div>
                            </div>

                            {/* Savings */}
                            {plan.savings && (
                                <div className="mb-4 text-sm text-green-400 font-semibold">
                                    💰 {plan.savings}
                                </div>
                            )}

                            {/* Features */}
                            <ul className="space-y-2 mb-6">
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Select Indicator */}
                            {selectedPlan === plan.id && (
                                <div className="absolute top-4 right-4">
                                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Subscribe Button */}
                <div className="mt-12 text-center">
                    <button
                        onClick={() => {
                            const plan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlan);
                            if (plan) handleSubscribe(plan);
                        }}
                        disabled={processing}
                        className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                        {processing ? 'Processing...' : 'Subscribe Now'}
                    </button>
                    <p className="mt-4 text-sm text-gray-400">
                        Secure payment via Paystack • Cancel anytime
                    </p>
                </div>

                {/* Info */}
                <div className="mt-12 text-center text-sm text-gray-400 space-y-2">
                    <p>✓ Instant access after payment</p>
                    <p>✓ Automatic renewal • Cancel anytime from your account</p>
                    <p>✓ M-Pesa & Card payments accepted</p>
                </div>
            </div>
        </div>
    );
};
