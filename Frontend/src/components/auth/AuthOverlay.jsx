
import React from 'react';
import { cn } from '../../lib/utils';

const AuthOverlay = ({ isSignUp, toggleMode }) => {
    return (
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
    );
};

export default AuthOverlay;
