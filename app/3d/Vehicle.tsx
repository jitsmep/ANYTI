"use client"

import React, { useRef, useEffect } from "react"
import { useFrame } from "@react-three/fiber"
import { RigidBody } from "@react-three/rapier"
import * as THREE from "three"
import { useKeyboard } from "./hooks/useKeyboard"
import { useVehiclePhysics } from "./hooks/useVehiclePhysics"
import type { RapierRigidBody } from "@react-three/rapier"

interface VehicleProps {
  isPaused: boolean
  onPositionUpdate: (pos: THREE.Vector3) => void
  /** External touch-controls override */
  touchKeys?: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    action: boolean
  }
}

const CAR_BODY_COLOR = "#7c3aed"
const CAR_CAB_COLOR = "#a78bfa"
const WHEEL_COLOR = "#1e1b4b"
const CAR_ACCENT_COLOR = "#f59e0b"

// Camera offset in car-local space (elevated isometric)
const CAM_HEIGHT = 14
const CAM_BACK = 10
const CAM_LERP = 0.06

export default function Vehicle({ isPaused, onPositionUpdate, touchKeys }: VehicleProps) {
  const rigidBodyRef = useRef<RapierRigidBody>(null)
  const meshRef = useRef<THREE.Group>(null)
  const carRotationRef = useRef(0)
  const cameraTargetRef = useRef(new THREE.Vector3(0, CAM_HEIGHT, CAM_BACK))
  const cameraLookRef = useRef(new THREE.Vector3(0, 0, 0))

  const keyboardKeys = useKeyboard()
  const touchKeysRef = useRef(touchKeys)
  touchKeysRef.current = touchKeys

  const getEffectiveKeys = React.useCallback(() => {
    const k = keyboardKeys.current
    const t = touchKeysRef.current
    return {
      forward: k.forward || Boolean(t?.forward),
      backward: k.backward || Boolean(t?.backward),
      left: k.left || Boolean(t?.left),
      right: k.right || Boolean(t?.right),
      action: k.action || Boolean(t?.action),
    }
  }, [keyboardKeys])

  const physicsTick = useVehiclePhysics(rigidBodyRef, carRotationRef, getEffectiveKeys, isPaused)

  useFrame(({ camera }, delta) => {
    physicsTick(delta)

    const rb = rigidBodyRef.current
    if (!rb) return

    const translation = rb.translation()
    const pos = new THREE.Vector3(translation.x, translation.y, translation.z)

    // Rotate mesh to match car heading
    if (meshRef.current) {
      meshRef.current.position.copy(pos)
      meshRef.current.rotation.y = carRotationRef.current
    }

    // Update parent with position for proximity checks
    onPositionUpdate(pos)

    // Smooth isometric camera follow
    const sin = Math.sin(carRotationRef.current)
    const cos = Math.cos(carRotationRef.current)
    const targetCamX = pos.x - sin * CAM_BACK
    const targetCamZ = pos.z - cos * CAM_BACK
    const targetCamY = pos.y + CAM_HEIGHT

    cameraTargetRef.current.lerp(
      new THREE.Vector3(targetCamX, targetCamY, targetCamZ),
      CAM_LERP,
    )
    cameraLookRef.current.lerp(pos, CAM_LERP)

    camera.position.copy(cameraTargetRef.current)
    camera.lookAt(cameraLookRef.current)
  })

  // Wheel positions relative to car body
  const wheelOffsets: [number, number, number][] = [
    [-0.9, -0.3, 1.1],
    [0.9, -0.3, 1.1],
    [-0.9, -0.3, -1.1],
    [0.9, -0.3, -1.1],
  ]

  return (
    <>
      {/* Physics body — invisible collider */}
      <RigidBody
        ref={rigidBodyRef}
        colliders="cuboid"
        restitution={0.1}
        friction={0}
        linearDamping={0}
        angularDamping={0}
        enabledRotations={[false, true, false]}
        canSleep={false}
        position={[0, 0.5, 0]}
      >
        {/* Invisible physics collider box */}
        <mesh visible={false}>
          <boxGeometry args={[1.8, 0.8, 3.6]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>

      {/* Visual car mesh (no physics) */}
      <group ref={meshRef}>
        {/* Car body */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[1.8, 0.5, 3.6]} />
          <meshStandardMaterial color={CAR_BODY_COLOR} flatShading />
        </mesh>

        {/* Car cab / roof */}
        <mesh castShadow position={[0, 0.75, -0.2]}>
          <boxGeometry args={[1.4, 0.55, 2]} />
          <meshStandardMaterial color={CAR_CAB_COLOR} flatShading />
        </mesh>

        {/* Windshield glow strip */}
        <mesh position={[0, 0.75, 0.82]}>
          <boxGeometry args={[1.38, 0.5, 0.05]} />
          <meshStandardMaterial color="#bfdbfe" emissive="#bfdbfe" emissiveIntensity={0.6} flatShading />
        </mesh>

        {/* Headlights */}
        <mesh position={[-0.55, 0.3, 1.81]}>
          <boxGeometry args={[0.35, 0.18, 0.06]} />
          <meshStandardMaterial color={CAR_ACCENT_COLOR} emissive={CAR_ACCENT_COLOR} emissiveIntensity={1} />
        </mesh>
        <mesh position={[0.55, 0.3, 1.81]}>
          <boxGeometry args={[0.35, 0.18, 0.06]} />
          <meshStandardMaterial color={CAR_ACCENT_COLOR} emissive={CAR_ACCENT_COLOR} emissiveIntensity={1} />
        </mesh>

        {/* Taillights */}
        <mesh position={[-0.55, 0.3, -1.81]}>
          <boxGeometry args={[0.35, 0.18, 0.06]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>
        <mesh position={[0.55, 0.3, -1.81]}>
          <boxGeometry args={[0.35, 0.18, 0.06]} />
          <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
        </mesh>

        {/* Wheels */}
        {wheelOffsets.map(([x, y, z], i) => (
          <mesh
            key={i}
            position={[x, y, z]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.38, 0.38, 0.28, 8]} />
            <meshStandardMaterial color={WHEEL_COLOR} flatShading />
          </mesh>
        ))}
      </group>
    </>
  )
}
