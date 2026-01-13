export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export const API_ENDPOINTS = {
    SEND_BOOKING_EMAIL: `${BACKEND_URL}/api/send-booking-email`,
    SEND_CONTACT_EMAIL: `${BACKEND_URL}/api/send-contact-email`,
    STORE_CHECKOUT: `${BACKEND_URL}/api/paystack/initialize`,
    PAYSTACK_INITIALIZE: `${BACKEND_URL}/api/paystack/initialize`,
    PAYSTACK_VERIFY: (ref: string) => `${BACKEND_URL}/api/paystack/verify/${ref}`,
    PAYSTACK_WEBHOOK: `${BACKEND_URL}/api/paystack/webhook`,
};
