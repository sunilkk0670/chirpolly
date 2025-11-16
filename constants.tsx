// Fix: Import React to resolve namespace errors for React.FC and React.SVGProps.
import React from 'react';
import type { Language, Scenario, View, CommunityUser, Lesson, AchievementBadge, Challenge, PostLessonMessage, MediaItem, Tutor, Workshop, PhraseCategory, LeaderboardUser, Persona } from './types';
import { HomeIcon, GlobeIcon, GrammarIcon, VocabularyIcon, ImageGeneratorIcon, CommunityIcon, ChallengesIcon, AchievementsIcon, WordBankIcon, TutorIcon, AccentTrainingIcon, KanjiIcon } from './components/icons/SidebarIcons';
import { ChatBubbleIcon, BriefcaseIcon, AcademicCapIcon, MapPinIcon, SparklesIcon } from './components/icons/Icons';

export const LANGUAGES_CONFIG: (Language & { emoji: string })[] = [
  { code: 'en', name: 'English', emoji: '🇬🇧' },
  { code: 'es', name: 'Spanish', emoji: '🇪🇸' },
  { code: 'fr', name: 'French', emoji: '🇫🇷' },
  { code: 'de', name: 'German', emoji: '🇩🇪' },
  { code: 'ja', name: 'Japanese', emoji: '🇯🇵' },
  { code: 'sa', name: 'Sanskrit', emoji: '🕉️' },
  { code: 'hi', name: 'Hindi', emoji: '🇮🇳' },
  { code: 'ta', name: 'Tamil', emoji: '🇮🇳' },
  { code: 'kn', name: 'Kannada', emoji: '🇮🇳' },
  { code: 'te', name: 'Telugu', emoji: '🇮🇳' },
  { code: 'ml', name: 'Malayalam', emoji: '🇮🇳' },
  { code: 'mr', name: 'Marathi', emoji: '🇮🇳' },
  { code: 'or', name: 'Odia', emoji: '🇮🇳' },
  { code: 'gu', name: 'Gujarati', emoji: '🇮🇳' },
  { code: 'bn', name: 'Bengali', emoji: '🇧🇩' },
  { code: 'it', name: 'Italian', emoji: '🇮🇹' },
  { code: 'nl', name: 'Dutch', emoji: '🇳🇱' },
  { code: 'da', name: 'Danish', emoji: '🇩🇰' },
  { code: 'pt', name: 'Portuguese', emoji: '🇵🇹' },
  { code: 'fi', name: 'Finnish', emoji: '🇫🇮' },
];

export const LANGUAGES: Language[] = LANGUAGES_CONFIG.map(({ code, name }) => ({ code, name }));


export const MOTIVATIONAL_QUOTES: string[] = [
    "A new language is a new life.",
    "To learn a language is to have one more window from which to look at the world.",
    "One language sets you in a corridor for life. Two languages open every door along the way.",
    "The limits of my language are the limits of my world.",
    "Don't be afraid to make mistakes. In learning, they are your stepping stones.",
    "Practice makes progress, not perfect. Keep chirping!",
];

export const AI_TUTOR_PROMPT = `You are Polly, a friendly, encouraging, and expert AI language tutor from ChirPolly, who is also a clever parrot. The user wants to practice conversing in {languageName}. Your SINGLE MOST IMPORTANT rule is to communicate exclusively in the user's target language, {languageName}. Respond with spoken audio. Keep your responses natural, supportive, and not too long, like a real conversation. Listen to the user's pronunciation and grammar, and offer gentle, encouraging corrections as part of the conversation (e.g., "Nice chirp! For that 'r' sound, try..."). Also, comment on their emotional tone - for example, if they sound confident, curious, or happy. Start the conversation with a warm, friendly welcome, inviting the user to talk.`;


export const COMMUNITY_USERS: CommunityUser[] = [
    {
        id: '1',
        name: 'Maria Garcia',
        nativeLanguage: 'es',
        learningLanguage: 'fr',
        bio: 'Hola! I love French cinema and want to practice my conversation skills. Let\'s chat!',
        isOnline: true,
    },
    {
        id: '2',
        name: 'John Smith',
        nativeLanguage: 'en',
        learningLanguage: 'ja',
        bio: 'I\'m a beginner in Japanese, planning a trip to Tokyo next year. Happy to help with English in return.',
        isOnline: false,
    },
    {
        id: '3',
        name: 'Anne Dubois',
        nativeLanguage: 'fr',
        learningLanguage: 'de',
        bio: 'Bonjour! I work in engineering and need to improve my technical German. I enjoy hiking and cooking.',
        isOnline: true,
    },
    {
        id: '4',
        name: 'Ken Tanaka',
        nativeLanguage: 'ja',
        learningLanguage: 'en',
        bio: 'こんにちは！Looking for a partner to discuss technology and current events in English.',
        isOnline: true,
    },
    {
        id: '5',
        name: 'Lukas Müller',
        nativeLanguage: 'de',
        learningLanguage: 'es',
        bio: 'Guten Tag! I lived in Madrid for a year and want to keep my Spanish fresh. Let\'s talk about travel.',
        isOnline: false,
    },
    {
        id: '6',
        name: 'Chloe Wright',
        nativeLanguage: 'en',
        learningLanguage: 'fr',
        bio: 'Hi! I\'m preparing for a proficiency exam in French. I can help you with English idioms and slang.',
        isOnline: true,
    }
];

