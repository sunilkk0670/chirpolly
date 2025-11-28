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
        <div className="space-y-8 p-4 max-w-7xl mx-auto">
            {/* Header Section */}
            <header className="text-center md:text-left">
                <h1 className="text-4xl lg:text-5xl font-bold font-poppins text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-rose-500">
                    Bridging Worlds, One Chirp at a Time.
                </h1>
                <p className="mt-2 text-lg text-gray-600 max-w-2xl md:max-w-none">
                    From the ancient wisdom of Sanskrit to the global language of business, discover a new way to connect.
                </p>
            </header>

            {/* AI Chat Card */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg"
            >
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex-1">
                        <h2 className="text-2xl md:text-3xl font-bold mb-2">Welcome to ChirPolly</h2>
                        <p className="text-white/90 text-base md:text-lg mb-4">
                            Practice conversation, ask grammar questions, or just chat anytime - powered by AI!
                        </p>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                            <span>💬</span>
                            <span className="font-semibold">3/3 Free Conversations Today</span>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate(VIEWS.AI_TUTOR_CHAT.path)}
                        className="px-6 py-3 bg-white text-indigo-700 font-bold rounded-lg hover:bg-indigo-50 transition-colors flex items-center gap-2"
                    >
                        Chat with Polly 🎤
                    </button>
                </div>
            </motion.section>

            {/* Hero Section */}
            <section className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/30">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <h2 className="text-2xl md:text-3xl font-bold font-sans text-transparent bg-clip-text bg-gradient-to-r from-teal-500 via-blue-500 to-rose-500">Learn faster with bite-sized lessons, real conversations, and smart guidance powered by AI.</h2>
                    <button
                        onClick={() => {
                            if (lessons.length > 0) onLessonSelect(lessons[0]); 
                            else navigate(VIEWS.LANGUAGES_PAGE.path);
                        }}
                        className="px-6 py-3 rounded-lg bg-slate-200 text-slate-800 font-semibold hover:bg-slate-300 whitespace-nowrap"
                    >
                        Continue Learning
                    </button>
                </div>
            </section>

            {/* Core Lessons Section */}
            {lessons.length > 0 && (
                <section>
                    <h2 className="text-2xl font-bold text-slate-800 font-poppins mb-4">Core Lessons</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {lessons.map(lesson => (
                            <ItemCard 
                                key={lesson.lesson_id} 
                                item={lesson} 
                                onSelect={() => onLessonSelect(lesson)} 
                            />
                        ))}
                    </div>
                </section>
            )}

            {/* Discover More Section */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 font-poppins mb-4">Discover More</h2>
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

            {/* Progress Section */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 font-poppins mb-4">Your Progress</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard
                        title="Daily Streak"
                        icon={
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <FireIcon className="w-8 h-8 text-yellow-500" />
                            </div>
                        }
                    >
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-bold text-slate-800">{dailyStreak}</p>
                            <ProgressBar 
                                progress={Math.min((dailyStreak / 7) * 100, 100)} 
                                colorClass="bg-yellow-400" 
                            />
                        </div>
                    </StatCard>

                    <StatCard
                        title="XP Progress"
                        icon={
                            <div className="p-3 bg-sky-100 rounded-full">
                                <StarIcon className="w-8 h-8 text-sky-500" />
                            </div>
                        }
                    >
                        <div className="flex items-center gap-4">
                            <p className="text-3xl font-bold text-slate-800">
                                {xpProgress}<span className="text-lg text-slate-500">XP</span>
                            </p>
                            <ProgressBar 
                                progress={(xpProgress / 200) * 100} 
                                colorClass="bg-sky-400" 
                            />
                        </div>
                    </StatCard>

                    {dailyChallenge && (
                        <StatCard
                            title="Daily Challenge"
                            icon={
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <StarIcon className="w-8 h-8 text-purple-500" />
                                </div>
                            }
                        >
                            <div className="flex flex-col gap-3">
                                <p className="text-sm text-slate-600">{dailyChallenge.description}</p>
                                <button
                                    onClick={() => handleStartChallenge(dailyChallenge)}
                                    className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                                >
                                    Start Challenge
                                </button>
                            </div>
                        </StatCard>
                    )}
                </div>
            </section>
        </div>
    );
};