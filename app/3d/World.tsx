"use client"

import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"

// ── Direction Sign ───────────────────────────────────────────────────────────
function DirectionSign({
  position,
  rotation,
  label,
  color,
  arrowDir,
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  label: string
  color: string
  arrowDir: "left" | "right" | "up"
}) {
  const arrowX = arrowDir === "left" ? -0.55 : arrowDir === "right" ? 0.55 : 0
  const arrowY = arrowDir === "up" ? 0.38 : 0
  const arrowRotZ =
    arrowDir === "left" ? Math.PI / 2 : arrowDir === "right" ? -Math.PI / 2 : 0

  return (
    <group position={position} rotation={rotation ?? [0, 0, 0]}>
      {/* Post */}
      <mesh position={[0, 0.9, 0]}>
        <cylinderGeometry args={[0.045, 0.06, 1.8, 6]} />
        <meshStandardMaterial color="#475569" flatShading />
      </mesh>

      {/* Sign board */}
      <mesh position={[0, 2.05, 0]}>
        <boxGeometry args={[1.5, 0.5, 0.08]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>

      {/* Sign board border highlight */}
      <mesh position={[0, 2.05, 0.05]}>
        <boxGeometry args={[1.52, 0.52, 0.01]} />
        <meshStandardMaterial color="white" transparent opacity={0.12} />
      </mesh>

      {/* Label text */}
      <Text
        position={[arrowDir === "up" ? 0 : arrowDir === "left" ? 0.22 : -0.22, 2.06, 0.06]}
        fontSize={0.18}
        color="white"
        anchorX="center"
        anchorY="middle"
        font={undefined}
        outlineWidth={0.008}
        outlineColor="#00000088"
      >
        {label}
      </Text>

      {/* Arrow indicator */}
      <mesh position={[arrowX, arrowDir === "up" ? 2.3 : 2.05, 0.06]} rotation={[0, 0, arrowRotZ]}>
        <coneGeometry args={[0.1, 0.22, 3]} />
        <meshStandardMaterial color="white" emissive="white" emissiveIntensity={0.3} />
      </mesh>
    </group>
  )
}

// ── Tree ────────────────────────────────────────────────────────────────────
function Tree({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 0.6, 0]}>
        <cylinderGeometry args={[0.15, 0.2, 1.2, 6]} />
        <meshStandardMaterial color="#92400e" flatShading />
      </mesh>
      <mesh castShadow position={[0, 2.1, 0]}>
        <coneGeometry args={[0.9, 2.4, 7]} />
        <meshStandardMaterial color="#15803d" flatShading />
      </mesh>
      <mesh castShadow position={[0, 3.1, 0]}>
        <coneGeometry args={[0.6, 1.6, 6]} />
        <meshStandardMaterial color="#16a34a" flatShading />
      </mesh>
    </group>
  )
}

// ── Lamp Post ───────────────────────────────────────────────────────────────
function LampPost({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh castShadow position={[0, 2, 0]}>
        <cylinderGeometry args={[0.05, 0.08, 4, 6]} />
        <meshStandardMaterial color="#475569" flatShading />
      </mesh>
      <mesh position={[0.3, 3.9, 0]}>
        <boxGeometry args={[0.6, 0.08, 0.08]} />
        <meshStandardMaterial color="#475569" flatShading />
      </mesh>
      <mesh position={[0.6, 3.8, 0]}>
        <boxGeometry args={[0.14, 0.22, 0.14]} />
        <meshStandardMaterial color="#fef9c3" emissive="#fef9c3" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

// ── Small ambient building ───────────────────────────────────────────────────
function AmbientBuilding({
  position,
  width,
  depth,
  height,
  color,
}: {
  position: [number, number, number]
  width: number
  depth: number
  height: number
  color: string
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
      {/* Roof */}
      <mesh castShadow position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width + 0.1, 0.3, depth + 0.1]} />
        <meshStandardMaterial color="#1e293b" flatShading />
      </mesh>
    </group>
  )
}

// ── Road segment ─────────────────────────────────────────────────────────────
function RoadSegment({
  position,
  width,
  depth,
}: {
  position: [number, number, number]
  width: number
  depth: number
}) {
  return (
    <mesh receiveShadow position={position}>
      <boxGeometry args={[width, 0.08, depth]} />
      <meshStandardMaterial color="#374151" flatShading />
    </mesh>
  )
}

// ── Road markings ─────────────────────────────────────────────────────────────
function RoadMarkings() {
  const dashes: [number, number, number][] = []
  for (let z = -18; z < 18; z += 3) dashes.push([0, 0.05, z]) // center N-S road
  for (let x = -18; x < 18; x += 3) dashes.push([x, 0.05, 0]) // center E-W road
  return (
    <>
      {dashes.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.12, 0.01, 1.2]} />
          <meshStandardMaterial color="#f3f4f6" emissive="#f3f4f6" emissiveIntensity={0.2} />
        </mesh>
      ))}
    </>
  )
}

