import React from "react";
import { initializeApp } from "firebase/app";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { MantineProvider } from "@mantine/core";
import Login from "./Login";

export default function AdminPage() {
  const firebaseConfig = {
    apiKey: "AIzaSyDT2zJ1eF6s5tgG9c5QWjAweytP6csEyd8",
    authDomain: "lasapip.firebaseapp.com",
    projectId: "lasapip",
    storageBucket: "lasapip.appspot.com",
    messagingSenderId: "926294243161",
    appId: "1:926294243161:web:fb8777911116345356fe48",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const [user, loading, error] = useAuthState(auth);

  return (
    <div>
      {/* either show a login page or the panel */}
      {user ? <div>Panel</div> : <Login auth={auth} />}
    </div>
  );
}
