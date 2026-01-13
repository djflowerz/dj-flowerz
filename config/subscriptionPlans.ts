/**
 * DJ Flowerz Subscription Plans
 * Synced with Paystack Dashboard (2026)
 */

export interface SubscriptionPlan {
    id: string;
    name: string;
    planCode: string;
    amount: number; // KES
    interval: 'weekly' | 'monthly' | 'quarterly' | 'biannually' | 'annually';
    intervalLabel: string;
    features: string[];
    popular?: boolean;
    savings?: string;
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
    {
        id: 'weekly',
        name: '1 Week Access',
        planCode: 'PLN_oeralasipob89ri',
        amount: 200,
        interval: 'weekly',
        intervalLabel: 'per week',
        features: [
            'Access to Music Pool',
            'Download unlimited tracks',
            'Weekly updates',
            'Cancel anytime'
        ]
    },
    {
        id: 'monthly',
        name: '1 Month Access',
        planCode: 'PLN_tcud1nkidei4mmk',
        amount: 700,
        interval: 'monthly',
        intervalLabel: 'per month',
        popular: true,
        savings: 'Save KES 100 vs weekly',
        features: [
            'Access to Music Pool',
            'Download unlimited tracks',
            'Monthly exclusive mixes',
            'Priority support',
            'Cancel anytime'
        ]
    },
    {
        id: 'quarterly',
        name: '3 Months Access',
        planCode: 'PLN_esenkdgprpl2xl9',
        amount: 1800,
        interval: 'quarterly',
        intervalLabel: 'per 3 months',
        savings: 'Save KES 300',
        features: [
            'Access to Music Pool',
            'Download unlimited tracks',
            'Quarterly exclusive content',
            'Priority support',
            'Early access to new releases',
            'Cancel anytime'
        ]
    },
    {
        id: 'biannually',
        name: '6 Months Access',
        planCode: 'PLN_q8xamkxsqjhbsxt',
        amount: 3500,
        interval: 'biannually',
        intervalLabel: 'per 6 months',
        savings: 'Save KES 700',
        features: [
            'Access to Music Pool',
            'Download unlimited tracks',
            'Exclusive DJ sets',
            'Priority support',
            'Early access to new releases',
            'Personalized playlists',
            'Cancel anytime'
        ]
    },
    {
        id: 'annually',
        name: '12 Months Access',
        planCode: 'PLN_6l6w79o3p2dveo4',
        amount: 6000,
        interval: 'annually',
        intervalLabel: 'per year',
        savings: 'Save KES 2,400 - Best Value!',
        features: [
            'Access to Music Pool',
            'Download unlimited tracks',
            'Exclusive DJ sets & remixes',
            'VIP support',
            'Early access to new releases',
            'Personalized playlists',
            'Exclusive merchandise discounts',
            'Cancel anytime'
        ]
    }
];

/**
 * Get a plan by its ID
 */
export const getPlanById = (id: string): SubscriptionPlan | undefined => {
    return SUBSCRIPTION_PLANS.find(plan => plan.id === id);
};

/**
 * Get a plan by its Paystack plan code
 */
export const getPlanByCode = (planCode: string): SubscriptionPlan | undefined => {
    return SUBSCRIPTION_PLANS.find(plan => plan.planCode === planCode);
};

/**
 * Format KES amount
 */
export const formatKES = (amount: number): string => {
    return `KES ${amount.toLocaleString()}`;
};
