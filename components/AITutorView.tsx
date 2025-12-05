import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import type { Message, Language } from '../types';
import { AI_TUTOR_PROMPT } from '../constants';
import { MicrophoneIcon, StopCircleIcon } from './icons/Icons';
import { Spinner } from './common/Spinner';
import { POLLY_PERSONA } from '../services/geminiService';

// --- Audio Helper Functions ---
function encode(bytes: Uint8Array) {
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

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

function createBlob(data: Float32Array): Blob {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    return {
        data: encode(new Uint8Array(int16.buffer)),
        mimeType: 'audio/pcm;rate=16000',
    };
}

// Fallback to demo API key if not configured
// check all possible env vars
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || ((import.meta as any).env && ((import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.VITE_API_KEY)) || 'demo-api-key-for-development';

const ai = new GoogleGenAI({ apiKey });

export const AITutorView: React.FC<{ language: Language; }> = ({ language }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [sessionState, setSessionState] = useState<'idle' | 'connecting' | 'active' | 'error'>('idle');
    const [currentInput, setCurrentInput] = useState('');
    const [currentOutput, setCurrentOutput] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const sessionPromiseRef = useRef<Promise<any> | null>(null);
    const inputAudioContextRef = useRef<AudioContext | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
    const nextStartTimeRef = useRef(0);
    const audioSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentInputRef = useRef('');
    const currentOutputRef = useRef('');

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, currentInput, currentOutput]);

    const stopConversation = async () => {
        console.log('Stopping conversation...');
        setSessionState('idle');

        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        if (scriptProcessorRef.current) {
            scriptProcessorRef.current.disconnect();
            scriptProcessorRef.current = null;
        }
        if (inputAudioContextRef.current && inputAudioContextRef.current.state !== 'closed') {
            await inputAudioContextRef.current.close();
            inputAudioContextRef.current = null;
        }
        if (outputAudioContextRef.current && outputAudioContextRef.current.state !== 'closed') {
            await outputAudioContextRef.current.close();
            outputAudioContextRef.current = null;
        }
        if (sessionPromiseRef.current) {
            try {
                const session = await sessionPromiseRef.current;
                session.close();
            } catch (e) {
                console.error("Error closing session:", e);
            }
            sessionPromiseRef.current = null;
        }
    };

    useEffect(() => {
        // Cleanup on component unmount or language change
        return () => {
            stopConversation();
        };
    }, [language]);

    const startConversation = async () => {
        setSessionState('connecting');
        setMessages([]);
        setErrorMessage('');

        try {
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser does not support audio recording.");
            }

            streamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });

            inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
            outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

            const source = inputAudioContextRef.current.createMediaStreamSource(streamRef.current);
            scriptProcessorRef.current = inputAudioContextRef.current.createScriptProcessor(4096, 1, 1);

            scriptProcessorRef.current.onaudioprocess = (audioProcessingEvent) => {
                const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                const pcmBlob = createBlob(inputData);
                sessionPromiseRef.current?.then((session) => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessorRef.current);
            scriptProcessorRef.current.connect(inputAudioContextRef.current.destination);

            const systemPrompt = `${POLLY_PERSONA}\n\nYou are teaching ${language.name}.`;

            sessionPromiseRef.current = ai.live.connect({
                model: 'gemini-2.0-flash-exp',
                callbacks: {
                    onopen: () => {
                        console.log('Live session opened.');
                        setSessionState('active');
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        if (message.serverContent?.outputTranscription) {
                            const text = message.serverContent.outputTranscription.text;
                            currentOutputRef.current += text;
                            setCurrentOutput(currentOutputRef.current);
                        }
                        if (message.serverContent?.inputTranscription) {
                            const text = message.serverContent.inputTranscription.text;
                            currentInputRef.current += text;
                            setCurrentInput(currentInputRef.current);
                        }

                        if (message.serverContent?.turnComplete) {
                            const fullInput = currentInputRef.current;
                            const fullOutput = currentOutputRef.current;

                            setMessages(prev => [
                                ...prev,
                                { role: 'user', text: fullInput },
                                { role: 'model', text: fullOutput }
                            ]);

                            currentInputRef.current = '';
                            currentOutputRef.current = '';
                            setCurrentInput('');
                            setCurrentOutput('');
                        }

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio && outputAudioContextRef.current) {
                            const outputCtx = outputAudioContextRef.current;
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);

                            const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);

                            const sourceNode = outputCtx.createBufferSource();
                            sourceNode.buffer = audioBuffer;
                            sourceNode.connect(outputCtx.destination);

                            sourceNode.addEventListener('ended', () => {
                                audioSourcesRef.current.delete(sourceNode);
                            });

                            sourceNode.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            audioSourcesRef.current.add(sourceNode);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setErrorMessage('An error occurred during the session. Please try again.');
                        stopConversation();
                    },
                    onclose: () => {
                        console.log('Live session closed.');
                        stopConversation();
                    },
                },
                config: {
                    systemInstruction: systemPrompt,
                    responseModalities: [Modality.AUDIO],
                    inputAudioTranscription: {},
                    outputAudioTranscription: {},
                },
            });

        } catch (err) {
            console.error("Error starting conversation:", err);
            setErrorMessage("Could not start conversation. Please ensure microphone permissions are enabled.");
            setSessionState('error');
            stopConversation();
        }
    };

    const handleToggleConversation = () => {
        if (sessionState === 'active' || sessionState === 'connecting') {
            stopConversation();
        } else {
            startConversation();
        }
    };

    const getStatusText = () => {
        if (sessionState === 'error') return errorMessage;
        if (sessionState === 'connecting') return 'Connecting to Polly...';
        if (sessionState === 'active') {
            if (currentOutput) return 'Polly is speaking...';
            return 'Listening...';
        }
        return 'Tap the mic to start talking to Polly!';
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border-t-4 border-teal-400">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold font-poppins text-gray-800">🦜 Talk to Polly!</h2>
                <p className="text-sm text-gray-600">Practice your conversation skills with your AI Tutor.</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <span className="text-2xl">🦜</span>}
                            <div className={`rounded-xl px-4 py-2 max-w-md shadow-sm ${msg.role === 'user' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-gray-800'}`}>
                                <p>{msg.text}</p>
                            </div>
                        </div>
                    ))}
                    {currentInput && (
                        <div className="flex items-end gap-2 justify-end">
                            <div className="rounded-xl px-4 py-2 max-w-md shadow-sm bg-rose-500/80 text-white/90">
                                <p>{currentInput}...</p>
                            </div>
                        </div>
                    )}
                    {currentOutput && (
                        <div className="flex items-end gap-2 justify-start">
                            <span className="text-2xl">🦜</span>
                            <div className="rounded-xl px-4 py-2 max-w-md shadow-sm bg-slate-100/80 text-gray-800/90">
                                <p>{currentOutput}...</p>
                            </div>
                        </div>
                    )}
                    {sessionState === 'connecting' && (
                        <div className="flex items-center justify-center p-8">
                            <Spinner />
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 border-t border-gray-200 text-center space-y-3">
                <p className={`text-sm font-semibold min-h-[20px] ${sessionState === 'error' ? 'text-red-500' : 'text-gray-600'}`}>
                    {getStatusText()}
                </p>
                <button
                    onClick={handleToggleConversation}
                    disabled={sessionState === 'connecting'}
                    className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-lg focus:outline-none focus:ring-4 focus:ring-offset-2
                        ${sessionState === 'active' ? 'bg-rose-500 hover:bg-rose-600 focus:ring-rose-400' : 'bg-teal-500 hover:bg-teal-600 focus:ring-teal-400'}
                        ${sessionState === 'active' ? 'animate-pulse' : ''}
                        disabled:bg-gray-400 disabled:cursor-not-allowed`}
                    title={sessionState === 'active' ? 'Stop Conversation' : 'Start Conversation'}
                >
                    {sessionState === 'active' ? (
                        <StopCircleIcon className="w-10 h-10 text-white" />
                    ) : (
                        <MicrophoneIcon className="w-10 h-10 text-white" />
                    )}
                </button>
            </div>
        </div>
    );
};