import { handleSubscription } from '../services/payment-examples';

// Example 1: Subscribe to Monthly Plan
const subscribeMonthly = async (userEmail: string) => {
    await handleSubscription(
        'PLN_tcud1nkidei4mmk', // Monthly plan code
        'Monthly Access',
        700, // KES 700
        userEmail
    );
};

// Example 2: Subscribe to Annual Plan (Best Value)
const subscribeAnnually = async (userEmail: string) => {
    await handleSubscription(
        'PLN_6l6w79o3p2dveo4', // Annual plan code
        '12 Months Access',
        6000, // KES 6,000
        userEmail
    );
};

// Example 3: Using the SubscriptionSelector Component
// In your React component:
/*
import { SubscriptionSelector } from './components/SubscriptionSelector';

function SubscriptionPage() {
    const user = useUser(); // Get from your auth context

    return (
        <SubscriptionSelector 
            userEmail={user.email}
            onSubscriptionSuccess={(reference) => {
                console.log('Subscription created:', reference);
                // Redirect to success page or show confirmation
            }}
        />
    );
}
*/

// Example 4: Check Subscription Status (Backend Webhook)
/*
When Paystack sends webhook events:

1. subscription.create - New subscription started
   → Update user.subscription_status = 'active'
   → Set user.subscription_valid_until = next_billing_date

2. invoice.payment_succeeded - Monthly renewal succeeded
   → Extend user.subscription_valid_until by 1 month

3. subscription.disable - User cancelled
   → Update user.subscription_status = 'cancelled'
*/

// Example 5: Protect Music Pool Access
export const checkSubscriptionAccess = async (userId: string): Promise<boolean> => {
    // Query user from database
    // const user = await db.getUser(userId);

    // Check if subscription is active and not expired
    // return user.subscription_status === 'active' && 
    //        new Date(user.subscription_valid_until) > new Date();

    return true; // Placeholder
};
