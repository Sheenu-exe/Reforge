import React from "react";
import { Dock, DockIcon } from "@/ui/dock";
import { CiViewList } from "react-icons/ci";
import { IoMdHome } from "react-icons/io";
import { RiRobot3Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";
import { RiCalendarScheduleLine } from "react-icons/ri";
import Link from "next/link";
import { auth } from '@/lib/firebase.config';

function DockDemo() {
  const [profileImage, setProfileImage] = React.useState(null);

  React.useEffect(() => {
    const user = auth.currentUser;
    if (user?.photoURL) {
      setProfileImage(user.photoURL);
    }

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
    <div className="fixed bottom-4 flex justify-center items-center left-1/2 -translate-x-1/2 w-full sm:w-fit z-50">
      <div className="relative px-6 py-3 backdrop-blur-md   rounded-2xl shadow-xl">
        <Dock direction="middle">
          <DockIcon className="text-white text-4xl hover:scale-110 transition-transform">
            <Link href="/home" className="flex items-center justify-center">
              <IoMdHome title="Home" className="w-7 h-7"/>
            </Link>
          </DockIcon>
          <DockIcon className="text-white text-4xl hover:scale-110 transition-transform">
            <Link href={'/tasks'} className="flex items-center justify-center">
              <CiViewList title="Task Manager" className="w-7 h-7"/>
            </Link>
          </DockIcon>
          <DockIcon className="text-white text-4xl hover:scale-110 transition-transform">
            <Link href={"/todays-schedule"} className="flex items-center justify-center">
              <RiCalendarScheduleLine title="Today's schedule" className="w-7 h-7"/>
            </Link>
          </DockIcon>
          <DockIcon className="text-white text-4xl hover:scale-110 transition-transform">
            <Link href={"/chatbot"} className="flex items-center justify-center">
              <RiRobot3Fill title="Blogs" className="w-7 h-7"/>
            </Link>
          </DockIcon>
          <DockIcon className="text-white text-4xl hover:scale-110 transition-transform">
            <Link href={"/profile"} className="flex items-center justify-center">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-7 h-7 rounded-full object-cover ring-2 ring-white/20 hover:ring-white/40 transition-all"
                  title="Profile"
                />
              ) : (
                <CgProfile title="Profile" className="w-7 h-7"/>
              )}
            </Link>
          </DockIcon>
        </Dock>
      </div>
    </div>
  );
}

export default DockDemo;