

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { COMMUNITY_USERS, LANGUAGES, LEADERBOARD_DATA, VIEWS } from '../constants';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { generateImage } from '../services/geminiService';
import { TrophyIcon, MicrophoneIcon } from './icons/Icons';
import type { CommunityUser, LeaderboardUser } from '../types';
import SocialFeed from './SocialFeed';

const getLanguageName = (code: string): string => {
    return LANGUAGES.find(lang => lang.code === code)?.name || code;
};

// --- Sub-Components for Community View ---

const UserCard: React.FC<{ user: CommunityUser }> = ({ user }) => {
    const Avatar: React.FC<{ name: string }> = ({ name }) => {
        const initial = name ? name.charAt(0).toUpperCase() : '?';
        const colors = ['bg-sky-500', 'bg-green-500', 'bg-yellow-500', 'bg-rose-500', 'bg-indigo-500', 'bg-pink-500'];
        const color = colors[name.charCodeAt(0) % colors.length];

        return (
            <div className={`w-16 h-16 rounded-full ${color} flex-shrink-0 flex items-center justify-center`}>
                <span className="text-3xl font-bold text-white">{initial}</span>
            </div>
        );
    };

    return (
        <div className="bg-white border p-5 rounded-xl shadow-lg flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
            <div className="flex items-center gap-x-4 mb-4">
                <Avatar name={user.name} />
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{user.name}</h3>
                     <div className={`flex items-center gap-1.5 text-xs font-semibold ${user.isOnline ? 'text-green-600' : 'text-gray-500'}`}>
                        <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        {user.isOnline ? 'Online' : 'Offline'}
                    </div>
                </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-semibold text-gray-700">Speaks:</span> {getLanguageName(user.nativeLanguage)}</p>
                <p><span className="font-semibold text-gray-700">Learning:</span> {getLanguageName(user.learningLanguage)}</p>
            </div>
            <p className="text-gray-500 text-sm flex-grow mb-4">"{user.bio}"</p>
            <div className="mt-auto">
                <Button onClick={() => alert('Real-time chat is coming soon!')} className="w-full" disabled={!user.isOnline}>
                    {user.isOnline ? 'Start a Chat' : 'Offline'}
                </Button>
            </div>
        </div>
    );
};

const Leaderboard: React.FC<{ title: string; users: LeaderboardUser[]; unit: string }> = ({ title, users, unit }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col">
        <h3 className="text-lg font-bold text-gray-800 font-poppins mb-3">{title}</h3>
        <ul className="space-y-3">
            {users.map((user, index) => (
                <li key={user.id} className="flex items-center gap-x-3">
                    <span className="font-bold text-gray-500 w-6 text-center">{index + 1}</span>
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full" />
                    <span className="font-semibold text-gray-700 flex-grow">{user.name}</span>
                    <span className="font-bold text-teal-600">{user.score} {unit}</span>
                </li>
            ))}
        </ul>
    </div>
);

const ChallengeCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    buttonText: string;
    onClick: () => void;
    children?: React.ReactNode;
}> = ({ title, description, icon, buttonText, onClick, children }) => (
    <div className="bg-white p-5 rounded-xl shadow-lg flex flex-col h-full border-t-4 border-rose-400">
        <div className="flex items-start gap-x-4 mb-3">
            <div className="text-4xl">{icon}</div>
            <div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
        </div>
        <p className="text-gray-600 text-sm flex-grow mb-4">{description}</p>
        {children}
        <div className="mt-auto pt-4">
            <Button onClick={onClick} className="w-full">
                {buttonText}
            </Button>
        </div>
    </div>
);


