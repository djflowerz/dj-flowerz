import { db, storage } from '../services/insforge';

/**
 * Example 1: Create a Digital Product
 */
export const createDigitalProduct = async (file: File, productData: {
    name: string;
    price: number;
    description: string;
}) => {
    // Upload the digital file
    const { filePath, publicUrl } = await storage.uploadFile(file, 'digital-products');

    // Create product in database
    await db.saveProduct({
        name: productData.name,
        price: productData.price,
        description: productData.description,
        type: 'digital',
        digital_file_path: filePath,
        images: []
    } as any);

    console.log('Digital product created with file:', publicUrl);
};

/**
 * Example 2: Create a Physical Product
 */
export const createPhysicalProduct = async (productData: {
    name: string;
    price: number;
    description: string;
    weight_kg: number;
    images: string[];
}) => {
    await db.saveProduct({
        ...productData,
        type: 'physical'
    } as any);

    console.log('Physical product created');
};

/**
 * Example 3: Checkout with Physical Product
 */
export const checkoutPhysicalProduct = async (
    productId: string,
    userEmail: string,
    shippingAddress: {
        fullName: string;
        phone: string;
        address: string;
        city: string;
        county: string;
    }
) => {
    const response = await fetch('http://localhost:3001/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: userEmail,
            amount: 5000, // KES
            productId,
            productType: 'physical',
            productName: 'DJ Equipment',
            address: shippingAddress
        })
    });

    const data = await response.json();

    if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
    }
};

/**
 * Example 4: Checkout with Digital Product
 */
export const checkoutDigitalProduct = async (
    productId: string,
    productName: string,
    price: number,
    userEmail: string
) => {
    const response = await fetch('http://localhost:3001/api/store/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            email: userEmail,
            amount: price,
            productId,
            productType: 'digital',
            productName,
            address: null // No address needed for digital
        })
    });

    const data = await response.json();

    if (data.data?.authorization_url) {
        window.location.href = data.data.authorization_url;
    }
};

/**
 * Example 5: Send Digital Download Email (Backend)
 * This would be called from the webhook when payment succeeds
 */
export const sendDigitalDownloadEmail = async (
    customerEmail: string,
    productId: string
) => {
    // Get product details
    const products = await db.getProducts();
    const product = products.find(p => p.id === productId);

    if (!product || !product.digital_file_path) {
        throw new Error('Product not found or not digital');
    }

    // Generate signed download URL (valid for 24 hours)
    // In production, use storage.getSignedUrl() or similar
    const downloadUrl = `https://your-domain.com/download/${productId}?token=xxx`;

    // Send email with download link
    console.log(`Sending download email to ${customerEmail}`);
    console.log(`Download URL: ${downloadUrl}`);

    // TODO: Integrate with email service (SendGrid, Mailgun, etc.)
    /*
    await emailService.send({
        to: customerEmail,
        subject: `Your ${product.name} is ready!`,
        html: `
            <h1>Thank you for your purchase!</h1>
            <p>Your digital product is ready to download.</p>
            <a href="${downloadUrl}">Download ${product.name}</a>
            <p>This link is valid for 24 hours.</p>
        `
    });
    */
};

/**
 * Example 6: Create Shipping Order (Backend)
 * This would be called from the webhook for physical products
 */
export const createShippingOrder = async (
    shippingAddress: any,
    productId: string,
    customerEmail: string
) => {
    console.log('Creating shipping order...');
    console.log('Customer:', customerEmail);
    console.log('Product ID:', productId);
    console.log('Ship to:', shippingAddress);

    // TODO: Integrate with shipping provider
    /*
    const shippingLabel = await shippingProvider.createLabel({
        to: {
            name: shippingAddress.fullName,
            phone: shippingAddress.phone,
            address: shippingAddress.address,
            city: shippingAddress.city,
            county: shippingAddress.county
        },
        package: {
            weight: product.weight_kg,
            description: product.name
        }
    });
    
    // Notify fulfillment team
    await notifyFulfillmentTeam({
        orderId: reference,
        productId,
        shippingLabel,
        customerEmail
    });
    */
};