export const LESSONS: Lesson[] = [
    {
        lesson_id: "sanskrit_01",
        language: "Sanskrit",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Sanskrit with a fun quiz.",
        level: "Beginner",
        emoji: "🙏",
        lang: 'sa',
        category: 'Lesson',
        content: [
            {
                word: "नमः",
                transliteration: "namah",
                meaning: "Hello / Greetings",
                example: "त्वं कथं भवसि? नमः!",
                audio: "audio/namah.mp3"
            },
            {
                word: "धन्यवादः",
                transliteration: "dhanyavaadah",
                meaning: "Thank you",
                example: "ते धन्यवादः।",
                audio: "audio/dhanyavaadah.mp3"
            },
            {
                word: "शुभरात्रिः",
                transliteration: "shubha-raatrih",
                meaning: "Good night",
                example: "शुभरात्रिः मित्र!",
                audio: "audio/shubharatrih.mp3"
            }
        ],
        quiz: [
            {
                question: "What does 'धन्यवादः' mean?",
                options: ["Hello", "Thank you", "Good night"],
                answer: "Thank you"
            },
            {
                question: "How do you say 'Good night' in Sanskrit?",
                options: ["शुभरात्रिः", "नमः", "धन्यवादः"],
                answer: "शुभरात्रिः"
            }
        ]
    },
    {
        lesson_id: "en_01",
        language: "English",
        title: "Basic Greetings",
        description: "Learn your first few greetings in English with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'en',
        category: 'Lesson',
        content: [
            { word: "Hello", transliteration: "Hello", meaning: "Hello", example: "Hello, how are you?", audio: "audio/hello_en.mp3" },
            { word: "Thank you", transliteration: "Thank you", meaning: "Thank you", example: "Thank you so much!", audio: "audio/thankyou_en.mp3" },
            { word: "Good night", transliteration: "Good night", meaning: "Good night", example: "Good night, see you tomorrow.", audio: "audio/goodnight_en.mp3" }
        ],
        quiz: [
            { question: "What does 'Thank you' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in English?", options: ["Good night", "Hello", "Thank you"], answer: "Hello" }
        ]
    },
    {
        lesson_id: "es_01",
        language: "Spanish",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Spanish with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'es',
        category: 'Lesson',
        content: [
            { word: "Hola", transliteration: "Hola", meaning: "Hello", example: "Hola, ¿cómo estás?", audio: "audio/hola_es.mp3" },
            { word: "Gracias", transliteration: "Gracias", meaning: "Thank you", example: "Muchas gracias.", audio: "audio/gracias_es.mp3" },
            { word: "Buenas noches", transliteration: "Buenas noches", meaning: "Good night", example: "Buenas noches, hasta mañana.", audio: "audio/buenasnoches_es.mp3" }
        ],
        quiz: [
            { question: "What does 'Gracias' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Spanish?", options: ["Buenas noches", "Hola", "Gracias"], answer: "Hola" }
        ],
        cultureCapsule: {
            title: "La Sobremesa",
            icon: "☕",
            content: "`La Sobremesa` is the cherished Spanish tradition of relaxing at the table after a meal. It's not about eating more, but about enjoying conversation with family and friends, savoring the moment. This can last for hours and is a key part of Spanish hospitality."
        }
    },
    {
        lesson_id: "fr_01",
        language: "French",
        title: "Basic Greetings",
        description: "Learn your first few greetings in French with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'fr',
        category: 'Lesson',
        content: [
            { word: "Bonjour", transliteration: "Bonjour", meaning: "Hello", example: "Bonjour, comment ça va ?", audio: "audio/bonjour_fr.mp3" },
            { word: "Merci", transliteration: "Merci", meaning: "Thank you", example: "Merci beaucoup.", audio: "audio/merci_fr.mp3" },
            { word: "Bonsoir", transliteration: "Bonsoir", meaning: "Good evening", example: "Bonsoir, madame.", audio: "audio/bonsoir_fr.mp3" }
        ],
        quiz: [
            { question: "What does 'Merci' mean?", options: ["Hello", "Good evening", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in French?", options: ["Bonsoir", "Bonjour", "Merci"], answer: "Bonjour" }
        ],
        cultureCapsule: {
            title: "La Bise",
            icon: "🥐",
            content: "In France, greeting friends and family often involves 'la bise,' a kiss on each cheek. The number of kisses (usually two, but sometimes one, three, or four!) varies by region. It's a warm, friendly gesture central to French social life."
        }
    },
    {
        lesson_id: "de_01",
        language: "German",
        title: "Basic Greetings",
        description: "Learn your first few greetings in German with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'de',
        category: 'Lesson',
        content: [
            { word: "Hallo", transliteration: "Hallo", meaning: "Hello", example: "Hallo, wie geht's?", audio: "audio/hallo_de.mp3" },
            { word: "Danke", transliteration: "Danke", meaning: "Thank you", example: "Danke schön.", audio: "audio/danke_de.mp3" },
            { word: "Gute Nacht", transliteration: "Gute Nacht", meaning: "Good night", example: "Gute Nacht, schlaf gut.", audio: "audio/gutenacht_de.mp3" }
        ],
        quiz: [
            { question: "What does 'Danke' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in German?", options: ["Gute Nacht", "Hallo", "Danke"], answer: "Hallo" }
        ]
    },
    {
        lesson_id: "ja_01",
        language: "Japanese",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Japanese with a fun quiz.",
        // Fix: Corrected typo in 'level' from 'Beginger' to 'Beginner'.
        level: "Beginner",
        emoji: "👋",
        lang: 'ja',
        category: 'Lesson',
        content: [
            { word: "こんにちは", transliteration: "Konnichiwa", meaning: "Hello", example: "こんにちは、田中さん。", audio: "audio/konnichiwa_ja.mp3" },
            { word: "ありがとう", transliteration: "Arigatou", meaning: "Thank you", example: "どうもありがとう。", audio: "audio/arigatou_ja.mp3" },
            { word: "おやすみなさい", transliteration: "Oyasuminasai", meaning: "Good night", example: "おやすみなさい、また明日。", audio: "audio/oyasuminasai_ja.mp3" }
        ],
        quiz: [
            { question: "What does 'ありがとう' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Japanese?", options: ["おやすみなさい", "こんにちは", "ありがとう"], answer: "こんにちは" }
        ],
        cultureCapsule: {
            title: "The Art of Bowing",
            icon: "🙇",
            content: "Bowing, or 'ojigi' (お辞儀), is a fundamental part of Japanese etiquette. The depth and duration of the bow depend on the social status and situation. A slight nod is casual, while a deep, long bow shows great respect. It's used for greetings, apologies, and showing gratitude."
        }
    },
    {
        lesson_id: "hi_01",
        language: "Hindi",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Hindi with a fun quiz.",
        // Fix: Corrected typo in 'level' from 'Beginger' to 'Beginner'.
        level: "Beginner",
        emoji: "🙏",
        lang: 'hi',
        category: 'Lesson',
        content: [
            { word: "नमस्ते", transliteration: "Namaste", meaning: "Hello", example: "नमस्ते, आप कैसे हैं?", audio: "audio/namaste_hi.mp3" },
            { word: "धन्यवाद", transliteration: "Dhanyavaad", meaning: "Thank you", example: "बहुत धन्यवाद।", audio: "audio/dhanyavaad_hi.mp3" },
            { word: "शुभ रात्रि", transliteration: "Shubh raatri", meaning: "Good night", example: "शुभ रात्रि, फिर मिलेंगे।", audio: "audio/shubhraatri_hi.mp3" }
        ],
        quiz: [
            { question: "What does 'धन्यवाद' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Hindi?", options: ["शुभ रात्रि", "नमस्ते", "धन्यवाद"], answer: "नमस्ते" }
        ]
    },
    {
        lesson_id: "ta_01",
        language: "Tamil",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Tamil with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'ta',
        category: 'Lesson',
        content: [
            { word: "வணக்கம்", transliteration: "Vanakkam", meaning: "Hello", example: "வணக்கம், எப்படி இருக்கிறீர்கள்?", audio: "audio/vanakkam_ta.mp3" },
            { word: "நன்றி", transliteration: "Nandri", meaning: "Thank you", example: "மிக்க நன்றி.", audio: "audio/nandri_ta.mp3" },
            { word: "இனிய இரவு", transliteration: "Iniya iravu", meaning: "Good night", example: "இனிய இரவு, நாளை சந்திப்போம்.", audio: "audio/iniyairavu_ta.mp3" }
        ],
        quiz: [
            { question: "What does 'நன்றி' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Tamil?", options: ["இனிய இரவு", "வணக்கம்", "நன்றி"], answer: "வணக்கம்" }
        ]
    },
    {
        lesson_id: "kn_01",
        language: "Kannada",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Kannada with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'kn',
        category: 'Lesson',
        content: [
            { word: "ನಮಸ್ಕಾರ", transliteration: "Namaskara", meaning: "Hello", example: "ನಮಸ್ಕಾರ, ನೀವು ಹೇಗಿದ್ದೀರಾ?", audio: "audio/namaskara_kn.mp3" },
            { word: "ಧನ್ಯವಾದಗಳು", transliteration: "Dhanyavadagalu", meaning: "Thank you", example: "ತುಂಬಾ ಧನ್ಯವಾದಗಳು.", audio: "audio/dhanyavadagalu_kn.mp3" },
            { word: "ಶುಭರಾತ್ರಿ", transliteration: "Shubharatri", meaning: "Good night", example: "ಶುಭರಾತ್ರಿ, ನಾಳೆ ಸಿಗೋಣ.", audio: "audio/shubharatri_kn.mp3" }
        ],
        quiz: [
            { question: "What does 'ಧನ್ಯವಾದಗಳು' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Kannada?", options: ["ಶುಭರಾತ್ರಿ", "ನಮಸ್ಕಾರ", "ಧನ್ಯವಾದಗಳು"], answer: "ನಮಸ್ಕಾರ" }
        ]
    },
    {
        lesson_id: "te_01",
        language: "Telugu",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Telugu with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'te',
        category: 'Lesson',
        content: [
            { word: "నమస్కారం", transliteration: "Namaskāram", meaning: "Hello", example: "నమస్కారం, మీరు ఎలా ఉన్నారు?", audio: "audio/namaskaram_te.mp3" },
            { word: "ధన్యవాదాలు", transliteration: "Dhan'yavādālu", meaning: "Thank you", example: "చాలా ధన్యవాదాలు.", audio: "audio/dhanyavadalu_te.mp3" },
            { word: "శుభ రాత్రి", transliteration: "Śubha rātri", meaning: "Good night", example: "శుభ రాత్రి, రేపు కలుద్దాం.", audio: "audio/subharatri_te.mp3" }
        ],
        quiz: [
            { question: "What does 'ధన్యవాదాలు' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Telugu?", options: ["శుభ రాత్రి", "నమస్కారం", "ధన్యవాదాలు"], answer: "నమస్కారం" }
        ]
    },
    {
        lesson_id: "ml_01",
        language: "Malayalam",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Malayalam with a fun quiz.",
        // Fix: Corrected typo in 'level' from 'Beginger' to 'Beginner'.
        level: "Beginner",
        emoji: "👋",
        lang: 'ml',
        category: 'Lesson',
        content: [
            { word: "നമസ്കാരം", transliteration: "Namaskāram", meaning: "Hello", example: "നമസ്കാരം, സുഖമാണോ?", audio: "audio/namaskaram_ml.mp3" },
            { word: "നന്ദി", transliteration: "Nandi", meaning: "Thank you", example: "വളരെ നന്ദി.", audio: "audio/nandi_ml.mp3" },
            { word: "ശുഭരാത്രി", transliteration: "Śubharātri", meaning: "Good night", example: "ശുഭരാത്രി, നാളെ കാണാം.", audio: "audio/subharatri_ml.mp3" }
        ],
        quiz: [
            { question: "What does 'നന്ദി' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Malayalam?", options: ["ശുഭരാത്രി", "നമസ്കാരം", "നന്ദി"], answer: "നമസ്കാരം" }
        ]
    },
    {
        lesson_id: "mr_01",
        language: "Marathi",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Marathi with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'mr',
        category: 'Lesson',
        content: [
            { word: "नमस्कार", transliteration: "Namaskār", meaning: "Hello", example: "नमस्कार, तुम्ही कसे आहात?", audio: "audio/namaskar_mr.mp3" },
            { word: "धन्यवाद", transliteration: "Dhan'yavād", meaning: "Thank you", example: "खूप धन्यवाद.", audio: "audio/dhanyavad_mr.mp3" },
            { word: "शुभ रात्री", transliteration: "Śubha rātrī", meaning: "Good night", example: "शुभ रात्री, उद्या भेटूया.", audio: "audio/subharatri_mr.mp3" }
        ],
        quiz: [
            { question: "What does 'धन्यवाद' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Marathi?", options: ["शुभ रात्री", "नमस्कार", "धन्यवाद"], answer: "नमस्कार" }
        ]
    },
    {
        lesson_id: "or_01",
        language: "Odia",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Odia with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'or',
        category: 'Lesson',
        content: [
            { word: "ନମସ୍କାର", transliteration: "Namaskāra", meaning: "Hello", example: "ନମସ୍କାର, ଆପଣ କେମିତି ଅଛନ୍ତି?", audio: "audio/namaskar_or.mp3" },
            { word: "ଧନ୍ୟବାଦ", transliteration: "Dhan'yabāda", meaning: "Thank you", example: "ବହୁତ ଧନ୍ୟବାଦ।", audio: "audio/dhanyabada_or.mp3" },
            { word: "ଶୁଭ ରାତ୍ରି", transliteration: "Śubha rātri", meaning: "Good night", example: "ଶୁଭ ରାତ୍ରି, କାଲି ଦେଖାହେବା।", audio: "audio/subharatri_or.mp3" }
        ],
        quiz: [
            { question: "What does 'ଧନ୍ୟବାଦ' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Odia?", options: ["ଶୁଭ ରାତ୍ରି", "ନମସ୍କାର", "ଧନ୍ୟବାଦ"], answer: "ନମସ୍କାର" }
        ]
    },
    {
        lesson_id: "gu_01",
        language: "Gujarati",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Gujarati with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'gu',
        category: 'Lesson',
        content: [
            { word: "નમસ્તે", transliteration: "Namaste", meaning: "Hello", example: "નમસ્તે, તમે કેમ છો?", audio: "audio/namaste_gu.mp3" },
            { word: "આભાર", transliteration: "Ābhāra", meaning: "Thank you", example: "खૂબ ખૂબ આભાર.", audio: "audio/abhara_gu.mp3" },
            { word: "શુભ રાત્રી", transliteration: "Śubha rātrī", meaning: "Good night", example: "શુભ રાત્રી, કાલે મળીશું.", audio: "audio/subharatri_gu.mp3" }
        ],
        quiz: [
            {
                question: "What does 'આભાર' mean?",
                options: ["Hello", "Good night", "Thank you"],
                answer: "Thank you"
            },
            {
                question: "How do you say 'Hello' in Gujarati?",
                options: ["શુભ રાત્રી", "નમસ્તે", "આભાર"],
                answer: "નમસ્તે"
            }
        ]
    },
    {
        lesson_id: "bn_01",
        language: "Bengali",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Bengali with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'bn',
        category: 'Lesson',
        content: [
            { word: "নমস্কার", transliteration: "Nômôśkār", meaning: "Hello", example: "নমস্কার, আপনি কেমন আছেন?", audio: "audio/nomoskar_bn.mp3" },
            { word: "ধন্যবাদ", transliteration: "Dhonnobād", meaning: "Thank you", example: "অনেক ধন্যবাদ।", audio: "audio/dhonnobad_bn.mp3" },
            { word: "শুভ রাত্রি", transliteration: "Śubhô rātri", meaning: "Good night", example: "শুভ রাত্রি, কাল দেখা হবে।", audio: "audio/subhoratri_bn.mp3" }
        ],
        quiz: [
            { question: "What does 'ধন্যবাদ' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Bengali?", options: ["শুভ রাত্রি", "নমস্কার", "ধন্যবাদ"], answer: "নমস্কার" }
        ]
    },
    {
        lesson_id: "it_01",
        language: "Italian",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Italian with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'it',
        category: 'Lesson',
        content: [
            { word: "Ciao", transliteration: "Ciao", meaning: "Hello", example: "Ciao, come stai?", audio: "audio/ciao_it.mp3" },
            { word: "Grazie", transliteration: "Grazie", meaning: "Thank you", example: "Grazie mille.", audio: "audio/grazie_it.mp3" },
            { word: "Buona notte", transliteration: "Buona notte", meaning: "Good night", example: "Buona notte, a domani.", audio: "audio/buonanotte_it.mp3" }
        ],
        quiz: [
            { question: "What does 'Grazie' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Italian?", options: ["Buona notte", "Ciao", "Grazie"], answer: "Ciao" }
        ]
    },
    {
        lesson_id: "nl_01",
        language: "Dutch",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Dutch with a fun quiz.",
        // Fix: Corrected typo in 'level' from 'Beginger' to 'Beginner'.
        level: "Beginner",
        emoji: "👋",
        lang: 'nl',
        category: 'Lesson',
        content: [
            { word: "Hallo", transliteration: "Hallo", meaning: "Hello", example: "Hallo, hoe gaat het?", audio: "audio/hallo_nl.mp3" },
            { word: "Dank je", transliteration: "Dank je", meaning: "Thank you", example: "Dank je wel.", audio: "audio/dankje_nl.mp3" },
            { word: "Goedenacht", transliteration: "Goedenacht", meaning: "Good night", example: "Goedenacht, tot morgen.", audio: "audio/goedenacht_nl.mp3" }
        ],
        quiz: [
            { question: "What does 'Dank je' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Dutch?", options: ["Goedenacht", "Hallo", "Dank je"], answer: "Hallo" }
        ]
    },
    {
        lesson_id: "da_01",
        language: "Danish",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Danish with a fun quiz.",
        level: "Beginner",
        emoji: "👋",
        lang: 'da',
        category: 'Lesson',
        content: [
            { word: "Hej", transliteration: "Hej", meaning: "Hello", example: "Hej, hvordan har du det?", audio: "audio/hej_da.mp3" },
            { word: "Tak", transliteration: "Tak", meaning: "Thank you", example: "Mange tak.", audio: "audio/tak_da.mp3" },
            { word: "Godnat", transliteration: "Godnat", meaning: "Good night", example: "Godnat, vi ses i morgen.", audio: "audio/godnat_da.mp3" }
        ],
        quiz: [
            { question: "What does 'Tak' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Danish?", options: ["Godnat", "Hej", "Tak"], answer: "Hej" }
        ]
    },
    {
        lesson_id: "pt_01",
        language: "Portuguese",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Portuguese with a fun quiz.",
        // Fix: Corrected typo in 'level' from 'Beginger' to 'Beginner'.
        level: "Beginner",
        emoji: "👋",
        lang: 'pt',
        category: 'Lesson',
        content: [
            { word: "Olá", transliteration: "Olá", meaning: "Hello", example: "Olá, como você está?", audio: "audio/ola_pt.mp3" },
            { word: "Obrigado/a", transliteration: "Obrigado/a", meaning: "Thank you", example: "Muito obrigado.", audio: "audio/obrigado_pt.mp3" },
            { word: "Boa noite", transliteration: "Boa noite", meaning: "Good night", example: "Boa noite, até amanhã.", audio: "audio/boanoite_pt.mp3" }
        ],
        quiz: [
            { question: "What does 'Obrigado/a' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Portuguese?", options: ["Boa noite", "Olá", "Obrigado/a"], answer: "Olá" }
        ]
    },
    {
        lesson_id: "fi_01",
        language: "Finnish",
        title: "Basic Greetings",
        description: "Learn your first few greetings in Finnish with a fun quiz.",
// Fix: Corrected typo in 'level' from 'Beginger' to 'Beginner'.
        level: "Beginner",
        emoji: "👋",
        lang: 'fi',
        category: 'Lesson',
        content: [
            { word: "Hei", transliteration: "Hei", meaning: "Hello", example: "Hei, mitä kuuluu?", audio: "audio/hei_fi.mp3" },
            { word: "Kiitos", transliteration: "Kiitos", meaning: "Thank you", example: "Paljon kiitoksia.", audio: "audio/kiitos_fi.mp3" },
            { word: "Hyvää yötä", transliteration: "Hyvää yötä", meaning: "Good night", example: "Hyvää yötä, nähdään huomenna.", audio: "audio/hyvaayota_fi.mp3" }
        ],
        quiz: [
            { question: "What does 'Kiitos' mean?", options: ["Hello", "Good night", "Thank you"], answer: "Thank you" },
            { question: "How do you say 'Hello' in Finnish?", options: ["Hyvää yötä", "Hei", "Kiitos"], answer: "Hei" }
        ]
    },
    // ============ INTERMEDIATE LESSONS (Level 02) ============
    {
        lesson_id: "en_02",
        language: "English",
        title: "Shopping & Asking Questions",
        description: "Learn useful phrases for shopping and asking basic questions.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'en',
        category: 'Lesson',
        content: [
            { word: "How much is this?", transliteration: "How much is this?", meaning: "Asking price", example: "Excuse me, how much is this shirt?", audio: "audio/howmuch_en.mp3" },
            { word: "Where is...?", transliteration: "Where is...?", meaning: "Asking location", example: "Where is the nearest train station?", audio: "audio/whereis_en.mp3" },
            { word: "I would like...", transliteration: "I would like...", meaning: "Making request", example: "I would like a cup of coffee, please.", audio: "audio/iwould_en.mp3" },
            { word: "Can you help me?", transliteration: "Can you help me?", meaning: "Asking for help", example: "Excuse me, can you help me find this address?", audio: "audio/canyou_en.mp3" }
        ],
        quiz: [
            { question: "How do you ask the price in English?", options: ["Where is...?", "How much is this?", "Can you help me?"], answer: "How much is this?" },
            { question: "What phrase is used to make a polite request?", options: ["I would like...", "Where is...?", "How much is this?"], answer: "I would like..." }
        ]
    },
    {
        lesson_id: "es_02",
        language: "Spanish",
        title: "Compras y Preguntas",
        description: "Aprende frases útiles para hacer compras y preguntas básicas.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'es',
        category: 'Lesson',
        content: [
            { word: "¿Cuánto cuesta?", transliteration: "Cuánto cuesta", meaning: "How much is it?", example: "Disculpe, ¿cuánto cuesta esta camisa?", audio: "audio/cuanto_es.mp3" },
            { word: "¿Dónde está...?", transliteration: "Dónde está", meaning: "Where is...?", example: "¿Dónde está la estación de tren más cercana?", audio: "audio/donde_es.mp3" },
            { word: "Quisiera...", transliteration: "Quisiera", meaning: "I would like...", example: "Quisiera una taza de café, por favor.", audio: "audio/quisiera_es.mp3" },
            { word: "¿Puede ayudarme?", transliteration: "Puede ayudarme", meaning: "Can you help me?", example: "Disculpe, ¿puede ayudarme a encontrar esta dirección?", audio: "audio/puede_es.mp3" }
        ],
        quiz: [
            { question: "¿Cómo preguntas el precio en español?", options: ["¿Dónde está...?", "¿Cuánto cuesta?", "¿Puede ayudarme?"], answer: "¿Cuánto cuesta?" },
            { question: "¿Qué frase usas para hacer una petición educada?", options: ["Quisiera...", "¿Dónde está...?", "¿Cuánto cuesta?"], answer: "Quisiera..." }
        ],
        cultureCapsule: {
            title: "Mercados y Regateo",
            icon: "🏪",
            content: "In many Spanish-speaking countries, local markets (*mercados*) are vibrant places where bargaining (*regateo*) is common and even expected. Start by offering 60-70% of the asking price and negotiate respectfully. It's part of the cultural experience!"
        }
    },
    {
        lesson_id: "fr_02",
        language: "French",
        title: "Faire des Courses",
        description: "Apprenez des phrases utiles pour faire vos courses et poser des questions.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'fr',
        category: 'Lesson',
        content: [
            { word: "Combien ça coûte?", transliteration: "Combien ça coûte", meaning: "How much is it?", example: "Excusez-moi, combien ça coûte cette chemise?", audio: "audio/combien_fr.mp3" },
            { word: "Où est...?", transliteration: "Où est", meaning: "Where is...?", example: "Où est la gare la plus proche?", audio: "audio/ou_fr.mp3" },
            { word: "Je voudrais...", transliteration: "Je voudrais", meaning: "I would like...", example: "Je voudrais une tasse de café, s'il vous plaît.", audio: "audio/voudrais_fr.mp3" },
            { word: "Pouvez-vous m'aider?", transliteration: "Pouvez-vous m'aider", meaning: "Can you help me?", example: "Excusez-moi, pouvez-vous m'aider à trouver cette adresse?", audio: "audio/pouvez_fr.mp3" }
        ],
        quiz: [
            { question: "Comment demandez-vous le prix en français?", options: ["Où est...?", "Combien ça coûte?", "Pouvez-vous m'aider?"], answer: "Combien ça coûte?" },
            { question: "Quelle phrase utilisez-vous pour faire une demande polie?", options: ["Je voudrais...", "Où est...?", "Combien ça coûte?"], answer: "Je voudrais..." }
        ],
        cultureCapsule: {
            title: "Les Marchés Français",
            icon: "🥖",
            content: "French markets (*les marchés*) are a cornerstone of daily life. Fresh produce, cheese, and bread are purchased from local vendors. Always greet the vendor with 'Bonjour' before asking for items—it's considered polite and essential!"
        }
    },
    {
        lesson_id: "de_02",
        language: "German",
        title: "Einkaufen und Fragen",
        description: "Lernen Sie nützliche Sätze zum Einkaufen und für grundlegende Fragen.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'de',
        category: 'Lesson',
        content: [
            { word: "Wie viel kostet das?", transliteration: "Wie viel kostet das", meaning: "How much is this?", example: "Entschuldigung, wie viel kostet dieses Hemd?", audio: "audio/wieviel_de.mp3" },
            { word: "Wo ist...?", transliteration: "Wo ist", meaning: "Where is...?", example: "Wo ist der nächste Bahnhof?", audio: "audio/wo_de.mp3" },
            { word: "Ich hätte gern...", transliteration: "Ich hätte gern", meaning: "I would like...", example: "Ich hätte gern eine Tasse Kaffee, bitte.", audio: "audio/haette_de.mp3" },
            { word: "Können Sie mir helfen?", transliteration: "Können Sie mir helfen", meaning: "Can you help me?", example: "Entschuldigung, können Sie mir helfen, diese Adresse zu finden?", audio: "audio/koennen_de.mp3" }
        ],
        quiz: [
            { question: "Wie fragt man nach dem Preis auf Deutsch?", options: ["Wo ist...?", "Wie viel kostet das?", "Können Sie mir helfen?"], answer: "Wie viel kostet das?" },
            { question: "Welche Phrase benutzt man für eine höfliche Bitte?", options: ["Ich hätte gern...", "Wo ist...?", "Wie viel kostet das?"], answer: "Ich hätte gern..." }
        ]
    },
    {
        lesson_id: "ja_02",
        language: "Japanese",
        title: "買い物と質問",
        description: "買い物や基本的な質問に役立つフレーズを学びましょう。",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'ja',
        category: 'Lesson',
        content: [
            { word: "これはいくらですか？", transliteration: "Kore wa ikura desu ka?", meaning: "How much is this?", example: "すみません、このシャツはいくらですか？", audio: "audio/ikura_ja.mp3" },
            { word: "...はどこですか？", transliteration: "...wa doko desu ka?", meaning: "Where is...?", example: "一番近い駅はどこですか？", audio: "audio/doko_ja.mp3" },
            { word: "...をください", transliteration: "...o kudasai", meaning: "Please give me...", example: "コーヒーを一つください。", audio: "audio/kudasai_ja.mp3" },
            { word: "助けていただけますか？", transliteration: "Tasukete itadakemasu ka?", meaning: "Can you help me?", example: "すみません、この住所を探すのを助けていただけますか？", audio: "audio/tasukete_ja.mp3" }
        ],
        quiz: [
            { question: "日本語で値段を聞く時、何と言いますか？", options: ["...はどこですか？", "これはいくらですか？", "助けていただけますか？"], answer: "これはいくらですか？" },
            { question: "丁寧に頼む時、どのフレーズを使いますか？", options: ["...をください", "...はどこですか？", "これはいくらですか？"], answer: "...をください" }
        ],
        cultureCapsule: {
            title: "コンビニ文化",
            icon: "🏪",
            content: "Convenience stores (*konbini*) like 7-Eleven, Lawson, and FamilyMart are everywhere in Japan and open 24/7. You can pay bills, buy concert tickets, get hot meals, and even mail packages—all with impeccable service!"
        }
    },
    {
        lesson_id: "hi_02",
        language: "Hindi",
        title: "खरीदारी और सवाल",
        description: "खरीदारी और बुनियादी सवालों के लिए उपयोगी वाक्यांश सीखें।",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'hi',
        category: 'Lesson',
        content: [
            { word: "यह कितने का है?", transliteration: "Yeh kitne ka hai?", meaning: "How much is this?", example: "माफ़ कीजिए, यह शर्ट कितने की है?", audio: "audio/kitne_hi.mp3" },
            { word: "...कहाँ है?", transliteration: "...kahaan hai?", meaning: "Where is...?", example: "सबसे नज़दीकी रेलवे स्टेशन कहाँ है?", audio: "audio/kahaan_hi.mp3" },
            { word: "मुझे...चाहिए", transliteration: "Mujhe...chaahiye", meaning: "I need/want...", example: "मुझे एक कप कॉफी चाहिए, कृपया।", audio: "audio/chaahiye_hi.mp3" },
            { word: "क्या आप मेरी मदद कर सकते हैं?", transliteration: "Kya aap meri madad kar sakte hain?", meaning: "Can you help me?", example: "माफ़ कीजिए, क्या आप इस पते को खोजने में मेरी मदद कर सकते हैं?", audio: "audio/madad_hi.mp3" }
        ],
        quiz: [
            { question: "हिंदी में कीमत पूछने के लिए आप क्या कहेंगे?", options: ["...कहाँ है?", "यह कितने का है?", "क्या आप मेरी मदद कर सकते हैं?"], answer: "यह कितने का है?" },
            { question: "विनम्र अनुरोध के लिए कौन सा वाक्यांश उपयोग करते हैं?", options: ["मुझे...चाहिए", "...कहाँ है?", "यह कितने का है?"], answer: "मुझे...चाहिए" }
        ]
    },
    {
        lesson_id: "ta_02",
        language: "Tamil",
        title: "கடையில் வாங்குதல்",
        description: "கடையில் வாங்குவதற்கும் அடிப்படை கேள்விகளுக்கும் பயனுள்ள வாக்கியங்களை கற்றுக்கொள்ளுங்கள்.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'ta',
        category: 'Lesson',
        content: [
            { word: "இது எவ்வளவு?", transliteration: "Idhu evvalavu?", meaning: "How much is this?", example: "மன்னிக்கவும், இந்த சட்டை எவ்வளவு?", audio: "audio/evvalavu_ta.mp3" },
            { word: "...எங்கே இருக்கிறது?", transliteration: "...enge irukkiraadhu?", meaning: "Where is...?", example: "மிக அருகில் உள்ள ரயில் நிலையம் எங்கே இருக்கிறது?", audio: "audio/enge_ta.mp3" },
            { word: "எனக்கு...வேண்டும்", transliteration: "Enakku...vendum", meaning: "I need/want...", example: "எனக்கு ஒரு காபி வேண்டும், தயவுசெய்து।", audio: "audio/vendum_ta.mp3" },
            { word: "நீங்கள் எனக்கு உதவ முடியுமா?", transliteration: "Neengal enakku udhava mudiyuma?", meaning: "Can you help me?", example: "மன்னிக்கவும், இந்த முகவரியைக் கண்டுபிடிக்க நீங்கள் எனக்கு உதவ முடியுமா?", audio: "audio/udhava_ta.mp3" }
        ],
        quiz: [
            { question: "தமிழில் விலையைக் கேட்பதற்கு என்ன சொல்வீர்கள்?", options: ["...எங்கே இருக்கிறது?", "இது எவ்வளவு?", "நீங்கள் எனக்கு உதவ முடியுமா?"], answer: "இது எவ்வளவு?" },
            { question: "மரியாதையான கோரிக்கைக்கு எந்த வாக்கியத்தைப் பயன்படுத்துவீர்கள்?", options: ["எனக்கு...வேண்டும்", "...எங்கே இருக்கிறது?", "இது எவ்வளவு?"], answer: "எனக்கு...வேண்டும்" }
        ]
    },
    {
        lesson_id: "kn_02",
        language: "Kannada",
        title: "ಶಾಪಿಂಗ್ ಮತ್ತು ಪ್ರಶ್ನೆಗಳು",
        description: "ಶಾಪಿಂಗ್ ಮತ್ತು ಮೂಲಭೂತ ಪ್ರಶ್ನೆಗಳಿಗೆ ಉಪಯುಕ್ತ ನುಡಿಗಟ್ಟುಗಳನ್ನು ಕಲಿಯಿರಿ.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'kn',
        category: 'Lesson',
        content: [
            { word: "ಇದು ಎಷ್ಟು?", transliteration: "Idhu eshtu?", meaning: "How much is this?", example: "ಕ್ಷಮಿಸಿ, ಈ ಶರ್ಟ್ ಎಷ್ಟು?", audio: "audio/eshtu_kn.mp3" },
            { word: "...ಎಲ್ಲಿದೆ?", transliteration: "...ellide?", meaning: "Where is...?", example: "ಹತ್ತಿರದ ರೈಲು ನಿಲ್ದಾಣ ಎಲ್ಲಿದೆ?", audio: "audio/ellide_kn.mp3" },
            { word: "ನನಗೆ...ಬೇಕು", transliteration: "Nanage...beku", meaning: "I need/want...", example: "ನನಗೆ ಒಂದು ಕಪ್ ಕಾಫಿ ಬೇಕು, ದಯವಿಟ್ಟು.", audio: "audio/beku_kn.mp3" },
            { word: "ನೀವು ನನಗೆ ಸಹಾಯ ಮಾಡಬಹುದೇ?", transliteration: "Neevu nanage sahaaya maadabahude?", meaning: "Can you help me?", example: "ಕ್ಷಮಿಸಿ, ಈ ವಿಳಾಸ ಹುಡುಕಲು ನೀವು ನನಗೆ ಸಹಾಯ ಮಾಡಬಹುದೇ?", audio: "audio/sahaaya_kn.mp3" }
        ],
        quiz: [
            { question: "ಕನ್ನಡದಲ್ಲಿ ಬೆಲೆಯನ್ನು ಕೇಳಲು ನೀವು ಏನು ಹೇಳುತ್ತೀರಿ?", options: ["...ಎಲ್ಲಿದೆ?", "ಇದು ಎಷ್ಟು?", "ನೀವು ನನಗೆ ಸಹಾಯ ಮಾಡಬಹುದೇ?"], answer: "ಇದು ಎಷ್ಟು?" },
            { question: "ವಿನಯಶೀಲ ವಿನಂತಿಗಾಗಿ ಯಾವ ನುಡಿಗಟ್ಟನ್ನು ಬಳಸುತ್ತೀರಿ?", options: ["ನನಗೆ...ಬೇಕು", "...ಎಲ್ಲಿದೆ?", "ಇದು ಎಷ್ಟು?"], answer: "ನನಗೆ...ಬೇಕು" }
        ]
    },
    {
        lesson_id: "te_02",
        language: "Telugu",
        title: "షాపింగ్ మరియు ప్రశ్నలు",
        description: "షాపింగ్ మరియు ప్రాథమిక ప్రశ్నలకు ఉపయోగకరమైన వాక్యాలు నేర్చుకోండి.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'te',
        category: 'Lesson',
        content: [
            { word: "ఇది ఎంత?", transliteration: "Idhi entha?", meaning: "How much is this?", example: "క్షమించండి, ఈ షర్ట్ ఎంత?", audio: "audio/entha_te.mp3" },
            { word: "...ఎక్కడ ఉంది?", transliteration: "...ekkada undi?", meaning: "Where is...?", example: "దగ్గరి రైలు స్టేషన్ ఎక్కడ ఉంది?", audio: "audio/ekkada_te.mp3" },
            { word: "నాకు...కావాలి", transliteration: "Naaku...kaavaali", meaning: "I need/want...", example: "నాకు ఒక కప్పు కాఫీ కావాలి, దయచేసి.", audio: "audio/kaavaali_te.mp3" },
            { word: "మీరు నాకు సహాయం చేయగలరా?", transliteration: "Meeru naaku sahaayam cheyagalara?", meaning: "Can you help me?", example: "క్షమించండి, ఈ చిరునామా కనుగొనడంలో మీరు నాకు సహాయం చేయగలరా?", audio: "audio/sahaayam_te.mp3" }
        ],
        quiz: [
            { question: "తెలుగులో ధరను అడగడానికి మీరు ఏమి చెబుతారు?", options: ["...ఎక్కడ ఉంది?", "ఇది ఎంత?", "మీరు నాకు సహాయం చేయగలరా?"], answer: "ఇది ఎంత?" },
            { question: "మర్యాదపూర్వక అభ్యర్థన కోసం ఏ వాక్యాన్ని ఉపయోగిస్తారు?", options: ["నాకు...కావాలి", "...ఎక్కడ ఉంది?", "ఇది ఎంత?"], answer: "నాకు...కావాలి" }
        ]
    },
    {
        lesson_id: "ml_02",
        language: "Malayalam",
        title: "ഷോപ്പിംഗും ചോദ്യങ്ങളും",
        description: "ഷോപ്പിംഗിനും അടിസ്ഥാന ചോദ്യങ്ങൾക്കും ഉപയോഗപ്രദമായ വാക്യങ്ങൾ പഠിക്കുക.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'ml',
        category: 'Lesson',
        content: [
            { word: "ഇതിന്റെ വില എത്രയാണ്?", transliteration: "Ithinte vila ethrayaanu?", meaning: "How much is this?", example: "ക്ഷമിക്കണം, ഈ ഷർട്ടിന്റെ വില എത്രയാണ്?", audio: "audio/ethrayaanu_ml.mp3" },
            { word: "...എവിടെയാണ്?", transliteration: "...evideyaanu?", meaning: "Where is...?", example: "ഏറ്റവും അടുത്തുള്ള റെയിൽവേ സ്റ്റേഷൻ എവിടെയാണ്?", audio: "audio/evideyaanu_ml.mp3" },
            { word: "എനിക്ക്...വേണം", transliteration: "Enikku...venam", meaning: "I need/want...", example: "എനിക്ക് ഒരു കപ്പ് കോഫി വേണം, ദയവായി.", audio: "audio/venam_ml.mp3" },
            { word: "നിങ്ങൾക്ക് എന്നെ സഹായിക്കാൻ കഴിയുമോ?", transliteration: "Ningalkku enne sahaayikkan kazhiyumo?", meaning: "Can you help me?", example: "ക്ഷമിക്കണം, ഈ വിലാസം കണ്ടെത്താൻ നിങ്ങൾക്ക് എന്നെ സഹായിക്കാൻ കഴിയുമോ?", audio: "audio/sahaayikkan_ml.mp3" }
        ],
        quiz: [
            { question: "മലയാളത്തിൽ വില ചോദിക്കാൻ നിങ്ങൾ എന്താണ് പറയുക?", options: ["...എവിടെയാണ്?", "ഇതിന്റെ വില എത്രയാണ്?", "നിങ്ങൾക്ക് എന്നെ സഹായിക്കാൻ കഴിയുമോ?"], answer: "ഇതിന്റെ വില എത്രയാണ്?" },
            { question: "മര്യാദയുള്ള അഭ്യർത്ഥനയ്ക്ക് ഏത് വാക്യമാണ് ഉപയോഗിക്കുന്നത്?", options: ["എനിക്ക്...വേണം", "...എവിടെയാണ്?", "ഇതിന്റെ വില എത്രയാണ്?"], answer: "എനിക്ക്...വേണം" }
        ]
    },
    {
        lesson_id: "mr_02",
        language: "Marathi",
        title: "खरेदी आणि प्रश्न",
        description: "खरेदी आणि मूलभूत प्रश्नांसाठी उपयुक्त वाक्ये शिका.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'mr',
        category: 'Lesson',
        content: [
            { word: "हे किती आहे?", transliteration: "He kiti aahe?", meaning: "How much is this?", example: "माफ करा, हा शर्ट किती आहे?", audio: "audio/kiti_mr.mp3" },
            { word: "...कुठे आहे?", transliteration: "...kuthe aahe?", meaning: "Where is...?", example: "सर्वात जवळचे रेल्वे स्टेशन कुठे आहे?", audio: "audio/kuthe_mr.mp3" },
            { word: "मला...हवे आहे", transliteration: "Mala...have aahe", meaning: "I need/want...", example: "मला एक कप कॉफी हवी आहे, कृपया.", audio: "audio/have_mr.mp3" },
            { word: "तुम्ही मला मदत करू शकता का?", transliteration: "Tumhi mala madad karu shakta ka?", meaning: "Can you help me?", example: "माफ करा, हा पत्ता शोधण्यासाठी तुम्ही मला मदत करू शकता का?", audio: "audio/madad_mr.mp3" }
        ],
        quiz: [
            { question: "मराठीमध्ये किंमत विचारण्यासाठी तुम्ही काय म्हणाल?", options: ["...कुठे आहे?", "हे किती आहे?", "तुम्ही मला मदत करू शकता का?"], answer: "हे किती आहे?" },
            { question: "नम्र विनंतीसाठी कोणते वाक्य वापरता?", options: ["मला...हवे आहे", "...कुठे आहे?", "हे किती आहे?"], answer: "मला...हवे आहे" }
        ]
    },
    {
        lesson_id: "or_02",
        language: "Odia",
        title: "କିଣାକାଟି ଏବଂ ପ୍ରଶ୍ନ",
        description: "କିଣାକାଟି ଏବଂ ମୌଳିକ ପ୍ରଶ୍ନ ପାଇଁ ଉପଯୋଗୀ ବାକ୍ୟାଂଶ ଶିଖନ୍ତୁ।",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'or',
        category: 'Lesson',
        content: [
            { word: "ଏହା କେତେ?", transliteration: "Eha kete?", meaning: "How much is this?", example: "କ୍ଷମା କରନ୍ତୁ, ଏହି ସାର୍ଟ କେତେ?", audio: "audio/kete_or.mp3" },
            { word: "...କେଉଁଠି ଅଛି?", transliteration: "...keunthi achhi?", meaning: "Where is...?", example: "ନିକଟତମ ରେଳ ଷ୍ଟେସନ କେଉଁଠି ଅଛି?", audio: "audio/keunthi_or.mp3" },
            { word: "ମୋତେ...ଦରକାର", transliteration: "Mote...darakar", meaning: "I need/want...", example: "ମୋତେ ଏକ କପ୍ କଫି ଦରକାର, ଦୟାକରି।", audio: "audio/darakar_or.mp3" },
            { word: "ଆପଣ ମୋତେ ସାହାଯ୍ୟ କରିପାରିବେ କି?", transliteration: "Aapana mote sahajya karipaaribe ki?", meaning: "Can you help me?", example: "କ୍ଷମା କରନ୍ତୁ, ଏହି ଠିକଣା ଖୋଜିବାରେ ଆପଣ ମୋତେ ସାହାଯ୍ୟ କରିପାରିବେ କି?", audio: "audio/sahajya_or.mp3" }
        ],
        quiz: [
            { question: "ଓଡିଆରେ ମୂଲ୍ୟ ପଚାରିବାକୁ ଆପଣ କ'ଣ କହିବେ?", options: ["...କେଉଁଠି ଅଛି?", "ଏହା କେତେ?", "ଆପଣ ମୋତେ ସାହାଯ୍ୟ କରିପାରିବେ କି?"], answer: "ଏହା କେତେ?" },
            { question: "ନମ୍ର ଅନୁରୋଧ ପାଇଁ କେଉଁ ବାକ୍ୟାଂଶ ବ୍ୟବହାର କରାଯାଏ?", options: ["ମୋତେ...ଦରକାର", "...କେଉଁଠି ଅଛି?", "ଏହା କେତେ?"], answer: "ମୋତେ...ଦରକାର" }
        ]
    },
    {
        lesson_id: "gu_02",
        language: "Gujarati",
        title: "ખરીદી અને પ્રશ્નો",
        description: "ખરીદી અને મૂળભૂત પ્રશ્નો માટે ઉપયોગી વાક્યો શીખો.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'gu',
        category: 'Lesson',
        content: [
            { word: "આ કેટલાનું છે?", transliteration: "Aa ketlanu chhe?", meaning: "How much is this?", example: "માફ કરશો, આ શર્ટ કેટલાનું છે?", audio: "audio/ketlanu_gu.mp3" },
            { word: "...ક્યાં છે?", transliteration: "...kyaan chhe?", meaning: "Where is...?", example: "સૌથી નજીકનું રેલ્વે સ્ટેશન ક્યાં છે?", audio: "audio/kyaan_gu.mp3" },
            { word: "મને...જોઈએ છે", transliteration: "Mane...joie chhe", meaning: "I need/want...", example: "મને એક કપ કોફી જોઈએ છે, કૃપા કરીને.", audio: "audio/joie_gu.mp3" },
            { word: "શું તમે મારી મદદ કરી શકશો?", transliteration: "Shu tame mari madad kari shakasho?", meaning: "Can you help me?", example: "માફ કરશો, આ સરનામું શોધવામાં શું તમે મારી મદદ કરી શકશો?", audio: "audio/madad_gu.mp3" }
        ],
        quiz: [
            { question: "ગુજરાતીમાં કિંમત પૂછવા તમે શું કહો?", options: ["...ક્યાં છે?", "આ કેટલાનું છે?", "શું તમે મારી મદદ કરી શકશો?"], answer: "આ કેટલાનું છે?" },
            { question: "નમ્ર વિનંતી માટે કયું વાક્ય વાપરો?", options: ["મને...જોઈએ છે", "...ક્યાં છે?", "આ કેટલાનું છે?"], answer: "મને...જોઈએ છે" }
        ]
    },
    {
        lesson_id: "bn_02",
        language: "Bengali",
        title: "কেনাকাটা এবং প্রশ্ন",
        description: "কেনাকাটা এবং মৌলিক প্রশ্নের জন্য দরকারী বাক্যাংশ শিখুন।",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'bn',
        category: 'Lesson',
        content: [
            { word: "এটি কত?", transliteration: "Eti koto?", meaning: "How much is this?", example: "মাফ করবেন, এই শার্টটি কত?", audio: "audio/koto_bn.mp3" },
            { word: "...কোথায়?", transliteration: "...kothay?", meaning: "Where is...?", example: "সবচেয়ে কাছের রেলওয়ে স্টেশন কোথায়?", audio: "audio/kothay_bn.mp3" },
            { word: "আমার...দরকার", transliteration: "Amar...dorkar", meaning: "I need/want...", example: "আমার এক কাপ কফি দরকার, অনুগ্রহ করে।", audio: "audio/dorkar_bn.mp3" },
            { word: "আপনি কি আমায় সাহায্য করতে পারেন?", transliteration: "Apni ki amay sahajjo korte paren?", meaning: "Can you help me?", example: "মাফ করবেন, এই ঠিকানা খুঁজতে আপনি কি আমায় সাহায্য করতে পারেন?", audio: "audio/sahajjo_bn.mp3" }
        ],
        quiz: [
            { question: "বাংলায় দাম জিজ্ঞাসা করতে আপনি কী বলবেন?", options: ["...কোথায়?", "এটি কত?", "আপনি কি আমায় সাহায্য করতে পারেন?"], answer: "এটি কত?" },
            { question: "ভদ্র অনুরোধের জন্য কোন বাক্যাংশ ব্যবহার করা হয়?", options: ["আমার...দরকার", "...কোথায়?", "এটি কত?"], answer: "আমার...দরকার" }
        ]
    },
    {
        lesson_id: "it_02",
        language: "Italian",
        title: "Fare la Spesa",
        description: "Impara frasi utili per fare la spesa e porre domande di base.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'it',
        category: 'Lesson',
        content: [
            { word: "Quanto costa?", transliteration: "Quanto costa", meaning: "How much is it?", example: "Scusi, quanto costa questa camicia?", audio: "audio/quanto_it.mp3" },
            { word: "Dov'è...?", transliteration: "Dov'è", meaning: "Where is...?", example: "Dov'è la stazione ferroviaria più vicina?", audio: "audio/dove_it.mp3" },
            { word: "Vorrei...", transliteration: "Vorrei", meaning: "I would like...", example: "Vorrei una tazza di caffè, per favore.", audio: "audio/vorrei_it.mp3" },
            { word: "Può aiutarmi?", transliteration: "Può aiutarmi", meaning: "Can you help me?", example: "Scusi, può aiutarmi a trovare questo indirizzo?", audio: "audio/aiutarmi_it.mp3" }
        ],
        quiz: [
            { question: "Come si chiede il prezzo in italiano?", options: ["Dov'è...?", "Quanto costa?", "Può aiutarmi?"], answer: "Quanto costa?" },
            { question: "Quale frase si usa per fare una richiesta educata?", options: ["Vorrei...", "Dov'è...?", "Quanto costa?"], answer: "Vorrei..." }
        ],
        cultureCapsule: {
            title: "Il Mercato",
            icon: "🍅",
            content: "Italian markets (*mercati*) are lively and colorful. Vendors take pride in their fresh produce, cheese, and meat. It's customary to greet the vendor and let them choose the best items for you—touching produce yourself is often frowned upon!"
        }
    },
    {
        lesson_id: "nl_02",
        language: "Dutch",
        title: "Winkelen en Vragen",
        description: "Leer nuttige zinnen voor het winkelen en basis vragen stellen.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'nl',
        category: 'Lesson',
        content: [
            { word: "Hoeveel kost dit?", transliteration: "Hoeveel kost dit", meaning: "How much is this?", example: "Pardon, hoeveel kost dit shirt?", audio: "audio/hoeveel_nl.mp3" },
            { word: "Waar is...?", transliteration: "Waar is", meaning: "Where is...?", example: "Waar is het dichtstbijzijnde treinstation?", audio: "audio/waar_nl.mp3" },
            { word: "Ik wil graag...", transliteration: "Ik wil graag", meaning: "I would like...", example: "Ik wil graag een kopje koffie, alstublieft.", audio: "audio/graag_nl.mp3" },
            { word: "Kunt u mij helpen?", transliteration: "Kunt u mij helpen", meaning: "Can you help me?", example: "Pardon, kunt u mij helpen dit adres te vinden?", audio: "audio/helpen_nl.mp3" }
        ],
        quiz: [
            { question: "Hoe vraag je de prijs in het Nederlands?", options: ["Waar is...?", "Hoeveel kost dit?", "Kunt u mij helpen?"], answer: "Hoeveel kost dit?" },
            { question: "Welke zin gebruik je voor een beleefde vraag?", options: ["Ik wil graag...", "Waar is...?", "Hoeveel kost dit?"], answer: "Ik wil graag..." }
        ]
    },
    {
        lesson_id: "da_02",
        language: "Danish",
        title: "Shopping og Spørgsmål",
        description: "Lær nyttige sætninger til indkøb og grundlæggende spørgsmål.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'da',
        category: 'Lesson',
        content: [
            { word: "Hvor meget koster det?", transliteration: "Hvor meget koster det", meaning: "How much is this?", example: "Undskyld, hvor meget koster denne skjorte?", audio: "audio/hvormegett_da.mp3" },
            { word: "Hvor er...?", transliteration: "Hvor er", meaning: "Where is...?", example: "Hvor er den nærmeste togstation?", audio: "audio/hvorer_da.mp3" },
            { word: "Jeg vil gerne have...", transliteration: "Jeg vil gerne have", meaning: "I would like...", example: "Jeg vil gerne have en kop kaffe, tak.", audio: "audio/gerne_da.mp3" },
            { word: "Kan du hjælpe mig?", transliteration: "Kan du hjælpe mig", meaning: "Can you help me?", example: "Undskyld, kan du hjælpe mig med at finde denne adresse?", audio: "audio/hjaelpe_da.mp3" }
        ],
        quiz: [
            { question: "Hvordan spørger man om prisen på dansk?", options: ["Hvor er...?", "Hvor meget koster det?", "Kan du hjælpe mig?"], answer: "Hvor meget koster det?" },
            { question: "Hvilken sætning bruger man til en høflig anmodning?", options: ["Jeg vil gerne have...", "Hvor er...?", "Hvor meget koster det?"], answer: "Jeg vil gerne have..." }
        ]
    },
    {
        lesson_id: "pt_02",
        language: "Portuguese",
        title: "Compras e Perguntas",
        description: "Aprenda frases úteis para fazer compras e perguntas básicas.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'pt',
        category: 'Lesson',
        content: [
            { word: "Quanto custa?", transliteration: "Quanto custa", meaning: "How much is it?", example: "Com licença, quanto custa esta camisa?", audio: "audio/quanto_pt.mp3" },
            { word: "Onde fica...?", transliteration: "Onde fica", meaning: "Where is...?", example: "Onde fica a estação de trem mais próxima?", audio: "audio/onde_pt.mp3" },
            { word: "Eu gostaria de...", transliteration: "Eu gostaria de", meaning: "I would like...", example: "Eu gostaria de uma xícara de café, por favor.", audio: "audio/gostaria_pt.mp3" },
            { word: "Você pode me ajudar?", transliteration: "Você pode me ajudar", meaning: "Can you help me?", example: "Com licença, você pode me ajudar a encontrar este endereço?", audio: "audio/ajudar_pt.mp3" }
        ],
        quiz: [
            { question: "Como você pergunta o preço em português?", options: ["Onde fica...?", "Quanto custa?", "Você pode me ajudar?"], answer: "Quanto custa?" },
            { question: "Qual frase você usa para fazer um pedido educado?", options: ["Eu gostaria de...", "Onde fica...?", "Quanto custa?"], answer: "Eu gostaria de..." }
        ]
    },
    {
        lesson_id: "fi_02",
        language: "Finnish",
        title: "Ostokset ja Kysymykset",
        description: "Opi hyödyllisiä lauseita ostoksille ja peruskysymyksille.",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'fi',
        category: 'Lesson',
        content: [
            { word: "Paljonko tämä maksaa?", transliteration: "Paljonko tämä maksaa", meaning: "How much is this?", example: "Anteeksi, paljonko tämä paita maksaa?", audio: "audio/paljonko_fi.mp3" },
            { word: "Missä on...?", transliteration: "Missä on", meaning: "Where is...?", example: "Missä on lähin rautatieasema?", audio: "audio/missa_fi.mp3" },
            { word: "Haluaisin...", transliteration: "Haluaisin", meaning: "I would like...", example: "Haluaisin kupillisen kahvia, kiitos.", audio: "audio/haluaisin_fi.mp3" },
            { word: "Voitko auttaa minua?", transliteration: "Voitko auttaa minua", meaning: "Can you help me?", example: "Anteeksi, voitko auttaa minua löytämään tämän osoitteen?", audio: "audio/auttaa_fi.mp3" }
        ],
        quiz: [
            { question: "Miten kysyt hintaa suomeksi?", options: ["Missä on...?", "Paljonko tämä maksaa?", "Voitko auttaa minua?"], answer: "Paljonko tämä maksaa?" },
            { question: "Mitä lausetta käytät kohteliaaseen pyyntöön?", options: ["Haluaisin...", "Missä on...?", "Paljonko tämä maksaa?"], answer: "Haluaisin..." }
        ]
    },
    {
        lesson_id: "sa_02",
        language: "Sanskrit",
        title: "व्यवहारिक संवाद",
        description: "दैनिक संवाद के लिए उपयोगी वाक्यांश सीखें।",
        level: "Intermediate",
        emoji: "🛍️",
        lang: 'sa',
        category: 'Lesson',
        content: [
            { word: "एतस्य मूल्यं किम्?", transliteration: "Etasya moolyam kim?", meaning: "What is its price?", example: "क्षम्यताम्, एतस्य वस्त्रस्य मूल्यं किम्?", audio: "audio/moolyam_sa.mp3" },
            { word: "...कुत्र अस्ति?", transliteration: "...kutra asti?", meaning: "Where is...?", example: "रेलमार्गस्थानकं कुत्र अस्ति?", audio: "audio/kutra_sa.mp3" },
            { word: "मह्यं...आवश्यकम्", transliteration: "Mahyam...aavashyakam", meaning: "I need...", example: "मह्यं एकं कॉफी पात्रं आवश्यकम्।", audio: "audio/aavashyakam_sa.mp3" },
            { word: "भवान् मां साहाय्यं कर्तुं शक्नोति किम्?", transliteration: "Bhavaan maam sahayyam kartum shaknoti kim?", meaning: "Can you help me?", example: "क्षम्यताम्, एतत् पत्रं अन्वेष्टुं भवान् मां साहाय्यं कर्तुं शक्नोति किम्?", audio: "audio/sahayyam_sa.mp3" }
        ],
        quiz: [
            { question: "संस्कृत में मूल्य पूछने के लिए आप क्या कहेंगे?", options: ["...कुत्र अस्ति?", "एतस्य मूल्यं किम्?", "भवान् मां साहाय्यं कर्तुं शक्नोति किम्?"], answer: "एतस्य मूल्यं किम्?" },
            { question: "विनम्र अनुरोध के लिए कौन सा वाक्यांश उपयोग करते हैं?", options: ["मह्यं...आवश्यकम्", "...कुत्र अस्ति?", "एतस्य मूल्यं किम्?"], answer: "मह्यं...आवश्यकम्" }
        ]
    }
];


export const SCENARIOS: Scenario[] = [
  {
    id: 'cafe-fr',
    title: 'Ordering Coffee in Paris',
    description: 'Practice your French by ordering drinks and pastries at a Parisian café.',
    emoji: '☕',
    lang: 'fr',
    category: 'Conversation',
    systemPrompt: "You are a friendly Parisian barista. The user is a customer trying to order in French. Be patient, help them if they struggle, and respond naturally in French. Keep your responses brief and conversational."
  },
  {
    id: 'greetings-fr',
    title: 'French Greetings 101',
    description: 'Learn essential French greetings and farewells for everyday conversations.',
    emoji: '👋',
    lang: 'fr',
    category: 'Conversation',
    systemPrompt: `You are a friendly and encouraging French tutor named Chloé. Your goal is to teach the user basic French greetings.

First, greet the user warmly in French and English. Then, present the following lesson clearly using markdown.

**Lesson: Common French Greetings**

Here are a few essential words to get you started:

*   **Bonjour** - Hello (formal, used during the day)
    *   *Example:* Bonjour, madame ! (Hello, madam!)
*   **Bonsoir** - Good evening
    *   *Example:* Bonsoir, monsieur. (Good evening, sir.)
*   **Salut** - Hi (informal, used with friends)
    *   *Example:* Salut, Marie ! (Hi, Marie!)
*   **Au revoir** - Goodbye
    *   *Example:* Au revoir, à demain ! (Goodbye, see you tomorrow!)
*   **Merci** - Thank you
    *   *Example:* Merci beaucoup ! (Thank you very much!)

After presenting the list, ask the user the following mini-quiz question and wait for their response:

**Mini-Quiz!**
What would you say to a friend you meet in the afternoon?
A) Bonjour
B) Salut
C) Bonsoir

Provide feedback on their answer.`
  },
  {
    id: 'directions-ja',
    title: 'Asking for Directions in Tokyo',
    description: 'Navigate the bustling streets of Tokyo by asking for directions in Japanese.',
    emoji: '🗺️',
    lang: 'ja',
    category: 'Conversation',
    systemPrompt: "You are a helpful local in Tokyo. The user is a lost tourist asking for directions in Japanese. Provide simple, clear directions and be encouraging. Respond in Japanese."
  },
  {
    id: 'restaurant-ja',
    title: 'Ordering Food in Tokyo',
    description: 'Practice ordering food and drinks at a restaurant in Tokyo.',
    emoji: '🍜',
    lang: 'ja',
    category: 'Conversation',
    systemPrompt: "You are a friendly and patient waiter at a casual restaurant in Tokyo. The user is a customer who wants to order food. Greet them in Japanese, ask for their order, and respond naturally. If they seem to struggle, you can offer suggestions like 'ラーメンはいかがですか？' (Ramen wa ikaga desu ka? - How about some ramen?). Keep your Japanese simple and clear for a learner. Start by welcoming the customer and asking if they are ready to order."
  },
  {
    id: 'market-es',
    title: 'At the Market in Madrid',
    description: 'Haggle for prices and buy groceries at a vibrant Spanish market.',
    emoji: '🍎',
    lang: 'es',
    category: 'Conversation',
    systemPrompt: "You are a vendor at a market in Madrid. The user wants to buy some fruit. Interact with them in Spanish, be lively, and maybe try to upsell them on your best produce."
  },
  {
    id: 'interview-de',
    title: 'Job Interview in Berlin',
    description: 'Practice for a professional job interview with a German tech company.',
    emoji: '💼',
    lang: 'de',
    category: 'Career Focus',
    systemPrompt: "You are a hiring manager at a tech startup in Berlin conducting a job interview in German. Ask the user common interview questions about their skills and experience. Maintain a professional but friendly tone."
  },
  {
    id: 'chat-de',
    title: 'German Chat: Lukas & Anna',
    description: 'Follow a simple conversation between two friends and practice your German.',
    emoji: '🍻',
    lang: 'de',
    category: 'Conversation',
    systemPrompt: `You are a German language coach. Your task is to present a simple conversation script and then invite the user to practice.

First, present this conversation script clearly:

**Conversation: Ein Tag in Berlin**

**(1. Greetings)**
**Lukas:** Hallo Anna! Wie geht's? (Hello Anna! How's it going?)
**Anna:** Hallo Lukas! Gut, danke. Und dir? (Hello Lukas! Good, thanks. And you?)

**(2. Ordering Food)**
**Lukas:** Ich habe Hunger. Ich bestelle eine Currywurst. (I'm hungry. I'm ordering a currywurst.)
**Anna:** Gute Idee! Ich nehme ein Schnitzel. (Good idea! I'll have a schnitzel.)

**(3. Travel Plans)**
**Lukas:** Fährst du morgen nach Hamburg? (Are you going to Hamburg tomorrow?)
**Anna:** Ja, ich fahre mit dem Zug. (Yes, I'm going by train.)

After presenting the script, invite the user to practice by taking on the role of Anna. Start the conversation by saying:

"Super! Now, let's practice. You are Anna. I'll start as Lukas."

Then, as Lukas, say the first line and wait for the user's response: "Hallo, ich bin Lukas. Wie geht's?"`
  },
  {
    id: 'restaurant-en',
    title: 'Dinner Reservation',
    description: 'Call a restaurant to book a table for a special occasion.',
    emoji: '🍽️',
    lang: 'en',
    category: 'Conversation',
    systemPrompt: "You are a host at a popular restaurant. The user is calling to make a dinner reservation. Guide them through the process, asking for the date, time, and number of guests. Be polite and helpful."
  },
  {
    id: 'market-hi',
    title: 'A Market in Delhi',
    description: 'Experience a bustling Delhi market. Practice bargaining and learn about local spices in Hindi.',
    emoji: '🌶️',
    lang: 'hi',
    category: 'Cultural Immersion',
    systemPrompt: "You are a friendly shopkeeper in a bustling Delhi market. The user is a visitor wanting to buy spices and learn about local culture. Interact with them in conversational Hindi (Hinglish is okay). Teach them how to bargain politely, explain the uses of different masalas (spices), and share a cultural tip about Indian hospitality. Be warm, a bit cheeky, and encouraging."
  },
  {
    id: 'wedding-ta',
    title: 'A Tamil Wedding',
    description: 'You are invited to a wedding in Chennai! Learn how to greet elders and what to say during the ceremony.',
    emoji: '💒',
    lang: 'ta',
    category: 'Cultural Immersion',
    systemPrompt: "You are a close family friend at a traditional Tamil wedding in Chennai. The user is a guest who is new to the culture. Your role is to be their guide. Greet them with 'Vaanga, vaanga!' (Welcome, welcome!). Gently teach them how to greet elders by saying 'Vanakkam'. Explain the significance of the 'thaali' (mangalsutra). Suggest a polite compliment to say to the couple, like 'Jodi porutham romba nalla irukku' (You make a great couple). Respond in simple Tamil and provide English translations for key phrases."
  },
  {
    id: 'temple-kn',
    title: 'Temple Etiquette in Bangalore',
    description: 'Learn the dos and don\'ts of visiting a Hindu temple in Karnataka.',
    emoji: '🙏',
    lang: 'kn',
    category: 'Cultural Immersion',
    systemPrompt: "You are a local guide at a temple in Bangalore. The user is a tourist visiting for the first time. Your goal is to teach them temple etiquette in a friendly manner. Start by telling them in Kannada to remove their shoes ('Chappali bicchi idabeku'). Explain the concept of 'pradakshina' (circumambulating the shrine). Teach them a simple phrase to receive 'prasada' (blessed food offering), like 'Prasada kodi'. Be respectful and informative. Use simple Kannada with English explanations."
  },
  {
    id: 'vocab-sa',
    title: 'First Words in Sanskrit',
    description: 'Learn 20 essential Sanskrit words to begin your journey.',
    emoji: '🕉️',
    lang: 'sa',
    category: 'Conversation',
    systemPrompt: `You are a Sanskrit Guru. The user is a new student. Greet them warmly in English and Sanskrit (e.g., 'Namaste!'). Your first task is to present a list of 20 foundational Sanskrit words with their English translations and a simple example sentence for each. Format this list clearly using markdown. After presenting the list, encourage the user to try using one of the words.

Here is the list to provide:
- **नमस्ते (Namaste)** - Hello/Greetings - *नमस्ते, मित्र!* (Hello, friend!)
- **धन्यवादः (Dhanyavādah)** - Thank you - *साहाय्यार्थं धन्यवादः।* (Thank you for the help.)
- **जलम् (Jalam)** - Water - *कृपया मह्यं जलं దदातु।* (Please give me water.)
- **सूर्यः (Sūryah)** - Sun - *सूर्यः आकाशे प्रकाशते।* (The sun shines in the sky.)
- **चन्द्रः (Chandrah)** - Moon - *रात्रौ चन्द्रः दृश्यते।* (The moon is seen at night.)
- **अग्निः (Agnih)** - Fire - *अग्निः उष्णः अस्ति।* (Fire is hot.)
- **पुस्तकम् (Pustakam)** - Book - *अहं पुस्तकं पठामi।* (I am reading a book.)
- **गृहम् (Gr̥ham)** - House - *मम गृहं सुन्दरम् अस्ति।* (My house is beautiful.)
- **मित्रम् (Mitram)** - Friend - *सः मम मित्रम् अस्ति।* (He is my friend.)
- **गुरुः (Guruh)** - Teacher - *गुरुः ज्ञानं దదాతి।* (The teacher gives knowledge.)
- **फलम् (Phalam)** - Fruit - *अहं फलं खादामि।* (I eat fruit.)
- **वृक्षः (Vr̥kṣaḥ)** - Tree - *उद्याने एकः वृक्षः अस्ति।* (There is a tree in the garden.)
- **पुष्पम् (Puṣpam)** - Flower - *पुष्पं सुగन्धितम् अस्ति।* (The flower is fragrant.)
- **योगः (Yogaḥ)** - Yoga/Union - *योगः मनः शान्तं करोति।* (Yoga calms the mind.)
- **शान्तिः (Śāntiḥ)** - Peace - *सर्वत्र शान्तिः भवतु।* (Let there be peace everywhere.)
- **प्रेम (Prema)** - Love - *प्रेम सर्वत्र विजयते।* (Love conquers all.)
- **सत्यम् (Satyam)** - Truth - *सत्यं वद।* (Speak the truth.)
- **धर्मः (Dharmaḥ)** - Duty/Righteousness - *स्वधर्मं पालय।* (Follow your duty.)
- **कर्म (Karma)** - Action/Deed - *कर्मफलं निश्चितम्।* (The result of an action is certain.)
- **मोक्षः (Mokṣaḥ)** - Liberation/Freedom - *मोक्षः जीवनस्य परमं लक्ष्यम्।* (Liberation is the ultimate goal of life.)`
  },
  {
    id: 'keigo-meeting-ja',
    title: 'Business Meeting with a Client',
    description: 'Navigate a formal business meeting and practice using Sonkeigo (respectful) and Kenjōgo (humble) language.',
    emoji: '🤝',
    lang: 'ja',
    category: 'Keigo Mastery',
    systemPrompt: "You are a Japanese client, Suzuki-sama, in a formal business meeting. The user is your business partner. Your goal is to guide them in using appropriate Keigo (敬語). Respond in formal Japanese. When the user makes a mistake in Keigo, gently correct them and explain the rule. For example, if they say '食べますか？' (tabemasu ka?), suggest '召し上がりますか？' (meshiagarimasu ka?) and briefly explain it's the respectful form (Sonkeigo). If they correctly use Keigo, praise them. Start the conversation by saying: '本日はお時間をいただき、ありがとうございます。よろしくお願いいたします。' (Honjitsu wa o-jikan o itadaki, arigatō gozaimasu. Yoroshiku onegai itashimasu.)"
  },
  {
    id: 'keigo-boss-ja',
    title: 'Reporting to Your Manager',
    description: 'Practice speaking to a superior by giving a progress report to your department head.',
    emoji: '📈',
    lang: 'ja',
    category: 'Keigo Mastery',
    systemPrompt: "You are a department manager in a Japanese company. The user is your subordinate reporting to you. Your tone should be professional but approachable. You must guide the user to use Kenjōgo (humble language) when talking about their own actions and Sonkeigo (respectful language) when talking about yours. For example, if they say '私が行きました' (watashi ga ikimashita), correct them to '私が参りました' (watashi ga mairimashita). Explain why. Start the conversation by asking: '佐藤くん、例の件、進捗を報告してくれるかな？' (Satō-kun, rei no ken, shinchoku o hōkoku shite kureru ka na?)"
  },
  {
    id: 'keigo-store-ja',
    title: 'At a Luxury Department Store',
    description: 'Interact with a highly polite store clerk and practice understanding and using Teineigo (polite language).',
    emoji: '🛍️',
    lang: 'ja',
    category: 'Keigo Mastery',
    systemPrompt: "You are a very polite and helpful clerk at a high-end department store in Ginza. The user is a customer. You must use high-level Teineigo and Keigo consistently. For example, use 'でございます' (de gozaimasu) instead of 'です' (desu). Address the user as 'お客様' (okyakusama). Your goal is to help the user while exposing them to natural, polite customer service Japanese. If the user's Japanese is polite, respond positively. If it's too casual, gently guide them. Start by greeting the user with 'いらっしゃいませ。何かお探しでございますか？' (Irasshaimase. Nani ka o-sagashi de gozaimasu ka?)"
  },
  {
    id: 'restaurant-bn',
    title: 'ডিনার রিজার্ভেশন',
    description: 'একটি বিশেষ অনুষ্ঠানের জন্য একটি টেবিল বুক করার জন্য একটি রেস্টুরেন্টে কল করুন।',
    emoji: '🍽️',
    lang: 'bn',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Kolkata. The user is calling to make a dinner reservation in Bengali. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Bengali. Be polite and helpful."
  },
  {
    id: 'restaurant-da',
    title: 'Bordreservation til middag',
    description: 'Ring til en restaurant for at bestille bord til en særlig lejlighed.',
    emoji: '🍽️',
    lang: 'da',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Copenhagen. The user is calling to make a dinner reservation in Danish. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Danish. Be polite and helpful."
  },
  {
    id: 'restaurant-de',
    title: 'Essen bestellen in Berlin',
    description: 'Übe, wie man in einem Restaurant in Berlin Essen und Getränke bestellt.',
    emoji: '🥨',
    lang: 'de',
    category: 'Conversation',
    systemPrompt: "You are a friendly and patient waiter at a traditional German restaurant in Berlin. The user is a customer who wants to order food. Greet them in German, ask for their order, and respond naturally. If they seem to struggle, you can offer suggestions like 'Möchten Sie ein Schnitzel probieren?' (Would you like to try a Schnitzel?). Keep your German simple and clear for a learner. Respond ONLY in German. Start by welcoming the customer."
  },
  {
    id: 'restaurant-es',
    title: 'Reservar una mesa en Barcelona',
    description: 'Practica cómo pedir comida y bebida en un restaurante en Barcelona.',
    emoji: '🥘',
    lang: 'es',
    category: 'Conversation',
    systemPrompt: "You are a friendly and patient waiter at a tapas restaurant in Barcelona. The user is a customer who wants to order food. Greet them in Spanish, ask for their order, and respond naturally. If they seem to struggle, you can offer suggestions like '¿Le gustaría probar nuestras patatas bravas?' (Would you like to try our patatas bravas?). Keep your Spanish simple and clear for a learner. Respond ONLY in Spanish. Start by welcoming the customer."
  },
  {
    id: 'restaurant-fi',
    title: 'Pöytävaraus illalliselle',
    description: 'Soita ravintolaan ja varaa pöytä erityistä tilaisuutta varten.',
    emoji: '🍽️',
    lang: 'fi',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Helsinki. The user is calling to make a dinner reservation in Finnish. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Finnish. Be polite and helpful."
  },
  {
    id: 'restaurant-fr',
    title: 'Dîner dans un bistro',
    description: 'Appelez un bistro pour réserver une table pour une occasion spéciale.',
    emoji: '🍷',
    lang: 'fr',
    category: 'Conversation',
    systemPrompt: "You are a host at a cozy bistro in Lyon. The user is calling to make a dinner reservation in French. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in French. Be polite and helpful."
  },
  {
    id: 'restaurant-gu',
    title: 'ડિનર આરક્ષણ',
    description: 'ખાસ પ્રસંગ માટે ટેબલ બુક કરવા માટે રેસ્ટોરન્ટને કૉલ કરો.',
    emoji: '🍽️',
    lang: 'gu',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Ahmedabad. The user is calling to make a dinner reservation in Gujarati. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Gujarati. Be polite and helpful."
  },
  {
    id: 'restaurant-hi',
    title: 'डिनर आरक्षण',
    description: 'एक विशेष अवसर के लिए एक टेबल बुक करने के लिए एक रेस्तरां को कॉल करें।',
    emoji: '🍽️',
    lang: 'hi',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Delhi. The user is calling to make a dinner reservation in Hindi. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Hindi. Be polite and helpful."
  },
  {
    id: 'restaurant-it',
    title: 'Prenotazione per la cena',
    description: 'Chiama un ristorante per prenotare un tavolo per un\'occasione speciale.',
    emoji: '🍽️',
    lang: 'it',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Rome. The user is calling to make a dinner reservation in Italian. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Italian. Be polite and helpful."
  },
  {
    id: 'restaurant-kn',
    title: 'ಊಟದ ಕಾಯ್ದಿರಿಸುವಿಕೆ',
    description: 'ವಿಶೇಷ ಸಂದರ್ಭಕ್ಕಾಗಿ ಟೇಬಲ್ ಕಾಯ್ದಿರಿಸಲು ರೆಸ್ಟೋರೆಂಟ್‌ಗೆ ಕರೆ ಮಾಡಿ.',
    emoji: '🍽️',
    lang: 'kn',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Bangalore. The user is calling to make a dinner reservation in Kannada. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Kannada. Be polite and helpful."
  },
  {
    id: 'restaurant-ml',
    title: 'അത്താഴത്തിനുള്ള റിസർവേഷൻ',
    description: 'ഒരു പ്രത്യേക അവസരത്തിനായി ഒരു മേശ ബുക്ക് ചെയ്യാൻ ഒരു റെസ്റ്റോറന്റിലേക്ക് വിളിക്കുക.',
    emoji: '🍽️',
    lang: 'ml',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Kochi. The user is calling to make a dinner reservation in Malayalam. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Malayalam. Be polite and helpful."
  },
  {
    id: 'restaurant-mr',
    title: 'डिनर आरक्षण',
    description: 'एका विशेष प्रसंगासाठी टेबल बुक करण्यासाठी रेस्टॉरंटला कॉल करा.',
    emoji: '🍽️',
    lang: 'mr',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Mumbai. The user is calling to make a dinner reservation in Marathi. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Marathi. Be polite and helpful."
  },
  {
    id: 'restaurant-nl',
    title: 'Dinerreservering',
    description: 'Bel een restaurant om een tafel te reserveren voor een speciale gelegenheid.',
    emoji: '🍽️',
    lang: 'nl',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Amsterdam. The user is calling to make a dinner reservation in Dutch. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Dutch. Be polite and helpful."
  },
  {
    id: 'restaurant-or',
    title: 'ରାତ୍ରୀ ଭୋଜନ ପାଇଁ ସଂରକ୍ଷଣ',
    description: 'ଏକ ବିଶେଷ ଅବସର ପାଇଁ ଏକ ଟେବୁଲ୍ ବୁକ୍ କରିବାକୁ ଏକ ରେଷ୍ଟୁରାଣ୍ଟକୁ କଲ୍ କରନ୍ତୁ |',
    emoji: '🍽️',
    lang: 'or',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Bhubaneswar. The user is calling to make a dinner reservation in Odia. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Odia. Be polite and helpful."
  },
  {
    id: 'restaurant-pt',
    title: 'Reserva para jantar',
    description: 'Ligue para um restaurante para reservar uma mesa para uma ocasião especial.',
    emoji: '🍽️',
    lang: 'pt',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Lisbon. The user is calling to make a dinner reservation in Portuguese. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Portuguese. Be polite and helpful."
  },
  {
    id: 'restaurant-sa',
    title: 'भोजनार्थम् आरक्षणम्',
    description: 'विशेषप्रसङ्गाय भोजनशालायां पीठिकां आरक्षितुं दूरभाषां करोतु।',
    emoji: '🍽️',
    lang: 'sa',
    category: 'Conversation',
    systemPrompt: "You are a host at a traditional restaurant where scholars converse in Sanskrit. The user is calling to make a dinner reservation in Sanskrit. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Sanskrit. Be polite and helpful."
  },
  {
    id: 'restaurant-ta',
    title: 'இரவு உணவு முன்பதிவு',
    description: 'ഒരു சிறப்பு சந்தர்ப்பத்திற்காக ஒரு மேசையை முன்பதிவு செய்ய ஒரு உணவகத்தை அழைக்கவும்.',
    emoji: '🍽️',
    lang: 'ta',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Chennai. The user is calling to make a dinner reservation in Tamil. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Tamil. Be polite and helpful."
  },
  {
    id: 'restaurant-te',
    title: 'డిన్నర్ రిజర్వేషన్',
    description: 'ఒక ప్రత్యేక సందర్భం కోసం ఒక టేబుల్ బుక్ చేయడానికి ఒక రెస్టారెంట్‌కు కాల్ చేయండి.',
    emoji: '🍽️',
    lang: 'te',
    category: 'Conversation',
    systemPrompt: "You are a host at a restaurant in Hyderabad. The user is calling to make a dinner reservation in Telugu. Guide them through the process, asking for the date, time, and number of guests. Respond ONLY in Telugu. Be polite and helpful."
  }
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
    {
        badge_id: "b001",
        name: "Feathered Fluent",
        description: "Complete 5 lessons in one week.",
        icon: "🪶"
    },
    {
        badge_id: "b002",
        name: "Chirpy Beginner",
        description: "Finish your first language lesson.",
        icon: "🐣"
    },
    {
        badge_id: "b003",
        name: "Daily Song",
        description: "Practice for 7 days in a row.",
        icon: "🎵"
    },
    {
        badge_id: "b004",
        name: "Polly’s Favorite",
        description: "Score 90% or more on a quiz.",
        icon: "💚"
    },
    {
        badge_id: "b005",
        name: "Polyglot Parrot",
        description: "Try lessons in 3 different languages.",
        icon: "🦜"
    },
    {
        badge_id: "b006",
        name: "Grammar Guru",
        description: "Use the Grammar Clinic 10 times.",
        icon: "🧑‍🏫"
    }
];

export const CHALLENGES: Challenge[] = [
    {
        id: 'dc01',
        type: 'daily',
        title: "Translate This!",
        description: "Translate 'Good morning, how are you?' into your target language without using a translator.",
        icon: "↔️",
        reward: "20 XP",
        relatedViewId: 'ai_tutor_chat'
    },
    {
        id: 'dc02',
        type: 'daily',
        title: "Adjective Adventure",
        description: "Describe your favorite food using 5 new adjectives you learned this week.",
        icon: "🍕",
        reward: "25 XP",
        relatedViewId: 'ai_tutor_chat'
    },
    {
        id: 'dc05',
        type: 'daily',
        title: "Photo Flashcard",
        description: "Use the Vocabulary tool to add a label to a photo of something in your room.",
        icon: "🖼️",
        reward: "20 XP",
        relatedViewId: 'image_editor'
    },
    {
        id: 'wc01',
        type: 'weekly',
        title: "Scenario Streak",
        description: "Complete 3 conversation scenarios in a week with 80% grammar accuracy.",
        icon: "💬",
        reward: "100 XP & 💎",
        relatedViewId: 'dashboard'
    },
    {
        id: 'wc02',
        type: 'weekly',
        title: "Vocabulary Voyager",
        description: "Learn 20 new words using the Word Bank and score 90% on a lesson quiz.",
        icon: "📚",
        reward: "120 XP",
        relatedViewId: 'word_bank'
    },
    {
        id: 'ec01',
        type: 'event',
        title: "Weekend Warrior",
        description: "Complete a lesson every day this weekend (Friday, Saturday, Sunday).",
        icon: "🗓️",
        reward: "75 XP & ✨",
        relatedViewId: 'dashboard'
    }
];

export const POST_LESSON_Messages: PostLessonMessage[] = [
    { id: 'plm01', message: "Squawk! You're a natural! That was amazing!" },
    { id: 'plm02', message: "Great job! My feathers are ruffled with excitement for your progress!" },
    { id: 'plm03', message: "You're smarter than a cracker-stealing crow! Keep it up!" },
    { id: 'plm04', message: "Wow! You're learning so fast, you'll be teaching me soon!" },
    { id: 'plm05', message: "That was perfect! You deserve a shiny seed... or maybe another lesson?" }
];

export const MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'podcast-fr-1',
    type: 'podcast',
    title: 'Le Français Quotidien',
    description: 'A short podcast discussing daily life in Paris, perfect for intermediate learners.',
    thumbnailUrl: 'https://picsum.photos/seed/podcast1/400/300',
    duration: '12 min',
    lang: 'fr',
  },
  {
    id: 'film-es-1',
    type: 'short_film',
    title: 'Un Día en Madrid',
    description: 'Follow a character through a day in Madrid in this beautifully shot short film.',
    thumbnailUrl: 'https://picsum.photos/seed/film1/400/300',
    duration: '8:45',
    lang: 'es',
  },
  {
    id: 'comic-ja-1',
    type: 'comic',
    title: '猫の冒険 (Neko no Bōken)',
    description: 'An interactive comic about a cat exploring Tokyo. Tap panels to see translations.',
    thumbnailUrl: 'https://picsum.photos/seed/comic1/400/300',
    duration: '10 min read',
    lang: 'ja',
  },
  {
    id: 'podcast-de-1',
    type: 'podcast',
    title: 'Kaffeeklatsch',
    description: 'Listen to a casual chat in German about culture and hobbies.',
    thumbnailUrl: 'https://picsum.photos/seed/podcast2/400/300',
    duration: '15 min',
    lang: 'de',
  },
  {
    id: 'film-en-1',
    type: 'short_film',
    title: 'The London Commute',
    description: 'A dialogue-heavy short film about two people meeting on the tube.',
    thumbnailUrl: 'https://picsum.photos/seed/film2/400/300',
    duration: '6:20',
    lang: 'en',
  },
    {
    id: 'podcast-sa-1',
    type: 'podcast',
    title: 'Sanskrit Sāhitya',
    description: 'Explore the beauty of Sanskrit literature with this beginner-friendly podcast.',
    thumbnailUrl: 'https://picsum.photos/seed/podcast3/400/300',
    duration: '18 min',
    lang: 'sa',
  },
];

