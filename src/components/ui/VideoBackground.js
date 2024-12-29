import React, { useEffect, useRef, useState } from 'react';
import lottie from 'lottie-web';

const LottieBackground = ({ children }) => {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [animationPath, setAnimationPath] = useState('/background.json'); // Default animation

  useEffect(() => {
    const updateView = () => {
      const mobileView = window.innerWidth <= 768; // Adjust threshold as needed
      setIsMobile(mobileView);
      setAnimationPath(mobileView ? '/background-vertical.json' : '/background.json');
    };

    updateView(); // Initial check
    window.addEventListener('resize', updateView);

    return () => {
      window.removeEventListener('resize', updateView);
    };
  }, []);

  useEffect(() => {
    // Load Lottie animation
    if (animationRef.current) {
      animationRef.current.destroy();
    }

    animationRef.current = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: animationPath,
    });

    const handleScroll = () => {
      if (!animationRef.current) return;

      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = Math.min(Math.max(scrolled / maxScroll, 0), 1);

      const totalFrames = animationRef.current.totalFrames;
      const currentFrame = Math.floor(scrollProgress * totalFrames);
      animationRef.current.goToAndStop(currentFrame, true);
    };

    window.addEventListener('scroll', handleScroll);

    const handleResize = () => {
      if (animationRef.current) {
        animationRef.current.resize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        animationRef.current.destroy();
      }
    };
  }, [animationPath]);

  return (
    <div className="relative min-h-screen">
      <div
        ref={containerRef}
        className={`w-full h-full ${isMobile ? 'fixed top-0 left-0 w-screen h-screen' : ''}`}
        style={{ zIndex: -1 }}
      />
      <div className="relative" style={{ zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default LottieBackground;
