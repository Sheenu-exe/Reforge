'use client'
import React from 'react';
import Cookies from 'universal-cookie';
import { auth } from '@/lib/firebase.config';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { GiBreakingChain } from "react-icons/gi";


const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const cookies = new Cookies();
    const router = useRouter();
    
    const handleSignIn = async (event) => {
      event.preventDefault();
      try{
        await signInWithEmailAndPassword(auth, email, password);
        cookies.set("signedIn", true, {path: "/"});
        console.log("User has signed in successfully!");
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
        <div className="flex justify-center text-5xl ">
        <GiBreakingChain className='bg-zinc-700/50 p-1 rounded-md'/>
        </div>

        {/* Brand name */}
        <div className="text-center mb-2">
          <h1 className="text-xl dm-sans font-semibold">Reforge</h1>
        </div>

        {/* Input fields */}
        <div className="space-y-4">
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
        <button onClick={handleSignIn} className="w-full dm-sans p-3 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors">
          Sign In
        </button>

       

        {/* Sign up link */}
        <div className="text-center text-sm text-zinc-500">
          Don't have an account?{' '}
          <a href="/signUp" className="text-white hover:underline">
            Sign up, it's free!
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignIn;