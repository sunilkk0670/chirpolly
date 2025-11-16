import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isDemoModeEnabled } from './firebase';
import type { TutorProfile, TutorApplication } from '../types';

// In-memory storage for demo mode
let demoTutorsStore: TutorProfile[] = [
  {
    id: 'demo-tutor-1',
    userId: 'demo-user-1',
    name: 'Elodie Moreau',
    email: 'elodie@example.com',
    photoURL: 'https://picsum.photos/seed/tutor1/200',
    nativeLanguages: ['fr'],
    teachingLanguages: ['fr', 'en'],
    specialty: 'Conversational French & Accent Correction',
    bio: 'Bonjour! Let\'s chat about French culture, food, and film. I can help you sound like a true Parisian!',
    hourlyRate: 40,
    rating: 4.9,
    totalSessions: 127,
    totalReviews: 45,
    isOnline: true,
    isVerified: true,
    availability: [
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'Europe/Paris' },
      { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', timezone: 'Europe/Paris' },
      { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', timezone: 'Europe/Paris' },
    ],
    createdAt: Date.now() - 86400000 * 180,
    updatedAt: Date.now(),
  },
  {
    id: 'demo-tutor-2',
    userId: 'demo-user-2',
    name: 'Kenji Tanaka',
    email: 'kenji@example.com',
    photoURL: 'https://picsum.photos/seed/tutor2/200',
    nativeLanguages: ['ja'],
    teachingLanguages: ['ja', 'en'],
    specialty: 'Beginner Japanese & JLPT N5 Prep',
    bio: 'こんにちは！I make learning Japanese fun and easy, focusing on practical phrases for your first trip to Japan.',
    hourlyRate: 50,
    rating: 4.8,
    totalSessions: 203,
    totalReviews: 78,
    isOnline: true,
    isVerified: true,
    availability: [
      { dayOfWeek: 2, startTime: '10:00', endTime: '18:00', timezone: 'Asia/Tokyo' },
      { dayOfWeek: 4, startTime: '10:00', endTime: '18:00', timezone: 'Asia/Tokyo' },
    ],
    createdAt: Date.now() - 86400000 * 240,
    updatedAt: Date.now(),
  },
  {
    id: 'demo-tutor-3',
    userId: 'demo-user-3',
    name: 'Sofia Rossi',
    email: 'sofia@example.com',
    photoURL: 'https://picsum.photos/seed/tutor3/200',
    nativeLanguages: ['es'],
    teachingLanguages: ['es', 'en'],
    specialty: 'Business Spanish & DELE Exam Prep',
    bio: 'Hola! I have 5 years of experience helping professionals master Spanish for the workplace. Let\'s elevate your career.',
    hourlyRate: 60,
    rating: 5.0,
    totalSessions: 312,
    totalReviews: 92,
    isOnline: false,
    isVerified: true,
    availability: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '20:00', timezone: 'Europe/Madrid' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '20:00', timezone: 'Europe/Madrid' },
      { dayOfWeek: 5, startTime: '14:00', endTime: '20:00', timezone: 'Europe/Madrid' },
    ],
    createdAt: Date.now() - 86400000 * 365,
    updatedAt: Date.now(),
  },
];
let demoApplicationsStore: TutorApplication[] = [];
let demoIdCounter = 1;

// ============ TUTOR PROFILES ============

