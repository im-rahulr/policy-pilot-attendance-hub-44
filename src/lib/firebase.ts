// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, updateProfile, User as FirebaseUser } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, collection, addDoc, query, where, getDocs, updateDoc, deleteDoc, Timestamp } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFXmBmp1PQj8t8dvNXO9Oxo_EDH_gA9H0",
  authDomain: "lowrybunks.firebaseapp.com",
  projectId: "lowrybunks",
  storageBucket: "lowrybunks.firebasestorage.app",
  messagingSenderId: "478893205727",
  appId: "1:478893205727:web:83665f1d2cb4000531e16a",
  measurementId: "G-F37REFJL8Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  role: 'student' | 'teacher' | 'admin'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  code: string
  description?: string
  teacher_id: string
  created_at: string
  updated_at: string
}

export interface Class {
  id: string
  subject_id: string
  teacher_id: string
  name: string
  period: string
  date: string
  created_at: string
  updated_at: string
}

export interface AttendanceRecord {
  id: string
  user_id: string
  class_id: string
  status: 'present' | 'absent' | 'late'
  marked_at: string
  marked_by: string
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  subjects?: Subject[]
  attendance_rate?: number
  total_classes?: number
}

// Firebase Auth helpers
export const createUser = async (email: string, password: string, fullName: string, role: 'student' | 'teacher' = 'student') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, {
    displayName: fullName
  });
  
  // Create user profile in Firestore
  await setDoc(doc(db, 'users', userCredential.user.uid), {
    email,
    full_name: fullName,
    role,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  });
  
  return userCredential;
};

export const signInUser = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => {
  return await signOut(auth);
};

export const resetUserPassword = async (email: string) => {
  return await sendPasswordResetEmail(auth, email);
};

export const getUserProfile = async (userId: string): Promise<User | null> => {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return { id: userId, ...userDoc.data() } as User;
  }
  return null;
};