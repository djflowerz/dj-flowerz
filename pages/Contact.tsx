
import React, { useState } from 'react';
import { PageHeader, Section, GlassCard, Button, Input, Label, Badge } from '../components/UI';
import { db } from '../services/insforge';
import { Mail, Phone, MapPin, Calendar, CheckCircle, Send, Music, User, DollarSign, Clock } from 'lucide-react';
import { API_ENDPOINTS } from '../config/api';

export const Contact = () => {
    const [activeTab, setActiveTab] = useState<'contact' | 'booking'>('booking'); // Default to bookings
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    // Contact Form State
    const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' });

    // Booking Form State
    const [bookingForm, setBookingForm] = useState({
        name: '',
        email: '',
        phone: '',
        eventType: 'Club Event',
        eventDate: '',
        location: '',
        budget: '',
        details: ''
    });

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await db.sendContactMessage({
                id: crypto.randomUUID(),
                ...contactForm,
                createdAt: new Date().toISOString(),
                read: false
            });

            // Send Email Notification
            try {
                await fetch(API_ENDPOINTS.SEND_CONTACT_EMAIL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(contactForm)
                });
            } catch (emailErr) {
                console.error("Failed to send contact email:", emailErr);
            }

            setSuccess('Message sent successfully! We will get back to you shortly.');
            setContactForm({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            alert('Failed to send message.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // 1. Save to InsForge Database
            await db.sendBookingRequest({
                id: crypto.randomUUID(),
                ...bookingForm,
                status: 'PENDING',
                createdAt: new Date().toISOString()
            });

            // 2. Send Email Notification
            try {
                await fetch(API_ENDPOINTS.SEND_BOOKING_EMAIL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingForm)
                });
            } catch (emailErr) {
                console.error("Failed to send booking email:", emailErr);
            }

            // 3. Format WhatsApp Message and Redirect
            const message = `*New Booking Request*%0A` +
                `*Name:* ${bookingForm.name}%0A` +
                `*Phone:* ${bookingForm.phone}%0A` +
                `*Event:* ${bookingForm.eventType}%0A` +
                `*Date:* ${bookingForm.eventDate}%0A` +
                `*Budget:* KES ${bookingForm.budget}%0A` +
                `*Location:* ${bookingForm.location}`;

            // Open WhatsApp (using the WhatsApp number provided: 254789783258)
            window.open(`https://wa.me/254789783258?text=${message}`, '_blank');

            setSuccess('Booking request received! Redirecting to WhatsApp...');
            setBookingForm({ name: '', email: '', phone: '', eventType: 'Club Event', eventDate: '', location: '', budget: '', details: '' });
        } catch (err) {
            console.error(err);
            alert('Failed to submit booking request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen pt-20">
            <PageHeader
                title={activeTab === 'booking' ? "Book DJ Flowerz" : "Contact Us"}
                subtitle={activeTab === 'booking' ? "Bring the ultimate energy to your next event." : "Have a question? We'd love to hear from you."}
                image="https://picsum.photos/1920/1080?grayscale&blur=2"
            />

            <div className="sticky top-20 z-40 bg-[#0B0B0F]/90 backdrop-blur-md border-b border-white/5 py-4">
                <div className="max-w-md mx-auto px-4">
                    <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                        <button
                            onClick={() => { setActiveTab('booking'); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'booking' ? 'bg-flowerz-purple text-white shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            Bookings
                        </button>
                        <button
                            onClick={() => { setActiveTab('contact'); setSuccess(''); }}
                            className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'contact' ? 'bg-flowerz-blue text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            General Inquiry
                        </button>
                    </div>
                </div>
            </div>

            <Section>
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Contact Info Sidebar */}
                    <div className="md:col-span-1 space-y-6">
                        <GlassCard>
                            <h3 className="text-xl font-bold mb-6">Get In Touch</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="bg-flowerz-purple/20 p-3 rounded-lg text-flowerz-purple"><Mail className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold text-sm">Email</div>
                                        <a href="mailto:djflowerz254@gmail.com" className="text-gray-400 text-sm hover:text-white">djflowerz254@gmail.com</a>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-flowerz-blue/20 p-3 rounded-lg text-flowerz-blue"><Phone className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold text-sm">Phone / WhatsApp</div>
                                        <p className="text-gray-400 text-sm">+254 712 293 303</p>
                                        <p className="text-gray-400 text-sm">WhatsApp: +254 789 783 258</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="bg-green-500/20 p-3 rounded-lg text-green-400"><MapPin className="w-5 h-5" /></div>
                                    <div>
                                        <div className="font-bold text-sm">Location</div>
                                        <p className="text-gray-400 text-sm">Nairobi, Kenya</p>
                                    </div>
                                </div>
                            </div>
                        </GlassCard>

                        <GlassCard className="bg-gradient-to-br from-purple-900/20 to-blue-900/20">
                            <h3 className="font-bold mb-2">Management</h3>
                            <p className="text-sm text-gray-400">For press inquiries, partnerships, and label demos, please use the contact form or email management directly.</p>
                        </GlassCard>
                    </div>

                    {/* Forms Area */}
                    <div className="md:col-span-2">
                        {success && (
                            <div className="mb-6 bg-green-500/10 border border-green-500/30 p-6 rounded-2xl flex items-start gap-4 animate-slide-up">
                                <div className="p-2 bg-green-500/20 rounded-full text-green-400">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-400">Success!</h3>
                                    <p className="text-gray-300">{success}</p>
                                    <Button variant="ghost" className="mt-2 text-sm text-green-300 hover:text-white" onClick={() => setSuccess('')}>Send Another</Button>
                                </div>
                            </div>
                        )}

                        {!success && (
                            <GlassCard className="animate-slide-up">
                                {activeTab === 'booking' ? (
                                    <form onSubmit={handleBookingSubmit} className="space-y-6">
                                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                            <Calendar className="w-5 h-5 text-flowerz-purple" />
                                            <h3 className="text-xl font-bold">Event Details</h3>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Full Name <span className="text-red-400">*</span></Label>
                                                <div className="relative">
                                                    <Input required value={bookingForm.name} onChange={e => setBookingForm({ ...bookingForm, name: e.target.value })} className="pl-10" />
                                                    <User className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Phone Number <span className="text-red-400">*</span></Label>
                                                <div className="relative">
                                                    <Input required type="tel" value={bookingForm.phone} onChange={e => setBookingForm({ ...bookingForm, phone: e.target.value })} className="pl-10" />
                                                    <Phone className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Email Address <span className="text-red-400">*</span></Label>
                                                <div className="relative">
                                                    <Input required type="email" value={bookingForm.email} onChange={e => setBookingForm({ ...bookingForm, email: e.target.value })} className="pl-10" />
                                                    <Mail className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                                                </div>
                                            </div>
                                            <div>
                                                <Label>Type of Event</Label>
                                                <div className="relative">
                                                    <select
                                                        className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white appearance-none focus:border-flowerz-purple focus:outline-none"
                                                        value={bookingForm.eventType}
                                                        onChange={e => setBookingForm({ ...bookingForm, eventType: e.target.value })}
                                                    >
                                                        <option>Club Event</option>
                                                        <option>Private Party</option>
                                                        <option>Wedding</option>
                                                        <option>Corporate Event</option>
                                                        <option>Festival</option>
                                                        <option>Concert</option>
                                                    </select>
                                                    <Music className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <Label>Event Date <span className="text-red-400">*</span></Label>
                                                <Input required type="date" value={bookingForm.eventDate} onChange={e => setBookingForm({ ...bookingForm, eventDate: e.target.value })} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <Label>Budget Estimate (KES)</Label>
                                                <div className="relative">
                                                    <Input type="number" value={bookingForm.budget} onChange={e => setBookingForm({ ...bookingForm, budget: e.target.value })} placeholder="e.g. 50,000" className="pl-10" />
                                                    <DollarSign className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                                                </div>
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Venue / Location <span className="text-red-400">*</span></Label>
                                            <div className="relative">
                                                <Input required value={bookingForm.location} onChange={e => setBookingForm({ ...bookingForm, location: e.target.value })} placeholder="e.g. KICC, Nairobi" className="pl-10" />
                                                <MapPin className="w-4 h-4 text-gray-500 absolute left-3 top-3.5" />
                                            </div>
                                        </div>

                                        <div>
                                            <Label>Additional Details</Label>
                                            <textarea
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-flowerz-purple min-h-[120px]"
                                                placeholder="Tell us more about the vibe, hours required, or specific requests..."
                                                value={bookingForm.details}
                                                onChange={e => setBookingForm({ ...bookingForm, details: e.target.value })}
                                            ></textarea>
                                        </div>

                                        <Button type="submit" disabled={loading} className="w-full text-lg py-4">
                                            {loading ? 'Submitting...' : 'Submit Booking Request'}
                                        </Button>
                                    </form>
                                ) : (
                                    <form onSubmit={handleContactSubmit} className="space-y-6">
                                        <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
                                            <Mail className="w-5 h-5 text-flowerz-blue" />
                                            <h3 className="text-xl font-bold">Send a Message</h3>
                                        </div>

                                        <div>
                                            <Label>Full Name <span className="text-red-400">*</span></Label>
                                            <Input required value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Email Address <span className="text-red-400">*</span></Label>
                                            <Input required type="email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Subject <span className="text-red-400">*</span></Label>
                                            <Input required value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} />
                                        </div>
                                        <div>
                                            <Label>Message <span className="text-red-400">*</span></Label>
                                            <textarea
                                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-flowerz-blue min-h-[150px]"
                                                placeholder="How can we help you?"
                                                required
                                                value={contactForm.message}
                                                onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-flowerz-blue to-blue-600">
                                            {loading ? 'Sending...' : 'Send Message'}
                                        </Button>
                                    </form>
                                )}
                            </GlassCard>
                        )}
                    </div>
                </div>
            </Section>
        </div>
    );
};
