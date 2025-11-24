

import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import type { Scenario, Lesson, Challenge } from '../types';
import { CHALLENGES, VIEWS } from '../constants';
import { FireIcon, StarIcon } from './icons/Icons';
import { generateContent as genaiGenerateContent } from '../services/geminiService';

// --- Reusable Components ---

const ProgressBar: React.FC<{ progress: number, colorClass?: string }> = ({ progress, colorClass = 'bg-yellow-400' }) => (
    <div className="w-full bg-slate-200 rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
    </div>
);

const itemColorMap: Record<string, { bg: string; icon: string }> = {
    'en_01': { bg: 'bg-yellow-100', icon: '👋' },
    'restaurant-en': { bg: 'bg-purple-100', icon: '🍽️' },
};

const ItemCard: React.FC<{
    item: Lesson | Scenario;
    onSelect: () => void;
}> = ({ item, onSelect }) => {
    // Fix: Use a type guard to safely access either the `id` from a `Scenario` object or the `lesson_id` from a `Lesson` object.
    const itemId = 'id' in item ? item.id : item.lesson_id;
    const { bg, icon } = itemColorMap[itemId] || { bg: 'bg-slate-100', icon: item.emoji };

    return (
        <motion.div
            className="h-full"
            whileHover={{ y: -3 }}
        >
            <button
                onClick={onSelect}
                className="w-full h-full text-left p-4 bg-white rounded-xl shadow-md flex items-center gap-x-4 hover:shadow-lg transition-shadow duration-300"
            >
                <div className={`text-2xl ${bg} p-3 rounded-lg`}>{icon}</div>
                <div>
                    <h3 className="font-bold text-slate-800">{item.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">{item.description}</p>
                </div>
            </button>
        </motion.div>
    );
};

const StatCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white p-5 rounded-xl shadow-md h-full">
        <h3 className="font-bold text-lg font-poppins text-slate-700 mb-3">{title}</h3>
        <div className="flex items-center gap-4">
            {icon}
            <div className="flex-1">
                {children}
            </div>
        </div>
    </div>
);



// --- Main Dashboard Component ---

