import React, { useState, useRef, useEffect } from 'react';
import { startRecording, voiceChatFlow, ChatMessage } from '../services/aiChatService';

export const AIChatCard: React.FC = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [enableVoice, setEnableVoice] = useState(true);
    const [recordingTime, setRecordingTime] = useState(0);

    const recorderRef = useRef<{ stop: () => Promise<Blob>; stream: MediaStream } | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (recorderRef.current) {
                recorderRef.current.stream.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    const handleStartRecording = async () => {
        try {
            setError(null);
            setRecordingTime(0);

            const recorder = await startRecording();
            recorderRef.current = recorder;
            setIsRecording(true);

            // Start timer
            timerRef.current = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);

        } catch (err) {
            console.error('Recording error:', err);
            setError('Microphone access denied. Please allow microphone access to use voice chat.');
        }
    };

    const handleStopRecording = async () => {
        if (!recorderRef.current) return;

        try {
            setIsRecording(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }

            setIsProcessing(true);
            const audioBlob = await recorderRef.current.stop();
            recorderRef.current = null;

            console.log('🎤 Audio blob received:', {
                size: audioBlob.size,
                type: audioBlob.type,
            });

            if (audioBlob.size === 0) {
                throw new Error('Audio blob is empty - no audio was recorded');
            }

            // Process the audio
            console.log('📤 Sending to voiceChatFlow...');
            const result = await voiceChatFlow(audioBlob, 'en-US', enableVoice);

            console.log('✅ Voice chat flow completed:', {
                userText: result.userText,
                aiTextLength: result.aiText?.length || 0,
            });

            // Add user message
            const userMessage: ChatMessage = {
                role: 'user',
                text: result.userText,
                timestamp: Date.now(),
            };

            // Add AI message
            const aiMessage: ChatMessage = {
                role: 'ai',
                text: result.aiText,
                timestamp: Date.now() + 1,
                audioUrl: result.aiAudioUrl,
            };

            setMessages(prev => [...prev, userMessage, aiMessage]);

            // Auto-play AI response if voice is enabled
            if (result.aiAudioUrl && enableVoice) {
                if (audioRef.current) {
                    audioRef.current.src = result.aiAudioUrl;
                    audioRef.current.play().catch(err => {
                        console.error('Audio playback error:', err);
                    });
                }
            }

            setIsProcessing(false);
            setRecordingTime(0);

        } catch (err: any) {
            console.error('❌ Processing error:', err);
            console.error('Error details:', {
                message: err.message,
                stack: err.stack,
            });
            setError(`Failed to process your message: ${err.message || 'Unknown error'}`);
            setIsProcessing(false);
            setRecordingTime(0);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 p-8 rounded-2xl shadow-2xl text-white mb-8 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-3xl font-bold font-poppins flex items-center gap-3">
                            <span className="text-4xl">🤖</span>
                            Chat with Polly AI
                        </h2>
                        <p className="text-white/90 mt-1">Your AI language tutor powered by Vertex AI</p>
                    </div>

                    {/* Voice toggle */}
                    <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
                        <span className="text-sm font-medium">Voice Response</span>
                        <button
                            type="button"
                            className={`${enableVoice ? 'bg-green-400' : 'bg-gray-300'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out`}
                            role="switch"
                            aria-checked={enableVoice}
                            onClick={() => setEnableVoice(!enableVoice)}
                        >
                            <span
                                aria-hidden="true"
                                className={`${enableVoice ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                            />
                        </button>
                    </div>
                </div>

                {/* Chat messages */}
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 mb-6 min-h-[200px] max-h-[400px] overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="text-center py-12 text-white/70">
                            <p className="text-lg">👋 Press the microphone to start chatting!</p>
                            <p className="text-sm mt-2">Ask me anything about language learning</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                            ? 'bg-white text-gray-800'
                                            : 'bg-purple-900/50 text-white border border-white/20'
                                            }`}
                                    >
                                        <p className="text-sm font-medium mb-1">
                                            {msg.role === 'user' ? 'You' : 'Polly AI'}
                                        </p>
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                        {msg.audioUrl && (
                                            <button
                                                onClick={() => {
                                                    if (audioRef.current) {
                                                        audioRef.current.src = msg.audioUrl!;
                                                        audioRef.current.play();
                                                    }
                                                }}
                                                className="mt-2 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors"
                                            >
                                                🔊 Play Audio
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <div className="bg-red-500/20 border border-red-300 rounded-lg p-3 mb-4 text-sm">
                        ⚠️ {error}
                    </div>
                )}

                {/* Recording controls */}
                <div className="flex flex-col items-center gap-4">
                    {/* Recording indicator */}
                    {(isRecording || isProcessing) && (
                        <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-3">
                            {isRecording && (
                                <>
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="font-mono font-bold">{formatTime(recordingTime)}</span>
                                    <span>Recording...</span>
                                </>
                            )}
                            {isProcessing && (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Processing your message...</span>
                                </>
                            )}
                        </div>
                    )}

                    {/* Microphone button */}
                    <button
                        onClick={isRecording ? handleStopRecording : handleStartRecording}
                        disabled={isProcessing}
                        className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl ${isRecording
                            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                            : isProcessing
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-white hover:bg-gray-100'
                            }`}
                    >
                        {isProcessing ? '⏳' : isRecording ? '⏹️' : '🎤'}
                    </button>

                    <p className="text-sm text-white/80">
                        {isRecording
                            ? 'Click to stop recording'
                            : isProcessing
                                ? 'Please wait...'
                                : 'Click to start recording'}
                    </p>
                </div>

                {/* Hidden audio element for playback */}
                <audio ref={audioRef} className="hidden" />
            </div>
        </div>
    );
};
