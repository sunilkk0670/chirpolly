

import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isDemoModeEnabled } from '../services/firebase';
import { LANGUAGES, VIEWS } from '../constants';
import type { TutorProfile, TutorApplication } from '../types';
import { Button } from './common/Button';
import { StarIcon, ChatBubbleIcon } from './icons/Icons';
import { fetchTutors, checkExistingApplication, checkIfUserIsTutor } from '../services/tutorService';
import { TutorApplicationForm } from './TutorApplicationForm';
import { BookingModal } from './BookingModal';

const getLanguageName = (code: string): string => {
    return LANGUAGES.find(lang => lang.code === code)?.name || code;
};

const TutorCard: React.FC<{ tutor: TutorProfile; onBookClick: (tutor: TutorProfile) => void }> = ({ tutor, onBookClick }) => {
    const nativeLanguages = tutor.nativeLanguages.map(code => getLanguageName(code)).join(', ');
    
    return (
        <div className="bg-white border-t-4 border-rose-400 p-5 rounded-xl shadow-lg flex flex-col h-full transform hover:-translate-y-1 transition-transform duration-300">
            <div className="relative flex items-center gap-x-4 mb-4">
                <img 
                    src={tutor.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(tutor.name)}&background=random`} 
                    alt={tutor.name} 
                    className="w-20 h-20 rounded-full object-cover" 
                />
                {tutor.isOnline && (
                    <div className="absolute bottom-1 left-14 w-5 h-5 bg-green-500 rounded-full border-2 border-white" title="Online"></div>
                )}
                <div>
                    <h3 className="text-lg font-bold text-gray-800">{tutor.name}</h3>
                    <p className="text-sm font-semibold text-teal-700">{nativeLanguages}</p>
                    <div className="flex items-center gap-1 mt-1">
                        <StarIcon className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm font-semibold text-gray-700">{tutor.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({tutor.totalReviews} reviews)</span>
                    </div>
                </div>
            </div>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p><span className="font-semibold text-gray-700">Specialty:</span> {tutor.specialty}</p>
                <p><span className="font-semibold text-gray-700">Sessions:</span> {tutor.totalSessions}</p>
            </div>
            <p className="text-gray-500 text-sm flex-grow mb-4">"{tutor.bio}"</p>
            <div className="mt-auto space-y-3">
                <div className="flex items-center justify-center gap-x-2 p-2 rounded-lg bg-sky-100/60 border border-sky-200/80">
                    <p className="font-bold text-sky-800">${tutor.hourlyRate}/hr</p>
                </div>
                <Button 
                    onClick={() => onBookClick(tutor)} 
                    className="w-full"
                    disabled={!tutor.isOnline}
                >
                    {tutor.isOnline ? 'Book Session' : 'Currently Offline'}
                </Button>
            </div>
        </div>
    );
};

const AITutorCard: React.FC = () => (
    <div className="mb-8 bg-gradient-to-r from-teal-400 to-sky-500 p-6 rounded-xl shadow-lg text-white transform hover:-translate-y-1 transition-transform duration-300">
        <div className="flex flex-col sm:flex-row items-center gap-x-6">
            <div className="bg-white/30 p-4 rounded-full text-5xl mb-4 sm:mb-0">
                🦜
            </div>
            <div className="flex-grow text-center sm:text-left">
                <h3 className="font-bold font-poppins text-xl">Chat with Polly AI Tutor</h3>
                <p className="text-sm mt-1">Practice conversation, ask grammar questions, or just chat anytime for free!</p>
            </div>
            <Link to={VIEWS.AI_TUTOR_CHAT.path} className="mt-4 sm:mt-0 w-full sm:w-auto">
                <Button className="bg-white text-teal-700 hover:bg-slate-100 w-full">
                    <ChatBubbleIcon className="w-5 h-5 mr-2" /> Start Chatting
                </Button>
            </Link>
        </div>
    </div>
);


export const TutorView: React.FC = () => {
    const [firebaseUser] = useAuthState(auth);
    const user = isDemoModeEnabled ? {
        uid: 'demo-user-123',
        email: 'demo@chirpolly.app',
        displayName: 'Demo User',
    } : firebaseUser;

    const [languageFilter, setLanguageFilter] = useState('all');
    const [showOnlineOnly, setShowOnlineOnly] = useState(false);
    const [tutors, setTutors] = useState<TutorProfile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [selectedTutor, setSelectedTutor] = useState<TutorProfile | null>(null);
    const [existingApplication, setExistingApplication] = useState<TutorApplication | null>(null);
    const [isTutor, setIsTutor] = useState<TutorProfile | null>(null);

    useEffect(() => {
        const loadTutors = async () => {
            setIsLoading(true);
            const fetchedTutors = await fetchTutors({
                language: languageFilter !== 'all' ? languageFilter : undefined,
                onlineOnly: showOnlineOnly,
            });
            setTutors(fetchedTutors);
            setIsLoading(false);
        };
        loadTutors();
    }, [languageFilter, showOnlineOnly]);

    useEffect(() => {
        const checkUserStatus = async () => {
            if (user) {
                const application = await checkExistingApplication(user.uid);
                setExistingApplication(application);
                
                const tutorProfile = await checkIfUserIsTutor(user.uid);
                setIsTutor(tutorProfile);
            }
        };
        checkUserStatus();
    }, [user]);

    const filteredTutors = useMemo(() => {
        return tutors;
    }, [tutors]);

    return (
        <div className="animate-fade-in">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-800 sm:text-4xl font-poppins">
                    Live Native Chats & Micro-Tutoring
                </h1>
                <p className="mt-2 text-lg text-gray-600">Connect with native speakers for on-demand conversation practice and feedback.</p>
            </div>
            
            <div className="bg-gradient-to-r from-sky-400 to-teal-400 p-6 rounded-xl shadow-lg text-white mb-8">
                <div className="flex items-center gap-x-4">
                    <div className="bg-white/30 p-3 rounded-full">
                        <StarIcon className="w-8 h-8"/>
                    </div>
                    <div>
                        <h3 className="font-bold font-poppins text-lg">Unlock Premium Tutoring</h3>
                        <p className="text-sm mt-1">Upgrade to ChirPolly Pro to unlock secure payments and book unlimited sessions with our top-rated tutors!</p>
                        <button className="mt-3 inline-flex items-center justify-center gap-x-2 rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-teal-700 shadow-sm hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white transition-colors">
                            Upgrade Now
                        </button>
                    </div>
                </div>
            </div>

            <AITutorCard />

            {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-md mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-700 font-poppins">Live Native Tutors</h2>
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex items-center">
                        <label htmlFor="online-filter" className="block text-sm font-medium text-gray-700 mr-2 whitespace-nowrap">
                            Available now
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
                    <div className="w-full sm:w-56">
                        <select
                            id="language-filter"
                            value={languageFilter}
                            onChange={(e) => setLanguageFilter(e.target.value)}
                            className="block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-sm"
                        >
                            <option value="all">Any Language</option>
                            {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            {/* Tutor Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
                        <p className="text-gray-500 mt-2">Loading tutors...</p>
                    </div>
                ) : filteredTutors.length > 0 ? (
                    filteredTutors.map(tutor => (
                        <TutorCard 
                            key={tutor.id} 
                            tutor={tutor} 
                            onBookClick={(t) => {
                                setSelectedTutor(t);
                                setShowBookingModal(true);
                            }}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 bg-white/50 rounded-lg">
                        <p className="text-gray-500">No tutors match your criteria. Try different filters!</p>
                    </div>
                )}
            </div>

            {/* Become a Tutor CTA */}
            {!isTutor && (
                <div className="mt-12">
                    <div className="bg-white p-8 rounded-lg shadow-lg border-t-4 border-green-400 text-center">
                        <h2 className="text-2xl font-bold font-poppins text-gray-800">Want to become a tutor?</h2>
                        <p className="mt-2 text-gray-600 max-w-xl mx-auto">Share your language skills with a global community of learners, set your own schedule, and earn money on your terms.</p>
                        
                        {existingApplication ? (
                            <div className="mt-6">
                                <div className="inline-flex items-center px-4 py-2 rounded-lg bg-yellow-100 text-yellow-800">
                                    <span className="font-semibold">Application Status: </span>
                                    <span className="ml-2 capitalize">{existingApplication.status}</span>
                                </div>
                                {existingApplication.status === 'pending' && (
                                    <p className="text-sm text-gray-600 mt-2">We'll review your application and get back to you soon!</p>
                                )}
                            </div>
                        ) : (
                            <div className="mt-6">
                                <Button 
                                    onClick={() => setShowApplicationForm(true)} 
                                    className="bg-green-500 hover:bg-green-600"
                                    disabled={!user}
                                >
                                    Apply Now
                                </Button>
                                {!user && (
                                    <p className="text-sm text-gray-500 mt-2">Sign in to apply</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Modals */}
            {showApplicationForm && (
                <TutorApplicationForm
                    onSuccess={() => {
                        setShowApplicationForm(false);
                        alert('Application submitted successfully! We\'ll review it and get back to you soon.');
                        // Reload application status
                        if (user) {
                            checkExistingApplication(user.uid).then(setExistingApplication);
                        }
                    }}
                    onCancel={() => setShowApplicationForm(false)}
                />
            )}

            {showBookingModal && selectedTutor && (
                <BookingModal
                    tutor={selectedTutor}
                    onSuccess={() => {
                        setShowBookingModal(false);
                        setSelectedTutor(null);
                        alert('Booking successful! You\'ll receive a confirmation email soon.');
                    }}
                    onCancel={() => {
                        setShowBookingModal(false);
                        setSelectedTutor(null);
                    }}
                />
            )}
        </div>
    );
};
