# Firestore Indexes Required

## Overview
These composite indexes are required for efficient querying of the tutor marketplace collections. Create these in the Firebase Console.

## How to Create Indexes

1. Go to [Firebase Console](https://console.firebase.google.com/project/elaborate-tube-476605-p2/firestore/indexes)
2. Click **Indexes** tab
3. Click **Add Index**
4. Enter the collection name and fields as specified below
5. Click **Create**

---

## Required Indexes

### 1. Sessions Collection

#### Index 1: Tutor's Sessions by Status and Date
```
Collection: sessions
Fields:
  - tutorId (Ascending)
  - status (Ascending)
  - scheduledStart (Descending)
```
**Purpose**: Query tutor's upcoming/past sessions efficiently

#### Index 2: Student's Sessions by Status and Date
```
Collection: sessions
Fields:
  - studentId (Ascending)
  - status (Ascending)
  - scheduledStart (Descending)
```
**Purpose**: Query student's upcoming/past sessions efficiently

#### Index 3: All Upcoming Sessions
```
Collection: sessions
Fields:
  - status (Ascending)
  - scheduledStart (Ascending)
```
**Purpose**: Admin view of all upcoming sessions

---

### 2. Messages Subcollection

#### Index 4: Conversation Messages by Time
```
Collection: conversations/{conversationId}/messages
Fields:
  - conversationId (Ascending)
  - timestamp (Descending)
```
**Purpose**: Load messages in reverse chronological order

---

### 3. Reviews Collection

#### Index 5: Tutor Reviews by Date
```
Collection: reviews
Fields:
  - tutorId (Ascending)
  - createdAt (Descending)
```
**Purpose**: Display tutor's reviews newest first

#### Index 6: Student Reviews by Date
```
Collection: reviews
Fields:
  - studentId (Ascending)
  - createdAt (Descending)
```
**Purpose**: Display student's submitted reviews

---

### 4. Notifications Collection

#### Index 7: User Notifications by Read Status and Date
```
Collection: notifications
Fields:
  - userId (Ascending)
  - read (Ascending)
  - createdAt (Descending)
```
**Purpose**: Show unread notifications first, then read ones

---

### 5. Payouts Collection

#### Index 8: Tutor Payouts by Status and Date
```
Collection: payouts
Fields:
  - tutorId (Ascending)
  - status (Ascending)
  - createdAt (Descending)
```
**Purpose**: Query tutor's pending/completed payouts

---

## Automatic Index Creation

Alternatively, you can trigger automatic index creation by:

1. Running queries in your app that need these indexes
2. Firebase will show an error with a link to create the index
3. Click the link to auto-create the index

**Note**: Automatic creation is slower but ensures you only create indexes you actually use.

---

## Index Status

After creating indexes, they will show as "Building" for a few minutes. Wait until all indexes show "Enabled" before deploying your app to production.

---

## Verification

To verify indexes are working:

1. Go to Firebase Console → Firestore → Indexes
2. Check that all indexes show status: **Enabled**
3. Test queries in your app
4. Check Firebase Console → Firestore → Usage tab for query performance
