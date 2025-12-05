import { VocabularyWord } from '../types';

// SM-2 Algorithm Constants
const DEFAULT_EASINESS = 2.5;
const DEFAULT_INTERVAL = 0; // 0 days (due immediately)
const DEFAULT_REPETITIONS = 0;

/**
 * Calculates the next review schedule for a word based on the user's rating.
 * 
 * Quality ratings:
 * 0 - Complete blackout (Again)
 * 1 - Incorrect response (Hard)
 * 2 - Correct with hesitation (Good)
 * 3 - Perfect response (Easy)
 * 
 * Note: Standard SM-2 uses 0-5, we map our 4 buttons to this scale.
 * We will use:
 * Again = 0
 * Hard = 3
 * Good = 4
 * Easy = 5
 */
export const calculateNextReview = (word: VocabularyWord, quality: number): VocabularyWord => {
    let {
        easinessFactor = DEFAULT_EASINESS,
        interval = DEFAULT_INTERVAL,
        repetitions = DEFAULT_REPETITIONS
    } = word;

    // 1. Update Easiness Factor
    // EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
    // Minimum EF is 1.3
    let newEasiness = easinessFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (newEasiness < 1.3) newEasiness = 1.3;

    // 2. Update Repetitions & Interval
    let newRepetitions = repetitions;
    let newInterval = interval;

    if (quality < 3) {
        // If quality is low (Again), reset repetitions
        newRepetitions = 0;
        newInterval = 1; // Review again tomorrow (or same day logic could be applied)
    } else {
        newRepetitions += 1;

        // SM-2 Interval Calculation
        if (newRepetitions === 1) {
            newInterval = 1;
        } else if (newRepetitions === 2) {
            newInterval = 6;
        } else {
            newInterval = Math.round(interval * newEasiness);
        }
    }

    // Calculate next review date (timestamp)
    const now = new Date();
    const nextReviewDate = now.setDate(now.getDate() + newInterval);

    return {
        ...word,
        easinessFactor: newEasiness,
        interval: newInterval,
        repetitions: newRepetitions,
        nextReviewDate: nextReviewDate
    };
};

export const getDueWords = (words: VocabularyWord[]): VocabularyWord[] => {
    const now = Date.now();
    return words.filter(word => {
        // If it has no review date, it's new -> it's due
        if (!word.nextReviewDate) return true;
        // If review date is in the past -> it's due
        return word.nextReviewDate <= now;
    });
};

export const initializeSRS = (word: VocabularyWord): VocabularyWord => {
    return {
        ...word,
        easinessFactor: DEFAULT_EASINESS,
        interval: DEFAULT_INTERVAL,
        repetitions: DEFAULT_REPETITIONS,
        nextReviewDate: Date.now() // Due immediately upon learning
    };
};
