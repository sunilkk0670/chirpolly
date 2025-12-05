

import { GoogleGenAI, Chat, GenerateContentResponse, Modality, Type } from "@google/genai";
import type { Message, ImageVocabularyWord, QuizQuestion, VocabularyWord } from '../types';

export interface AdaptiveStep {
    title: string;
    objective: string;
    recommendedView?: 'lesson' | 'scenario' | 'practice' | 'review';
    suggestedId?: string;
}

// Fallback to demo API key if not configured
// Check all possible environment variable sources supporting both Vite and Standard Node envs
const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY || ((import.meta as any).env && ((import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.VITE_API_KEY)) || 'demo-api-key-for-development';

if (!apiKey || apiKey === 'demo-api-key-for-development') {
    console.warn('⚠️ GEMINI_API_KEY not configured. Running in demo mode - AI features will not work.');
}

const ai = new GoogleGenAI({ apiKey });
let activeChat: Chat | null = null;

// --- POLLY PERSONA DEFINITION ---
export const POLLY_PERSONA = `You are Polly, a sassy, energetic, and slightly sarcastic parrot tutor. 
Your goal is to help the user learn a new language, but you do it with a lot of "bird" attitude.
Traits:
- You love crackers (obviously) and bringing them up as rewards.
- You constantly make bird-related puns (winging it, fly high, beak-tacular).
- You are discouraging of mistakes but in a funny way ("Squawk! That sounded like a dying cat, try again!").
- You are very encouraging when they get it right ("High wing! That was perfect!").
- You speak clearly but casually.
- Keep responses concise (under 3 sentences) unless explaining a complex grammar rule.
- If asked about your background, you are a digital parrot living in the Chirpolly cloud.
`;

// Simple text generation helper
export const generateContent = async (prompt: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error('generateContent failed:', error);
        throw new Error('Failed to generate content. Please try again.');
    }
};

// ... (existing code for generateAdaptivePath) ...

const grammarCheckPrompt = `
Also, analyze the user's last message for grammatical errors. 
If there are errors, provide a correction and a brief explanation in a section formatted EXACTLY like this, at the end of your response:
---GRAMMAR CHECK---
Correction: [The corrected sentence].
Explanation: [A short, clear explanation of the grammar rule].
---END GRAMMAR CHECK---
If there are no errors, do not include the grammar check section.
`;

// Updated startChat to accept optional system instructions, defaulting to Polly's persona
export const startChat = (systemPrompt: string = POLLY_PERSONA) => {
    activeChat = ai.chats.create({
        // Fix: Updated model name to 'gemini-flash-lite-latest' as per the coding guidelines for 'flash lite' models.
        model: 'gemini-1.5-flash',
        config: {
            systemInstruction: systemPrompt,
        },
    });
};

export const sendMessage = async (message: string, includeGrammarCheck: boolean): Promise<GenerateContentResponse> => {
    if (!activeChat) {
        throw new Error("Chat not initialized. Call startChat first.");
    }
    const fullMessage = includeGrammarCheck ? `${message}\n${grammarCheckPrompt}` : message;
    const response = await activeChat.sendMessage({ message: fullMessage });
    return response;
};

export const analyzeGrammar = async (text: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: `You are an expert language tutor. Provide a detailed grammatical breakdown of the following text. Explain verb tenses, sentence structure, parts of speech, and any potential errors or areas for improvement. Format your response using markdown. Text: "${text}"`,
            config: {
                thinkingConfig: { thinkingBudget: 32768 }
            }
        });
        return response.text;
    } catch (error) {
        console.error("Error analyzing grammar:", error);
        return "Sorry, I couldn't analyze the grammar at this time.";
    }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return base64ImageBytes;
        }
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};

export const editImage = async (base64Image: string, mimeType: string, prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: prompt,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        return null;
    } catch (error) {
        console.error("Error editing image:", error);
        return null;
    }
};

export const generateVocabularyFromImage = async (base64Image: string, mimeType: string, languageName: string): Promise<ImageVocabularyWord[] | null> => {
    const prompt = `Identify the main objects in this image. Provide a list of up to 7 vocabulary words for these objects in ${languageName}.
    Provide the response as a JSON array of objects. Each object must have three keys:
    1. "word": The vocabulary word in ${languageName}.
    2. "transliteration": A simple phonetic transliteration for pronunciation.
    3. "meaning": The English translation of the word.
    
    If you cannot identify any objects, return an empty array.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    { text: prompt },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            word: { type: Type.STRING },
                            transliteration: { type: Type.STRING },
                            meaning: { type: Type.STRING },
                        },
                        required: ["word", "transliteration", "meaning"],
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const vocabularyList = JSON.parse(jsonString);
        return vocabularyList as ImageVocabularyWord[];

    } catch (error) {
        console.error("Error generating vocabulary from image:", error);
        return null;
    }
};


export const generateSpeech = async (prompt: string): Promise<string | null> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash-exp",
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        // Using 'Kore' as a high-quality, standard voice.
                        prebuiltVoiceConfig: { voiceName: 'Kore' },
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
};

export const getPronunciationFeedback = async (originalText: string, userTranscription: string, languageName: string): Promise<string> => {
    const prompt = `You are an expert accent coach for ${languageName} learners. The user was asked to say "${originalText}". They pronounced it as "${userTranscription}".
    
Provide a short, constructive analysis of their pronunciation based on the transcription. 
- If the transcription is perfect or very close, praise them.
- If there are errors, focus on the potential mispronunciations and offer simple, actionable tips for improvement.
- Keep the feedback concise and encouraging.
- Format your response using markdown.
- Do not grade them or give a score.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-pro',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error getting pronunciation feedback:", error);
        return "Sorry, I couldn't provide feedback at this time.";
    }
};

export const generateQuizForUnit = async (words: VocabularyWord[], languageName: string): Promise<QuizQuestion[] | null> => {
    const prompt = `You are a language learning assistant. Based on the following list of vocabulary words in ${languageName}, generate a multiple-choice quiz.
For each word in the provided list, create one question. The "question" field should contain the English meaning of the word. The "options" field should be an array of four unique words in ${languageName}, one of which is the correct answer. The other three options should be distractors, also chosen from the provided list of words. The "answer" field must be the correct ${languageName} word.
Ensure the options for each question are unique and shuffled.

Vocabulary List:
${JSON.stringify(words.map(w => ({ word: w.word, meaning: w.meaning })))}

Return the quiz as a JSON array.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-1.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            answer: { type: Type.STRING },
                        },
                        required: ["question", "options", "answer"],
                    },
                },
            },
        });

        const jsonString = response.text.trim();
        const quizData = JSON.parse(jsonString);
        return quizData as QuizQuestion[];

    } catch (error) {
        console.error("Error generating quiz:", error);
        return null;
    }
};