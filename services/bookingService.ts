import {
  collection,
  addDoc,
  updateDoc,
  doc,
  query,
  where,
  orderBy,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, isDemoModeEnabled } from './firebase';
import type { Booking } from '../types';

// In-memory storage for demo mode
let demoBookingsStore: Booking[] = [];
let demoIdCounter = 1;

// ============ BOOKINGS ============

export const createBooking = async (
  studentId: string,
  studentName: string,
  tutorId: string,
  tutorName: string,
  scheduledAt: Date,
  duration: number,
  price: number,
  notes?: string
): Promise<string> => {
  if (isDemoModeEnabled) {
    const bookingId = `demo-booking-${demoIdCounter++}`;
    const newBooking: Booking = {
      id: bookingId,
      studentId,
      studentName,
      tutorId,
      tutorName,
      scheduledAt: scheduledAt.getTime(),
      duration,
      price,
      status: 'pending',
      notes: notes || '',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    demoBookingsStore.push(newBooking);
    return bookingId;
  }

  try {
    const bookingData = {
      studentId,
      studentName,
      tutorId,
      tutorName,
      scheduledAt: Timestamp.fromDate(scheduledAt),
      duration,
      price,
      status: 'pending',
      notes: notes || '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, 'bookings'), bookingData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

export const fetchUserBookings = async (
  userId: string,
  role: 'student' | 'tutor'
): Promise<Booking[]> => {
  if (isDemoModeEnabled) {
    const field = role === 'student' ? 'studentId' : 'tutorId';
    return demoBookingsStore
      .filter(b => b[field] === userId)
      .sort((a, b) => {
        const timeA = typeof a.scheduledAt === 'number' ? a.scheduledAt : a.scheduledAt.toMillis();
        const timeB = typeof b.scheduledAt === 'number' ? b.scheduledAt : b.scheduledAt.toMillis();
        return timeB - timeA;
      });
  }

  try {
    const field = role === 'student' ? 'studentId' : 'tutorId';
    const q = query(
      collection(db, 'bookings'),
      where(field, '==', userId),
      orderBy('scheduledAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];

    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
      } as Booking);
    });

    return bookings;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return [];
  }
};

export const updateBookingStatus = async (
  bookingId: string,
  status: 'confirmed' | 'completed' | 'cancelled',
  meetingLink?: string
): Promise<void> => {
  if (isDemoModeEnabled) {
    const booking = demoBookingsStore.find(b => b.id === bookingId);
    if (booking) {
      booking.status = status;
      booking.updatedAt = Date.now();
      if (meetingLink) {
        booking.meetingLink = meetingLink;
      }
    }
    return;
  }

  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };
    
    if (meetingLink) {
      updateData.meetingLink = meetingLink;
    }

    await updateDoc(bookingRef, updateData);
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw new Error('Failed to update booking');
  }
};

export const checkTutorAvailability = async (
  tutorId: string,
  requestedTime: Date,
  duration: number
): Promise<boolean> => {
  if (isDemoModeEnabled) {
    // Check if there's any overlapping booking for this tutor
    const requestedStart = requestedTime.getTime();
    const requestedEnd = requestedStart + duration * 60 * 1000;

    const hasConflict = demoBookingsStore.some(booking => {
      if (booking.tutorId !== tutorId || booking.status === 'cancelled') {
        return false;
      }

      const bookingStart = typeof booking.scheduledAt === 'number' 
        ? booking.scheduledAt 
        : booking.scheduledAt.toMillis();
      const bookingEnd = bookingStart + booking.duration * 60 * 1000;

      // Check for overlap
      return (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      );
    });

    return !hasConflict;
  }

  try {
    // Get all bookings for this tutor on the requested date
    const startOfDay = new Date(requestedTime);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedTime);
    endOfDay.setHours(23, 59, 59, 999);

    const q = query(
      collection(db, 'bookings'),
      where('tutorId', '==', tutorId),
      where('status', 'in', ['pending', 'confirmed']),
      where('scheduledAt', '>=', Timestamp.fromDate(startOfDay)),
      where('scheduledAt', '<=', Timestamp.fromDate(endOfDay))
    );

    const querySnapshot = await getDocs(q);
    const requestedStart = requestedTime.getTime();
    const requestedEnd = requestedStart + duration * 60 * 1000;

    // Check for conflicts
    let hasConflict = false;
    querySnapshot.forEach((doc) => {
      const booking = doc.data() as Booking;
      const bookingStart = booking.scheduledAt.toMillis();
      const bookingEnd = bookingStart + booking.duration * 60 * 1000;

      if (
        (requestedStart >= bookingStart && requestedStart < bookingEnd) ||
        (requestedEnd > bookingStart && requestedEnd <= bookingEnd) ||
        (requestedStart <= bookingStart && requestedEnd >= bookingEnd)
      ) {
        hasConflict = true;
      }
    });

    return !hasConflict;
  } catch (error) {
    console.error('Error checking availability:', error);
    return false;
  }
};

export const getUpcomingBookings = async (
  userId: string,
  role: 'student' | 'tutor'
): Promise<Booking[]> => {
  if (isDemoModeEnabled) {
    const now = Date.now();
    const field = role === 'student' ? 'studentId' : 'tutorId';
    
    return demoBookingsStore
      .filter(b => {
        if (b[field] !== userId) return false;
        if (b.status === 'cancelled' || b.status === 'completed') return false;
        
        const scheduledTime = typeof b.scheduledAt === 'number' 
          ? b.scheduledAt 
          : b.scheduledAt.toMillis();
        
        return scheduledTime > now;
      })
      .sort((a, b) => {
        const timeA = typeof a.scheduledAt === 'number' ? a.scheduledAt : a.scheduledAt.toMillis();
        const timeB = typeof b.scheduledAt === 'number' ? b.scheduledAt : b.scheduledAt.toMillis();
        return timeA - timeB;
      })
      .slice(0, 5);
  }

  try {
    const now = new Date();
    const field = role === 'student' ? 'studentId' : 'tutorId';
    
    const q = query(
      collection(db, 'bookings'),
      where(field, '==', userId),
      where('status', 'in', ['pending', 'confirmed']),
      where('scheduledAt', '>', Timestamp.fromDate(now)),
      orderBy('scheduledAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    const bookings: Booking[] = [];

    querySnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data(),
      } as Booking);
    });

    return bookings.slice(0, 5);
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    return [];
  }
};