interface DashboardProps {
    onScenarioSelect: (scenario: Scenario) => void;
    onLessonSelect: (lesson: Lesson) => void;
    scenarios: Scenario[];
    lessons: Lesson[];
    onNavigate: (view: any) => void; // Using any to avoid complex view type from App.tsx
    isInactive: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ onScenarioSelect, onLessonSelect, scenarios, lessons, isInactive }) => {
    const [dailyChallenge, setDailyChallenge] = useState<Challenge | null>(null);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const dailyChallenges = CHALLENGES.filter(c => c.type === 'daily');
        if (dailyChallenges.length > 0) {
            setDailyChallenge(dailyChallenges[Math.floor(Math.random() * dailyChallenges.length)]);
        }
    }, []);

    const handleStartChallenge = (challenge: Challenge) => {
        const viewData = challenge.relatedViewId ? Object.values(VIEWS).find(v => v.id === challenge.relatedViewId) : null;
        // If the challenge directs to the dashboard, or has no specific view, navigate to the main challenges page.
        if (viewData?.path && viewData.id !== 'dashboard') {
            navigate(viewData.path);
        } else {
            navigate(VIEWS.CHALLENGES.path);
        }
    };


    // Mock data for stats
    const dailyStreak = 4;
    const xpProgress = 150;


    return (
        <div className="space-y-8">
            <header className="text-center md:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-rose-500">
                    Bridging Worlds, One Chirp at a Time.
                </h1>
                <p className="mt-2 text-lg text-gray-600 max-w-2xl md:max-w-none">From the ancient wisdom of Sanskrit to the global language of business, discover a new way to connect.</p>
            </header>

            {/* Hero section */}
            <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/30">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold font-poppins text-slate-800">Welcome to ChirPolly</h2>
                        <p className="mt-2 text-slate-600">Learn faster with bite-sized lessons, real conversations, and smart guidance powered by AI.</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                            <button
                                onClick={() => navigate(VIEWS.AI_TUTOR_CHAT.path)}
                                className="px-6 py-3 rounded-lg bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg hover:from-rose-600 hover:to-pink-600 shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Chat with Polly 🎤
                            </button>
                            <button
                                onClick={() => {
                                    if (lessons.length > 0) onLessonSelect(lessons[0]); else navigate(VIEWS.LANGUAGES_PAGE.path);
                                }}
                                className="px-4 py-2 rounded-md bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300"
                            >
                                Continue Learning
                            </button>
                        </div>
                    </div>
                    <div className="flex-1 text-center md:text-right">
                        <svg className="inline-block w-48 h-48 animate-bounce" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="pathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="50%" stopColor="#10B981" />
                                    <stop offset="100%" stopColor="#F59E0B" />
                                </linearGradient>
                                <style>{`
                                    @keyframes float {
                                        0%, 100% { transform: translateY(0px); }
                                        50% { transform: translateY(-20px); }
                                    }
                                    @keyframes rotate {
                                        0% { transform: rotate(0deg); }
                                        100% { transform: rotate(360deg); }
                                    }
                                    .float-animation { animation: float 3s ease-in-out infinite; }
                                    .rotate-animation { animation: rotate 20s linear infinite; }
                                `}</style>
                            </defs>

                            {/* Background circle */}
                            <circle cx="100" cy="100" r="95" fill="none" stroke="url(#pathGrad)" strokeWidth="2" opacity="0.3" />

                            {/* Rotating path elements */}
                            <g className="rotate-animation" style={{ transformOrigin: '100px 100px' }}>
                                <circle cx="100" cy="30" r="8" fill="#3B82F6" opacity="0.6" />
                                <circle cx="160" cy="60" r="8" fill="#10B981" opacity="0.6" />
                                <circle cx="170" cy="130" r="8" fill="#F59E0B" opacity="0.6" />
                                <circle cx="130" cy="170" r="8" fill="#E91E63" opacity="0.6" />
                                <circle cx="60" cy="170" r="8" fill="#8B5CF6" opacity="0.6" />
                                <circle cx="30" cy="130" r="8" fill="#14B8A6" opacity="0.6" />
                                <circle cx="40" cy="60" r="8" fill="#EC4899" opacity="0.6" />
                            </g>

                            {/* Center parrot with float animation */}
                            <g className="float-animation">
                                {/* Parrot body */}
                                <ellipse cx="100" cy="105" rx="18" ry="22" fill="#E91E63" />

                                {/* Parrot head */}
                                <circle cx="110" cy="85" r="14" fill="#E91E63" />

                                {/* Parrot crest */}
                                <path d="M 105 72 Q 103 65 108 68 Q 110 62 113 70" fill="#E91E63" />

                                {/* Eye */}
                                <circle cx="115" cy="83" r="5" fill="white" />
                                <circle cx="116" cy="83" r="3" fill="black" />

                                {/* Beak */}
                                <path d="M 120 85 L 132 86 L 120 89 Z" fill="#FFA500" />

                                {/* Wing */}
                                <ellipse cx="100" cy="105" rx="20" ry="16" fill="#22C55E" opacity="0.8" transform="rotate(-25 100 105)" />

                                {/* Tail */}
                                <path d="M 85 120 Q 75 130 70 145 L 75 140 Q 82 128 85 120" fill="#14B8A6" opacity="0.9" />
                            </g>

                            {/* Floating stars around */}
                            <g opacity="0.7">
                                <text x="50" y="40" fontSize="20" fill="#FBBF24">✨</text>
                                <text x="140" y="50" fontSize="18" fill="#EC4899">⭐</text>
                                <text x="160" y="110" fontSize="20" fill="#3B82F6">✨</text>
                                <text x="50" y="160" fontSize="18" fill="#10B981">⭐</text>
                            </g>
                        </svg>
                    </div>
                </div>
            </section>

            {/* AI Chat Card - PRIMARY FEATURE */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="cursor-pointer"
            >
                <div
                    onClick={() => navigate(VIEWS.AI_TUTOR_CHAT.path)}
                    className="bg-gradient-to-r from-teal-400 to-cyan-500 rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300"
                >
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Polly Icon */}
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-5xl md:text-6xl">🦜</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-bold font-poppins text-white mb-2">
                                Chat with Polly AI Tutor
                            </h2>
                            <p className="text-white/90 text-base md:text-lg mb-4">
                                Practice conversation, ask grammar questions, or just chat anytime - powered by AI!
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-2 text-white/80 text-sm">
                                <span>💬</span>
                                <span className="font-semibold">3/3 Free Conversations Today</span>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <div className="flex-shrink-0">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(VIEWS.AI_TUTOR_CHAT.path);
                                }}
                                className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg rounded-xl shadow-lg hover:from-rose-600 hover:to-pink-600 hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            >
                                Start Chatting
                            </button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {lessons.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-slate-700 font-poppins mb-4">Core Lessons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lessons.map(lesson => <ItemCard key={lesson.lesson_id} item={lesson} onSelect={() => onLessonSelect(lesson)} />)}
                    </div>
                </section>
            )}

            <section>
                <h2 className="text-2xl font-bold text-slate-700 font-poppins mb-4">Discover More</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4 opacity-70 cursor-not-allowed">
                        <div className="p-3 bg-indigo-100 rounded-lg text-2xl">📖</div>
                        <div>
                            <h3 className="font-bold text-slate-800">Reading Practice</h3>
                            <p className="text-sm text-slate-600">Interactive stories coming soon!</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-xl shadow-md flex items-center gap-4 opacity-70 cursor-not-allowed">
                        <div className="p-3 bg-rose-100 rounded-lg text-2xl">🎧</div>
                        <div>
                            <h3 className="font-bold text-slate-800">Listening Skills</h3>
                            <p className="text-sm text-slate-600">Podcasts and audio lessons are on the way.</p>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-700 font-poppins mb-4">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Daily Streak"
                        icon={<div className="p-3 bg-yellow-100 rounded-full"><FireIcon className="w-8 h-8 text-yellow-500" /></div>}
                    >
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-bold text-slate-800">{dailyStreak}</p>
                            <ProgressBar progress={dailyStreak / 7 * 100} colorClass="bg-yellow-400" />
                        </div>
                    </StatCard>

                    <StatCard
                        title="XP Progress"
                        icon={<div className="p-3 bg-sky-100 rounded-full"><StarIcon className="w-8 h-8 text-sky-500" /></div>}
                    >
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-bold text-slate-800">{xpProgress}<span className="text-lg text-slate-500">XP</span></p>
                            <ProgressBar progress={xpProgress / 200 * 100} colorClass="bg-sky-400" />
                        </div>
                    </StatCard>

                    {dailyChallenge && (
                        <StatCard
                            title="Challenge"
                            icon={<div className="p-3 bg-purple-100 rounded-full"><StarIcon className="w-8 h-8 text-purple-500" /></div>}
                        >
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-sm text-slate-600">{dailyChallenge.description}</p>
                                <button
                                    onClick={() => dailyChallenge && handleStartChallenge(dailyChallenge)}
                                    className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors flex-shrink-0">
                                    START
                                </button>
                            </div>
                        </StatCard>
                    )}
                </div>
            </section>
        </div>
    );
};