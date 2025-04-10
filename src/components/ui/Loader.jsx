import { motion } from 'framer-motion';

const Loader = () => {
    return (
        <div className="fixed inset-0 min-h-screen flex items-center justify-center bg-white bg-opacity-1 z-50">
            <motion.div
                className="bg-white p-6 rounded-full shadow-xl"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                    duration: 0.3,
                    ease: "easeOut"
                }}
            >
                <motion.svg
                    width="64"
                    height="64"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                        duration: 1,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatType: "loop"
                    }}
                    className="text-blue-500"
                >
                    {/* Gradient circle background */}
                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2563eb" /> {/* from-blue-600 */}
                            <stop offset="100%" stopColor="#60a5fa" /> {/* to-blue-400 */}
                        </linearGradient>
                    </defs>

                    {/* Circle */}
                    <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="url(#gradient)"
                        strokeWidth="0"
                    />

                    {/* Letter B */}
                    <text
                        x="16"
                        y="21"
                        textAnchor="middle"
                        fill="white"
                        fontFamily="inter"
                        fontWeight="bold"
                        fontSize="14"
                    >
                        B
                    </text>
                </motion.svg>
            </motion.div>
        </div>
    );
};

export default Loader;