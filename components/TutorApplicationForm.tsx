import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, isDemoModeEnabled } from '../services/firebase';
import { submitTutorApplication } from '../services/tutorService';
import { LANGUAGES } from '../constants';
import { Button } from './common/Button';
import type { AvailabilitySlot } from '../types';

interface TutorApplicationFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const TutorApplicationForm: React.FC<TutorApplicationFormProps> = ({ onSuccess, onCancel }) => {
  const [firebaseUser] = useAuthState(auth);
  const user = isDemoModeEnabled ? {
    uid: 'demo-user-123',
    email: 'demo@chirpolly.app',
    displayName: 'Demo User',
  } : firebaseUser;

  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    nativeLanguages: [] as string[],
    teachingLanguages: [] as string[],
    specialty: '',
    bio: '',
    hourlyRate: 25,
  });

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([
    { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' }
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLanguageToggle = (field: 'nativeLanguages' | 'teachingLanguages', code: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(code)
        ? prev[field].filter(c => c !== code)
        : [...prev[field], code]
    }));
  };

  const handleAddAvailability = () => {
    setAvailability([
      ...availability,
      { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', timezone: 'America/New_York' }
    ]);
  };

  const handleRemoveAvailability = (index: number) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const handleAvailabilityChange = (
    index: number,
    field: keyof AvailabilitySlot,
    value: any
  ) => {
    const updated = [...availability];
    updated[index] = { ...updated[index], [field]: value };
    setAvailability(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!user) {
      setError('You must be signed in to apply');
      return;
    }

    if (formData.nativeLanguages.length === 0) {
      setError('Please select at least one native language');
      return;
    }

    if (formData.teachingLanguages.length === 0) {
      setError('Please select at least one language you can teach');
      return;
    }

    if (availability.length === 0) {
      setError('Please add at least one availability slot');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitTutorApplication(
        user.uid,
        formData.name,
        formData.email,
        formData.nativeLanguages,
        formData.teachingLanguages,
        formData.specialty,
        formData.bio,
        formData.hourlyRate,
        availability
      );
      onSuccess();
    } catch (err) {
      setError('Failed to submit application. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800">Apply to Become a Tutor</h2>
          <p className="text-gray-600 mt-1">Share your expertise and help learners worldwide</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Specialty *
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Conversational French & Accent Correction"
                value={formData.specialty}
                onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Tell learners about your teaching experience and approach..."
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hourly Rate (USD) *
              </label>
              <input
                type="number"
                required
                min="10"
                max="200"
                value={formData.hourlyRate}
                onChange={(e) => setFormData({ ...formData, hourlyRate: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Languages</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Native Language(s) *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LANGUAGES.slice(0, 12).map(lang => (
                  <label key={lang.code} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.nativeLanguages.includes(lang.code)}
                      onChange={() => handleLanguageToggle('nativeLanguages', lang.code)}
                      className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-sm">{lang.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Can Teach *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LANGUAGES.slice(0, 12).map(lang => (
                  <label key={lang.code} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.teachingLanguages.includes(lang.code)}
                      onChange={() => handleLanguageToggle('teachingLanguages', lang.code)}
                      className="rounded border-gray-300 text-teal-500 focus:ring-teal-500"
                    />
                    <span className="text-sm">{lang.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Availability */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Availability</h3>
              <button
                type="button"
                onClick={handleAddAvailability}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                + Add Slot
              </button>
            </div>

            {availability.map((slot, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <select
                  value={slot.dayOfWeek}
                  onChange={(e) => handleAvailabilityChange(index, 'dayOfWeek', parseInt(e.target.value))}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {DAYS_OF_WEEK.map(day => (
                    <option key={day.value} value={day.value}>{day.label}</option>
                  ))}
                </select>

                <input
                  type="time"
                  value={slot.startTime}
                  onChange={(e) => handleAvailabilityChange(index, 'startTime', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                <span className="text-gray-500">to</span>

                <input
                  type="time"
                  value={slot.endTime}
                  onChange={(e) => handleAvailabilityChange(index, 'endTime', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />

                {availability.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveAvailability(index)}
                    className="text-red-500 hover:text-red-600 ml-auto"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Actions */}
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
              disabled={isSubmitting}
              className="bg-green-500 hover:bg-green-600"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
