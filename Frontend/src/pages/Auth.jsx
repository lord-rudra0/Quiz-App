
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { cn } from '../lib/utils';
import GoogleButton from '../components/auth/GoogleButton';
import AuthOverlay from '../components/auth/AuthOverlay';

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
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                // The App component will redirect to / as session changes
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
        <div className="flex-grow w-full flex items-center justify-center bg-brand-50 p-4">
            {/* Main Container */}
            <div className="relative bg-white rounded-[30px] shadow-2xl overflow-hidden w-full max-w-[900px] min-h-[600px] flex">

                {/* Sign Up Form Container */}
                <div className={cn(
                    "absolute top-0 h-full transition-all duration-700 ease-in-out flex flex-col justify-center px-10 md:px-16",
                    isSignUp ? "left-0 md:left-1/2 w-full md:w-1/2 opacity-100 z-20" : "left-0 w-1/2 opacity-0 z-10"
                )}>
                    <form className="flex flex-col gap-4 w-full" onSubmit={handleAuth}>
                        <h1 className="text-3xl font-bold text-center mb-2">Create Account</h1>
                        <div className="flex justify-center gap-4 mb-4 w-full">
                            <GoogleButton onError={setError} setLoading={setLoading} />
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
                    !isSignUp ? "left-0 w-full md:w-1/2 opacity-100 z-20" : "left-1/2 w-1/2 opacity-0 z-10"
                )}>
                    {/* Mobile Only Toggle */}
                    <div className="md:hidden absolute top-4 right-4">
                        <button onClick={toggleMode} className="text-sm text-brand-600 font-semibold">
                            {isSignUp ? "Login" : "Create Account"}
                        </button>
                    </div>

                    <form className="flex flex-col gap-4 w-full" onSubmit={handleAuth}>
                        <h1 className="text-3xl font-bold text-center mb-2">Sign In</h1>
                        <div className="flex justify-center gap-4 mb-4 w-full">
                            <GoogleButton onError={setError} setLoading={setLoading} />
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

                <AuthOverlay isSignUp={isSignUp} toggleMode={toggleMode} />

            </div>
        </div>
    );
};


export default Auth;