// --- Main Community View ---
export const CommunityView: React.FC = () => {
    const [speaksFilter, setSpeaksFilter] = useState('all');
    const [learningFilter, setLearningFilter] = useState('all');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const navigate = useNavigate();
    
    // State for the AI-powered challenge
    const [memeImageUrl, setMemeImageUrl] = useState<string | null>(null);
    const [isMemeLoading, setIsMemeLoading] = useState(true);

    useEffect(() => {
        const fetchMemeImage = async () => {
            setIsMemeLoading(true);
            try {
                const prompt = "A photo of a capybara wearing a tiny top hat looking very serious at a business meeting.";
                const result = await generateImage(prompt);
                if (result) {
                    setMemeImageUrl(`data:image/jpeg;base64,${result}`);
                }
            } catch (error) {
                console.error("Failed to generate meme image:", error);
            } finally {
                setIsMemeLoading(false);
            }
        };
        fetchMemeImage();
    }, []);

    const filteredUsers = useMemo(() => {
        return COMMUNITY_USERS.filter(user => {
            const speaksMatch = speaksFilter === 'all' || user.nativeLanguage === speaksFilter;
            const learningMatch = learningFilter === 'all' || user.learningLanguage === learningFilter;
            const onlineMatch = !showOnlineOnly || user.isOnline;
            return speaksMatch && learningMatch && onlineMatch;
        });
    }, [speaksFilter, learningFilter, showOnlineOnly]);
    
    const handleTakeChallenge = (viewPath: string) => {
        navigate(viewPath);
    };

    return (
        <div className="animate-fade-in space-y-10">
            <div>
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl font-poppins">
                    ChirpCircle Community
                </h1>
                <p className="mt-2 text-lg text-gray-600">Learn, chat, and grow together with challenges, leaderboards, and language partners.</p>
            </div>
            
            {/* Social Feed */}
            <section>
                <h2 className="text-2xl font-bold text-gray-700 font-poppins mb-4">Social Feed</h2>
                <SocialFeed />
            </section>
            
            {/* Peer Challenges */}
            <section>
                <h2 className="text-2xl font-bold text-gray-700 font-poppins mb-4">Peer Challenges</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChallengeCard
                        title="Caption This!"
                        description="We have created this unique image. Write the funniest, most creative caption in your target language!"
                        icon="🖼️"
                        buttonText="Take Challenge"
                        onClick={() => handleTakeChallenge(VIEWS.AI_TUTOR_CHAT.path)}
                    >
                        <div className="w-full h-48 bg-slate-100 rounded-lg flex items-center justify-center my-4">
                            {isMemeLoading ? <Spinner /> : <img src={memeImageUrl || ''} alt="AI generated" className="w-full h-full object-cover rounded-lg"/>}
                        </div>
                    </ChallengeCard>
                    <ChallengeCard
                        title="Voice Match"
                        description="Listen to a native speaker's phrase, then record yourself saying it. How close can you get?"
                        icon={<MicrophoneIcon className="w-10 h-10 text-sky-500"/>}
                        buttonText="Try It Now"
                        onClick={() => handleTakeChallenge(VIEWS.ACCENT_TRAINING.path)}
                    />
                </div>
            </section>
            
            {/* Leaderboards */}
            <section>
                <h2 className="text-2xl font-bold text-gray-700 font-poppins mb-4">Leaderboards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Leaderboard title={LEADERBOARD_DATA.conversation.title} users={LEADERBOARD_DATA.conversation.users} unit="XP" />
                    <Leaderboard title={LEADERBOARD_DATA.vocabulary.title} users={LEADERBOARD_DATA.vocabulary.users} unit="Words" />
                    <Leaderboard title={LEADERBOARD_DATA.grammar.title} users={LEADERBOARD_DATA.grammar.users} unit="%" />
                </div>
            </section>
            
            {/* Find a Language Partner */}
            <section>
                 <h2 className="text-2xl font-bold text-gray-700 font-poppins mb-4">Find Language Partners</h2>
                <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1">
                        <label htmlFor="speaks-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Speaks
                        </label>
                        <select
                            id="speaks-filter"
                            value={speaksFilter}
                            onChange={(e) => setSpeaksFilter(e.target.value)}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        >
                            <option value="all">Any Language</option>
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-1">
                        <label htmlFor="learning-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Learning
                        </label>
                        <select
                            id="learning-filter"
                            value={learningFilter}
                            onChange={(e) => setLearningFilter(e.target.value)}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        >
                            <option value="all">Any Language</option>
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                    </div>
                    <div className="flex-shrink-0 pt-6">
                        <div className="flex items-center">
                            <label htmlFor="online-filter" className="block text-sm font-medium text-gray-700 mr-2">
                                Online only
                            </label>
                            <button
                                type="button"
                                className={`${showOnlineOnly ? 'bg-teal-500' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`}
                                role="switch"
                                aria-checked={showOnlineOnly}
                                onClick={() => setShowOnlineOnly(!showOnlineOnly)}
                            >
                                <span
                                    aria-hidden="true"
                                    className={`${showOnlineOnly ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.length > 0 ? (
                        filteredUsers.map(user => <UserCard key={user.id} user={user} />)
                    ) : (
                        <div className="col-span-full text-center py-12 bg-white/50 rounded-lg">
                            <p className="text-gray-500">No users match your criteria. Try different filters!</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};