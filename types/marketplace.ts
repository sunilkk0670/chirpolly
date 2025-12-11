// ChirPolly Tutor Marketplace - Firestore Schema
// This is the absolute minimum viable schema for a working marketplace

import { Timestamp } from 'firebase/firestore';

// ============================================================================
// USERS COLLECTION (extends your existing auth users)
// ============================================================================
export interface User {
    uid: string;                    // Firebase Auth UID
    email: string;
    displayName: string;
    photoURL?: string;
    role: 'student' | 'tutor' | 'both';  // Users can be both
    createdAt: Timestamp;
    lastActive: Timestamp;

    // Student-specific
    studentProfile?: {
        learningLanguages: string[];   // ['es', 'fr', 'de']
        currentLevel: { [langCode: string]: string };  // {es: 'B1', fr: 'A2'}
        timezone: string;               // 'Asia/Kolkata'
        preferredCurrency: string;      // 'INR', 'USD'
    };

    // Tutor-specific
    tutorProfile?: {
        isApproved: boolean;            // Manual approval required
        bio: string;
        teachingLanguages: Array<{
            code: string;                 // 'es'
            name: string;                 // 'Spanish'
            proficiency: 'native' | 'fluent';
        }>;
        hourlyRate: number;             // Base rate in USD (convert for display)
        videoIntroURL?: string;         // Optional 60-second intro
        specializations: string[];      // ['grammar', 'conversation', 'business']
        teachingSince: string;          // 'YYYY-MM'
        certifications?: string[];      // Optional teaching certs

        // Statistics (denormalized for fast access)
        stats: {
            totalSessions: number;
            averageRating: number;
            reviewCount: number;
            responseTime: number;         // Avg hours to respond to messages
            completionRate: number;       // % of sessions completed vs cancelled
        };

        // Availability (simple weekly schedule)
        weeklyAvailability: Array<{
            dayOfWeek: number;            // 0=Sunday, 6=Saturday
            slots: Array<{
                startTime: string;          // '09:00' (24-hour format)
                endTime: string;            // '17:00'
            }>;
        }>;

        // Blocking specific dates (vacations, etc.)
        blockedDates?: string[];        // ['2025-12-25', '2025-12-26']
    };
}

// ============================================================================
// SESSIONS COLLECTION (the money maker)
// ============================================================================
export interface Session {
    id: string;                       // Auto-generated
    tutorId: string;
    tutorName: string;                // Denormalized for display
    studentId: string;
    studentName: string;              // Denormalized

    // Scheduling
    scheduledStart: Timestamp;
    scheduledEnd: Timestamp;
    duration: number;                 // Minutes: 30, 60, or 90
    timezone: string;                 // Student's timezone for display

    // Language
    language: {
        code: string;                   // 'es'
        name: string;                   // 'Spanish'
    };
    focusArea?: string;               // Optional: 'grammar', 'conversation', etc.

    // Status tracking
    status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';
    createdAt: Timestamp;
    confirmedAt?: Timestamp;          // When tutor confirms
    completedAt?: Timestamp;          // When session finishes
    cancelledAt?: Timestamp;
    cancelledBy?: 'student' | 'tutor' | 'admin';
    cancellationReason?: string;

    // Payment
    pricing: {
        tutorRate: number;              // Tutor's hourly rate
        sessionPrice: number;           // Total price for this session
        platformFee: number;            // Your commission
        tutorPayout: number;            // What tutor receives
        currency: string;               // 'USD', 'INR', etc.
    };
    paymentStatus: 'pending' | 'held' | 'released' | 'refunded';
    paymentId?: string;               // Stripe/Razorpay payment intent ID
    payoutId?: string;                // Stripe Connect transfer ID

    // Meeting
    meetingLink?: string;             // Tutor provides this (Zoom/Google Meet URL)
    meetingPassword?: string;         // Optional

    // Post-session
    tutorNotes?: string;              // Tutor adds after session
    vocabularyToReview?: string[];   // Words to add to student's SRS
    homeworkAssigned?: string;

    // Reviews (only after completed)
    studentReview?: {
        rating: number;                 // 1-5
        comment?: string;
        createdAt: Timestamp;
    };
    tutorReview?: {                   // Tutors can rate students too
        rating: number;
        comment?: string;
        createdAt: Timestamp;
    };
}

// ============================================================================
// MESSAGES COLLECTION (simple in-app messaging)
// ============================================================================
// Create a conversation when student first messages tutor
export interface Conversation {
    id: string;                       // tutorId_studentId
    participants: {
        tutorId: string;
        studentId: string;
    };
    lastMessage: {
        text: string;
        sentBy: string;                 // userId
        timestamp: Timestamp;
    };
    unreadCount: {
        [userId: string]: number;       // Track unread per user
    };
    createdAt: Timestamp;
}

// Messages subcollection: conversations/{conversationId}/messages
export interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: Timestamp;
    read: boolean;
}

// ============================================================================
// PAYOUTS COLLECTION (tutor earnings tracking)
// ============================================================================
export interface Payout {
    id: string;
    tutorId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';

    // Sessions included in this payout
    sessionIds: string[];

    // Payout details
    payoutMethod: 'stripe' | 'bank_transfer' | 'paypal';
    payoutDestination?: string;       // Last 4 digits of account

    createdAt: Timestamp;
    processedAt?: Timestamp;

    stripeTransferId?: string;
    failureReason?: string;
}

// ============================================================================
// REVIEWS COLLECTION (separate for easier querying)
// ============================================================================
// Denormalized from sessions for better performance
export interface Review {
    id: string;
    sessionId: string;
    tutorId: string;
    studentId: string;
    studentName: string;              // For display on tutor profile
    rating: number;                   // 1-5
    comment?: string;
    language: string;                 // Which language was taught
    createdAt: Timestamp;

    // Helpful for filtering fake reviews
    wasVerifiedSession: boolean;      // Session actually happened
}

// ============================================================================
// NOTIFICATIONS COLLECTION (optional but recommended)
// ============================================================================
export interface Notification {
    id: string;
    userId: string;
    type: 'booking_request' | 'booking_confirmed' | 'session_reminder' |
    'session_completed' | 'review_received' | 'message_received' |
    'payout_processed';
    title: string;
    body: string;
    read: boolean;
    actionUrl?: string;               // Deep link into app
    createdAt: Timestamp;
}
