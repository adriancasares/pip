import { Auth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import Button from "../Button";
import TextInput from "./TextInput";

export default function Login(props: { auth: Auth }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    setLoading(true);

    signInWithEmailAndPassword(props.auth, email, password)
      .then((userCredential) => {})
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <div className="w-screen h-screen">
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="max-w-lg w-full flex flex-col gap-4">
          <h1 className="text-2xl font-semibold">Enter the PIP Matrix</h1>
          <form
            className="bg-mono-container-light p-8 max-w-lg w-full flex flex-col gap-8 rounded-md shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            <TextInput
              label="Email"
              placeholder="Email"
              value={email}
              onChange={setEmail}
              disabled={loading}
            />
            <TextInput
              label="Password"
              placeholder="Password"
              value={password}
              onChange={setPassword}
              password
              disabled={loading}
            />
            <div className="mx-auto">
              <Button type="submit" loading={loading}>
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
