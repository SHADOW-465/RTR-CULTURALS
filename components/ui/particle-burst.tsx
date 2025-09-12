"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  scale: number;
  color: string;
}

interface ParticleBurstProps {
  count?: number;
  duration?: number;
  onComplete?: () => void;
  isBursting: boolean;
}

const colors = ["#DC143C", "#FFD700", "#FFA500", "#F5F5F5"];

export function ParticleBurst({
  count = 50,
  duration = 2,
  onComplete,
  isBursting,
}: ParticleBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (isBursting) {
      const newParticles = Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) {
          onComplete();
        }
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [isBursting, count, duration, onComplete]);

  if (!isBursting) {
    return null;
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            backgroundColor: particle.color,
            width: `${particle.scale * 10}px`,
            height: `${particle.scale * 10}px`,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: particle.scale,
            rotate: particle.rotation,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: particle.scale * 0.5,
          }}
          transition={{
            duration: duration,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
