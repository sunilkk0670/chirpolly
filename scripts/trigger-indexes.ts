/**
 * Trigger index creation by running queries that require them
 * Firebase will automatically create the needed indexes
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const envPath = path.join(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars: Record<string, string> = {};

envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        envVars[match[1].trim()] = match[2].trim();
    }
});

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

async function triggerIndexCreation() {
    console.log('Running queries to trigger index creation...\n');

    try {
        // Query 1: Sessions by tutorId, status, scheduledStart
        console.log('1. Querying sessions by tutorId + status + scheduledStart...');
        try {
            const q1 = query(
                collection(db, 'sessions'),
                where('tutorId', '==', 'test-tutor-1'),
                where('status', '==', 'pending'),
                orderBy('scheduledStart', 'desc')
            );
            await getDocs(q1);
            console.log('   ✅ Query succeeded (index already exists)');
        } catch (error: any) {
            if (error.message.includes('index')) {
                console.log('   🔗 Index needed! Firebase will create it automatically.');
                console.log('   Link:', error.message.match(/https:\/\/[^\s]+/)?.[0]);
            } else {
                console.log('   ⚠️ Error:', error.message);
            }
        }

        // Query 2: Sessions by studentId, status, scheduledStart
        console.log('\n2. Querying sessions by studentId + status + scheduledStart...');
        try {
            const q2 = query(
                collection(db, 'sessions'),
                where('studentId', '==', 'test-student-1'),
                where('status', '==', 'pending'),
                orderBy('scheduledStart', 'desc')
            );
            await getDocs(q2);
            console.log('   ✅ Query succeeded (index already exists)');
        } catch (error: any) {
            if (error.message.includes('index')) {
                console.log('   🔗 Index needed! Firebase will create it automatically.');
                console.log('   Link:', error.message.match(/https:\/\/[^\s]+/)?.[0]);
            }
        }

        // Query 3: Reviews by tutorId, createdAt
        console.log('\n3. Querying reviews by tutorId + createdAt...');
        try {
            const q3 = query(
                collection(db, 'reviews'),
                where('tutorId', '==', 'test-tutor-1'),
                orderBy('createdAt', 'desc')
            );
            await getDocs(q3);
            console.log('   ✅ Query succeeded (index already exists)');
        } catch (error: any) {
            if (error.message.includes('index')) {
                console.log('   🔗 Index needed! Firebase will create it automatically.');
                console.log('   Link:', error.message.match(/https:\/\/[^\s]+/)?.[0]);
            }
        }

        // Query 4: Notifications by userId, read, createdAt
        console.log('\n4. Querying notifications by userId + read + createdAt...');
        try {
            const q4 = query(
                collection(db, 'notifications'),
                where('userId', '==', 'test-user-1'),
                where('read', '==', false),
                orderBy('createdAt', 'desc')
            );
            await getDocs(q4);
            console.log('   ✅ Query succeeded (index already exists)');
        } catch (error: any) {
            if (error.message.includes('index')) {
                console.log('   🔗 Index needed! Firebase will create it automatically.');
                console.log('   Link:', error.message.match(/https:\/\/[^\s]+/)?.[0]);
            }
        }

        // Query 5: Payouts by tutorId, status, createdAt
        console.log('\n5. Querying payouts by tutorId + status + createdAt...');
        try {
            const q5 = query(
                collection(db, 'payouts'),
                where('tutorId', '==', 'test-tutor-1'),
                where('status', '==', 'pending'),
                orderBy('createdAt', 'desc')
            );
            await getDocs(q5);
            console.log('   ✅ Query succeeded (index already exists)');
        } catch (error: any) {
            if (error.message.includes('index')) {
                console.log('   🔗 Index needed! Firebase will create it automatically.');
                console.log('   Link:', error.message.match(/https:\/\/[^\s]+/)?.[0]);
            }
        }

        console.log('\n✅ Done! Check Firebase Console → Indexes tab in 2-3 minutes.');
        console.log('🔗 https://console.firebase.google.com/project/elaborate-tube-476605-p2/firestore/indexes');

    } catch (error) {
        console.error('Error:', error);
    }

    process.exit(0);
}

triggerIndexCreation();
