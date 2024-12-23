'use client'
import { useState, useEffect } from 'react';
import Image from "next/image";
import BrokenChain from "./assets/images/breakChain.png";
import Link from 'next/link';
import Cookies from 'universal-cookie';

const cookie = new Cookies();

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const SignedCookie = cookie.get("signedIn");
    setIsSignedIn(Boolean(SignedCookie));
  }, []);

  return (
    <main className="bg-black min-h-screen dm-sans text-white overflow-hidden">
      {/* Interactive Header */}
      <header className="sticky top-0 left-0 right-0 h-auto md:h-[10vh] z-20">
        <div className="bg-black/80 backdrop-blur-md border-b border-white/10">
          <div className="container mx-auto px-4 py-4 md:px-6 md:h-[10vh]">
            <div className="flex items-center justify-between h-full">
              <div className="flex items-center gap-2 group cursor-pointer">
                <span className="text-lg md:text-xl font-medium relative after:content-[''] after:absolute after:h-0.5 after:bg-white after:w-0 after:left-0 after:bottom-0 after:transition-all after:duration-300 group-hover:after:w-full">
                  _HabitForge
                </span>
              </div>

              <nav className="hidden md:flex items-center gap-8">
                {["Features", "About", "Contact"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-sm text-white/70 hover:text-white transition-all duration-300 relative py-2
                             after:content-[''] after:absolute after:h-0.5 after:bg-white after:w-0 after:left-0 
                             after:bottom-0 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    {item}
                  </a>
                ))}
              </nav>

              <div className="hidden md:flex items-center gap-6">
                <a href="."
                   className="text-sm text-white/70 hover:text-white transition-all duration-300 relative
                            after:content-[''] after:absolute after:h-0.5 after:bg-white after:w-0 after:left-0 
                            after:bottom-0 after:transition-all after:duration-300 hover:after:w-full">
                  Sign in
                </a>
                <a
                  href="."
                  className="text-sm px-6 py-2.5 bg-white text-black rounded-full transition-all duration-300
                           hover:bg-black hover:text-white hover:ring-2 hover:ring-white hover:ring-offset-2 
                           hover:ring-offset-black"
                >
                  Launch App
                </a>
              </div>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-white focus:outline-none"
              >
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white my-1 transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </button>
            </div>
          </div>
        </div>

        <div className={`md:hidden bg-black/95 backdrop-blur-md transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen' : 'max-h-0'}`}>
          <div className="container mx-auto px-6 py-4 space-y-4">
            {["Features", "About", "Contact"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="block text-white/70 hover:text-white transition-all duration-300 py-2"
              >
                {item}
              </a>
            ))}
            <div className="pt-4 space-y-4">
              <a href="." className="block text-white/70 hover:text-white transition-all duration-300 py-2">
                Sign in
              </a>
              <a href="." className="block text-center px-6 py-2.5 bg-white text-black rounded-full transition-all duration-300">
                Launch App
              </a>
            </div>
          </div>
        </div>
      </header>
      
      <div className="relative container mx-auto px-4 min-h-[90vh]">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between pt-8 md:pt-0 min-h-[90vh] gap-8 lg:gap-0">
          <div className="w-full lg:w-1/2 space-y-6 md:space-y-8 text-center lg:text-left z-10">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight
                         hover:tracking-wide transition-all duration-500 cursor-default px-4 md:px-0">
              REFORGE YOUR HABITS
            </h1>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl mx-auto lg:mx-0 px-4 md:px-0
                       hover:text-white transition-all duration-300 cursor-default">
              Break chains. Build Strength. Every day counts on your journey to success.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center lg:justify-start px-4 md:px-0">
              <Link
                href={isSignedIn ? "/home" : "/signUp"} 
                className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 bg-white text-black rounded-full 
                         transition-all duration-300 overflow-hidden hover:scale-105 w-full sm:w-auto"
              >
                <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                  Get Started
                </span>
                <div className="absolute inset-0 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </Link>
              
              <Link
                href={isSignedIn?"/home":"/signIn"}
                className="group inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-full border border-white/20 
                         text-white hover:bg-white/10 transition-all duration-300 hover:border-white hover:scale-105 w-full sm:w-auto"
              >
                <span>{isSignedIn?"Dashboard":"Sign In"}</span>
                <svg 
                  className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>

          <div className="relative w-full lg:absolute lg:right-0 lg:top-0 lg:h-[90vh] lg:w-1/2 flex justify-center items-center">
            <Image
              src={BrokenChain}
              alt="Breaking free from chains - symbolizing breaking bad habits"
              className="w-[60vh] sm:w-[70vh] md:w-[80vh] lg:w-[90vh] h-auto -rotate-90 pulse-saturation interactive-image cursor-pointer"
              priority
              quality={90}
            />
          </div>
        </div>
      </div>
    </main>
  );
}