'use client';
import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const DEFAULT_MAGNIFICATION = 60;
const DEFAULT_DISTANCE = 140;

const Dock = React.forwardRef(
  ({
    className,
    children,
    magnification = DEFAULT_MAGNIFICATION,
    distance = DEFAULT_DISTANCE,
    direction = "bottom",
    ...props
  }, ref) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const mouseX = useMotionValue(Infinity);

    const renderChildren = () => {
      return React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            mousex: mouseX,
            magnification,
            distance,
          });
        }
        return child;
      });
    };

    const splitChildren = React.Children.toArray(children);
    const mainIcons = splitChildren.slice(0, 3);
    const additionalIcons = splitChildren.slice(3);

    return (
      <>
        {/* Desktop Dock */}
        <motion.div
          ref={ref}
          onMouseMove={(e) => mouseX.set(e.pageX)}
          onMouseLeave={() => mouseX.set(Infinity)}
          {...props}
          className={cn(
            "hidden md:supports-backdrop-blur:bg-white/10 md:supports-backdrop-blur:dark:bg-ray/10 md:mx-auto md:mt-8 md:flex md:h-[58px] md:w-max md:gap-3 md:rounded-2xl md:border md:border-white/40 md:p-2 md:backdrop-blur-md",
            className,
            {
              "md:items-start": direction === "top",
              "md:items-center": direction === "middle",
              "md:items-end": direction === "bottom",
            }
          )}
        >
          {renderChildren()}
        </motion.div>

        {/* Mobile Dock */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 p-4">
          <div className="flex justify-between items-center bg-black/50 backdrop-blur-md rounded-2xl p-2">
            <div className="flex space-x-4">
              {mainIcons}
            </div>
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 bg-black/50 backdrop-blur-md rounded-2xl p-4 flex flex-col space-y-4"
            >
              {additionalIcons.map((icon, index) => (
                <div key={index} className="w-full flex justify-center">
                  {icon}
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </>
    );
  }
);

Dock.displayName = "Dock";

const DockIcon = ({
  magnification = DEFAULT_MAGNIFICATION,
  distance = DEFAULT_DISTANCE,
  mousex,
  className,
  children,
  ...props
}) => {
  const ref = useRef(null);

  const distanceCalc = useTransform(
    mousex || useMotionValue(Infinity), 
    (val) => {
      if (!ref.current) return 0;
      const bounds = ref.current.getBoundingClientRect();
      return val - bounds.x - bounds.width / 2;
    }
  );

  const widthSync = useTransform(
    distanceCalc,
    [-distance, 0, distance],
    [40, magnification, 40]
  );

  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const { mousex: removedMouseX, magnification: removedMag, distance: removedDist, ...domProps } = props;

  return (
    <motion.div
      ref={ref}
      style={{ width }}
      className={cn(
        "flex aspect-square cursor-pointer items-center justify-center rounded-full",
        className
      )}
      {...domProps}
    >
      {children}
    </motion.div>
  );
};

DockIcon.displayName = "DockIcon";


export { Dock, DockIcon };