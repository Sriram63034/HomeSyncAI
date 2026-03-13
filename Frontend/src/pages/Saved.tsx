import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { fetchApi } from '../utils/api';
import { Skeleton } from '../components/ui/Spinner';

const Saved = () => {
    const [savedHouses, setSavedHouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedHouses = async () => {
        try {
            setLoading(true);
            const data = await fetchApi('/saved/');
            // Map backend data to frontend structure
            const mappedData = data.map((item: any) => ({
                id: item.house_details.id,
                title: item.house_details.title,
                price: parseFloat(item.house_details.price),
                score: item.house_details.score || 85, // Fallback score
                beds: item.house_details.bedrooms,
                baths: item.house_details.bathrooms,
                area: item.house_details.square_feet,
                location: `${item.house_details.area}, ${item.house_details.city}`,
                image: item.house_details.image_url || '/default-house.jpg',
            }));
            setSavedHouses(mappedData);
            setError(null);
        } catch (err: any) {
            console.error('Error fetching saved houses:', err);
            setError(err.message || 'Failed to load saved houses');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSavedHouses();
    }, []);

    const formatPrice = (price: number) => {
        if (!price) return 'N/A';
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        return `₹${(price / 100000).toFixed(2)} L`;
    };

    const handleRemove = async (id: number) => {
        // Optimistic UI update
        const previousHouses = [...savedHouses];
        setSavedHouses(prev => prev.filter(h => h.id !== id));

        try {
            await fetchApi('/saved/add/', {
                method: 'DELETE',
                body: JSON.stringify({ house_id: id })
            });
        } catch (err) {
            console.error('Error removing house:', err);
            // Rollback on error
            setSavedHouses(previousHouses);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-24">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Saved Homes</h1>
                <p className="text-slate-500 mb-8">Review and compare your favorite properties.</p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-[400px] flex flex-col">
                                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto">
                        <div className="text-red-500 mb-4 text-lg font-semibold">Error Loading Saved Homes</div>
                        <p className="text-slate-500 mb-8">{error}</p>
                        <Button onClick={fetchSavedHouses} variant="primary">Try Again</Button>
                    </div>
                ) : savedHouses.length === 0 ? (
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
