import React from 'react';
import { motion } from 'framer-motion';
import { HeartOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

// Mock Data reusing structure from Results but fixed
const MOCK_SAVED = [
    {
        id: 1,
        title: 'Modern Luxury Villa in quiet neighborhood',
        price: 35000000,
        score: 92,
        beds: 4,
        baths: 4,
        area: 3200,
        location: 'Indira Nagar',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
    },
    {
        id: 4,
        title: 'Contemporary Townhouse with Private Garden',
        price: 18000000,
        score: 85,
        beds: 3,
        baths: 2,
        area: 1800,
        location: 'HSR Layout',
        image: 'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=400&q=80',
    }
];

const Saved = () => {
    const [savedHouses, setSavedHouses] = React.useState(MOCK_SAVED);

    const formatPrice = (price: number) => `₹${(price / 10000000).toFixed(2)} Cr`;

    const handleRemove = (id: number) => {
        setSavedHouses(prev => prev.filter(h => h.id !== id));
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Homes</h1>
                <p className="text-slate-500 mb-8">Review and compare your favorite properties.</p>

                {savedHouses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-2xl mx-auto mt-12 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HeartOff size={40} className="text-slate-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">No saved homes yet</h2>
                        <p className="text-slate-600 mb-8">
                            Explore your personalized AI recommendations and save the ones you love to compare them later.
                        </p>
                        <Link to="/results">
                            <Button size="lg" magnetic className="gap-2 text-lg">
                                Explore Matches <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {savedHouses.map(house => (
                            <motion.div
                                key={house.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Card tilt className="overflow-hidden flex flex-col h-full group">
                                    <Link to={`/house/${house.id}`} className="block relative h-56 overflow-hidden">
                                        <img
                                            src={house.image}
                                            alt={house.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <button
                                            onClick={(e) => { e.preventDefault(); handleRemove(house.id); }}
                                            className="absolute top-4 right-4 p-2 bg-red-50 backdrop-blur-sm rounded-full shadow-sm border border-red-100 text-red-500 hover:bg-red-100 transition-colors z-10"
                                            title="Remove from saved"
                                        >
                                            <HeartOff size={18} />
                                        </button>
                                        <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-lg text-white font-bold inline-block shadow-md">
                                            {house.score}% AI Match
                                        </div>
                                    </Link>

                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="mb-4">
                                            <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                                {house.title}
                                            </h3>
                                            <p className="text-slate-500 text-sm">{house.location}</p>
                                        </div>

                                        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                            <span className="text-2xl font-bold tracking-tight text-slate-900">
                                                {formatPrice(house.price)}
                                            </span>
                                            <Link to={`/house/${house.id}`}>
                                                <Button variant="ghost" size="sm" className="font-semibold px-4 text-primary-600 hover:text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-full">
                                                    View
                                                </Button>
                                            </Link>
                                        </div>
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Saved;
