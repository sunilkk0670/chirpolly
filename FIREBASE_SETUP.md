# Firebase Setup Guide

## Overview
ChirPolly uses Firebase for authentication and Firestore for user data storage.

## Configuration

### Environment Variables
Create a `.env.local` file in the project root with the following variables:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
```

**Note:** `.env.local` is gitignored for security. Never commit API keys to version control.

## Firebase Features Enabled

### Authentication Methods
- ✅ Email/Password authentication
- ✅ Google OAuth Sign-In
- ✅ Email verification
- ✅ Password reset functionality

### Firestore Database
- ✅ User collection with user profiles
- ✅ Security rules configured for user data privacy
- ✅ Server timestamps for audit trails

## Firestore Security Rules

Update your Firestore security rules in the Firebase Console to include all collections:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User profiles - only owner can read/write
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    // Social feed posts - anyone can read, authenticated users can write their own
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Comments - anyone can read, authenticated users can write their own
    match /comments/{commentId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow delete: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    // Likes - anyone can read, authenticated users can manage their own
    match /likes/{likeId} {
      allow read: if true;
      allow create, delete: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    // Tutor profiles - anyone can read verified tutors, only owner can write
    match /tutors/{tutorId} {
      allow read: if resource.data.isVerified == true;
      allow write: if request.auth.uid == resource.data.userId;
    }
    
    // Tutor applications - only owner can read/write their application
    match /tutor_applications/{applicationId} {
      allow read, write: if request.auth.uid == resource.data.userId;
      allow create: if request.auth.uid == request.resource.data.userId;
    }
    
    // Bookings - student and tutor can read/write their bookings
    match /bookings/{bookingId} {
      allow read: if request.auth.uid == resource.data.studentId || 
                     request.auth.uid == resource.data.tutorId;
      allow create: if request.auth.uid == request.resource.data.studentId;
      allow update: if request.auth.uid == resource.data.studentId || 
                       request.auth.uid == resource.data.tutorId;
    }
    
    // Reviews - anyone can read, only students who completed sessions can write
    match /reviews/{reviewId} {
      allow read: if true;
      allow create: if request.auth.uid == request.resource.data.studentId;
      allow update, delete: if request.auth.uid == resource.data.studentId;
    }
  }
}
```

## User Data Structure

Users are stored in Firestore with the following structure:

```json
{
  "uid": "user_id",
  "email": "user@example.com",
  "displayName": "User Name (optional)",
  "photoURL": "profile_photo_url (optional)",
  "provider": "google | password",
  "createdAt": "server_timestamp"
}
```

## Demo Mode

When Firebase credentials are not configured (missing `VITE_FIREBASE_API_KEY`), the app runs in demo mode:
- Auto-authenticates with a demo user
- Shows a console warning
- Allows testing without Firebase setup

To disable demo mode, ensure all Firebase environment variables are set in `.env.local`.

## Getting Started

1. Create Firebase project at https://console.firebase.google.com
2. Enable Authentication (Email/Password and Google)
3. Create Firestore Database
4. Copy Firebase config to `.env.local`
5. Run `npm run dev`

## Troubleshooting

**Issue:** "Firebase not configured" warning
- **Solution:** Ensure `.env.local` exists with all Firebase credentials

**Issue:** Google Sign-In not working
- **Solution:** Verify Google OAuth is enabled in Firebase Console → Authentication → Sign-in method

**Issue:** User data not saving
- **Solution:** Check Firestore security rules and ensure user is authenticated

## References
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Authentication Docs](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