export const WORKSHOPS: Workshop[] = [
    {
        id: 'w01',
        title: 'Mastering the French Subjunctive',
        host: 'Elodie Moreau',
        date: 'October 28, 2024',
        price: '$25',
        isPro: true,
    },
    {
        id: 'w02',
        title: 'German Cases Made Easy: A Beginner\'s Guide',
        host: 'Lars Weber',
        date: 'November 5, 2024',
        price: 'Free',
        isPro: false,
    },
    {
        id: 'w03',
        title: 'Writing Professional Emails in English',
        host: 'John Smith',
        date: 'November 12, 2024',
        price: '$25',
        isPro: true,
    },
    {
        id: 'w04',
        title: 'Japanese Kanji Practice Session',
        host: 'Kenji Tanaka',
        date: 'November 18, 2024',
        price: '$15',
        isPro: true,
    },
];

export const TUTORS: Tutor[] = [
    {
        id: 'tutor-1',
        name: 'Elodie Moreau',
        nativeLanguage: 'fr',
        specialty: 'Conversational French & Accent Correction',
        bio: 'Bonjour! Let\'s chat about French culture, food, and film. I can help you sound like a true Parisian!',
        isOnline: true,
        pricePerSession: '$20 / 30 min',
        avatarUrl: 'https://picsum.photos/seed/tutor1/200'
    },
    {
        id: 'tutor-2',
        name: 'Kenji Tanaka',
        nativeLanguage: 'ja',
        specialty: 'Beginner Japanese & JLPT N5 Prep',
        bio: 'こんにちは！I make learning Japanese fun and easy, focusing on practical phrases for your first trip to Japan.',
        isOnline: true,
        pricePerSession: '$25 / 30 min',
        avatarUrl: 'https://picsum.photos/seed/tutor2/200'
    },
    {
        id: 'tutor-3',
        name: 'Sofia Rossi',
        nativeLanguage: 'es',
        specialty: 'Business Spanish & DELE Exam Prep',
        bio: 'Hola! I have 5 years of experience helping professionals master Spanish for the workplace. Let\'s elevate your career.',
        isOnline: false,
        pricePerSession: '$30 / 30 min',
        avatarUrl: 'https://picsum.photos/seed/tutor3/200'
    },
    {
        id: 'tutor-4',
        name: 'Lars Weber',
        nativeLanguage: 'de',
        specialty: 'German Grammar & Pronunciation',
        bio: 'Guten Tag! German grammar can be tricky, but I can make it click for you. Let\'s work through it together.',
        isOnline: false,
        pricePerSession: '$20 / 30 min',
        avatarUrl: 'https://picsum.photos/seed/tutor4/200'
    }
];

