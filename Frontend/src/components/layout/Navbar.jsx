
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User as UserIcon } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import Button from '../ui/Button';

const Navbar = () => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                {/* Brand */}
                <Link
                    to="/"
                    className="text-xl font-bold text-brand-700 hover:text-brand-600 transition-colors"
                >
                    Quiz App
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-6">
                    {session ? (
                        <>
                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                    <UserIcon size={18} />
                                </div>
                                <span className="font-medium">
                                    {user?.user_metadata?.full_name || user?.email}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/auth" className="text-sm font-medium text-slate-600 hover:text-brand-600 transition-colors">
                                Login
                            </Link>
                            <Link to="/auth">
                                <Button className="w-auto px-6 py-2 ring-2 ring-brand-200 shadow-lg shadow-brand-500/20">Sign Up</Button>
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button
                    onClick={toggleMenu}
                    className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-slate-200 bg-white"
                    >
                        <div className="p-4 flex flex-col gap-4">
                            {session ? (
                                <>
                                    <div className="flex items-center gap-3 text-sm text-slate-600 pb-4 border-b border-slate-100">
                                        <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600">
                                            <UserIcon size={18} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900">Signed in as</span>
                                            <span className="text-slate-500">{user?.user_metadata?.full_name || user?.email}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium hover:bg-red-100 transition-colors"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link
                                        to="/auth"
                                        onClick={() => setIsMenuOpen(false)}
                                        className="block w-full text-center py-2 text-slate-600 hover:text-brand-600 font-medium"
                                    >
                                        Login
                                    </Link>
                                    <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                                        <Button className="w-full ring-2 ring-brand-200 shadow-md">Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
