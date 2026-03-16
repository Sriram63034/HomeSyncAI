import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ShieldCheck } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { fetchApi } from '../utils/api';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let strength = 0;
        if (password.length > 5) strength++;
        if (password.length > 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        setPasswordStrength(Math.min(strength, 4));
    }, [password]);

    const passwordMatch = password !== '' && password === confirmPassword;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwordMatch) return;
        setError('');
        setIsLoading(true);

        try {
            // Register via API
            await fetchApi('/auth/signup/', {
                method: 'POST',
                body: JSON.stringify({
                    full_name: name,
                    email,
                    password,
                    confirm_password: confirmPassword
                })
            });

            // Redirect to login page - removed auto login
            navigate('/login');
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Signup failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStrengthColor = () => {
        if (passwordStrength <= 1) return 'bg-red-400';
        if (passwordStrength === 2) return 'bg-yellow-400';
        if (passwordStrength === 3) return 'bg-blue-400';
        return 'bg-green-500';
    };

    const isFormValid = name && email.includes('@') && passwordStrength >= 2 && passwordMatch;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden transition-colors">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-1/4 right-[-10%] w-[50%] h-[50%] bg-accent-200/30 dark:bg-accent-900/20 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/30 dark:bg-primary-900/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <Link to="/" className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/30 transform transition-transform hover:scale-105">
                        <Home size={32} />
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
                    Create an account
                </h2>
                <p className="text-center text-sm text-slate-600 dark:text-slate-400 mb-8">
                    Join HomeSync AI to find your dream home faster
                </p>

                <div className="glass dark:glass-dark rounded-2xl p-8 shadow-xl border border-white/40 dark:border-slate-800">
                    <form className="space-y-1" onSubmit={handleSubmit}>
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl animate-fade-in flex items-center gap-2">
                                <ShieldCheck size={16} />
                                {error}
                            </div>
                        )}
                        <Input
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoComplete="name"
                        />

                        <Input
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            success={email.includes('@') && email.includes('.')}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        {/* Password Strength Meter */}
                        <AnimatePresence>
                            {password.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mb-4 -mt-2 px-1"
                                >
                                    <div className="flex gap-1 h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-full flex-1 transition-colors duration-500 ${passwordStrength >= level ? getStrengthColor() : 'bg-transparent'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
                                        <ShieldCheck size={12} className={passwordStrength >= 3 ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'} />
                                        Strength: {['Weak', 'Fair', 'Good', 'Strong'][Math.max(0, passwordStrength - 1)]}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <Input
                            label="Confirm Password"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            error={confirmPassword.length > 0 && !passwordMatch ? "Passwords don't match" : undefined}
                            success={confirmPassword.length > 0 && passwordMatch}
                        />

                        <div className="pt-4 pb-2">
                            <Button
                                type="submit"
                                className="w-full"
                                size="lg"
                                disabled={!isFormValid || isLoading}
                                magnetic
                            >
                                {isLoading ? 'Creating account...' : 'Create Account'}
                            </Button>
                        </div>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600 dark:text-slate-400">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                            Log in
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
