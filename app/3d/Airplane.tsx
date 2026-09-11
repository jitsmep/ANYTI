"use client"

import React, { useRef, useMemo, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { FLIGHT_CURVE, StationAirstrip } from "./data/flightPath"
import type { StationId } from "./data/stations"

export type FlightMode = "ENTERING" | "CRUISING" | "APPROACHING" | "LANDING" | "INSPECTING" | "TAKEOFF"

interface AirplaneProps {
  flightMode: FlightMode
  activeAirstrip: StationAirstrip | null
  pointerOffset: { x: number; y: number } // Normalized -1..+1
  targetProgress?: number | null
  onProgressUpdate: (progress: number, pos: THREE.Vector3, altitude: number, speed: number) => void
  onLandingComplete: () => void
  onTakeoffComplete: () => void
  onEnterComplete?: () => void
}

// Bounding box limits for user steer offsets (local space) - calibrated for gentle, stable control
const BOUNDS = { maxX: 2.6, maxY: 1.5 }
const DAMP_SPEED = 2.8 // Smoother, fluid glide damping
const WORLD_UP = new THREE.Vector3(0, 1, 0)
const BASE_CRUISE_SPEED = 0.020 // Relaxed, cinematic cruise speed (~50s per lap)

// ── Wingtip Vapor Trails (Two streaming ribbon trails from wingtips) ───────────
function WingtipTrails({
  leftWingPos,
  rightWingPos,
}: {
  leftWingPos: React.MutableRefObject<THREE.Vector3>
  rightWingPos: React.MutableRefObject<THREE.Vector3>
}) {
  const COUNT = 24
  const leftPoints = useRef<THREE.Vector3[]>(Array.from({ length: COUNT }, () => new THREE.Vector3()))
  const rightPoints = useRef<THREE.Vector3[]>(Array.from({ length: COUNT }, () => new THREE.Vector3()))

  const leftGeom = useMemo(() => new THREE.BufferGeometry(), [])
  const rightGeom = useMemo(() => new THREE.BufferGeometry(), [])

  useFrame(() => {
    // Shift left trail points
    const lp = leftPoints.current
    for (let i = COUNT - 1; i > 0; i--) {
      lp[i].copy(lp[i - 1])
    }
    lp[0].copy(leftWingPos.current)
    leftGeom.setFromPoints(lp)

    // Shift right trail points
    const rp = rightPoints.current
    for (let i = COUNT - 1; i > 0; i--) {
      rp[i].copy(rp[i - 1])
    }
    rp[0].copy(rightWingPos.current)
    rightGeom.setFromPoints(rp)
  })

  const leftLine = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.45 })
    return new THREE.Line(leftGeom, mat)
  }, [leftGeom])

  const rightLine = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#38bdf8", transparent: true, opacity: 0.45 })
    return new THREE.Line(rightGeom, mat)
  }, [rightGeom])

  return (
    <>
      <primitive object={leftLine} />
      <primitive object={rightLine} />
    </>
  )
}

