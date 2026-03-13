import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Heart, Share2, MapPin,
    Bed, Bath, Square, Car, Waves, Map as MapIcon, ChevronRight, ChevronLeft
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { AIScoreRing } from '../components/ui/AIScoreRing';

const MOCK_IMAGES = [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200',
    'https://images.unsplash.com/photo-1600607687931-cebf5871f58a?w=1200',
    'https://images.unsplash.com/photo-1600607687644-aac4c1566f55?w=1200',
    'https://images.unsplash.com/photo-1600566753086-00f18ef22087?w=1200'
];

const Details = () => {
    useParams();
    const navigate = useNavigate();
    const [currentImage, setCurrentImage] = useState(0);
    const [isSaved, setIsSaved] = useState(false);

    const formatPrice = (price: number) => `₹${(price / 10000000).toFixed(2)} Cr`;

    // Mock Data
    const house = {
        title: 'Modern Luxury Villa in quiet neighborhood',
        location: 'Indira Nagar, Bengaluru',
        price: 35000000,
        estimatedPrice: 38000000,
        score: 92,
        beds: 4,
        baths: 4,
        area: 3200,
        desc: 'This stunning contemporary villa offers luxurious living with high-end finishes throughout. Featuring an open-concept floor plan, state-of-the-art kitchen, and a private landscaped backyard with a heated pool.',
        amenities: ['2 Car Parking', '24/7 Security', 'Private Pool', 'Gym Access', 'Smart Home Integration']
    };

    const nextImage = () => setCurrentImage(curr => (curr + 1) % MOCK_IMAGES.length);
    const prevImage = () => setCurrentImage(curr => curr === 0 ? MOCK_IMAGES.length - 1 : curr - 1);

    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            {/* Top Navbar Contextual */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3 flex items-center justify-between">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-primary-600 transition-colors">
                    <ArrowLeft size={20} /> <span className="font-medium hidden sm:inline">Back to Results</span>
                </button>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
                        <Share2 size={20} />
                    </button>
                    <button
                        onClick={() => setIsSaved(!isSaved)}
                        className={`p-2 rounded-full transition-colors flex items-center justify-center gap-2 px-4 shadow-sm border ${isSaved ? 'bg-red-50 border-red-200 text-red-500' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Heart size={18} className={isSaved ? 'fill-red-500 animate-pulse' : ''} />
                        {isSaved ? 'Saved' : 'Save'}
                    </button>
                </div>
            </div>

            {/* Hero Image Carousel */}
            <div className="relative h-[40vh] md:h-[60vh] w-full bg-slate-900 overflow-hidden group">
                <AnimatePresence initial={false} mode="wait">
                    <motion.img
                        key={currentImage}
                        src={MOCK_IMAGES[currentImage]}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="w-full h-full object-cover"
                    />
                </AnimatePresence>

                {/* Carousel Controls */}
                <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronLeft size={24} />
                </button>
                <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 backdrop-blur-md p-3 rounded-full text-white transition-colors opacity-0 group-hover:opacity-100">
                    <ChevronRight size={24} />
                </button>

                {/* Thumbnails */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {MOCK_IMAGES.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentImage(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${currentImage === idx ? 'w-8 bg-white' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Col: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3 text-sm font-medium">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">For Sale</span>
                            <span className="flex items-center gap-1 text-slate-500"><MapPin size={16} /> {house.location}</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">{house.title}</h1>
                        <div className="flex gap-6 text-slate-600 border-b border-slate-200 pb-6">
                            <span className="flex items-center gap-2"><Bed className="text-primary-500" /> <strong>{house.beds}</strong> Beds</span>
                            <span className="flex items-center gap-2"><Bath className="text-primary-500" /> <strong>{house.baths}</strong> Baths</span>
                            <span className="flex items-center gap-2"><Square className="text-primary-500" /> <strong>{house.area}</strong> sqft</span>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">About this home</h2>
                        <p className="text-slate-600 leading-relaxed text-lg">{house.desc}</p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Amenities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {house.amenities.map((am, i) => (
                                <div key={i} className="flex items-center gap-2 text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                                    <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
                                        {i % 2 === 0 ? <Car size={16} /> : <Waves size={16} />}
                                    </div>
                                    <span className="font-medium text-sm">{am}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Map Section Mock */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Location</h2>
                        <div className="h-[300px] w-full bg-slate-200 rounded-2xl flex items-center justify-center border border-slate-300">
                            <p className="text-slate-500 font-medium flex items-center gap-2">
                                <MapIcon /> Interactive Map View
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Col: Sticky Sidebar */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24 space-y-6">

                        {/* Price Card */}
                        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xl shadow-slate-200/50">
                            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-1">Asking Price</p>
                            <h2 className="text-4xl font-bold text-slate-900 mb-6">{formatPrice(house.price)}</h2>

                            <div className="bg-green-50 rounded-2xl p-4 mb-6 border border-green-100 flex items-start gap-4">
                                <div className="mt-1">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">✓</div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-green-800">Great Deal!</h4>
                                    <p className="text-green-700 text-sm mt-1">
                                        Priced roughly {formatPrice(Math.abs(house.price - house.estimatedPrice))} below our AI market estimate.
                                    </p>
                                </div>
                            </div>

                            <Button size="lg" className="w-full text-lg mb-3" magnetic>Contact Agent</Button>
                            <Button size="lg" variant="outline" className="w-full">Schedule Tour</Button>
                        </div>

                        {/* AI Score Card */}
                        <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative border border-slate-800 shadow-lg">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 rounded-full blur-3xl" />
                            <h3 className="text-xl font-bold mb-6 relative z-10 flex items-center justify-between">
                                AI Match Score
                                <span className="text-xs bg-white/20 px-2 py-1 rounded text-slate-300 font-normal">Based on your prefs</span>
                            </h3>

                            <div className="flex flex-col items-center justify-center relative z-10 mb-6">
                                <AIScoreRing score={house.score} size={140} />
                            </div>

                            <div className="space-y-3 relative z-10 text-sm">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Budget Match</span>
                                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[95%]" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Location Match</span>
                                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-yellow-400 w-[70%]" />
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-400">Lifestyle Fit</span>
                                    <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-green-500 w-[88%]" />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
