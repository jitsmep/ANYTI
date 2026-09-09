"use client"

import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import * as THREE from "three"
import type { StationDef } from "./data/stations"

interface StationProps {
  def: StationDef
  isNear: boolean
  onEnter: () => void
}

// ── Glow ring that pulses ──────────────────────────────────────────────────
function GlowRing({ color, radius }: { color: string; radius: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const mat = meshRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = 0.4 + Math.sin(clock.getElapsedTime() * 2) * 0.3
    }
  })
  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <ringGeometry args={[radius - 0.25, radius, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        transparent
        opacity={0.75}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

// ── Projects Station (garage look) ─────────────────────────────────────────
function ProjectsBuilding({ color }: { color: string }) {
  return (
    <group>
      {/* Main body */}
      <mesh castShadow position={[0, 1.5, 0]}>
        <boxGeometry args={[5, 3, 4]} />
        <meshStandardMaterial color="#1e1b4b" flatShading />
      </mesh>
      {/* Roof */}
      <mesh castShadow position={[0, 3.15, 0]}>
        <boxGeometry args={[5.2, 0.3, 4.2]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Garage door */}
      <mesh position={[0, 0.9, 2.01]}>
        <boxGeometry args={[2.5, 1.8, 0.1]} />
        <meshStandardMaterial color="#312e81" flatShading />
      </mesh>
      {/* Door stripes */}
      {[-0.6, 0, 0.6].map((x, i) => (
        <mesh key={i} position={[x, 0.9, 2.06]}>
          <boxGeometry args={[0.06, 1.78, 0.05]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
        </mesh>
      ))}
      {/* Sign */}
      <mesh position={[0, 2.8, 2.06]}>
        <boxGeometry args={[3, 0.5, 0.1]} />
        <meshStandardMaterial color="#4c1d95" flatShading />
      </mesh>
      {/* Windows */}
      <mesh position={[-1.6, 1.8, 2.02]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial color="#a5b4fc" emissive="#a5b4fc" emissiveIntensity={0.4} />
      </mesh>
      <mesh position={[1.6, 1.8, 2.02]}>
        <boxGeometry args={[0.8, 0.8, 0.05]} />
        <meshStandardMaterial color="#a5b4fc" emissive="#a5b4fc" emissiveIntensity={0.4} />
      </mesh>
    </group>
  )
}

// ── About Station (HQ storefront) ──────────────────────────────────────────
function AboutBuilding({ color }: { color: string }) {
  return (
    <group>
      <mesh castShadow position={[0, 2, 0]}>
        <boxGeometry args={[5, 4, 4]} />
        <meshStandardMaterial color="#1e1b4b" flatShading />
      </mesh>
      {/* Stepped roof detail */}
      <mesh castShadow position={[0, 4.15, 0]}>
        <boxGeometry args={[5.2, 0.3, 4.2]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      <mesh castShadow position={[0, 4.6, 0]}>
        <boxGeometry args={[3.5, 0.9, 3.5]} />
        <meshStandardMaterial color="#1e1b4b" flatShading />
      </mesh>
      {/* Big entrance door */}
      <mesh position={[0, 0.9, 2.01]}>
        <boxGeometry args={[1.2, 1.8, 0.08]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Windows row */}
      {[-1.5, 0, 1.5].map((x, i) => (
        <mesh key={i} position={[x, 2.5, 2.02]}>
          <boxGeometry args={[0.9, 1, 0.06]} />
          <meshStandardMaterial color="#bfdbfe" emissive="#bfdbfe" emissiveIntensity={0.35} />
        </mesh>
      ))}
      {/* Flag pole */}
      <mesh position={[0, 5.8, 0]}>
        <cylinderGeometry args={[0.04, 0.04, 2.4, 6]} />
        <meshStandardMaterial color="#94a3b8" flatShading />
      </mesh>
      <mesh position={[0.4, 6.6, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.05]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// ── Contact Station (broadcast tower) ─────────────────────────────────────
function ContactBuilding({ color }: { color: string }) {
  return (
    <group>
      {/* Base building */}
      <mesh castShadow position={[0, 1.2, 0]}>
        <boxGeometry args={[4, 2.4, 3.5]} />
        <meshStandardMaterial color="#0f3f3b" flatShading />
      </mesh>
      <mesh castShadow position={[0, 2.55, 0]}>
        <boxGeometry args={[4.2, 0.3, 3.7]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Tower shaft */}
      <mesh castShadow position={[0, 4, 0]}>
        <boxGeometry args={[0.6, 3, 0.6]} />
        <meshStandardMaterial color="#134e4a" flatShading />
      </mesh>
      {/* Horizontal antennas */}
      {[3, 4, 5].map((y, i) => (
        <group key={i} position={[0, y, 0]}>
          <mesh position={[1.2, 0, 0]}>
            <boxGeometry args={[2.4, 0.06, 0.06]} />
            <meshStandardMaterial color="#94a3b8" flatShading />
          </mesh>
          <mesh position={[-1.2, 0, 0]}>
            <boxGeometry args={[2.4, 0.06, 0.06]} />
            <meshStandardMaterial color="#94a3b8" flatShading />
          </mesh>
        </group>
      ))}
      {/* Top blinking beacon */}
      <mesh position={[0, 5.6, 0]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
      </mesh>
      {/* Dish */}
      <mesh position={[0.6, 3.2, 0]} rotation={[0, 0, Math.PI / 6]}>
        <coneGeometry args={[0.5, 0.3, 8, 1, true]} />
        <meshStandardMaterial color={color} side={THREE.DoubleSide} flatShading />
      </mesh>
      {/* Door */}
      <mesh position={[0, 0.6, 1.76]}>
        <boxGeometry args={[0.8, 1.2, 0.08]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  )
}

export default function Station({ def, isNear, onEnter }: StationProps) {
  return (
    <group position={def.position}>
      {/* Trigger zone glow ring */}
      <GlowRing color={def.glowColor} radius={def.triggerRadius} />

      {/* Building mesh */}
      {def.id === "projects" && <ProjectsBuilding color={def.color} />}
      {def.id === "about" && <AboutBuilding color={def.color} />}
      {def.id === "contact" && <ContactBuilding color={def.color} />}

      {/* Billboard sign above building */}
      <mesh position={[0, 7, 0]}>
        <boxGeometry args={[3.5, 0.7, 0.12]} />
        <meshStandardMaterial color={def.color} emissive={def.color} emissiveIntensity={0.5} flatShading />
      </mesh>
    </group>
  )
}
