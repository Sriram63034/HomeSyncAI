import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { fetchApi } from '../utils/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const data = await fetchApi('/auth/login/', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            await login(data.access, data.refresh);
            navigate('/home');
        } catch (err: any) {
            setError(err.message || 'An error occurred during login.');
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email.includes('@') && password.length > 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-200/40 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-accent-200/40 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring' }}
                className="sm:mx-auto sm:w-full sm:max-w-md relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <Link to="/" className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary-500/30 transform transition-transform hover:scale-105">
                        <Home size={32} />
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 mb-2">
                    Welcome back
                </h2>
                <p className="text-center text-sm text-slate-600 mb-8">
                    Sign in to access your personalized house recommendations
                </p>

                <div className="glass rounded-2xl p-8 shadow-xl border border-white/40">
                    <form className="space-y-2" onSubmit={handleSubmit}>
                        <Input
                            label="Email address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                            error={error}
                        />

                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            autoComplete="current-password"
                        />

                        <div className="flex items-center justify-between pb-4">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-600 transition-colors"
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm">
                                <a href="#" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                                    Forgot your password?
                                </a>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            disabled={!isFormValid || isLoading}
                            magnetic
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-500 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
