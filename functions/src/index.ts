import * as functions from "firebase-functions";
import { VertexAI } from "@google-cloud/vertexai";
import { SpeechClient } from "@google-cloud/speech";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";

// ============================================================================
// Type Definitions
// ============================================================================

interface ChatRequestData {
  prompt: string;
}

interface TranscribeAudioData {
  audioContent: string; // Base64 encoded audio
  languageCode?: string; // e.g., "en-US", "fr-FR"
}

interface SynthesizeSpeechData {
  text: string;
  languageCode?: string; // e.g., "en-US", "fr-FR"
  voiceGender?: "MALE" | "FEMALE" | "NEUTRAL";
}

// ============================================================================
// Initialize Clients
// ============================================================================

const vertex = new VertexAI({
  project: process.env.GCLOUD_PROJECT,
  location: "us-central1",
});

const speechClient = new SpeechClient();
const ttsClient = new TextToSpeechClient();

// ============================================================================
// Cloud Functions
// ============================================================================

/**
 * Transcribe audio to text using Google Cloud Speech-to-Text API
 */
export const transcribeAudio = functions.https.onCall(async (request) => {
  try {
    console.log("=== transcribeAudio called ===");

    // Firebase Callable Functions v2: actual data is in request.data
    const payload = request.data as TranscribeAudioData;
    const audioContent = payload?.audioContent;
    const languageCode = payload?.languageCode ?? "en-US";

    console.log("audioContent type:", typeof audioContent);
    console.log("audioContent length:", audioContent?.length || 0);

    if (!audioContent) {
      console.error("❌ Audio content is missing or empty!");
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Audio content is required"
      );
    }

    console.log("✅ Transcribing audio, language:", languageCode);
    console.log("✅ Audio content length:", audioContent.length);

    // Try with OGG_OPUS encoding (more compatible with WEBM)
    const apiRequest = {
      audio: {
        content: audioContent,
      },
      config: {
        encoding: "OGG_OPUS" as const,
        languageCode: languageCode,
        enableAutomaticPunctuation: true,
        model: "default",
      },
    };

    const [response] = await speechClient.recognize(apiRequest);

    console.log("Speech API response:", JSON.stringify(response));

    if (!response.results || response.results.length === 0) {
      console.warn("No transcription results returned");
      return {
        transcript: "",
      };
    }

    const transcription = response.results
      ?.map((result) => result.alternatives?.[0]?.transcript)
      .join("\n") ?? "";

    console.log("Transcription successful:", transcription);

    return {
      transcript: transcription,
    };
  } catch (error: any) {
    console.error("Transcription error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      stack: error.stack,
    });
    throw new functions.https.HttpsError(
      "internal",
      `Failed to transcribe audio: ${error.message}`
    );
  }
});


/**
 * Chat with AI using Vertex AI Gemini
 */
export const chatWithPolly = functions.https.onCall(async (request) => {
  try {
    const payload = request.data as ChatRequestData;
    const prompt = payload.prompt ?? "";

    if (!prompt) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Prompt is required"
      );
    }

    const model = vertex.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

    const generateResult = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const response = await generateResult.response;
    const replyText = response.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    return {
      reply: replyText,
    };
  } catch (error) {
    console.error("Chat error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to generate AI response"
    );
  }
});

/**
 * Synthesize speech from text using Google Cloud Text-to-Speech API
 */
export const synthesizeSpeech = functions.https.onCall(async (request) => {
  try {
    const payload = request.data as SynthesizeSpeechData;
    const text = payload.text;
    const languageCode = payload.languageCode ?? "en-US";
    const voiceGender = payload.voiceGender ?? "NEUTRAL";

    if (!text) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "Text is required"
      );
    }

    const ttsRequest = {
      input: { text: text },
      voice: {
        languageCode: languageCode,
        ssmlGender: voiceGender,
      },
      audioConfig: {
        audioEncoding: "MP3" as const,
        speakingRate: 1.0,
        pitch: 0.0,
      },
    };

    const [response] = await ttsClient.synthesizeSpeech(ttsRequest);

    return {
      audioContent: response.audioContent?.toString("base64") ?? "",
    };
  } catch (error) {
    console.error("Speech synthesis error:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to synthesize speech"
    );
  }
});