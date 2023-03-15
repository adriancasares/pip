import React from "react";
import { initializeApp } from "firebase/app";
// @ts-ignore
import { useAuthState } from "react-firebase-hooks/auth/dist/index.cjs.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import Login from "./Login";
import CreateNewsletterPanel from "./newsletter/CreateNewsletterPanel";
import { MantineProvider } from "@mantine/core";

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
    <MantineProvider>
      <div>
        {/* either show a login page or the panel */}
        {user ? <CreateNewsletterPanel id="new" /> : <Login auth={auth} />}
      </div>
    </MantineProvider>
  );
}
