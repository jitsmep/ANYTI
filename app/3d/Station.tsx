"use client"

import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"
import type { StationDef } from "./data/stations"

interface StationProps {
  def: StationDef
  isNear: boolean
  activeBoardIndex?: number
  onEnter: () => void
}

// ── Inside 3D Display Board ───────────────────────────────────────────────────
function InsideDisplayBoard({
  position,
  rotation = [0, 0, 0],
  width = 2.5,
  height = 1.45,
  title,
  subtitle,
  tags,
  color = "#7c3aed",
  isActive = false,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  width?: number
  height?: number
  title: string
  subtitle: string
  tags?: string[]
  color?: string
  isActive?: boolean
}) {
  return (
    <group
      position={position}
      rotation={rotation}
      scale={isActive ? [1.05, 1.05, 1.05] : [0.96, 0.96, 0.96]}
    >
      {/* Dark screen panel */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[width, height, 0.06]} />
        <meshStandardMaterial
          color={isActive ? "#0b1222" : "#080c16"}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>

      {/* Glowing screen border frame */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[width + (isActive ? 0.14 : 0.08), height + (isActive ? 0.14 : 0.08), 0.05]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 2.0 : 0.6}
        />
      </mesh>

      {/* Screen header banner */}
      <mesh position={[0, height / 2 - 0.13, 0.035]}>
        <boxGeometry args={[width - 0.12, 0.18, 0.02]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={isActive ? 2.2 : 0.9}
        />
      </mesh>

      {/* Active Indicator Top Pill */}
      {isActive && (
        <mesh position={[0, height / 2 + 0.12, 0.04]}>
          <boxGeometry args={[0.9, 0.12, 0.02]} />
          <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.5} />
        </mesh>
      )}
      {isActive && (
        <Text
          position={[0, height / 2 + 0.12, 0.06]}
          fontSize={0.08}
          color="#0f172a"
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.08}
        >
          ACTIVE BOARD
        </Text>
      )}

      {/* Title */}
      <Text
        position={[0, height / 2 - 0.38, 0.04]}
        fontSize={0.17}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        {title}
      </Text>

      {/* Subtitle / Details */}
      <Text
        position={[0, 0.02, 0.04]}
        fontSize={0.105}
        maxWidth={width - 0.25}
        color={isActive ? "#f1f5f9" : "#94a3b8"}
        anchorX="center"
        anchorY="middle"
        lineHeight={1.35}
      >
        {subtitle}
      </Text>

      {/* Tags */}
      {tags && (
        <Text
          position={[0, -height / 2 + 0.22, 0.04]}
          fontSize={0.095}
          color={isActive ? "#c7d2fe" : "#818cf8"}
          anchorX="center"
          anchorY="middle"
          letterSpacing={0.05}
        >
          {tags.join("  •  ")}
        </Text>
      )}
    </group>
  )
}

// ── Glow ring that pulses on the ground ───────────────────────────────────────
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
      <ringGeometry args={[radius - 0.3, radius, 32]} />
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

// ── Billboard Signboard on top of station building ────────────────────────────
function BillboardSign({ label, color, glowColor }: { label: string; color: string; glowColor: string }) {
  return (
    <group position={[0, 6.8, 0]}>
      {/* Supporting structural posts */}
      <mesh position={[-1.7, -0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 1.2, 6]} />
        <meshStandardMaterial color="#475569" flatShading />
      </mesh>
      <mesh position={[1.7, -0.6, 0]}>
        <cylinderGeometry args={[0.05, 0.06, 1.2, 6]} />
        <meshStandardMaterial color="#475569" flatShading />
      </mesh>

      {/* Main Board Base Plate */}
      <mesh castShadow>
        <boxGeometry args={[4.6, 1.0, 0.16]} />
        <meshStandardMaterial color="#090d16" flatShading roughness={0.3} />
      </mesh>

      {/* Glowing Neon Rim */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4.7, 1.1, 0.14]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} />
      </mesh>

      {/* Top Accent Strip */}
      <mesh position={[0, 0.52, 0.09]}>
        <boxGeometry args={[4.5, 0.06, 0.02]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={1.4} />
      </mesh>

      {/* Section Name Text - Front Face */}
      <Text
        position={[0, 0, 0.1]}
        fontSize={0.48}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* Section Name Text - Back Face */}
      <Text
        position={[0, 0, -0.1]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.48}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        outlineWidth={0.03}
        outlineColor="#000000"
      >
        {label}
      </Text>
    </group>
  )
}

