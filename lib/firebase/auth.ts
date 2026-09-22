import { auth, googleProvider } from './config';
import { signInWithPopup, signOut as fbSignOut, User } from 'firebase/auth';

/**
 * Đăng nhập bằng Google Popup qua Firebase
 */
export async function signInWithGoogleFirebase(): Promise<{ user: User | null; error: Error | null }> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error('Firebase Google Sign-in Error:', error);
    return { user: null, error };
  }
}

/**
 * Đăng xuất Firebase
 */
export async function signOutFirebase(): Promise<{ error: Error | null }> {
  try {
    await fbSignOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error };
  }
}
