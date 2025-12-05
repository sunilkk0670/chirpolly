import React, { useState, useEffect, useRef } from 'react';
import { VocabularyWord } from '../types';
import { calculateNextReview } from '../services/srsService';
import { Button } from './common/Button';
import { SpeakerWaveIcon, XMarkIcon } from './icons/Icons';
import { generateSpeech } from '../services/geminiService';
import { Spinner } from './common/Spinner';

// --- Audio Decoding Helpers (Reused) ---
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

interface ReviewSessionProps {
    dueWords: VocabularyWord[];
    onComplete: (updatedWords: VocabularyWord[]) => void;
    onClose: () => void;
}

export const ReviewSession: React.FC<ReviewSessionProps> = ({ dueWords, onComplete, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [sessionWords, setSessionWords] = useState<VocabularyWord[]>([...dueWords]);
    const [completedWords, setCompletedWords] = useState<VocabularyWord[]>([]);
    const [loadingAudio, setLoadingAudio] = useState(false);
    const audioCtxRef = useRef<AudioContext | null>(null);

    const currentWord = sessionWords[currentIndex];

    const handlePlayAudio = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loadingAudio || !currentWord) return;
        setLoadingAudio(true);

        try {
            const base64Audio = await generateSpeech(currentWord.audio_prompt);
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
        } finally {
            setLoadingAudio(false);
        }
    };

    const handleRate = (quality: number) => {
        if (!currentWord) return;

        const updatedWord = calculateNextReview(currentWord, quality);

        // If rated "Again" (0), keep it in the session to review again at the end
        if (quality === 0) {
            setSessionWords(prev => [...prev, currentWord]);
            setIsFlipped(false);
            setCurrentIndex(prev => prev + 1);
        } else {
            const newCompletedWords = [...completedWords, updatedWord];
            setCompletedWords(newCompletedWords);

            setIsFlipped(false);
            if (currentIndex < sessionWords.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                onComplete(newCompletedWords);
            }
        }
    };

    if (!currentWord) {
        return (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
                    <h2 className="text-2xl font-bold text-slate-800 mb-4">Session Complete! 🎉</h2>
                    <p className="text-slate-600 mb-6">You've reviewed all your due words for now.</p>
                    <Button onClick={() => onComplete(completedWords)}>Finish</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
                <XMarkIcon className="w-8 h-8" />
            </button>

            <div className="w-full max-w-2xl mb-6 flex justify-between items-center text-white/80">
                <span>Reviewing {currentIndex + 1} / {sessionWords.length}</span>
                <span>{sessionWords.length - currentIndex} remaining</span>
            </div>

            {/* Flashcard */}
            <div
                className="w-full max-w-2xl aspect-[4/3] md:aspect-[16/9] perspective-1000 cursor-pointer group"
                onClick={() => !isFlipped && setIsFlipped(true)}
            >
                <div className={`relative w-full h-full transition-all duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>

                    {/* Front */}
                    <div className="absolute inset-0 backface-hidden bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-b-8 border-slate-200">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Translate this</span>
                        <h2 className="text-4xl md:text-6xl font-bold text-slate-800 text-center mb-6">{currentWord.word}</h2>
                        <button
                            onClick={handlePlayAudio}
                            className="p-4 rounded-full bg-sky-100 text-sky-600 hover:bg-sky-200 transition-colors"
                        >
                            {loadingAudio ? <Spinner size="sm" /> : <SpeakerWaveIcon className="w-8 h-8" />}
                        </button>
                        <p className="mt-8 text-slate-400 text-sm font-medium animate-pulse">Tap to flip</p>
                    </div>

                    {/* Back */}
                    <div className="absolute inset-0 backface-hidden rotate-y-180 bg-slate-800 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border-b-8 border-slate-900">
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">{currentWord.meaning}</h2>
                        <p className="text-xl text-slate-400 font-mono mb-8">{currentWord.transliteration}</p>

                        <div className="grid grid-cols-4 gap-3 w-full max-w-lg mt-auto" onClick={e => e.stopPropagation()}>
                            <button
                                onClick={() => handleRate(0)}
                                className="flex flex-col items-center p-3 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/50 transition-colors"
                            >
                                <span className="font-bold mb-1">Again</span>
                                <span className="text-xs opacity-70">1m</span>
                            </button>
                            <button
                                onClick={() => handleRate(3)}
                                className="flex flex-col items-center p-3 rounded-xl bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 transition-colors"
                            >
                                <span className="font-bold mb-1">Hard</span>
                                <span className="text-xs opacity-70">2d</span>
                            </button>
                            <button
                                onClick={() => handleRate(4)}
                                className="flex flex-col items-center p-3 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 transition-colors"
                            >
                                <span className="font-bold mb-1">Good</span>
                                <span className="text-xs opacity-70">4d</span>
                            </button>
                            <button
                                onClick={() => handleRate(5)}
                                className="flex flex-col items-center p-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-green-400 border border-green-500/50 transition-colors"
                            >
                                <span className="font-bold mb-1">Easy</span>
                                <span className="text-xs opacity-70">7d</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
