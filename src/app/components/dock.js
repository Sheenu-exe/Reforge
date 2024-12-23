import React from "react";
import { Dock,DockIcon } from "@/ui/dock";
import { CiViewList } from "react-icons/ci";
import { IoMdHome } from "react-icons/io";
import { RiRobot3Fill } from "react-icons/ri";
import { CgProfile } from "react-icons/cg";



import Link from "next/link";

function DockDemo() {
  return (
    <div className="relative sm:backdrop-blur-md  sm:bg-white/5 px-2 py-2 sm:border-white/10 sm:border rounded-lg">
      <Dock direction="middle"> 
        <DockIcon className="text-white text-4xl">
          <Link href="/home">
            <IoMdHome title="Home"/>
          </Link>
        </DockIcon>
        <DockIcon className="text-white text-4xl">
          <Link href={'/tasks'}>
            <CiViewList title="Task Manager"/>
          </Link>
        </DockIcon>
        <DockIcon className="text-white text-4xl">
          <Link href={"/chatbot"}>
          <RiRobot3Fill title="Blogs"/>
          </Link>
        </DockIcon>
        <DockIcon className="text-white text-4xl">
          <Link href={"/profile"}>
          <CgProfile title="Blogs"/>
          </Link>
        </DockIcon>
      </Dock>
    </div>
  );
}

export default DockDemo;