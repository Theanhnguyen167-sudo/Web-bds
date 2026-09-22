import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export const firebaseConfig = {
  apiKey: "AIzaSyDwucqCf_hTJHBZxoafY2uaiy2hHGwo4qs",
  authDomain: "hanoi-realty.firebaseapp.com",
  projectId: "hanoi-realty",
  storageBucket: "hanoi-realty.firebasestorage.app",
  messagingSenderId: "768749724447",
  appId: "1:768749724447:web:daf873332be0abcd67862a"
};

// Khởi tạo app (tránh init nhiều lần khi hot reload)
export const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });
