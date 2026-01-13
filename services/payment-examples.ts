import { payWithPaystack } from '../services/paystack';
import { db } from '../services/insforge';

/**
 * Example: Initialize a one-time product purchase
 */
export const handleProductPurchase = async (productId: string, price: number, userEmail: string) => {
    try {
        // Create pending order in database
        await db.createOrder({
            productId,
            customerEmail: userEmail,
            amount: price,
            status: 'pending',
            reference: `ORDER_${Date.now()}`
        });

        // Launch Paystack popup
        payWithPaystack(
            userEmail,
            price,
            false, // Not a subscription
            "", // No plan code
            productId,
            (reference) => {
                console.log('Payment successful:', reference);
                // Redirect or show success message
                window.location.href = `/payment-success?reference=${reference}`;
            },
            () => {
                console.log('Payment cancelled');
                alert('Payment was cancelled');
            }
        );
    } catch (error) {
        console.error('Purchase failed:', error);
        alert('Failed to initiate purchase');
    }
};

/**
 * Example: Initialize a subscription
 */
export const handleSubscription = async (
    planCode: string,
    planName: string,
    amount: number,
    userEmail: string
) => {
    try {
        // Create pending subscription order
        await db.createOrder({
            customerEmail: userEmail,
            amount,
            status: 'pending',
            planCode,
            reference: `SUB_${Date.now()}`
        });

        // Launch Paystack popup with plan code
        payWithPaystack(
            userEmail,
            amount,
            true, // Is a subscription
            planCode,
            "", // No specific product
            (reference) => {
                console.log('Subscription successful:', reference);
                window.location.href = `/payment-success?reference=${reference}&type=subscription`;
            },
            () => {
                console.log('Subscription cancelled');
                alert('Subscription was cancelled');
            }
        );
    } catch (error) {
        console.error('Subscription failed:', error);
        alert('Failed to initiate subscription');
    }
};

/**
 * Example: Verify payment on success page
 */
export const verifyPaymentOnSuccess = async (reference: string) => {
    try {
        const response = await fetch(`http://localhost:3001/api/paystack/verify/${reference}`);
        const result = await response.json();

        if (result.status === 'success') {
            // Update order status in database
            await db.updateOrderStatus(reference, 'paid');
            return result;
        } else {
            throw new Error('Payment verification failed');
        }
    } catch (error) {
        console.error('Verification error:', error);
        throw error;
    }
};
