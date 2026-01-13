
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, useUser, SignInButton } from '@insforge/react';
import { Menu, X, ShoppingCart, User as UserIcon, Heart } from 'lucide-react';
import { useAppUser } from '../App';
import { ADMIN_EMAIL } from '../types';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user: appUser } = useAppUser(); // Renamed to avoid confusion
  const { user: insforgeUser, isLoaded } = useUser(); // Direct InsForge user
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  // Debugging
  console.log("Current User Email:", (insforgeUser as any)?.primaryEmailAddress?.emailAddress);
  console.log("Expected Admin Email:", ADMIN_EMAIL);

  useEffect(() => {
    // Update cart count from localStorage
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const count = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(count);
    };

    // Initial load
    updateCartCount();

    // Listen for cart updates (dispatched when items are added/removed)
    window.addEventListener('cart-updated', updateCartCount);

    return () => {
      window.removeEventListener('cart-updated', updateCartCount);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Mixtapes', path: '/mixtapes' },
    { name: 'Music Pool', path: '/music-pool' },
    { name: 'Store', path: '/store' },
    { name: 'Bookings', path: '/bookings' },
    { name: 'Tip Jar', path: '/tip-jar' },
  ];

  return (
    <nav className="fixed w-full z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-flowerz-purple to-flowerz-blue rounded-full animate-pulse"></div>
            <span className="text-2xl font-display font-bold tracking-wider text-white group-hover:text-flowerz-blue transition-colors">
              DJ FLOWERZ
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-flowerz-blue ${location.pathname === link.path ? 'text-flowerz-blue' : 'text-gray-300'
                  }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="p-2 text-gray-300 hover:text-white transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>

            <SignedOut>
              <Link to="/login" className="bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-full text-sm font-medium transition-all border border-white/10 hover:border-flowerz-blue">
                Login
              </Link>
            </SignedOut>

            <SignedIn>
              <div className="flex items-center gap-4">
                {/* Admin Panel Link - Reliably check verified email from InsForge */}
                {(insforgeUser as any)?.emailAddresses?.some((e: any) => e.emailAddress === ADMIN_EMAIL) && (
                  <Link
                    to="/admin"
                    className="text-[10px] uppercase font-bold bg-red-600 px-3 py-1.5 rounded text-white hover:bg-red-700 transition-all border border-red-500/50"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {/* PRO Badge for Active Subscribers - uses appUser for custom fields */}
                {appUser?.subscription?.status === 'ACTIVE' && (
                  <span className="text-[10px] bg-green-600 px-2 py-1 rounded text-white font-bold">
                    PRO
                  </span>
                )}
                <Link to="/profile" className="text-sm font-medium text-gray-300 hover:text-white">
                  {appUser?.name?.split(' ')[0] || 'Profile'}
                </Link>
                <UserButton />
              </div>
            </SignedIn>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Link to="/cart" className="p-2 mr-2 text-gray-300 relative">
              <ShoppingCart className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount > 9 ? '9+' : cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass border-t border-white/10 absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/10"
              >
                {link.name}
              </Link>
            ))}
            <div className="border-t border-white/10 my-2 pt-2 px-3">
              <SignedOut>
                <Link to="/login" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-flowerz-blue">Login / Sign Up</Link>
              </SignedOut>
              <SignedIn>
                <Link to="/profile" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-gray-300">My Profile</Link>
                {(insforgeUser as any)?.emailAddresses?.some((e: any) => e.emailAddress === ADMIN_EMAIL) && (
                  <Link to="/admin" onClick={() => setIsOpen(false)} className="block py-2 text-base font-medium text-red-400">Admin Dashboard</Link>
                )}
                <div className="py-2 flex items-center gap-2">
                  <span className="text-gray-400">Account:</span> <UserButton />
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer = () => {
  return (
    <footer className="bg-flowerz-dark border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-display font-bold text-white mb-4">DJ FLOWERZ</h3>
            <p className="text-gray-400 mb-6 max-w-sm">
              The ultimate destination for premium mixes, exclusive edits, and digital DJ tools. Elevate your sound today.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.youtube.com/@dj_flowerz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-600 transition-colors">
                <span className="sr-only">YouTube</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
              <a href="https://www.facebook.com/vdj.flowerz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.791-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
              </a>
              <a href="https://www.instagram.com/djflowerz/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a href="https://www.tiktok.com/@dj.flowerz" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                <span className="sr-only">TikTok</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93v6.16c0 2.52-1.12 4.84-2.9 6.24-1.72 1.36-4.04 1.86-6.17 1.34-2.13-.53-4.03-1.92-5.18-3.79-1.15-1.87-1.35-4.22-.54-6.23.81-2.01 2.57-3.56 4.71-4.14 2.14-.58 4.45-.19 6.24 1.05.3.21.58.44.85.69v-4.06c-.66-.43-1.4-.76-2.18-.98-1.77-.5-3.67-.32-5.32.49-1.65.81-2.91 2.22-3.49 3.94-.58 1.72-.42 3.65.45 5.23.87 1.58 2.39 2.72 4.14 3.12 1.75.4 3.62.08 5.12-.88 1.5-.96 2.45-2.66 2.55-4.47V.02z" /></svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link to="/mixtapes" className="text-gray-400 hover:text-flowerz-purple transition-colors">Mixtapes</Link></li>
              <li><Link to="/music-pool" className="text-gray-400 hover:text-flowerz-purple transition-colors">Music Pool</Link></li>
              <li><Link to="/store" className="text-gray-400 hover:text-flowerz-purple transition-colors">Store</Link></li>
              <li><Link to="/bookings" className="text-gray-400 hover:text-flowerz-purple transition-colors">Bookings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold text-white mb-6">Support</h4>
            <ul className="space-y-3">
              <li><Link to="/bookings" className="text-gray-400 hover:text-flowerz-purple transition-colors">Contact Us</Link></li>
              <li><Link to="/tip-jar" className="text-gray-400 hover:text-flowerz-purple transition-colors">Tip Jar</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-flowerz-purple transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-flowerz-purple transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} DJ Flowerz. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