export default function World() {
  return (
    <group>
      {/* Ground plane */}
      <RigidBody type="fixed" colliders="cuboid">
        <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
          <planeGeometry args={[80, 80]} />
          <meshStandardMaterial color="#4ade80" flatShading />
        </mesh>
        {/* Invisible thick ground collider */}
        <mesh visible={false} position={[0, -1, 0]}>
          <boxGeometry args={[80, 2, 80]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Roads */}
      {/* Main North-South road */}
      <RoadSegment position={[0, 0, 0]} width={5} depth={50} />
      {/* Main East-West road */}
      <RoadSegment position={[0, 0, 0]} width={50} depth={5} />
      {/* Branch roads to stations */}
      <RoadSegment position={[9, 0, 2]} width={13} depth={4} />
      <RoadSegment position={[-9, 0, -4]} width={13} depth={4} />

      <RoadMarkings />

      {/* Parking bay highlights near stations */}
      <mesh position={[14, 0.01, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#312e81" transparent opacity={0.35} />
      </mesh>
      <mesh position={[-14, 0.01, -4]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#1e1b4b" transparent opacity={0.35} />
      </mesh>
      <mesh position={[2, 0.01, -16]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color="#042f2e" transparent opacity={0.35} />
      </mesh>

      {/* Trees */}
      <Tree position={[4, 0, 4]} />
      <Tree position={[-4, 0, 4]} />
      <Tree position={[4, 0, -4]} />
      <Tree position={[-4, 0, -4]} />
      <Tree position={[8, 0, 8]} />
      <Tree position={[-8, 0, 8]} />
      <Tree position={[8, 0, -8]} />
      <Tree position={[-8, 0, -8]} />
      <Tree position={[18, 0, 12]} />
      <Tree position={[-18, 0, 12]} />
      <Tree position={[18, 0, -12]} />
      <Tree position={[-18, 0, -12]} />
      <Tree position={[18, 0, 18]} />
      <Tree position={[-18, 0, 18]} />
      <Tree position={[5, 0, 18]} />
      <Tree position={[-5, 0, 18]} />
      <Tree position={[5, 0, -18]} />
      <Tree position={[-5, 0, -18]} />

      {/* Lamp posts */}
      <LampPost position={[3, 0, 8]} />
      <LampPost position={[-3, 0, 8]} />
      <LampPost position={[3, 0, -8]} />
      <LampPost position={[-3, 0, -8]} />
      <LampPost position={[3, 0, 0]} />
      <LampPost position={[-3, 0, 0]} />
      <LampPost position={[10, 0, 3]} />
      <LampPost position={[-10, 0, -3]} />

      {/* Ambient background buildings (non-interactive) */}
      <AmbientBuilding position={[20, 0, 5]} width={4} depth={4} height={4} color="#64748b" />
      <AmbientBuilding position={[22, 0, -3]} width={3} depth={3} height={6} color="#475569" />
      <AmbientBuilding position={[-20, 0, 6]} width={5} depth={4} height={3} color="#6b7280" />
      <AmbientBuilding position={[-22, 0, -5]} width={3} depth={3} height={5} color="#52525b" />
      <AmbientBuilding position={[6, 0, -20]} width={4} depth={4} height={4} color="#4b5563" />
      <AmbientBuilding position={[-5, 0, -22]} width={3} depth={5} height={3} color="#374151" />
      <AmbientBuilding position={[6, 0, 20]} width={4} depth={3} height={3} color="#3f3f46" />
      <AmbientBuilding position={[-6, 0, 20]} width={3} depth={4} height={5} color="#52525b" />

      {/* ── Direction Signs ─────────────────────────────────────────── */}
      {/* Projects → East (right arrow). Roadside near east junction. */}
      <DirectionSign
        position={[3.5, 0, -2.5]}
        rotation={[0, 0, 0]}
        label="Projects"
        color="#7c3aed"
        arrowDir="right"
      />
      {/* About → West (left arrow). Roadside near west junction. */}
      <DirectionSign
        position={[-3.5, 0, 2.5]}
        rotation={[0, Math.PI, 0]}
        label="About"
        color="#4f46e5"
        arrowDir="right"
      />
      {/* Contact → North (points North along road). Roadside near junction. */}
      <DirectionSign
        position={[3.5, 0, 2.5]}
        rotation={[0, -Math.PI / 2, 0]}
        label="Contact"
        color="#0d9488"
        arrowDir="left"
      />
    </group>
  )
}
