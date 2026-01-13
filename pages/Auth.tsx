import React from 'react';
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton, useAuth, useUser } from '@insforge/react';
import { GlassCard, Button } from '../components/UI';
import { Navigate } from 'react-router-dom';

export const Login = () => {
    const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Navigate to="/profile" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
            <GlassCard className="w-full max-w-md p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Welcome Back</h2>
                <p className="text-gray-400 mb-8">Sign in to access your dashboard and downloads.</p>
                
                <div className="flex flex-col gap-4 justify-center items-center">
                    <SignInButton>
                        <Button size="lg" className="w-full">Sign In</Button>
                    </SignInButton>
                    
                    <div className="text-sm text-gray-500 mt-4">
                        Don't have an account? <span className="text-white">Sign up below</span>
                    </div>
                    
                    <SignUpButton>
                        <Button variant="outline" className="w-full">Create Account</Button>
                    </SignUpButton>
                </div>
            </GlassCard>
        </div>
    );
};

export const Register = () => {
     const { isSignedIn } = useAuth();

    if (isSignedIn) {
        return <Navigate to="/profile" />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 pt-20">
            <GlassCard className="w-full max-w-md p-12 text-center">
                <h2 className="text-3xl font-bold mb-4">Join DJ Flowerz</h2>
                <p className="text-gray-400 mb-8">Create an account to join the music pool and more.</p>
                
                <div className="flex flex-col gap-4 justify-center items-center">
                    <SignUpButton>
                        <Button size="lg" className="w-full">Get Started</Button>
                    </SignUpButton>
                     
                    <div className="text-sm text-gray-500 mt-4">
                        Already have an account?
                    </div>

                    <SignInButton>
                        <Button variant="ghost" className="w-full">Login instead</Button>
                    </SignInButton>
                </div>
            </GlassCard>
        </div>
    );
};