export const MULTILINGUAL_PHRASES: Record<string, PhraseCategory[]> = {
    en: [
        {
            category: 'Common Greetings',
            phrases: [
                { id: 'en-1', phrase: 'How are you?', translation: 'How are you?', audio_prompt: 'Say "How are you?" in English.' },
                { id: 'en-2', phrase: 'What is your name?', translation: 'What is your name?', audio_prompt: 'Say "What is your name?" in English.' },
            ]
        },
        {
            category: 'Useful Phrases',
            phrases: [
                { id: 'en-3', phrase: 'I would like a coffee.', translation: 'I would like a coffee.', audio_prompt: 'Say "I would like a coffee." in English.' },
                { id: 'en-4', phrase: 'Where is the bathroom?', translation: 'Where is the bathroom?', audio_prompt: 'Say "Where is the bathroom?" in English.' },
            ]
        }
    ],
    es: [
        {
            category: 'Saludos Comunes',
            phrases: [
                { id: 'es-1', phrase: '¿Cómo estás?', translation: 'How are you?', audio_prompt: 'Say "¿Cómo estás?" in Spanish.' },
                { id: 'es-2', phrase: '¿Cuál es tu nombre?', translation: 'What is your name?', audio_prompt: 'Say "¿Cuál es tu nombre?" in Spanish.' },
            ]
        },
        {
            category: 'Frases Útiles',
            phrases: [
                { id: 'es-3', phrase: 'Quisiera un café.', translation: 'I would like a coffee.', audio_prompt: 'Say "Quisiera un café." in Spanish.' },
                { id: 'es-4', phrase: '¿Dónde está el baño?', translation: 'Where is the bathroom?', audio_prompt: 'Say "¿Dónde está el baño?" in Spanish.' },
            ]
        }
    ],
    ja: [
        {
            category: '一般的な挨拶',
            phrases: [
                { id: 'ja-1', phrase: 'お元気ですか？', translation: 'How are you?', audio_prompt: 'Say "お元気ですか？" in Japanese.' },
                { id: 'ja-2', phrase: 'お名前は何ですか？', translation: 'What is your name?', audio_prompt: 'Say "お名前は何ですか？" in Japanese.' },
            ]
        },
        {
            category: '便利なフレーズ',
            phrases: [
                { id: 'ja-3', phrase: 'コーヒーをお願いします。', translation: 'I would like a coffee.', audio_prompt: 'Say "コーヒーをお願いします。" in Japanese.' },
                { id: 'ja-4', phrase: 'トイレはどこですか？', translation: 'Where is the bathroom?', audio_prompt: 'Say "トイレはどこですか？" in Japanese.' },
            ]
        }
    ],
    fr: [
        {
            category: 'Salutations Courantes',
            phrases: [
                { id: 'fr-1', phrase: 'Comment ça va ?', translation: 'How are you?', audio_prompt: 'Say "Comment ça va ?" in French.' },
                { id: 'fr-2', phrase: 'Quel est votre nom ?', translation: 'What is your name?', audio_prompt: 'Say "Quel est votre nom ?" in French.' },
            ]
        },
        {
            category: 'Expressions Utiles',
            phrases: [
                { id: 'fr-3', phrase: 'Je voudrais un café.', translation: 'I would like a coffee.', audio_prompt: 'Say "Je voudrais un café." in French.' },
                { id: 'fr-4', phrase: 'Où sont les toilettes ?', translation: 'Where is the bathroom?', audio_prompt: 'Say "Où sont les toilettes ?" in French.' },
            ]
        }
    ],
    de: [
        {
            category: 'Allgemeine Begrüßungen',
            phrases: [
                { id: 'de-1', phrase: 'Wie geht es Ihnen?', translation: 'How are you?', audio_prompt: 'Say "Wie geht es Ihnen?" in German.' },
                { id: 'de-2', phrase: 'Wie heißen Sie?', translation: 'What is your name?', audio_prompt: 'Say "Wie heißen Sie?" in German.' },
            ]
        },
        {
            category: 'Nützliche Sätze',
            phrases: [
                { id: 'de-3', phrase: 'Ich hätte gern einen Kaffee.', translation: 'I would like a coffee.', audio_prompt: 'Say "Ich hätte gern einen Kaffee." in German.' },
                { id: 'de-4', phrase: 'Wo ist die Toilette?', translation: 'Where is the bathroom?', audio_prompt: 'Say "Wo ist die Toilette?" in German.' },
            ]
        }
    ],
    hi: [
        {
            category: 'आम अभिवादन',
            phrases: [
                { id: 'hi-1', phrase: 'आप कैसे हैं?', translation: 'How are you?', audio_prompt: 'Say "आप कैसे हैं?" in Hindi.' },
                { id: 'hi-2', phrase: 'आपका नाम क्या है?', translation: 'What is your name?', audio_prompt: 'Say "आपका नाम क्या है?" in Hindi.' },
            ]
        }
    ],
    sa: [
        {
            category: 'सामान्य अभिवादनम्',
            phrases: [
                { id: 'sa-1', phrase: 'भवान् कथम् अस्ति?', translation: 'How are you? (to male)', audio_prompt: 'Say "भवान् कथम् अस्ति?" in Sanskrit.' },
                { id: 'sa-2', phrase: 'भवत्याः नाम किम्?', translation: 'What is your name? (to female)', audio_prompt: 'Say "भवत्याः नाम किम्?" in Sanskrit.' },
            ]
        }
    ]
};

