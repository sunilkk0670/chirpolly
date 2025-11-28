import React from 'react';
import { motion } from 'framer-motion';

const ParrotAnimation: React.FC = () => {
    return (
        <div className="relative w-full h-full flex items-center justify-center">
            <svg 
                viewBox="0 0 200 200" 
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
            >
                {/* Body */}
                <motion.path 
                    d="M150,150 C150,100 120,50 100,50 C80,50 50,100 50,150 C50,200 100,200 100,200 C100,200 150,200 150,150 Z" 
                    fill="#8B5CF6"
                    initial={{ scale: 1 }}
                    animate={{ 
                        scale: [1, 1.01, 1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Head */}
                <motion.circle 
                    cx="100" 
                    cy="80" 
                    r="30" 
                    fill="#8B5CF6"
                    initial={{ y: 0 }}
                    animate={{ y: [0, -3, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Eye */}
                <circle 
                    cx="90" 
                    cy="75" 
                    r="4" 
                    fill="white"
                />
                
                {/* Beak */}
                <motion.path 
                    d="M70,85 L60,95 L65,105 L80,95 Z" 
                    fill="#F59E0B"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -2, 0, 2, 0] }}
                    transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Wing */}
                <motion.path 
                    d="M120,110 C140,120 150,140 130,160 C110,170 90,165 80,150 C90,145 100,130 100,120 C100,110 110,105 120,110 Z" 
                    fill="#7C3AED"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, -1, 0, 1, 0] }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                
                {/* Tail */}
                <motion.path 
                    d="M50,150 C40,160 30,160 40,170 C50,180 60,180 70,170 C60,165 50,155 50,150 Z" 
                    fill="#7C3AED"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: [0, 2, 0, -2, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </svg>
        </div>
    );
};

export default ParrotAnimation;
