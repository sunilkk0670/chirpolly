import * as functions from "firebase-functions";
import { VertexAI } from "@google-cloud/vertexai";
import { SpeechClient } from '@google-cloud/speech';

// --- 1. Define Interfaces (Fixes TS2339 Deployment Error) ---
// These define the structure of the data expected from the frontend.
interface ChatRequestData {
    prompt: string;
}

// --- 2. Client Initializations ---
// Initialize clients outside the function to reuse connections (better performance)
const vertex = new VertexAI({
    project: process.env.GCLOUD_PROJECT,
    location: "us-central1",
});
const speechClient = new SpeechClient(); // Client for Google Cloud Speech-to-Text API

// --- 3. chatWithPolly Function (Text/Gemini AI) ---
export const chatWithPolly = functions.https.onCall(async (data) => {

    // Safely destructure data using the interface (Fixes TS2339 on 'prompt')
    const { prompt } = data as unknown as ChatRequestData;
    const promptText = prompt ?? "";

    const model = vertex.getGenerativeModel({
        model: "gemini-1.5-flash",
    });

    try {
        // Generate content using the Vertex AI model
        const result = await model.generateContent(promptText);
        const response = result.response;

        return {
            // Extract the text from the response using correct Vertex AI API
            reply: response.candidates?.[0]?.content?.parts?.[0]?.text || '',
        };
    } catch (error) {
        console.error('Error generating content:', error);
        throw new functions.https.HttpsError('internal', 'Failed to generate AI response');
    }
});


// --- 4. transcribeAudio Function (Speech-to-Text) ---
export const transcribeAudio = functions.https.onCall(async (data: any) => {

    // Log what we receive to debug
    console.log('transcribeAudio called with data:', {
        hasData: !!data,
        dataKeys: data ? Object.keys(data) : [],
        audioContentLength: (data && data.audioContent) ? data.audioContent.length : 0,
    });

    // Access audioContent directly from data
    const audioContent = data && data.audioContent;
    const languageCode = (data && data.languageCode) || 'en-US';

    // Validate that audio content was received
    if (!audioContent || typeof audioContent !== 'string') {
        console.error('Invalid audio content received:', {
            hasAudioContent: !!audioContent,
            type: typeof audioContent,
            length: audioContent ? audioContent.length : 0,
        });
        throw new functions.https.HttpsError('invalid-argument', 'Audio content is required for transcription.');
    }

    // Define the audio configuration (ADJUST THIS based on your frontend recording settings)
    const audio = {
        content: audioContent, // Base64 string from the frontend
    };

    const config = {
        // Example encoding and sample rate for a common recording type (e.g., audio/webm; codecs=opus)
        encoding: 'WEBM_OPUS' as const,
        sampleRateHertz: 48000, // CHECK THIS AGAINST YOUR MICROPHONE SETTINGS
        languageCode: languageCode, // Use the language code from request
    };

    const request = {
        audio: audio,
        config: config,
    };

    // Call the Google Cloud Speech-to-Text API
    const [response] = await speechClient.recognize(request);

    // Extract the transcribed text
    // functions/src/index.ts - Inside the transcribeAudio function:

    // ... (code up to line 73: const transcription = response.results)

    // Extract the transcribed text (Fix for TS18049)
    const resultsArray = response.results || [];

    const transcription = resultsArray // Use the safe array here
        .map(result => {
            // Safe check for alternatives inside the loop (Fixes TS18049)
            if (result?.alternatives && result.alternatives.length > 0) {
                return result.alternatives[0].transcript;
            }
            return '';
        })
        .join('\n');

    return { text: transcription }; // Line 78
    // ... rest of the function
});