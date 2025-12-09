// Vertex AI Service - Connects to Firebase Cloud Functions
// This service uses the Vertex AI-powered backend functions

import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

// Chat session management
let chatHistory: Array<{ role: string; text: string }> = [];
let currentSystemPrompt: string = '';

/**
 * Start a new chat session with a system prompt
 */
export const startChat = async (systemPrompt: string): Promise<void> => {
    currentSystemPrompt = systemPrompt;
    chatHistory = [];
    console.log('Chat session started with system prompt:', systemPrompt);
};

/**
 * Send a message and get AI response using Vertex AI
 */
export const sendMessage = async (userMessage: string, includeGrammarCheck: boolean = false): Promise<{ text: string }> => {
    // Build the full prompt with system context and chat history
    let fullPrompt = currentSystemPrompt + '\n\n';

    // Add chat history
    chatHistory.forEach(msg => {
        fullPrompt += `${msg.role}: ${msg.text}\n`;
    });

    // Add current message
    if (userMessage.trim()) {
        fullPrompt += `user: ${userMessage}\n`;
        chatHistory.push({ role: 'user', text: userMessage });
    }

    // Add grammar check instruction if enabled
    if (includeGrammarCheck && userMessage.trim()) {
        fullPrompt += '\n\nPlease also provide grammar feedback for the user\'s last message in this format:\n';
        fullPrompt += '---GRAMMAR CHECK---\n';
        fullPrompt += 'Correction: [corrected version]\n';
        fullPrompt += 'Explanation: [brief explanation]\n';
        fullPrompt += '---END GRAMMAR CHECK---\n';
    }

    fullPrompt += 'assistant:';

    try {
        // Call the Vertex AI-powered Firebase Cloud Function
        const chatFunction = httpsCallable(functions, 'chatWithPolly');
        const result = await chatFunction({ prompt: fullPrompt });
        const data = result.data as { reply: string };

        // Add AI response to chat history
        chatHistory.push({ role: 'assistant', text: data.reply });

        return { text: data.reply };
    } catch (error) {
        console.error('Error calling Vertex AI:', error);
        throw new Error('Failed to get AI response');
    }
};

// Legacy stub functions for backward compatibility
export const generateContent = async (prompt: string): Promise<string> => {
    const result = await sendMessage(prompt, false);
    return result.text;
};

export const analyzeGrammar = async (text: string): Promise<any> => {
    console.warn('analyzeGrammar is deprecated, use sendMessage with grammar check enabled');
    return { corrections: [], suggestions: [] };
};

export const generateImage = async (prompt: string): Promise<string> => {
    console.warn('Image generation not implemented in Vertex AI backend');
    return '';
};

export const generateSpeech = async (text: string, languageCode?: string): Promise<string> => {
    console.warn('Use aiChatService.synthesizeSpeech for speech generation');
    return '';
};

export const getPronunciationFeedback = async (audioBlob: Blob, text: string): Promise<any> => {
    console.warn('Pronunciation feedback not implemented');
    return { score: 0, feedback: 'Feature unavailable' };
};

export const generateQuizForUnit = async (unitId: string): Promise<any[]> => {
    console.warn('Quiz generation not implemented');
    return [];
};

export const generateVocabularyFromImage = async (imageUrl: string): Promise<any[]> => {
    console.warn('Vocabulary generation not implemented');
    return [];
};

export const editImage = async (imageUrl: string, prompt: string): Promise<string> => {
    console.warn('Image editing not implemented');
    return '';
};
