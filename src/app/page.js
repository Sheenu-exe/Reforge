'use client';

import { useEffect,  useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LottieBackground from '@/components/ui/VideoBackground';
import Link from 'next/link';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeatureCard } from '@/components/FeatureCard';
import Cookies from 'universal-cookie';

export default function LandingPage() {
  const [scrollY, setScrollY] = useState(0);
  const { scrollYProgress } = useScroll();
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.8], [0.6, 0.1]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.95]);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    const cookies = new Cookies();
    const signedIn = cookies.get('signedIn');
    setIsSignedIn(!!signedIn);
  }, []);


  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="relative text-white bg-black min-h-screen font-sans">
      {/* Lottie Background */}
      <motion.div style={{ opacity: backgroundOpacity }} className="fixed inset-0 w-full h-full">
        <LottieBackground phase={scrollY < 250 ? 'problem' : scrollY < 500 ? 'break' : 'solution'} />
      </motion.div>

      {/* Gradient Overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/30 via-black/30 to-black/30" />
      <header className='h-[10vh] w-full fixed top-0 flex justify-center items-center'>
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
              <Link href={isSignedIn?"/home":"/signIn"} className="inline-flex items-center justify-center gap-3">
              {isSignedIn?"Dashboard":"Sign In"}
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

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10">
            <FeatureCard
              title="Quantum Habit Tracking"
              description="Harness AI-powered insights to form lasting habits with unprecedented precision."
              icon="activity"
            />
            <FeatureCard
              title="Adaptive Time Mastery"
              description="Optimize your schedule in real-time, aligning tasks with your peak performance hours."
              icon="clock"
            />
            <FeatureCard
              title="Holistic Progress Visualization"
              description="Experience your growth journey through immersive, data-driven visual narratives."
              icon="trending-up"
            />
          </div>
        </section>

        {/* CTA Section */}
        <section className="min-h-screen flex items-center justify-center px-4 ">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tighter">
              Elevate Your Existence
            </h2>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Join the vanguard of individuals who have transcended their limitations and redefined what's possible.
            </p>
            <Button asChild size="lg" variant="premium" className="rounded-full text-lg px-10 py-6">
              <Link href="/signup" className="inline-flex items-center gap-3">
                Begin Transformation
                <ArrowRight className="w-6 h-6" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}

