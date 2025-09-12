"use client"

import { useEffect } from "react"

const ParticleEffect = () => {
  useEffect(() => {
    const particleContainer = document.getElementById("particle-container")
    if (!particleContainer) return

    const particles = []
    const particleCount = 20

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("div")
      particle.className = "particle"
      particle.style.position = "absolute"
      particle.style.borderRadius = "50%"
      particle.style.background = "rgba(255, 215, 0, 0.4)"
      particle.style.boxShadow = "0 0 5px rgba(255, 215, 0, 0.8)"
      particle.style.animation = `particle-float ${Math.random() * 10 + 10}s linear infinite`
      particle.style.animationDelay = `${Math.random() * 10}s`

      const size = Math.random() * 3 + 1
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.bottom = `-${size}px`

      particles.push(particle)
      particleContainer.appendChild(particle)
    }

    return () => {
      particles.forEach((p) => p.remove())
    }
  }, [])

  return null
}

export default ParticleEffect
