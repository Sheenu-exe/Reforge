'use client'
import React from 'react';
import Cookies from 'universal-cookie';
import { auth } from '@/lib/firebase.config';
import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { updateProfile } from 'firebase/auth';
const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
    const cookies = new Cookies();
    const router = useRouter();
    
    const handleSignUp = async (event) => {
      event.preventDefault();
      try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
            displayName: username,
          });    
        cookies.set("signedIn", true, {path: "/"});
        console.log("User has signed Up successfully!");
        router.push("/home");
      } catch (error){
        console.error(error.message);
      }
    }
  return (
    <div className="bg-starry dm-sans min-h-screen text-white flex flex-col justify-center items-center bg-gradient-to-b from-zinc-900 to-black relative">
      {/* Stars background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/stars.png')] opacity-50" />
      </div>

      <div className="w-full max-w-md p-8 rounded-2xl bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 flex flex-col space-y-6 relative z-10">
        {/* Logo/Icon */}
        <div className="flex justify-center mb-2">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center mb-2">
          <h1 className="text-xl dm-sans font-semibold">Bento Social</h1>
        </div>

        {/* Input fields */}
        <div className="space-y-4">
        <input
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full dm-sans p-3 rounded-lg bg-black/40 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors placeholder-zinc-500"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full dm-sans p-3 rounded-lg bg-black/40 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors placeholder-zinc-500"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full dm-sans p-3 rounded-lg bg-black/40 border border-zinc-800 focus:border-zinc-600 focus:outline-none transition-colors placeholder-zinc-500"
          />
        </div>

        {/* Sign in button */}
        <button onClick={handleSignUp} className="w-full dm-sans p-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors">
          Sign Up
        </button>

        {/* Google sign in */}
        <button className="w-full dm-sans p-3 bg-transparent border border-zinc-800 rounded-lg font-medium hover:bg-white/5 transition-colors flex items-center justify-center space-x-2">
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>Sign in with Google</span>
        </button>

        {/* Sign up link */}
        <div className="text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <a href="#" className="text-white hover:underline">
            Sign up, it's free!
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUp;