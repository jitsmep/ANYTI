"use client"

import React, { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { StationAirstrip } from "./data/flightPath"
import { STATIONS } from "./data/stations"

export type VehicleMode =
  | "ENTERING"
  | "CRUISING"
  | "APPROACHING"
  | "ENTERING_STATION"
  | "INSIDE_STATION"
  | "EXITING_STATION"

interface VehicleControllerProps {
  mode: VehicleMode
  activeStation: StationAirstrip | null
  activeBoardIndex?: number // 0: Left, 1: Center, 2: Right
  pointerOffset: { x: number; y: number }
  throttleInput?: number // -1 (brake/reverse), 0 (idle), +1 (accelerate)
  steerInput?: number // -1 (left), 0, +1 (right)
  targetPosition?: [number, number, number] | null
  targetHeading?: number | null
  targetProgress?: number | null
  onProgressUpdate: (progress: number, pos: THREE.Vector3, speed: number, yaw: number) => void
  onInsideStationReached?: () => void
  onExitStationComplete?: () => void
  onEnterComplete?: () => void
}

// ── Module-Scope Wheel Component ─────────────────────────────────────────────
function WheelGeometry({ isFront = false }: { isFront?: boolean }) {
  const WHEEL_COLOR = "#080714"
  const HUB_COLOR = "#818cf8"
  const CHROME = "#e2e8f0"

  return (
    <>
      {/* Rubber Tire */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.31, 0.31, isFront ? 0.22 : 0.26, 22]} />
        <meshStandardMaterial color={WHEEL_COLOR} roughness={0.9} />
      </mesh>
      {/* Neon Hub Ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.18, 0.18, isFront ? 0.24 : 0.28, 14]} />
        <meshStandardMaterial
          color={HUB_COLOR}
          emissive={HUB_COLOR}
          emissiveIntensity={1.8}
          metalness={0.6}
        />
      </mesh>
      {/* 5 Spoke Accents */}
      {[0, 1, 2, 3, 4].map((i) => (
        <mesh
          key={i}
          rotation={[Math.PI / 2, (i * Math.PI * 2) / 5, 0]}
          position={[0, 0, 0]}
        >
          <boxGeometry args={[0.04, 0.28, 0.03]} />
          <meshStandardMaterial color={CHROME} metalness={0.92} roughness={0.1} />
        </mesh>
      ))}
      {/* Beveled Outer Tread Ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.31, 0.02, 6, 22]} />
        <meshStandardMaterial color="#1e293b" roughness={0.8} />
      </mesh>
    </>
  )
}

// ── Premium Cyber Roadster Mesh ───────────────────────────────────────────────
function CyberCarMesh({
  speedRef,
  steerInputRef,
  throttleInputRef,
}: {
  speedRef: React.MutableRefObject<number>
  steerInputRef: React.MutableRefObject<number>
  throttleInputRef: React.MutableRefObject<number>
}) {
  const flSteerRef = useRef<THREE.Group>(null)
  const frSteerRef = useRef<THREE.Group>(null)
  const flSpinRef = useRef<THREE.Group>(null)
  const frSpinRef = useRef<THREE.Group>(null)
  const rlSpinRef = useRef<THREE.Group>(null)
  const rrSpinRef = useRef<THREE.Group>(null)

  const brakeLightRef = useRef<THREE.Mesh>(null)
  const underglowRef = useRef<THREE.Mesh>(null)

  useFrame((state, delta) => {
    const safeDelta = Math.min(delta, 0.05)
    const speed = speedRef.current
    const steer = steerInputRef.current
    const throttle = throttleInputRef.current

    // Rotate wheels proportionally to velocity (forward or reverse)
    // Speed is in world units/sec (0..18 u/s). Circumference is 2 * pi * 0.31 ≈ 1.95m
    const spinDelta = (speed / 0.31) * safeDelta
    if (flSpinRef.current) flSpinRef.current.rotation.x += spinDelta
    if (frSpinRef.current) frSpinRef.current.rotation.x += spinDelta
    if (rlSpinRef.current) rlSpinRef.current.rotation.x += spinDelta
    if (rrSpinRef.current) rrSpinRef.current.rotation.x += spinDelta

    // Front wheel visual steering angle (turns wheels left/right)
    const targetSteerAngle = -steer * 0.48
    if (flSteerRef.current) {
      flSteerRef.current.rotation.y = THREE.MathUtils.lerp(
        flSteerRef.current.rotation.y,
        targetSteerAngle,
        0.3
      )
    }
    if (frSteerRef.current) {
      frSteerRef.current.rotation.y = THREE.MathUtils.lerp(
        frSteerRef.current.rotation.y,
        targetSteerAngle,
        0.3
      )
    }

    // Dynamic brake lights
    if (brakeLightRef.current) {
      const isBraking = (throttle < 0 && speed > 0.2) || (throttle < 0 && speed < -0.1)
      const mat = brakeLightRef.current.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = isBraking ? 5.5 : 1.2
      mat.color.set(isBraking ? "#ef4444" : "#991b1b")
      mat.emissive.set(isBraking ? "#ef4444" : "#7f1d1d")
    }

    // Underglow pulse
    if (underglowRef.current) {
      const mat = underglowRef.current.material as THREE.MeshBasicMaterial
      mat.opacity = 0.38 + Math.sin(state.clock.elapsedTime * 3.5) * 0.12
    }
  })

  const BODY_COLOR = "#120c2e"   // Deep midnight metallic indigo
  const ACCENT_COLOR = "#7c3aed" // Cyberpunk violet accent
  const GLOW_COLOR = "#38bdf8"   // Electric sky-blue underglow
  const CHROME = "#e2e8f0"

  return (
    <group position={[0, 0, 0]}>
      {/* ── Main Chassis Body ──────────────────────────────────────────────── */}
      {/* Lower chassis slab (Y center 0.28 -> bottom at Y=0.13, 13cm clearance) */}
      <mesh castShadow position={[0, 0.28, 0]}>
        <boxGeometry args={[1.72, 0.30, 3.7]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.25} metalness={0.65} />
      </mesh>

      {/* Mid body — muscular shoulder lines */}
      <mesh castShadow position={[0, 0.46, -0.1]}>
        <boxGeometry args={[1.80, 0.20, 3.3]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.22} metalness={0.68} />
      </mesh>

      {/* Fastback aerodynamic roofline */}
      <mesh castShadow position={[0, 0.72, -0.35]}>
        <boxGeometry args={[1.42, 0.32, 2.2]} />
        <meshStandardMaterial color={BODY_COLOR} roughness={0.18} metalness={0.7} />
      </mesh>

      {/* Cabin greenhouse dome */}
      <mesh castShadow position={[0, 0.92, -0.4]}>
        <boxGeometry args={[1.28, 0.22, 1.6]} />
        <meshStandardMaterial color="#080417" roughness={0.1} metalness={0.8} />
      </mesh>

      {/* ── Windshield & Glazing ────────────────────────────────────────────── */}
      <mesh position={[0, 0.90, 0.42]} rotation={[-0.32, 0, 0]}>
        <boxGeometry args={[1.22, 0.38, 0.05]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#0369a1" emissiveIntensity={0.55} transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.85, -1.3]} rotation={[0.3, 0, 0]}>
        <boxGeometry args={[1.15, 0.28, 0.05]} />
        <meshStandardMaterial color="#7dd3fc" emissive="#0369a1" emissiveIntensity={0.35} transparent opacity={0.7} />
      </mesh>
      {[-0.65, 0.65].map((x, i) => (
        <mesh key={i} position={[x, 0.91, -0.25]} rotation={[0, Math.PI / 2, 0]}>
          <boxGeometry args={[1.1, 0.24, 0.04]} />
          <meshStandardMaterial color="#7dd3fc" emissive="#075985" emissiveIntensity={0.35} transparent opacity={0.65} />
        </mesh>
      ))}

      {/* ── Front Fascia & Aerodynamics ─────────────────────────────────────── */}
      <mesh castShadow position={[0, 0.18, 1.88]}>
        <boxGeometry args={[1.68, 0.10, 0.28]} />
        <meshStandardMaterial color="#080415" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.26, 1.86]}>
        <boxGeometry args={[1.5, 0.14, 0.08]} />
        <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.7} />
      </mesh>

      {/* Quad LED Headlights */}
      {[-0.52, -0.2, 0.2, 0.52].map((x, i) => (
        <mesh key={i} position={[x, 0.40, 1.87]}>
          <boxGeometry args={[0.22, 0.07, 0.05]} />
          <meshStandardMaterial color="#f0f9ff" emissive="#ffffff" emissiveIntensity={4.0} />
        </mesh>
      ))}
      <mesh position={[0, 0.48, 1.87]}>
        <boxGeometry args={[1.62, 0.035, 0.05]} />
        <meshStandardMaterial color={GLOW_COLOR} emissive={GLOW_COLOR} emissiveIntensity={2.5} />
      </mesh>

      {/* ── Rear Fascia & Tail Lights ────────────────────────────────────────── */}
      <mesh ref={brakeLightRef} position={[0, 0.54, -1.87]}>
        <boxGeometry args={[1.65, 0.09, 0.06]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0.18, -1.88]}>
        <boxGeometry args={[1.5, 0.16, 0.12]} />
        <meshStandardMaterial color="#060312" roughness={0.6} />
      </mesh>
      {[-0.45, 0.45].map((x, i) => (
        <mesh key={i} position={[x, 0.22, -1.88]}>
          <cylinderGeometry args={[0.06, 0.07, 0.14, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
        </mesh>
      ))}

      {/* ── Spoiler & Aero Wings ────────────────────────────────────────────── */}
      <mesh castShadow position={[0, 1.15, -1.52]}>
        <boxGeometry args={[1.55, 0.07, 0.42]} />
        <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.5} metalness={0.4} roughness={0.3} />
      </mesh>
      {[-0.78, 0.78].map((x, i) => (
        <mesh key={i} position={[x, 1.11, -1.52]}>
          <boxGeometry args={[0.08, 0.28, 0.40]} />
          <meshStandardMaterial color={BODY_COLOR} roughness={0.3} metalness={0.5} />
        </mesh>
      ))}
      {[-0.5, 0.5].map((x, i) => (
        <mesh key={i} castShadow position={[x, 1.0, -1.55]}>
          <boxGeometry args={[0.06, 0.26, 0.08]} />
          <meshStandardMaterial color={CHROME} metalness={0.9} roughness={0.15} />
        </mesh>
      ))}

      {/* ── Side Skirts ─────────────────────────────────────────────────────── */}
      {[-0.87, 0.87].map((x, i) => (
        <group key={i} position={[x, 0.20, -0.05]}>
          <mesh castShadow>
            <boxGeometry args={[0.07, 0.14, 2.9]} />
            <meshStandardMaterial color="#120c2e" roughness={0.4} metalness={0.4} />
          </mesh>
          <mesh position={[0, 0.04, 0]}>
            <boxGeometry args={[0.08, 0.03, 2.85]} />
            <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={1.2} />
          </mesh>
        </group>
      ))}

      {/* ── Neon Underglow (Right above asphalt surface) ─────────────────────── */}
      <mesh ref={underglowRef} position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0, 3.5]} />
        <meshBasicMaterial color={GLOW_COLOR} transparent opacity={0.45} depthWrite={false} />
      </mesh>

      {/* ── Hood Power Crease & Vent ────────────────────────────────────────── */}
      <mesh position={[0, 0.58, 1.0]}>
        <boxGeometry args={[0.55, 0.03, 0.4]} />
        <meshStandardMaterial color={ACCENT_COLOR} emissive={ACCENT_COLOR} emissiveIntensity={0.8} />
      </mesh>

      {/* ── 4 Wheels (Wheel center Y=0.31; tire radius=0.31 -> bottom at Y=0.00!) ── */}
      <group position={[-0.9, 0.31, 1.12]} ref={flSteerRef}>
        <group ref={flSpinRef}>
          <WheelGeometry isFront />
        </group>
      </group>

      <group position={[0.9, 0.31, 1.12]} ref={frSteerRef}>
        <group ref={frSpinRef}>
          <WheelGeometry isFront />
        </group>
      </group>

      <group position={[-0.9, 0.31, -1.15]}>
        <group ref={rlSpinRef}>
          <WheelGeometry />
        </group>
      </group>

      <group position={[0.9, 0.31, -1.15]}>
        <group ref={rrSpinRef}>
          <WheelGeometry />
        </group>
      </group>
    </group>
  )
}

