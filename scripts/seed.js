#!/usr/bin/env node

// Seed script: inserts the 11 static markers into Cloud Firestore (a4g-2026).
// Usage: node scripts/seed.js [optional: email password]

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, Timestamp } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyBLxXlJl4zT-slnoVnBVj9qfg1V5AB6A-I',
  authDomain: 'a4g-2026.firebaseapp.com',
  projectId: 'a4g-2026',
  storageBucket: 'a4g-2026.firebasestorage.app',
  messagingSenderId: '303798777456',
  appId: '1:303798777456:web:29f0366c34ec4e43bde6b5',
  measurementId: 'G-37MB828YFK',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const MARKERS = [
  {
    id: '1',
    lat: 55.86156842949501,
    lng: -4.242320186831703,
    intoxicated: true,
    distressed: true,
    vulnerable: true,
  },
  {
    id: '2',
    lat: 55.864237,
    lng: -4.251806,
    intoxicated: false,
    distressed: true,
    vulnerable: false,
  },
  {
    id: '3',
    lat: 55.860916,
    lng: -4.251433,
    intoxicated: true,
    distressed: false,
    vulnerable: false,
  },
  {
    id: '4',
    lat: 55.858422,
    lng: -4.259468,
    intoxicated: false,
    distressed: true,
    vulnerable: true,
  },
  {
    id: '5',
    lat: 55.866149,
    lng: -4.238214,
    intoxicated: true,
    distressed: true,
    vulnerable: false,
  },
  {
    id: '6',
    lat: 55.863993,
    lng: -4.244831,
    intoxicated: false,
    distressed: false,
    vulnerable: true,
  },
  {
    id: '7',
    lat: 55.859902,
    lng: -4.246512,
    intoxicated: true,
    distressed: false,
    vulnerable: true,
  },
  {
    id: '8',
    lat: 55.867721,
    lng: -4.255098,
    intoxicated: true,
    distressed: true,
    vulnerable: true,
  },
  {
    id: '9',
    lat: 55.862431,
    lng: -4.235991,
    intoxicated: false,
    distressed: true,
    vulnerable: false,
  },
  {
    id: '10',
    lat: 55.85732,
    lng: -4.243801,
    intoxicated: true,
    distressed: false,
    vulnerable: false,
  },
  {
    id: '11',
    lat: 55.865003,
    lng: -4.24111,
    intoxicated: false,
    distressed: false,
    vulnerable: true,
  },
];

function calculatePriority(conditions) {
  const activeCount = Object.values(conditions).filter(Boolean).length;
  if (activeCount === 3) return 'high';
  if (activeCount === 2) return 'medium';
  return 'low';
}

async function seed() {
  const email = process.argv[2] || process.env.SEED_EMAIL;
  const password = process.argv[3] || process.env.SEED_PASSWORD;

  if (email && password) {
    console.log(`Authenticating as ${email}...`);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Authenticated successfully!');
    } catch (err) {
      console.warn(`Authentication notice: ${err.message}. Proceeding with push...`);
    }
  }

  console.log(`Connecting to Firebase project: "${firebaseConfig.projectId}"...`);
  console.log('Pushing 11 markers to Cloud Firestore collection "/markers"...\n');
  let successCount = 0;

  for (const m of MARKERS) {
    try {
      const conditions = {
        intoxicated: m.intoxicated,
        distressed: m.distressed,
        vulnerable: m.vulnerable,
      };
      const priority = calculatePriority(conditions);

      const markerRef = doc(db, 'markers', m.id);
      await setDoc(markerRef, {
        id: m.id,
        location: {
          latitude: m.lat,
          longitude: m.lng,
        },
        conditions,
        priority,
        time: Timestamp.fromDate(new Date()),
        status: 'open',
        acceptedById: null,
        acceptedByName: null,
        acceptedAt: null,
      });
      console.log(
        `  ✓ Created marker ${m.id} [Priority: ${priority.toUpperCase()}] at (${m.lat}, ${m.lng})`
      );
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed to push marker ${m.id}: ${err.message}`);
    }
  }

  if (successCount === MARKERS.length) {
    console.log(`\n🎉 Successfully pushed all ${successCount} markers to Firestore!`);
  } else {
    console.log(`\nPushed ${successCount}/${MARKERS.length} markers.`);
    console.log(
      'Tip: If permission is denied, ensure Cloud Firestore rules are published in Firebase Console:\n' +
        'https://console.firebase.google.com/project/a4g-2026/firestore/rules\n'
    );
  }

  process.exit(0);
}

seed();
