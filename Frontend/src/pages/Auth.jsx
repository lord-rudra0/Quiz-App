
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../lib/utils'; // Assuming this utility exists

const Auth = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Form States
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: fullName },
                    },
                });
                if (error) throw error;
                alert('Signup successful! Please check your email.');
                // Don't auto-switch, let them check email or switch manually if desired
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                navigate('/');
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsSignUp(!isSignUp);
        setError(null);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-brand-50 p-4">
            {/* Main Container */}
            <div className="relative bg-white rounded-[30px] shadow-2xl overflow-hidden w-full max-w-[900px] min-h-[600px] flex">

                {/* Sign Up Form Container */}
                <div className={cn(
                    "absolute top-0 h-full transition-all duration-700 ease-in-out flex flex-col justify-center px-10 md:px-16",
                    isSignUp ? "left-0 w-full md:w-1/2 opacity-100 z-20" : "left-0 w-1/2 opacity-0 z-10"
                )}>
                    <form className="flex flex-col gap-4 w-full" onSubmit={handleAuth}>
                        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
                        <div className="flex justify-center gap-4 mb-4">
                            {/* Social Icons Placeholders if needed */}
                        </div>
                        <span className="text-sm text-center text-gray-400 mb-4">or use your email for registration</span>

                        <Input
                            type="text"
                            placeholder="Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="bg-gray-100 border-none px-4 py-3 rounded-lg"
                            required={isSignUp}
                        />
                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-100 border-none px-4 py-3 rounded-lg"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-100 border-none px-4 py-3 rounded-lg"
                            required
                        />

                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                        <Button type="submit" isLoading={loading} className="rounded-lg bg-brand-800 hover:bg-brand-900 mt-2 py-3">
                            SIGN UP
                        </Button>
                    </form>
                </div>

                {/* Sign In Form Container */}
                <div className={cn(
                    "absolute top-0 h-full transition-all duration-700 ease-in-out flex flex-col justify-center px-10 md:px-16",
                    !isSignUp ? "left-0 md:left-1/2 w-full md:w-1/2 opacity-100 z-20" : "left-1/2 w-1/2 opacity-0 z-10"
                )}>
                    {/* Mobile Only Toggle (Visible only on small screens) */}
                    <div className="md:hidden absolute top-4 right-4">
                        <button onClick={toggleMode} className="text-sm text-brand-600 font-semibold">
                            {isSignUp ? "Login" : "Create Account"}
                        </button>
                    </div>

                    <form className="flex flex-col gap-4 w-full" onSubmit={handleAuth}>
                        <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
                        <div className="flex justify-center gap-4 mb-4">
                            {/* Social Icons */}
                        </div>
                        <span className="text-sm text-center text-gray-400 mb-4">or use your email password</span>

                        <Input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-gray-100 border-none px-4 py-3 rounded-lg"
                            required
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-gray-100 border-none px-4 py-3 rounded-lg"
                            required
                        />

                        <a href="#" className="text-xs text-center text-gray-500 hover:text-gray-800">Forgot Your Password?</a>

                        {error && <p className="text-red-500 text-xs text-center">{error}</p>}

                        <Button type="submit" isLoading={loading} className="rounded-lg bg-brand-800 hover:bg-brand-900 mt-2 py-3">
                            SIGN IN
                        </Button>
                    </form>
                </div>

                {/* Overlay Container (Desktop Only) */}
                <div className={cn(
                    "hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-50",
                    isSignUp ? "-translate-x-full rounded-r-[100px] rounded-l-none" : "rounded-l-[100px]"
                )}>
                    <div className={cn(
                        "relative -left-full h-full w-[200%] bg-gradient-to-r from-brand-700 to-brand-900 text-white transform transition-transform duration-700 ease-in-out",
                        isSignUp ? "translate-x-1/2" : "translate-x-0"
                    )}>

                        {/* Left Overlay Panel (For Sign In View -> Shows 'Welcome Back') */}
                        <div className={cn(
                            "absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-700 ease-in-out",
                            isSignUp ? "translate-x-0" : "-translate-x-[20%]"
                        )}>
                            <h1 className="text-4xl font-bold mb-4">Welcome Back!</h1>
                            <p className="mb-8 text-brand-100">Enter your personal details to use all of site features</p>
                            <button
                                onClick={toggleMode}
                                className="bg-transparent border-2 border-white text-white rounded-lg px-12 py-3 font-semibold hover:bg-white hover:text-brand-800 transition-colors"
                            >
                                SIGN IN
                            </button>
                        </div>

                        {/* Right Overlay Panel (For Sign Up View -> Shows 'Hello Friend') */}
                        <div className={cn(
                            "absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center px-12 text-center transform transition-transform duration-700 ease-in-out",
                            !isSignUp ? "translate-x-0" : "translate-x-[20%]"
                        )}>
                            <h1 className="text-4xl font-bold mb-4">Hello, Friend!</h1>
                            <p className="mb-8 text-brand-100">Register with your personal details to use all of site features</p>
                            <button
                                onClick={toggleMode}
                                className="bg-transparent border-2 border-white text-white rounded-lg px-12 py-3 font-semibold hover:bg-white hover:text-brand-800 transition-colors"
                            >
                                SIGN UP
                            </button>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default Auth;
