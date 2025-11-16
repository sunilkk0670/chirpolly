import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isDemoModeEnabled } from '../services/firebase';
import { createBooking, checkTutorAvailability } from '../services/bookingService';
import { Button } from './common/Button';
import type { TutorProfile } from '../types';

interface BookingModalProps {
  tutor: TutorProfile;
  onSuccess: () => void;
  onCancel: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ tutor, onSuccess, onCancel }) => {
  const [firebaseUser] = useAuthState(auth);
  const user = isDemoModeEnabled ? {
    uid: 'demo-user-123',
    email: 'demo@chirpolly.app',
    displayName: 'Demo User',
  } : firebaseUser;

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Get available time slots based on tutor's availability
  const getAvailableTimes = () => {
    if (!selectedDate) return [];
    
    const date = new Date(selectedDate);
    const dayOfWeek = date.getDay();
    
    // Find availability for this day
    const dayAvailability = tutor.availability.filter(slot => slot.dayOfWeek === dayOfWeek);
    
    if (dayAvailability.length === 0) return [];
    
    // Generate time slots
    const times: string[] = [];
    dayAvailability.forEach(slot => {
      const [startHour, startMin] = slot.startTime.split(':').map(Number);
      const [endHour, endMin] = slot.endTime.split(':').map(Number);
      
      let currentHour = startHour;
      let currentMin = startMin;
      
      while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
        const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
        times.push(timeStr);
        
        // Increment by 30 minutes
        currentMin += 30;
        if (currentMin >= 60) {
          currentMin = 0;
          currentHour++;
        }
      }
    });
    
    return times;
  };

  const availableTimes = getAvailableTimes();

  const calculatePrice = () => {
    return (tutor.hourlyRate * duration) / 60;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be signed in to book a session');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    // Create Date object for the booking
    const [hours, minutes] = selectedTime.split(':').map(Number);
    const bookingDate = new Date(selectedDate);
    bookingDate.setHours(hours, minutes, 0, 0);

    // Check if booking is in the future
    if (bookingDate.getTime() < Date.now()) {
      setError('Please select a future date and time');
      return;
    }

    setIsSubmitting(true);
    try {
      // Check availability
      const isAvailable = await checkTutorAvailability(tutor.id, bookingDate, duration);
      
      if (!isAvailable) {
        setError('This time slot is no longer available. Please choose another time.');
        setIsSubmitting(false);
        return;
      }

      // Create booking
      await createBooking(
        user.uid,
        user.displayName || 'Anonymous',
        tutor.id,
        tutor.name,
        bookingDate,
        duration,
        calculatePrice(),
        notes
      );

      onSuccess();
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (3 months from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Book a Session</h2>
          <p className="text-gray-600 mt-1">with {tutor.name}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Select Date *
            </label>
            <input
              type="date"
              required
              min={getMinDate()}
              max={getMaxDate()}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime(''); // Reset time when date changes
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {selectedDate && availableTimes.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg text-sm">
              Tutor is not available on this day. Please select another date.
            </div>
          )}

          {selectedDate && availableTimes.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Time *
              </label>
              <select
                required
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">Choose a time</option>
                {availableTimes.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration *
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value={30}>30 minutes</option>
              <option value={60}>60 minutes</option>
              <option value={90}>90 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="What would you like to focus on?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
          </div>

          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Hourly Rate:</span>
              <span className="font-semibold text-gray-800">${tutor.hourlyRate}/hr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total:</span>
              <span className="text-lg font-bold text-teal-700">${calculatePrice().toFixed(2)}</span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              type="button"
              onClick={onCancel}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedDate || !selectedTime}
              className="bg-teal-500 hover:bg-teal-600"
            >
              {isSubmitting ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
