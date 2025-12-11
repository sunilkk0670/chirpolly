/**
 * Firestore Collections Helper
 * 
 * Provides typed collection references and helper functions for accessing
 * Firestore collections in the tutor marketplace.
 */

import {
    collection,
    doc,
    CollectionReference,
    DocumentReference,
    Timestamp,
} from 'firebase/firestore';
import { db } from '../services/firebase';
import type {
    User,
    Session,
    Conversation,
    Message,
    Payout,
    Review,
    Notification,
} from '../types/marketplace';

// ============================================================================
// TYPED COLLECTION REFERENCES
// ============================================================================

/**
 * Get typed reference to users collection
 */
export const usersCollection = () =>
    collection(db, 'users') as CollectionReference<User>;

/**
 * Get typed reference to a specific user document
 */
export const userDoc = (userId: string) =>
    doc(db, 'users', userId) as DocumentReference<User>;

/**
 * Get typed reference to sessions collection
 */
export const sessionsCollection = () =>
    collection(db, 'sessions') as CollectionReference<Session>;

/**
 * Get typed reference to a specific session document
 */
export const sessionDoc = (sessionId: string) =>
    doc(db, 'sessions', sessionId) as DocumentReference<Session>;

/**
 * Get typed reference to conversations collection
 */
export const conversationsCollection = () =>
    collection(db, 'conversations') as CollectionReference<Conversation>;

/**
 * Get typed reference to a specific conversation document
 */
export const conversationDoc = (conversationId: string) =>
    doc(db, 'conversations', conversationId) as DocumentReference<Conversation>;

/**
 * Get typed reference to messages subcollection
 */
export const messagesCollection = (conversationId: string) =>
    collection(db, 'conversations', conversationId, 'messages') as CollectionReference<Message>;

/**
 * Get typed reference to a specific message document
 */
export const messageDoc = (conversationId: string, messageId: string) =>
    doc(db, 'conversations', conversationId, 'messages', messageId) as DocumentReference<Message>;

/**
 * Get typed reference to reviews collection
 */
export const reviewsCollection = () =>
    collection(db, 'reviews') as CollectionReference<Review>;

/**
 * Get typed reference to a specific review document
 */
export const reviewDoc = (reviewId: string) =>
    doc(db, 'reviews', reviewId) as DocumentReference<Review>;

/**
 * Get typed reference to payouts collection
 */
export const payoutsCollection = () =>
    collection(db, 'payouts') as CollectionReference<Payout>;

/**
 * Get typed reference to a specific payout document
 */
export const payoutDoc = (payoutId: string) =>
    doc(db, 'payouts', payoutId) as DocumentReference<Payout>;

/**
 * Get typed reference to notifications collection
 */
export const notificationsCollection = () =>
    collection(db, 'notifications') as CollectionReference<Notification>;

/**
 * Get typed reference to a specific notification document
 */
export const notificationDoc = (notificationId: string) =>
    doc(db, 'notifications', notificationId) as DocumentReference<Notification>;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate conversation ID from tutor and student IDs
 * Format: tutorId_studentId (always in this order for consistency)
 */
export const generateConversationId = (tutorId: string, studentId: string): string => {
    return `${tutorId}_${studentId}`;
};

/**
 * Calculate session price based on duration and hourly rate
 */
export const calculateSessionPrice = (
    hourlyRate: number,
    durationMinutes: number,
    platformFeePercent: number = 0.20 // 20% default
): {
    sessionPrice: number;
    platformFee: number;
    tutorPayout: number;
} => {
    const sessionPrice = (hourlyRate / 60) * durationMinutes;
    const platformFee = sessionPrice * platformFeePercent;
    const tutorPayout = sessionPrice - platformFee;

    return {
        sessionPrice: Math.round(sessionPrice * 100) / 100, // Round to 2 decimals
        platformFee: Math.round(platformFee * 100) / 100,
        tutorPayout: Math.round(tutorPayout * 100) / 100,
    };
};

/**
 * Convert JavaScript Date to Firestore Timestamp
 */
export const dateToTimestamp = (date: Date): Timestamp => {
    return Timestamp.fromDate(date);
};

/**
 * Convert Firestore Timestamp to JavaScript Date
 */
export const timestampToDate = (timestamp: Timestamp): Date => {
    return timestamp.toDate();
};

/**
 * Check if a session is upcoming (scheduled in the future)
 */
export const isUpcomingSession = (session: Session): boolean => {
    const now = new Date();
    const scheduledStart = timestampToDate(session.scheduledStart);
    return scheduledStart > now &&
        (session.status === 'pending' || session.status === 'confirmed');
};

/**
 * Check if a session is completed
 */
export const isCompletedSession = (session: Session): boolean => {
    return session.status === 'completed';
};

/**
 * Check if a session can be reviewed
 * (completed and no review submitted yet)
 */
export const canReviewSession = (session: Session): boolean => {
    return session.status === 'completed' && !session.studentReview;
};

/**
 * Format currency for display
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

/**
 * Get tutor's average rating from stats
 */
export const getTutorRating = (user: User): number => {
    return user.tutorProfile?.stats.averageRating || 0;
};

/**
 * Check if user is an approved tutor
 */
export const isApprovedTutor = (user: User): boolean => {
    return user.tutorProfile?.isApproved === true;
};

/**
 * Get user's display name
 */
export const getUserDisplayName = (user: User): string => {
    return user.displayName || user.email.split('@')[0];
};
