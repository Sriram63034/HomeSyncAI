import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = React.useState(false);
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
        setIsOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/home' },
        { name: 'Find Houses', path: '/results' },
        { name: 'Saved', path: '/saved' },
    ];

    return (
        <nav className="fixed w-full z-50 glass lg:px-8 px-4 py-3 transition-all duration-300">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to={isAuthenticated ? "/home" : "/"} className="flex items-center gap-2 group">
                    <div className="bg-primary-600 p-2 rounded-xl text-white group-hover:bg-primary-500 transition-colors">
                        <Home size={24} />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                        HomeSync AI
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {isAuthenticated && (
                        <ul className="flex gap-6">
                            {navLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.path}
                                        className={`text-sm font-medium transition-colors hover:text-primary-600 relative ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-600'
                                            }`}
                                    >
                                        {link.name}
                                        {location.pathname === link.path && (
                                            <motion.div
                                                layoutId="navbar-indicator"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                                            />
                                        )}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex items-center gap-4 border-l border-slate-200 pl-4">
                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-primary-600">
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-md hover:shadow-lg active:scale-95 flex items-center gap-2"
                                >
                                    <User size={16} />
                                    Sign up
                                </Link>
                            </>
                        ) : (
                            <button
                                onClick={handleLogout}
                                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2"
                            >
                                Logout
                            </button>
                        )}
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-2 text-slate-600"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Nav */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden overflow-hidden bg-white/95 backdrop-blur-lg border-t border-slate-100 mt-3 -mx-4 px-4"
                    >
                        <div className="py-4 flex flex-col gap-4">
                            {isAuthenticated && navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className={`block text-base font-medium ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-600'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <hr className="border-slate-100" />
                            <div className="flex flex-col gap-3">
                                {!isAuthenticated ? (
                                    <>
                                        <Link
                                            to="/login"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full text-center py-2 text-slate-600 font-medium border border-slate-200 rounded-full"
                                        >
                                            Log in
                                        </Link>
                                        <Link
                                            to="/signup"
                                            onClick={() => setIsOpen(false)}
                                            className="w-full text-center py-2 bg-primary-600 text-white font-medium rounded-full shadow-md"
                                        >
                                            Sign up
                                        </Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-center py-2 bg-slate-100 text-slate-700 font-medium rounded-full"
                                    >
                                        Logout
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