// ── Low-poly Stylized Aircraft Model ──────────────────────────────────────────
function AircraftMesh() {
  const propRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (propRef.current) {
      propRef.current.rotation.z += delta * 35 // Fast spinning propeller
    }
  })

  return (
    <group rotation={[0, 0, 0]}>
      {/* Fuselage body */}
      <mesh castShadow position={[0, 0, 0]}>
        <coneGeometry args={[0.55, 3.4, 7]} />
        <meshStandardMaterial color="#6366f1" flatShading roughness={0.3} metalness={0.2} />
      </mesh>

      {/* Canopy glass */}
      <mesh position={[0, 0.38, 0.1]}>
        <boxGeometry args={[0.42, 0.38, 1.1]} />
        <meshStandardMaterial
          color="#38bdf8"
          emissive="#0284c7"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.8}
        />
      </mesh>

      {/* Main swept wings */}
      <mesh castShadow position={[0, 0.05, 0.1]}>
        <boxGeometry args={[5.2, 0.08, 1.0]} />
        <meshStandardMaterial color="#4f46e5" flatShading roughness={0.3} />
      </mesh>

      {/* Wingtip accent color lights */}
      <mesh position={[-2.6, 0.08, 0.1]}>
        <boxGeometry args={[0.12, 0.1, 0.35]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[2.6, 0.08, 0.1]}>
        <boxGeometry args={[0.12, 0.1, 0.35]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={1.5} />
      </mesh>

      {/* Tail fin (Vertical stabilizer) */}
      <mesh castShadow position={[0, 0.65, -1.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.08, 1.1, 0.7]} />
        <meshStandardMaterial color="#f59e0b" flatShading />
      </mesh>

      {/* Horizontal tail wings */}
      <mesh castShadow position={[0, 0.2, -1.3]}>
        <boxGeometry args={[1.8, 0.06, 0.55]} />
        <meshStandardMaterial color="#4f46e5" flatShading />
      </mesh>

      {/* Nose cone */}
      <mesh position={[0, 0, 1.72]}>
        <sphereGeometry args={[0.28, 8, 8]} />
        <meshStandardMaterial color="#f59e0b" flatShading />
      </mesh>

      {/* Spinning Propeller */}
      <group ref={propRef} position={[0, 0, 1.85]}>
        <mesh>
          <boxGeometry args={[1.7, 0.14, 0.02]} />
          <meshStandardMaterial color="#1e293b" flatShading />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <boxGeometry args={[1.7, 0.14, 0.02]} />
          <meshStandardMaterial color="#1e293b" flatShading />
        </mesh>
        {/* Semi-transparent spinning prop blur disk */}
        <mesh rotation={[0, 0, 0]}>
          <circleGeometry args={[0.85, 16]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.12} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Landing gear wheels */}
      <mesh position={[-0.7, -0.4, 0.2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 8]} />
        <meshStandardMaterial color="#1e1b4b" flatShading />
      </mesh>
      <mesh position={[0.7, -0.4, 0.2]}>
        <cylinderGeometry args={[0.18, 0.18, 0.1, 8]} />
        <meshStandardMaterial color="#1e1b4b" flatShading />
      </mesh>
      <mesh position={[0, -0.3, -1.1]}>
        <cylinderGeometry args={[0.12, 0.12, 0.08, 8]} />
        <meshStandardMaterial color="#1e1b4b" flatShading />
      </mesh>

      {/* Jet thruster glow under tail */}
      <mesh position={[0, -0.05, -1.65]} rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.18, 0.4, 8]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.7} />
      </mesh>
    </group>
  )
}

