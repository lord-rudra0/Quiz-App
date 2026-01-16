
import React from 'react';

const Footer = () => {
    return (
        <footer className="w-full py-6 mt-auto bg-white/50 backdrop-blur-sm border-t border-slate-200">
            <div className="container mx-auto px-4 text-center">
                <p className="text-sm text-slate-500 font-medium">© 2026 Quiz App</p>
                <p className="text-xs text-slate-400 mt-1">Built with React, Express & Supabase</p>
            </div>
        </footer>
    );
};

export default Footer;
