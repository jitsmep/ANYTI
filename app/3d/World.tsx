"use client"

import React, { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Text } from "@react-three/drei"
import * as THREE from "three"

import { FLIGHT_CURVE } from "./data/flightPath"

// ── Continuous Cyber Highway Ribbon Loop ──────────────────────────────────────
function CyberHighway() {
  const { roadGeom, curbLeftGeom, curbRightGeom, centerDashes } = React.useMemo(() => {
    const SAMPLES = 180
    const width = 4.4
    const hw = width / 2
    const positions: number[] = []
    const uvs: number[] = []
    const indices: number[] = []

    const curbLeftPos: number[] = []
    const curbRightPos: number[] = []
    const curbIndices: number[] = []

    const dashes: { pos: [number, number, number]; rotY: number }[] = []
    const UP = new THREE.Vector3(0, 1, 0)

    for (let i = 0; i <= SAMPLES; i++) {
      const t = (i % SAMPLES) / SAMPLES
      const pt = FLIGHT_CURVE.getPointAt(t)
      const tang = FLIGHT_CURVE.getTangentAt(t).normalize()
      const binorm = new THREE.Vector3().crossVectors(tang, UP).normalize()

      const left = pt.clone().addScaledVector(binorm, -hw)
      const right = pt.clone().addScaledVector(binorm, hw)

      positions.push(left.x, 0.015, left.z)
      positions.push(right.x, 0.015, right.z)

      const v = (i / SAMPLES) * 32
      uvs.push(0, v, 1, v)

      if (i < SAMPLES) {
        const idx = i * 2
        indices.push(idx, idx + 1, idx + 2)
        indices.push(idx + 1, idx + 3, idx + 2)
      }

      // Neon curb rails (0.12 wide strip on each side)
      const cL1 = pt.clone().addScaledVector(binorm, -hw)
      const cL2 = pt.clone().addScaledVector(binorm, -hw - 0.12)
      curbLeftPos.push(cL1.x, 0.025, cL1.z)
      curbLeftPos.push(cL2.x, 0.025, cL2.z)

      const cR1 = pt.clone().addScaledVector(binorm, hw)
      const cR2 = pt.clone().addScaledVector(binorm, hw + 0.12)
      curbRightPos.push(cR1.x, 0.025, cR1.z)
      curbRightPos.push(cR2.x, 0.025, cR2.z)

      if (i < SAMPLES) {
        const cIdx = i * 2
        curbIndices.push(cIdx, cIdx + 1, cIdx + 2)
        curbIndices.push(cIdx + 1, cIdx + 3, cIdx + 2)
      }

      // Dashed center lane markings every ~3 samples
      if (i % 3 === 0 && i < SAMPLES) {
        const heading = Math.atan2(tang.x, tang.z)
        dashes.push({
          pos: [pt.x, 0.02, pt.z],
          rotY: heading,
        })
      }
    }

    const rG = new THREE.BufferGeometry()
    rG.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
    rG.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
    rG.setIndex(indices)
    rG.computeVertexNormals()

    const cLG = new THREE.BufferGeometry()
    cLG.setAttribute("position", new THREE.Float32BufferAttribute(curbLeftPos, 3))
    cLG.setIndex(curbIndices)
    cLG.computeVertexNormals()

    const cRG = new THREE.BufferGeometry()
    cRG.setAttribute("position", new THREE.Float32BufferAttribute(curbRightPos, 3))
    cRG.setIndex(curbIndices)
    cRG.computeVertexNormals()

    return { roadGeom: rG, curbLeftGeom: cLG, curbRightGeom: cRG, centerDashes: dashes }
  }, [])

  return (
    <group>
      {/* Asphalt highway surface */}
      <mesh geometry={roadGeom} receiveShadow>
        <meshStandardMaterial color="#0b1120" roughness={0.7} metalness={0.15} />
      </mesh>

      {/* Left glowing curb (Violet) */}
      <mesh geometry={curbLeftGeom}>
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={2.5} roughness={0.3} />
      </mesh>

      {/* Right glowing curb (Sky Blue) */}
      <mesh geometry={curbRightGeom}>
        <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={2.5} roughness={0.3} />
      </mesh>

      {/* Center dashed lane divider */}
      {centerDashes.map((d, i) => (
        <mesh key={i} position={d.pos} rotation={[0, d.rotY, 0]}>
          <boxGeometry args={[0.22, 0.015, 1.4]} />
          <meshStandardMaterial color="#f8fafc" emissive="#e2e8f0" emissiveIntensity={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Grand Entrance Plaza under Arch [0, 0, 18] */}
      <mesh receiveShadow position={[0, 0.018, 18]}>
        <boxGeometry args={[11.5, 0.02, 6.0]} />
        <meshStandardMaterial color="#070d19" roughness={0.6} metalness={0.3} />
      </mesh>
      {/* Entrance grid neon accent lines */}
      {[-3, -1, 1, 3].map((x, i) => (
        <mesh key={i} position={[x, 0.024, 18]}>
          <boxGeometry args={[0.06, 0.01, 5.8]} />
          <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={1.8} />
        </mesh>
      ))}

      {/* Station Parking Plazas connecting road to entrances */}
      {/* Projects Parking Plaza */}
      <mesh receiveShadow position={[14, 0.016, 5.0]}>
        <boxGeometry args={[6.5, 0.02, 4.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Contact Parking Plaza */}
      <mesh receiveShadow position={[2, 0.016, -12.5]}>
        <boxGeometry args={[6.0, 0.02, 4.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* About Parking Plaza */}
      <mesh receiveShadow position={[-14, 0.016, -0.5]}>
        <boxGeometry args={[6.5, 0.02, 4.0]} />
        <meshStandardMaterial color="#0f172a" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  )
}

// ── Floating Low-Poly Stylized Clouds ─────────────────────────────────────────
function LowPolyCloud({
  position,
  scale = 1,
  speed = 0.5,
}: {
  position: [number, number, number]
  scale?: number
  speed?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const initialX = position[0]

  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle wind drift
      groupRef.current.position.x += delta * speed
      if (groupRef.current.position.x > 40) {
        groupRef.current.position.x = -40
      }
    }
  })

  return (
    <group ref={groupRef} position={position} scale={[scale, scale * 0.6, scale]}>
      <mesh castShadow receiveShadow>
        <dodecahedronGeometry args={[2.2, 1]} />
        <meshStandardMaterial
          color="#f1f5f9"
          roughness={0.9}
          flatShading
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[1.8, -0.2, 0.4]}>
        <dodecahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.9}
          flatShading
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </mesh>
      <mesh position={[-1.6, -0.1, -0.3]}>
        <dodecahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#f8fafc"
          roughness={0.9}
          flatShading
          transparent
          opacity={0.85}
          depthWrite={false}
        />
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
      <mesh castShadow position={[0, height + 0.15, 0]}>
        <boxGeometry args={[width + 0.1, 0.3, depth + 0.1]} />
        <meshStandardMaterial color="#1e293b" flatShading />
      </mesh>
    </group>
  )
}

function JoshuvasWorldArch({ position = [0, 0, 18] }: { position?: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Left Tower Pillar */}
      <mesh castShadow position={[-5.5, 6, 0]}>
        <boxGeometry args={[0.9, 12, 0.9]} />
        <meshStandardMaterial color="#1e1b4b" flatShading roughness={0.3} />
      </mesh>
      {/* Right Tower Pillar */}
      <mesh castShadow position={[5.5, 6, 0]}>
        <boxGeometry args={[0.9, 12, 0.9]} />
        <meshStandardMaterial color="#1e1b4b" flatShading roughness={0.3} />
      </mesh>

      {/* Crossbar Arch Span */}
      <mesh castShadow position={[0, 11.5, 0]}>
        <boxGeometry args={[12.2, 1.6, 0.95]} />
        <meshStandardMaterial color="#0f172a" flatShading roughness={0.4} />
      </mesh>
      {/* Neon glowing outline frame */}
      <mesh position={[0, 11.5, 0]}>
        <boxGeometry args={[12.35, 1.75, 0.85]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.8} />
      </mesh>

      {/* Front Glowing 3D Text: JOSHUVA'S WORLD */}
      <Text
        position={[0, 11.5, 0.52]}
        fontSize={0.65}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        outlineWidth={0.04}
        outlineColor="#4c1d95"
      >
        ✦ JOSHUVA'S WORLD ✦
      </Text>

      {/* Back Glowing 3D Text: JOSHUVA'S WORLD */}
      <Text
        position={[0, 11.5, -0.52]}
        rotation={[0, Math.PI, 0]}
        fontSize={0.65}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.15}
        outlineWidth={0.04}
        outlineColor="#4c1d95"
      >
        ✦ JOSHUVA'S WORLD ✦
      </Text>

      {/* Beacon Lights on top of pillars */}
      {[-5.5, 5.5].map((x, i) => (
        <group key={i} position={[x, 12.4, 0]}>
          <mesh>
            <cylinderGeometry args={[0.1, 0.15, 0.4, 6]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshStandardMaterial color="#38bdf8" emissive="#38bdf8" emissiveIntensity={3} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

// ── In-World Controls Sign Board at Spawn Arch ────────────────────────────────
function InstructionBoard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Post */}
      <mesh castShadow position={[0, 1.4, 0]}>
        <cylinderGeometry args={[0.06, 0.08, 2.8, 8]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.5} metalness={0.4} />
      </mesh>
      {/* Panel backing */}
      <mesh castShadow position={[0, 3.2, 0]}>
        <boxGeometry args={[3.4, 2.0, 0.1]} />
        <meshStandardMaterial color="#0a0720" roughness={0.4} metalness={0.3} />
      </mesh>
      {/* Violet glow border */}
      <mesh position={[0, 3.2, 0.01]}>
        <boxGeometry args={[3.46, 2.06, 0.06]} />
        <meshStandardMaterial color="#7c3aed" emissive="#7c3aed" emissiveIntensity={0.7} />
      </mesh>
      <Text position={[0, 4.0, 0.12]} fontSize={0.22} color="#a78bfa" anchorX="center" anchorY="middle" letterSpacing={0.1}>
        🎮 CONTROLS
      </Text>
      <Text position={[0, 3.62, 0.12]} fontSize={0.155} color="#f1f5f9" anchorX="center" anchorY="middle">
        W / ↑  ·  Accelerate
      </Text>
      <Text position={[0, 3.36, 0.12]} fontSize={0.155} color="#f1f5f9" anchorX="center" anchorY="middle">
        S / ↓  ·  Brake / Reverse
      </Text>
      <Text position={[0, 3.10, 0.12]} fontSize={0.155} color="#f1f5f9" anchorX="center" anchorY="middle">
        A / D  ·  Steer Left / Right
      </Text>
      <Text position={[0, 2.84, 0.12]} fontSize={0.155} color="#38bdf8" anchorX="center" anchorY="middle">
        Enter  ·  Zoom Into Station
      </Text>
      <Text position={[0, 2.58, 0.12]} fontSize={0.155} color="#34d399" anchorX="center" anchorY="middle">
        Esc  ·  Exit Station
      </Text>
      <Text position={[0, 2.32, 0.12]} fontSize={0.155} color="#fbbf24" anchorX="center" anchorY="middle">
        N / P  ·  Next / Prev Station
      </Text>
    </group>
  )
}

export default function World() {
  return (
    <group>
      {/* Landscape Ground terrain */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#10b981" roughness={0.8} />
      </mesh>

      {/* Grand Entry Landmark: JOSHUVA'S WORLD */}
      <JoshuvasWorldArch position={[0, 0, 18]} />

      {/* In-World Controls Board at spawn point */}
      <InstructionBoard position={[-6, 0, 17]} />

      {/* ── Cyber Highway Roadway Network ──────────────────────────────────── */}
      <CyberHighway />

      {/* ── High Altitude Floating Clouds ─────────────────────────────── */}
      <LowPolyCloud position={[-15, 14, 10]} scale={1.8} speed={0.4} />
      <LowPolyCloud position={[18, 16, 12]} scale={2.2} speed={0.5} />
      <LowPolyCloud position={[5, 15, -14]} scale={1.6} speed={0.3} />
      <LowPolyCloud position={[-20, 13, -15]} scale={2.0} speed={0.45} />
      <LowPolyCloud position={[22, 17, -5]} scale={1.7} speed={0.35} />

      {/* ── Trees ────────────────────────────────────────────────────── */}
      <Tree position={[4, 0, 4]} />
      <Tree position={[-4, 0, 4]} />
      <Tree position={[4, 0, -4]} />
      <Tree position={[-4, 0, -4]} />
      <Tree position={[8, 0, 8]} />
      <Tree position={[-8, 0, 8]} />
      <Tree position={[8, 0, -8]} />
      <Tree position={[-8, 0, -8]} />
      <Tree position={[18, 0, 15]} />
      <Tree position={[-18, 0, 15]} />
      <Tree position={[18, 0, -15]} />
      <Tree position={[-18, 0, -15]} />
      <Tree position={[22, 0, 2]} />
      <Tree position={[-22, 0, 2]} />

      {/* ── Ambient Background Architecture ──────────────────────────── */}
      <AmbientBuilding position={[24, 0, 8]} width={5} depth={5} height={5} color="#475569" />
      <AmbientBuilding position={[25, 0, -6]} width={4} depth={4} height={7} color="#334155" />
      <AmbientBuilding position={[-24, 0, 8]} width={5} depth={4} height={4} color="#475569" />
      <AmbientBuilding position={[-25, 0, -8]} width={4} depth={4} height={6} color="#334155" />
      <AmbientBuilding position={[10, 0, -22]} width={4} depth={4} height={5} color="#1e293b" />
      <AmbientBuilding position={[-8, 0, -23]} width={4} depth={5} height={4} color="#334155" />
    </group>
  )
}
