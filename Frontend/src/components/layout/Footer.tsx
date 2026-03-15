import { Home, Twitter, Facebook, Instagram, Linkedin, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 pt-16 pb-8 text-slate-300 border-t border-slate-800">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <div className="bg-primary-600 p-2 rounded-xl text-white">
                                <Home size={24} />
                            </div>
                            <span className="text-xl font-bold text-white">HomeSync AI</span>
                        </Link>
                        <p className="text-sm text-slate-400 mb-6">
                            Find your perfect home with AI-powered matching, personalized insights, and comprehensive market analysis.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-slate-400 hover:text-white transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link to="/results" className="text-sm hover:text-primary-400 transition-colors">Find Houses</Link></li>
                            <li><Link to="/wizard" className="text-sm hover:text-primary-400 transition-colors">Preference Wizard</Link></li>
                            <li><Link to="/saved" className="text-sm hover:text-primary-400 transition-colors">Saved Homes</Link></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Pricing Insights</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Company</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">About Us</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Careers</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Blog</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Legal</h3>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-sm hover:text-primary-400 transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-500">
                        &copy; {new Date().getFullYear()} HomeSync AI. All rights reserved.
                    </p>
                    <p className="text-sm text-slate-500 flex items-center gap-1">
                        Built with <Heart size={14} className="text-red-500" /> globally
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
