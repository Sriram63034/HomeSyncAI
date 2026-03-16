import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { HeartOff, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ChromaGrid } from '../components/ui/ChromaGrid';
import { fetchApi } from '../utils/api';
import { Skeleton } from '../components/ui/Spinner';

const Saved = () => {
    const [savedHouses, setSavedHouses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSavedHouses = async () => {
        try {
            setLoading(true);
            const savedIds: number[] = JSON.parse(localStorage.getItem("savedProperties") || "[]");
            
            if (savedIds.length === 0) {
                setSavedHouses([]);
                setLoading(false);
                return;
            }

            // Fetch each saved property details
            const promises = savedIds.map(id => fetchApi(`/houses/${id}/`).catch(() => null));
            const results = await Promise.all(promises);
            
            // Filter out any failed requests (nulls) and map
            const validData = results.filter(house => house !== null);
            
            const mappedData = validData.map((item: any) => ({
                id: item.id,
                title: item.title,
                price: parseFloat(item.price),
                score: item.score || 85, // Fallback score
                beds: item.bedrooms,
                baths: item.bathrooms,
                area: item.square_feet,
                location: `${item.area}, ${item.city}`,
                image: item.image_url || '/default-house.jpg',
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

    const handleRemove = async (id: number | string) => {
        const numId = Number(id);
        // Optimistic UI update
        setSavedHouses(prev => prev.filter(h => h.id !== numId));

        try {
            let saved: number[] = JSON.parse(localStorage.getItem("savedProperties") || "[]");
            saved = saved.filter(savedId => savedId !== numId);
            localStorage.setItem("savedProperties", JSON.stringify(saved));
        } catch (err) {
            console.error('Error removing house from local storage:', err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-24 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 lg:px-8">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Saved Homes</h1>
                <p className="text-slate-500 dark:text-slate-400 mb-8">Review and compare your favorite properties.</p>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] flex flex-col">
                                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm max-w-2xl mx-auto">
                        <div className="text-red-500 mb-4 text-lg font-semibold">Error Loading Saved Homes</div>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
                        <Button onClick={fetchSavedHouses} variant="primary">Try Again</Button>
                    </div>
                ) : savedHouses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-12 text-center max-w-2xl mx-auto mt-12 shadow-sm"
                    >
                        <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <HeartOff size={40} className="text-slate-400 dark:text-slate-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">No saved homes yet</h2>
                        <p className="text-slate-600 dark:text-slate-400 mb-8">
                            Explore your personalized AI recommendations and save the ones you love to compare them later.
                        </p>
                        <Link to="/results">
                            <Button size="lg" magnetic className="gap-2 text-lg">
                                Explore Matches <ArrowRight size={20} />
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    <div className="w-full">
                        <ChromaGrid 
                            items={savedHouses.map(house => ({
                                id: house.id,
                                image: house.image,
                                title: house.title,
                                subtitle: house.location,
                                priceStr: formatPrice(house.price),
                                score: house.score,
                                beds: house.beds,
                                baths: house.baths,
                                area: house.area,
                                isSaved: true,
                                tag: "Saved",
                                borderColor: '#F43F5E',
                                gradient: 'rgba(244, 63, 94, 0.15)'
                            }))} 
                            onToggleSave={handleRemove} 
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Saved;
