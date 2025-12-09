import { functions } from './firebase';
import { httpsCallable } from 'firebase/functions';

export interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
    timestamp: number;
    audioUrl?: string;
}

/**
 * Record audio from the microphone
 */
export const recordAudio = async (durationMs: number = 10000): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/webm;codecs=opus',
            });

            const audioChunks: Blob[] = [];

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                stream.getTracks().forEach(track => track.stop());
                resolve(audioBlob);
            };

            mediaRecorder.onerror = (event) => {
                stream.getTracks().forEach(track => track.stop());
                reject(new Error('Recording failed'));
            };

            mediaRecorder.start();

            // Auto-stop after duration
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                }
            }, durationMs);

        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Start recording and return a function to stop it
 */
export const startRecording = async (): Promise<{
    stop: () => Promise<Blob>;
    stream: MediaStream;
}> => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
    });

    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
        }
    };

    mediaRecorder.start();

    return {
        stream,
        stop: () => {
            return new Promise((resolve, reject) => {
                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm;codecs=opus' });
                    stream.getTracks().forEach(track => track.stop());
                    resolve(audioBlob);
                };

                mediaRecorder.onerror = () => {
                    stream.getTracks().forEach(track => track.stop());
                    reject(new Error('Recording failed'));
                };

                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                } else {
                    resolve(new Blob(audioChunks, { type: 'audio/webm;codecs=opus' }));
                }
            });
        },
    };
};

/**
 * Convert audio blob to base64
 */
const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

/**
 * Transcribe audio using Firebase Cloud Function
 */
export const transcribeAudio = async (
    audioBlob: Blob,
    languageCode: string = 'en-US'
): Promise<string> => {
    console.log('transcribeAudio called with blob:', {
        size: audioBlob.size,
        type: audioBlob.type,
    });

    // Check 1: Validate audio blob size
    if (audioBlob.size === 0) {
        throw new Error('Audio blob is empty - please speak into your microphone');
    }

    // Check 2: Validate minimum audio size (typical silent audio is very small)
    const MIN_AUDIO_SIZE = 1000; // bytes - adjust based on your needs
    if (audioBlob.size < MIN_AUDIO_SIZE) {
        throw new Error('Audio too short or silent - please speak louder and try again');
    }

    const transcribeFunction = httpsCallable(functions, 'transcribeAudio');
    const audioBase64 = await blobToBase64(audioBlob);

    console.log('Base64 audio length:', audioBase64?.length || 0);

    // Check 3: Validate base64 conversion
    if (!audioBase64 || audioBase64.length === 0) {
        throw new Error('Failed to convert audio to base64 - please try recording again');
    }

    try {
        const result = await transcribeFunction({
            audioContent: audioBase64,
            languageCode,
        });

        const data = result.data as { text: string };

        // Check 4: Validate transcription result
        if (!data.text || data.text.trim().length === 0) {
            throw new Error('No speech detected in audio - please speak clearly and try again');
        }

        return data.text;
    } catch (error: any) {
        console.error('Transcription error:', error);

        // Provide user-friendly error messages
        if (error.message?.includes('Audio content is required')) {
            throw new Error('Audio recording failed - please check your microphone permissions');
        }

        throw error;
    }
};

/**
 * Get AI response using Firebase Cloud Function
 */
export const chatWithAI = async (prompt: string): Promise<string> => {
    const chatFunction = httpsCallable(functions, 'chatWithPolly');

    const result = await chatFunction({
        prompt,
    });

    const data = result.data as { reply: string };
    return data.reply;
};

/**
 * Synthesize speech from text using Firebase Cloud Function
 */
export const synthesizeSpeech = async (
    text: string,
    languageCode: string = 'en-US',
    voiceGender: 'MALE' | 'FEMALE' | 'NEUTRAL' = 'NEUTRAL'
): Promise<string> => {
    const synthesizeFunction = httpsCallable(functions, 'synthesizeSpeech');

    const result = await synthesizeFunction({
        text,
        languageCode,
        voiceGender,
    });

    const data = result.data as { audioContent: string };

    // Convert base64 to blob URL
    const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
    return URL.createObjectURL(audioBlob);
};

/**
 * Convert base64 to blob
 */
const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
};

/**
 * Complete voice chat flow: record → transcribe → chat → synthesize
 */
export const voiceChatFlow = async (
    audioBlob: Blob,
    languageCode: string = 'en-US',
    enableVoiceResponse: boolean = true
): Promise<{
    userText: string;
    aiText: string;
    aiAudioUrl?: string;
}> => {
    // Step 1: Transcribe user's audio
    const userText = await transcribeAudio(audioBlob, languageCode);

    // Step 2: Get AI response
    const aiText = await chatWithAI(userText);

    // Step 3: Synthesize AI response (optional)
    let aiAudioUrl: string | undefined;
    if (enableVoiceResponse) {
        aiAudioUrl = await synthesizeSpeech(aiText, languageCode);
    }

    return {
        userText,
        aiText,
        aiAudioUrl,
    };
};
