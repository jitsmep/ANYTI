"use client"

import React, { Suspense, useCallback, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Physics } from "@react-three/rapier"
import { Sky, Stars } from "@react-three/drei"
import * as THREE from "three"
import Vehicle from "./Vehicle"
import World from "./World"
import Station from "./Station"
import ContentModal from "./ContentModal"
import HUD from "./HUD"
import { STATIONS } from "./data/stations"
import type { StationId } from "./data/stations"

// ── Loading screen ─────────────────────────────────────────────────────────
function LoadingScreen() {
  return (
    <div className="scene-loading">
      <div className="scene-loading-spinner" />
      <p>Loading 3D World…</p>
    </div>
  )
}

interface SceneProps {
  touchKeys?: {
    forward: boolean
    backward: boolean
    left: boolean
    right: boolean
    action: boolean
  }
}

export default function Scene({ touchKeys }: SceneProps) {
  const vehiclePosRef = useRef(new THREE.Vector3(0, 0, 0))
  const [vehiclePosState, setVehiclePosState] = useState({ x: 0, z: 0 })
  const [nearStation, setNearStation] = useState<StationId | null>(null)
  const [openStation, setOpenStation] = useState<StationId | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // Called every frame from Vehicle
  const handlePositionUpdate = useCallback((pos: THREE.Vector3) => {
    vehiclePosRef.current.copy(pos)

    // Proximity check (done in JS, not hook, to avoid stale closure issues in R3F)
    let found: StationId | null = null
    for (const s of STATIONS) {
      const dx = pos.x - s.position[0]
      const dz = pos.z - s.position[2]
      if (Math.sqrt(dx * dx + dz * dz) < s.triggerRadius) {
        found = s.id
        break
      }
    }
    setNearStation(found)

    // Update minimap every ~10 frames
    setVehiclePosState((prev) => {
      if (Math.abs(prev.x - pos.x) > 0.5 || Math.abs(prev.z - pos.z) > 0.5) {
        return { x: pos.x, z: pos.z }
      }
      return prev
    })
  }, [])

  // Keyboard Enter to open station
  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Enter" && nearStation && !modalOpen) {
        setOpenStation(nearStation)
        setModalOpen(true)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [nearStation, modalOpen])

  // Touch action button also opens modal
  const prevTouchAction = useRef(false)
  React.useEffect(() => {
    if (!touchKeys) return
    if (touchKeys.action && !prevTouchAction.current && nearStation && !modalOpen) {
      setOpenStation(nearStation)
      setModalOpen(true)
    }
    prevTouchAction.current = touchKeys.action
  }, [touchKeys, nearStation, modalOpen])

  const closeModal = useCallback(() => {
    setModalOpen(false)
    setOpenStation(null)
  }, [])

  return (
    <div className="scene-root">
      <Suspense fallback={<LoadingScreen />}>
        <Canvas
          shadows
          camera={{ fov: 50, near: 0.1, far: 300 }}
          gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
          className="scene-canvas"
        >
          {/* Lighting */}
          <ambientLight intensity={0.6} color="#e0e7ff" />
          <directionalLight
            position={[20, 30, 10]}
            intensity={1.2}
            castShadow
            shadow-mapSize={[2048, 2048]}
            shadow-camera-left={-40}
            shadow-camera-right={40}
            shadow-camera-top={40}
            shadow-camera-bottom={-40}
            color="#fff8e7"
          />
          <directionalLight position={[-10, 20, -10]} intensity={0.3} color="#c7d2fe" />

          {/* Sky & Stars */}
          <Sky
            sunPosition={[100, 20, 100]}
            inclination={0.35}
            azimuth={0.25}
            turbidity={8}
            rayleigh={0.5}
          />
          <Stars radius={80} depth={40} count={800} factor={3} saturation={0} fade />

          {/* Physics world */}
          <Physics gravity={[0, -30, 0]} timeStep="vary">
            <World />
            <Vehicle
              isPaused={modalOpen}
              onPositionUpdate={handlePositionUpdate}
              touchKeys={touchKeys}
            />
            {STATIONS.map((station) => (
              <Station
                key={station.id}
                def={station}
                isNear={nearStation === station.id}
                onEnter={() => {
                  setOpenStation(station.id)
                  setModalOpen(true)
                }}
              />
            ))}

            {/* HUD (HTML overlay via Drei) */}
            <HUD
              nearStation={nearStation}
              vehiclePos={vehiclePosState}
              onEnter={() => {
                if (nearStation) {
                  setOpenStation(nearStation)
                  setModalOpen(true)
                }
              }}
            />
          </Physics>
        </Canvas>
      </Suspense>

      {/* 2D content modal — rendered OUTSIDE canvas */}
      <ContentModal stationId={openStation} onClose={closeModal} />
    </div>
  )
}
