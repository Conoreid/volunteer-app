import { collection, query, where, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/FirebaseConfig';
import { type UserProfile } from '@/types';

const USERS_COLLECTION = 'users';

/**
 * Authenticates a user by matching email and password against the Firestore `users` collection.
 */
export async function loginWithFirestore(
  emailInput: string,
  passwordInput: string
): Promise<UserProfile> {
  const cleanEmail = emailInput.trim();
  if (!cleanEmail || !passwordInput) {
    throw new Error('Please enter both email and password.');
  }

  // Query users collection by email (checking exact and lowercase)
  const usersRef = collection(db, USERS_COLLECTION);
  let q = query(usersRef, where('email', '==', cleanEmail));
  let snapshot = await getDocs(q);

  if (snapshot.empty) {
    // Try lowercase email fallback
    q = query(usersRef, where('email', '==', cleanEmail.toLowerCase()));
    snapshot = await getDocs(q);
  }

  if (snapshot.empty) {
    throw new Error('User not found with this email.');
  }

  const userDoc = snapshot.docs[0];
  const userData = userDoc.data();

  // Compare passwords
  if (userData.password !== passwordInput) {
    throw new Error('Invalid password. Please try again.');
  }

  const userProfile: UserProfile = {
    id: userDoc.id,
    email: userData.email,
    name: userData.name ?? userData.displayName ?? 'Volunteer',
    displayName: userData.displayName ?? userData.name ?? 'Volunteer',
    role: userData.role ?? 'volunteer',
    ...userData,
  };

  // Remove raw password from memory in user profile object
  delete (userProfile as any).password;

  return userProfile;
}

/**
 * Updates a user's password in Firestore after verifying their current password.
 */
export async function updateFirestorePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error('User not found.');
  }

  const userData = userSnap.data();
  if (userData.password !== currentPassword) {
    throw new Error('Current password is incorrect.');
  }

  await updateDoc(userRef, {
    password: newPassword,
  });
}

/**
 * Retrieves a user's profile from Firestore by their document ID.
 */
export async function fetchUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, USERS_COLLECTION, userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    return null;
  }

  const userData = userSnap.data();
  const profile: UserProfile = {
    id: userSnap.id,
    email: userData.email,
    name: userData.name ?? userData.displayName ?? 'Volunteer',
    displayName: userData.displayName ?? userData.name ?? 'Volunteer',
    role: userData.role ?? 'volunteer',
    ...userData,
  };
  delete (profile as any).password;
  return profile;
}
