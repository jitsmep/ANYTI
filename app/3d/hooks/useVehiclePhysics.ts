"use client"

import { useCallback, useRef } from "react"
import type { RapierRigidBody } from "@react-three/rapier"
import * as THREE from "three"
import type { KeyboardState } from "./useKeyboard"

const MAX_FORWARD_SPEED = 14     // m/s (~50 km/h arcade speed)
const MAX_REVERSE_SPEED = 8      // m/s
const ACCELERATION = 28          // m/s^2 acceleration rate
const DECELERATION = 35          // m/s^2 braking/coasting rate
const STEER_SPEED = 2.8          // radians/s turning speed

/**
 * Returns a tick function to be called inside useFrame.
 * Controls vehicle linear velocity and heading rotation cleanly.
 */
export function useVehiclePhysics(
  rigidBodyRef: React.MutableRefObject<RapierRigidBody | null>,
  carRotationRef: React.MutableRefObject<number>,
  getKeys: () => KeyboardState,
  isPaused: boolean,
) {
  const currentSpeedRef = useRef(0)

  const tick = useCallback(
    (delta: number) => {
      const rb = rigidBodyRef.current
      if (!rb || isPaused) {
        if (rb && isPaused) {
          rb.setLinvel({ x: 0, y: 0, z: 0 }, true)
          rb.setAngvel({ x: 0, y: 0, z: 0 }, true)
          currentSpeedRef.current = 0
        }
        return
      }

      const { forward, backward, left, right } = getKeys()

      // Target speed based on input keys
      let targetSpeed = 0
      if (forward && !backward) {
        targetSpeed = MAX_FORWARD_SPEED
      } else if (backward && !forward) {
        targetSpeed = -MAX_REVERSE_SPEED
      }

      // Smoothly update speed towards targetSpeed
      let speed = currentSpeedRef.current
      if (speed < targetSpeed) {
        speed = Math.min(targetSpeed, speed + ACCELERATION * delta)
      } else if (speed > targetSpeed) {
        speed = Math.max(targetSpeed, speed - DECELERATION * delta)
      }
      currentSpeedRef.current = speed

      // Steering – adjust heading angle
      if (Math.abs(speed) > 0.05 || forward || backward) {
        const steerDir = (left ? 1 : 0) - (right ? 1 : 0)
        if (steerDir !== 0) {
          const dirMult = speed < -0.1 ? -1 : 1
          carRotationRef.current += steerDir * STEER_SPEED * dirMult * delta

          // Update rigid body rotation
          const q = new THREE.Quaternion().setFromAxisAngle(
            new THREE.Vector3(0, 1, 0),
            carRotationRef.current,
          )
          rb.setRotation(q, true)
        }
      }

      // Apply linear velocity along current heading
      const rotation = carRotationRef.current
      const fwdX = Math.sin(rotation)
      const fwdZ = Math.cos(rotation)

      const linvel = rb.linvel()

      // Preserve vertical Y velocity so gravity still applies
      rb.setLinvel(
        {
          x: fwdX * speed,
          y: linvel.y,
          z: fwdZ * speed,
        },
        true,
      )

      rb.wakeUp()
    },
    [rigidBodyRef, carRotationRef, getKeys, isPaused],
  )

  return tick
}
