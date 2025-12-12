/**
 * Test script to create sample documents in Firestore collections
 * This will trigger index building in Firebase Console
 * 
 * Run with: npx tsx scripts/create-test-data.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, Timestamp } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env.local
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

// Your Firebase config (from .env.local)
const firebaseConfig = {
    apiKey: envVars.VITE_FIREBASE_API_KEY,
    authDomain: envVars.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: envVars.VITE_FIREBASE_PROJECT_ID,
    storageBucket: envVars.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: envVars.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: envVars.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function createTestData() {
    console.log('Creating test documents to trigger index building...\n');

    try {
        // 1. Create a test session
        const sessionRef = await addDoc(collection(db, 'sessions'), {
            tutorId: 'test-tutor-1',
            tutorName: 'Test Tutor',
            studentId: 'test-student-1',
            studentName: 'Test Student',
            scheduledStart: Timestamp.now(),
            scheduledEnd: Timestamp.fromMillis(Date.now() + 3600000), // 1 hour later
            duration: 60,
            timezone: 'Asia/Kolkata',
            language: { code: 'es', name: 'Spanish' },
            status: 'pending',
            pricing: {
                tutorRate: 50,
                sessionPrice: 50,
                platformFee: 10,
                tutorPayout: 40,
                currency: 'USD',
            },
            paymentStatus: 'pending',
            createdAt: Timestamp.now(),
        });
        console.log('✅ Created test session:', sessionRef.id);

        // 2. Create a test review
        const reviewRef = await addDoc(collection(db, 'reviews'), {
            sessionId: sessionRef.id,
            tutorId: 'test-tutor-1',
            studentId: 'test-student-1',
            studentName: 'Test Student',
            rating: 5,
            comment: 'Great session!',
            language: 'Spanish',
            wasVerifiedSession: true,
            createdAt: Timestamp.now(),
        });
        console.log('✅ Created test review:', reviewRef.id);

        // 3. Create a test notification
        const notificationRef = await addDoc(collection(db, 'notifications'), {
            userId: 'test-student-1',
            type: 'booking_confirmed',
            title: 'Session Confirmed',
            body: 'Your session has been confirmed',
            read: false,
            createdAt: Timestamp.now(),
        });
        console.log('✅ Created test notification:', notificationRef.id);

        // 4. Create a test payout
        const payoutRef = await addDoc(collection(db, 'payouts'), {
            tutorId: 'test-tutor-1',
            amount: 40,
            currency: 'USD',
            status: 'pending',
            sessionIds: [sessionRef.id],
            payoutMethod: 'stripe',
            createdAt: Timestamp.now(),
        });
        console.log('✅ Created test payout:', payoutRef.id);

        // 5. Create a test conversation
        const conversationRef = await addDoc(collection(db, 'conversations'), {
            id: 'test-tutor-1_test-student-1',
            participants: {
                tutorId: 'test-tutor-1',
                studentId: 'test-student-1',
            },
            lastMessage: {
                text: 'Hello!',
                sentBy: 'test-student-1',
                timestamp: Timestamp.now(),
            },
            unreadCount: {
                'test-tutor-1': 1,
                'test-student-1': 0,
            },
            createdAt: Timestamp.now(),
        });
        console.log('✅ Created test conversation:', conversationRef.id);

        // 6. Create a test message (subcollection)
        const messageRef = await addDoc(
            collection(db, 'conversations', conversationRef.id, 'messages'),
            {
                conversationId: conversationRef.id,
                senderId: 'test-student-1',
                senderName: 'Test Student',
                text: 'Hello, I have a question about the session.',
                timestamp: Timestamp.now(),
                read: false,
            }
        );
        console.log('✅ Created test message:', messageRef.id);

        console.log('\n✅ All test documents created successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Go to Firebase Console → Firestore → Indexes');
        console.log('2. Wait 1-5 minutes for indexes to start building');
        console.log('3. Indexes will show status: Building → Enabled');
        console.log('\n🔗 https://console.firebase.google.com/project/elaborate-tube-476605-p2/firestore/indexes');

    } catch (error) {
        console.error('❌ Error creating test data:', error);
    }
}

createTestData();
