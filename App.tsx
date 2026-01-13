import React, { createContext, useContext, useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth, useUser } from '@insforge/react';
import { setAuthToken, db } from './services/insforge';
import { User } from './types';
import { Navbar, Footer } from './components/Layout';
import { Home } from './pages/Home';
import { MixtapesList, MixtapeSingle } from './pages/Mixtapes';
import { MusicPool } from './pages/MusicPool';
import { Store, Cart, Checkout, ProductSingle } from './pages/Store';
import { PaymentSuccess } from './pages/PaymentSuccess';
import { TipJar } from './pages/TipJar';
import { Login, Register } from './pages/Auth';
import { Profile } from './pages/Profile';
import { Admin } from './pages/Admin';
import { Contact } from './pages/Contact';
import { PrivacyPolicy, TermsOfService } from './pages/Legal';

// --- Global User Context (Enriched Profile) ---
const AppUserContext = createContext<{ user: User | null; loading: boolean; refreshUser: () => void }>({
    user: null,
    loading: true,
    refreshUser: () => { }
});

export const useAppUser = () => useContext(AppUserContext);

const AuthSync = ({ children }: React.PropsWithChildren<{}>) => {
    // Cast useAuth to any to avoid TS errors if types are strict, assuming getToken exists at runtime
    const { isSignedIn, getToken } = useAuth() as any;
    const { user: authUser, isLoaded } = useUser();
    const [appUser, setAppUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        if (isSignedIn && authUser) {
            try {
                // Get JWT token and set it for the API client
                if (getToken) {
                    const token = await getToken();
                    if (token) setAuthToken(token);
                }

                // Fetch enriched profile (with subscription/roles) from DB
                const profile = await db.getMe();
                setAppUser(profile);
            } catch (e) {
                console.error("Failed to fetch user profile", e);
                // Fallback to basic auth info if DB fetch fails
                setAppUser({
                    id: authUser.id,
                    email: authUser.email || '',
                    name: (authUser as any).name || 'User',
                    avatarUrl: (authUser as any).avatarUrl,
                    role: 'USER' as any,
                    downloads: []
                });
            }
        } else {
            setAppUser(null);
            setAuthToken('');
        }
        setLoading(false);
    };

    useEffect(() => {
        if (isLoaded) {
            refreshUser();
        }
    }, [isSignedIn, isLoaded, authUser]);

    return (
        <AppUserContext.Provider value={{ user: appUser, loading, refreshUser }}>
            {children}
        </AppUserContext.Provider>
    );
};

// ScrollToTop component logic inside Layout or Router
const ScrollToTop = () => {
    const { pathname } = React.useMemo(() => window.location, []);
    React.useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    return null;
};

const App = () => {
    return (
        <Router>
            <AuthSync>
                <ScrollToTop />
                <div className="flex flex-col min-h-screen">
                    <Navbar />
                    <main className="flex-grow">
                        <Routes>
                            <Route path="/" element={<Home />} />

                            {/* Mixtapes */}
                            <Route path="/mixtapes" element={<MixtapesList />} />
                            <Route path="/mixtapes/:id" element={<MixtapeSingle />} />

                            {/* Music Pool */}
                            <Route path="/music-pool" element={<MusicPool />} />

                            {/* Store */}
                            <Route path="/store" element={<Store />} />
                            <Route path="/store/:id" element={<ProductSingle />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/cart" element={<Cart />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/payment-success" element={<PaymentSuccess />} />

                            {/* Contact & Bookings */}
                            <Route path="/bookings" element={<Contact />} />
                            <Route path="/contact" element={<Contact />} />

                            {/* Tip Jar */}
                            <Route path="/tip-jar" element={<TipJar />} />

                            {/* Auth */}
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/profile" element={<Profile />} />

                            {/* Admin */}
                            <Route path="/admin" element={<Admin />} />

                            {/* Legal */}
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<TermsOfService />} />
                        </Routes>
                    </main>
                    <Footer />
                </div>
            </AuthSync>
        </Router>
    );
};

export default App;