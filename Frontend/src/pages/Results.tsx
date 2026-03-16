import { useState, useEffect } from 'react';
import { Filter, Map as MapIcon, ChevronDown } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Skeleton } from '../components/ui/Spinner';
import { Link } from 'react-router-dom';
import { ChromaGrid, type ChromaGridItem } from '../components/ui/ChromaGrid';
import { fetchApi } from '../utils/api';
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

const GOOGLE_MAPS_API_KEY = "AIzaSyDCfKoaqxficeuaZx4gJ11USC2IPm5DZEA";
const mapContainerStyle = {
    width: "100%",
    height: "600px",
};

// The PropertyCardRenderer has been replaced by the ChromaGrid component which encapsulates the card UI.

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

    const toggleSave = async (id: number | string) => {
        const numId = Number(id);
        const house = houses.find(h => h.id === numId);
        if (!house) return;

        const isCurrentlySaved = house.isSaved;
        
        // Optimistic UI update
        setHouses(prev => prev.map(h => h.id === numId ? { ...h, isSaved: !isCurrentlySaved } : h));

        try {
            if (isCurrentlySaved) {
                // Unsave (DELETE)
                await fetchApi('/saved/add/', {
                    method: 'DELETE',
                    body: JSON.stringify({ house_id: numId })
                });
            } else {
                // Save (POST)
                await fetchApi('/saved/add/', {
                    method: 'POST',
                    body: JSON.stringify({ house_id: numId })
                });
            }
        } catch (err) {
            console.error('Error toggling save:', err);
            // Rollback on error
            setHouses(prev => prev.map(h => h.id === numId ? { ...h, isSaved: isCurrentlySaved } : h));
        }
    };

    const formatPrice = (price: number) => {
        if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
        return `₹${(price / 100000).toFixed(2)} L`;
    };

    // Calculate segments based on budget
    const userBudgetStr = localStorage.getItem("userBudget");
    const userBudget = userBudgetStr ? JSON.parse(userBudgetStr) : null;
    let minBudget = userBudget?.min || 0;
    let maxBudget = userBudget?.max || Infinity;

    if (!userBudget && localStorage.getItem("wizard_data")) {
        try {
            const wiz = JSON.parse(localStorage.getItem("wizard_data") || "{}");
            if (wiz.budget) {
                minBudget = wiz.budget.min || 0;
                maxBudget = wiz.budget.max || Infinity;
            }
        } catch (e) { }
    }

    const inBudget = houses.filter((p) => p.price >= minBudget && p.price <= maxBudget);
    const belowBudget = houses.filter((p) => p.price < minBudget);
    const aboveBudget = houses.filter((p) => p.price > maxBudget);

    const mapHouseToChromaItem = (house: any): ChromaGridItem => ({
        id: house.id,
        image: house.image,
        title: house.title,
        subtitle: house.location,
        priceStr: formatPrice(house.price),
        score: house.score,
        beds: house.beds,
        baths: house.baths,
        area: house.area,
        isSaved: house.isSaved,
        tag: "AI Verified",
        borderColor: '#3B82F6',
        gradient: 'rgba(59, 130, 246, 0.15)'
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-20 pb-24 transition-colors duration-300">
            {/* Sticky Filter Bar */}
            <div className="sticky top-[64px] z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                        <Link to="/wizard" className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-full text-sm font-medium transition-colors border border-slate-200 dark:border-slate-700">
                            <Filter size={16} /> Edit Preferences
                        </Link>
                        <div className="hidden md:flex items-center gap-2">
                            <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium whitespace-nowrap border border-primary-100 dark:border-primary-800">
                                ₹50L - ₹2Cr
                            </span>
                            <span className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 rounded-full text-sm font-medium whitespace-nowrap border border-primary-100 dark:border-primary-800">
                                2, 3 BHK
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            Sort by: Match <ChevronDown size={14} />
                        </button>
                        <button
                            onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                            className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full transition-colors border ${viewMode === 'map' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
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
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your Perfect Matches</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-2">We found properties that closely match your lifestyle and budget.</p>
                    </div>
                </div>

                {loading ? (
                    // Skeleton Grid
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 h-[400px] flex flex-col">
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
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="text-red-500 mb-4 text-lg font-semibold">Error Loading Recommendations</div>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">{error}</p>
                        <Button onClick={fetchRecommendations} variant="primary">Try Again</Button>
                    </div>
                ) : houses.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
                        <div className="text-slate-400 mb-4 text-lg font-semibold">No Recommendations Found</div>
                        <p className="text-slate-500 dark:text-slate-400 mb-8">Try adjusting your preferences to find more matches.</p>
                        <Link to="/wizard">
                            <Button variant="primary">Go to Wizard</Button>
                        </Link>
                    </div>
                ) : viewMode === 'map' ? (
                    <div className="h-[600px] w-full bg-slate-200 dark:bg-slate-800 rounded-2xl overflow-hidden border border-slate-300 dark:border-slate-700 relative">
                        <MapDisplay houses={houses} />
                    </div>
                ) : (
                    <>
                        <div className="space-y-12 w-full">
                            {/* In Budget Section */}
                            <div>
                                {inBudget.length > 0 ? (
                                    <>
                                        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">In Your Budget</h2>
                                        <ChromaGrid 
                                            items={inBudget.map(mapHouseToChromaItem)} 
                                            onToggleSave={toggleSave} 
                                        />
                                    </>
                                ) : (
                                    <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center mb-8">
                                        <p className="text-slate-600 dark:text-slate-400 font-medium">No properties found in your exact budget. Showing nearby price options.</p>
                                    </div>
                                )}
                            </div>

                            {/* Below Budget Section */}
                            {belowBudget.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">Below Budget Deals</h2>
                                    <ChromaGrid 
                                        items={belowBudget.slice(0, 4).map(mapHouseToChromaItem)} 
                                        onToggleSave={toggleSave} 
                                    />
                                </div>
                            )}

                            {/* Above Budget Section */}
                            {aboveBudget.length > 0 && (
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">Slightly Above Budget Options</h2>
                                    <ChromaGrid 
                                        items={aboveBudget.slice(0, 4).map(mapHouseToChromaItem)} 
                                        onToggleSave={toggleSave} 
                                    />
                                </div>
                            )}
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
