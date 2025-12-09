import React, { useState, useEffect, useRef } from 'react';
import type { Scenario, Message, Language, GrammarFeedback } from '../types';
import { SendIcon, SparklesIcon } from './icons/Icons';
import { Spinner } from './common/Spinner';
import { startChat, sendMessage } from '../services/geminiService';

const parseResponse = (responseText: string): { text: string, feedback: GrammarFeedback | undefined } => {
    const feedbackMarker = '---GRAMMAR CHECK---';
    const endMarker = '---END GRAMMAR CHECK---';

    const feedbackIndex = responseText.indexOf(feedbackMarker);

    if (feedbackIndex === -1) {
        return { text: responseText, feedback: undefined };
    }

    const text = responseText.substring(0, feedbackIndex).trim();
    const feedbackBlock = responseText.substring(feedbackIndex + feedbackMarker.length, responseText.indexOf(endMarker));

    const correctionMatch = feedbackBlock.match(/Correction: (.*)/);
    const explanationMatch = feedbackBlock.match(/Explanation: (.*)/);

    const correction = correctionMatch ? correctionMatch[1].trim() : 'N/A';
    const explanation = explanationMatch ? explanationMatch[1].trim() : 'N/A';

    return {
        text,
        feedback: { correction, explanation }
    };
};

export const ScenarioView: React.FC<{ scenario: Scenario; language: Language; }> = ({ scenario, language }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showGrammarCheck, setShowGrammarCheck] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        startChat(scenario.systemPrompt);
        setMessages([]);

        const fetchInitialMessage = async () => {
            setIsLoading(true);
            try {
                // Send an empty message to trigger the initial scripted response from the model
                const response = await sendMessage('', false);
                const { text } = parseResponse(response.text);
                const initialModelMessage: Message = { role: 'model', text };
                setMessages([initialModelMessage]);
            } catch (error) {
                console.error('Error fetching initial message:', error);
                const errorMessage: Message = { role: 'model', text: 'Oops! Something went wrong. Please try again.' };
                setMessages([errorMessage]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInitialMessage();
    }, [scenario]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Fix: Refactored state updates to be immutable and atomic.
    // This prevents race conditions and ensures feedback is correctly applied
    // to the user's message before the model's response is added.
    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMessage(userMessage.text, showGrammarCheck);
            const { text, feedback } = parseResponse(response.text);
            const modelMessage: Message = { role: 'model', text };

            setMessages(prev => {
                const messagesWithFeedback = [...prev];
                if (feedback) {
                    const lastMessageIndex = messagesWithFeedback.length - 1;
                    const lastMessage = messagesWithFeedback[lastMessageIndex];
                    if (lastMessage?.role === 'user') {
                        messagesWithFeedback[lastMessageIndex] = {
                            ...lastMessage,
                            grammarFeedback: feedback,
                        }
                    }
                }
                return [...messagesWithFeedback, modelMessage];
            });
        } catch (error) {
            console.error('Error sending message:', error);
            const errorMessage: Message = { role: 'model', text: 'Oops! Something went wrong. Please try again.' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full max-w-4xl mx-auto bg-white rounded-lg shadow-lg border-t-4 border-rose-400">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold font-poppins text-gray-800">{scenario.emoji} {scenario.title}</h2>
                <p className="text-sm text-gray-600">{scenario.description}</p>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'model' && <span className="text-2xl">🦜</span>}
                            <div className={`rounded-xl px-4 py-2 max-w-md shadow-sm ${msg.role === 'user' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-gray-800'}`}>
                                <p>{msg.text}</p>
                            </div>
                            {msg.role === 'user' && msg.grammarFeedback && (
                                <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-900 animate-fade-in shadow-md">
                                    <h4 className="font-bold mb-1">Grammar Tip!</h4>
                                    <p><span className="font-semibold">Correction:</span> {msg.grammarFeedback.correction}</p>
                                    <p><span className="font-semibold">Explanation:</span> {msg.grammarFeedback.explanation}</p>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && messages.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                            <Spinner />
                            <p className="ml-2 text-gray-600">Polly is getting ready...</p>
                        </div>
                    )}
                    {isLoading && messages.length > 0 && (
                        <div className="flex items-end gap-2 justify-start">
                            <span className="text-2xl">🦜</span>
                            <div className="rounded-xl px-4 py-2 bg-slate-100">
                                <Spinner />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <div className="p-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => setShowGrammarCheck(!showGrammarCheck)}
                        className={`p-2 rounded-full transition-colors duration-200 ${showGrammarCheck ? 'bg-yellow-200 text-yellow-800' : 'bg-slate-200 text-gray-500 hover:bg-slate-300'}`}
                        title={showGrammarCheck ? 'Disable Grammar Check' : 'Enable Grammar Check'}
                    >
                        <SparklesIcon className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={`Chirp your response in ${language.name}...`}
                        className="flex-1 p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                        title="Send Chirp"
                    >
                        <SendIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};