export const fetchTutors = async (filters?: {
  language?: string;
  onlineOnly?: boolean;
  minRating?: number;
}): Promise<TutorProfile[]> => {
  if (isDemoModeEnabled) {
    let tutors = [...demoTutorsStore];
    
    if (filters?.language) {
      tutors = tutors.filter(t => 
        t.teachingLanguages.includes(filters.language!) || 
        t.nativeLanguages.includes(filters.language!)
      );
    }
    
    if (filters?.onlineOnly) {
      tutors = tutors.filter(t => t.isOnline);
    }
    
    if (filters?.minRating) {
      tutors = tutors.filter(t => t.rating >= filters.minRating!);
    }
    
    return tutors;
  }

  try {
    let q = query(
      collection(db, 'tutors'),
      where('isVerified', '==', true),
      orderBy('rating', 'desc')
    );

    const querySnapshot = await getDocs(q);
    let tutors: TutorProfile[] = [];

    querySnapshot.forEach((doc) => {
      tutors.push({
        id: doc.id,
        ...doc.data(),
      } as TutorProfile);
    });

    // Apply client-side filters
    if (filters?.language) {
      tutors = tutors.filter(t =>
        t.teachingLanguages.includes(filters.language!) ||
        t.nativeLanguages.includes(filters.language!)
      );
    }

    if (filters?.onlineOnly) {
      tutors = tutors.filter(t => t.isOnline);
    }

    if (filters?.minRating) {
      tutors = tutors.filter(t => t.rating >= filters.minRating!);
    }

    return tutors;
  } catch (error) {
    console.error('Error fetching tutors:', error);
    return [];
  }
};

export const getTutorById = async (tutorId: string): Promise<TutorProfile | null> => {
  if (isDemoModeEnabled) {
    return demoTutorsStore.find(t => t.id === tutorId) || null;
  }

  try {
    const docRef = doc(db, 'tutors', tutorId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        ...docSnap.data(),
      } as TutorProfile;
    }
    return null;
  } catch (error) {
    console.error('Error fetching tutor:', error);
    return null;
  }
};

// ============ TUTOR APPLICATIONS ============

export const submitTutorApplication = async (
  userId: string,
  name: string,
  email: string,
  nativeLanguages: string[],
  teachingLanguages: string[],
  specialty: string,
  bio: string,
  hourlyRate: number,
  availability: any[]
): Promise<string> => {
  if (isDemoModeEnabled) {
    const appId = `demo-app-${demoIdCounter++}`;
    const newApp: TutorApplication = {
      id: appId,
      userId,
      name,
      email,
      nativeLanguages,
      teachingLanguages,
      specialty,
      bio,
      hourlyRate,
      availability,
      status: 'pending',
      createdAt: Date.now(),
    };
    demoApplicationsStore.push(newApp);
    return appId;
  }

  try {
    const appData = {
      userId,
      name,
      email,
      nativeLanguages,
      teachingLanguages,
      specialty,
      bio,
      hourlyRate,
      availability,
      status: 'pending',
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'tutor_applications'), appData);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting tutor application:', error);
    throw new Error('Failed to submit application');
  }
};

export const checkExistingApplication = async (userId: string): Promise<TutorApplication | null> => {
  if (isDemoModeEnabled) {
    return demoApplicationsStore.find(app => app.userId === userId) || null;
  }

  try {
    const q = query(
      collection(db, 'tutor_applications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as TutorApplication;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking application:', error);
    return null;
  }
};

export const checkIfUserIsTutor = async (userId: string): Promise<TutorProfile | null> => {
  if (isDemoModeEnabled) {
    return demoTutorsStore.find(t => t.userId === userId) || null;
  }

  try {
    const q = query(
      collection(db, 'tutors'),
      where('userId', '==', userId),
      where('isVerified', '==', true)
    );

    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      return {
        id: doc.id,
        ...doc.data(),
      } as TutorProfile;
    }
    
    return null;
  } catch (error) {
    console.error('Error checking tutor status:', error);
    return null;
  }
};

export const updateTutorOnlineStatus = async (
  tutorId: string,
  isOnline: boolean
): Promise<void> => {
  if (isDemoModeEnabled) {
    const tutor = demoTutorsStore.find(t => t.id === tutorId);
    if (tutor) {
      tutor.isOnline = isOnline;
      tutor.updatedAt = Date.now();
    }
    return;
  }

  try {
    const tutorRef = doc(db, 'tutors', tutorId);
    await updateDoc(tutorRef, {
      isOnline,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating online status:', error);
    throw new Error('Failed to update status');
  }
};
