import React from 'react';
import { PageHeader, Section, GlassCard } from '../components/UI';

export const PrivacyPolicy = () => (
    <div className="min-h-screen pt-20">
        <PageHeader title="Privacy Policy" subtitle="How we handle your data." />
        <Section>
            <GlassCard className="prose prose-invert max-w-none">
                <h3>1. Information We Collect</h3>
                <p>We collect information you provide directly to us, such as when you create an account, subscribe to our newsletter, or purchase a product. This may include your name, email address, and payment information (processed securely via Paystack).</p>
                
                <h3>2. How We Use Your Information</h3>
                <p>We use your information to provide, maintain, and improve our services, process transactions, and communicate with you about new mixtapes, products, and updates.</p>
                
                <h3>3. Data Security</h3>
                <p>We implement appropriate security measures to protect your personal information. Your payment details are never stored on our servers; they are handled directly by our payment processor.</p>
                
                <h3>4. Cookies</h3>
                <p>We use cookies to improve your browsing experience and analyze site traffic. You can control cookies through your browser settings.</p>
            </GlassCard>
        </Section>
    </div>
);

export const TermsOfService = () => (
    <div className="min-h-screen pt-20">
        <PageHeader title="Terms of Service" subtitle="Rules and regulations." />
        <Section>
             <GlassCard className="prose prose-invert max-w-none">
                <h3>1. Acceptance of Terms</h3>
                <p>By accessing DJ FLOWERZ, you agree to be bound by these Terms of Service.</p>
                
                <h3>2. Digital Products</h3>
                <p>All sales of digital products (software, tools, audio files) are final. Due to the nature of digital downloads, we cannot offer refunds once the file has been accessed.</p>
                
                <h3>3. Music Pool Subscription</h3>
                <p>Subscription to the Music Pool grants you access to exclusive content for the duration of your plan. Sharing your account credentials or private download links is strictly prohibited and will result in immediate account termination without refund.</p>
                
                <h3>4. Intellectual Property</h3>
                <p>All content provided on this platform is the property of DJ FLOWERZ or its content suppliers and is protected by international copyright laws.</p>
            </GlassCard>
        </Section>
    </div>
);