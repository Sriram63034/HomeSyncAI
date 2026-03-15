import { motion } from 'framer-motion';

interface CinematicBackgroundProps {
    mouseX: any;
    mouseY: any;
}

const FloatingHeroBackground = ({ mouseX, mouseY }: CinematicBackgroundProps) => {
    // 3 Layers for Parallax Depth
    // Layer 1: Base Gradient & Blur
    // Layer 2: House Image
    // Layer 3: Subtle Mesh Overlays

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-white">
            {/* Layer 1: Ambient Glow Blobs (Moves slowest) */}
            <motion.div
                className="absolute inset-0 z-10"
                style={{ x: mouseX, y: mouseY }}
            >
                {/* Blue Glow */}
                <motion.div
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[20%] left-[30%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[100px]"
                />
                {/* Purple Glow */}
                <motion.div
                    animate={{
                        y: [0, 40, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[20%] right-[30%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[100px]"
                />
            </motion.div>

            {/* Layer 2: Cinematic House Image */}
            <motion.div
                className="absolute inset-0 z-0 overflow-hidden"
                animate={{
                    y: [0, -10, 0]
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                style={{
                    x: mouseX,
                    y: mouseY,
                    scale: 1.1 // Margin for parallax
                }}
            >
                <img
                    src="https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?q=80&w=1325&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Background"
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{ objectPosition: 'center 100%' }}
                />
            </motion.div>
        </div>
    );
};

export default FloatingHeroBackground;