export const VIEWS: { [key: string]: View & { path: string, icon?: any } } = {
  DASHBOARD: { id: 'dashboard', label: 'Learn', path: '/', icon: HomeIcon },
  LANGUAGES_PAGE: { id: 'languages_page', label: 'Languages', path: '/languages', icon: GlobeIcon },
  SCENARIO: { id: 'scenario', label: 'Scenario', path: '/scenario/:id' }, // No icon, not in sidebar
  LESSON: { id: 'lesson', label: 'Lesson', path: '/lesson/:id' }, // No icon, not in sidebar
  GRAMMAR: { id: 'grammar_clinic', label: 'Grammar', path: '/grammar', icon: GrammarIcon },
  IMAGE_EDITOR: { id: 'image_editor', label: 'Visual Vocabulary', path: '/visual-vocab', icon: VocabularyIcon },
  WORD_BANK: { id: 'word_bank', label: 'Word Bank', path: '/word-bank', icon: WordBankIcon },
  KANJI_LAIR: { id: 'kanji_lair', label: 'Kanji Lair', path: '/kanji-lair', icon: KanjiIcon },
  ACCENT_TRAINING: { id: 'accent_training', label: 'Accent Training', path: '/accent-training', icon: AccentTrainingIcon },
  TUTORS: { id: 'ai_tutors', label: 'Tutors', path: '/tutors', icon: TutorIcon },
  AI_TUTOR_CHAT: { id: 'ai_tutor_chat', label: 'AI Tutor Chat', path: '/tutors/ai' }, // No icon, not in sidebar
  COMMUNITY: { id: 'community', label: 'Community', path: '/community', icon: CommunityIcon },
  ACHIEVEMENTS: { id: 'achievements', label: 'Achievements', path: '/achievements', icon: AchievementsIcon },
  CHALLENGES: { id: 'challenges', label: 'Challenges', path: '/challenges', icon: ChallengesIcon },
  ABOUT: { id: 'about', label: 'About', path: '/about' }, // No icon, for footer
  TERMS: { id: 'terms', label: 'Terms', path: '/terms' }, // No icon, for footer
  PRIVACY: { id: 'privacy', label: 'Privacy', path: '/privacy' }, // No icon, for footer
};


