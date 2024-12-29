'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/FeatureCard';

// Dynamically import LottieBackground
const LottieBackground = dynamic(() => import('@/components/ui/VideoBackground'), { ssr: false });

// Lazy-load Cookies
let Cookies;
if (typeof window !== 'undefined') {
  Cookies = require('universal-cookie');
}

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && Cookies) {
      const cookies = new Cookies();
      const signedIn = cookies.get('signedIn');
      setIsSignedIn(!!signedIn);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleScroll = () => setScrollY(window.scrollY);
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="relative text-white bg-black min-h-screen font-sans">
      {/* Lottie Background */}
      <motion.div style={{ opacity: backgroundOpacity }} className="fixed inset-0 w-full h-full">
        <LottieBackground phase={scrollY < 250 ? 'problem' : scrollY < 500 ? 'break' : 'solution'} />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/30" />
      <header className="h-[10vh] w-full fixed top-0 flex justify-center items-center">
        REFORGE
      </header>
      {/* Main Content */}
      <main className="relative z-10">
        {/* Hero Section */}
        <motion.section 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="min-h-screen flex flex-col justify-center items-center text-center px-4 sticky top-0"
        >
          <h1 className="text-5xl md:text-8xl font-extrabold mb-6 tracking-tighter">
            Break<span className="text-gray-500">.</span>Free<span className="text-gray-500">.</span>Rise
          </h1>
          <p className="text-md md:text-2xl text-gray-400 mb-10 leading-relaxed max-w-2xl">
            Redefine your habits. Reshape your future. Welcome to the next evolution of personal growth.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button asChild size="lg" variant="premium" className="rounded-full text-lg px-8 py-6 w-full sm:w-auto">
              <Link href="/signup" className="inline-flex items-center justify-center gap-3">
                Start Your Journey
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full text-black text-lg px-8 py-6 w-full sm:w-auto">
              <Link href={isSignedIn ? "/home" : "/signIn"} className="inline-flex items-center justify-center gap-3">
                {isSignedIn ? "Dashboard" : "Sign In"}
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>
          <motion.div 
            className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <ArrowDown className="w-8 h-8 text-gray-500" />
          </motion.div>
        </motion.section>
      </main>
    </div>
  );
}
