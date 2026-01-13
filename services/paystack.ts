import { PAYSTACK_PUBLIC_KEY, db } from './insforge';
import { API_ENDPOINTS } from '../config/api';

declare global {
    interface Window {
        PaystackPop: any;
    }
}

/**
 * Triggers the Paystack Popup for Payment
 * 
 * @param email - User's email address
 * @param amount - Amount in KES (without minor units, fx will convert)
 * @param isSubscription - If true, treats valid subscription
 * @param planCode - The Paystack Plan Code (e.g., PLN_xyz) if subscription
 * @param productId - Optional ID for digital product to link metadata
 * @param onSuccess - Callback for successful transaction
 * @param onCancel - Callback for cancellation
 */
export const payWithPaystack = (
    email: string,
    amount: number,
    isSubscription: boolean = false,
    planCode: string = "",
    productId: string = "",
    onSuccess?: (reference: string) => void,
    onCancel?: () => void
) => {

    if (!window.PaystackPop) {
        alert("Paystack SDK not loaded. Please refresh.");
        return;
    }

    const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: email,
        amount: Math.round(amount * 100), // Convert to kobo/cents, ensure integer
        currency: 'KES',
        channels: ['card', 'mobile_money'], // Enable M-Pesa for Kenya
        plan: isSubscription ? planCode : "",
        metadata: {
            custom_fields: [
                {
                    display_name: "Product ID",
                    variable_name: "product_id",
                    value: productId
                },
                {
                    display_name: "Type",
                    variable_name: "transaction_type",
                    value: isSubscription ? 'SUBSCRIPTION' : 'ONE_TIME'
                }
            ]
        },
        callback: function (response: any) {
            // Frontend immediate feedback
            console.log("✅ Paystack Success:", response.reference);

            // CRITICAL: Verify with backend before trusting the payment
            verifyTransaction(response.reference).then(success => {
                if (success && onSuccess) {
                    console.log("✅ Backend verification successful");
                    onSuccess(response.reference);
                } else {
                    console.error("❌ Backend verification failed");
                    alert('Payment verification failed. Please contact support.');
                }
            }).catch(err => {
                console.error("❌ Verification request failed:", err);
                alert('Could not verify payment. Please contact support with reference: ' + response.reference);
            });
        },
        onClose: function () {
            console.log("⚠️ Payment popup closed");
            if (onCancel) onCancel();
            else alert('Transaction cancelled');
        }
    });

    handler.openIframe();
};

/**
 * Verifies the transaction. 
 * Since we don't have a running Node backend exposed here, this calls a hypothetical endpoint or 
 * handles logic via the DB service directly if secure (which it isn't fully, but suffices for client-side demo).
 * 
 * Ideally, this calls `https://your-backend.com/verify/:reference`
 */
export const verifyTransaction = async (reference: string): Promise<boolean> => {
    try {
        console.log(`⏳ Verifying transaction: ${reference}...`);

        // Call the backend verification endpoint
        const response = await fetch(API_ENDPOINTS.PAYSTACK_VERIFY(reference));
        const data = await response.json();

        if (data.status === 'success') {
            console.log(`✅ Transaction verified: ${reference}`);

            // Update order status in database
            try {
                await db.updateOrderStatus(reference, 'paid');
                console.log(`✅ Order status updated to 'paid'`);
            } catch (dbError) {
                console.error("⚠️ Failed to update order status:", dbError);
            }

            return true;
        } else {
            console.error(`❌ Transaction verification failed for ${reference}:`, data.message);
            return false;
        }
    } catch (e) {
        console.error("❌ Verification error:", e);
        return false;
    }
};
