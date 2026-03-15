import React from 'react';
import { motion, useTransform, useMotionValue, useSpring, useScroll } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Map, Target, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';
import FloatingHeroBackground from '../components/FloatingHeroBackground';

const Landing = () => {
    // Mouse Parallax Logic
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const { scrollY } = useScroll();
    const heroOpacity = useTransform(scrollY, [0, 400], [1, 0]);
    const heroScale = useTransform(scrollY, [0, 400], [1, 0.95]);

    // 3-Layer Parallax Intensity Maps (Limited to sub-10px for cinematic feel)
    const springConfig = { damping: 30, stiffness: 100 };
    
    // Layer 2 (Background image moves less)
    const bgX = useSpring(useTransform(mouseX, [0, 2000], [8, -8]), springConfig);
    const bgY = useSpring(useTransform(mouseY, [0, 1200], [8, -8]), springConfig);
    
    // Layer 3 (Glass Card moves opposite/more for depth - limited to 15px)
    const cardX = useSpring(useTransform(mouseX, [0, 2000], [-15, 15]), springConfig);
    const cardY = useSpring(useTransform(mouseY, [0, 1200], [-15, 15]), springConfig);

    const handleMouseMove = (e: React.MouseEvent) => {
        mouseX.set(e.clientX);
        mouseY.set(e.clientY);
    };

    return (
        <div className="bg-white min-h-screen overflow-hidden relative" onMouseMove={handleMouseMove}>
            {/* New Cinematic Background (Layers 1 & 2) */}
            <motion.div style={{ opacity: heroOpacity }}>
                <FloatingHeroBackground mouseX={bgX} mouseY={bgY} />
            </motion.div>

            {/* Hero Section (Step 461.1) */}
            <motion.section 
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative h-[85vh] flex items-center justify-center px-4 lg:px-8 max-w-7xl mx-auto overflow-hidden"
            >
                {/* Layer 3: Glass Hero Card (Step 461.6) */}
                <motion.div
                    style={{ x: cardX, y: cardY }}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative z-30 max-w-2xl w-full"
                >
                    <div className="backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-8 md:p-14 text-center">
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-400/20 border border-white/10 text-primary-200 font-medium text-sm mb-8"
                        >
                            <Sparkles size={16} /> AI-Powered Real Estate
                        </motion.div>

                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight mb-6"
                        >
                            Find Your Perfect Home <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                                with AI Precision
                            </span>
                        </motion.h1>

                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.5 }}
                            className="text-base md:text-lg text-slate-200 mb-10 max-w-xl mx-auto leading-relaxed"
                        >
                            Stop scrolling through endless listings. Tell our AI what matters to you, and we'll find your perfect match in seconds.
                        </motion.p>

                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                        >
                            <Link to="/wizard">
                                <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-10 rounded-full shadow-lg shadow-primary-500/20 hover:scale-105 hover:shadow-blue-500/40 transition-all duration-300" magnetic>
                                    Find My Home <ArrowRight className="ml-2" />
                                </Button>
                            </Link>
                            <Link to="/results">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-10 rounded-full bg-white/5 border-white/20 text-white hover:bg-white/10 hover:scale-105 transition-all duration-300" magnetic>
                                    Browse Listings
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>
            </motion.section>

            {/* Features Section */}
            <section className="py-24 bg-white relative">
                <div className="max-w-7xl mx-auto px-4 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Why HomeSync AI?</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            We've reinvented the home search process combining cutting-edge machine learning with human-centric design.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-primary-500/10 transition-all"
                        >
                            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-6">
                                <Target size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Hyper-Personalized Matching</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Our dynamic algorithm scores every property based on your unique lifestyle, budget, and commute preferences.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-accent-500/10 transition-all"
                        >
                            <div className="w-14 h-14 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-6">
                                <Map size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Geospatial Insights</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Draw a radius around your target area and see exactly what's available within your preferred commuting zones.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -10 }}
                            className="bg-slate-50 p-8 rounded-3xl border border-slate-100 hover:shadow-xl hover:shadow-green-500/10 transition-all"
                        >
                            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mb-6">
                                <ShieldCheck size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-3">Smart Price Evaluation</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Know instantly if a house is overpriced or a great deal with our real-time ML market pricing models.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900" />
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-primary-600/30 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-accent-600/30 rounded-full blur-3xl" />

                <div className="max-w-4xl mx-auto px-4 lg:px-8 relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to find your dream home?</h2>
                    <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto">
                        Take our 2-minute preference wizard and let AI do the heavy lifting.
                    </p>
                    <Link to="/wizard">
                        <Button size="lg" className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary-500/30" magnetic>
                            Start Your Journey
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Landing;