function AirportBeacon({ color }: { color: string }) {
  const beaconRef = useRef<THREE.Group>(null)
  useFrame((_, delta) => {
    if (beaconRef.current) {
      beaconRef.current.rotation.y += delta * 3
    }
  })
  return (
    <group ref={beaconRef} position={[0, 7.5, 0]}>
      <mesh>
        <cylinderGeometry args={[0.1, 0.12, 0.3, 8]} />
        <meshStandardMaterial color="#64748b" flatShading />
      </mesh>
      <mesh position={[0.35, 0, 0]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={2.5} />
      </mesh>
      <mesh position={[-0.35, 0, 0]}>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={2.5} />
      </mesh>
    </group>
  )
}

// ── Room Shell with entrance doors & spotlights ───────────────────────────────
function StationRoomShell({
  color,
  isNear,
  children,
}: {
  color: string
  isNear: boolean
  children: React.ReactNode
}) {
  const leftDoor = useRef<THREE.Mesh>(null)
  const rightDoor = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    const targetDoorOffset = isNear ? 1.05 : 0
    if (leftDoor.current) {
      leftDoor.current.position.x += (-targetDoorOffset - leftDoor.current.position.x) * (delta * 4)
    }
    if (rightDoor.current) {
      rightDoor.current.position.x += (targetDoorOffset - rightDoor.current.position.x) * (delta * 4)
    }
  })

  return (
    <group>
      {/* Exterior Walls */}
      <mesh position={[0, 1.8, -2.0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 3.6, 0.25]} />
        <meshStandardMaterial color="#111827" flatShading roughness={0.6} />
      </mesh>

      <mesh position={[-2.5, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 3.6, 4.2]} />
        <meshStandardMaterial color="#111827" flatShading roughness={0.6} />
      </mesh>

      <mesh position={[2.5, 1.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.25, 3.6, 4.2]} />
        <meshStandardMaterial color="#111827" flatShading roughness={0.6} />
      </mesh>

      {/* Front Entrance Portal Structure */}
      <mesh position={[-1.75, 1.8, 2.0]}>
        <boxGeometry args={[1.5, 3.6, 0.25]} />
        <meshStandardMaterial color="#111827" flatShading />
      </mesh>
      <mesh position={[1.75, 1.8, 2.0]}>
        <boxGeometry args={[1.5, 3.6, 0.25]} />
        <meshStandardMaterial color="#111827" flatShading />
      </mesh>
      {/* Lintel Header */}
      <mesh position={[0, 3.1, 2.0]}>
        <boxGeometry args={[2.0, 1.0, 0.25]} />
        <meshStandardMaterial color="#111827" flatShading />
      </mesh>

      {/* Glowing Entrance Portal Arch Neon */}
      <mesh position={[0, 2.55, 2.05]}>
        <boxGeometry args={[2.05, 0.1, 0.08]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} />
      </mesh>
      {[-1.0, 1.0].map((x, i) => (
        <mesh key={i} position={[x, 1.3, 2.05]}>
          <boxGeometry args={[0.08, 2.6, 0.08]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.0} />
        </mesh>
      ))}

      {/* Sliding Glass Doors */}
      <mesh ref={leftDoor} position={[-0.5, 1.3, 1.95]}>
        <boxGeometry args={[0.95, 2.5, 0.05]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.45}
        />
      </mesh>
      <mesh ref={rightDoor} position={[0.5, 1.3, 1.95]}>
        <boxGeometry args={[0.95, 2.5, 0.05]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.5}
          transparent
          opacity={0.45}
        />
      </mesh>

      {/* Ceiling & Floor */}
      <mesh position={[0, 3.6, 0]}>
        <boxGeometry args={[5.2, 0.2, 4.2]} />
        <meshStandardMaterial color="#0b0f19" flatShading />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[4.8, 3.8]} />
        <meshStandardMaterial color="#090d16" roughness={0.2} metalness={0.8} />
      </mesh>

      {/* Ceiling Downlights */}
      <pointLight position={[0, 3.2, 0]} intensity={1.8} distance={7} color="#ffffff" />
      <pointLight position={[0, 2.8, -1.2]} intensity={1.4} distance={6} color={color} />

      {/* Interior Exhibition Boards Content */}
      {children}
    </group>
  )
}

