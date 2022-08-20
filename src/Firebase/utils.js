import React, { useState, useEffect } from "react";

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";

//Firebase SDK - this is the web app's configuration which can also be found in the Firebase project under its own project settings
const firebaseConfig = {
  apiKey: process.env.REACT_APP_apiKey,
  authDomain: process.env.REACT_APP_authDomain,
  projectId: process.env.REACT_APP_projectId,
  storageBucket: process.env.REACT_APP_storageBucket,
  messagingSenderId: process.env.REACT_APP_messagingSenderId,
  appId: process.env.REACT_APP_appId,
};

//Initializing Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth();
export const signInWithGoogle = new GoogleAuthProvider();
signInWithGoogle.setCustomParameters({ prompt: "select_account" });

//initializing if user is current user or not or a logged in user
export function useAuth() {
  const [isLoading, setIsLoading] = useState(true); // checking the user's status
  const [currentUser, setCurrentUser] = useState();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false); // finished checking
    });
    return unsub;
  }, []);

  return { currentUser, isLoading };
}