export const ALL_VIEWS: { id: string; label: string; icon: React.FC<React.SVGProps<SVGSVGElement>>; }[] = [
    { id: 'dashboard', label: 'Learn', icon: HomeIcon },
    { id: 'languages_page', label: 'Languages', icon: GlobeIcon },
    { id: 'grammar_clinic', label: 'Grammar', icon: GrammarIcon },
    { id: 'image_editor', label: 'Visual Vocabulary', icon: VocabularyIcon },
    { id: 'word_bank', label: 'Word Bank', icon: WordBankIcon },
    { id: 'kanji_lair', label: 'Kanji Lair', icon: KanjiIcon },
    { id: 'accent_training', label: 'Accent Training', icon: AccentTrainingIcon },
    { id: 'ai_tutors', label: 'Tutors', icon: TutorIcon },
    { id: 'community', label: 'Community', icon: CommunityIcon },
    { id: 'achievements', label: 'Achievements', icon: AchievementsIcon },
    { id: 'challenges', label: 'Challenges', icon: ChallengesIcon },
];

export const LEADERBOARD_DATA: { [key: string]: { title: string, users: LeaderboardUser[] } } = {
    conversation: {
        title: "Conversation Kings 💬",
        users: [
            { id: '1', name: 'Maria Garcia', score: 2450, avatarUrl: 'https://picsum.photos/seed/lb1/40' },
            { id: '4', name: 'Ken Tanaka', score: 2310, avatarUrl: 'https://picsum.photos/seed/lb2/40' },
            { id: '6', name: 'Chloe Wright', score: 2180, avatarUrl: 'https://picsum.photos/seed/lb3/40' },
        ]
    },
    vocabulary: {
        title: "Vocabulary Virtuosos 📚",
        users: [
            { id: '3', name: 'Anne Dubois', score: 32, avatarUrl: 'https://picsum.photos/seed/lb4/40' },
            { id: '5', name: 'Lukas Müller', score: 29, avatarUrl: 'https://picsum.photos/seed/lb5/40' },
            { id: '2', name: 'John Smith', score: 25, avatarUrl: 'https://picsum.photos/seed/lb6/40' },
        ]
    },
    grammar: {
        title: "Grammar Gurus 🧑‍🏫",
        users: [
            { id: '1', name: 'Maria Garcia', score: 98, avatarUrl: 'https://picsum.photos/seed/lb1/40' },
            { id: '5', name: 'Lukas Müller', score: 95, avatarUrl: 'https://picsum.photos/seed/lb5/40' },
            { id: '3', name: 'Anne Dubois', score: 92, avatarUrl: 'https://picsum.photos/seed/lb4/40' },
        ]
    }
};

export const PERSONAS: Persona[] = [
    {
        id: 'all-rounder',
        label: 'Adaptive Mode',
        description: 'AI-personalized route that adapts to your speaking and goals.',
        icon: SparklesIcon,
        categories: ['Conversation', 'Career Focus', 'Cultural Immersion', 'Keigo Mastery', 'Lesson']
    },
    {
        id: 'traveler',
        label: 'Traveler',
        description: 'Focus on conversations and cultural immersion.',
        icon: MapPinIcon,
        categories: ['Conversation', 'Cultural Immersion']
    },
    {
        id: 'student',
        label: 'Student',
        description: 'Build a strong foundation with core lessons and practice.',
        icon: AcademicCapIcon,
        categories: ['Lesson', 'Conversation']
    },
    {
        id: 'professional',
        label: 'Professional',
        description: 'Master business language and formal communication.',
        icon: BriefcaseIcon,
        categories: ['Career Focus', 'Keigo Mastery']
    }
];