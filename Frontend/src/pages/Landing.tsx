
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Map, Target, ShieldCheck } from 'lucide-react';
import { Button } from '../components/ui/Button';

const Landing = () => {
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 1000], [0, 300]);
    const y2 = useTransform(scrollY, [0, 1000], [0, -200]);

    return (
        <div className="bg-slate-50 min-h-screen overflow-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 lg:px-8 max-w-7xl mx-auto flex flex-col items-center text-center">

                {/* Parallax Background Elements */}
                <motion.div style={{ y: y1 }} className="absolute top-20 -left-20 md:left-10 w-64 h-64 bg-primary-200/50 rounded-full blur-3xl pointer-events-none -z-10" />
                <motion.div style={{ y: y2 }} className="absolute top-40 -right-20 md:right-10 w-96 h-96 bg-accent-200/40 rounded-full blur-3xl pointer-events-none -z-10" />

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-700 font-medium text-sm mb-8 shadow-sm">
                        <Sparkles size={16} /> AI-Powered Real Estate
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-8">
                        Find Your Perfect Home <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-accent-600">
                            with AI Precision
                        </span>
                    </h1>

                    <p className="text-lg md:text-2xl text-slate-600 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Stop scrolling through endless listings. Tell our AI what matters to you, and we'll find your perfect match in seconds.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link to="/wizard">
                            <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full shadow-lg shadow-primary-500/30" magnetic>
                                Find My Home <ArrowRight className="ml-2" />
                            </Button>
                        </Link>
                        <Link to="/results">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 rounded-full bg-white/50 backdrop-blur-sm border-slate-200" magnetic>
                                Browse Listings
                            </Button>
                        </Link>
                    </div>
                </motion.div>

                {/* Hero Image / Dashboard Preview */}
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="mt-20 w-full max-w-5xl rounded-3xl border-4 border-white shadow-2xl overflow-hidden bg-white relative"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent pointer-events-none z-10" />
                    <img
                        src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80"
                        alt="Beautiful Home Interior"
                        className="w-full h-auto object-cover max-h-[600px]"
                    />
                    <div className="absolute bottom-8 left-8 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-white/50 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-2xl border-4 border-white shadow-inner">
                            98
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Match Score</p>
                            <p className="text-lg font-bold text-slate-900">Perfect fit for you</p>
                        </div>
                    </div>
                </motion.div>
            </section>

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