// ── 1. Projects Station Building with 3D Inside Boards ─────────────────────────
function ProjectsStationInterior({
  isNear,
  color,
  activeBoardIndex = 1,
}: {
  isNear: boolean
  color: string
  activeBoardIndex?: number
}) {
  return (
    <StationRoomShell color={color} isNear={isNear}>
      {/* Inside Board 0: Left Wall (Finance Tracker) */}
      <InsideDisplayBoard
        position={[-2.3, 1.8, 0]}
        rotation={[0, Math.PI / 2, 0]}
        title="2. FINANCE TRACKER"
        subtitle="Automated income, expense & budgeting system with category trends and savings calculations."
        tags={["AI-Assisted Dev", "Full-Stack"]}
        color="#6366f1"
        isActive={activeBoardIndex === 0}
      />

      {/* Inside Board 1: Center Wall (Trading Journal) */}
      <InsideDisplayBoard
        position={[0, 1.8, -1.8]}
        title="1. TRADING JOURNAL"
        subtitle="Full-featured trading performance analytics platform with win rate metrics and P/L curve insights."
        tags={["Python", "Analytics", "React"]}
        color="#7c3aed"
        isActive={activeBoardIndex === 1}
      />

      {/* Inside Board 2: Right Wall (Portfolio Builder) */}
      <InsideDisplayBoard
        position={[2.3, 1.8, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        title="3. PORTFOLIO BUILDER"
        subtitle="Interactive web showcase creator with instant real-time preview and responsive layout engine."
        tags={["Next.js", "Three.js", "Tailwind"]}
        color="#06b6d4"
        isActive={activeBoardIndex === 2}
      />
    </StationRoomShell>
  )
}

// ── 2. About Station Building with 3D Inside Boards ────────────────────────────
function AboutStationInterior({
  isNear,
  color,
  activeBoardIndex = 1,
}: {
  isNear: boolean
  color: string
  activeBoardIndex?: number
}) {
  return (
    <StationRoomShell color={color} isNear={isNear}>
      {/* Inside Board 0: Left Wall (Education) */}
      <InsideDisplayBoard
        position={[-2.3, 1.85, 0]}
        rotation={[0, Math.PI / 2, 0]}
        title="EDUCATION & MCC"
        subtitle="Madras Christian College (2024–2027) • Computer Science Major with a focus on web systems and applied intelligence."
        tags={["BSc Computer Science", "Chennai"]}
        color="#818cf8"
        isActive={activeBoardIndex === 0}
      />

      {/* Inside Board 1: Center Wall (Joshuva P Bio) */}
      <InsideDisplayBoard
        position={[0, 1.85, -1.8]}
        title="JOSHUVA P"
        subtitle="Motivated BSc Computer Science student at Madras Christian College ('27). Passionate about Technology & AI, building practical tools through Vibe Coding."
        tags={["BSc CS '27", "Vibe Coder", "AI Enthusiast"]}
        color="#4f46e5"
        isActive={activeBoardIndex === 1}
      />

      {/* Inside Board 2: Right Wall (Skills & Tech Stack) */}
      <InsideDisplayBoard
        position={[2.3, 1.85, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        title="TECH STACK & SKILLS"
        subtitle="Python • Prompt Engineering • Vibe Coding • Next.js & React • Antigravity IDE • Full-Stack Web Development."
        tags={["Python", "Next.js", "AI Development"]}
        color="#a855f7"
        isActive={activeBoardIndex === 2}
      />
    </StationRoomShell>
  )
}

// ── 3. Contact Station Building with 3D Inside Boards ──────────────────────────
function ContactStationInterior({
  isNear,
  color,
  activeBoardIndex = 1,
}: {
  isNear: boolean
  color: string
  activeBoardIndex?: number
}) {
  return (
    <StationRoomShell color={color} isNear={isNear}>
      {/* Inside Board 0: Left Wall (Email Console) */}
      <InsideDisplayBoard
        position={[-2.3, 1.8, 0]}
        rotation={[0, Math.PI / 2, 0]}
        title="DIRECT EMAIL"
        subtitle="pjoshuva31@gmail.com • Reach out anytime for project discussions, inquiries, or tech coffee chats."
        tags={["pjoshuva31@gmail.com"]}
        color="#14b8a6"
        isActive={activeBoardIndex === 0}
      />

      {/* Inside Board 1: Center Wall (Get in Touch) */}
      <InsideDisplayBoard
        position={[0, 1.8, -1.8]}
        title="LET'S CONNECT"
        subtitle="Open to internship roles, AI-assisted development collaborations, and creative full-stack engineering."
        tags={["pjoshuva31@gmail.com", "Open to Work"]}
        color="#0d9488"
        isActive={activeBoardIndex === 1}
      />

      {/* Inside Board 2: Right Wall (GitHub) */}
      <InsideDisplayBoard
        position={[2.3, 1.8, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        title="GITHUB PROFILE"
        subtitle="github.com/jitsmep • Explore open-source projects, repository codebases, and experimental tools."
        tags={["@jitsmep", "GitHub"]}
        color="#2dd4bf"
        isActive={activeBoardIndex === 2}
      />
    </StationRoomShell>
  )
}

export default function Station({ def, isNear, activeBoardIndex = 1, onEnter }: StationProps) {
  const sectionLabel =
    def.id === "projects" ? "PROJECTS" : def.id === "about" ? "ABOUT" : "CONTACT"

  return (
    <group position={def.position}>
      {/* Trigger zone glow ring */}
      <GlowRing color={def.glowColor} radius={def.triggerRadius} />

      {/* Airport approach beacon on top */}
      <AirportBeacon color={def.glowColor} />

      {/* Station Room Shell with Inside 3D Exhibition Boards */}
      {def.id === "projects" && (
        <ProjectsStationInterior
          isNear={isNear}
          color={def.color}
          activeBoardIndex={activeBoardIndex}
        />
      )}
      {def.id === "about" && (
        <AboutStationInterior
          isNear={isNear}
          color={def.color}
          activeBoardIndex={activeBoardIndex}
        />
      )}
      {def.id === "contact" && (
        <ContactStationInterior
          isNear={isNear}
          color={def.color}
          activeBoardIndex={activeBoardIndex}
        />
      )}

      {/* Section billboard signboard on top of building */}
      <BillboardSign label={sectionLabel} color={def.color} glowColor={def.glowColor} />
    </group>
  )
}
