#!/usr/bin/env node

// Seed script: inserts the 11 static markers into Cloud Firestore.
// Usage: node scripts/seed.js [optional: email password]

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc, Timestamp } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: 'AIzaSyBZseBXAb4bDrK8bOqqj-BVSVz-CihK3Ic',
  authDomain: 'volunteer-app-fe240.firebaseapp.com',
  projectId: 'volunteer-app-fe240',
  storageBucket: 'volunteer-app-fe240.firebasestorage.app',
  messagingSenderId: '898562480771',
  appId: '1:898562480771:web:88391c13a58c3f713159b6',
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

async function seed() {
  const email = process.argv[2] || process.env.SEED_EMAIL;
  const password = process.argv[3] || process.env.SEED_PASSWORD;

  if (email && password) {
    console.log(`Authenticating as ${email}...`);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Authenticated successfully!');
    } catch (err) {
      console.warn(`Authentication failed: ${err.message}. Proceeding unauthenticated...`);
    }
  }

  console.log('Seeding markers to Cloud Firestore...');
  let successCount = 0;

  for (const m of MARKERS) {
    try {
      const markerRef = doc(db, 'markers', m.id);
      await setDoc(markerRef, {
        location: {
          latitude: m.lat,
          longitude: m.lng,
        },
        conditions: {
          intoxicated: m.intoxicated,
          distressed: m.distressed,
          vulnerable: m.vulnerable,
        },
        time: Timestamp.fromDate(new Date()),
        status: 'open',
        acceptedById: null,
        acceptedByName: null,
        acceptedAt: null,
      });
      console.log(`  ✓ Created marker ${m.id} at ${m.lat}, ${m.lng}`);
      successCount++;
    } catch (err) {
      console.error(`  ✗ Failed to seed marker ${m.id}: ${err.message}`);
    }
  }

  if (successCount === MARKERS.length) {
    console.log(`\nSuccessfully seeded all ${successCount} markers!`);
  } else {
    console.log(`\nSeeded ${successCount}/${MARKERS.length} markers.`);
    console.log(
      'Tip: If permission denied, ensure Firestore rules allow writes or pass credentials: node scripts/seed.js user@example.com password'
    );
  }

  process.exit(0);
}

seed();
