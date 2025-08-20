import { auth, signUpWithEmail, signInWithEmail } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

interface UserData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const registerUser = async (userData: UserData): Promise<{success: boolean, error?: string}> => {
  try {
    // Create user with email and password
    const userCredential = await signUpWithEmail(userData.email, userData.password);
    const user = userCredential.user;
    
    console.log('User created successfully:', user.uid);
    
    try {
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        createdAt: new Date().toISOString(),
      });
      
      console.log('User data stored in Firestore successfully');
      return { success: true };
    } catch (firestoreError) {
      console.error('Error storing user data in Firestore:', firestoreError);
      return { success: false, error: 'Failed to store user data. Please check Firestore rules.' };
    }
  } catch (error: unknown) {
    console.error('Error registering user:', error);
    const errorMessage = error instanceof Error ? error.message : 'Registration failed';
    return { success: false, error: errorMessage };
  }
};

export const loginUser = async (email: string, password: string): Promise<boolean> => {
  try {
    await signInWithEmail(email, password);
    return true;
  } catch (error) {
    console.error('Error logging in:', error);
    return false;
  }
};

export const getCurrentUser = () => {
  return auth.currentUser;
};