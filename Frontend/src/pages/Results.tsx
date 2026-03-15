import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Map as MapIcon, ChevronDown, CheckCircle2, Heart } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { AIScoreRing } from '../components/ui/AIScoreRing';
import { Skeleton } from '../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { fetchApi } from '../utils/api';
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyDCfKoaqxficeuaZx4gJ11USC2IPm5DZEA";
const mapContainerStyle = {
    width: "100%",
    height: "600px",
};

const Results = () => {
    const [loading, setLoading] = useState(true);
    const [houses, setHouses] = useState<any[]>([]);
    const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
    const [error, setError] = useState<string | null>(null);

    const fetchRecommendations = async () => {
        try {
            setLoading(true);
            
            // 1. Read search data from localStorage
            let storageData = localStorage.getItem("searchData");
            
            // Fallback: Check if we have wizard_data and recover from it
            if (!storageData) {
                const wizardDataStr = localStorage.getItem("wizard_data");
                if (wizardDataStr) {
                    try {
                        const wizardData = JSON.parse(wizardDataStr);
                        if (wizardData.location) {
                            const recoveredData = {
                                city: wizardData.location.city || "Bengaluru",
                                lat: wizardData.location.lat,
                                lng: wizardData.location.lng,
                            };
                            localStorage.setItem("searchData", JSON.stringify(recoveredData));
                            storageData = JSON.stringify(recoveredData);
                        }
                    } catch (e) {
                        console.error("Error parsing wizard_data:", e);
                    }
                }
            }

            if (!storageData) {
                setError("No search metadata found. Please complete the search wizard to select a location first.");
                setLoading(false);
                return;
            }

            const searchData = JSON.parse(storageData);
            const { city } = searchData;

            if (!city) {
                setError("No city selected. Please try the wizard again.");
                setLoading(false);
                return;
            }

            // 2. Fetch recommendations using GET with city
            const [data, savedData] = await Promise.all([
                fetchApi(`/houses/by-city/?city=${city}`),
                fetchApi('/saved/')
            ]);
            
            const savedIds = new Set(savedData.map((item: any) => item.house));
            
            // Map the API response to fit the frontend structure
            // Note: house.values() in Django returns raw DB fields
            const mappedHouses = data.map((item: any) => ({
                id: item.id,
                title: item.title,
                price: parseFloat(item.price),
                score: 100, // Static score for simple system
                beds: item.bedrooms,
                baths: item.bathrooms,
                area: item.square_feet,
                location: item.city,
                latitude: item.latitude,
                longitude: item.longitude,
                image: item.image_url || '/default-house.jpg',
                isSaved: savedIds.has(item.id),
                details: item
            }));
            setHouses(mappedHouses);
        } catch (err: any) {
            console.error('Error fetching recommendations:', err);
            setError(err.message || 'Failed to load recommendations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecommendations();
    }, []);

    const toggleSave = async (id: number) => {
        const house = houses.find(h => h.id === id);
        if (!house) return;

        const isCurrentlySaved = house.isSaved;
        
        // Optimistic UI update
        setHouses(prev => prev.map(h => h.id === id ? { ...h, isSaved: !isCurrentlySaved } : h));

        try {
            if (isCurrentlySaved) {
                // Unsave (DELETE)
                await fetchApi('/saved/add/', {
                    method: 'DELETE',
                    body: JSON.stringify({ house_id: id })
                });
            } else {
                // Save (POST)
                await fetchApi('/saved/add/', {
                    method: 'POST',
                    body: JSON.stringify({ house_id: id })
                });
            }
        } catch (err) {
            console.error('Error toggling save:', err);
            // Rollback on error
            setHouses(prev => prev.map(h => h.id === id ? { ...h, isSaved: isCurrentlySaved } : h));
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        return `₹${(price / 100000).toFixed(2)} L`;
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-20 pb-24">
            {/* Sticky Filter Bar */}
            <div className="sticky top-[64px] z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                        <Link to="/wizard" className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-slate-200">
                            <Filter size={16} /> Edit Preferences
                        </Link>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium whitespace-nowrap border border-primary-100">
                                ₹50L - ₹2Cr
                            </span>
                            <span className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm font-medium whitespace-nowrap border border-primary-100">
                                2, 3 BHK
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-colors">
                            Sort by: Match <ChevronDown size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors border ${viewMode === 'map' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                                }`}
                        >
                            <MapIcon size={16} /> {viewMode === 'grid' ? 'Map View' : 'Grid View'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Your Perfect Matches</h1>
                        <p className="text-slate-500 mt-2">We found properties that closely match your lifestyle and budget.</p>
                    </div>
                </div>

                {loading ? (
                    // Skeleton Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-[400px] flex flex-col">
                                <Skeleton className="h-48 w-full rounded-xl mb-4" />
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2 mb-6" />
                                <div className="mt-auto flex justify-between">
                                    <Skeleton className="h-8 w-1/3" />
                                    <Skeleton className="h-10 w-10 rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-red-500 mb-4 text-lg font-semibold">Error Loading Recommendations</div>
                        <p className="text-slate-500 mb-8">{error}</p>
                        <Button onClick={fetchRecommendations} variant="primary">Try Again</Button>
                    </div>
                ) : houses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div className="text-slate-400 mb-4 text-lg font-semibold">No Recommendations Found</div>
                        <p className="text-slate-500 mb-8">Try adjusting your preferences to find more matches.</p>
                        <Link to="/wizard">
                            <Button variant="primary">Go to Wizard</Button>
                        </Link>
                    </div>
                ) : viewMode === 'map' ? (
                    <div className="h-[600px] w-full bg-slate-200 rounded-2xl overflow-hidden border border-slate-300 relative">
                        <MapDisplay houses={houses} />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <AnimatePresence>
                                {houses.map((house, index) => (
                                    <motion.div
                                        key={house.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index % 6 * 0.1 }}
                                        layout
                                    >
                                        <Card tilt className="overflow-hidden flex flex-col h-full group">
                                            <Link to={`/house/${house.id}`} className="block relative h-56 overflow-hidden">
                                                <img
                                                    src={house.image}
                                                    alt={house.title}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm border border-white/50 flex items-center gap-1">
                                                    <CheckCircle2 size={12} className="text-primary-600" /> AI Verified
                                                </div>
                                                {/* Interactive Save Button */}
                                                <button
                                                    onClick={(e) => { e.preventDefault(); toggleSave(house.id); }}
                                                    className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm border border-white/50 text-slate-400 hover:text-red-500 transition-colors z-10"
                                                >
                                                    <Heart
                                                        size={18}
                                                        className={house.isSaved ? 'fill-red-500 text-red-500 animate-pulse' : ''}
                                                    />
                                                </button>
                                            </Link>

                                            <div className="p-5 flex flex-col flex-grow">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-primary-600 transition-colors">
                                                            {house.title}
                                                        </h3>
                                                        <p className="text-slate-500 text-sm">{house.location}</p>
                                                    </div>
                                                    <div className="-mt-12 -mr-2 bg-white rounded-full p-1 shadow-md z-10">
                                                        <AIScoreRing score={house.score} size={50} />
                                                    </div>
                                                </div>

                                                <div className="flex gap-4 text-sm text-slate-600 mb-6">
                                                    <span><strong>{house.beds}</strong> Beds</span>
                                                    <span><strong>{house.baths}</strong> Baths</span>
                                                    <span><strong>{house.area}</strong> sqft</span>
                                                </div>

                                                <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                                                    <span className="text-2xl font-bold tracking-tight text-slate-900">
                                                        {formatPrice(house.price)}
                                                    </span>
                                                    <Link to={`/house/${house.id}`}>
                                                        <Button variant="outline" size="sm" className="font-semibold px-4 rounded-full border-slate-200">
                                                            Details
                                                        </Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Load More Trigger - Removed as pagination is not implemented */}
                    </>
                )}
            </div>
        </div>
    );
};

const MapDisplay = ({ houses }: { houses: any[] }) => {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    });

    const searchData = JSON.parse(localStorage.getItem("searchData") || "{}");
    const center = {
        lat: searchData.lat || 12.9716,
        lng: searchData.lng || 77.5946
    };

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={center}
            zoom={12}
            options={{
                disableDefaultUI: false,
                zoomControl: true,
            }}
        >
            {houses.map((house) => (
                house.latitude && house.longitude && (
                    <Marker
                        key={house.id}
                        position={{ 
                            lat: parseFloat(house.latitude), 
                            lng: parseFloat(house.longitude) 
                        }}
                        title={house.title}
                    />
                )
            ))}
        </GoogleMap>
    ) : (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-slate-500">Loading Map...</p>
        </div>
    );
};

export default Results;
