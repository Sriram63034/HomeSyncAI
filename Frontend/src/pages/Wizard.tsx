import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
    Building2, Home, Landmark, Users, Briefcase, ChevronRight, ChevronLeft, MapPin,
    Car, Dumbbell, Waves, TreePine, Shield, Train
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Slider } from '../components/ui/Slider';
import { Card } from '../components/ui/Card';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useAuth } from '../context/AuthContext';

// Fix Leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Mock Icons map for dynamic rendering


const TOTAL_STEPS = 7;

// Form Data Type
interface WizardData {
    buyerType: string;
    budget: [number, number];
    location: { lat: number; lng: number; radiusBase: number }; // radiusBase in km
    houseTypes: string[];
    bedrooms: string[];
    amenities: string[];
    lifestyle: string[];
}

// ----------------------------------------------------------------------
// Step Components (to keep file manageable, inline them)
// ----------------------------------------------------------------------

const AnimatedStep = ({ children, direction }: { children: React.ReactNode, direction: number }) => {
    const variants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 300 : -300,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 300 : -300,
            opacity: 0
        })
    };

    return (
        <motion.div
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            className="w-full absolute top-0 left-0 pb-24"
        >
            {children}
        </motion.div>
    );
};

// --- Step 1 ---
const StepBuyerType = ({ data, setData }: { data: WizardData, setData: any }) => {
    const options = [
        { id: 'first-time', label: 'First-time Buyer', icon: <Home className="text-primary-500 mb-4" size={32} />, desc: 'Looking for your perfect starter home' },
        { id: 'investor', label: 'Investor', icon: <Briefcase className="text-accent-500 mb-4" size={32} />, desc: 'Seeking high ROI and rental yields' },
        { id: 'family', label: 'Family Upgrade', icon: <Users className="text-green-500 mb-4" size={32} />, desc: 'Need more space for a growing family' },
    ];

    return (
        <div className="space-y-6">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">What brings you here?</h2>
                <p className="text-slate-500 mt-2">Let us tailor the AI matching to your goals.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {options.map((opt) => (
                    <Card
                        key={opt.id}
                        tilt
                        onClick={() => setData({ ...data, buyerType: opt.id })}
                        className={`p-6 cursor-pointer border-2 transition-all duration-300 ${data.buyerType === opt.id ? 'border-primary-500 ring-4 ring-primary-500/20 bg-primary-50/50' : 'border-transparent hover:border-slate-300'
                            }`}
                    >
                        <div className="flex flex-col items-center text-center">
                            {opt.icon}
                            <h3 className="font-semibold text-lg text-slate-900">{opt.label}</h3>
                            <p className="text-sm text-slate-500 mt-2">{opt.desc}</p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

// --- Step 2 ---
const StepBudget = ({ data, setData }: { data: WizardData, setData: any }) => {
    const formatINR = (val: number) => {
        if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
        if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
        return `₹${val}`;
    };

    return (
        <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">Set your budget</h2>
                <p className="text-slate-500 mt-2">Filter properties within your financial comfort zone.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <h3 className="font-semibold text-slate-700 mb-8 text-center text-xl">
                    {formatINR(data.budget[0])} - {formatINR(data.budget[1])}
                </h3>

                <Slider
                    min={1000000} // 10L
                    max={50000000} // 5Cr
                    step={1000000} // 1L steps
                    value={data.budget}
                    onChange={(val) => setData({ ...data, budget: val })}
                    formatValue={formatINR}
                />

                <div className="mt-8 flex justify-center gap-4">
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-center">
                        <span className="text-xs text-slate-500 block">Min</span>
                        <span className="font-semibold">{formatINR(data.budget[0])}</span>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl text-center">
                        <span className="text-xs text-slate-500 block">Max</span>
                        <span className="font-semibold">{formatINR(data.budget[1])}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Step 3 ---
function LocationPicker({ data, setData }: any) {
    const mapRef = React.useRef<any>(null);

    const MapEvents = () => {
        useMapEvents({
            click(e) {
                setData({ ...data, location: { ...data.location, lat: e.latlng.lat, lng: e.latlng.lng } });
            },
        });
        return null;
    };

    return (
        <div className="space-y-6">
            <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-slate-900">Where do you want to live?</h2>
                <p className="text-slate-500 mt-2">Select an area and adjust the search radius.</p>
            </div>

            <div className="h-[400px] w-full rounded-2xl overflow-hidden relative shadow-inner border border-slate-200">
                <MapContainer
                    center={[data.location.lat, data.location.lng]}
                    zoom={12}
                    scrollWheelZoom={true}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MapEvents />
                    <Marker position={[data.location.lat, data.location.lng]} />
                    <Circle
                        center={[data.location.lat, data.location.lng]}
                        radius={data.location.radiusBase * 1000}
                        pathOptions={{ fillColor: '#3b82f6', color: '#1d4ed8', weight: 1 }}
                    />
                </MapContainer>

                {/* Radius Controls Overlay */}
                <div className="absolute top-4 right-4 z-[400] bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white flex flex-col gap-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Search Radius</p>
                    <div className="flex gap-2">
                        {[2, 5, 10, 20].map((r) => (
                            <button
                                key={r}
                                onClick={() => setData({ ...data, location: { ...data.location, radiusBase: r } })}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${data.location.radiusBase === r ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {r}k
                            </button>
                        ))}
                    </div>
                </div>

                {/* Search Overlay Mock */}
                <div className="absolute top-4 left-4 z-[400] w-64">
                    <div className="bg-white rounded-xl shadow-lg flex items-center px-4 py-3 border border-slate-100">
                        <MapPin size={18} className="text-primary-500 mr-2" />
                        <input type="text" placeholder="Search city or area..." className="w-full text-sm outline-none" />
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Step 4 --- House Type
const StepHouseType = ({ data, setData }: any) => {
    const types = [
        { id: 'apartment', label: 'Apartment', icon: <Building2 className="mb-2" size={24} /> },
        { id: 'villa', label: 'Villa', icon: <Home className="mb-2" size={24} /> },
        { id: 'townhouse', label: 'Townhouse', icon: <Landmark className="mb-2" size={24} /> },
        { id: 'independent', label: 'Independent', icon: <TreePine className="mb-2" size={24} /> },
    ];

    const handleToggle = (id: string) => {
        const isSelected = data.houseTypes.includes(id);
        if (isSelected) {
            setData({ ...data, houseTypes: data.houseTypes.filter((t: string) => t !== id) });
        } else {
            setData({ ...data, houseTypes: [...data.houseTypes, id] });
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-bold text-slate-900">What type of house?</h2>
                <p className="text-slate-500 mt-2">Select one or more property types.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {types.map((type) => {
                    const isSelected = data.houseTypes.includes(type.id);
                    return (
                        <motion.button
                            key={type.id}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToggle(type.id)}
                            className={`p-6 rounded-2xl flex flex-col items-center justify-center border-2 transition-all ${isSelected ? 'border-primary-500 bg-primary-50 text-primary-700 ring-4 ring-primary-500/20' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                                }`}
                        >
                            {type.icon}
                            <span className="font-medium">{type.label}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};

// --- Step 5, 6, 7 Combos (Shortened for brevity but fully functional) ---
const StepPills = ({ title, options, selected, onToggle, multi = true }: any) => {
    return (
        <div className="space-y-6 max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-slate-900 mb-8">{title}</h2>
            <div className="flex flex-wrap justify-center gap-3">
                {options.map((opt: any) => {
                    const isSelected = selected.includes(opt.id);
                    return (
                        <motion.button
                            key={opt.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (!multi) {
                                    onToggle([opt.id]);
                                } else {
                                    if (isSelected) onToggle(selected.filter((i: string) => i !== opt.id));
                                    else onToggle([...selected, opt.id]);
                                }
                            }}
                            className={`px-6 py-3 rounded-full border flex items-center gap-2 font-medium transition-colors ${isSelected
                                    ? 'bg-primary-600 border-primary-600 text-white shadow-md shadow-primary-500/30'
                                    : 'bg-white border-slate-200 text-slate-700 hover:border-primary-300 hover:bg-slate-50'
                                }`}
                        >
                            {opt.icon && <span className={isSelected ? 'text-white' : 'text-slate-400'}>{opt.icon}</span>}
                            {opt.label}
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
};


// ----------------------------------------------------------------------
// Main Wizard Component
// ----------------------------------------------------------------------

const Wizard = () => {
    const [[page, direction], setPage] = useState([0, 0]);
    const navigate = useNavigate();
    useAuth();

    // Attempt to restore state if available, else initial
    const [data, setData] = useState<WizardData>(() => {
        const saved = localStorage.getItem('wizard_data');
        if (saved) return JSON.parse(saved);
        return {
            buyerType: '',
            budget: [5000000, 20000000], // 50L to 2Cr
            location: { lat: 12.9716, lng: 77.5946, radiusBase: 5 }, // Default BGLR
            houseTypes: [],
            bedrooms: [],
            amenities: [],
            lifestyle: []
        };
    });

    // Save to local storage on change
    useEffect(() => {
        localStorage.setItem('wizard_data', JSON.stringify(data));
    }, [data]);

    const paginate = (newDirection: number) => {
        const newPage = page + newDirection;
        if (newPage >= 0 && newPage < TOTAL_STEPS) {
            setPage([newPage, newDirection]);
        } else if (newPage === TOTAL_STEPS) {
            // Submit & navigate to results
            navigate('/results');
        }
    };

    const progressPercentage = ((page + 1) / TOTAL_STEPS) * 100;

    // Validation logic to prevent moving forward if empty (simplified)
    const canProceed = () => {
        if (page === 0 && !data.buyerType) return false;
        if (page === 3 && data.houseTypes.length === 0) return false;
        if (page === 4 && data.bedrooms.length === 0) return false;
        return true;
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-32 overflow-hidden flex flex-col">
            {/* Progress Bar & Header */}
            <div className="max-w-4xl mx-auto w-full px-6 mb-12">
                <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
                    <span>Step {page + 1} of {TOTAL_STEPS}</span>
                    <button onClick={() => navigate('/results')} className="hover:text-primary-600 transition-colors">Skip Wizard</button>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-primary-600"
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                </div>
            </div>

            {/* Step Container */}
            <div className="max-w-5xl mx-auto w-full px-6 flex-grow relative">
                <AnimatePresence initial={false} custom={direction}>
                    {page === 0 && (
                        <AnimatedStep key="step0" direction={direction}>
                            <StepBuyerType data={data} setData={setData} />
                        </AnimatedStep>
                    )}
                    {page === 1 && (
                        <AnimatedStep key="step1" direction={direction}>
                            <StepBudget data={data} setData={setData} />
                        </AnimatedStep>
                    )}
                    {page === 2 && (
                        <AnimatedStep key="step2" direction={direction}>
                            <LocationPicker data={data} setData={setData} />
                        </AnimatedStep>
                    )}
                    {page === 3 && (
                        <AnimatedStep key="step3" direction={direction}>
                            <StepHouseType data={data} setData={setData} />
                        </AnimatedStep>
                    )}
                    {page === 4 && (
                        <AnimatedStep key="step4" direction={direction}>
                            <StepPills
                                title="How many bedrooms?"
                                multi={true}
                                options={[
                                    { id: '1', label: '1 BHK' }, { id: '2', label: '2 BHK' },
                                    { id: '3', label: '3 BHK' }, { id: '4+', label: '4+ BHK' }
                                ]}
                                selected={data.bedrooms}
                                onToggle={(val: any) => setData({ ...data, bedrooms: val })}
                            />
                        </AnimatedStep>
                    )}
                    {page === 5 && (
                        <AnimatedStep key="step5" direction={direction}>
                            <StepPills
                                title="Must-have amenities"
                                multi={true}
                                options={[
                                    { id: 'parking', label: 'Parking', icon: <Car size={16} /> },
                                    { id: 'gym', label: 'Gym', icon: <Dumbbell size={16} /> },
                                    { id: 'pool', label: 'Pool', icon: <Waves size={16} /> },
                                    { id: 'security', label: 'Security', icon: <Shield size={16} /> },
                                    { id: 'metro', label: 'Near Metro', icon: <Train size={16} /> },
                                ]}
                                selected={data.amenities}
                                onToggle={(val: any) => setData({ ...data, amenities: val })}
                            />
                        </AnimatedStep>
                    )}
                    {page === 6 && (
                        <AnimatedStep key="step6" direction={direction}>
                            <StepPills
                                title="Your Lifestyle"
                                multi={true}
                                options={[
                                    { id: 'quiet', label: 'Quiet Neighborhood' },
                                    { id: 'city', label: 'City Center' },
                                    { id: 'tech', label: 'Near Tech Parks' },
                                    { id: 'luxury', label: 'Luxury Lifestyle' },
                                    { id: 'schools', label: 'Near Good Schools' },
                                ]}
                                selected={data.lifestyle}
                                onToggle={(val: any) => setData({ ...data, lifestyle: val })}
                            />
                        </AnimatedStep>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation Footer Fixed at Bottom */}
            <div className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-200 py-4 px-6 z-50">
                <div className="max-w-4xl mx-auto flex justify-between items-center">
                    <Button
                        variant="ghost"
                        onClick={() => paginate(-1)}
                        disabled={page === 0}
                        className={page === 0 ? "opacity-0 pointer-events-none" : ""}
                    >
                        <ChevronLeft className="mr-2 h-5 w-5" /> Back
                    </Button>

                    <Button
                        size="lg"
                        onClick={() => paginate(1)}
                        disabled={!canProceed()}
                        magnetic
                    >
                        {page === TOTAL_STEPS - 1 ? 'Find Houses' : 'Next Step'}
                        {page !== TOTAL_STEPS - 1 && <ChevronRight className="ml-2 h-5 w-5" />}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Wizard;
