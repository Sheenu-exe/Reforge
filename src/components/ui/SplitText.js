"use client"
import { useSprings, animated } from '@react-spring/web';
import { useEffect, useRef, useState } from 'react';

export const SplitText = ({ text = '', className = '', delay = 100 }) => {
  // Split into individual characters and handle empty input
  const letters = text.split('');
  const [inView, setInView] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1, rootMargin: '-100px' }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const springs = useSprings(
    letters.length,
    letters.map((_, i) => ({
      from: { opacity: 0, transform: 'translate3d(0,40px,0)' },
      to: inView
        ? async (next) => {
            await next({ opacity: 1, transform: 'translate3d(0,-10px,0)' });
            await next({ opacity: 1, transform: 'translate3d(0,0,0)' });
          }
        : { opacity: 0, transform: 'translate3d(0,40px,0)' },
      delay: i * delay,
      config: { tension: 200, friction: 20 }
    }))
  );

  if (!text) return null;

  return (
    <span
      className={`inline-block overflow-hidden ${className}`}
      ref={ref}
    >
      {springs.map((props, index) => (
        <animated.span
          key={index}
          style={props}
          className="inline-block transform will-change-transform will-change-opacity"
        >
          {letters[index] === ' ' ? '\u00A0' : letters[index]}
        </animated.span>
      ))}
    </span>
  );
};

export default SplitText;