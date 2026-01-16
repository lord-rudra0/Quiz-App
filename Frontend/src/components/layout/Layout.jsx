
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />
            <main className="flex-grow flex flex-col">
                {children}
            </main>
            <Footer />
        </div>
    );
};

export default Layout;