// ── Main Open-World Free-Roam Vehicle Controller ──────────────────────────────
export default function VehicleController({
  mode,
  activeStation,
  activeBoardIndex = 1,
  pointerOffset,
  throttleInput = 0,
  steerInput = 0,
  targetPosition,
  targetHeading,
  onProgressUpdate,
  onInsideStationReached,
  onExitStationComplete,
  onEnterComplete,
}: VehicleControllerProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Free-Roam Car State: 3D Position and Orientation
  const posRef = useRef(new THREE.Vector3(0, 0, 18)) // Starts under Joshuva's Arch
  const yawRef = useRef(Math.PI) // Heading North (-Z) through the Arch
  const speedRef = useRef(0.0) // World units / sec
  const transitionTimeRef = useRef(0)

  // Input refs passed into CyberCarMesh for 60fps render loop
  const steerInputRef = useRef(0)
  steerInputRef.current = steerInput
  const throttleInputRef = useRef(0)
  throttleInputRef.current = throttleInput

  // Camera tracking vectors
  const camPosRef = useRef(new THREE.Vector3(0, 3.2, 25))
  const camLookRef = useRef(new THREE.Vector3(0, 1.2, 18))
  const zoomStartCamRef = useRef(new THREE.Vector3())
  const zoomStartLookRef = useRef(new THREE.Vector3())

  const s = useMemo(
    () => ({
      targetCam: new THREE.Vector3(),
      targetLook: new THREE.Vector3(),
    }),
    []
  )

  useEffect(() => {
    transitionTimeRef.current = 0
    if (mode === "ENTERING_STATION") {
      zoomStartCamRef.current.copy(camPosRef.current)
      zoomStartLookRef.current.copy(camLookRef.current)
    } else if (mode === "EXITING_STATION") {
      zoomStartCamRef.current.copy(camPosRef.current)
      zoomStartLookRef.current.copy(camLookRef.current)
    }
  }, [mode, activeStation])

  // Support fast-travel / skip targets
  useEffect(() => {
    if (targetPosition) {
      posRef.current.set(targetPosition[0], 0, targetPosition[2])
      if (targetHeading !== undefined && targetHeading !== null) {
        yawRef.current = targetHeading
      }
      speedRef.current = 0
    }
  }, [targetPosition, targetHeading])

  useFrame(({ camera, clock }, delta) => {
    if (!groupRef.current) return
    const safeDelta = Math.min(delta, 0.05)

    // ──────────────────────────────────────────────────────────────────────────
    // 0. ENTERING JOSHUVA'S WORLD (Cinematic Spawn through Arch)
    // ──────────────────────────────────────────────────────────────────────────
    if (mode === "ENTERING") {
      // If user wants to drive immediately, skip intro right away!
      if (throttleInput !== 0 || steerInput !== 0) {
        speedRef.current = throttleInput > 0 ? 6.0 : -3.0
        onEnterComplete?.()
        return
      }

      transitionTimeRef.current += safeDelta * 0.65
      const p = Math.min(transitionTimeRef.current, 1.0)
      const ease = THREE.MathUtils.smoothstep(p, 0, 1)

      // Roll forward through the arch from Z=18 to Z=15.5
      posRef.current.set(0, 0, 18 - ease * 2.5)
      yawRef.current = Math.PI

      groupRef.current.position.copy(posRef.current)
      groupRef.current.rotation.set(0, yawRef.current, 0)

      // Cinematic camera tucking behind the car
      const camStart = new THREE.Vector3(0, 5.0, 26)
      const camEnd = new THREE.Vector3(0, 2.8, posRef.current.z + 7.0)
      s.targetCam.lerpVectors(camStart, camEnd, ease)
      s.targetLook.set(0, 1.1, posRef.current.z - 3.5)

      camPosRef.current.lerp(s.targetCam, 0.08)
      camLookRef.current.lerp(s.targetLook, 0.08)
      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      onProgressUpdate(0, posRef.current, Math.round(15 * (1 - ease * 0.4)), yawRef.current)

      if (p >= 1.0) {
        speedRef.current = 3.0
        onEnterComplete?.()
      }
      return
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 1. FREE-ROAM CAR DRIVING PHYSICS (Your Free Will: Drive & Steer Anywhere!)
    // ──────────────────────────────────────────────────────────────────────────
    if (mode === "CRUISING" || mode === "APPROACHING") {
      const MAX_FORWARD_SPEED = 18.0 // ~65 mph
      const MAX_REVERSE_SPEED = -8.0 // ~30 mph
      const ACCEL = 16.0             // Responsive high-torque acceleration
      const BRAKE = 30.0             // Sharp brakes
      const REVERSE_ACCEL = 9.0      // Immediate reverse response
      const FRICTION = 6.0           // Natural road rolling resistance

      // Throttle & Brake calculations
      if (throttleInput > 0) {
        if (speedRef.current < 0) {
          // Braking from reverse
          speedRef.current = Math.min(0, speedRef.current + BRAKE * safeDelta)
        } else {
          speedRef.current += ACCEL * safeDelta * throttleInput
          if (speedRef.current > MAX_FORWARD_SPEED) speedRef.current = MAX_FORWARD_SPEED
        }
      } else if (throttleInput < 0) {
        if (speedRef.current > 0.2) {
          // Hard brake while moving forward
          speedRef.current = Math.max(0, speedRef.current - BRAKE * safeDelta)
        } else {
          // Smooth reverse
          speedRef.current += throttleInput * REVERSE_ACCEL * safeDelta
          if (speedRef.current < MAX_REVERSE_SPEED) speedRef.current = MAX_REVERSE_SPEED
        }
      } else {
        // Coasting to stop
        if (speedRef.current > 0) {
          speedRef.current = Math.max(0, speedRef.current - FRICTION * safeDelta)
        } else if (speedRef.current < 0) {
          speedRef.current = Math.min(0, speedRef.current + FRICTION * safeDelta)
        }
      }

      // Free-Will Steering: turning changes the car's heading yaw!
      // In car physics, turn rate is proportional to forward/reverse movement
      if (Math.abs(speedRef.current) > 0.15 && steerInput !== 0) {
        const dir = speedRef.current >= 0 ? 1 : -1
        const speedFactor = Math.min(1.0, Math.abs(speedRef.current) / 6.0)
        const turnRate = 2.4 * steerInput * dir * speedFactor
        yawRef.current += turnRate * safeDelta
      }

      // Forward unit vector based on current car heading
      const fx = Math.sin(yawRef.current)
      const fz = Math.cos(yawRef.current)

      // Move car position freely in world coordinates
      posRef.current.x += fx * speedRef.current * safeDelta
      posRef.current.z += fz * speedRef.current * safeDelta

      // World boundaries (keep within landscape terrain)
      posRef.current.x = THREE.MathUtils.clamp(posRef.current.x, -42, 42)
      posRef.current.z = THREE.MathUtils.clamp(posRef.current.z, -38, 32)
      posRef.current.y = 0 // Wheels always firmly on ground!

      // Dynamic chassis attitude: slight squat on accel, dive on brake, subtle centrifugal roll
      const chassisPitch =
        throttleInput > 0
          ? -0.018
          : throttleInput < 0 && speedRef.current > 0.5
          ? 0.028
          : 0
      const chassisRoll =
        Math.abs(speedRef.current) > 1.0
          ? steerInput * (speedRef.current / MAX_FORWARD_SPEED) * 0.035
          : 0

      groupRef.current.position.copy(posRef.current)
      groupRef.current.rotation.set(chassisPitch, yawRef.current, chassisRoll)

      // Elevated Third-Person Chase Camera tracking car position and heading
      const speedRatio = Math.abs(speedRef.current) / MAX_FORWARD_SPEED
      const CAM_BACK = 6.8 + speedRatio * 1.6
      const CAM_HEIGHT = 2.8 + speedRatio * 0.6

      s.targetCam.set(
        posRef.current.x - fx * CAM_BACK,
        posRef.current.y + CAM_HEIGHT,
        posRef.current.z - fz * CAM_BACK
      )
      s.targetLook.set(
        posRef.current.x + fx * 4.0,
        posRef.current.y + 1.2,
        posRef.current.z + fz * 4.0
      )

      camPosRef.current.lerp(s.targetCam, 0.12)
      camLookRef.current.lerp(s.targetLook, 0.12)
      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      const displayMph = Math.round((Math.abs(speedRef.current) / MAX_FORWARD_SPEED) * 72)
      onProgressUpdate(0, posRef.current, displayMph, yawRef.current)
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. ENTERING STATION (Camera Zoom into Exhibition Hall)
    // ──────────────────────────────────────────────────────────────────────────
    else if (mode === "ENTERING_STATION" && activeStation) {
      transitionTimeRef.current += safeDelta * 0.8
      const p = Math.min(transitionTimeRef.current, 1.0)
      const ease = THREE.MathUtils.smoothstep(p, 0, 1)

      // Park car firmly at the station touchdown spot
      posRef.current.set(activeStation.touchdown[0], 0, activeStation.touchdown[2])
      yawRef.current = activeStation.touchdownRotY
      speedRef.current = 0

      groupRef.current.position.copy(posRef.current)
      groupRef.current.rotation.set(0, yawRef.current, 0)

      const startCam = zoomStartCamRef.current.lengthSq() > 0
        ? zoomStartCamRef.current
        : new THREE.Vector3(...activeStation.cameraPos)
      const startLook = zoomStartLookRef.current.lengthSq() > 0
        ? zoomStartLookRef.current
        : new THREE.Vector3(...activeStation.cameraLookAt)
      const insideCam = new THREE.Vector3(...activeStation.insideCamPos)
      const insideLook = new THREE.Vector3(...activeStation.insideCamLookAt)

      s.targetCam.lerpVectors(startCam, insideCam, ease)
      s.targetLook.lerpVectors(startLook, insideLook, ease)

      camPosRef.current.lerp(s.targetCam, 0.15)
      camLookRef.current.lerp(s.targetLook, 0.15)
      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      if (p >= 1.0) {
        onInsideStationReached?.()
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. INSIDE STATION (Exhibition Mode - Focus on Left/Center/Right Boards)
    // ──────────────────────────────────────────────────────────────────────────
    else if (mode === "INSIDE_STATION" && activeStation) {
      posRef.current.set(activeStation.touchdown[0], 0, activeStation.touchdown[2])
      groupRef.current.position.copy(posRef.current)

      const stationDef = STATIONS.find((st) => st.id === activeStation.id)
      const [sx, sy, sz] = stationDef ? stationDef.position : activeStation.touchdown

      let targetCamPos: THREE.Vector3
      let targetLookAt: THREE.Vector3

      if (activeBoardIndex === 0) {
        targetCamPos = new THREE.Vector3(sx + 0.9, sy + 1.8, sz)
        targetLookAt = new THREE.Vector3(sx - 2.3, sy + 1.8, sz)
      } else if (activeBoardIndex === 2) {
        targetCamPos = new THREE.Vector3(sx - 0.9, sy + 1.8, sz)
        targetLookAt = new THREE.Vector3(sx + 2.3, sy + 1.8, sz)
      } else {
        targetCamPos = new THREE.Vector3(sx, sy + 1.8, sz + 1.3)
        targetLookAt = new THREE.Vector3(sx, sy + 1.8, sz - 1.8)
      }

      const time = clock.getElapsedTime()
      const floatX = Math.sin(time * 0.4) * 0.03
      const floatY = Math.cos(time * 0.6) * 0.02

      s.targetCam.copy(targetCamPos).add(new THREE.Vector3(floatX, floatY, 0))
      s.targetLook.copy(targetLookAt)

      camPosRef.current.lerp(s.targetCam, 0.1)
      camLookRef.current.lerp(s.targetLook, 0.1)
      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. EXITING STATION (Reverse Camera Back to Car Outside)
    // ──────────────────────────────────────────────────────────────────────────
    else if (mode === "EXITING_STATION" && activeStation) {
      transitionTimeRef.current += safeDelta * 0.8
      const p = Math.min(transitionTimeRef.current, 1.0)
      const ease = THREE.MathUtils.smoothstep(p, 0, 1)

      const startCam = zoomStartCamRef.current.lengthSq() > 0
        ? zoomStartCamRef.current
        : new THREE.Vector3(...activeStation.insideCamPos)
      const startLook = zoomStartLookRef.current.lengthSq() > 0
        ? zoomStartLookRef.current
        : new THREE.Vector3(...activeStation.insideCamLookAt)
      const outsideCam = new THREE.Vector3(...activeStation.cameraPos)
      const outsideLook = new THREE.Vector3(...activeStation.cameraLookAt)

      s.targetCam.lerpVectors(startCam, outsideCam, ease)
      s.targetLook.lerpVectors(startLook, outsideLook, ease)

      camPosRef.current.lerp(s.targetCam, 0.14)
      camLookRef.current.lerp(s.targetLook, 0.14)
      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      if (p >= 1.0) {
        speedRef.current = 4.0 // Ready to drive away
        onExitStationComplete?.()
      }
    }
  })

  return (
    <group ref={groupRef}>
      <CyberCarMesh
        speedRef={speedRef}
        steerInputRef={steerInputRef}
        throttleInputRef={throttleInputRef}
      />
    </group>
  )
}
