'use client';
import React, { useState, useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import Link from "next/link";
import { IoMdHome } from "react-icons/io";
import { CiViewList } from "react-icons/ci";
import { RiRobot3Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { auth } from '@/lib/firebase.config';
import { cn } from "@/lib/utils";

const DockIcon = ({ 
  href, 
  icon: Icon, 
  title, 
  mousex, 
  magnification = 60,
  distance = 140,
  className,
  profileImage = null
}) => {
  const ref = useRef(null);

  const distanceCalc = useTransform(mousex, (val) => {
    if (!ref.current) return 0;
    const bounds = ref.current.getBoundingClientRect();
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distanceCalc, [-distance, 0, distance], [40, magnification, 40]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "aspect-square relative group",
        className
      )}
    >
      <Link href={href} className="flex items-center justify-center w-full h-full">
        <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-black/40 
                      hover:bg-black/60 transition-all duration-300 group-hover:scale-110">
          {profileImage ? (
            <img 
              src={profileImage} 
              alt={title}
              className="w-7 h-7 rounded-lg object-cover ring-2 ring-white/20 group-hover:ring-white/40 transition-all"
            />
          ) : (
            <Icon className="w-6 h-6 text-white group-hover:text-white/80 transition-colors" />
          )}
        </div>
        <div className="absolute -top-8 scale-0 group-hover:scale-100 transition-transform bg-black/80 
                      text-white text-xs px-2 py-1 rounded-md whitespace-nowrap">
          {title}
        </div>
      </Link>
    </motion.div>
  );
};

const Dock = () => {
  const [profileImage, setProfileImage] = useState(null);
  const mouseX = useMotionValue(Infinity);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setProfileImage(user?.photoURL || null);
    });
    return () => unsubscribe();
  }, []);

  const navigationItems = [
    { href: "/home", icon: IoMdHome },
    { href: "/tasks", icon: CiViewList},
    { href: "/todays-schedule", icon: RiCalendarScheduleLine},
    { href: "/chatbot", icon: RiRobot3Fill },
    { href: "/profile", icon: CgProfile, profileImage }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 flex justify-center">
      {/* Desktop Dock */}
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="hidden md:flex items-center gap-1 bg-black/40 backdrop-blur-md rounded-2xl p-3 border border-white/10
                   shadow-xl shadow-black/20"
      >
        {navigationItems.map((item, index) => (
          <DockIcon
            key={index}
            href={item.href}
            icon={item.icon}
            title={item.title}
            mousex={mouseX}
            profileImage={item.profileImage}
          />
        ))}
      </motion.div>

      {/* Mobile Dock */}
      <div className="md:hidden w-full max-w-sm bg-black/40 backdrop-blur-md rounded-2xl p-2 border border-white/10
                      shadow-xl shadow-black/20">
        <div className="flex justify-around items-center">
          {navigationItems.map((item, index) => (
            <Link 
              key={index}
              href={item.href}
              className="flex flex-col items-center justify-center p-2"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/10
                            hover:bg-white/20 transition-all duration-300">
                {item.profileImage ? (
                  <img 
                    src={item.profileImage} 
                    alt={item.title}
                    className="w-7 h-7 rounded-lg object-cover ring-2 ring-white/20 hover:ring-white/40 transition-all"
                  />
                ) : (
                  <item.icon className="w-6 h-6 text-white/80" />
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export {Dock,DockIcon}