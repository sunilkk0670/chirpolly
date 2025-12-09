// Placeholder service file - Gemini API features have been removed
// These functions are stubs to prevent build errors

export const generateContent = async (prompt: string): Promise<string> => {
    console.warn('Gemini API features have been disabled');
    return 'This feature is currently unavailable.';
};

export const analyzeGrammar = async (text: string): Promise<any> => {
    console.warn('Gemini API features have been disabled');
    return { corrections: [], suggestions: [] };
};

export const generateImage = async (prompt: string): Promise<string> => {
    console.warn('Gemini API features have been disabled');
    return '';
};

export const generateSpeech = async (text: string, languageCode?: string): Promise<string> => {
    console.warn('Gemini API features have been disabled');
    return '';
};

export const getPronunciationFeedback = async (audioBlob: Blob, text: string): Promise<any> => {
    console.warn('Gemini API features have been disabled');
    return { score: 0, feedback: 'Feature unavailable' };
};

export const generateQuizForUnit = async (unitId: string): Promise<any[]> => {
    console.warn('Gemini API features have been disabled');
    return [];
};

export const startChat = async (systemPrompt: string): Promise<any> => {
    console.warn('Gemini API features have been disabled');
    return {
        sendMessage: async (message: string) => ({ text: 'Feature unavailable' }),
    };
};

export const sendMessage = async (chatSession: any, message: string): Promise<any> => {
    console.warn('Gemini API features have been disabled');
    return { text: 'Feature unavailable' };
};

export const generateVocabularyFromImage = async (imageUrl: string): Promise<any[]> => {
    console.warn('Gemini API features have been disabled');
    return [];
};

export const editImage = async (imageUrl: string, prompt: string): Promise<string> => {
    console.warn('Gemini API features have been disabled');
    return '';
};
