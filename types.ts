// Fix: Import React to resolve namespace errors for React.FC and React.SVGProps.
import React from 'react';

export interface Language {
  code: string;
  name: string;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  emoji: string;
  systemPrompt: string;
  lang: string;
  category: 'Conversation' | 'Career Focus' | 'Cultural Immersion' | 'Keigo Mastery';
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  grammarFeedback?: GrammarFeedback;
}

export interface GrammarFeedback {
  correction: string;
  explanation: string;
}

export interface View {
  id: string;
  label: string;
}

export interface CommunityUser {
  id: string;
  name: string;
  nativeLanguage: string; // Language code
  learningLanguage: string; // Language code
  bio: string;
  isOnline: boolean;
}

export interface LessonContent {
  word: string;
  transliteration: string;
  meaning: string;
  example: string;
  audio: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

export interface CultureCapsule {
  title: string;
  icon: string; // emoji
  content: string; // Markdown content
}

export interface Lesson {
  lesson_id: string;
  language: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  content: LessonContent[];
  quiz: QuizQuestion[];
  emoji: string;
  lang: string;
  category: 'Lesson';
  cultureCapsule?: CultureCapsule;
}

export interface AchievementBadge {
  badge_id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Challenge {
  id: string;
  type: 'daily' | 'weekly' | 'event';
  title: string;
  description: string;
  icon: string;
  reward: string;
  relatedViewId?: string;
}

export interface PostLessonMessage {
  id: string;
  message: string;
}

export interface VocabularyWord {
  word: string;
  transliteration: string;
  meaning: string;
  audio_prompt: string;
  // SRS Fields
  easinessFactor?: number;
  interval?: number;
  repetitions?: number;
  nextReviewDate?: number;
}

export interface LessonUnit {
  unitId: string;
  title: string;
  emoji: string;
  words: VocabularyWord[];
  isLocked?: boolean;
}

export interface LearningModule {
  level: string;
  theme: string;
  description: string;
  units: LessonUnit[];
}

export interface MediaItem {
  id: string;
  type: 'podcast' | 'short_film' | 'comic';
  title: string;
  description: string;
  thumbnailUrl: string;
  duration: string;
  lang: string;
}

export interface Workshop {
  id: string;
  title: string;
  host: string;
  date: string;
  price: string;
  isPro: boolean;
}

export interface Tutor {
  id: string;
  name: string;
  nativeLanguage: string; // Language code
  specialty: string;
  bio: string;
  isOnline: boolean;
  pricePerSession: string; // e.g., "$15 / 30 min"
  avatarUrl: string;
}

export interface TranscriptionFeedback {
  transcription: string;
  feedback: string;
}

export interface ImageVocabularyWord {
  word: string;
  transliteration: string;
  meaning: string;
}

export interface PracticePhrase {
  id: string;
  phrase: string;
  translation: string;
  audio_prompt: string;
}

export interface PhraseCategory {
  category: string;
  phrases: PracticePhrase[];
}

export interface Kanji {
  character: string;
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  jlpt: number;
  mnemonic: string;
  examples: {
    word: string;
    reading: string;
    meaning: string;
  }[];
}

export interface LeaderboardUser {
  id: string;
  name: string;
  score: number;
  avatarUrl: string;
}

export interface Persona {
  id: 'all-rounder' | 'traveler' | 'student' | 'professional';
  label: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  categories: (Scenario['category'] | 'Lesson')[];
}

// Social Feed Types
export interface Post {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  imageUrl?: string;
  language?: string; // Language being learned/practiced
  createdAt: any; // Firestore Timestamp
  likesCount: number;
  commentsCount: number;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: any; // Firestore Timestamp
}

export interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: any; // Firestore Timestamp
}

// Tutor Marketplace Types
export interface TutorProfile {
  id: string;
  userId: string; // Auth user ID
  name: string;
  email: string;
  photoURL?: string;
  nativeLanguages: string[]; // Language codes
  teachingLanguages: string[]; // Language codes they can teach
  specialty: string;
  bio: string;
  hourlyRate: number; // in USD
  rating: number; // 0-5
  totalSessions: number;
  totalReviews: number;
  isOnline: boolean;
  isVerified: boolean; // Admin approved
  availability: AvailabilitySlot[]; // Weekly recurring schedule
  createdAt: any; // Firestore Timestamp
  updatedAt: any; // Firestore Timestamp
}

export interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string; // "09:00"
  endTime: string; // "17:00"
  timezone: string; // "America/New_York"
}

export interface TutorApplication {
  id: string;
  userId: string;
  name: string;
  email: string;
  nativeLanguages: string[];
  teachingLanguages: string[];
  specialty: string;
  bio: string;
  hourlyRate: number;
  availability: AvailabilitySlot[];
  status: 'pending' | 'approved' | 'rejected';
  createdAt: any;
  reviewedAt?: any;
  reviewedBy?: string; // Admin user ID
}

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  scheduledAt: any; // Firestore Timestamp
  duration: number; // in minutes
  price: number; // in USD
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  meetingLink?: string; // Video call link
  notes?: string;
  createdAt: any;
  updatedAt: any;
}

export interface TutorReview {
  id: string;
  bookingId: string;
  tutorId: string;
  studentId: string;
  studentName: string;
  rating: number; // 1-5
  comment: string;
  createdAt: any;
}
