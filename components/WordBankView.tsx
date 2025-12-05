import React, { useState, useRef, useEffect, useMemo } from 'react';
import type { Language, LearningModule, LessonUnit, VocabularyWord, QuizQuestion } from '../types';
import { LEARNING_PATH } from '../i18n/learningPath';
import { SpeakerWaveIcon, LockIcon } from './icons/Icons';
import { generateSpeech, generateQuizForUnit } from '../services/geminiService';
import { Spinner } from './common/Spinner';
import { Button } from './common/Button';
import { initializeSRS } from '../services/srsService';

// --- Audio Decoding Helpers (Required for Text-to-Speech) ---
function decode(base64: string) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
}

async function decodeAudioData(
    data: Uint8Array,
    ctx: AudioContext,
    sampleRate: number,
    numChannels: number,
): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < frameCount; i++) {
            channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
        }
    }
    return buffer;
}


// --- Unit Detail Modal Component ---
const UnitDetailModal: React.FC<{ unit: LessonUnit; onClose: () => void; language: Language; onUnitComplete: (unitId: string) => void; }> = ({ unit, onClose, language, onUnitComplete }) => {
    const [loadingWord, setLoadingWord] = useState<string | null>(null);
    const audioCtxRef = useRef<AudioContext | null>(null);

    // Quiz States
    const [quizState, setQuizState] = useState<'idle' | 'loading' | 'active' | 'finished'>('idle');
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [quizError, setQuizError] = useState('');

    const handlePlayAudio = async (word: string, audioPrompt: string) => {
        if (loadingWord) return;
        setLoadingWord(word);

        try {
            const base64Audio = await generateSpeech(audioPrompt);
            if (!base64Audio) throw new Error("No audio data received.");

            if (!audioCtxRef.current) {
                audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            const audioCtx = audioCtxRef.current;

            const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                audioCtx,
                24000,
                1,
            );

            const source = audioCtx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioCtx.destination);
            source.start();

        } catch (error) {
            console.error("Failed to play audio:", error);
            alert("Sorry, we couldn't play the audio right now.");
        } finally {
            setLoadingWord(null);
        }
    };

    const handleStartQuiz = async () => {
        if (unit.words.length < 4) {
            setQuizError("You need at least 4 words in a unit to generate a quiz.");
            return;
        }
        setQuizError('');
        setQuizState('loading');
        try {
            const questions = await generateQuizForUnit(unit.words, language.name);
            if (questions && questions.length > 0) {
                setQuizQuestions(questions);
                setCurrentQuestionIndex(0);
                setScore(0);
                setSelectedOption(null);
                setShowFeedback(false);
                setQuizState('active');
            } else {
                setQuizError("Sorry, we couldn't create a quiz for this unit right now. Please try again later.");
                setQuizState('idle');
            }
        } catch (error) {
            console.error(error);
            setQuizError("An unexpected error occurred while creating the quiz.");
            setQuizState('idle');
        }
    };

    const currentQuestion = quizQuestions[currentQuestionIndex];

    const handleOptionSelect = (option: string) => {
        if (showFeedback) return;
        setSelectedOption(option);

        if (currentQuestion && option === currentQuestion.answer) {
            setScore(prev => prev + 1);
        }
        setShowFeedback(true);
    };

    const handleNextQuestion = () => {
        setShowFeedback(false);
        setSelectedOption(null);
        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Quiz is finished. Score is already calculated for the last question.
            if (quizQuestions.length > 0 && (score / quizQuestions.length) >= 0.5) {
                onUnitComplete(unit.unitId);
            }
            setQuizState('finished');
        }
    };

    const restartQuiz = () => {
        setCurrentQuestionIndex(0);
        setScore(0);
        setSelectedOption(null);
        setShowFeedback(false);
        setQuizState('active');
    };

    const backToWords = () => {
        setQuizState('idle');
        setQuizQuestions([]);
        setQuizError('');
    };

    const getButtonClass = (option: string) => {
        if (!showFeedback) {
            return selectedOption === option
                ? 'bg-rose-200 border-rose-400'
                : 'bg-white hover:bg-rose-100';
        }
        if (currentQuestion && option === currentQuestion.answer) {
            return 'bg-green-200 border-green-400 text-green-900';
        }
        if (option === selectedOption) {
            return 'bg-red-200 border-red-400 text-red-900';
        }
        return 'bg-slate-100 border-slate-300 text-gray-500';
    };

    const renderContent = () => {
        switch (quizState) {
            case 'loading':
                return (
                    <div className="text-center py-20 flex-grow flex flex-col justify-center items-center">
                        <Spinner />
                        <p className="mt-2 text-gray-600">Generating your quiz...</p>
                    </div>
                );
            case 'active':
                return currentQuestion && (
                    <div className="animate-fade-in flex-grow overflow-y-auto pr-2">
                        <p className="text-lg text-gray-700 mb-1 text-center">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                        <p className="text-xl text-gray-800 mb-4 text-center font-semibold">Which word means "{currentQuestion.question}"?</p>
                        <div className="space-y-3">
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleOptionSelect(option)}
                                    disabled={showFeedback}
                                    className={`w-full text-left p-4 rounded-lg border-2 transition-colors duration-200 text-gray-800 font-medium ${getButtonClass(option)}`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            {showFeedback && (
                                <Button onClick={handleNextQuestion} className="animate-fade-in">
                                    {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                                </Button>
                            )}
                        </div>
                    </div>
                );
            case 'finished':
                const percentage = Math.round((score / quizQuestions.length) * 100);
                return (
                    <div className="text-center py-8 animate-fade-in flex-grow flex flex-col justify-center items-center">
                        <h3 className="text-2xl font-bold text-gray-800">Quiz Complete!</h3>
                        <p className="text-lg text-gray-600 mt-2">Your Score: <span className="font-bold text-teal-600">{score}</span> / {quizQuestions.length} ({percentage}%)</p>
                        {percentage >= 50 && (
                            <p className="mt-2 font-semibold text-green-600">Great job! You've unlocked the next unit.</p>
                        )}
                        <div className="mt-6 flex justify-center gap-x-4">
                            <button onClick={onClose} className="inline-flex items-center justify-center gap-x-2 rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-200 transition-colors">Close</button>
                            <Button onClick={restartQuiz}>
                                Try Again
                            </Button>
                        </div>
                    </div>
                );
            case 'idle':
            default:
                return (
                    <>
                        <div className="overflow-y-auto space-y-3 pr-2 flex-grow">
                            {unit.words.map((item, index) => (
                                <div key={index} className="p-4 bg-sky-50 rounded-lg border border-sky-200/50 flex items-center">
                                    <div className="flex-grow">
                                        <div className="flex items-baseline gap-x-3">
                                            <p className="text-2xl font-bold text-sky-800">{item.word}</p>
                                            <p className="text-lg text-gray-500 font-mono">({item.transliteration})</p>
                                        </div>
                                        <p className="text-gray-700 mt-1 capitalize"><span className="font-semibold">Meaning:</span> {item.meaning}</p>
                                    </div>
                                    <button
                                        title="Play audio"
                                        disabled={!!loadingWord}
                                        onClick={() => handlePlayAudio(item.word, item.audio_prompt)}
                                        className="p-2 rounded-full bg-sky-100 text-sky-700 ml-4 disabled:bg-slate-200 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {loadingWord === item.word ? (
                                            <Spinner size="sm" />
                                        ) : (
                                            <SpeakerWaveIcon className="w-6 h-6" />
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 border-t border-slate-200/80 pt-4">
                            <h3 className="font-semibold text-gray-700 text-center mb-2">Ready to test your knowledge?</h3>
                            {quizError && <p className="text-red-500 text-sm text-center mb-2">{quizError}</p>}
                            <Button onClick={handleStartQuiz} className="w-full">
                                Start Quiz
                            </Button>
                        </div>
                    </>
                );
        }
    };

    return (
        <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-white/30 relative max-h-[90vh] flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800 transition-colors z-10">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="text-center mb-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold font-poppins text-slate-800">{unit.emoji} {unit.title}</h2>
                </div>
                {renderContent()}
            </div>
        </div>
    );
};

// --- Main View Component ---
export const WordBankView: React.FC<{ language: Language }> = ({ language }) => {
    const modules = LEARNING_PATH[language.code] || [];
    const [selectedUnit, setSelectedUnit] = useState<LessonUnit | null>(null);
    const [completedUnits, setCompletedUnits] = useState<Set<string>>(new Set());

    const storageKey = `chirpolly-progress-${language.code}`;

    useEffect(() => {
        try {
            const savedProgress = localStorage.getItem(storageKey);
            if (savedProgress) {
                setCompletedUnits(new Set(JSON.parse(savedProgress)));
            } else {
                setCompletedUnits(new Set()); // Initialize with empty set if no saved progress
            }
        } catch (error) {
            console.error("Failed to load progress from localStorage:", error);
            setCompletedUnits(new Set()); // Fallback to empty set on error
        }
    }, [language.code, storageKey]);

    const handleUnitComplete = (unitId: string) => {
        setCompletedUnits(prev => {
            const newProgress = new Set(prev);
            newProgress.add(unitId);
            try {
                localStorage.setItem(storageKey, JSON.stringify(Array.from(newProgress)));

                // --- SRS Integration ---
                // Find the unit and add its words to the SRS data
                const unit = modules.flatMap(m => m.units).find(u => u.unitId === unitId);
                if (unit) {
                    const srsData = localStorage.getItem('chirpolly-srs-data');
                    let allWords: VocabularyWord[] = srsData ? JSON.parse(srsData) : [];

                    // Add new words if they don't exist
                    unit.words.forEach(word => {
                        if (!allWords.some(w => w.word === word.word)) {
                            allWords.push(initializeSRS(word));
                        }
                    });

                    localStorage.setItem('chirpolly-srs-data', JSON.stringify(allWords));
                }
                // -----------------------

            } catch (error) {
                console.error("Failed to save progress:", error);
            }
            return newProgress;
        });
    };

    const allUnits = useMemo(() => modules.flatMap(module => module.units), [modules]);

    return (
        <div className="max-w-4xl mx-auto animate-fade-in">
            {selectedUnit && <UnitDetailModal unit={selectedUnit} onClose={() => setSelectedUnit(null)} language={language} onUnitComplete={handleUnitComplete} />}

            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-poppins text-gray-800">Learning Path: {language.name}</h1>
                <p className="text-lg text-gray-600 mt-1">Follow your path from beginner to fluency.</p>
            </div>

            {modules.length > 0 ? (
                <div className="space-y-6">
                    {modules.map((module) => (
                        <div key={module.level} className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6 border border-white/30">
                            <div className="border-b border-slate-200/80 pb-3 mb-4">
                                <span className="px-3 py-1 text-sm font-bold text-rose-700 bg-rose-100 rounded-full">{module.level}</span>
                                <h2 className="text-2xl font-bold font-poppins text-gray-800 mt-2">{module.theme}</h2>
                                <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {module.units.map(unit => {
                                    const unitIndex = allUnits.findIndex(u => u.unitId === unit.unitId);
                                    // The first unit is always unlocked. Others are unlocked if the previous one is complete.
                                    const isLocked = unitIndex > 0 && !completedUnits.has(allUnits[unitIndex - 1].unitId);

                                    return (
                                        <button
                                            key={unit.unitId}
                                            onClick={() => setSelectedUnit(unit)}
                                            disabled={isLocked}
                                            className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-left transition-all duration-200 hover:bg-teal-50 hover:border-teal-200 hover:shadow-sm disabled:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <div className="flex items-center gap-x-2">
                                                <span className="text-2xl">{isLocked ? '🔒' : unit.emoji}</span>
                                                <p className="font-semibold text-gray-700">{unit.title}</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-white/50 rounded-lg shadow-md">
                    <p className="text-gray-500">No learning path available for {language.name} yet. Check back soon!</p>
                </div>
            )}
        </div>
    );
};