import React from "react";
import { motion } from "framer-motion";

const BorderBeam = ({ children, className = "" }) => {
  return (
    <div className={`relative rounded-2xl p-[2px] overflow-hidden ${className}`}>
      {/* Animated gradient border */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background:
            "conic-gradient(from 0deg, #06b6d4, #3b82f6, #a855f7, #ec4899, #06b6d4)",
        }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      />

      {/* Inner container (background for content) */}
      <div className="relative z-10 rounded-2xl bg-neutral-900 text-white p-6">
        {children}
      </div>
    </div>
  );
};

export default BorderBeam;
