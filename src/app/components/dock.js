'use client'
import { Dock,DockIcon } from "@/components/ui/dock";
import { CiViewList } from "react-icons/ci";
import { IoMdHome } from "react-icons/io";
import { RiRobot3Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { RiCalendarScheduleLine } from "react-icons/ri";
import Link from "next/link";
import { auth } from '@/lib/firebase.config';
import { useState,useEffect } from "react";
function DockDemo() {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user?.photoURL) {
        setProfileImage(user.photoURL);
      } else {
        setProfileImage(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <Dock>
      <DockIcon className="text-white hover:scale-110 transition-transform">
        <Link href="/home" className="flex items-center justify-center">
          <div className=" text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
            <IoMdHome title="Home" className="w-7 h-7 text-white"/>
          </div>
        </Link>
      </DockIcon>
      <DockIcon className="text-white hover:scale-110 transition-transform">
        <Link href={'/tasks'} className="flex items-center justify-center">
          <div className=" text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
            <CiViewList title="Task Manager" className="w-7 h-7 text-white"/>
          </div>
        </Link>
      </DockIcon>
      <DockIcon className="text-white hover:scale-110 transition-transform">
        <Link href={"/todays-schedule"} className="flex items-center justify-center">
          <div className=" hover:bg-white/20 p-2 rounded-xl transition-colors">
            <RiCalendarScheduleLine title="Today's schedule" className="w-7 h-7 text-white"/>
          </div>
        </Link>
      </DockIcon>
      <DockIcon className="text-white hover:scale-110 transition-transform">
        <Link href={"/chatbot"} className="flex items-center justify-center">
          <div className=" text-white hover:bg-white/20 p-2 rounded-xl transition-colors">
            <RiRobot3Fill title="AI Assistant" className="w-7 h-7 text-white"/>
          </div>
        </Link>
      </DockIcon>
      <DockIcon className="text-white hover:scale-110 transition-transform">
        <Link href={"/profile"} className="flex items-center justify-center">
          <div className=" hover:bg-white/20 p-2 rounded-xl transition-colors">
            {profileImage ? (
              <img 
                src={profileImage} 
                alt="Profile" 
                className="w-7 h-7 rounded-full object-cover ring-2 ring-white/20 hover:ring-white/40 transition-all"
                title="Profile"
              />
            ) : (
              <CgProfile title="Profile" className="w-7 h-7 text-white"/>
            )}
          </div>
        </Link>
      </DockIcon>
    </Dock>
  );
}

export default DockDemo;