// ── Main Airplane Controller Component ────────────────────────────────────────
export default function Airplane({
  flightMode,
  activeAirstrip,
  pointerOffset,
  targetProgress,
  onProgressUpdate,
  onLandingComplete,
  onTakeoffComplete,
  onEnterComplete,
}: AirplaneProps) {
  const groupRef = useRef<THREE.Group>(null)

  // Spline progress ref (0..1)
  const progressRef = useRef(0.0)
  const localOffsetRef = useRef(new THREE.Vector2(0, 0))

  // Transition tracking
  const transitionTimeRef = useRef(0)
  const landingStartPosRef = useRef(new THREE.Vector3())
  const landingStartQuatRef = useRef(new THREE.Quaternion())

  // Wingtip positions for contrail streamers
  const leftWingWorldPos = useRef(new THREE.Vector3())
  const rightWingWorldPos = useRef(new THREE.Vector3())

  // Camera tracking refs
  const camPosRef = useRef(new THREE.Vector3(0, 14, 25))
  const camLookRef = useRef(new THREE.Vector3(0, 10, 18))

  // Scratch matrices/vectors
  const s = useMemo(
    () => ({
      pos: new THREE.Vector3(),
      tangent: new THREE.Vector3(),
      nextTangent: new THREE.Vector3(),
      binormal: new THREE.Vector3(),
      normal: new THREE.Vector3(),
      rotMatrix: new THREE.Matrix4(),
      railQuat: new THREE.Quaternion(),
      localQuat: new THREE.Quaternion(),
      finalQuat: new THREE.Quaternion(),
      targetQuat: new THREE.Quaternion(),
      euler: new THREE.Euler(0, 0, 0, "YXZ"),
      targetCam: new THREE.Vector3(),
      targetLook: new THREE.Vector3(),
      touchdownPos: new THREE.Vector3(),
      touchdownQuat: new THREE.Quaternion(),
    }),
    []
  )

  // Reset transition timer whenever mode changes
  useEffect(() => {
    transitionTimeRef.current = 0
    if (flightMode === "LANDING" && groupRef.current) {
      landingStartPosRef.current.copy(groupRef.current.position)
      landingStartQuatRef.current.copy(groupRef.current.quaternion)
    }
    if (flightMode === "TAKEOFF" && activeAirstrip) {
      landingStartPosRef.current.set(...activeAirstrip.touchdown)
    }
  }, [flightMode, activeAirstrip])

  // Sync external target progress for direct section fly-to
  useEffect(() => {
    if (targetProgress !== undefined && targetProgress !== null) {
      progressRef.current = targetProgress
    }
  }, [targetProgress])

  useFrame(({ camera }, delta) => {
    if (!groupRef.current) return
    const safeDelta = Math.min(delta, 0.05)

    // ──────────────────────────────────────────────────────────────────────────
    // 0. STATE: ENTERING JOSHUVA'S WORLD (Cinematic Fly-In Swoop from Clouds)
    // ──────────────────────────────────────────────────────────────────────────
    if (flightMode === "ENTERING") {
      transitionTimeRef.current += safeDelta * 0.36 // ~2.8s entry swoop
      const progress = Math.min(transitionTimeRef.current, 1.0)
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1)

      const startPos = new THREE.Vector3(0, 25, 32)
      const targetPos = new THREE.Vector3()
      const targetTangent = new THREE.Vector3()
      FLIGHT_CURVE.getPointAt(0.02, targetPos)
      FLIGHT_CURVE.getTangentAt(0.02, targetTangent).normalize()

      s.pos.lerpVectors(startPos, targetPos, ease)

      // Pitch nose down slightly during high-speed entry descent
      const swoopPitch = -Math.sin((1 - ease) * Math.PI) * 0.32
      s.binormal.crossVectors(targetTangent, WORLD_UP).normalize()
      s.normal.crossVectors(s.binormal, targetTangent).normalize()
      s.rotMatrix.makeBasis(s.binormal, s.normal, targetTangent)
      s.railQuat.setFromRotationMatrix(s.rotMatrix)

      s.euler.set(swoopPitch, 0, 0)
      s.localQuat.setFromEuler(s.euler)
      s.finalQuat.multiplyQuaternions(s.railQuat, s.localQuat)

      groupRef.current.position.copy(s.pos)
      groupRef.current.quaternion.slerp(s.finalQuat, 0.15)

      // Cinematic camera tracking into standard chase
      const camStart = new THREE.Vector3(0, 28, 44)
      const camEnd = new THREE.Vector3()
        .copy(targetPos)
        .addScaledVector(targetTangent, -8.5)
        .addScaledVector(WORLD_UP, 3.2)
      s.targetCam.lerpVectors(camStart, camEnd, ease)
      s.targetLook.copy(s.pos).addScaledVector(targetTangent, 6.0)

      camPosRef.current.lerp(s.targetCam, 0.08)
      camLookRef.current.lerp(s.targetLook, 0.08)

      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      onProgressUpdate(progress * 0.02, s.pos, s.pos.y, (1 + ease) * 40)

      if (progress >= 1.0) {
        progressRef.current = 0.02
        onEnterComplete?.()
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 1. STATE: CRUISING / APPROACHING
    // ──────────────────────────────────────────────────────────────────────────
    else if (flightMode === "CRUISING" || flightMode === "APPROACHING") {
      progressRef.current = (progressRef.current + BASE_CRUISE_SPEED * safeDelta) % 1.0
      const t = progressRef.current

      // Sample spline point & tangent
      FLIGHT_CURVE.getPointAt(t, s.pos)
      FLIGHT_CURVE.getTangentAt(t, s.tangent).normalize()

      // Calculate parallel-transport frame
      s.binormal.crossVectors(s.tangent, WORLD_UP).normalize()
      if (s.binormal.lengthSq() < 0.001) {
        s.binormal.set(1, 0, 0)
      }
      s.normal.crossVectors(s.binormal, s.tangent).normalize()

      // Aircraft model points in +Z direction, so tangent is forward (+Z), binormal is right (+X), normal is up (+Y)
      s.rotMatrix.makeBasis(s.binormal, s.normal, s.tangent)
      s.railQuat.setFromRotationMatrix(s.rotMatrix)

      // Apply bounded screen-space offset (auto-centers onto runway when approaching)
      const targetOffX = flightMode === "APPROACHING" ? 0 : pointerOffset.x * BOUNDS.maxX
      const targetOffY = flightMode === "APPROACHING" ? 0 : pointerOffset.y * BOUNDS.maxY
      const damp = 1 - Math.exp(-DAMP_SPEED * safeDelta)
      localOffsetRef.current.x += (targetOffX - localOffsetRef.current.x) * damp
      localOffsetRef.current.y += (targetOffY - localOffsetRef.current.y) * damp

      s.pos.addScaledVector(s.binormal, localOffsetRef.current.x)
      s.pos.addScaledVector(s.normal, localOffsetRef.current.y)

      // Calculate path curvature banking - gentle, cinematic tilt
      const sampleT = (t + 0.015) % 1.0
      FLIGHT_CURVE.getTangentAt(sampleT, s.nextTangent).normalize()
      const curvatureSteer = s.binormal.dot(s.nextTangent) // Positive = right turn
      const pathBank = -curvatureSteer * 1.25

      // User steer banking and pitch - soft, reassuring angles
      const userBank = -localOffsetRef.current.x * 0.10
      const userPitch = -localOffsetRef.current.y * 0.07
      const userYaw = -localOffsetRef.current.x * 0.04

      // Clamped to gentle limits: max 24° roll and 15° pitch
      const roll = THREE.MathUtils.clamp(pathBank + userBank, -Math.PI / 7.5, Math.PI / 7.5)
      const pitch = THREE.MathUtils.clamp(userPitch, -Math.PI / 12, Math.PI / 12)
      const yaw = userYaw

      s.euler.set(pitch, yaw, roll)
      s.localQuat.setFromEuler(s.euler)
      s.finalQuat.multiplyQuaternions(s.railQuat, s.localQuat)

      // Update mesh with smooth interpolation
      groupRef.current.position.copy(s.pos)
      groupRef.current.quaternion.slerp(s.finalQuat, 0.12)

      // Stable Rail-Anchored Chase Camera:
      // Camera stays anchored to the spline path with only subtle 25% lateral follow,
      // letting the airplane freely glide within the user's viewport without disorienting camera sway.
      const railPos = new THREE.Vector3()
      FLIGHT_CURVE.getPointAt(t, railPos)
      const camBack = 8.8
      const camUp = 3.4
      s.targetCam.copy(railPos)
        .addScaledVector(s.tangent, -camBack)
        .addScaledVector(WORLD_UP, camUp)
        .addScaledVector(s.binormal, localOffsetRef.current.x * 0.25)
      s.targetLook.copy(railPos)
        .addScaledVector(s.tangent, 7.0)
        .addScaledVector(s.binormal, localOffsetRef.current.x * 0.35)

      camPosRef.current.lerp(s.targetCam, 0.07)
      camLookRef.current.lerp(s.targetLook, 0.07)

      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      onProgressUpdate(t, s.pos, s.pos.y, BASE_CRUISE_SPEED * 100)
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 2. STATE: LANDING SEQUENCE (Cinematic Glide Slope onto Runway)
    // ──────────────────────────────────────────────────────────────────────────
    else if (flightMode === "LANDING" && activeAirstrip) {
      transitionTimeRef.current += safeDelta * 0.65 // ~1.8 seconds transition
      const progress = Math.min(transitionTimeRef.current, 1.0)
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1)

      s.touchdownPos.set(...activeAirstrip.touchdown)
      s.touchdownQuat.setFromAxisAngle(WORLD_UP, activeAirstrip.touchdownRotY)

      // Glide position from sky to touchdown
      s.pos.lerpVectors(landingStartPosRef.current, s.touchdownPos, ease)
      // Flare nose slightly before touchdown
      const flarePitch = Math.sin(ease * Math.PI) * 0.15
      s.targetQuat.copy(landingStartQuatRef.current).slerp(s.touchdownQuat, ease)

      groupRef.current.position.copy(s.pos)
      groupRef.current.quaternion.copy(s.targetQuat)

      // Smooth camera transition into station inspection view
      s.targetCam.set(...activeAirstrip.cameraPos)
      s.targetLook.set(...activeAirstrip.cameraLookAt)

      camPosRef.current.lerp(s.targetCam, 0.06)
      camLookRef.current.lerp(s.targetLook, 0.06)

      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      onProgressUpdate(progressRef.current, s.pos, s.pos.y, (1 - ease) * 15)

      if (progress >= 1.0) {
        onLandingComplete()
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 3. STATE: INSPECTING (Station Modal Open, Plane Parked)
    // ──────────────────────────────────────────────────────────────────────────
    else if (flightMode === "INSPECTING" && activeAirstrip) {
      s.touchdownPos.set(...activeAirstrip.touchdown)
      s.touchdownQuat.setFromAxisAngle(WORLD_UP, activeAirstrip.touchdownRotY)

      groupRef.current.position.copy(s.touchdownPos)
      groupRef.current.quaternion.copy(s.touchdownQuat)

      // Subtle atmospheric orbit breathing around station
      s.targetCam.set(...activeAirstrip.cameraPos)
      s.targetLook.set(...activeAirstrip.cameraLookAt)

      camPosRef.current.lerp(s.targetCam, 0.05)
      camLookRef.current.lerp(s.targetLook, 0.05)

      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 4. STATE: TAKEOFF SEQUENCE (Runway Roll & Climb back to Spline)
    // ──────────────────────────────────────────────────────────────────────────
    else if (flightMode === "TAKEOFF" && activeAirstrip) {
      transitionTimeRef.current += safeDelta * 0.55 // ~2.0 seconds takeoff
      const progress = Math.min(transitionTimeRef.current, 1.0)
      const ease = THREE.MathUtils.smoothstep(progress, 0, 1)

      // Target re-entry point on the spline slightly ahead of approach
      const reentryT = (activeAirstrip.approachT + 0.07) % 1.0
      progressRef.current = reentryT

      const reentryPos = new THREE.Vector3()
      const reentryTangent = new THREE.Vector3()
      FLIGHT_CURVE.getPointAt(reentryT, reentryPos)
      FLIGHT_CURVE.getTangentAt(reentryT, reentryTangent).normalize()

      // Calculate climb arc
      s.pos.lerpVectors(landingStartPosRef.current, reentryPos, ease)
      s.pos.y += Math.sin(ease * Math.PI) * 2.0 // Climb altitude arch

      // Orient aircraft upward during climb
      s.rotMatrix.lookAt(new THREE.Vector3(0, 0, 0), reentryTangent, WORLD_UP)
      s.targetQuat.setFromRotationMatrix(s.rotMatrix)

      groupRef.current.position.copy(s.pos)
      groupRef.current.quaternion.slerp(s.targetQuat, 0.1)

      // Return camera to chase position
      const camBack = 8.5
      const camUp = 3.2
      s.targetCam.copy(s.pos)
        .addScaledVector(reentryTangent, -camBack)
        .addScaledVector(WORLD_UP, camUp)
      s.targetLook.copy(s.pos).addScaledVector(reentryTangent, 6.0)

      camPosRef.current.lerp(s.targetCam, 0.06)
      camLookRef.current.lerp(s.targetLook, 0.06)

      camera.position.copy(camPosRef.current)
      camera.lookAt(camLookRef.current)

      onProgressUpdate(progressRef.current, s.pos, s.pos.y, ease * 35)

      if (progress >= 1.0) {
        onTakeoffComplete()
      }
    }

    // ──────────────────────────────────────────────────────────────────────────
    // 5. UPDATE WINGTIP EMITTER WORLD POSITIONS FOR CONTRAILS
    // ──────────────────────────────────────────────────────────────────────────
    if (groupRef.current) {
      leftWingWorldPos.current.set(-2.6, 0.08, 0.1).applyMatrix4(groupRef.current.matrixWorld)
      rightWingWorldPos.current.set(2.6, 0.08, 0.1).applyMatrix4(groupRef.current.matrixWorld)
    }
  })

  return (
    <>
      <group ref={groupRef}>
        <AircraftMesh />
      </group>
      {/* Contrail streamers behind the wings */}
      <WingtipTrails leftWingPos={leftWingWorldPos} rightWingPos={rightWingWorldPos} />
    </>
  )
}
